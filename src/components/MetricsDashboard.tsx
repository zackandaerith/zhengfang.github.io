'use client';

import React, { useState } from 'react';
import { Metric } from '@/types';
import { MetricCard } from './MetricCard';
import { MetricsChart } from './MetricsChart';

interface MetricsDashboardProps {
  metrics: Metric[];
  className?: string;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  metrics,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'donut'>('bar');

  // Group metrics by category
  const metricsByCategory = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, Metric[]>);

  const categories = Object.keys(metricsByCategory);
  const filteredMetrics = selectedCategory === 'all' 
    ? metrics 
    : metricsByCategory[selectedCategory] || [];

  // Get key metrics for highlight cards
  const keyMetrics = [
    metrics.find(m => m.id === 'metric-cs-engagement'),
    metrics.find(m => m.id === 'metric-nps-current'),
    metrics.find(m => m.id === 'metric-operational-efficiency-high'),
    metrics.find(m => m.id === 'metric-customer-retention'),
  ].filter(Boolean) as Metric[];

  const getCategoryIcon = (category: string) => {
    const icons = {
      retention: '🔄',
      growth: '📈',
      satisfaction: '😊',
      efficiency: '⚡',
      revenue: '💰',
    };
    return icons[category as keyof typeof icons] || '📊';
  };

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

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Key Metrics Highlight */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Key Performance Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              size="medium"
              showContext={false}
            />
          ))}
        </div>
      </section>

      {/* Category Filter */}
      <section>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Filter by Category:
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Metrics ({metrics.length})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                  selectedCategory === category
                    ? `${getCategoryColor(category)} text-white`
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <span>{getCategoryIcon(category)}</span>
                <span>{category.charAt(0).toUpperCase() + category.slice(1)} ({metricsByCategory[category].length})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Chart Visualization */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
            Metrics Visualization
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Chart Type:</span>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'donut')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="donut">Donut Chart</option>
            </select>
          </div>
        </div>
        
        {filteredMetrics.length > 0 ? (
          <MetricsChart
            metrics={filteredMetrics}
            chartType={chartType}
            height={400}
            showLegend={true}
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No metrics available for the selected category.
            </p>
          </div>
        )}
      </section>

      {/* Detailed Metrics Grid */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Detailed Metrics
          {selectedCategory !== 'all' && (
            <span className="ml-2 text-base font-normal text-gray-600 dark:text-gray-400">
              - {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            </span>
          )}
        </h3>
        
        {filteredMetrics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMetrics.map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                size="medium"
                showTrend={true}
                showContext={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No metrics available for the selected category.
            </p>
          </div>
        )}
      </section>

      {/* Summary Statistics */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Summary Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metrics.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Metrics
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Categories
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {metrics.filter(m => (m as any).trend === 'up').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Improving
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {Math.round(metrics.filter(m => typeof m.value === 'number').reduce((sum, m) => sum + (m.value as number), 0) / metrics.filter(m => typeof m.value === 'number').length) || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Score
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MetricsDashboard;