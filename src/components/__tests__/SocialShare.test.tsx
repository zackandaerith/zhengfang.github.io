import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SocialShare } from '../SocialShare';

// Mock window.open
const mockOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockOpen,
  writable: true,
});

// Mock navigator.clipboard
const mockClipboard = {
  writeText: jest.fn(),
};
Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
});

describe('SocialShare', () => {
  beforeEach(() => {
    mockOpen.mockClear();
    mockClipboard.writeText.mockClear();
  });

  it('renders share buttons', () => {
    render(<SocialShare />);
    
    expect(screen.getByRole('button', { name: /share on linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share on twitter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share on email/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share on copy link/i })).toBeInTheDocument();
  });

  it('opens LinkedIn share URL when LinkedIn button is clicked', () => {
    render(<SocialShare url="https://example.com" title="Test Title" />);
    
    const linkedinButton = screen.getByRole('button', { name: /share on linkedin/i });
    fireEvent.click(linkedinButton);
    
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('linkedin.com/sharing/share-offsite'),
      '_blank',
      'width=600,height=400'
    );
  });

  it('opens Twitter share URL when Twitter button is clicked', () => {
    render(<SocialShare url="https://example.com" title="Test Title" />);
    
    const twitterButton = screen.getByRole('button', { name: /share on twitter/i });
    fireEvent.click(twitterButton);
    
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('twitter.com/intent/tweet'),
      '_blank',
      'width=600,height=400'
    );
  });

  it('opens email client when Email button is clicked', () => {
    render(<SocialShare url="https://example.com" title="Test Title" description="Test Description" />);
    
    const emailButton = screen.getByRole('button', { name: /share on email/i });
    fireEvent.click(emailButton);
    
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('mailto:'),
      '_blank',
      'width=600,height=400'
    );
  });

  it('copies link to clipboard when Copy Link button is clicked', async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    
    render(<SocialShare url="https://example.com" />);
    
    const copyButton = screen.getByRole('button', { name: /share on copy link/i });
    fireEvent.click(copyButton);
    
    expect(mockClipboard.writeText).toHaveBeenCalledWith('https://example.com');
    
    await waitFor(() => {
      expect(screen.getByTitle('Copied!')).toBeInTheDocument();
    });
  });

  it('renders dropdown variant', () => {
    render(<SocialShare variant="dropdown" />);
    
    const shareButton = screen.getByRole('button', { name: /share options/i });
    expect(shareButton).toBeInTheDocument();
    
    fireEvent.click(shareButton);
    
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Copy Link')).toBeInTheDocument();
  });

  it('closes dropdown when backdrop is clicked', () => {
    render(<SocialShare variant="dropdown" />);
    
    const shareButton = screen.getByRole('button', { name: /share options/i });
    fireEvent.click(shareButton);
    
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    
    // Click backdrop (the fixed div)
    const backdrop = document.querySelector('.fixed.inset-0');
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    
    expect(screen.queryByText('LinkedIn')).not.toBeInTheDocument();
  });
});