/**
 * Responsive Layout Demo
 * 
 * Demonstrates the usage of responsive layout components.
 * Shows how Container, Grid, Section, Header, Footer, and MainLayout work together.
 * 
 * Validates: Requirements 3.1, 3.2, 3.3
 */

import React from 'react';
import { Container, Grid, Section, MainLayout } from '@/components/layout';

export default function ResponsiveLayoutDemo() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <Section spacing="xl" background="primary">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Responsive Layout Demo
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              This page demonstrates the responsive layout components built with Tailwind CSS.
            </p>
          </div>
        </Container>
      </Section>

      {/* Grid Demo Section */}
      <Section spacing="lg" background="white">
        <Container>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Responsive Grid System
          </h2>
          
          {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
          <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="md">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Card {num}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This card adapts to different screen sizes using the responsive grid system.
                </p>
              </div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Container Sizes Demo */}
      <Section spacing="lg" background="gray">
        <Container size="xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Container Sizes
          </h2>
          
          <div className="space-y-6">
            <Container size="sm" className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Small Container:</strong> Max width 768px - ideal for focused content
              </p>
            </Container>
            
            <Container size="md" className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Medium Container:</strong> Max width 1024px - good for articles
              </p>
            </Container>
            
            <Container size="lg" className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Large Container:</strong> Max width 1280px - default size
              </p>
            </Container>
          </div>
        </Container>
      </Section>

      {/* Responsive Typography */}
      <Section spacing="lg" background="white">
        <Container>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Responsive Typography
          </h2>
          
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Heading scales with screen size
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
              Body text also adapts to provide optimal readability across devices.
            </p>
          </div>
        </Container>
      </Section>

      {/* Responsive Spacing */}
      <Section spacing="lg" background="gray">
        <Container>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Responsive Spacing
          </h2>
          
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <div className="p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                Padding increases on larger screens: 1rem → 1.5rem → 2rem
              </p>
            </div>
            <div className="p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                Spacing between elements also scales responsively
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </MainLayout>
  );
}
