# Customer Success Manager Profile Website
# 客户成功经理个人作品集网站

A professional portfolio website for a customer success manager built with Next.js 14, React, TypeScript, and Tailwind CSS. This website showcases professional achievements, integrates resume content, and provides networking capabilities while being deployed on free hosting platforms.

<!-- 使用 Next.js 14、React、TypeScript 和 Tailwind CSS 构建的客户成功经理专业作品集网站。该网站展示专业成就，集成简历内容，提供网络功能，并部署在免费托管平台上。 -->

## Features
## 功能特性

- 🚀 **Modern Tech Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS
  <!-- 现代技术栈：Next.js 14、React 18、TypeScript、Tailwind CSS -->
- 📱 **Responsive Design**: Mobile-first approach with seamless device adaptation
  <!-- 响应式设计：移动优先的方法，无缝适配各种设备 -->
- 🎨 **Professional UI**: Clean, modern design optimized for professional networking
  <!-- 专业界面：为专业网络优化的简洁现代设计 -->
- 📄 **Resume Integration**: Parse and display resume content dynamically
  <!-- 简历集成：动态解析和显示简历内容 -->
- 📊 **Portfolio Showcase**: Interactive displays for metrics, case studies, and testimonials
  <!-- 作品集展示：指标、案例研究和推荐信的交互式展示 -->
- 🔍 **SEO Optimized**: Built-in SEO features with meta tags and structured data
  <!-- SEO优化：内置SEO功能，包含元标签和结构化数据 -->
- 📞 **Contact System**: Multiple contact methods with form validation
  <!-- 联系系统：多种联系方式，包含表单验证 -->
- 📈 **Analytics Ready**: Google Analytics 4 integration with privacy compliance
  <!-- 分析就绪：集成Google Analytics 4，符合隐私合规要求 -->
- 🧪 **Testing Suite**: Unit tests and property-based testing with Jest and fast-check
  <!-- 测试套件：使用Jest和fast-check进行单元测试和基于属性的测试 -->
- 🚀 **Free Deployment**: Configured for Vercel's free tier with automatic deployments
  <!-- 免费部署：配置为Vercel免费层，支持自动部署 -->

## Project Structure
## 项目结构

```
src/
├── app/                 # Next.js 14 App Router pages (Next.js 14 应用路由页面)
├── components/          # Reusable React components (可重用的React组件)
├── lib/                 # Utility libraries and configurations (工具库和配置)
├── types/               # TypeScript type definitions (TypeScript类型定义)
├── utils/               # Helper functions (辅助函数)
├── hooks/               # Custom React hooks (自定义React钩子)
├── styles/              # Additional CSS styles (额外的CSS样式)
├── data/                # Static data and content (静态数据和内容)
└── __tests__/           # Test files (测试文件)
```

## Getting Started
## 开始使用

### Prerequisites
### 前置要求

- Node.js 16.13.0 or higher (Node.js 20.9.0+ recommended)
  <!-- Node.js 16.13.0 或更高版本（推荐 Node.js 20.9.0+） -->
- npm or yarn package manager
  <!-- npm 或 yarn 包管理器 -->

### Installation
### 安装步骤

1. Clone the repository: <!-- 克隆仓库： -->
```bash
git clone <repository-url>
cd cs-manager-profile-website
```

2. Install dependencies: <!-- 安装依赖： -->
```bash
npm install
```

3. Run the development server: <!-- 运行开发服务器： -->
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
   <!-- 在浏览器中打开 http://localhost:3000 -->

## Available Scripts
## 可用脚本

- `npm run dev` - Start development server <!-- 启动开发服务器 -->
- `npm run build` - Build for production <!-- 构建生产版本 -->
- `npm run start` - Start production server <!-- 启动生产服务器 -->
- `npm run lint` - Run ESLint <!-- 运行ESLint代码检查 -->
- `npm run lint:fix` - Fix ESLint issues automatically <!-- 自动修复ESLint问题 -->
- `npm run format` - Format code with Prettier <!-- 使用Prettier格式化代码 -->
- `npm run format:check` - Check code formatting <!-- 检查代码格式 -->
- `npm run test` - Run tests <!-- 运行测试 -->
- `npm run test:watch` - Run tests in watch mode <!-- 在监视模式下运行测试 -->
- `npm run test:coverage` - Run tests with coverage report <!-- 运行测试并生成覆盖率报告 -->
- `npm run type-check` - Run TypeScript type checking <!-- 运行TypeScript类型检查 -->

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
