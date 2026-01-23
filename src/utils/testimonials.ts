/**
 * Testimonials utilities for client-side data loading
 */

import { Testimonial } from '@/types';

/**
 * Loads testimonials from the public data directory
 */
export async function loadTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await fetch('/data/testimonials.json');
    if (!response.ok) {
      throw new Error(`Failed to load testimonials: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Convert date strings to Date objects
    return data.map((testimonial: any) => ({
      ...testimonial,
      date: new Date(testimonial.date)
    }));
  } catch (error) {
    console.error('Error loading testimonials:', error);
    return [];
  }
}

/**
 * Gets testimonials by company
 */
export function getTestimonialsByCompany(testimonials: Testimonial[], company: string): Testimonial[] {
  return testimonials.filter(t => t.company.toLowerCase() === company.toLowerCase());
}

/**
 * Gets testimonials with ratings
 */
export function getTestimonialsWithRatings(testimonials: Testimonial[]): Testimonial[] {
  return testimonials.filter(t => t.rating && t.rating > 0);
}

/**
 * Calculates average rating from testimonials
 */
export function calculateAverageRating(testimonials: Testimonial[]): number {
  const ratedTestimonials = getTestimonialsWithRatings(testimonials);
  if (ratedTestimonials.length === 0) return 0;
  
  const totalRating = ratedTestimonials.reduce((sum, t) => sum + (t.rating || 0), 0);
  return totalRating / ratedTestimonials.length;
}

/**
 * Sorts testimonials by date (newest first)
 */
export function sortTestimonialsByDate(testimonials: Testimonial[]): Testimonial[] {
  return [...testimonials].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Sorts testimonials by rating (highest first)
 */
export function sortTestimonialsByRating(testimonials: Testimonial[]): Testimonial[] {
  return [...testimonials].sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

/**
 * Gets unique companies from testimonials
 */
export function getUniqueCompanies(testimonials: Testimonial[]): string[] {
  return Array.from(new Set(testimonials.map(t => t.company)));
}

/**
 * Searches testimonials by content, author, or company
 */
export function searchTestimonials(testimonials: Testimonial[], query: string): Testimonial[] {
  const lowerQuery = query.toLowerCase();
  return testimonials.filter(t => 
    t.content.toLowerCase().includes(lowerQuery) ||
    t.author.toLowerCase().includes(lowerQuery) ||
    t.company.toLowerCase().includes(lowerQuery) ||
    t.position.toLowerCase().includes(lowerQuery)
  );
}