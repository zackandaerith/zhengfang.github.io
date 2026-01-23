'use client';

import React, { useMemo } from 'react';
import { Metric } from '@/types';

interface MetricsChartProps {
  metrics: Metric[];
  chartType?: 'bar' | 'line' | 'pie' | 'donut';
  height?: number;
  showLegend?: boolean;
  className?: string;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  metrics,
  chartType = 'bar',
  height = 400,
  showLegend = true,
  className = '',
}) => {
  const chartData = useMemo(() => {
    return metrics
      .filter(metric => typeof metric.value === 'number')
      .map(metric => ({
        ...metric,
        numericValue: metric.value as number,
      }));
  }, [metrics]);

  const maxValue = useMemo(() => {
    return Math.max(...chartData.map(d => d.numericValue));
  }, [chartData]);

  const getCategoryColor = (category: string) => {
    const colors = {
      retention: '#3B82F6',
      growth: '#10B981',
      satisfaction: '#F59E0B',
      efficiency: '#8B5CF6',
      revenue: '#EF4444',
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  const renderBarChart = () => (
    <div className="space-y-4">
      {chartData.map((metric, index) => {
        const percentage = (metric.numericValue / maxValue) * 100;
        const color = getCategoryColor(metric.category);
        
        return (
          <div key={metric.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {metric.name}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {metric.value}{metric.unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                  animation: `slideIn 1s ease-out ${index * 0.1}s both`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderLineChart = () => {
    const svgHeight = height - 60;
    const svgWidth = 600;
    const padding = 40;
    
    const points = chartData.map((metric, index) => {
      const x = padding + (index * (svgWidth - 2 * padding)) / (chartData.length - 1);
      const y = svgHeight - padding - ((metric.numericValue / maxValue) * (svgHeight - 2 * padding));
      return { x, y, metric };
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className="w-full overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="border border-gray-200 dark:border-gray-700 rounded-lg">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = svgHeight - padding - (ratio * (svgHeight - 2 * padding));
            return (
              <line
                key={ratio}
                x1={padding}
                y1={y}
                x2={svgWidth - padding}
                y2={y}
                stroke="#E5E7EB"
                strokeDasharray="2,2"
              />
            );
          })}
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={getCategoryColor(point.metric.category)}
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                className="text-xs fill-gray-600 dark:fill-gray-400"
              >
                {point.metric.value}{point.metric.unit}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderDonutChart = () => {
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const innerRadius = 60;
    
    const total = chartData.reduce((sum, metric) => sum + metric.numericValue, 0);
    let currentAngle = 0;

    return (
      <div className="flex items-center justify-center">
        <svg width="300" height="300" className="transform -rotate-90">
          {chartData.map((metric) => {
            const percentage = metric.numericValue / total;
            const angle = percentage * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);
            
            const x3 = centerX + innerRadius * Math.cos(endAngleRad);
            const y3 = centerY + innerRadius * Math.sin(endAngleRad);
            const x4 = centerX + innerRadius * Math.cos(startAngleRad);
            const y4 = centerY + innerRadius * Math.sin(startAngleRad);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `L ${x3} ${y3}`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={metric.id}
                d={pathData}
                fill={getCategoryColor(metric.category)}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          
          {/* Center text */}
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-lg font-bold fill-gray-900 dark:fill-white transform rotate-90"
            transform={`rotate(90 ${centerX} ${centerY})`}
          >
            Metrics
          </text>
        </svg>
      </div>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return renderLineChart();
      case 'pie':
      case 'donut':
        return renderDonutChart();
      case 'bar':
      default:
        return renderBarChart();
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Performance Metrics Visualization
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Visual representation of key performance indicators
        </p>
      </div>
      
      <div style={{ height: `${height}px` }} className="flex items-center justify-center">
        {renderChart()}
      </div>
      
      {showLegend && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {chartData.map((metric) => (
            <div key={metric.id} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getCategoryColor(metric.category) }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {metric.name}
              </span>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
          to {
            width: var(--final-width);
          }
        }
      `}</style>
    </div>
  );
};

export default MetricsChart;