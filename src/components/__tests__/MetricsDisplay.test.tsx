import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MetricsDisplay } from '../MetricsDisplay';
import { Metric } from '@/types';

const mockMetrics: Metric[] = [
  {
    id: 'test-metric-1',
    name: 'Customer Satisfaction',
    value: 95,
    unit: '%',
    description: 'Customer satisfaction rating',
    category: 'satisfaction',
    timeframe: '2023-2024',
    context: 'Test context',
  },
  {
    id: 'test-metric-2',
    name: 'Revenue Growth',
    value: 150,
    unit: '%',
    description: 'Revenue growth percentage',
    category: 'growth',
    timeframe: '2023-2024',
    context: 'Test context',
  },
];

describe('MetricsDisplay', () => {
  it('renders with default props', () => {
    render(<MetricsDisplay metrics={mockMetrics} />);
    
    expect(screen.getByText('Customer Success Metrics')).toBeInTheDocument();
    expect(screen.getByText('Key performance indicators and achievements')).toBeInTheDocument();
  });

  it('renders custom title and subtitle', () => {
    render(
      <MetricsDisplay
        metrics={mockMetrics}
        title="Custom Title"
        subtitle="Custom Subtitle"
      />
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });

  it('renders cards layout', () => {
    render(<MetricsDisplay metrics={mockMetrics} layout="cards" />);
    
    expect(screen.getByText('Customer Satisfaction')).toBeInTheDocument();
    expect(screen.getByText('Revenue Growth')).toBeInTheDocument();
  });

  it('renders chart layout', () => {
    render(<MetricsDisplay metrics={mockMetrics} layout="chart" />);
    
    expect(screen.getByText('Performance Metrics Visualization')).toBeInTheDocument();
  });

  it('renders dashboard layout by default', () => {
    render(<MetricsDisplay metrics={mockMetrics} />);
    
    expect(screen.getByText('Key Performance Highlights')).toBeInTheDocument();
    expect(screen.getByText('Filter by Category:')).toBeInTheDocument();
  });

  it('handles empty metrics array', () => {
    render(<MetricsDisplay metrics={[]} />);
    
    expect(screen.getByText('No metrics available to display.')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MetricsDisplay metrics={mockMetrics} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});