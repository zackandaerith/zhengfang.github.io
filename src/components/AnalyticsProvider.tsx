'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initGA, trackPageView } from '@/utils/analytics';
import { initPerformanceMonitoring } from '@/utils/performance';

/**
 * Analytics provider component
 * Initializes GA and tracks page views
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize analytics on mount
    initGA();
    initPerformanceMonitoring();
  }, []);

  useEffect(() => {
    // Track page views on route change
    if (pathname) {
      const url = searchParams?.toString() 
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
      
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
