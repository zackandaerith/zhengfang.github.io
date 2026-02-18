/**
 * Footer Component
 * 
 * Responsive footer with navigation and social links that adapts to all device types.
 * Implements mobile-first responsive design.
 * 
 * Validates: Requirements 3.1, 3.2, 3.3
 */

import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { Grid } from './Grid';

const footerLinks = {
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Metrics', href: '/metrics' },
    { label: 'Contact', href: '/contact' },
  ],
  social: [
    { label: 'LinkedIn', href: '#', icon: 'linkedin' },
    { label: 'Email', href: 'mailto:contact@example.com', icon: 'email' },
    { label: 'GitHub', href: '#', icon: 'github' },
  ],
};

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <Container>
        <div className="py-8 md:py-12">
          <Grid
            cols={{ default: 1, sm: 2, lg: 3 }}
            gap="lg"
            className="mb-8"
          >
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400">
                CS Portfolio
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional portfolio showcasing customer success achievements,
                metrics, and case studies.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Navigation
              </h4>
              <ul className="space-y-2">
                {footerLinks.navigation.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Connect
              </h4>
              <ul className="space-y-2">
                {footerLinks.social.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Grid>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                © {currentYear} Customer Success Manager. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
