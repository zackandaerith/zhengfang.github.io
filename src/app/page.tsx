import { Metadata } from 'next';
import { SocialLinks } from '@/components/SocialLinks';
import { getKeyMetrics, formatMetricValue } from '@/utils/metrics';
import profileData from '@/data/profile.json';

export const metadata: Metadata = {
  title: `${profileData.personalInfo.name} - Customer Success Manager`,
  description: `Welcome to ${profileData.personalInfo.name}'s professional customer success manager portfolio showcasing achievements, metrics, and case studies.`,
};

export default function Home() {
  const { name, title, summary } = profileData.personalInfo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {name}
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/about" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              About
            </a>
            <a href="/portfolio" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Portfolio
            </a>
            <a href="/metrics" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            {name}
            <span className="text-primary-600 dark:text-primary-400 block text-4xl md:text-5xl mt-2">
              {title}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up leading-relaxed">
            {summary}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up mb-8">
            <a 
              href="/portfolio"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
            >
              View Portfolio
            </a>
            <a 
              href="/contact"
              className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get In Touch
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center mb-12">
            <SocialLinks variant="horizontal" size="md" showLabels={false} />
          </div>
        </div>

        {/* Key Metrics Preview */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {getKeyMetrics().map((metric) => (
            <div key={metric.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {formatMetricValue(metric.value, metric.unit)}
              </div>
              <div className="text-gray-600 dark:text-gray-300">{metric.name}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} {name}. Built with Next.js and Tailwind CSS.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <SocialLinks variant="horizontal" size="sm" />
          </div>
        </div>
      </footer>
    </div>
  );
}
