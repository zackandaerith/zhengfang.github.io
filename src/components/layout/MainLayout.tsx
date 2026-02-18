/**
 * MainLayout Component
 * 
 * Main layout wrapper that includes header and footer.
 * Provides consistent page structure across all pages with responsive design.
 * 
 * Validates: Requirements 3.1, 3.2, 3.3
 */

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};
