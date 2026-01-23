'use client';

import React, { useState } from 'react';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'buttons' | 'dropdown';
}

interface SharePlatform {
  name: string;
  icon: string;
  color: string;
  getUrl: (url: string, title: string, description: string) => string;
}

const sharePlatforms: SharePlatform[] = [
  {
    name: 'LinkedIn',
    icon: '💼',
    color: 'text-blue-600 hover:text-blue-700',
    getUrl: (url, title, description) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`
  },
  {
    name: 'Twitter',
    icon: '🐦',
    color: 'text-blue-400 hover:text-blue-500',
    getUrl: (url, title) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  },
  {
    name: 'Email',
    icon: '📧',
    color: 'text-gray-600 hover:text-gray-700',
    getUrl: (url, title, description) => 
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
  },
  {
    name: 'Copy Link',
    icon: '🔗',
    color: 'text-gray-600 hover:text-gray-700',
    getUrl: (url) => url
  }
];

export const SocialShare: React.FC<SocialShareProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Check out this customer success portfolio',
  description = 'Professional customer success manager portfolio showcasing achievements and case studies.',
  className = '',
  variant = 'buttons'
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async (platform: SharePlatform) => {
    if (platform.name === 'Copy Link') {
      try {
        await navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    } else {
      const shareUrl = platform.getUrl(url, title, description);
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    if (variant === 'dropdown') {
      setIsDropdownOpen(false);
    }
  };

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Share options"
        >
          <span className="text-lg">📤</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Share</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
            <div className="py-2">
              {sharePlatforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleShare(platform)}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-lg">{platform.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {platform.name === 'Copy Link' && copySuccess ? 'Copied!' : platform.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Backdrop */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`flex space-x-3 ${className}`}>
      {sharePlatforms.map((platform) => (
        <button
          key={platform.name}
          onClick={() => handleShare(platform)}
          className={`
            w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 
            hover:bg-gray-200 dark:hover:bg-gray-700
            flex items-center justify-center transition-all duration-200
            hover:scale-105 ${platform.color}
          `}
          aria-label={`Share on ${platform.name}`}
          title={platform.name === 'Copy Link' && copySuccess ? 'Copied!' : `Share on ${platform.name}`}
        >
          <span className="text-lg">{platform.icon}</span>
        </button>
      ))}
    </div>
  );
};

export default SocialShare;