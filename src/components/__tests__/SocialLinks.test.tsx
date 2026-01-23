import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SocialLinks } from '../SocialLinks';

describe('SocialLinks', () => {
  it('renders social links with correct URLs', () => {
    render(<SocialLinks showLabels={true} />);
    
    // Check LinkedIn link
    const linkedinLink = screen.getByRole('link', { name: /connect on linkedin/i });
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/zheng-fang-johon/');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    
    // Check Email link
    const emailLink = screen.getByRole('link', { name: /connect on email/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:john.fang0626@icloud.com');
    
    // Check Phone link
    const phoneLink = screen.getByRole('link', { name: /connect on phone/i });
    expect(phoneLink).toHaveAttribute('href', 'tel:701-936-1040');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<SocialLinks variant="horizontal" />);
    expect(screen.getByRole('link', { name: /connect on linkedin/i })).toBeInTheDocument();
    
    rerender(<SocialLinks variant="vertical" />);
    expect(screen.getByRole('link', { name: /connect on linkedin/i })).toBeInTheDocument();
    
    rerender(<SocialLinks variant="grid" />);
    expect(screen.getByRole('link', { name: /connect on linkedin/i })).toBeInTheDocument();
  });

  it('shows labels when showLabels is true', () => {
    render(<SocialLinks showLabels={true} />);
    
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  it('hides labels when showLabels is false', () => {
    render(<SocialLinks showLabels={false} />);
    
    expect(screen.queryByText('LinkedIn')).not.toBeInTheDocument();
    expect(screen.queryByText('Email')).not.toBeInTheDocument();
    expect(screen.queryByText('Phone')).not.toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<SocialLinks size="sm" />);
    expect(screen.getByRole('link', { name: /connect on linkedin/i })).toBeInTheDocument();
    
    rerender(<SocialLinks size="md" />);
    expect(screen.getByRole('link', { name: /connect on linkedin/i })).toBeInTheDocument();
    
    rerender(<SocialLinks size="lg" />);
    expect(screen.getByRole('link', { name: /connect on linkedin/i })).toBeInTheDocument();
  });
});