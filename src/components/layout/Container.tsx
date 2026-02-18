/**
 * Container Component
 * 
 * A responsive container component that provides consistent padding and max-width
 * across different screen sizes. Implements mobile-first responsive design.
 * 
 * Validates: Requirements 3.1, 3.2, 3.3
 */

import React from 'react';
import { clsx } from 'clsx';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1400px]',
  full: 'max-w-full',
};

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'lg',
  noPadding = false,
}) => {
  return (
    <div
      className={clsx(
        'mx-auto w-full',
        sizeClasses[size],
        !noPadding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
};
