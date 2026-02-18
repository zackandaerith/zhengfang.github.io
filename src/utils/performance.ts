/**
 * Performance monitoring and Core Web Vitals tracking
 * Implements requirement 7.3
 */

import { trackEvent } from './analytics';

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
}

/**
 * Core Web Vitals thresholds
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

/**
 * Get performance rating based on thresholds
 */
function getRating(
  metric: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[metric as keyof typeof WEB_VITALS_THRESHOLDS];
  
  if (!thresholds) {
    return 'good';
  }

  if (value <= thresholds.good) {
    return 'good';
  } else if (value <= thresholds.poor) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
}

/**
 * Report Core Web Vitals to analytics
 */
export function reportWebVitals(metric: PerformanceMetric): void {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric);
  }

  // Send to analytics
  trackEvent('web_vitals', {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
    metric_id: metric.id,
    event_category: 'performance',
  });
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
export function measureLCP(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;

      if (lastEntry) {
        const metric: PerformanceMetric = {
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          rating: getRating('LCP', lastEntry.renderTime || lastEntry.loadTime),
        };

        reportWebVitals(metric);
      }
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    console.error('Error measuring LCP:', error);
  }
}

/**
 * Measure First Input Delay (FID)
 */
export function measureFID(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0] as any;

      if (firstEntry) {
        const metric: PerformanceMetric = {
          name: 'FID',
          value: firstEntry.processingStart - firstEntry.startTime,
          rating: getRating('FID', firstEntry.processingStart - firstEntry.startTime),
        };

        reportWebVitals(metric);
      }
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    console.error('Error measuring FID:', error);
  }
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export function measureCLS(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    let clsValue = 0;
    let clsEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });

    // Report CLS on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const metric: PerformanceMetric = {
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
        };

        reportWebVitals(metric);
        observer.disconnect();
      }
    });
  } catch (error) {
    console.error('Error measuring CLS:', error);
  }
}

/**
 * Measure First Contentful Paint (FCP)
 */
export function measureFCP(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0] as any;

      if (firstEntry) {
        const metric: PerformanceMetric = {
          name: 'FCP',
          value: firstEntry.startTime,
          rating: getRating('FCP', firstEntry.startTime),
        };

        reportWebVitals(metric);
      }
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (error) {
    console.error('Error measuring FCP:', error);
  }
}

/**
 * Measure Time to First Byte (TTFB)
 */
export function measureTTFB(): void {
  if (typeof window === 'undefined' || !window.performance) {
    return;
  }

  try {
    const navigation = performance.getEntriesByType('navigation')[0] as any;

    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;

      const metric: PerformanceMetric = {
        name: 'TTFB',
        value: ttfb,
        rating: getRating('TTFB', ttfb),
      };

      reportWebVitals(metric);
    }
  } catch (error) {
    console.error('Error measuring TTFB:', error);
  }
}

/**
 * Initialize all performance monitoring
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Wait for page load
  if (document.readyState === 'complete') {
    startMonitoring();
  } else {
    window.addEventListener('load', startMonitoring);
  }
}

function startMonitoring(): void {
  measureLCP();
  measureFID();
  measureCLS();
  measureFCP();
  measureTTFB();
}

/**
 * Get performance summary
 */
export function getPerformanceSummary(): {
  navigation: any;
  resources: any[];
  memory?: any;
} {
  if (typeof window === 'undefined' || !window.performance) {
    return { navigation: null, resources: [] };
  }

  return {
    navigation: performance.getEntriesByType('navigation')[0],
    resources: performance.getEntriesByType('resource'),
    memory: (performance as any).memory,
  };
}

/**
 * Monitor long tasks
 */
export function monitorLongTasks(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        trackEvent('long_task', {
          duration: entry.duration,
          start_time: entry.startTime,
          event_category: 'performance',
        });
      }
    });

    observer.observe({ type: 'longtask', buffered: true });
  } catch (error) {
    // Long task API not supported
  }
}

/**
 * Track resource loading performance
 */
export function trackResourcePerformance(): void {
  if (typeof window === 'undefined' || !window.performance) {
    return;
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  // Group by resource type
  const byType: Record<string, number[]> = {};
  
  resources.forEach(resource => {
    const type = resource.initiatorType;
    if (!byType[type]) {
      byType[type] = [];
    }
    byType[type].push(resource.duration);
  });

  // Calculate averages
  Object.entries(byType).forEach(([type, durations]) => {
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    
    trackEvent('resource_performance', {
      resource_type: type,
      average_duration: avg,
      count: durations.length,
      event_category: 'performance',
    });
  });
}
