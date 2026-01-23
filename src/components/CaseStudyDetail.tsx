'use client';

import React from 'react';
import Image from 'next/image';
import { CaseStudy } from '@/types';
import { MetricCard } from './MetricCard';

interface CaseStudyDetailProps {
  caseStudy: CaseStudy;
  onClose?: () => void;
  className?: string;
}

export const CaseStudyDetail: React.FC<CaseStudyDetailProps> = ({
  caseStudy,
  onClose,
  className = '',
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const getDuration = () => {
    const start = new Date(caseStudy.startDate);
    const end = caseStudy.endDate ? new Date(caseStudy.endDate) : new Date();
    const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months > 12 ? `${Math.round(months / 12)} year${Math.round(months / 12) > 1 ? 's' : ''}` : `${months} month${months > 1 ? 's' : ''}`;
  };

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-8">
        {onClose && (
          <button
            onClick={onClose}
            className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Back to Case Studies
          </button>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {caseStudy.title}
            </h1>
            <div className="flex items-center gap-4 text-lg text-gray-600 dark:text-gray-400">
              <span className="font-medium">{caseStudy.client}</span>
              <span>•</span>
              <span>{caseStudy.industry}</span>
              <span>•</span>
              <span>{getDuration()}</span>
            </div>
          </div>
          
          {caseStudy.featured && (
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              Featured Case Study
            </div>
          )}
        </div>

        {/* Project Timeline */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <span>{formatDate(caseStudy.startDate)}</span>
          <span>→</span>
          <span>{caseStudy.endDate ? formatDate(caseStudy.endDate) : 'Ongoing'}</span>
        </div>
      </div>

      {/* Hero Image */}
      {caseStudy.images.length > 0 && (
        <div className="relative h-96 w-full overflow-hidden rounded-lg mb-8">
          <Image
            src={caseStudy.images[0]}
            alt={caseStudy.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Challenge */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              The Challenge
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {caseStudy.challenge}
            </p>
          </section>

          {/* Solution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Solution
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {caseStudy.solution}
            </p>

            {/* Implementation Steps */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Implementation Process
            </h3>
            <div className="space-y-3">
              {caseStudy.implementation.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Additional Images */}
          {caseStudy.images.length > 1 && (
            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Project Gallery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseStudy.images.slice(1).map((image, index) => (
                  <div key={index} className="relative h-48 overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={`${caseStudy.title} - Image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Testimonial */}
          {caseStudy.testimonial && (
            <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Client Testimonial
              </h3>
              <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-4">
                "{caseStudy.testimonial.content}"
              </blockquote>
              <div className="flex items-center gap-4">
                {caseStudy.testimonial.image && (
                  <div className="relative w-12 h-12 overflow-hidden rounded-full">
                    <Image
                      src={caseStudy.testimonial.image}
                      alt={caseStudy.testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {caseStudy.testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {caseStudy.testimonial.position} at {caseStudy.testimonial.company}
                  </div>
                </div>
                {caseStudy.testimonial.rating && (
                  <div className="ml-auto flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < caseStudy.testimonial!.rating!
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Results */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Key Results
            </h3>
            <div className="space-y-4">
              {caseStudy.results.map((result) => (
                <MetricCard
                  key={result.id}
                  metric={result.metric}
                  variant="compact"
                  showTrend={false}
                />
              ))}
            </div>
          </section>

          {/* Project Details */}
          <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Project Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Client:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{caseStudy.client}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Industry:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{caseStudy.industry}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{getDuration()}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Results:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{caseStudy.results.length} key metrics</span>
              </div>
            </div>
          </section>

          {/* Tags */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Technologies & Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {caseStudy.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyDetail;