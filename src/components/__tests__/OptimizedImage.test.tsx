import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { OptimizedImage } from '../OptimizedImage';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('OptimizedImage', () => {
  it('renders image with correct src and alt', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
      />
    );

    const image = screen.getByAlt('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('uses fill mode when width and height are not provided', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
      />
    );

    const image = screen.getByAlt('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('fill', '');
  });

  it('applies custom className', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
        className="custom-class"
      />
    );

    const image = screen.getByAlt('Test image');
    expect(image).toHaveClass('custom-class');
  });

  it('sets priority for featured images', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
        priority={true}
      />
    );

    const image = screen.getByAlt('Test image');
    expect(image).toHaveAttribute('priority', '');
  });

  it('displays fallback on image error', async () => {
    const onError = jest.fn();
    
    render(
      <OptimizedImage
        src="/invalid-image.jpg"
        alt="Test image"
        width={800}
        height={600}
        onError={onError}
      />
    );

    const image = screen.getByAlt('Test image');
    
    // Simulate image error
    image.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(screen.getByText('Image unavailable')).toBeInTheDocument();
    });
  });

  it('uses placeholder when src is not provided', () => {
    render(
      <OptimizedImage
        src=""
        alt="Test image"
        width={800}
        height={600}
      />
    );

    const image = screen.getByAlt('Test image');
    expect(image).toHaveAttribute('src', '/images/placeholder-case-study.jpg');
  });

  it('applies correct object-fit style', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
        objectFit="contain"
      />
    );

    const image = screen.getByAlt('Test image');
    expect(image).toBeInTheDocument();
  });

  it('calls onLoad callback when image loads', () => {
    const onLoad = jest.fn();
    
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
        onLoad={onLoad}
      />
    );

    const image = screen.getByAlt('Test image');
    image.dispatchEvent(new Event('load'));

    expect(onLoad).toHaveBeenCalled();
  });

  it('accepts custom sizes prop', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );

    const image = screen.getByAlt('Test image');
    expect(image).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
  });

  it('uses default responsive sizes when not provided', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
      />
    );

    const image = screen.getByAlt('Test image');
    expect(image).toHaveAttribute('sizes');
  });

  it('supports blur placeholder', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
        placeholder="blur"
        blurDataURL="data:image/png;base64,..."
      />
    );

    const image = screen.getByAlt('Test image');
    expect(image).toHaveAttribute('placeholder', 'blur');
    expect(image).toHaveAttribute('blurDataURL');
  });

  it('sets correct quality value', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
        quality={90}
      />
    );

    const image = screen.getByAlt('Test image');
    expect(image).toHaveAttribute('quality', '90');
  });

  it('uses default quality when not specified', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
      />
    );

    const image = screen.getByAlt('Test image');
    expect(image).toHaveAttribute('quality', '85');
  });

  it('renders with proper accessibility attributes', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image description"
        width={800}
        height={600}
      />
    );

    const image = screen.getByAlt('Test image description');
    expect(image).toHaveAttribute('alt', 'Test image description');
  });

  it('handles error state with proper aria-label', async () => {
    render(
      <OptimizedImage
        src="/invalid-image.jpg"
        alt="Test image"
        width={800}
        height={600}
      />
    );

    const image = screen.getByAlt('Test image');
    image.dispatchEvent(new Event('error'));

    await waitFor(() => {
      const fallback = screen.getByRole('img');
      expect(fallback).toHaveAttribute('aria-label', 'Test image (unavailable)');
    });
  });
});
