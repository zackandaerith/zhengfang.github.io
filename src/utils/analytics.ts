/**
 * Google Analytics 4 integration with privacy compliance
 * Implements requirements 7.1, 7.4, 7.5
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: {
      (command: 'config', targetId: string, config?: Record<string, any>): void;
      (command: 'event', eventName: string, eventParams?: Record<string, any>): void;
      (command: 'consent', consentArg: string, consentParams: Record<string, any>): void;
      (command: 'js', date: Date): void;
      (command: string, ...args: any[]): void;
    };
    dataLayer?: any[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

/**
 * Initialize Google Analytics
 */
export function initGA(): void {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) {
    return;
  }

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer?.push(args);
  } as any;

  if (window.gtag) {
    window.gtag('js', new Date());

    // Set default consent mode (privacy-first)
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      wait_for_update: 500,
    });

    // Configure GA
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });
  }
}

/**
 * Update consent preferences
 */
export function updateConsent(granted: boolean): void {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });

  // Store consent preference
  localStorage.setItem('analytics_consent', granted ? 'granted' : 'denied');
}

/**
 * Check if user has granted consent
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const consent = localStorage.getItem('analytics_consent');
  return consent === 'granted';
}

/**
 * Track page view
 */
export function trackPageView(url: string): void {
  if (typeof window === 'undefined' || !window.gtag || !hasAnalyticsConsent()) {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

/**
 * Track custom event
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
): void {
  if (typeof window === 'undefined' || !window.gtag || !hasAnalyticsConsent()) {
    return;
  }

  window.gtag('event', eventName, eventParams);
}

/**
 * Track portfolio interaction events
 */
export const portfolioEvents = {
  viewCaseStudy: (caseStudyId: string, title: string) => {
    trackEvent('view_case_study', {
      case_study_id: caseStudyId,
      case_study_title: title,
      event_category: 'portfolio',
    });
  },

  viewMetric: (metricName: string, metricValue: string | number) => {
    trackEvent('view_metric', {
      metric_name: metricName,
      metric_value: metricValue,
      event_category: 'portfolio',
    });
  },

  viewTestimonial: (testimonialId: string, author: string) => {
    trackEvent('view_testimonial', {
      testimonial_id: testimonialId,
      testimonial_author: author,
      event_category: 'portfolio',
    });
  },

  shareContent: (contentType: string, platform: string) => {
    trackEvent('share_content', {
      content_type: contentType,
      share_platform: platform,
      event_category: 'engagement',
    });
  },
};

/**
 * Track contact form events
 */
export const contactEvents = {
  formStart: () => {
    trackEvent('form_start', {
      form_name: 'contact',
      event_category: 'contact',
    });
  },

  formSubmit: (success: boolean, error?: string) => {
    trackEvent('form_submit', {
      form_name: 'contact',
      success,
      error_message: error,
      event_category: 'contact',
    });
  },

  clickEmail: () => {
    trackEvent('click_email', {
      event_category: 'contact',
    });
  },

  clickLinkedIn: () => {
    trackEvent('click_linkedin', {
      event_category: 'contact',
    });
  },

  clickPhone: () => {
    trackEvent('click_phone', {
      event_category: 'contact',
    });
  },
};

/**
 * Track navigation events
 */
export const navigationEvents = {
  clickNavigation: (destination: string) => {
    trackEvent('click_navigation', {
      destination,
      event_category: 'navigation',
    });
  },

  clickCTA: (ctaName: string, ctaLocation: string) => {
    trackEvent('click_cta', {
      cta_name: ctaName,
      cta_location: ctaLocation,
      event_category: 'engagement',
    });
  },

  downloadResume: () => {
    trackEvent('download_resume', {
      event_category: 'engagement',
    });
  },
};

/**
 * Track user engagement metrics
 */
export const engagementEvents = {
  timeOnPage: (pageName: string, seconds: number) => {
    trackEvent('time_on_page', {
      page_name: pageName,
      duration_seconds: seconds,
      event_category: 'engagement',
    });
  },

  scrollDepth: (percentage: number) => {
    trackEvent('scroll_depth', {
      scroll_percentage: percentage,
      event_category: 'engagement',
    });
  },

  videoPlay: (videoId: string) => {
    trackEvent('video_play', {
      video_id: videoId,
      event_category: 'engagement',
    });
  },
};

/**
 * Track errors
 */
export function trackError(error: Error, errorInfo?: any): void {
  trackEvent('error', {
    error_message: error.message,
    error_stack: error.stack,
    error_info: JSON.stringify(errorInfo),
    event_category: 'error',
  });
}

/**
 * Get client ID for user tracking
 */
export function getClientId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Try to get GA client ID
  const cookies = document.cookie.split(';');
  const gaCookie = cookies.find(c => c.trim().startsWith('_ga='));
  
  if (gaCookie) {
    const parts = gaCookie.split('.');
    if (parts.length >= 4) {
      return `${parts[2]}.${parts[3]}`;
    }
  }

  return null;
}
