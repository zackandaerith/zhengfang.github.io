import React from 'react';
import { MetricsDisplay } from '@/components/MetricsDisplay';
import { getAllMetrics, getKeyMetrics } from '@/utils/metrics';

export default function MetricsPage() {
  const allMetrics = getAllMetrics();
  const keyMetrics = getKeyMetrics();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            John Fang's Customer Success Metrics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive performance indicators showcasing proven track record in customer experience, 
            operational efficiency, and business growth across multiple roles and organizations.
          </p>
        </div>

        {/* Dashboard Layout */}
        <div className="space-y-12">
          {/* Main Dashboard */}
          <section>
            <MetricsDisplay
              metrics={allMetrics}
              layout="dashboard"
              title="Performance Dashboard"
              subtitle="Interactive metrics dashboard with filtering and visualization"
            />
          </section>

          {/* Key Metrics Cards */}
          <section>
            <MetricsDisplay
              metrics={keyMetrics}
              layout="cards"
              title="Key Performance Highlights"
              subtitle="Most impactful achievements and performance indicators"
            />
          </section>

          {/* Chart Visualization */}
          <section>
            <MetricsDisplay
              metrics={allMetrics}
              layout="chart"
              title="Metrics Visualization"
              subtitle="Visual representation of all performance data"
            />
          </section>
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About These Metrics
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These metrics represent real achievements and performance indicators from John Fang's 
              professional experience in customer success management, product expertise, and strategic leadership roles.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Data Sources
                </h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Apple Customer Experience & Strategy Lead role</li>
                  <li>• Product Expert performance metrics</li>
                  <li>• Project management achievements</li>
                  <li>• Research and academic contributions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Metric Categories
                </h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <span className="text-blue-500">Retention:</span> Customer loyalty and engagement</li>
                  <li>• <span className="text-green-500">Growth:</span> Business expansion and adoption</li>
                  <li>• <span className="text-yellow-500">Satisfaction:</span> Customer happiness scores</li>
                  <li>• <span className="text-purple-500">Efficiency:</span> Operational improvements</li>
                  <li>• <span className="text-red-500">Revenue:</span> Financial impact and ROI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}