/**
 * Section Component
 * 
 * A responsive section component that provides consistent spacing and layout
 * for different content sections across the website.
 * 
 * Validates: Requirements 3.1, 3.2, 3.3
 */

import React from 'react';
import { clsx } from 'clsx';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'gray' | 'primary' | 'transparent';
  id?: string;
}

const spacingClasses = {
  none: 'py-0',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16 lg:py-20',
  lg: 'py-16 md:py-20 lg:py-24',
  xl: 'py-20 md:py-24 lg:py-32',
};

const backgroundClasses = {
  white: 'bg-white dark:bg-gray-900',
  gray: 'bg-gray-50 dark:bg-gray-800',
  primary: 'bg-primary-50 dark:bg-primary-900/20',
  transparent: 'bg-transparent',
};

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  spacing = 'md',
  background = 'transparent',
  id,
}) => {
  return (
    <section
      id={id}
      className={clsx(
        'w-full',
        spacingClasses[spacing],
        backgroundClasses[background],
        className
      )}
    >
      {children}
    </section>
  );
};
