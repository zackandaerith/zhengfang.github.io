/**
 * Container Component Tests
 * 
 * Tests for the responsive Container component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Container } from '../Container';

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div>Test Content</div>
      </Container>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default size class (lg)', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('max-w-7xl');
  });

  it('applies custom size class', () => {
    const { container } = render(
      <Container size="sm">
        <div>Content</div>
      </Container>
    );

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('max-w-3xl');
  });

  it('applies padding by default', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('px-4');
  });

  it('removes padding when noPadding is true', () => {
    const { container } = render(
      <Container noPadding>
        <div>Content</div>
      </Container>
    );

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).not.toHaveClass('px-4');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Container className="custom-class">
        <div>Content</div>
      </Container>
    );

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('custom-class');
  });

  it('applies responsive padding classes', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('sm:px-6');
    expect(containerDiv).toHaveClass('lg:px-8');
  });
});
