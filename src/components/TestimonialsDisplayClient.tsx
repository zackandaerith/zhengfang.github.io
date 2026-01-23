'use client';

import React, { useEffect, useState } from 'react';
import { Testimonial } from '@/types';
import { TestimonialsDisplay } from './TestimonialsDisplay';
import { loadTestimonials } from '@/utils/testimonials';

interface TestimonialsDisplayClientProps {
  className?: string;
}

export function TestimonialsDisplayClient({ className }: TestimonialsDisplayClientProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error('Error loading testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading testimonials...</p>
      </div>
    );
  }

  return (
    <TestimonialsDisplay
      testimonials={testimonials}
      title="Client Testimonials"
      subtitle="What colleagues and clients say about working with me"
      layout="grid"
      maxItems={6}
      showRatings={true}
      className={className}
    />
  );
}