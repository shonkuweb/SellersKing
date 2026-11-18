export const business = Object.freeze({
  name: 'Sellers King Info Tech',
  shortName: 'Sellers King Info Tech',
  logo: '/images/sellersking-logo.png',
  logoCdn: '',
  footerLogo: '/images/sellersking-logo.png',
  footerLogoCdn: '',
  phone: '+918637054105',
  phoneDisplay: '+91 86370 54105',
  whatsapp: '918637054105',
  email: 'support@sellersking.com',
  address: 'India',
  locality: 'India',
  region: 'India',
  postalCode: '700001',
  country: 'India',
});
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const whatsappUrl = message => `https://wa.me/${business.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
