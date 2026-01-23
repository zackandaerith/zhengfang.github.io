'use client';

import React from 'react';
import { Testimonial } from '@/types';
import { TestimonialCard } from './TestimonialCard';

interface TestimonialsDisplayProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'carousel' | 'masonry';
  maxItems?: number;
  showRatings?: boolean;
  className?: string;
}

export const TestimonialsDisplay: React.FC<TestimonialsDisplayProps> = ({
  testimonials,
  title = 'Client Testimonials',
  subtitle = 'What clients say about working with me',
  layout = 'grid',
  maxItems,
  showRatings = true,
  className = '',
}) => {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className={`p-6 text-center text-gray-500 ${className}`}>
        <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">💬</div>
        <p>No testimonials available to display.</p>
      </div>
    );
  }

  const displayTestimonials = maxItems ? testimonials.slice(0, maxItems) : testimonials;

  const getLayoutClasses = () => {
    switch (layout) {
      case 'carousel':
        return 'flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory';
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  const getCardVariant = () => {
    if (layout === 'carousel') return 'featured';
    return 'default';
  };

  // Calculate average rating
  const averageRating = showRatings && testimonials.length > 0 
    ? testimonials
        .filter(t => t.rating)
        .reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.filter(t => t.rating).length
    : 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {subtitle}
          </p>
        )}
        
        {/* Average Rating Display */}
        {showRatings && averageRating > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-xl ${
                    i < Math.round(averageRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {averageRating.toFixed(1)} out of 5 ({testimonials.filter(t => t.rating).length} reviews)
            </span>
          </div>
        )}
      </div>

      {/* Testimonials Grid/Layout */}
      <div className={getLayoutClasses()}>
        {displayTestimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className={`${layout === 'carousel' ? 'flex-shrink-0 w-80 snap-start' : ''} ${layout === 'masonry' ? 'break-inside-avoid' : ''}`}
          >
            <TestimonialCard
              testimonial={testimonial}
              variant={getCardVariant()}
            />
          </div>
        ))}
      </div>

      {/* Load More / View All */}
      {maxItems && testimonials.length > maxItems && (
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            View All {testimonials.length} Testimonials
          </button>
        </div>
      )}

      {/* Social Proof Summary */}
      {testimonials.length > 0 && (
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="flex items-center justify-center gap-8 text-sm text-blue-800 dark:text-blue-200">
            <div>
              <div className="font-bold text-2xl">{testimonials.length}</div>
              <div>Happy Clients</div>
            </div>
            {showRatings && averageRating > 0 && (
              <div>
                <div className="font-bold text-2xl">{averageRating.toFixed(1)}</div>
                <div>Average Rating</div>
              </div>
            )}
            <div>
              <div className="font-bold text-2xl">
                {new Set(testimonials.map(t => t.company)).size}
              </div>
              <div>Companies</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsDisplay;