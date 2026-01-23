import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CaseStudyShowcase } from '../CaseStudyShowcase';
import { CaseStudy } from '@/types';

// Mock the CaseStudyCard and CaseStudyDetail components
jest.mock('../CaseStudyCard', () => {
  return {
    CaseStudyCard: ({ caseStudy, onClick }: any) => (
      <div data-testid={`case-study-card-${caseStudy.id}`} onClick={() => onClick?.(caseStudy)}>
        {caseStudy.title}
      </div>
    )
  };
});

jest.mock('../CaseStudyDetail', () => {
  return {
    CaseStudyDetail: ({ caseStudy, onClose }: any) => (
      <div data-testid="case-study-detail">
        <button onClick={onClose}>Close</button>
        <h1>{caseStudy.title}</h1>
      </div>
    )
  };
});

const mockCaseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Case Study 1',
    client: 'Client A',
    industry: 'Technology',
    challenge: 'Challenge 1',
    solution: 'Solution 1',
    implementation: ['Step 1'],
    results: [
      {
        id: 'result-1',
        description: 'Result 1',
        metric: {
          id: 'metric-1',
          name: 'Metric 1',
          value: 80,
          unit: '%',
          description: 'Metric description',
          category: 'growth',
          timeframe: '2023',
          context: 'Context'
        },
        impact: 'high'
      }
    ],
    images: ['/image1.jpg'],
    tags: ['Tag1', 'Tag2'],
    featured: true,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31')
  },
  {
    id: 'case-2',
    title: 'Case Study 2',
    client: 'Client B',
    industry: 'Healthcare',
    challenge: 'Challenge 2',
    solution: 'Solution 2',
    implementation: ['Step 1', 'Step 2'],
    results: [],
    images: ['/image2.jpg'],
    tags: ['Tag3', 'Tag4'],
    featured: false,
    startDate: new Date('2023-06-01'),
    endDate: new Date('2024-01-01')
  }
];

describe('CaseStudyShowcase', () => {
  it('renders case studies correctly', () => {
    render(<CaseStudyShowcase caseStudies={mockCaseStudies} />);
    
    expect(screen.getByText('Case Studies')).toBeInTheDocument();
    expect(screen.getByTestId('case-study-card-case-1')).toBeInTheDocument();
    expect(screen.getByTestId('case-study-card-case-2')).toBeInTheDocument();
  });

  it('displays custom title and subtitle', () => {
    render(
      <CaseStudyShowcase 
        caseStudies={mockCaseStudies} 
        title="Custom Title"
        subtitle="Custom Subtitle"
      />
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });

  it('shows filters when showFilters is true', () => {
    render(<CaseStudyShowcase caseStudies={mockCaseStudies} showFilters={true} />);
    
    expect(screen.getByText('Industry:')).toBeInTheDocument();
    expect(screen.getByText('Skill:')).toBeInTheDocument();
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
  });

  it('hides filters when showFilters is false', () => {
    render(<CaseStudyShowcase caseStudies={mockCaseStudies} showFilters={false} />);
    
    expect(screen.queryByText('Industry:')).not.toBeInTheDocument();
    expect(screen.queryByText('Skill:')).not.toBeInTheDocument();
    expect(screen.queryByText('Sort by:')).not.toBeInTheDocument();
  });

  it('filters by industry correctly', () => {
    render(<CaseStudyShowcase caseStudies={mockCaseStudies} showFilters={true} />);
    
    const industrySelect = screen.getByDisplayValue('All Industries');
    fireEvent.change(industrySelect, { target: { value: 'Technology' } });
    
    expect(screen.getByTestId('case-study-card-case-1')).toBeInTheDocument();
    expect(screen.queryByTestId('case-study-card-case-2')).not.toBeInTheDocument();
  });

  it('filters by tag correctly', () => {
    render(<CaseStudyShowcase caseStudies={mockCaseStudies} showFilters={true} />);
    
    const tagSelect = screen.getByDisplayValue('All Skills');
    fireEvent.change(tagSelect, { target: { value: 'Tag3' } });
    
    expect(screen.queryByTestId('case-study-card-case-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('case-study-card-case-2')).toBeInTheDocument();
  });

  it('sorts by featured first by default', () => {
    render(<CaseStudyShowcase caseStudies={mockCaseStudies} showFilters={true} />);
    
    const sortSelect = screen.getByDisplayValue('Featured First');
    expect(sortSelect).toBeInTheDocument();
  });

  it('opens case study detail when card is clicked', () => {
    render(<CaseStudyShowcase caseStudies={mockCaseStudies} />);
    
    const card = screen.getByTestId('case-study-card-case-1');
    fireEvent.click(card);
    
    expect(screen.getByTestId('case-study-detail')).toBeInTheDocument();
    expect(screen.getByText('Case Study 1')).toBeInTheDocument();
  });

  it('closes case study detail when close button is clicked', () => {
    render(<CaseStudyShowcase caseStudies={mockCaseStudies} />);
    
    // Open detail
    const card = screen.getByTestId('case-study-card-case-1');
    fireEvent.click(card);
    
    // Close detail
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('case-study-detail')).not.toBeInTheDocument();
    expect(screen.getByTestId('case-study-card-case-1')).toBeInTheDocument();
  });

  it('displays results count correctly', () => {
    render(<CaseStudyShowcase caseStudies={mockCaseStudies} showFilters={true} />);
    
    expect(screen.getByText('Showing 2 of 2 case studies')).toBeInTheDocument();
  });

  it('displays empty state when no case studies match filters', () => {
    render(<CaseStudyShowcase caseStudies={[]} />);
    
    expect(screen.getByText('No case studies found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters to see more results.')).toBeInTheDocument();
  });

  it('limits results when maxItems is specified', () => {
    render(<CaseStudyShowcase caseStudies={mockCaseStudies} maxItems={1} />);
    
    expect(screen.getByTestId('case-study-card-case-1')).toBeInTheDocument();
    expect(screen.queryByTestId('case-study-card-case-2')).not.toBeInTheDocument();
  });

  it('displays featured summary when showFilters is false and has featured case studies', () => {
    render(<CaseStudyShowcase caseStudies={mockCaseStudies} showFilters={false} />);
    
    expect(screen.getByText('Featured Success Stories')).toBeInTheDocument();
    expect(screen.getByText(/Highlighting 1 of our most impactful projects/)).toBeInTheDocument();
  });
});