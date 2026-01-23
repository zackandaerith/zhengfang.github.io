import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about my professional background, career journey, skills, and expertise in customer success management.',
};

export default function About() {
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
            <a href="/about" className="text-primary-600 dark:text-primary-400 font-semibold">
              About
            </a>
            <a href="/portfolio" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            About Me
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Professional Background
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              As a dedicated Customer Success Manager with over 5 years of experience, I specialize in 
              building lasting relationships with clients while driving measurable business outcomes. 
              My approach combines data-driven insights with personalized customer experiences to 
              achieve exceptional retention rates and revenue growth.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Core Competencies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  Customer Relationship Management
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  Data Analysis & Reporting
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  Account Growth Strategies
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  Cross-functional Collaboration
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  Process Optimization
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  Customer Success Metrics
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="/portfolio" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl inline-block"
            >
              View My Work
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}