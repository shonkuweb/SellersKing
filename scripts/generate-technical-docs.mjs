import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

// --- Color Palette (Corporate Modern E-Commerce: Navy, Royal Blue, Slate & Cyan) ---
const C = {
  primary: '#0f172a',      // Slate 900 (Deep Navy / Carbon)
  secondary: '#1e3a8a',    // Blue 900 (Corporate Royal Indigo)
  accent: '#2563eb',       // Blue 600 (Vibrant Brand Blue)
  accentLight: '#dbeafe',  // Blue 100 (Soft Sky Tint)
  accentBg: '#f0f7ff',     // Blue 50 (Very Light Background Tint)
  dark: '#0f172a',         // Charcoal Heading
  text: '#334155',         // Slate 700 Body Text
  muted: '#64748b',        // Slate 500 Metadata
  border: '#cbd5e1',       // Slate 300 Divider
  cardBg: '#f8fafc',       // Slate 50 Neutral Card
  cardBorder: '#e2e8f0',   // Slate 200 Card Border
  white: '#ffffff',
  highlight: '#b45309',    // Warm Amber
  highlightBg: '#fef3c7',  // Amber Tint
  codeBg: '#0f172a',       // Code Editor Slate
  codeText: '#38bdf8',     // Sky Blue Code Text
  success: '#16a34a',      // Emerald Green
  successBg: '#f0fdf4',
};

// --- Fonts & Assets ---
const fontsDir = path.join(process.cwd(), 'public/fonts');
const fontRegular = fs.readFileSync(path.join(fontsDir, 'NotoSans-Regular.ttf'));
const fontBold = fs.readFileSync(path.join(fontsDir, 'NotoSans-Bold.ttf'));
const logoPath = path.join(process.cwd(), 'public/images/sellersking-logo.png');

const outputFile = path.join(process.cwd(), 'SellersKing_Technical_Documentation.pdf');

console.log('Generating Technical Documentation PDF for SellersKing...');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 42, left: 40, right: 40 },
  bufferPages: true,
  info: {
    Title: 'SellersKing - Technical Documentation & System Architecture',
    Author: 'ShonkuWEB Technologies (Jit D & Isha Karmakar)',
    Subject: 'E-Commerce Platform Technical Reference, System Architecture & Developer Guide',
    Keywords: 'Next.js 15, React 19, SQLite, Prisma 7, Razorpay, Cloudflare R2, Architecture, E-commerce, Flipkart, Amazon',
    Creator: 'ShonkuWEB Technologies (Developed by Jit D, Designed by Isha Karmakar)'
  }
});

doc.registerFont('Regular', fontRegular);
doc.registerFont('Bold', fontBold);

const writeStream = fs.createWriteStream(outputFile);
doc.pipe(writeStream);

const pageWidth = doc.page.width;
const pageHeight = doc.page.height;
const contentWidth = pageWidth - 80; // 515.28 pt

// --- Layout Helpers ---
function startNewPage() {
  doc.addPage();
  doc.y = 56;
}

function ensureSpace(neededHeight) {
  if (doc.y + neededHeight > pageHeight - 50) {
    startNewPage();
  }
}

function drawSectionHeader(numberStr, title, subtitle) {
  ensureSpace(subtitle ? 50 : 38);
  doc.moveDown(0.2);
  const startY = doc.y;

  doc.roundedRect(40, startY, contentWidth, 25, 4).fill(C.accentBg);
  doc.rect(40, startY, 4, 25).fill(C.accent);

  doc.font('Bold').fontSize(11.5).fillColor(C.secondary);
  doc.text(`${numberStr}  ${title.toUpperCase()}`, 52, startY + 5.5, { width: contentWidth - 24, lineBreak: false });

  doc.y = startY + 29;

  if (subtitle) {
    doc.font('Regular').fontSize(8.5).fillColor(C.muted);
    doc.text(subtitle, 40, doc.y, { width: contentWidth });
    doc.moveDown(0.3);
  }
}

function drawSubSection(title) {
  ensureSpace(32);
  doc.moveDown(0.3);
  const y = doc.y;
  doc.circle(44, y + 5.5, 2.5).fill(C.accent);
  doc.font('Bold').fontSize(10).fillColor(C.secondary);
  doc.text(title, 52, y, { width: contentWidth - 14, lineBreak: false });
  doc.y = y + 15;
}

function drawParagraph(text, options = {}) {
  ensureSpace(20);
  doc.font('Regular').fontSize(options.fontSize || 8.5).fillColor(options.color || C.text);
  doc.text(text, doc.x, doc.y, {
    width: options.width || contentWidth,
    align: options.align || 'left',
    lineGap: options.lineGap || 2
  });
  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.25);
}

function drawBullet(label, desc) {
  ensureSpace(18);
  const startY = doc.y;
  doc.font('Bold').fontSize(8.2).fillColor(C.secondary);
  doc.text('• ' + label + ': ', 46, startY, { continued: true });
  doc.font('Regular').fontSize(8.2).fillColor(C.text);
  doc.text(desc, { width: contentWidth - 16, lineGap: 1.8 });
  doc.moveDown(0.2);
}

function drawCard(title, items, options = {}) {
  const cardPadding = 7;
  const itemHeight = options.compact ? 12 : 14;
  const titleHeight = title ? 18 : 6;
  const cardHeight = (items.length * itemHeight) + titleHeight + (cardPadding * 2) + (options.extraHeight || 0);

  ensureSpace(cardHeight + 4);

  const startY = doc.y;
  doc.roundedRect(40, startY, contentWidth, cardHeight, 5)
     .fillAndStroke(options.bg || C.cardBg, options.border || C.cardBorder);

  let curY = startY + cardPadding;
  if (title) {
    doc.font('Bold').fontSize(9).fillColor(C.secondary);
    doc.text(title, 50, curY, { lineBreak: false });
    curY += 13;
    doc.moveTo(50, curY - 2).lineTo(40 + contentWidth - 10, curY - 2).strokeColor(C.border).lineWidth(0.5).stroke();
    curY += 4;
  }

  items.forEach(item => {
    doc.font('Bold').fontSize(7.8).fillColor(C.secondary);
    doc.text(item.label + ': ', 50, curY, { continued: true, lineBreak: false });
    doc.font('Regular').fontSize(7.8).fillColor(C.text);
    doc.text(item.value, { width: contentWidth - 25, lineBreak: false });
    curY += itemHeight;
  });

  doc.y = startY + cardHeight + (options.bottomGap || 6);
}

