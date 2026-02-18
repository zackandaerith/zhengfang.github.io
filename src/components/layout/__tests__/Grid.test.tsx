/**
 * Grid Component Tests
 * 
 * Tests for the responsive Grid component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Grid } from '../Grid';

describe('Grid', () => {
  it('renders children correctly', () => {
    render(
      <Grid>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies default grid classes', () => {
    const { container } = render(
      <Grid>
        <div>Item</div>
      </Grid>
    );

    const gridDiv = container.firstChild as HTMLElement;
    expect(gridDiv).toHaveClass('grid');
    expect(gridDiv).toHaveClass('grid-cols-1');
    expect(gridDiv).toHaveClass('md:grid-cols-2');
    expect(gridDiv).toHaveClass('lg:grid-cols-3');
  });

  it('applies custom column configuration', () => {
    const { container } = render(
      <Grid cols={{ default: 2, md: 4 }}>
        <div>Item</div>
      </Grid>
    );

    const gridDiv = container.firstChild as HTMLElement;
    expect(gridDiv).toHaveClass('grid-cols-2');
    expect(gridDiv).toHaveClass('md:grid-cols-4');
  });

  it('applies default gap (md)', () => {
    const { container } = render(
      <Grid>
        <div>Item</div>
      </Grid>
    );

    const gridDiv = container.firstChild as HTMLElement;
    expect(gridDiv).toHaveClass('gap-6');
  });

  it('applies custom gap', () => {
    const { container } = render(
      <Grid gap="lg">
        <div>Item</div>
      </Grid>
    );

    const gridDiv = container.firstChild as HTMLElement;
    expect(gridDiv).toHaveClass('gap-8');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Grid className="custom-grid">
        <div>Item</div>
      </Grid>
    );

    const gridDiv = container.firstChild as HTMLElement;
    expect(gridDiv).toHaveClass('custom-grid');
  });

  it('handles all breakpoint configurations', () => {
    const { container } = render(
      <Grid cols={{ default: 1, sm: 2, md: 3, lg: 4, xl: 6 }}>
        <div>Item</div>
      </Grid>
    );

    const gridDiv = container.firstChild as HTMLElement;
    expect(gridDiv).toHaveClass('grid-cols-1');
    expect(gridDiv).toHaveClass('sm:grid-cols-2');
    expect(gridDiv).toHaveClass('md:grid-cols-3');
    expect(gridDiv).toHaveClass('lg:grid-cols-4');
    expect(gridDiv).toHaveClass('xl:grid-cols-6');
  });
});
