'use client';

import React from 'react';
import Image from 'next/image';
import { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  variant = 'default',
  className = '',
}) => {
  const getCardClasses = () => {
    const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300';
    
    switch (variant) {
      case 'featured':
        return `${baseClasses} p-8 hover:shadow-lg`;
      case 'compact':
        return `${baseClasses} p-4`;
      default:
        return `${baseClasses} p-6 hover:shadow-lg`;
    }
  };

  const getContentClasses = () => {
    switch (variant) {
      case 'featured':
        return 'text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6';
      case 'compact':
        return 'text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4';
      default:
        return 'text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className={`${getCardClasses()} ${className}`}>
      {/* Quote Icon */}
      <div className="flex justify-start mb-4">
        <div className="text-blue-500 text-3xl font-serif">"</div>
      </div>

      {/* Testimonial Content */}
      <blockquote className={getContentClasses()}>
        {testimonial.content}
      </blockquote>

      {/* Rating */}
      {testimonial.rating && (
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`text-lg ${
                i < testimonial.rating!
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              ⭐
            </span>
          ))}
        </div>
      )}

      {/* Author Information */}
      <div className="flex items-center gap-4">
        {/* Author Image */}
        {testimonial.image && (
          <div className="relative w-12 h-12 overflow-hidden rounded-full flex-shrink-0">
            <Image
              src={testimonial.image}
              alt={testimonial.author}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}

        {/* Author Details */}
        <div className="flex-1">
          <div className="font-semibold text-gray-900 dark:text-white">
            {testimonial.author}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {testimonial.position}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            {testimonial.company}
          </div>
        </div>

        {/* Date */}
        <div className="text-xs text-gray-500 dark:text-gray-500 text-right">
          {formatDate(testimonial.date)}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;