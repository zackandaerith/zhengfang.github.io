'use client';

import React from 'react';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
  hoverColor: string;
}

interface SocialLinksProps {
  variant?: 'horizontal' | 'vertical' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/zheng-fang-johon/',
    icon: '💼',
    color: 'text-blue-600 dark:text-blue-400',
    hoverColor: 'hover:text-blue-700 dark:hover:text-blue-300'
  },
  {
    name: 'Email',
    url: 'mailto:john.fang0626@icloud.com',
    icon: '📧',
    color: 'text-gray-600 dark:text-gray-400',
    hoverColor: 'hover:text-gray-700 dark:hover:text-gray-300'
  },
  {
    name: 'Phone',
    url: 'tel:701-936-1040',
    icon: '📱',
    color: 'text-green-600 dark:text-green-400',
    hoverColor: 'hover:text-green-700 dark:hover:text-green-300'
  }
];

export const SocialLinks: React.FC<SocialLinksProps> = ({
  variant = 'horizontal',
  size = 'md',
  showLabels = false,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-8 h-8',
          icon: 'text-lg',
          text: 'text-sm'
        };
      case 'lg':
        return {
          container: 'w-16 h-16',
          icon: 'text-3xl',
          text: 'text-lg'
        };
      default:
        return {
          container: 'w-12 h-12',
          icon: 'text-xl',
          text: 'text-base'
        };
    }
  };

  const getLayoutClasses = () => {
    switch (variant) {
      case 'vertical':
        return 'flex flex-col space-y-4';
      case 'grid':
        return 'grid grid-cols-2 gap-4';
      default:
        return 'flex space-x-4';
    }
  };

  const sizeClasses = getSizeClasses();
  const layoutClasses = getLayoutClasses();

  return (
    <div className={`${layoutClasses} ${className}`}>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target={link.url.startsWith('http') ? '_blank' : '_self'}
          rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={`
            group flex items-center ${variant === 'vertical' || variant === 'grid' ? 'justify-start' : 'justify-center'}
            ${showLabels ? 'space-x-3' : ''}
            transition-all duration-200 hover:scale-105
          `}
          aria-label={`Connect on ${link.name}`}
        >
          <div className={`
            ${sizeClasses.container} 
            bg-gray-100 dark:bg-gray-800 
            rounded-lg flex items-center justify-center
            group-hover:bg-gray-200 dark:group-hover:bg-gray-700
            transition-colors duration-200
          `}>
            <span className={`${sizeClasses.icon} ${link.color} ${link.hoverColor} transition-colors duration-200`}>
              {link.icon}
            </span>
          </div>
          
          {showLabels && (
            <span className={`
              ${sizeClasses.text} font-medium 
              ${link.color} ${link.hoverColor} 
              transition-colors duration-200
            `}>
              {link.name}
            </span>
          )}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;