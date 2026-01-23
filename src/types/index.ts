// Core data models for the Customer Success Manager Portfolio

// Re-export validation schemas
export * from './validation';

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone?: string;
  linkedIn: string;
  website?: string;
  summary: string;
  profileImage: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  metrics: Metric[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'industry';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  achievements?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: 'award' | 'recognition' | 'milestone' | 'publication';
  organization?: string;
  metrics?: Metric[];
}

export interface Metric {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  description: string;
  category: 'retention' | 'growth' | 'satisfaction' | 'efficiency' | 'revenue';
  timeframe: string;
  context: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  implementation: string[];
  results: Result[];
  testimonial?: Testimonial;
  images: string[];
  tags: string[];
  featured: boolean;
  startDate: Date;
  endDate?: Date;
}

export interface Result {
  id: string;
  description: string;
  metric: Metric;
  impact: 'high' | 'medium' | 'low';
}

export interface Testimonial {
  id: string;
  content: string;
  author: string;
  position: string;
  company: string;
  date: Date;
  rating?: number;
  image?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  subject: string;
}

export interface ContactLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label: string;
}

export interface ContactInteraction {
  id: string;
  type: 'form_submission' | 'email_click' | 'social_click' | 'resume_download';
  timestamp: Date;
  details?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  skills: Skill[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  caseStudies: CaseStudy[];
  testimonials: Testimonial[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  publicProfile: boolean;
}

// Validation and parsing types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

// Enhanced error handling for resume parsing
export interface ParseError {
  type: 'file_format' | 'file_corrupted' | 'file_empty' | 'section_missing' | 'parsing_failed' | 'file_too_large' | 'unsupported_format';
  message: string;
  section?: string;
  suggestions: string[];
  recoverable: boolean;
  details?: Record<string, any>;
}

export interface ParseResult<T> {
  success: boolean;
  data?: T;
  errors: ParseError[];
  warnings: ParseError[];
  confidence?: number;
}

export interface SectionParseResult {
  section: 'experience' | 'skills' | 'education' | 'achievements' | 'personal_info';
  success: boolean;
  data: any[];
  errors: ParseError[];
  warnings: ParseError[];
  confidence: number;
}

export interface ParsedResume {
  personalInfo: Partial<PersonalInfo>;
  experience: Experience[];
  skills: Skill[];
  education: Education[];
  achievements: Achievement[];
  rawText: string;
  confidence: number;
  parseResult: ParseResult<ParsedResume>;
  sectionResults: SectionParseResult[];
}

// SEO and metadata types
export interface MetaTags {
  title: string;
  description: string;
  keywords: string[];
  openGraph: OpenGraphData;
  twitter: TwitterCardData;
  canonical?: string;
}

export interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
  siteName: string;
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image';
  title: string;
  description: string;
  image: string;
  creator?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  parameters: Record<string, any>;
  timestamp: Date;
}

export interface PageData {
  path: string;
  title: string;
  description: string;
  lastModified: Date;
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  id?: string;
}

// Image optimization types
export interface ImageData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export interface OptimizedImage extends ImageData {
  srcSet: string;
  sizes: string;
  placeholder?: string;
}