function drawTable(headers, rows, colWidths, options = {}) {
  const rowHeight = options.rowHeight || 16;
  let curY = doc.y;
  const startX = 40;

  if (curY + rowHeight * 2 > pageHeight - 50) {
    startNewPage();
    curY = doc.y;
  }

  // Header Row
  doc.roundedRect(startX, curY, contentWidth, rowHeight, 3).fill(C.secondary);
  let curX = startX;
  headers.forEach((h, idx) => {
    doc.font('Bold').fontSize(7.8).fillColor(C.white);
    doc.text(h, curX + 5, curY + 4, { width: colWidths[idx] - 10, align: 'left', lineBreak: false });
    curX += colWidths[idx];
  });
  curY += rowHeight;

  // Data Rows
  rows.forEach((row, rIdx) => {
    if (curY + rowHeight > pageHeight - 50) {
      startNewPage();
      curY = doc.y;

      doc.roundedRect(startX, curY, contentWidth, rowHeight, 3).fill(C.secondary);
      let rX = startX;
      headers.forEach((h, idx) => {
        doc.font('Bold').fontSize(7.8).fillColor(C.white);
        doc.text(h, rX + 5, curY + 4, { width: colWidths[idx] - 10, align: 'left', lineBreak: false });
        rX += colWidths[idx];
      });
      curY += rowHeight;
    }

    const rowBg = rIdx % 2 === 0 ? C.white : C.cardBg;
    doc.rect(startX, curY, contentWidth, rowHeight).fillAndStroke(rowBg, C.cardBorder);

    let cellX = startX;
    row.forEach((cell, cIdx) => {
      const isBold = cIdx === 0 && options.boldFirstCol;
      doc.font(isBold ? 'Bold' : 'Regular').fontSize(7.2).fillColor(isBold ? C.dark : C.text);
      doc.text(String(cell), cellX + 5, curY + 3.8, { width: colWidths[cIdx] - 10, ellipsis: true, lineBreak: false });
      cellX += colWidths[cIdx];
    });
    curY += rowHeight;
  });

  doc.y = curY + (options.bottomGap || 6);
}

// =========================================================================
// PAGE 1: HERO HEADER, MANDATORY ATTRIBUTION, METADATA & SECTION 1
// =========================================================================

// Top decorative brand bar
doc.rect(0, 0, pageWidth, 6).fill(C.accent);

// Header Logo & Branding Container
const headerBoxY = 22;
doc.roundedRect(40, headerBoxY, contentWidth, 102, 7)
   .fillAndStroke(C.accentBg, C.accentLight);

// Display Official Website Logo
if (fs.existsSync(logoPath)) {
  doc.image(logoPath, 50, headerBoxY + 14, { width: 140 });
}

// Document Titles
doc.font('Bold').fontSize(16).fillColor(C.primary);
doc.text('SELLERSKING INFOTECH PVT. LTD.', 204, headerBoxY + 12);

doc.font('Bold').fontSize(10.5).fillColor(C.accent);
doc.text('TECHNICAL DOCUMENTATION & SYSTEM ARCHITECTURE', 204, headerBoxY + 31);

doc.font('Regular').fontSize(8).fillColor(C.muted);
doc.text('Enterprise E-Commerce Platform • Technical Reference & Engineering Blueprint', 204, headerBoxY + 46);

// MANDATORY DEVELOPER & DESIGNER ATTRIBUTION BOX
doc.roundedRect(204, headerBoxY + 59, contentWidth - 172, 35, 4)
   .fillAndStroke(C.white, C.border);

doc.font('Bold').fontSize(7.8).fillColor(C.dark);
doc.text('DEVELOPED BY: ', 212, headerBoxY + 66, { continued: true });
doc.font('Bold').fontSize(7.8).fillColor(C.secondary);
doc.text('Co-Founder & Developer of ShonkuWEB JIT D');

doc.font('Bold').fontSize(7.8).fillColor(C.dark);
doc.text('DESIGNED BY: ', 212, headerBoxY + 79, { continued: true });
doc.font('Bold').fontSize(7.8).fillColor(C.secondary);
doc.text('Co-Founder & Designer Isha Karmakar');

doc.y = headerBoxY + 110;

// Project Quick Metadata Bar
const metaY = doc.y;
doc.roundedRect(40, metaY, contentWidth, 34, 4).fill(C.cardBg).stroke(C.cardBorder);

const metaCols = [
  { label: 'SOURCE REPOSITORY', val: 'https://github.com/shonkuweb/SellersKing.git' },
  { label: 'PLATFORM STACK', val: 'Next.js 15.5 • React 19 • Prisma 7 • SQLite' },
  { label: 'VERSION STATUS', val: 'Production Complete (Tested & Verified)' },
  { label: 'ORGANIZATION', val: 'ShonkuWEB Technologies' },
];

const colW = contentWidth / 4;
metaCols.forEach((m, idx) => {
  doc.font('Bold').fontSize(6.2).fillColor(C.muted);
  doc.text(m.label, 47 + idx * colW, metaY + 6);
  doc.font('Bold').fontSize(7.2).fillColor(C.secondary);
  doc.text(m.val, 47 + idx * colW, metaY + 16, { width: colW - 10 });
});

doc.y = metaY + 40;

// SECTION 1: PROJECT OVERVIEW & SOURCE CONTROL
drawSectionHeader('1', 'Project Overview & Repository Governance', 'Core business identity, technical scope, and source control governance.');

drawParagraph(
  'SellersKing (operated by Sellersking Infotech PVT. LTD.) is an enterprise-grade digital e-commerce platform built to match modern online marketplace standards (such as Flipkart and Amazon). Engineered from first principles, the platform guarantees sub-second page delivery, zero-trust transactional security, persistent database resilience via embedded SQLite WAL mode, and seamless responsiveness across desktop, tablet, and mobile touchpoints.'
);

