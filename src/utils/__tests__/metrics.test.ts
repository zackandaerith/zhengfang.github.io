import {
  getAllMetrics,
  getMetricsByCategory,
  getKeyMetrics,
  getTrendingMetrics,
  getMetricsByTimeframe,
  getCategoryStats,
  formatMetricValue,
  getMetricCategoryColor,
  getMetricCategoryIcon,
  searchMetrics,
  getMetricsSummary,
} from '../metrics';

// Mock the metrics data
jest.mock('@/data/metrics.json', () => [
  {
    id: 'metric-1',
    name: 'Customer Satisfaction',
    value: 95,
    unit: '%',
    description: 'Customer satisfaction rating',
    category: 'satisfaction',
    timeframe: '2023-2024',
    context: 'Test context',
    trend: 'up',
    icon: '😊',
  },
  {
    id: 'metric-cs-engagement',
    name: 'Customer Engagement',
    value: 80,
    unit: '%',
    description: 'Customer engagement improvement',
    category: 'growth',
    timeframe: '2023-2024',
    context: 'Test context',
    trend: 'up',
    icon: '📈',
  },
  {
    id: 'metric-nps-current',
    name: 'Net Promoter Score',
    value: 98,
    unit: 'NPS',
    description: 'Current NPS score',
    category: 'satisfaction',
    timeframe: '2024',
    context: 'Test context',
    trend: 'stable',
    icon: '⭐',
  },
]);

describe('Metrics Utilities', () => {
  describe('getAllMetrics', () => {
    it('returns all metrics with proper typing', () => {
      const metrics = getAllMetrics();
      
      expect(metrics).toHaveLength(3);
      expect(metrics[0]).toHaveProperty('id');
      expect(metrics[0]).toHaveProperty('name');
      expect(metrics[0]).toHaveProperty('value');
      expect(metrics[0]).toHaveProperty('category');
    });
  });

  describe('getMetricsByCategory', () => {
    it('filters metrics by category', () => {
      const satisfactionMetrics = getMetricsByCategory('satisfaction');
      
      expect(satisfactionMetrics).toHaveLength(2);
      expect(satisfactionMetrics.every(m => m.category === 'satisfaction')).toBe(true);
    });

    it('returns empty array for non-existent category', () => {
      const nonExistentMetrics = getMetricsByCategory('nonexistent');
      
      expect(nonExistentMetrics).toHaveLength(0);
    });
  });

  describe('getKeyMetrics', () => {
    it('returns key metrics based on predefined IDs', () => {
      const keyMetrics = getKeyMetrics();
      
      expect(keyMetrics.length).toBeGreaterThan(0);
      expect(keyMetrics.some(m => m.id === 'metric-cs-engagement')).toBe(true);
      expect(keyMetrics.some(m => m.id === 'metric-nps-current')).toBe(true);
    });
  });

  describe('getTrendingMetrics', () => {
    it('returns only metrics with upward trend', () => {
      const trendingMetrics = getTrendingMetrics();
      
      expect(trendingMetrics).toHaveLength(2);
      expect(trendingMetrics.every(m => (m as any).trend === 'up')).toBe(true);
    });
  });

  describe('getMetricsByTimeframe', () => {
    it('filters metrics by timeframe', () => {
      const metrics2024 = getMetricsByTimeframe('2024');
      
      expect(metrics2024.length).toBeGreaterThan(0);
      expect(metrics2024.every(m => m.timeframe.includes('2024'))).toBe(true);
    });
  });

  describe('getCategoryStats', () => {
    it('calculates statistics for each category', () => {
      const stats = getCategoryStats();
      
      expect(stats).toHaveProperty('satisfaction');
      expect(stats).toHaveProperty('growth');
      expect(stats.satisfaction.count).toBe(2);
      expect(stats.growth.count).toBe(1);
    });
  });

  describe('formatMetricValue', () => {
    it('formats percentage values', () => {
      expect(formatMetricValue(95, '%')).toBe('95%');
    });

    it('formats million values', () => {
      expect(formatMetricValue(2.5, 'M')).toBe('$2.5M');
    });

    it('formats NPS values', () => {
      expect(formatMetricValue(84, 'NPS')).toBe('84');
    });

    it('formats position values', () => {
      expect(formatMetricValue(5, 'positions')).toBe('+5');
    });

    it('handles string values', () => {
      expect(formatMetricValue('high', 'rating')).toBe('highrating');
    });
  });

  describe('getMetricCategoryColor', () => {
    it('returns correct colors for categories', () => {
      expect(getMetricCategoryColor('satisfaction')).toBe('#F59E0B');
      expect(getMetricCategoryColor('growth')).toBe('#10B981');
      expect(getMetricCategoryColor('retention')).toBe('#3B82F6');
      expect(getMetricCategoryColor('efficiency')).toBe('#8B5CF6');
      expect(getMetricCategoryColor('revenue')).toBe('#EF4444');
    });

    it('returns default color for unknown category', () => {
      expect(getMetricCategoryColor('unknown')).toBe('#6B7280');
    });
  });

  describe('getMetricCategoryIcon', () => {
    it('returns correct icons for categories', () => {
      expect(getMetricCategoryIcon('satisfaction')).toBe('😊');
      expect(getMetricCategoryIcon('growth')).toBe('📈');
      expect(getMetricCategoryIcon('retention')).toBe('🔄');
      expect(getMetricCategoryIcon('efficiency')).toBe('⚡');
      expect(getMetricCategoryIcon('revenue')).toBe('💰');
    });

    it('returns default icon for unknown category', () => {
      expect(getMetricCategoryIcon('unknown')).toBe('📊');
    });
  });

  describe('searchMetrics', () => {
    it('searches by name', () => {
      const results = searchMetrics('satisfaction');
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toContain('Satisfaction');
    });

    it('searches by description', () => {
      const results = searchMetrics('engagement');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(m => m.description.toLowerCase().includes('engagement'))).toBe(true);
    });

    it('is case insensitive', () => {
      const results = searchMetrics('CUSTOMER');
      
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('getMetricsSummary', () => {
    it('returns comprehensive summary', () => {
      const summary = getMetricsSummary();
      
      expect(summary).toHaveProperty('totalMetrics');
      expect(summary).toHaveProperty('categories');
      expect(summary).toHaveProperty('trendingUp');
      expect(summary).toHaveProperty('averageScore');
      expect(summary).toHaveProperty('categoryStats');
      
      expect(summary.totalMetrics).toBe(3);
      expect(summary.trendingUp).toBe(2);
    });
  });
});