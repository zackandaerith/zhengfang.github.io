import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to my professional customer success manager portfolio showcasing achievements, metrics, and case studies.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            CS Portfolio
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              About
            </a>
            <a href="#portfolio" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Portfolio
            </a>
            <a href="#contact" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Contact
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Customer Success
            <span className="text-primary-600 dark:text-primary-400 block">
              Manager
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up">
            Driving customer retention, growth, and satisfaction through data-driven strategies and exceptional relationship management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl">
              View Portfolio
            </button>
            <button className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Download Resume
            </button>
          </div>
        </div>

        {/* Key Metrics Preview */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft hover:shadow-medium transition-shadow">
            <div className="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">95%</div>
            <div className="text-gray-600 dark:text-gray-300">Customer Retention Rate</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft hover:shadow-medium transition-shadow">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">150%</div>
            <div className="text-gray-600 dark:text-gray-300">Revenue Growth</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft hover:shadow-medium transition-shadow">
            <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">4.8/5</div>
            <div className="text-gray-600 dark:text-gray-300">Customer Satisfaction</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 Customer Success Manager Portfolio. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