drawCard('Source Code Repository & Version Control Governance', [
  { label: 'Official GitHub Repository', value: 'https://github.com/shonkuweb/SellersKing.git' },
  { label: 'Production Branch', value: 'main (Protected, verified via automated test suite and Next.js production build)' },
  { label: 'Engineering Authorship', value: 'ShonkuWEB Technologies (Jit D, Co-Founder & Developer; Isha Karmakar, Co-Founder & Designer)' },
  { label: 'Company Entity', value: 'Sellersking Infotech PVT. LTD. (Support: support@sellersking.com, WhatsApp: +91 86370 54105)' },
  { label: 'Architecture Philosophy', value: 'Server-authoritative calculations, integer-paise financial precision, and embedded zero-latency persistence.' }
]);

drawSubSection('Core Engineering Pillars');
drawBullet('Server-Authoritative Pricing (Zero Client-Trust)', 'Client-submitted cart prices, shipping fees, or discount totals are never trusted. Every line item, variant option, and coupon code is recalculated exclusively on the server from the authoritative database.');
drawBullet('Integer-Paise Financial Math', 'All monetary balances, transactions, and invoice items are calculated in 64-bit integer paise (₹1 = 100 paise) to eliminate IEEE 754 floating-point inaccuracies.');
drawBullet('Sub-Millisecond SQLite with WAL Mode', 'Leverages better-sqlite3 with Write-Ahead Logging (WAL) for microsecond reads and concurrent transactions without the networking latency of standalone database servers.');
drawBullet('Variable Weight, Distance & Category Logistics', 'Delivery charges are dynamically computed based on physical/volumetric parcel weight, destination delivery distance (PIN code zones), and merchandise handling categories.');

// Key Project Metrics Summary Card
drawCard('System Architecture Metrics & Highlights', [
  { label: 'Prisma Relational Models', value: '11 Schema Models (Products, Categories, Orders, Customers, Affiliates, Analytics, Blogs)' },
  { label: 'Payment Gateway Integration', value: 'Razorpay UPI, Cards, NetBanking with dual HMAC-SHA256 signature and webhook capture' },
  { label: 'Media CDN Distribution', value: 'Cloudflare R2 Object Storage with S3-compatible API & zero-egress bandwidth fees' },
  { label: 'Session Cryptography', value: 'HMAC-SHA256 signed expiring session cookies with crypto.timingSafeEqual validation' }
], { bg: C.accentBg, border: C.accentLight });

// =========================================================================
// PAGE 2: TECHNOLOGY STACK & ARCHITECTURAL RATIONALE
// =========================================================================
startNewPage();

drawSectionHeader('2', 'Technology Stack & Engineering Decisions', 'Comprehensive inventory of technologies, frameworks, runtimes, and architectural rationale.');

drawParagraph(
  'Every technology choice across the SellersKing architecture was chosen to deliver peak operational speed, transactional reliability, low infrastructure maintenance, and high conversion e-commerce performance.'
);

const techHeaders = ['Layer', 'Technology / Package', 'Version', 'Strategic Rationale & Architectural Choice'];
const techRows = [
  ['Framework', 'Next.js (App Router)', 'v15.5.15', 'Server Components (RSC) for instantaneous page loading, dynamic route handlers, SEO.'],
  ['UI Runtime', 'React & React DOM', 'v19.1.0', 'Modern component lifecycle, concurrent transitions, streaming SSR, optimized DOM diffing.'],
  ['Database Engine', 'SQLite + better-sqlite3', 'v12.11.1', 'Zero network latency, single-file durability, high throughput concurrent reads with WAL.'],
  ['ORM & Client', 'Prisma ORM + Adapter', 'v7.8.0', 'Type-safe schema modeling, automated query generation, transactional integrity.'],
  ['Payment Gateway', 'Razorpay API & Webhook', 'REST / SDK', 'Reliable UPI, NetBanking, Debit/Credit Card checkout with HMAC-SHA256 verification.'],
  ['Cloud Storage', 'Cloudflare R2 Object Store', '@aws-sdk/s3', 'Zero-egress fee S3-compatible cloud bucket for high-resolution product media distribution.'],
  ['PDF Engine', 'PDFKit', 'v0.20.2', 'Serverless vector PDF generation supporting bilingual typography (Noto Sans Bengali & English).'],
  ['Image Processing', 'browser-image-compression', 'v2.0.2', 'Client-side pre-upload compression minimizing server payload bandwidth and upload latency.'],
  ['Icons & Styling', 'React Icons & Global CSS', 'v5.6.0', 'Zero CSS-in-JS runtime overhead; hand-crafted responsive CSS modules and theme variables.']
];

drawTable(techHeaders, techRows, [75, 115, 55, 270.28], { boldFirstCol: true, rowHeight: 18 });

drawSubSection('Strategic Architectural Rationale');

drawCard('1. Next.js 15 App Router & React 19 Server Components', [
  { label: 'Instant Initial Load', value: 'Storefront grids and product catalogs render on the server, streaming lightweight HTML with zero client hydration overhead for static viewports.' },
  { label: 'E-Commerce SEO', value: 'Automated sitemap.xml and robots.txt generation with full OpenGraph metadata for catalog discoverability on Google & Bing.' },
  { label: 'API Integration', value: 'Next.js API route handlers unify backend logic, webhooks, and administrative endpoints within a single cohesive deployment artifact.' }
]);

drawCard('2. SQLite with better-sqlite3 WAL Mode', [
  { label: 'Sub-Millisecond Speed', value: 'In-process database operations bypass TCP sockets entirely, delivering read latencies under 0.2ms.' },
  { label: 'Concurrent Traffic', value: 'Write-Ahead Logging (WAL) mode enables concurrent reads without blocking database writes during order placement.' },
  { label: 'Single-File Durability', value: 'Entire database lives in a persistent disk file (/data/dev.db), making disaster recovery, snapshotting, and migrations trivial.' }
]);

drawCard('3. Zero Client-Trust & Integer-Paise Financial Math', [
  { label: 'Tamper Protection', value: 'Clients transmit only product identifiers and chosen quantities; prices, tax, and shipping are computed exclusively server-side.' },
  { label: 'Zero Float Drift', value: 'Arithmetic on integer paise prevents catastrophic currency discrepancies common with IEEE 754 floating points.' },
  { label: 'Dual Verification', value: 'Confirmed orders require matching order ID, payment ID, captured amount, and valid HMAC-SHA256 webhook signatures.' }
]);

