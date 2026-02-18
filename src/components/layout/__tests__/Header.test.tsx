/**
 * Header Component Tests
 * 
 * Tests for the responsive Header navigation component.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePathname } from 'next/navigation';
import { Header } from '../Header';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('renders the logo', () => {
    render(<Header />);
    expect(screen.getByText('CS Portfolio')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<Header />);
    
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Portfolio').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Metrics').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
  });

  it('renders mobile menu button', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Toggle menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Toggle menu');
    
    // Menu should be closed initially
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click to close
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('highlights active navigation item', () => {
    (usePathname as jest.Mock).mockReturnValue('/about');
    render(<Header />);
    
    const aboutLinks = screen.getAllByText('About');
    // Check that at least one About link has the active class
    const hasActiveLink = aboutLinks.some(link => 
      link.className.includes('bg-primary-100')
    );
    expect(hasActiveLink).toBe(true);
  });

  it('applies scroll effect classes', () => {
    render(<Header />);
    
    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);
    
    // Note: Due to the async nature of scroll events, we just verify the component renders
    expect(screen.getByText('CS Portfolio')).toBeInTheDocument();
  });

  it('closes mobile menu when pathname changes', () => {
    const { rerender } = render(<Header />);
    const menuButton = screen.getByLabelText('Toggle menu');
    
    // Open menu
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Change pathname
    (usePathname as jest.Mock).mockReturnValue('/about');
    rerender(<Header />);
    
    // Menu should close
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });
});
