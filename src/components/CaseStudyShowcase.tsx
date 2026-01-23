'use client';

import React, { useState, useMemo } from 'react';
import { CaseStudy } from '@/types';
import { CaseStudyCard } from './CaseStudyCard';
import { CaseStudyDetail } from './CaseStudyDetail';

interface CaseStudyShowcaseProps {
  caseStudies: CaseStudy[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  layout?: 'grid' | 'masonry' | 'list';
  maxItems?: number;
  className?: string;
}

export const CaseStudyShowcase: React.FC<CaseStudyShowcaseProps> = ({
  caseStudies,
  title = 'Case Studies',
  subtitle = 'Real-world success stories and measurable results',
  showFilters = true,
  layout = 'grid',
  maxItems,
  className = '',
}) => {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'featured' | 'results'>('featured');

  // Extract unique industries and tags
  const industries = useMemo(() => {
    const uniqueIndustries = Array.from(new Set(caseStudies.map(cs => cs.industry)));
    return ['all', ...uniqueIndustries];
  }, [caseStudies]);

  const tags = useMemo(() => {
    const allTags = caseStudies.flatMap(cs => cs.tags);
    const uniqueTags = Array.from(new Set(allTags));
    return ['all', ...uniqueTags];
  }, [caseStudies]);

  // Filter and sort case studies
  const filteredAndSortedCaseStudies = useMemo(() => {
    let filtered = caseStudies.filter(caseStudy => {
      const industryMatch = selectedIndustry === 'all' || caseStudy.industry === selectedIndustry;
      const tagMatch = selectedTag === 'all' || caseStudy.tags.includes(selectedTag);
      return industryMatch && tagMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'date':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'results':
          return b.results.length - a.results.length;
        default:
          return 0;
      }
    });

    return maxItems ? filtered.slice(0, maxItems) : filtered;
  }, [caseStudies, selectedIndustry, selectedTag, sortBy, maxItems]);

  const handleCaseStudyClick = (caseStudy: CaseStudy) => {
    setSelectedCaseStudy(caseStudy);
  };

  const handleCloseDetail = () => {
    setSelectedCaseStudy(null);
  };

  if (selectedCaseStudy) {
    return (
      <div className={`w-full ${className}`}>
        <CaseStudyDetail
          caseStudy={selectedCaseStudy}
          onClose={handleCloseDetail}
        />
      </div>
    );
  }

  const getGridClasses = () => {
    switch (layout) {
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6';
      case 'list':
        return 'space-y-6';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  const getCardVariant = () => {
    if (layout === 'list') return 'featured';
    return 'default';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        )}
      </div>

      {/* Filters and Controls */}
      {showFilters && (
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Industry Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Industry:
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry === 'all' ? 'All Industries' : industry}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Skill:
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag === 'all' ? 'All Skills' : tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'featured' | 'results')}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="featured">Featured First</option>
                <option value="date">Most Recent</option>
                <option value="results">Most Results</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedCaseStudies.length} of {caseStudies.length} case studies
          </div>
        </div>
      )}

      {/* Case Studies Grid */}
      {filteredAndSortedCaseStudies.length > 0 ? (
        <div className={getGridClasses()}>
          {filteredAndSortedCaseStudies.map((caseStudy) => (
            <div key={caseStudy.id} className={layout === 'masonry' ? 'break-inside-avoid' : ''}>
              <CaseStudyCard
                caseStudy={caseStudy}
                variant={getCardVariant()}
                onClick={handleCaseStudyClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No case studies found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}

      {/* Featured Case Studies Summary */}
      {!showFilters && caseStudies.some(cs => cs.featured) && (
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Featured Success Stories
          </h3>
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            Highlighting {caseStudies.filter(cs => cs.featured).length} of our most impactful projects with measurable results and client testimonials.
          </p>
        </div>
      )}
    </div>
  );
};

export default CaseStudyShowcase;