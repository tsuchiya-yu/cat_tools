import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cat-tools.catnote.tokyo';
  const lastModified = '2025-11-08';
  
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/calculate-cat-age`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calculate-cat-calorie`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calculate-cat-feeding`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // 他のツールページがあれば追加
  ];
}
