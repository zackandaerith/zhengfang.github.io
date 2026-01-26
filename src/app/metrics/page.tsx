import React from 'react';
import { Metadata } from 'next';
import { MetricsDisplay } from '@/components/MetricsDisplay';
import { SocialShare } from '@/components/SocialShare';
import { SocialLinks } from '@/components/SocialLinks';
import { getAllMetrics, getKeyMetrics } from '@/utils/metrics';
import profileData from '@/data/profile.json';

export const metadata: Metadata = {
  title: `Metrics - ${profileData.personalInfo.name} | Customer Success Manager`,
  description: `Comprehensive performance metrics showcasing ${profileData.personalInfo.name}'s proven track record in customer success, including satisfaction rates, engagement improvements, and efficiency gains.`,
};

export default function MetricsPage() {
  const allMetrics = getAllMetrics();
  const keyMetrics = getKeyMetrics();
  const { name } = profileData.personalInfo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            <a href="/">{name}</a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Home
            </a>
            <a href="/about" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              About
            </a>
            <a href="/portfolio" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Portfolio
            </a>
            <a href="/metrics" className="text-primary-600 dark:text-primary-400 font-semibold">
              Metrics
            </a>
            <a href="/contact" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Contact
            </a>
            <div className="ml-4">
              <SocialLinks variant="horizontal" size="sm" />
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Performance Metrics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Comprehensive performance indicators showcasing proven track record in customer experience, 
            operational efficiency, and business growth across multiple roles and organizations.
          </p>
          
          {/* Share Metrics */}
          <div className="flex justify-center items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Share these metrics:</span>
            <SocialShare 
              title={`${name} - Customer Success Performance Metrics`}
              description={`Comprehensive performance metrics showcasing proven results in customer success management.`}
              variant="buttons"
            />
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="space-y-12 max-w-7xl mx-auto">
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
        <div className="mt-16 max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About These Metrics
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These metrics represent real achievements and performance indicators from {name}'s
              professional experience in customer success management, product expertise, and strategic leadership roles.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Data Sources
                </h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Professional roles and strategic initiatives</li>
                  <li>• Project performance and outcomes</li>
                  <li>• Customer feedback and satisfaction scores</li>
                  <li>• Operational efficiency improvements</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Metric Categories
                </h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <span className="text-primary-500">Retention:</span> Customer loyalty and engagement</li>
                  <li>• <span className="text-green-500">Growth:</span> Business expansion and adoption</li>
                  <li>• <span className="text-yellow-500">Satisfaction:</span> Customer happiness scores</li>
                  <li>• <span className="text-purple-500">Efficiency:</span> Operational improvements</li>
                  <li>• <span className="text-red-500">Revenue:</span> Financial impact and ROI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Connect Section */}
        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="/contact" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
            >
              Discuss These Results
            </a>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Connect with me:</span>
              <SocialLinks variant="horizontal" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