// =========================================================================
// PAGE 3: SYSTEM TOPOLOGY & TRANSACTION FLOW
// =========================================================================
startNewPage();

drawSectionHeader('3', 'System Architecture & Data Flow Blueprints', 'Visual topology diagrams detailing request lifecycles, payment capture, and order states.');

drawSubSection('3.1 End-to-End System Topology');

// DRAWING TOPOLOGY DIAGRAM
const diagY = doc.y;
const diagH = 150;
doc.roundedRect(40, diagY, contentWidth, diagH, 6).fillAndStroke(C.cardBg, C.border);

// Box 1: Clients
doc.roundedRect(50, diagY + 16, 82, 54, 4).fillAndStroke(C.white, C.secondary);
doc.font('Bold').fontSize(8).fillColor(C.secondary).text('CLIENT DEVICES', 54, diagY + 23, { width: 74, align: 'center' });
doc.font('Regular').fontSize(6.5).fillColor(C.text).text('Mobile Browsers\nDesktop & Tablets\nCustomer Portals', 54, diagY + 36, { width: 74, align: 'center' });

// Arrow 1 -> 2
doc.moveTo(132, diagY + 43).lineTo(158, diagY + 43).strokeColor(C.accent).lineWidth(1.5).stroke();
doc.polygon([158, diagY + 43], [153, diagY + 40], [153, diagY + 46]).fill(C.accent);

// Box 2: Edge CDN
doc.roundedRect(160, diagY + 16, 85, 54, 4).fillAndStroke(C.white, C.secondary);
doc.font('Bold').fontSize(8).fillColor(C.secondary).text('EDGE & REVERSE PROXY', 164, diagY + 23, { width: 77, align: 'center' });
doc.font('Regular').fontSize(6.5).fillColor(C.text).text('Nginx Reverse Proxy\nSSL/TLS 1.3 Termination\nAsset Caching', 164, diagY + 36, { width: 77, align: 'center' });

// Arrow 2 -> 3
doc.moveTo(245, diagY + 43).lineTo(271, diagY + 43).strokeColor(C.accent).lineWidth(1.5).stroke();
doc.polygon([271, diagY + 43], [266, diagY + 40], [266, diagY + 46]).fill(C.accent);

// Box 3: Application Server
doc.roundedRect(273, diagY + 10, 137, 130, 4).fillAndStroke(C.accentBg, C.secondary);
doc.font('Bold').fontSize(8.5).fillColor(C.secondary).text('NEXT.JS 15 RUNTIME SERVER', 278, diagY + 15, { width: 127, align: 'center' });

doc.roundedRect(280, diagY + 30, 123, 26, 3).fillAndStroke(C.white, C.border);
doc.font('Bold').fontSize(7).fillColor(C.accent).text('Storefront & UI Presentation', 282, diagY + 34, { width: 119, align: 'center' });
doc.font('Regular').fontSize(6).fillColor(C.text).text('Catalog, Collections, Admin, Cart', 282, diagY + 44, { width: 119, align: 'center' });

doc.roundedRect(280, diagY + 60, 123, 26, 3).fillAndStroke(C.white, C.border);
doc.font('Bold').fontSize(7).fillColor(C.accent).text('API Route Handlers & Security', 282, diagY + 64, { width: 119, align: 'center' });
doc.font('Regular').fontSize(6).fillColor(C.text).text('HMAC Sessions, Checkout, Webhooks', 282, diagY + 74, { width: 119, align: 'center' });

doc.roundedRect(280, diagY + 90, 123, 42, 3).fillAndStroke(C.white, C.border);
doc.font('Bold').fontSize(7).fillColor(C.accent).text('Core Business & Invoicing Engine', 282, diagY + 94, { width: 119, align: 'center' });
doc.font('Regular').fontSize(6).fillColor(C.text).text('Variable freight, discounts, regional PIN checks, bilingual PDFKit invoices', 282, diagY + 104, { width: 119, align: 'center' });

// Arrow 3 -> DB
doc.moveTo(410, diagY + 43).lineTo(434, diagY + 43).strokeColor(C.accent).lineWidth(1.5).stroke();
doc.polygon([434, diagY + 43], [429, diagY + 40], [429, diagY + 46]).fill(C.accent);

// Box 4: SQLite Database
doc.roundedRect(436, diagY + 16, 105, 54, 4).fillAndStroke(C.white, C.secondary);
doc.font('Bold').fontSize(8).fillColor(C.secondary).text('PRISMA & SQLITE DB', 440, diagY + 23, { width: 97, align: 'center' });
doc.font('Regular').fontSize(6.5).fillColor(C.text).text('better-sqlite3 Engine\nPersistent Host Disk\nWAL High-Concurrency', 440, diagY + 36, { width: 97, align: 'center' });

// Arrow 3 -> Cloudflare R2
doc.moveTo(410, diagY + 85).lineTo(434, diagY + 85).strokeColor(C.accent).lineWidth(1.5).stroke();
doc.polygon([434, diagY + 85], [429, diagY + 82], [429, diagY + 88]).fill(C.accent);

// Box 5: Cloudflare R2
doc.roundedRect(436, diagY + 74, 105, 28, 4).fillAndStroke(C.white, C.border);
doc.font('Bold').fontSize(7.5).fillColor(C.secondary).text('CLOUDFLARE R2 CDN', 440, diagY + 78, { width: 97, align: 'center' });
doc.font('Regular').fontSize(6).fillColor(C.muted).text('Catalog Media / S3 API', 440, diagY + 89, { width: 97, align: 'center' });

// Arrow 3 -> Razorpay
doc.moveTo(410, diagY + 120).lineTo(434, diagY + 120).strokeColor(C.accent).lineWidth(1.5).stroke();
doc.polygon([434, diagY + 120], [429, diagY + 117], [429, diagY + 123]).fill(C.accent);

// Box 6: Razorpay
doc.roundedRect(436, diagY + 108, 105, 28, 4).fillAndStroke(C.secondary);
doc.font('Bold').fontSize(7.5).fillColor(C.white).text('RAZORPAY GATEWAY', 440, diagY + 112, { width: 97, align: 'center' });
doc.font('Regular').fontSize(6).fillColor(C.accentLight).text('Orders API & Webhook Capture', 440, diagY + 123, { width: 97, align: 'center' });

