import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CaseStudyCard } from '../CaseStudyCard';
import { CaseStudy } from '@/types';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

const mockCaseStudy: CaseStudy = {
  id: 'test-case-study',
  title: 'Test Case Study',
  client: 'Test Client',
  industry: 'Technology',
  challenge: 'This is a test challenge description that should be displayed in the card.',
  solution: 'This is a test solution description.',
  implementation: ['Step 1', 'Step 2', 'Step 3'],
  results: [
    {
      id: 'result-1',
      description: 'Test result description',
      metric: {
        id: 'metric-1',
        name: 'Test Metric',
        value: 85,
        unit: '%',
        description: 'Test metric description',
        category: 'growth',
        timeframe: '2023-2024',
        context: 'Test context'
      },
      impact: 'high'
    }
  ],
  testimonial: {
    id: 'testimonial-1',
    content: 'This is a test testimonial content.',
    author: 'John Doe',
    position: 'CEO',
    company: 'Test Company',
    date: new Date('2024-01-01'),
    rating: 5
  },
  images: ['/test-image.jpg'],
  tags: ['Test Tag 1', 'Test Tag 2', 'Test Tag 3', 'Test Tag 4'],
  featured: true,
  startDate: new Date('2023-01-01'),
  endDate: new Date('2024-01-01')
};

describe('CaseStudyCard', () => {
  it('renders case study information correctly', () => {
    render(<CaseStudyCard caseStudy={mockCaseStudy} />);
    
    expect(screen.getByText('Test Case Study')).toBeInTheDocument();
    expect(screen.getByText('Test Client')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('This is a test challenge description that should be displayed in the card.')).toBeInTheDocument();
  });

  it('displays featured badge when case study is featured', () => {
    render(<CaseStudyCard caseStudy={mockCaseStudy} />);
    
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('does not display featured badge when case study is not featured', () => {
    const nonFeaturedCaseStudy = { ...mockCaseStudy, featured: false };
    render(<CaseStudyCard caseStudy={nonFeaturedCaseStudy} />);
    
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  it('displays key results', () => {
    render(<CaseStudyCard caseStudy={mockCaseStudy} />);
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('displays tags with overflow handling', () => {
    render(<CaseStudyCard caseStudy={mockCaseStudy} />);
    
    expect(screen.getByText('Test Tag 1')).toBeInTheDocument();
    expect(screen.getByText('Test Tag 2')).toBeInTheDocument();
    expect(screen.getByText('Test Tag 3')).toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });

  it('displays testimonial in featured variant', () => {
    render(<CaseStudyCard caseStudy={mockCaseStudy} variant="featured" />);
    
    expect(screen.getByText('"This is a test testimonial content."')).toBeInTheDocument();
    expect(screen.getByText('— John Doe, CEO')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const mockOnClick = jest.fn();
    render(<CaseStudyCard caseStudy={mockCaseStudy} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledWith(mockCaseStudy);
  });

  it('handles keyboard navigation', () => {
    const mockOnClick = jest.fn();
    render(<CaseStudyCard caseStudy={mockCaseStudy} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(mockOnClick).toHaveBeenCalledWith(mockCaseStudy);
  });

  it('renders compact variant correctly', () => {
    render(<CaseStudyCard caseStudy={mockCaseStudy} variant="compact" />);
    
    expect(screen.getByText('Test Case Study')).toBeInTheDocument();
    expect(screen.queryByText('Featured')).not.toBeInTheDocument(); // Featured badge not shown in compact
    expect(screen.queryByText('"This is a test testimonial content."')).not.toBeInTheDocument(); // Testimonial not shown in compact
  });

  it('displays correct number of results indicator', () => {
    render(<CaseStudyCard caseStudy={mockCaseStudy} />);
    
    expect(screen.getByText('1 key results')).toBeInTheDocument();
  });
});