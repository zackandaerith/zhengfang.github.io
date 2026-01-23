# Customer Success Manager Profile Website

A professional portfolio website for a customer success manager built with Next.js 14, React, TypeScript, and Tailwind CSS. This website showcases professional achievements, integrates resume content, and provides networking capabilities while being deployed on free hosting platforms.

## Features

- 🚀 **Modern Tech Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS
- 📱 **Responsive Design**: Mobile-first approach with seamless device adaptation
- 🎨 **Professional UI**: Clean, modern design optimized for professional networking
- 📄 **Resume Integration**: Parse and display resume content dynamically
- 📊 **Portfolio Showcase**: Interactive displays for metrics, case studies, and testimonials
- 🔍 **SEO Optimized**: Built-in SEO features with meta tags and structured data
- 📞 **Contact System**: Multiple contact methods with form validation
- 📈 **Analytics Ready**: Google Analytics 4 integration with privacy compliance
- 🧪 **Testing Suite**: Unit tests and property-based testing with Jest and fast-check
- 🚀 **Free Deployment**: Configured for Vercel's free tier with automatic deployments

## Project Structure

```
src/
├── app/                 # Next.js 14 App Router pages
├── components/          # Reusable React components
├── lib/                 # Utility libraries and configurations
├── types/               # TypeScript type definitions
├── utils/               # Helper functions
├── hooks/               # Custom React hooks
├── styles/              # Additional CSS styles
├── data/                # Static data and content
└── __tests__/           # Test files
```

## Getting Started

### Prerequisites

- Node.js 16.13.0 or higher (Node.js 20.9.0+ recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cs-manager-profile-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run type-check` - Run TypeScript type checking

## Technology Stack

### Core Technologies
- **Next.js 14**: React framework with App Router
- **React 18**: UI library with latest features
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Testing Library**: React component testing
- **fast-check**: Property-based testing

### Deployment
- **Vercel**: Free hosting with automatic deployments
- **GitHub**: Version control and CI/CD integration

## Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
- `jest.config.js` - Jest testing configuration
- `.prettierrc` - Prettier formatting rules

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint and Prettier configurations
- Write tests for new components and utilities
- Use semantic commit messages

### Testing Strategy
- Unit tests for components and utilities
- Property-based tests for core business logic
- Integration tests for user workflows
- Minimum 80% code coverage target

### Performance
- Optimize images with Next.js Image component
- Use static generation where possible
- Implement proper caching strategies
- Monitor Core Web Vitals

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables (if needed)
3. Deploy automatically on push to main branch

### Environment Variables

Create a `.env.local` file for local development:

```env
# Add environment variables here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run tests and linting: `npm run test && npm run lint`
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue in the GitHub repository.
