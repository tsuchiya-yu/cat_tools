type WebApplicationStructuredDataInput = {
  name: string;
  url: string;
  description: string;
  applicationCategory: 'UtilitiesApplication' | 'ReferenceApplication';
};

export function createWebApplicationStructuredData({
  name,
  url,
  description,
  applicationCategory,
}: WebApplicationStructuredDataInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url,
    description,
    applicationCategory,
    operatingSystem: 'Any',
    inLanguage: 'ja',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
  };
}
