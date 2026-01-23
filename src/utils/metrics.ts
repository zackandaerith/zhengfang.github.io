import { Metric } from '@/types';
import metricsData from '@/data/metrics.json';

/**
 * Load all metrics data
 */
export function getAllMetrics(): Metric[] {
  return metricsData.map(metric => ({
    ...metric,
    // Ensure proper typing
    value: metric.value,
    unit: metric.unit,
    category: metric.category as 'retention' | 'growth' | 'satisfaction' | 'efficiency' | 'revenue',
  }));
}

/**
 * Get metrics by category
 */
export function getMetricsByCategory(category: string): Metric[] {
  const allMetrics = getAllMetrics();
  return allMetrics.filter(metric => metric.category === category);
}

/**
 * Get key performance metrics (featured metrics)
 */
export function getKeyMetrics(): Metric[] {
  const allMetrics = getAllMetrics();
  const keyMetricIds = [
    'metric-cs-engagement',
    'metric-nps-current',
    'metric-operational-efficiency-high',
    'metric-customer-retention',
  ];
  
  return keyMetricIds
    .map(id => allMetrics.find(metric => metric.id === id))
    .filter(Boolean) as Metric[];
}

/**
 * Get metrics with trending data
 */
export function getTrendingMetrics(): Metric[] {
  const allMetrics = getAllMetrics();
  return allMetrics.filter(metric => (metric as any).trend === 'up');
}

/**
 * Get metrics by timeframe
 */
export function getMetricsByTimeframe(timeframe: string): Metric[] {
  const allMetrics = getAllMetrics();
  return allMetrics.filter(metric => 
    metric.timeframe.toLowerCase().includes(timeframe.toLowerCase())
  );
}

/**
 * Calculate category statistics
 */
export function getCategoryStats(): Record<string, { count: number; avgValue: number; trending: number }> {
  const allMetrics = getAllMetrics();
  const categories = ['retention', 'growth', 'satisfaction', 'efficiency', 'revenue'];
  
  return categories.reduce((stats, category) => {
    const categoryMetrics = allMetrics.filter(m => m.category === category);
    const numericMetrics = categoryMetrics.filter(m => typeof m.value === 'number');
    const trendingMetrics = categoryMetrics.filter(m => (m as any).trend === 'up');
    
    stats[category] = {
      count: categoryMetrics.length,
      avgValue: numericMetrics.length > 0 
        ? Math.round(numericMetrics.reduce((sum, m) => sum + (m.value as number), 0) / numericMetrics.length)
        : 0,
      trending: trendingMetrics.length,
    };
    
    return stats;
  }, {} as Record<string, { count: number; avgValue: number; trending: number }>);
}

/**
 * Format metric value for display
 */
export function formatMetricValue(value: number | string, unit: string): string {
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
}

/**
 * Get metric color by category
 */
export function getMetricCategoryColor(category: string): string {
  const colors = {
    retention: '#3B82F6',
    growth: '#10B981',
    satisfaction: '#F59E0B',
    efficiency: '#8B5CF6',
    revenue: '#EF4444',
  };
  return colors[category as keyof typeof colors] || '#6B7280';
}

/**
 * Get metric icon by category
 */
export function getMetricCategoryIcon(category: string): string {
  const icons = {
    retention: '🔄',
    growth: '📈',
    satisfaction: '😊',
    efficiency: '⚡',
    revenue: '💰',
  };
  return icons[category as keyof typeof icons] || '📊';
}

/**
 * Search metrics by name or description
 */
export function searchMetrics(query: string): Metric[] {
  const allMetrics = getAllMetrics();
  const lowercaseQuery = query.toLowerCase();
  
  return allMetrics.filter(metric =>
    metric.name.toLowerCase().includes(lowercaseQuery) ||
    metric.description.toLowerCase().includes(lowercaseQuery) ||
    metric.context.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get metrics summary for dashboard
 */
export function getMetricsSummary() {
  const allMetrics = getAllMetrics();
  const categoryStats = getCategoryStats();
  
  return {
    totalMetrics: allMetrics.length,
    categories: Object.keys(categoryStats).length,
    trendingUp: allMetrics.filter(m => (m as any).trend === 'up').length,
    averageScore: Math.round(
      allMetrics
        .filter(m => typeof m.value === 'number')
        .reduce((sum, m) => sum + (m.value as number), 0) / 
      allMetrics.filter(m => typeof m.value === 'number').length
    ) || 0,
    categoryStats,
  };
}