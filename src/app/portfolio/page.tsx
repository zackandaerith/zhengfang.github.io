import { Metadata } from 'next';
import { MetricsDisplay } from '@/components/MetricsDisplay';
import { CaseStudyShowcaseClient } from '@/components/CaseStudyShowcaseClient';
import { getAllMetrics, getKeyMetrics } from '@/utils/metrics';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Explore my customer success case studies, achievements, and measurable outcomes that demonstrate proven results.',
};

export default function Portfolio() {
  const allMetrics = getAllMetrics();
  const keyMetrics = getKeyMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            <a href="/">CS Portfolio</a>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Home
            </a>
            <a href="/about" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              About
            </a>
            <a href="/portfolio" className="text-primary-600 dark:text-primary-400 font-semibold">
              Portfolio
            </a>
            <a href="/contact" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Contact
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Portfolio
          </h1>
          
          {/* Case Studies Section */}
          <div className="mb-16">
            <CaseStudyShowcaseClient className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8" />
          </div>

          {/* Interactive Metrics Dashboard */}
          <div className="mb-16">
            <MetricsDisplay
              metrics={allMetrics}
              layout="dashboard"
              title="Performance Metrics Dashboard"
              subtitle="Comprehensive view of customer success achievements and key performance indicators"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8"
            />
          </div>

          {/* Key Metrics */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Key Performance Highlights
            </h2>
            <MetricsDisplay
              metrics={keyMetrics}
              layout="cards"
            />
          </div>

          <div className="text-center mt-12">
            <a 
              href="/contact" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl inline-block"
            >
              Let's Work Together
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}