doc.y = diagY + diagH + 12;

drawSubSection('3.2 Payment Verification & Two-Phase Transaction Pipeline');

const seqY = doc.y;
const seqH = 92;
doc.roundedRect(40, seqY, contentWidth, seqH, 6).fillAndStroke(C.cardBg, C.border);

const steps = [
  { num: '1', title: 'Cart Checkout', desc: 'Customer submits items, size/color variant & address.' },
  { num: '2', title: 'Server Quote', desc: 'DB price lookup, regional PIN check, coupon validation.' },
  { num: '3', title: 'Pending Order', desc: 'Atomic generation of SK-XXXX receipt & Razorpay order token.' },
  { num: '4', title: 'Payment Capture', desc: 'Customer completes UPI/Card; Razorpay triggers webhook.' },
  { num: '5', title: 'HMAC Verify', desc: 'Server verifies SHA256 signature and captures payment.' },
  { num: '6', title: 'Paid & Invoice', desc: 'Order status marked Paid; Bilingual PDF invoice synthesized.' },
];

const stepW = (contentWidth - 20) / 6;
steps.forEach((s, idx) => {
  const sx = 46 + idx * stepW;
  doc.circle(sx + 12, seqY + 16, 9).fill(C.accent);
  doc.font('Bold').fontSize(8).fillColor(C.white).text(s.num, sx + 8, seqY + 12, { width: 8, align: 'center' });

  doc.font('Bold').fontSize(7.5).fillColor(C.secondary).text(s.title, sx, seqY + 31, { width: stepW - 6, align: 'center' });
  doc.font('Regular').fontSize(6).fillColor(C.text).text(s.desc, sx, seqY + 43, { width: stepW - 6, align: 'center' });

  if (idx < 5) {
    doc.moveTo(sx + stepW - 6, seqY + 20).lineTo(sx + stepW + 2, seqY + 20).strokeColor(C.muted).lineWidth(1).stroke();
  }
});

doc.y = seqY + seqH + 12;

drawSubSection('3.3 Order Fulfillment State Lifecycle');

const states = [
  { state: 'Pending', desc: 'Order reserved; awaiting online payment verification.', color: C.muted },
  { state: 'Confirmed', desc: 'Payment verified via HMAC webhook; stock reserved.', color: C.secondary },
  { state: 'Item Selection', desc: 'Warehouse team inspects and prepares items from inventory.', color: '#0284c7' },
  { state: 'Packaging', desc: 'Shockproof protective carton cushioning & sealing.', color: '#b45309' },
  { state: 'Dispatched', desc: 'Handed over to courier with consignment tracking code.', color: '#7c3aed' },
  { state: 'Delivered', desc: 'Consignment successfully handed over to customer.', color: C.success }
];

const stateW = (contentWidth - 10) / 6;
const stY = doc.y;
states.forEach((st, idx) => {
  const bx = 42 + idx * stateW;
  doc.roundedRect(bx, stY, stateW - 6, 42, 4).fillAndStroke(C.white, st.color);
  doc.font('Bold').fontSize(7.5).fillColor(st.color).text(st.state, bx + 2, stY + 6, { width: stateW - 10, align: 'center' });
  doc.font('Regular').fontSize(5.5).fillColor(C.text).text(st.desc, bx + 2, stY + 18, { width: stateW - 10, align: 'center' });
});

doc.y = stY + 50;

// =========================================================================
// PAGE 4: DETAILED SUBSYSTEMS & BUSINESS RULES
// =========================================================================
startNewPage();

drawSectionHeader('4', 'Detailed Subsystem Engineering & Business Rules', 'In-depth specification of storefront components, logistics rules, and security.');

drawSubSection('4.1 Variable Shipping & Delivery Charges Engine');
drawParagraph(
  'In accordance with marketplace standards, SellersKing does not employ artificial fixed shipping rates. Delivery charges are calculated dynamically based on three specific parameters:'
);
drawBullet('Product Weight & Volumetric Mass', 'Calculated from the total deadweight and cubic dimensions of the ordered goods. Bulkier items incur proportional freight fees.');
drawBullet('Delivery Distance & Zonal Logistics', 'Calculated from the fulfillment center origin to the destination postal PIN code, categorised across Local, Regional, Metro, and Out-of-Zone national sectors.');
drawBullet('Product Category Handling', 'High-value electronics, fragile goods, and heavy appliances require specialized protective cushioning, insurance, and handling.');

drawSubSection('4.2 Regional Shipping Whitelist Subsystem (lib/indian-regions.mjs)');
drawParagraph(
  'Certain specialized products can be restricted to specific states or PIN codes via Product.shippingScope, Product.deliveryStates, and Product.deliveryPincodes. During checkout (/api/checkout/create), the server matches customer postal codes against the configured scope and rejects checkout if an address is non-serviceable.'
);

drawSubSection('4.3 Dynamic Coupon & Discount Engine (lib/discounts.mjs)');
drawParagraph(
  'The discount subsystem calculates promotional vouchers and 51% threshold nudges. It supports percentage discounts (with optional maximum rupee caps) and flat rupee deductions, while validating minimum order requirements (minOrderValue) and product/category scope.'
);

drawSubSection('4.4 Multilingual Automated Vector Invoicing (lib/invoice.mjs)');
drawParagraph(
  'The invoicing engine utilizes PDFKit to synthesize on-demand branded invoices (downloadable via /api/admin/orders/[id]/invoice and order confirmation pages). To flawlessly render customer names, local Bengali delivery addresses, and rupee symbols, the engine embeds Google Noto Sans and Noto Sans Bengali fonts with automated font-fallback and dynamic multi-page layout balancing.'
);

drawSubSection('4.5 Cloudflare R2 Media Storage with Pre-Upload Optimization');
drawParagraph(
  'Image media is hosted on Cloudflare R2 object storage to ensure zero egress bandwidth charges. Uploads pass through lib/r2.mjs utilizing the AWS SDK S3 client. In the browser, browser-image-compression compresses uploaded photographs to under 800KB before transmission, safeguarding database responsiveness.'
);

