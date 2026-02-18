import { Metadata } from 'next';
import { SocialLinks } from '@/components/SocialLinks';
import { MainLayout, Section, Container, Grid } from '@/components/layout';

export const metadata: Metadata = {
  title: 'John Fang - Customer Success Manager',
  description: 'Welcome to John Fang\'s professional customer success manager portfolio showcasing achievements, metrics, and case studies.',
};

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <Section spacing="xl" background="transparent" className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              John Fang
              <span className="text-blue-600 dark:text-blue-400 block text-3xl sm:text-4xl md:text-5xl mt-2">
                Customer Success Manager
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up">
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
        </Container>
      </Section>

      {/* Key Metrics Preview */}
      <Section spacing="lg" background="white">
        <Container>
          <Grid cols={{ default: 1, md: 3 }} gap="lg">
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
          </Grid>
        </Container>
      </Section>
    </MainLayout>
  );
}
