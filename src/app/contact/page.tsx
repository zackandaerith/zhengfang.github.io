import { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import profileData from '@/data/profile.json';

export const metadata: Metadata = {
  title: `Contact - ${profileData.personalInfo.name} | Customer Success Manager`,
  description: `Get in touch with ${profileData.personalInfo.name} to discuss customer success opportunities, collaborations, or to learn more about his experience in customer experience strategy.`,
};

export default function Contact() {
  const { name, email, phone, linkedIn, location } = profileData.personalInfo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            <a href="/">{name}</a>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Home
            </a>
            <a href="/about" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              About
            </a>
            <a href="/portfolio" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Portfolio
            </a>
            <a href="/metrics" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Metrics
            </a>
            <a href="/contact" className="text-primary-600 dark:text-primary-400 font-semibold">
              Contact
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Let's Connect
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              I'm always interested in discussing new opportunities, sharing insights about customer success, 
              or exploring how we can work together to drive exceptional customer outcomes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 dark:text-primary-400 text-xl">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                      <a 
                        href={`mailto:${email}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline break-all"
                      >
                        {email}
                      </a>
                    </div>
                  </div>

                  {phone && (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-600 dark:text-primary-400 text-xl">📱</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                        <a
                          href={`tel:${phone}`}
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {phone}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 dark:text-primary-400 text-xl">💼</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">LinkedIn</h3>
                      <a 
                        href={linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:underline break-all"
                      >
                        {linkedIn.replace('https://', '')}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 dark:text-primary-400 text-xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
                      <p className="text-gray-600 dark:text-gray-300">{location}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Response Time
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    I typically respond to messages within 24 hours during business days. 
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  What I Can Help With
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    Customer Success Strategy
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    Customer Experience Optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    Data Analytics & Insights
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    Process Improvement
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    Team Leadership & Training
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Send a Message
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
