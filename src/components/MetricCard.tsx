'use client';

import React from 'react';
import { Metric } from '@/types';

interface MetricCardProps {
  metric: Metric;
  size?: 'small' | 'medium' | 'large';
  showTrend?: boolean;
  showContext?: boolean;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  size = 'medium',
  showTrend = true,
  showContext = true,
  className = '',
}) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      retention: 'bg-blue-500',
      growth: 'bg-green-500',
      satisfaction: 'bg-yellow-500',
      efficiency: 'bg-purple-500',
      revenue: 'bg-red-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryBgColor = (category: string) => {
    const colors = {
      retention: 'bg-blue-50 dark:bg-blue-900/20',
      growth: 'bg-green-50 dark:bg-green-900/20',
      satisfaction: 'bg-yellow-50 dark:bg-yellow-900/20',
      efficiency: 'bg-purple-50 dark:bg-purple-900/20',
      revenue: 'bg-red-50 dark:bg-red-900/20',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-50 dark:bg-gray-900/20';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '📊';
    }
  };

  const formatValue = (value: number | string, unit: string) => {
    if (typeof value === 'string') return `${value}${unit}`;
    
    if (unit === 'M' || unit === 'million') {
      return `$${value}M`;
    }
    if (unit === 'K' || unit === 'thousand') {
      return `${value}K`;
    }
    if (unit === '%') {
      return `${value}%`;
    }
    if (unit === 'NPS') {
      return `${value}`;
    }
    if (unit === 'positions') {
      return `+${value}`;
    }
    
    return `${value}${unit}`;
  };

  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  const textSizeClasses = {
    small: {
      value: 'text-2xl',
      name: 'text-sm',
      description: 'text-xs',
    },
    medium: {
      value: 'text-3xl',
      name: 'text-base',
      description: 'text-sm',
    },
    large: {
      value: 'text-4xl',
      name: 'text-lg',
      description: 'text-base',
    },
  };

  // Extract icon from metric if available
  const icon = (metric as any).icon || '📊';
  const trend = (metric as any).trend || 'stable';

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700
        ${getCategoryBgColor(metric.category)}
        hover:shadow-lg transition-all duration-300 hover:scale-105
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Category indicator */}
      <div className={`absolute top-0 left-0 w-full h-1 ${getCategoryColor(metric.category)}`} />
      
      {/* Header with icon and trend */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{icon}</span>
          {showTrend && (
            <span className="text-lg" title={`Trend: ${trend}`}>
              {getTrendIcon(trend)}
            </span>
          )}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(metric.category)}`}>
          {metric.category.toUpperCase()}
        </div>
      </div>

      {/* Value */}
      <div className={`font-bold text-gray-900 dark:text-white mb-2 ${textSizeClasses[size].value}`}>
        {formatValue(metric.value, metric.unit)}
      </div>

      {/* Name */}
      <h3 className={`font-semibold text-gray-800 dark:text-gray-200 mb-2 ${textSizeClasses[size].name}`}>
        {metric.name}
      </h3>

      {/* Description */}
      <p className={`text-gray-600 dark:text-gray-400 mb-3 ${textSizeClasses[size].description}`}>
        {metric.description}
      </p>

      {/* Context and timeframe */}
      {showContext && (
        <div className="space-y-1">
          <div className={`text-gray-500 dark:text-gray-500 ${textSizeClasses[size].description}`}>
            <span className="font-medium">Period:</span> {metric.timeframe}
          </div>
          <div className={`text-gray-500 dark:text-gray-500 ${textSizeClasses[size].description}`}>
            <span className="font-medium">Context:</span> {metric.context}
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;