'use client';

import React from 'react';
import Image from 'next/image';
import { CaseStudy } from '@/types';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  variant?: 'default' | 'featured' | 'compact';
  onClick?: (caseStudy: CaseStudy) => void;
  className?: string;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  caseStudy,
  variant = 'default',
  onClick,
  className = '',
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(caseStudy);
    }
  };

  const getCardClasses = () => {
    const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700';
    
    switch (variant) {
      case 'featured':
        return `${baseClasses} p-8 hover:scale-105 cursor-pointer`;
      case 'compact':
        return `${baseClasses} p-4 hover:scale-102 cursor-pointer`;
      default:
        return `${baseClasses} p-6 hover:scale-102 cursor-pointer`;
    }
  };

  const getImageClasses = () => {
    switch (variant) {
      case 'featured':
        return 'h-64 w-full';
      case 'compact':
        return 'h-32 w-full';
      default:
        return 'h-48 w-full';
    }
  };

  const getTitleClasses = () => {
    switch (variant) {
      case 'featured':
        return 'text-2xl font-bold text-gray-900 dark:text-white mb-3';
      case 'compact':
        return 'text-lg font-semibold text-gray-900 dark:text-white mb-2';
      default:
        return 'text-xl font-bold text-gray-900 dark:text-white mb-3';
    }
  };

  const primaryImage = caseStudy.images[0] || '/images/placeholder-case-study.jpg';
  const topResults = caseStudy.results.slice(0, variant === 'compact' ? 1 : 2);

  return (
    <div 
      className={`${getCardClasses()} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* Featured Badge */}
      {caseStudy.featured && variant !== 'compact' && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          Featured
        </div>
      )}

      {/* Image */}
      <div className={`${getImageClasses()} relative overflow-hidden rounded-lg mb-4`}>
        <Image
          src={primaryImage}
          alt={caseStudy.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title and Client */}
        <div>
          <h3 className={getTitleClasses()}>
            {caseStudy.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{caseStudy.client}</span>
            <span>•</span>
            <span>{caseStudy.industry}</span>
          </div>
        </div>

        {/* Challenge Preview */}
        {variant !== 'compact' && (
          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
            {caseStudy.challenge}
          </p>
        )}

        {/* Key Results */}
        <div className="space-y-2">
          {topResults.map((result) => (
            <div key={result.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                {result.metric.name}
              </span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-green-600 dark:text-green-400">
                  {result.metric.value}{result.metric.unit}
                </span>
                {result.impact === 'high' && (
                  <span className="text-green-500">📈</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        {variant !== 'compact' && (
          <div className="flex flex-wrap gap-2">
            {caseStudy.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {caseStudy.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{caseStudy.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Testimonial Preview */}
        {caseStudy.testimonial && variant === 'featured' && (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-2">
              "{caseStudy.testimonial.content}"
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-xs text-gray-500 dark:text-gray-500">
                — {caseStudy.testimonial.author}, {caseStudy.testimonial.position}
              </div>
            </div>
          </div>
        )}

        {/* Read More Indicator */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            View Case Study →
          </span>
          {caseStudy.results.length > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {caseStudy.results.length} key results
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseStudyCard;