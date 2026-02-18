/**
 * SEO utilities for metadata generation
 * Implements requirements 4.1, 4.4: SEO metadata generation
 */

import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Generate complete metadata for a page
 * Implements requirement 4.1: Dynamic meta tags for title, description, and keywords
 * Implements requirement 4.4: Open Graph and Twitter Card metadata
 */
export function generatePageMetadata(config: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.jpg',
    url = '',
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
  } = config;

  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return {
    title,
    description,
    keywords,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      type,
      url: fullUrl,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

/**
 * Generate structured data (JSON-LD) for professional profiles
 * Implements requirement 4.2: Semantic HTML markup and structured data
 */
export function generatePersonStructuredData(data: {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image?: string;
  email?: string;
  linkedin?: string;
  location?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.jobTitle,
    description: data.description,
    url: `${baseUrl}${data.url}`,
    image: data.image ? `${baseUrl}${data.image}` : undefined,
    email: data.email,
    sameAs: data.linkedin ? [data.linkedin] : undefined,
    address: data.location ? {
      '@type': 'PostalAddress',
      addressLocality: data.location,
    } : undefined,
  };
}

/**
 * Generate structured data for portfolio/work samples
 */
export function generatePortfolioStructuredData(data: {
  name: string;
  description: string;
  author: string;
  datePublished?: string;
  dateModified?: string;
  items: Array<{
    name: string;
    description: string;
    url?: string;
  }>;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: data.name,
    description: data.description,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    hasPart: data.items.map(item => ({
      '@type': 'CreativeWork',
      name: item.name,
      description: item.description,
      url: item.url ? `${baseUrl}${item.url}` : undefined,
    })),
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * Generate organization structured data
 */
export function generateOrganizationStructuredData(data: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    email?: string;
    telephone?: string;
    contactType?: string;
  };
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: `${baseUrl}${data.url}`,
    logo: data.logo ? `${baseUrl}${data.logo}` : undefined,
    description: data.description,
    contactPoint: data.contactPoint ? {
      '@type': 'ContactPoint',
      email: data.contactPoint.email,
      telephone: data.contactPoint.telephone,
      contactType: data.contactPoint.contactType || 'customer service',
    } : undefined,
  };
}

/**
 * Sanitize and optimize meta description
 * Ensures description is within optimal length (150-160 characters)
 */
export function optimizeMetaDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) {
    return description;
  }
  
  // Truncate at word boundary
  const truncated = description.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? `${truncated.slice(0, lastSpace)}...`
    : `${truncated}...`;
}

/**
 * Generate keywords from content
 * Extracts relevant keywords for SEO
 */
export function generateKeywords(content: string, maxKeywords: number = 10): string[] {
  // Simple keyword extraction (in production, use more sophisticated NLP)
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  // Count word frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Validate and sanitize URL for canonical tags
 */
export function sanitizeCanonicalUrl(url: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  // Remove trailing slash
  const cleanUrl = url.replace(/\/$/, '');
  
  // Ensure absolute URL
  if (cleanUrl.startsWith('http')) {
    return cleanUrl;
  }
  
  return `${baseUrl}${cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`}`;
}

/**
 * Generate social media share URLs
 */
export function generateShareUrls(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  };
}
