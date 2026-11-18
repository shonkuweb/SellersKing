import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const clean = val => (val || '').replace(/^["']|["']$/g, '').trim();

export function getR2Config() {
  const accountId = clean(process.env.R2_ACCOUNT_ID) || 'd098e896b8f7dc0403ad3a16f592dfe6';
  const accessKeyId = clean(process.env.R2_ACCESS_KEY_ID) || 'f95b6dce449f4bb721ce54aa3b2f4e2b';
  const secretAccessKey = clean(process.env.R2_SECRET_ACCESS_KEY) || '401cb76e46f0f908fcd78b5b2fbd75e92a4bbc1d26adbffbb3c37ef14fcc2ca1';
  const bucket = clean(process.env.R2_BUCKET_NAME) || 'chf-media';
  const publicUrl = clean(process.env.R2_PUBLIC_URL) || 'https://pub-ce8688bc6c654bcfb99716f7c9373bcd.r2.dev';

  const isConfigured = Boolean(accountId && accessKeyId && secretAccessKey);
  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl: publicUrl.replace(/\/$/, ''), isConfigured };
}

let s3ClientInstance = null;
export function getR2Client() {
  const config = getR2Config();
  if (!config.isConfigured) return null;
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }
  return s3ClientInstance;
}

export async function uploadToR2(buffer, key, contentType = 'image/jpeg') {
  const config = getR2Config();
  const client = getR2Client();
  if (!client) throw new Error('Cloudflare R2 is not configured.');

  const cleanKey = key.replace(/^\/+/, '');
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: cleanKey,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return `${config.publicUrl}/${cleanKey}`;
}

export async function uploadDataUrlToR2(dataUrl, folder = 'sellersking/uploads', baseName = 'image') {
  if (!dataUrl || typeof dataUrl !== 'string') return dataUrl;

  // Support all standard image MIME types, case-insensitive, optional params, and multi-line base64
  const match = /^data:(image\/[a-zA-Z0-9.+_-]+)(?:;[a-zA-Z0-9=_-]+)*;base64,([\s\S]+)$/i.exec(dataUrl.trim());
  if (!match) return dataUrl; // Not a base64 data URL, return as-is

  const contentType = match[1].toLowerCase();
  let ext = 'jpg';
  if (contentType.includes('png')) ext = 'png';
  else if (contentType.includes('webp')) ext = 'webp';
  else if (contentType.includes('gif')) ext = 'gif';
  else if (contentType.includes('svg')) ext = 'svg';
  else if (contentType.includes('avif')) ext = 'avif';

  const base64Data = match[2].replace(/\s+/g, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const safeBaseName = (baseName || 'image').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanFolder = (folder || 'sellersking/uploads').replace(/^\/+|\/+$/g, '');
  const key = `${cleanFolder}/${safeBaseName}_${Date.now()}.${ext}`;
  return uploadToR2(buffer, key, contentType);
}