drawSubSection('4.6 Security Architecture, RBAC & Cookie Integrity');
drawParagraph(
  'Administrative access (app/admin) and affiliate partner portals are guarded by HMAC-SHA256 signed expiring session cookies (lib/admin-session.mjs, lib/affiliate-session.mjs). Public customer order confirmation requires a 64-character SHA-256 hashed checkout ownership token (checkoutTokenHash), preventing order enumeration or unauthorized receipt exposure.'
);

// =========================================================================
// PAGE 5: DATABASE SCHEMA SPECIFICATION (PART 1)
// =========================================================================
startNewPage();

drawSectionHeader('5', 'Database Schema Specification (Part 1)', 'Data dictionary for core system configuration, product inventory, and hierarchical categories.');

drawParagraph(
  'SellersKing utilizes Prisma 7.8.0 with the @prisma/adapter-better-sqlite3 adapter. Below is the comprehensive data dictionary defining models, constraints, data types, and relational indexes.'
);

// MODEL 1: SETTINGS
drawSubSection('5.1 Settings Model (Key-Value Store)');
drawTable(
  ['Field', 'Type', 'Constraint', 'Description'],
  [
    ['key', 'String', '@id (Primary Key)', 'Configuration key (e.g. order_number_sequence, navbar_settings, homepage_hero_settings).'],
    ['value', 'String', 'Required', 'JSON-stringified configuration object or sequence counter integer value.']
  ],
  [100, 75, 110, 230.28],
  { boldFirstCol: true, rowHeight: 16 }
);

// MODEL 2: PRODUCT
drawSubSection('5.2 Product Model (Store Catalog & Inventory)');
drawTable(
  ['Field', 'Type', 'Constraint / Default', 'Description'],
  [
    ['id', 'String', '@id @default(uuid())', 'Unique UUID primary key identifier.'],
    ['slug', 'String', '@unique', 'SEO URL slug for product detail view (e.g. "wireless-headphones").'],
    ['title', 'String', 'Required', 'Commercial item title displayed across store grids and cart.'],
    ['price', 'String', 'Required', 'Selling price in Indian Rupees (e.g. "999").'],
    ['oldPrice', 'String', 'Optional', 'Original MRP price for discount badge calculation.'],
    ['description', 'String', 'Optional', 'Full product overview, features, and technical specifications.'],
    ['plantCare', 'String', 'Optional', 'Technical specifications, material details, and maintenance notes.'],
    ['shippingScope', 'String', '@default("all_india")', 'Delivery eligibility: "all_india" or "restricted".'],
    ['deliveryStates', 'String', 'Optional', 'Comma-separated state codes eligible for shipment.'],
    ['deliveryPincodes', 'String', 'Optional', 'Specific pin code whitelist for regional delivery.'],
    ['inStock', 'Boolean', '@default(true)', 'Availability flag for cart addition and order booking.'],
    ['isPublished', 'Boolean', '@default(false)', 'Visibility toggle in public storefront and category grids.'],
    ['soldLast24Hours', 'Int', 'Optional', 'Social proof counter for store activity.'],
    ['image / image2', 'String', 'Optional', 'Primary and secondary Cloudflare R2 media CDN URLs.'],
    ['colors', 'String', 'Optional (JSON)', 'Color variations and catalog images per colorway.'],
    ['size / adeniumOptions', 'String', 'Optional (JSON)', 'Size variants and individual size pricing table.'],
    ['categoryId', 'String', 'Foreign Key, SetNull', 'Primary category identifier referencing Category.id.'],
    ['createdAt / Upd', 'DateTime', 'now() / @updatedAt', 'Timestamp tracking record creation and modification.']
  ],
  [95, 75, 115, 230.28],
  { boldFirstCol: true, rowHeight: 15.5 }
);

// MODEL 3: CATEGORY
drawSubSection('5.3 Category Model (Hierarchical Taxonomy Tree)');
drawTable(
  ['Field', 'Type', 'Constraint / Default', 'Description'],
  [
    ['id', 'String', '@id @default(uuid())', 'Unique Category UUID primary key.'],
    ['slug', 'String', '@unique', 'URL path segment (e.g. "electronics", "fashion").'],
    ['name / nameKey', 'String', 'Required / @unique', 'Display category name and normalized lookup key.'],
    ['parentId', 'String', 'Foreign Key, SetNull', 'Self-referencing parent category id for nested taxonomies.'],
    ['order', 'Int', '@default(0)', 'Sorting order position in menus and grids.'],
    ['image', 'String', '@default("")', 'Banner image / icon CDN URL.'],
    ['isVisible', 'Boolean', '@default(true)', 'Global category visibility toggle.'],
    ['isVisibleInNav', 'Boolean', '@default(true)', 'Toggle for display in top navigation dropdowns.'],
    ['isVisibleInGrid', 'Boolean', '@default(true)', 'Toggle for storefront category card grids.'],
    ['isVisibleInShopBy', 'Boolean', '@default(true)', 'Toggle for "Shop By Category" circular scrollbars.']
  ],
  [95, 75, 115, 230.28],
  { boldFirstCol: true, rowHeight: 15.5 }
);

// =========================================================================
// PAGE 6: DATABASE SCHEMA (PART 2: ORDERS, AFFILIATES & CUSTOMERS)
// =========================================================================
startNewPage();

drawSectionHeader('5', 'Database Schema Specification (Part 2)', 'Data dictionary for financial transactions, fulfillment tracking, affiliate partners, and customers.');

