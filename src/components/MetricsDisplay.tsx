'use client';

import React from 'react';
import { Metric } from '@/types';
import { MetricCard } from './MetricCard';
import { MetricsChart } from './MetricsChart';
import { MetricsDashboard } from './MetricsDashboard';

interface MetricsDisplayProps {
  metrics: Metric[];
  layout?: 'cards' | 'chart' | 'dashboard';
  title?: string;
  subtitle?: string;
  className?: string;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  metrics,
  layout = 'dashboard',
  title = 'Customer Success Metrics',
  subtitle = 'Key performance indicators and achievements',
  className = '',
}) => {
  if (!metrics || metrics.length === 0) {
    return (
      <div className={`p-6 text-center text-gray-500 ${className}`}>
        <p>No metrics available to display.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (layout) {
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        );
      
      case 'chart':
        return <MetricsChart metrics={metrics} />;
      
      case 'dashboard':
      default:
        return <MetricsDashboard metrics={metrics} />;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default MetricsDisplay;