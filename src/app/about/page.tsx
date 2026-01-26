import { Metadata } from 'next';
import profileData from '@/data/profile.json';
import { SocialLinks } from '@/components/SocialLinks';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about my professional background, career journey, skills, and expertise in customer success management.',
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            <a href="/">{profileData.personalInfo.name}</a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Home
            </a>
            <a href="/about" className="text-primary-600 dark:text-primary-400 font-semibold">
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            About Me
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                {/* Profile Image Placeholder */}
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                  {profileData.personalInfo.name.charAt(0)}
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {profileData.personalInfo.name}
                </h2>
                <p className="text-xl text-primary-600 dark:text-primary-400 mb-4">
                  {profileData.personalInfo.title}
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {profileData.personalInfo.summary}
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Skills & Expertise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2">Technical</h4>
                <ul className="space-y-2">
                  {profileData.skills.filter(s => s.category === 'technical').map(skill => (
                    <li key={skill.id} className="text-gray-600 dark:text-gray-400 flex items-center">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2">Soft Skills</h4>
                <ul className="space-y-2">
                  {profileData.skills.filter(s => s.category === 'soft').map(skill => (
                    <li key={skill.id} className="text-gray-600 dark:text-gray-400 flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2">Industry</h4>
                <ul className="space-y-2">
                  {profileData.skills.filter(s => s.category === 'industry').map(skill => (
                    <li key={skill.id} className="text-gray-600 dark:text-gray-400 flex items-center">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="/portfolio" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl inline-block"
            >
              View My Portfolio
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}