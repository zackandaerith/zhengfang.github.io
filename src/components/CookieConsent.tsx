'use client';

import React, { useState, useEffect } from 'react';
import { updateConsent, hasAnalyticsConsent } from '@/utils/analytics';

/**
 * Cookie consent banner component
 * Implements privacy compliance for analytics
 */
export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('analytics_consent');
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    updateConsent(true);
    setShowBanner(false);
  };

  const handleDecline = () => {
    updateConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50 animate-slide-up">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm">
              We use cookies to analyze site traffic and improve your experience. 
              Your data is anonymized and we respect your privacy.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm border border-gray-600 rounded hover:bg-gray-800 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
