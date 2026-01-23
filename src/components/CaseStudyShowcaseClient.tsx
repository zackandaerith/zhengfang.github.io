'use client';

import React, { useEffect, useState } from 'react';
import { CaseStudy } from '@/types';
import { CaseStudyShowcase } from './CaseStudyShowcase';
import { loadCaseStudies } from '@/utils/case-studies';

interface CaseStudyShowcaseClientProps {
  className?: string;
}

export function CaseStudyShowcaseClient({ className }: CaseStudyShowcaseClientProps) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadCaseStudies();
        setCaseStudies(data);
      } catch (error) {
        console.error('Error loading case studies:', error);
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
        <p className="text-gray-600 dark:text-gray-400">Loading case studies...</p>
      </div>
    );
  }

  return (
    <CaseStudyShowcase
      caseStudies={caseStudies}
      title="Success Stories"
      subtitle="Real-world case studies showcasing strategic customer success initiatives and measurable business impact"
      showFilters={true}
      layout="grid"
      className={className}
    />
  );
}