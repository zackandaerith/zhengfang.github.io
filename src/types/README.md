# TypeScript Interfaces and Validation Schemas

This directory contains comprehensive TypeScript interfaces and Zod validation schemas for the Customer Success Manager Portfolio website.

## Overview

The type system is designed to ensure data integrity and provide excellent developer experience through:

- **Comprehensive TypeScript interfaces** for all data models
- **Runtime validation** using Zod schemas
- **Utility functions** for validation and type checking
- **Type guards** for safe runtime type checking

## Core Data Models

### User Profile (`UserProfile`)
The main data structure containing all user information:
- Personal information
- Work experience
- Skills and certifications
- Education
- Achievements
- Case studies
- Testimonials
- User preferences

### Personal Information (`PersonalInfo`)
Basic profile information including:
- Name, title, location
- Contact information (email, phone, LinkedIn)
- Professional summary
- Profile image

### Experience (`Experience`)
Work experience entries with:
- Company and position details
- Date ranges
- Achievements and technologies
- Associated metrics

### Case Studies (`CaseStudy`)
Detailed project showcases including:
- Client and industry information
- Challenge, solution, and implementation
- Measurable results
- Client testimonials
- Supporting images and tags

### Metrics (`Metric`)
Quantifiable achievements with:
- Name, value, and unit
- Category (retention, growth, satisfaction, efficiency, revenue)
- Timeframe and context
- Detailed descriptions

### Contact Form (`ContactFormData`)
Contact form submissions with:
- Sender information
- Message content
- Subject line
- Company information (optional)

## Validation Features

### Runtime Validation
All interfaces have corresponding Zod schemas that provide:
- **Type safety** at runtime
- **Detailed error messages** for invalid data
- **Custom validation rules** (e.g., date ranges, URL formats)
- **Optional field handling**

### Validation Utilities
The `validation.ts` file provides utility functions:

```typescript
// Basic validation
const result = validatePersonalInfo(data);
if (result.isValid) {
  // Data is valid
} else {
  // Handle errors
  console.log(result.errors);
}

// Safe validation (returns typed data or null)
const personalInfo = safeValidatePersonalInfo(data);
if (personalInfo) {
  // Use typed data
}

// Type guards
if (isPersonalInfo(data)) {
  // TypeScript knows data is PersonalInfo
}
```

### Batch Validation
Validate arrays of data with detailed error reporting:

```typescript
const { valid, invalid } = validateExperienceList(experiences);
// valid: Experience[] - all valid entries
// invalid: { index: number; errors: Record<string, string[]> }[]
```

## Validation Rules

### Personal Information
- **Name**: Required, non-empty string
- **Email**: Valid email format
- **LinkedIn**: Valid URL format
- **Summary**: Minimum 10 characters
- **Profile Image**: Valid URL format

### Experience
- **Company/Position**: Required, non-empty strings
- **Description**: Minimum 10 characters
- **Date Range**: End date must be after start date (if provided)
- **Achievements**: Array of non-empty strings
- **Technologies**: Array of non-empty strings

### Case Studies
- **Challenge/Solution**: Minimum 20 characters each
- **Implementation**: Array of non-empty steps
- **Results**: Array of Result objects with metrics
- **Date Range**: End date must be after start date (if provided)

### Contact Form
- **Name**: 1-100 characters
- **Email**: Valid email format
- **Message**: 10-1000 characters
- **Subject**: 1-200 characters
- **Company**: Optional, max 100 characters

### Metrics
- **Value**: Number or string
- **Category**: One of predefined categories
- **Required fields**: ID, name, unit, description, timeframe, context

## Usage Examples

### Basic Validation
```typescript
import { validateContactFormData } from '../utils/validation';

const formData = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello, I would like to connect.',
  subject: 'Connection Request'
};

const result = validateContactFormData(formData);
if (result.isValid) {
  // Process valid form data
} else {
  // Display validation errors
  result.errors.forEach(error => {
    console.log(`${error.field}: ${error.message}`);
  });
}
```

### Type-Safe Data Processing
```typescript
import { safeValidateUserProfile } from '../utils/validation';

function processUserProfile(rawData: unknown) {
  const profile = safeValidateUserProfile(rawData);
  if (profile) {
    // TypeScript knows profile is UserProfile
    console.log(`Processing profile for ${profile.personalInfo.name}`);
    return profile;
  } else {
    throw new Error('Invalid user profile data');
  }
}
```

### Form Error Handling
```typescript
import { getFieldErrors, hasFieldError } from '../utils/validation';

function displayFormErrors(validationResult: ValidationResult) {
  if (hasFieldError(validationResult, 'email')) {
    const emailErrors = getFieldErrors(validationResult, 'email');
    // Display email validation errors
  }
}
```

## Schema Exports

All schemas are exported from `validation.ts`:

```typescript
import {
  PersonalInfoSchema,
  ExperienceSchema,
  CaseStudySchema,
  MetricSchema,
  ContactFormDataSchema,
  UserProfileSchema,
  // ... and more
} from './validation';
```

Or use the collection:

```typescript
import { ValidationSchemas } from './validation';

const result = ValidationSchemas.PersonalInfo.safeParse(data);
```

## Error Handling

The validation system provides detailed error information:

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

## Integration with Forms

The validation schemas integrate seamlessly with form libraries:

```typescript
// React Hook Form integration
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactFormDataSchema } from '../types/validation';

const form = useForm({
  resolver: zodResolver(ContactFormDataSchema),
});
```

## Testing

Comprehensive test coverage ensures validation reliability:
- Valid data acceptance
- Invalid data rejection
- Edge case handling
- Error message accuracy
- Type guard functionality

See `__tests__/validation.test.ts` for detailed test examples.

## Performance

The validation system is optimized for performance:
- Lazy schema compilation
- Efficient error collection
- Minimal runtime overhead
- Reusable validation functions

## Future Enhancements

Planned improvements include:
- Custom validation messages
- Internationalization support
- Advanced schema composition
- Performance optimizations
- Additional utility functions