/**
 * Footer Component Tests
 * 
 * Tests for the responsive Footer component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('renders the brand name', () => {
    render(<Footer />);
    expect(screen.getByText('CS Portfolio')).toBeInTheDocument();
  });

  it('renders the brand description', () => {
    render(<Footer />);
    expect(screen.getByText(/Professional portfolio showcasing/i)).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Footer />);
    
    const navLinks = ['Home', 'About', 'Portfolio', 'Metrics', 'Contact'];
    navLinks.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('renders social links', () => {
    render(<Footer />);
    
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it('renders privacy and terms links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });

  it('renders section headings', () => {
    render(<Footer />);
    
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });

  it('applies correct link attributes for external links', () => {
    render(<Footer />);
    
    // Email link should not have target="_blank"
    const emailLink = screen.getByText('Email').closest('a');
    expect(emailLink).not.toHaveAttribute('target', '_blank');
  });
});
