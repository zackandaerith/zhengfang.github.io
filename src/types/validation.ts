// Zod validation schemas for runtime type checking
import { z } from 'zod';
import type { ValidationError } from './index';

// Personal Info Schema
export const PersonalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  linkedIn: z.string().url('Invalid LinkedIn URL').or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  profileImage: z.string().url('Invalid profile image URL').or(z.literal('')),
});

// Metric Schema
export const MetricSchema = z.object({
  id: z.string().min(1, 'Metric ID is required'),
  name: z.string().min(1, 'Metric name is required'),
  value: z.union([z.number(), z.string()]),
  unit: z.string().min(1, 'Unit is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['retention', 'growth', 'satisfaction', 'efficiency', 'revenue', 'other']),
  timeframe: z.string().optional(),
  context: z.string().optional(),
});

// Experience Schema
export const ExperienceSchema = z.object({
  id: z.string().min(1, 'Experience ID is required'),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  achievements: z.array(z.string().min(1, 'Achievement cannot be empty')),
  technologies: z.array(z.string().min(1, 'Technology cannot be empty')),
  metrics: z.array(MetricSchema),
}).refine((data) => {
  // Ensure end date is after start date if provided
  if (data.endDate && data.startDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Skill Schema
export const SkillSchema = z.object({
  id: z.string().min(1, 'Skill ID is required'),
  name: z.string().min(1, 'Skill name is required'),
  category: z.enum(['technical', 'soft', 'industry']),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  description: z.string().optional(),
});

// Education Schema
export const EducationSchema = z.object({
  id: z.string().min(1, 'Education ID is required'),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  gpa: z.number().min(0).max(4).optional().nullable(),
  achievements: z.array(z.string().min(1, 'Achievement cannot be empty')).optional(),
}).refine((data) => {
  // Ensure end date is after start date if provided
  if (data.endDate && data.startDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Certification Schema
export const CertificationSchema = z.object({
  id: z.string().min(1, 'Certification ID is required'),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.coerce.date(),
  expiryDate: z.coerce.date().optional().nullable(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url('Invalid credential URL').optional().or(z.literal('')),
}).refine((data) => {
  // Ensure expiry date is after issue date if provided
  if (data.expiryDate && data.issueDate) {
    return data.expiryDate >= data.issueDate;
  }
  return true;
}, {
  message: 'Expiry date must be after issue date',
  path: ['expiryDate'],
});

// Achievement Schema
export const AchievementSchema = z.object({
  id: z.string().min(1, 'Achievement ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.coerce.date(),
  category: z.enum(['award', 'recognition', 'milestone', 'publication']),
  organization: z.string().optional(),
  metrics: z.array(MetricSchema).optional(),
});

// Result Schema
export const ResultSchema = z.object({
  id: z.string().min(1, 'Result ID is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  metric: MetricSchema,
  impact: z.enum(['high', 'medium', 'low']),
});

// Testimonial Schema
export const TestimonialSchema = z.object({
  id: z.string().min(1, 'Testimonial ID is required'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  author: z.string().min(1, 'Author is required'),
  position: z.string().min(1, 'Position is required'),
  company: z.string().min(1, 'Company is required'),
  date: z.coerce.date(),
  rating: z.number().min(1).max(5).optional().nullable(),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

// Case Study Schema
export const CaseStudySchema = z.object({
  id: z.string().min(1, 'Case study ID is required'),
  title: z.string().min(1, 'Title is required'),
  client: z.string().min(1, 'Client is required'),
  industry: z.string().min(1, 'Industry is required'),
  challenge: z.string().min(20, 'Challenge must be at least 20 characters'),
  solution: z.string().min(20, 'Solution must be at least 20 characters'),
  implementation: z.array(z.string().min(1, 'Implementation step cannot be empty')),
  results: z.array(ResultSchema),
  testimonial: TestimonialSchema.optional(),
  images: z.array(z.string().url('Invalid image URL')),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')),
  featured: z.boolean(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
}).refine((data) => {
  // Ensure end date is after start date if provided
  if (data.endDate && data.startDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Contact Form Data Schema
export const ContactFormDataSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  company: z.string().max(100, 'Company name must be less than 100 characters').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
});

// Contact Link Schema
export const ContactLinkSchema = z.object({
  id: z.string().min(1, 'Contact link ID is required'),
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Invalid URL'),
  icon: z.string().min(1, 'Icon is required'),
  label: z.string().min(1, 'Label is required'),
});

// Contact Interaction Schema
export const ContactInteractionSchema = z.object({
  id: z.string().min(1, 'Interaction ID is required'),
  type: z.enum(['form_submission', 'email_click', 'social_click', 'resume_download']),
  timestamp: z.coerce.date(),
  details: z.record(z.string(), z.any()).optional(),
});

// User Preferences Schema
export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string().min(2, 'Language code must be at least 2 characters'),
  timezone: z.string().min(1, 'Timezone is required'),
  emailNotifications: z.boolean(),
  publicProfile: z.boolean(),
});

// User Profile Schema
export const UserProfileSchema = z.object({
  id: z.string().min(1, 'User profile ID is required'),
  personalInfo: PersonalInfoSchema,
  experience: z.array(ExperienceSchema),
  skills: z.array(SkillSchema),
  education: z.array(EducationSchema),
  certifications: z.array(CertificationSchema),
  achievements: z.array(AchievementSchema),
  caseStudies: z.array(CaseStudySchema),
  testimonials: z.array(TestimonialSchema),
  preferences: UserPreferencesSchema,
});

// Validation Error Schema
export const ValidationErrorSchema = z.object({
  field: z.string().min(1, 'Field is required'),
  message: z.string().min(1, 'Message is required'),
  code: z.string().min(1, 'Code is required'),
});

// Validation Warning Schema
export const ValidationWarningSchema = z.object({
  field: z.string().min(1, 'Field is required'),
  message: z.string().min(1, 'Message is required'),
  code: z.string().min(1, 'Code is required'),
});

// Validation Result Schema
export const ValidationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(ValidationErrorSchema),
  warnings: z.array(ValidationWarningSchema),
});

// Enhanced error handling schemas
export const ParseErrorSchema = z.object({
  type: z.enum(['file_format', 'file_corrupted', 'file_empty', 'section_missing', 'parsing_failed', 'file_too_large', 'unsupported_format']),
  message: z.string().min(1, 'Error message is required'),
  section: z.string().optional(),
  suggestions: z.array(z.string().min(1, 'Suggestion cannot be empty')),
  recoverable: z.boolean(),
  details: z.record(z.string(), z.any()).optional(),
});

export const ParseResultSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  errors: z.array(ParseErrorSchema),
  warnings: z.array(ParseErrorSchema),
  confidence: z.number().min(0).max(1).optional(),
});

export const SectionParseResultSchema = z.object({
  section: z.enum(['experience', 'skills', 'education', 'achievements', 'personal_info']),
  success: z.boolean(),
  data: z.array(z.any()),
  errors: z.array(ParseErrorSchema),
  warnings: z.array(ParseErrorSchema),
  confidence: z.number().min(0).max(1),
});

// Updated Parsed Resume Schema
export const ParsedResumeSchema = z.object({
  personalInfo: PersonalInfoSchema.partial(),
  experience: z.array(ExperienceSchema),
  skills: z.array(SkillSchema),
  education: z.array(EducationSchema),
  achievements: z.array(AchievementSchema),
  rawText: z.string(),
  confidence: z.number().min(0).max(1),
  parseResult: ParseResultSchema,
  sectionResults: z.array(SectionParseResultSchema),
});

// SEO Schemas
export const OpenGraphDataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('Invalid image URL'),
  url: z.string().url('Invalid URL'),
  type: z.string().min(1, 'Type is required'),
  siteName: z.string().min(1, 'Site name is required'),
});

export const TwitterCardDataSchema = z.object({
  card: z.enum(['summary', 'summary_large_image']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('Invalid image URL'),
  creator: z.string().optional(),
});

export const MetaTagsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  keywords: z.array(z.string().min(1, 'Keyword cannot be empty')),
  openGraph: OpenGraphDataSchema,
  twitter: TwitterCardDataSchema,
  canonical: z.string().url('Invalid canonical URL').optional(),
});

export const StructuredDataSchema = z.object({
  '@context': z.string().url('Invalid context URL'),
  '@type': z.string().min(1, 'Type is required'),
}).catchall(z.any());

// Analytics Schema
export const AnalyticsEventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  parameters: z.record(z.string(), z.any()),
  timestamp: z.coerce.date(),
});

export const PageDataSchema = z.object({
  path: z.string().min(1, 'Path is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  lastModified: z.coerce.date(),
  priority: z.number().min(0).max(1),
  changeFrequency: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']),
});

// API Response Schema
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const SubmissionResultSchema = z.object({
  success: z.boolean(),
  message: z.string().min(1, 'Message is required'),
  id: z.string().optional(),
});

// Image Schemas
export const ImageDataSchema = z.object({
  src: z.string().url('Invalid image source URL'),
  alt: z.string().min(1, 'Alt text is required'),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  priority: z.boolean().optional(),
});

export const OptimizedImageSchema = ImageDataSchema.extend({
  srcSet: z.string().min(1, 'Source set is required'),
  sizes: z.string().min(1, 'Sizes is required'),
  placeholder: z.string().optional(),
});

// Utility function to validate data against a schema
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Utility function to safely validate data (returns null on error)
export function safeValidateData<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}

// Utility function to get validation errors as a formatted object
export function getValidationErrors(error: z.ZodError): ValidationError[] {
  const errors: ValidationError[] = [];
  
  error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors.push({
      field: path,
      message: issue.message,
      code: issue.code,
    });
  });
  
  return errors;
}

// Utility function to convert ValidationError[] to Record<string, string[]>
export function formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  
  errors.forEach((error) => {
    if (!formatted[error.field]) {
      formatted[error.field] = [];
    }
    formatted[error.field].push(error.message);
  });
  
  return formatted;
}

// Export all schemas as a collection for easy access
export const ValidationSchemas = {
  PersonalInfo: PersonalInfoSchema,
  Metric: MetricSchema,
  Experience: ExperienceSchema,
  Skill: SkillSchema,
  Education: EducationSchema,
  Certification: CertificationSchema,
  Achievement: AchievementSchema,
  Result: ResultSchema,
  Testimonial: TestimonialSchema,
  CaseStudy: CaseStudySchema,
  ContactFormData: ContactFormDataSchema,
  ContactLink: ContactLinkSchema,
  ContactInteraction: ContactInteractionSchema,
  UserPreferences: UserPreferencesSchema,
  UserProfile: UserProfileSchema,
  ValidationError: ValidationErrorSchema,
  ValidationWarning: ValidationWarningSchema,
  ValidationResult: ValidationResultSchema,
  ParseError: ParseErrorSchema,
  ParseResult: ParseResultSchema,
  SectionParseResult: SectionParseResultSchema,
  ParsedResume: ParsedResumeSchema,
  OpenGraphData: OpenGraphDataSchema,
  TwitterCardData: TwitterCardDataSchema,
  MetaTags: MetaTagsSchema,
  StructuredData: StructuredDataSchema,
  AnalyticsEvent: AnalyticsEventSchema,
  PageData: PageDataSchema,
  ApiResponse: ApiResponseSchema,
  SubmissionResult: SubmissionResultSchema,
  ImageData: ImageDataSchema,
  OptimizedImage: OptimizedImageSchema,
} as const;