import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageGallery } from '../ImageGallery';

// Mock OptimizedImage component
jest.mock('../OptimizedImage', () => ({
  OptimizedImage: ({ src, alt }: any) => (
    <img src={src} alt={alt} data-testid="optimized-image" />
  ),
}));

describe('ImageGallery', () => {
  const mockImages = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
  ];

  describe('Grid Layout', () => {
    it('renders all images in grid layout', () => {
      render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="grid"
        />
      );

      const images = screen.getAllByTestId('optimized-image');
      expect(images).toHaveLength(3);
    });

    it('applies correct grid columns class', () => {
      const { container } = render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="grid"
          columns={3}
        />
      );

      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
    });

    it('renders with 2 columns', () => {
      const { container } = render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="grid"
          columns={2}
        />
      );

      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2');
    });
  });

  describe('Carousel Layout', () => {
    it('renders carousel with navigation arrows', () => {
      render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="carousel"
        />
      );

      expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
      expect(screen.getByLabelText('Next image')).toBeInTheDocument();
    });

    it('displays image counter', () => {
      render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="carousel"
        />
      );

      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('navigates to next image on arrow click', () => {
      render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="carousel"
        />
      );

      const nextButton = screen.getByLabelText('Next image');
      fireEvent.click(nextButton);

      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('navigates to previous image on arrow click', () => {
      render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="carousel"
        />
      );

      const prevButton = screen.getByLabelText('Previous image');
      fireEvent.click(prevButton);

      // Should wrap to last image
      expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });

    it('renders thumbnails when showThumbnails is true', () => {
      render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="carousel"
          showThumbnails={true}
        />
      );

      const thumbnails = screen.getAllByRole('button');
      // 2 navigation arrows + 3 thumbnails
      expect(thumbnails.length).toBeGreaterThanOrEqual(3);
    });

    it('does not render thumbnails when showThumbnails is false', () => {
      render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="carousel"
          showThumbnails={false}
        />
      );

      const buttons = screen.getAllByRole('button');
      // Only 2 navigation arrows
      expect(buttons).toHaveLength(2);
    });

    it('changes image when thumbnail is clicked', () => {
      render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="carousel"
          showThumbnails={true}
        />
      );

      const thumbnails = screen.getAllByRole('button');
      // Click the last thumbnail (skip navigation arrows)
      fireEvent.click(thumbnails[thumbnails.length - 1]);

      expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });
  });

  describe('Masonry Layout', () => {
    it('renders masonry layout with columns', () => {
      const { container } = render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="masonry"
        />
      );

      const masonryContainer = container.querySelector('.columns-1');
      expect(masonryContainer).toBeInTheDocument();
      expect(masonryContainer).toHaveClass('sm:columns-2', 'lg:columns-3');
    });

    it('renders all images in masonry layout', () => {
      render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="masonry"
        />
      );

      const images = screen.getAllByTestId('optimized-image');
      expect(images).toHaveLength(3);
    });
  });

  describe('Edge Cases', () => {
    it('returns null when images array is empty', () => {
      const { container } = render(
        <ImageGallery
          images={[]}
          alt="Test gallery"
          layout="grid"
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('handles single image in carousel', () => {
      render(
        <ImageGallery
          images={['/single-image.jpg']}
          alt="Test gallery"
          layout="carousel"
        />
      );

      // Should not show navigation arrows for single image
      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="grid"
          className="custom-gallery"
        />
      );

      expect(container.firstChild).toHaveClass('custom-gallery');
    });

    it('applies correct aspect ratio class', () => {
      const { container } = render(
        <ImageGallery
          images={mockImages}
          alt="Test gallery"
          layout="grid"
          aspectRatio="square"
        />
      );

      const imageContainer = container.querySelector('.aspect-square');
      expect(imageContainer).toBeInTheDocument();
    });
  });
});
