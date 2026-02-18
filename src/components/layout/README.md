# Responsive Layout Components

This directory contains responsive layout components built with Tailwind CSS following a mobile-first design approach.

## Components

### Container

A responsive container component that provides consistent padding and max-width across different screen sizes.

**Props:**
- `children`: React.ReactNode - Content to be contained
- `className?`: string - Additional CSS classes
- `size?`: 'sm' | 'md' | 'lg' | 'xl' | 'full' - Container max-width
- `noPadding?`: boolean - Remove default padding

**Sizes:**
- `sm`: max-w-3xl (768px)
- `md`: max-w-5xl (1024px)
- `lg`: max-w-7xl (1280px) - default
- `xl`: max-w-[1400px]
- `full`: max-w-full

**Example:**
```tsx
<Container size="lg">
  <h1>My Content</h1>
</Container>
```

### Grid

A mobile-first responsive grid system with flexible column layouts.

**Props:**
- `children`: React.ReactNode - Grid items
- `className?`: string - Additional CSS classes
- `cols?`: Object - Column configuration for different breakpoints
  - `default?`: number - Columns on mobile
  - `sm?`: number - Columns on small screens (640px+)
  - `md?`: number - Columns on medium screens (768px+)
  - `lg?`: number - Columns on large screens (1024px+)
  - `xl?`: number - Columns on extra large screens (1280px+)
- `gap?`: 'none' | 'sm' | 'md' | 'lg' | 'xl' - Gap between grid items

**Example:**
```tsx
<Grid cols={{ default: 1, md: 2, lg: 3 }} gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

### Section

A responsive section component for consistent spacing and layout.

**Props:**
- `children`: React.ReactNode - Section content
- `className?`: string - Additional CSS classes
- `spacing?`: 'none' | 'sm' | 'md' | 'lg' | 'xl' - Vertical padding
- `background?`: 'white' | 'gray' | 'primary' | 'transparent' - Background color
- `id?`: string - Section ID for anchor links

**Example:**
```tsx
<Section spacing="lg" background="gray" id="about">
  <Container>
    <h2>About Section</h2>
  </Container>
</Section>
```

### Header

Responsive header with navigation that adapts to mobile, tablet, and desktop.

**Features:**
- Fixed positioning with scroll effect
- Desktop navigation menu
- Mobile hamburger menu
- Active route highlighting
- Smooth transitions

**Example:**
```tsx
<Header />
```

### Footer

Responsive footer with navigation and social links.

**Features:**
- Multi-column layout on desktop
- Stacked layout on mobile
- Navigation links
- Social media links
- Copyright information

**Example:**
```tsx
<Footer />
```

### MainLayout

Main layout wrapper that includes header and footer.

**Props:**
- `children`: React.ReactNode - Page content

**Example:**
```tsx
<MainLayout>
  <Section>
    <Container>
      <h1>Page Content</h1>
    </Container>
  </Section>
</MainLayout>
```

## Responsive Breakpoints

The components use Tailwind CSS default breakpoints:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Mobile-First Approach

All components follow a mobile-first design approach:

1. Base styles target mobile devices
2. Responsive utilities add styles for larger screens
3. Content adapts without horizontal scrolling
4. Touch-friendly interactions on mobile
5. Optimized layouts for each device category

## Requirements Validation

These components validate the following requirements:

- **Requirement 3.1**: Mobile devices - Content adapts to fit screen constraints without horizontal scrolling
- **Requirement 3.2**: Tablets - Layout optimized for touch interaction and medium screen sizes
- **Requirement 3.3**: Desktop - Effective use of available screen space with appropriate content hierarchy

## Usage Examples

### Basic Page Layout

```tsx
import { MainLayout, Section, Container, Grid } from '@/components/layout';

export default function MyPage() {
  return (
    <MainLayout>
      <Section spacing="xl" background="primary">
        <Container>
          <h1>Hero Section</h1>
        </Container>
      </Section>
      
      <Section spacing="lg">
        <Container>
          <Grid cols={{ default: 1, md: 2, lg: 3 }}>
            <div>Card 1</div>
            <div>Card 2</div>
            <div>Card 3</div>
          </Grid>
        </Container>
      </Section>
    </MainLayout>
  );
}
```

### Custom Grid Layout

```tsx
<Grid 
  cols={{ 
    default: 1,  // 1 column on mobile
    sm: 2,       // 2 columns on small screens
    md: 3,       // 3 columns on medium screens
    lg: 4,       // 4 columns on large screens
    xl: 6        // 6 columns on extra large screens
  }} 
  gap="lg"
>
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</Grid>
```

### Nested Containers

```tsx
<Section spacing="lg" background="gray">
  <Container size="xl">
    <h2>Wide Container</h2>
    <Container size="md">
      <p>Narrower content for better readability</p>
    </Container>
  </Container>
</Section>
```

## Testing

All components include comprehensive unit tests covering:

- Rendering and content display
- Responsive class application
- Props and configuration options
- User interactions (for Header)
- Accessibility features

Run tests with:
```bash
npm test -- src/components/layout/__tests__/
```

## Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management for mobile menu
- Color contrast compliance
