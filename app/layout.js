import "./globals.css";
import { Providers } from "./providers";
import { business, siteUrl } from "../lib/business.mjs";

const description = `${business.name} in ${business.locality}, ${business.region}. Explore our collection and shop online. Contact ${business.phoneDisplay}.`;
export const viewport = {
  themeColor: '#2563EB',
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${business.name} | Online Shopping in ${business.locality}, ${business.region}`, template: `%s | ${business.name}` },
  description,
  keywords: [business.name, 'SellersKing', 'online shopping', 'ecommerce store', 'best deals online', 'buy products online', 'shop online India'],
  authors: [{ name: business.name }], creator: business.name, publisher: business.name,
  alternates: { canonical: siteUrl },
  openGraph: { title: business.name, description, url: siteUrl, siteName: business.name, locale: 'en_IN', type: 'website', images: [{ url: business.logo, width: 2048, height: 683, alt: business.name }] },
  twitter: { card: 'summary_large_image', title: business.name, description, images: [business.logo] },
  robots: { index: true, follow: true },
};
const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'OnlineStore', '@id': `${siteUrl}/#store`, name: business.name, url: siteUrl, logo: `${siteUrl}${business.logo}`,
      description, telephone: business.phone, email: business.email,
      address: { '@type': 'PostalAddress', streetAddress: business.locality, addressLocality: business.locality, addressRegion: business.region, postalCode: business.postalCode, addressCountry: 'IN' },
    },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: business.name, url: siteUrl, description },
  ],
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }} /></head>
      <body><div className="mobile-app-container"><Providers>{children}</Providers></div></body>
    </html>
  );
}
