import { Metadata } from 'next';
import { SocialLinks } from '@/components/SocialLinks';

export const metadata: Metadata = {
  title: 'John Fang - Customer Success Manager',
  description: 'Welcome to John Fang\'s professional customer success manager portfolio showcasing achievements, metrics, and case studies.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            John Fang
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/about" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
              About
            </a>
            <a href="/portfolio" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
              Portfolio
            </a>
            <a href="/metrics" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
              Metrics
            </a>
            <a href="/contact" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
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
            John Fang
            <span className="text-blue-600 dark:text-blue-400 block text-4xl md:text-5xl mt-2">
              Customer Success Manager
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up">
            Driving customer retention, growth, and satisfaction through data-driven strategies and exceptional relationship management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up mb-8">
            <a 
              href="/portfolio"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
            >
              View Portfolio
            </a>
            <a 
              href="/contact"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
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
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">95%</div>
            <div className="text-gray-600 dark:text-gray-300">Customer Satisfaction Rating</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">80%</div>
            <div className="text-gray-600 dark:text-gray-300">Customer Engagement Improvement</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">25%</div>
            <div className="text-gray-600 dark:text-gray-300">Project Delivery Efficiency</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400">
              &copy; 2024 John Fang. Built with Next.js and Tailwind CSS.
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
