import { MetadataRoute } from 'next';
import { getCategories, getPublishedCreations } from '@/lib/supabase/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/creations`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  try {
    // Get all categories
    const categories = await getCategories();
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(category.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Get all published creations
    const creations = await getPublishedCreations();
    const creationRoutes: MetadataRoute.Sitemap = creations.map((creation) => ({
      url: `${baseUrl}/creations/${creation.slug}`,
      lastModified: creation.published_at ? new Date(creation.published_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...creationRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static routes if database is unavailable
    return staticRoutes;
  }
}
