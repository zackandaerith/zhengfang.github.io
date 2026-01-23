/**
 * Case Study utilities for client-side data loading
 */

import { CaseStudy } from '@/types';

/**
 * Loads case studies from the public data directory
 */
export async function loadCaseStudies(): Promise<CaseStudy[]> {
  try {
    const response = await fetch('/data/case-studies.json');
    if (!response.ok) {
      throw new Error(`Failed to load case studies: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Convert date strings to Date objects
    return data.map((caseStudy: any) => ({
      ...caseStudy,
      startDate: new Date(caseStudy.startDate),
      endDate: caseStudy.endDate ? new Date(caseStudy.endDate) : undefined,
      testimonial: caseStudy.testimonial ? {
        ...caseStudy.testimonial,
        date: new Date(caseStudy.testimonial.date)
      } : undefined
    }));
  } catch (error) {
    console.error('Error loading case studies:', error);
    return [];
  }
}

/**
 * Gets featured case studies
 */
export function getFeaturedCaseStudies(caseStudies: CaseStudy[]): CaseStudy[] {
  return caseStudies.filter(cs => cs.featured);
}

/**
 * Gets case studies by industry
 */
export function getCaseStudiesByIndustry(caseStudies: CaseStudy[], industry: string): CaseStudy[] {
  return caseStudies.filter(cs => cs.industry.toLowerCase() === industry.toLowerCase());
}

/**
 * Gets case studies by tag
 */
export function getCaseStudiesByTag(caseStudies: CaseStudy[], tag: string): CaseStudy[] {
  return caseStudies.filter(cs => cs.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
}

/**
 * Sorts case studies by date (newest first)
 */
export function sortCaseStudiesByDate(caseStudies: CaseStudy[]): CaseStudy[] {
  return [...caseStudies].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

/**
 * Sorts case studies by number of results (most results first)
 */
export function sortCaseStudiesByResults(caseStudies: CaseStudy[]): CaseStudy[] {
  return [...caseStudies].sort((a, b) => b.results.length - a.results.length);
}

/**
 * Gets unique industries from case studies
 */
export function getUniqueIndustries(caseStudies: CaseStudy[]): string[] {
  return Array.from(new Set(caseStudies.map(cs => cs.industry)));
}

/**
 * Gets unique tags from case studies
 */
export function getUniqueTags(caseStudies: CaseStudy[]): string[] {
  const allTags = caseStudies.flatMap(cs => cs.tags);
  return Array.from(new Set(allTags));
}

/**
 * Searches case studies by title, client, or challenge
 */
export function searchCaseStudies(caseStudies: CaseStudy[], query: string): CaseStudy[] {
  const lowerQuery = query.toLowerCase();
  return caseStudies.filter(cs => 
    cs.title.toLowerCase().includes(lowerQuery) ||
    cs.client.toLowerCase().includes(lowerQuery) ||
    cs.challenge.toLowerCase().includes(lowerQuery) ||
    cs.solution.toLowerCase().includes(lowerQuery) ||
    cs.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}