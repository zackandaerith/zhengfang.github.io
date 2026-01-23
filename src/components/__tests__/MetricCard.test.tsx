import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MetricCard } from '../MetricCard';
import { Metric } from '@/types';

const mockMetric: Metric = {
  id: 'test-metric',
  name: 'Customer Satisfaction',
  value: 95,
  unit: '%',
  description: 'Customer satisfaction rating from surveys',
  category: 'satisfaction',
  timeframe: '2023-2024',
  context: 'Product Expert role at Apple',
};

const mockMetricWithExtras = {
  ...mockMetric,
  icon: '😊',
  trend: 'up',
} as Metric & { icon: string; trend: string };

describe('MetricCard', () => {
  it('renders metric information correctly', () => {
    render(<MetricCard metric={mockMetric} />);
    
    expect(screen.getByText('Customer Satisfaction')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('Customer satisfaction rating from surveys')).toBeInTheDocument();
    expect(screen.getByText('Period: 2023-2024')).toBeInTheDocument();
    expect(screen.getByText('Context: Product Expert role at Apple')).toBeInTheDocument();
  });

  it('displays category badge', () => {
    render(<MetricCard metric={mockMetric} />);
    
    expect(screen.getByText('SATISFACTION')).toBeInTheDocument();
  });

  it('formats different value types correctly', () => {
    const revenueMetric: Metric = {
      ...mockMetric,
      id: 'revenue-metric',
      name: 'Revenue Impact',
      value: 2.5,
      unit: 'M',
      category: 'revenue',
    };
    
    render(<MetricCard metric={revenueMetric} />);
    expect(screen.getByText('$2.5M')).toBeInTheDocument();
  });

  it('handles NPS unit correctly', () => {
    const npsMetric: Metric = {
      ...mockMetric,
      id: 'nps-metric',
      name: 'Net Promoter Score',
      value: 84,
      unit: 'NPS',
      category: 'satisfaction',
    };
    
    render(<MetricCard metric={npsMetric} />);
    expect(screen.getByText('84')).toBeInTheDocument();
  });

  it('handles positions unit correctly', () => {
    const positionMetric: Metric = {
      ...mockMetric,
      id: 'position-metric',
      name: 'Market Ranking Improvement',
      value: 5,
      unit: 'positions',
      category: 'growth',
    };
    
    render(<MetricCard metric={positionMetric} />);
    expect(screen.getByText('+5')).toBeInTheDocument();
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(<MetricCard metric={mockMetric} size="small" />);
    expect(screen.getByText('95%')).toHaveClass('text-2xl');
    
    rerender(<MetricCard metric={mockMetric} size="large" />);
    expect(screen.getByText('95%')).toHaveClass('text-4xl');
  });

  it('shows trend when showTrend is true', () => {
    render(<MetricCard metric={mockMetricWithExtras} showTrend={true} />);
    
    // Should show trend icon (📈 for 'up' trend)
    expect(screen.getByTitle('Trend: up')).toBeInTheDocument();
  });

  it('hides context when showContext is false', () => {
    render(<MetricCard metric={mockMetric} showContext={false} />);
    
    expect(screen.queryByText('Period: 2023-2024')).not.toBeInTheDocument();
    expect(screen.queryByText('Context: Product Expert role at Apple')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MetricCard metric={mockMetric} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('displays icon when available', () => {
    render(<MetricCard metric={mockMetricWithExtras} />);
    
    expect(screen.getByText('😊')).toBeInTheDocument();
  });
});