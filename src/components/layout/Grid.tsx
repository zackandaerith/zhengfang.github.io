/**
 * Grid Component
 * 
 * A mobile-first responsive grid system built with Tailwind CSS.
 * Provides flexible column layouts that adapt to different screen sizes.
 * 
 * Validates: Requirements 3.1, 3.2, 3.3
 */

import React from 'react';
import { clsx } from 'clsx';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

const getColClasses = (cols: GridProps['cols']) => {
  const classes: string[] = [];
  
  if (cols?.default) classes.push(`grid-cols-${cols.default}`);
  if (cols?.sm) classes.push(`sm:grid-cols-${cols.sm}`);
  if (cols?.md) classes.push(`md:grid-cols-${cols.md}`);
  if (cols?.lg) classes.push(`lg:grid-cols-${cols.lg}`);
  if (cols?.xl) classes.push(`xl:grid-cols-${cols.xl}`);
  
  return classes.join(' ');
};

export const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md',
}) => {
  return (
    <div
      className={clsx(
        'grid',
        getColClasses(cols),
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};
