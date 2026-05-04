import { MetadataRoute } from 'next'
import { caseStudies } from '@/data/caseStudies'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://falah.dev'
  
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/projects',
    '/stack',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic project routes
  const projectRoutes = caseStudies.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes]
}