// MODEL 5: ORDER
drawSubSection('5.4 Order Model (Transactions, Snapshots & Fulfillment)');
drawTable(
  ['Field', 'Type', 'Constraint / Default', 'Description'],
  [
    ['id', 'String', '@id @default(uuid())', 'Unique order UUID internal identifier.'],
    ['orderNumber', 'Int', '@unique', 'Human-readable integer sequence counter (e.g. 1001 for SK-1001).'],
    ['receipt', 'String', '@unique', 'Display reference format (e.g. "SK-1001").'],
    ['checkoutTokenHash', 'String', '@unique', 'SHA-256 hash of secret client token for secure receipt access.'],
    ['razorpayOrderId', 'String', '@unique, Optional', 'Razorpay internal order ID (order_XXXXXXXXXXXXXX).'],
    ['razorpayPaymentId', 'String', '@unique, Optional', 'Razorpay captured payment transaction ID (pay_XXXXXXXXXXXXXX).'],
    ['status', 'String', '@default("pending")', 'Payment state: "pending", "paid", "failed", "cancelled".'],
    ['fulfillmentStatus', 'String', '@default("New")', 'Lifecycle: "New", "Item Selection", "Packaging", "Dispatched", "Delivered".'],
    ['customerName', 'String', 'Required', 'Customer full name provided during checkout.'],
    ['phone', 'String', 'Required (Indexed)', 'Indian 10-digit mobile number for dispatch alerts.'],
    ['address / pincode', 'String', 'Required', 'Physical delivery address and validated 6-digit postal code.'],
    ['itemsJson', 'String', 'Required (JSON)', 'Immutable snapshot of purchased items, prices, variants, and quantities.'],
    ['subtotal / total', 'Int', 'Required (Paise)', 'Subtotal and Final total stored in integer paise.'],
    ['shipping', 'Int', 'Required (Paise)', 'Courier delivery fee in integer paise.'],
    ['affiliateId', 'String', 'Foreign Key, Optional', 'References AffiliateAccount.id for commission attribution.'],
    ['couponCode', 'String', 'Optional', 'Applied voucher or partner code.'],
    ['paidAt', 'DateTime', 'Optional', 'Timestamp of confirmed Razorpay payment capture.']
  ],
  [95, 75, 115, 230.28],
  { boldFirstCol: true, rowHeight: 15.5 }
);

// MODEL 6: AFFILIATEACCOUNT
drawSubSection('5.5 AffiliateAccount Model (Partner Registry)');
drawTable(
  ['Field', 'Type', 'Constraint / Default', 'Description'],
  [
    ['id', 'String', '@id @default(uuid())', 'Unique affiliate partner UUID primary key.'],
    ['name / email', 'String', 'Required', 'Partner full name and correspondence email address.'],
    ['phone', 'String', '@unique (Indexed)', 'Mobile phone used as partner account login identifier.'],
    ['passwordHash', 'String', 'Required', 'Argon2/Bcrypt cryptographic password hash.'],
    ['couponCode', 'String', '@unique, Optional', 'Personal coupon assigned for audience referrals.'],
    ['status', 'String', '@default("pending")', 'Partner approval status: "pending", "approved", "rejected", "banned".'],
    ['social URLs', 'String', 'Optional', 'YouTube, Instagram, Facebook channel profile links.']
  ],
  [95, 75, 115, 230.28],
  { boldFirstCol: true, rowHeight: 15.5 }
);

// MODEL 7: CUSTOMER
drawSubSection('5.6 Customer Model (Buyer Accounts & Credentials)');
drawTable(
  ['Field', 'Type', 'Constraint / Default', 'Description'],
  [
    ['id', 'String', '@id @default(uuid())', 'Unique customer profile UUID identifier.'],
    ['phone', 'String', '@unique (Indexed)', 'Registered Indian mobile phone number.'],
    ['passwordHash', 'String', 'Required', 'Securely hashed customer portal credentials.'],
    ['name / state / pin', 'String', 'Optional', 'Default customer shipping information.'],
    ['createdAt / Upd', 'DateTime', 'now() / @updatedAt', 'Account registration and last profile update timestamp.']
  ],
  [95, 75, 115, 230.28],
  { boldFirstCol: true, rowHeight: 16 }
);

// =========================================================================
// PAGE 7: SECURITY & SANITIZED ENVIRONMENT VARIABLES
// =========================================================================
startNewPage();

drawSectionHeader('6', 'Security Architecture & Environment Configuration', 'Zero-credential exposure policy, cryptographic defenses, and sanitized environment variables.');

drawParagraph(
  'Security is designed directly into every subsystem. The application adheres to strict data privacy principles and never stores or logs plain-text payment credentials, cards, or banking passwords. In compliance with security standards, all sensitive production keys and IP addresses are excluded from documentation and managed via secure environment injection.'
);

drawCard('Cryptographic Defense & Compliance Standards', [
  { label: 'Session Integrity', value: 'HMAC-SHA256 signature stamping on all admin, affiliate, and customer cookies.' },
  { label: 'Constant-Time Equality', value: 'crypto.timingSafeEqual used for all signature validations to prevent timing attacks.' },
  { label: 'Order Privacy Isolation', value: 'Orders indexed by one-way checkoutTokenHash; no sequential ID exposure to clients.' },
  { label: 'Database Injection Immunity', value: '100% parameterized SQL execution via Prisma ORM preventing SQL injection.' },
  { label: 'Sensitive Data Masking', value: 'Production IPs, gateway secrets, and CDN master keys strictly isolated in .env.local.' }
]);

drawSubSection('6.1 Sanitized Environment Configuration Template');
drawParagraph(
  'The following template illustrates all required environment keys without exposing confidential values. In production, these are injected via container orchestration or hosting vaults:'
);

const envHeaders = ['Environment Key', 'Classification', 'Description & Sanitized Placeholder'];
const envRows = [
  ['ADMIN_PASSWORD', 'Authentication', 'Master administrative dashboard secret phrase.'],
  ['ADMIN_SESSION_SECRET', 'Cryptography', '256-bit random salt used to sign administrative JWT session cookies.'],
  ['CUSTOMER_SESSION_SECRET', 'Cryptography', 'Salt used for signing mobile customer authentication tokens.'],
  ['AFFILIATE_SESSION_SECRET', 'Cryptography', 'Salt used for affiliate partner dashboard sessions.'],
  ['DATABASE_URL', 'Database', 'Path to SQLite database file (e.g. file:./dev.db or file:/data/dev.db in Docker).'],
  ['RAZORPAY_KEY_ID', 'Payment Public', 'Merchant Key ID issued by Razorpay for checkout modal instantiation.'],
  ['RAZORPAY_KEY_SECRET', 'Payment Secret', 'Server-side private secret for creating orders and verifying payment signatures.'],
  ['RAZORPAY_WEBHOOK_SECRET', 'Payment Secret', 'Cryptographic secret for validating Razorpay webhook dispatch payloads.'],
  ['R2_ACCOUNT_ID', 'Storage Secret', 'Cloudflare account identifier for R2 object storage bucket access.'],
  ['R2_ACCESS_KEY_ID', 'Storage Secret', 'S3-compatible API access key credential for media uploads.'],
  ['R2_SECRET_ACCESS_KEY', 'Storage Secret', 'S3-compatible API secret key credential for media uploads.'],
  ['R2_BUCKET_NAME', 'Storage Config', 'Target R2 bucket identifier (e.g. sellersking-media).'],
  ['R2_PUBLIC_URL', 'Storage Public', 'Public CDN endpoint serving high-speed cached media assets.'],
  ['NEXT_PUBLIC_SITE_URL', 'Networking', 'Canonical public domain (e.g. https://sellersking.com).'],
  ['APP_PORT', 'Container Port', 'Host port binding for Docker container deployment (default: 3006).']
];

drawTable(envHeaders, envRows, [140, 95, 280.28], { boldFirstCol: true, rowHeight: 16 });

// =========================================================================
// PAGE 8: OPERATIONS, LOCAL SETUP & CONTAINER DEPLOYMENT
// =========================================================================
startNewPage();

drawSectionHeader('7', 'Local Setup, Testing & Containerized Deployment', 'Step-by-step developer runbooks and production Docker configuration.');

drawSubSection('7.1 Developer Machine Setup Runbook');
drawParagraph('To set up the development environment locally, execute the following commands in the workspace root:');

const setupSteps = [
  { label: 'Clone Repository', val: 'git clone https://github.com/shonkuweb/SellersKing.git && cd SellersKing' },
  { label: 'Install Dependencies', val: 'npm install' },
  { label: 'Generate Prisma Client', val: 'npx prisma generate' },
  { label: 'Initialize Database', val: 'node scripts/initialize-categories.cjs' },
  { label: 'Launch Dev Server', val: 'npm run dev -- --port 3000' },
  { label: 'Execute Test Suite', val: 'npm test (executes node:test runner across tests/*.test.mjs)' },
  { label: 'Verify Production Build', val: 'npm run build' }
];

drawCard('Local Terminal Commands', setupSteps.map(s => ({ label: s.label, value: s.val })), { rowHeight: 14 });

drawSubSection('7.2 Production Docker & VPS Deployment');
drawParagraph(
  'The repository includes an optimized standalone Dockerfile (node:20-bookworm-slim with build-essential and python3 for better-sqlite3 compilation) and docker-compose.yml configuration. Next.js produces a standalone production artifact containing only required node_modules and pre-compiled chunks.'
);

drawBullet('Persistent SQLite Data Volume', 'The container maps a persistent Docker host volume to /data/dev.db, ensuring database durability across container rebuilds and image updates.');
drawBullet('Startup Initializer Execution', 'Docker startup script (start.sh) triggers additive database migrations and sequence verification prior to serving traffic.');
drawBullet('Automated Static Asset Cache', 'Public font assets, branding logos, and client bundles are copied into the standalone runner stage.');

drawCard('Production Deployment Runbook (VPS)', [
  { label: 'Pull Latest Source', value: 'git pull origin main' },
  { label: 'Build Docker Image', value: 'docker compose build --no-cache' },
  { label: 'Start Application Stack', value: 'docker compose up -d' },
  { label: 'View Container Logs', value: 'docker compose logs -f --tail=50' },
  { label: 'Check Running Status', value: 'docker compose ps' }
]);

// Final Document Sign-off & Certification Card
doc.moveDown(0.3);
const signY = doc.y;
doc.roundedRect(40, signY, contentWidth, 62, 5).fillAndStroke(C.accentBg, C.accent);

doc.font('Bold').fontSize(9.5).fillColor(C.secondary);
doc.text('DOCUMENTATION SIGN-OFF & ENGINEERING CERTIFICATION', 52, signY + 9, { lineBreak: false });

doc.font('Regular').fontSize(7.6).fillColor(C.text);
doc.text(
  'This technical documentation certifies the completion of SellersKing Version 1.0 Production Architecture. Engineered with precision by ShonkuWEB Technologies under the leadership of Jit D (Co-Founder & Developer) and Isha Karmakar (Co-Founder & Designer).',
  52,
  signY + 23,
  { width: contentWidth - 24, lineGap: 1.6 }
);

// =========================================================================
// RUNNING HEADERS & FOOTERS (ACROSS ALL PAGES)
// =========================================================================

const range = doc.bufferedPageRange();
const totalPages = range.count;

for (let i = range.start; i < range.start + totalPages; i++) {
  doc.switchToPage(i);
  doc.page.margins.top = 0;
  doc.page.margins.bottom = 0;

  // RUNNING HEADER (On page 2 and later)
  if (i > range.start) {
    doc.rect(40, 18, contentWidth, 0.75).fill(C.border);

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 22, { width: 55 });
    }

    doc.font('Bold').fontSize(7).fillColor(C.secondary);
    doc.text('SELLERSKING • TECHNICAL DOCUMENTATION & SYSTEM ARCHITECTURE', 105, 26, { lineBreak: false });

    doc.font('Regular').fontSize(6.5).fillColor(C.muted);
    doc.text('Dev: JIT D • Design: ISHA KARMAKAR (ShonkuWEB)', 310, 26, { width: contentWidth - 270, align: 'right', lineBreak: false });

    doc.rect(40, 39, contentWidth, 0.5).fill(C.border);
  }

  // RUNNING FOOTER (On all pages)
  const footerY = pageHeight - 25;
  doc.rect(40, footerY - 5, contentWidth, 0.5).fill(C.border);

  doc.font('Regular').fontSize(6.5).fillColor(C.muted);
  doc.text('Sellersking Infotech PVT. LTD. • Version 1.0.0 • Developed by ShonkuWEB', 40, footerY, { lineBreak: false });

  doc.font('Bold').fontSize(7).fillColor(C.secondary);
  doc.text(`Page ${i + 1} of ${totalPages}`, 40, footerY, { width: contentWidth, align: 'right', lineBreak: false });
}

doc.end();

writeStream.on('finish', () => {
  console.log(`\nTechnical Documentation PDF successfully generated!`);
  console.log(`Saved to: ${outputFile}`);
  console.log(`Total Pages: ${totalPages}`);
});
