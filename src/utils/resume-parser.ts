/**
 * Resume Parser Utility
 * Parses resume documents in PDF, Word, and plain text formats
 * Extracts professional experience, skills, and education information
 * Provides comprehensive error handling and user feedback
 */

import type { ParsedResume, Experience, Skill, Education, Achievement, ParseResult, SectionParseResult, ParseError } from '../types';
import { generateId } from './index';
import {
  createParseError,
  createSuccessResult,
  createFailureResult,
  createSectionResult,
  validateFile,
  validateParsedContent,
} from './error-handling';

/**
 * Parses a resume file based on its format
 * Supports PDF, Word (.docx), and plain text formats
 * Returns comprehensive parsing results with error handling
 */
export async function parseResumeDocument(file: File): Promise<ParseResult<ParsedResume>> {
  try {
    // Validate file before processing
    const fileErrors = validateFile(file);
    if (fileErrors.length > 0) {
      return createFailureResult(fileErrors);
    }

    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    let rawText = '';
    const parseErrors: ParseError[] = [];

    // Determine file type and parse accordingly
    try {
      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        rawText = await parsePdfResume(file);
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileName.endsWith('.docx')
      ) {
        rawText = await parseWordResume(file);
      } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        rawText = await parsePlainTextResume(file);
      } else {
        parseErrors.push(createParseError(
          'unsupported_format',
          `Unsupported file format: ${fileType || fileName}`,
          undefined,
          undefined,
          { fileType, fileName }
        ));
        return createFailureResult(parseErrors);
      }
    } catch (error) {
      parseErrors.push(createParseError(
        'file_corrupted',
        `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        { originalError: error }
      ));
      return createFailureResult(parseErrors);
    }

    // Extract structured data from raw text with error handling
    const experienceResult = extractExperienceWithErrorHandling(rawText);
    const skillsResult = extractSkillsWithErrorHandling(rawText);
    const educationResult = extractEducationWithErrorHandling(rawText);
    const achievementsResult = extractAchievementsWithErrorHandling(rawText);

    // Validate overall content
    const { errors: contentErrors, warnings: contentWarnings } = validateParsedContent(
      rawText,
      experienceResult.data,
      skillsResult.data,
      educationResult.data,
      achievementsResult.data
    );

    // Collect all errors and warnings
    const allErrors = [
      ...parseErrors,
      ...contentErrors,
      ...experienceResult.errors,
      ...skillsResult.errors,
      ...educationResult.errors,
      ...achievementsResult.errors,
    ];

    const allWarnings = [
      ...contentWarnings,
      ...experienceResult.warnings,
      ...skillsResult.warnings,
      ...educationResult.warnings,
      ...achievementsResult.warnings,
    ];

    // Calculate overall confidence score
    const sectionResults = [experienceResult, skillsResult, educationResult, achievementsResult];
    const confidence = calculateOverallConfidence(sectionResults, rawText);

    // Create the parsed resume object
    const parsedResume: ParsedResume = {
      personalInfo: {},
      experience: experienceResult.data,
      skills: skillsResult.data,
      education: educationResult.data,
      achievements: achievementsResult.data,
      rawText,
      confidence,
      parseResult: allErrors.length > 0 
        ? createFailureResult(allErrors, allWarnings)
        : createSuccessResult({} as ParsedResume, allWarnings),
      sectionResults,
    };

    // Return success if we have some data, even with warnings
    if (allErrors.length === 0) {
      return createSuccessResult(parsedResume, allWarnings);
    } else {
      return createFailureResult(allErrors, allWarnings);
    }

  } catch (error) {
    const criticalError = createParseError(
      'parsing_failed',
      `Critical parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      [
        'Try uploading your resume in a different format',
        'Ensure the file is not corrupted',
        'Contact support if the problem persists',
      ],
      { originalError: error }
    );

    return createFailureResult([criticalError]);
  }
}

/**
 * Extracts professional experience with comprehensive error handling
 */
function extractExperienceWithErrorHandling(text: string): SectionParseResult {
  const errors: ParseError[] = [];
  const warnings: ParseError[] = [];
  
  try {
    const experience = extractExperience(text);
    
    // Check if section was found but parsing failed
    const hasExperienceSection = /(?:professional\s+)?experience|work\s+history|employment|career/i.test(text);
    
    if (hasExperienceSection && experience.length === 0) {
      warnings.push(createParseError(
        'parsing_failed',
        'Experience section found but no entries could be parsed',
        'experience',
        [
          'Ensure job entries include company names and positions',
          'Use consistent date formats (e.g., "2020-2023")',
          'Separate each job with clear formatting',
        ]
      ));
    } else if (!hasExperienceSection) {
      warnings.push(createParseError(
        'section_missing',
        'No experience section detected in resume',
        'experience'
      ));
    }

    // Validate extracted experience entries
    const validatedExperience = experience.filter(exp => {
      if (!exp.company || exp.company === 'Unknown Company') {
        warnings.push(createParseError(
          'parsing_failed',
          `Experience entry missing company name: "${exp.position}"`,
          'experience',
          ['Ensure each job entry includes a clear company name']
        ));
        return false;
      }
      return true;
    });

    const confidence = calculateSectionConfidence('experience', text, validatedExperience.length);
    
    return createSectionResult('experience', true, validatedExperience, errors, warnings, confidence);
    
  } catch (error) {
    errors.push(createParseError(
      'parsing_failed',
      `Failed to parse experience section: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'experience'
    ));
    
    return createSectionResult('experience', false, [], errors, warnings, 0);
  }
}

/**
 * Extracts skills with comprehensive error handling
 */
function extractSkillsWithErrorHandling(text: string): SectionParseResult {
  const errors: ParseError[] = [];
  const warnings: ParseError[] = [];
  
  try {
    const skills = extractSkills(text);
    
    // Check if section was found but parsing failed
    const hasSkillsSection = /(?:technical\s+)?skills|competencies|expertise|proficiencies/i.test(text);
    
    if (hasSkillsSection && skills.length === 0) {
      warnings.push(createParseError(
        'parsing_failed',
        'Skills section found but no skills could be parsed',
        'skills',
        [
          'Use comma-separated lists or bullet points for skills',
          'Include both technical and soft skills',
          'Group similar skills together',
        ]
      ));
    } else if (!hasSkillsSection && skills.length === 0) {
      warnings.push(createParseError(
        'section_missing',
        'No skills section detected in resume',
        'skills'
      ));
    }

    // Validate skill quality
    const validatedSkills = skills.filter(skill => {
      if (skill.name.length < 2) {
        warnings.push(createParseError(
          'parsing_failed',
          `Skill name too short: "${skill.name}"`,
          'skills',
          ['Ensure skill names are descriptive and complete']
        ));
        return false;
      }
      return true;
    });

    const confidence = calculateSectionConfidence('skills', text, validatedSkills.length);
    
    return createSectionResult('skills', true, validatedSkills, errors, warnings, confidence);
    
  } catch (error) {
    errors.push(createParseError(
      'parsing_failed',
      `Failed to parse skills section: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'skills'
    ));
    
    return createSectionResult('skills', false, [], errors, warnings, 0);
  }
}

/**
 * Extracts education with comprehensive error handling
 */
function extractEducationWithErrorHandling(text: string): SectionParseResult {
  const errors: ParseError[] = [];
  const warnings: ParseError[] = [];
  
  try {
    const education = extractEducation(text);
    
    // Check if section was found but parsing failed
    const hasEducationSection = /education|academic|degree|university|college|school/i.test(text);
    
    if (hasEducationSection && education.length === 0) {
      warnings.push(createParseError(
        'parsing_failed',
        'Education section found but no entries could be parsed',
        'education',
        [
          'Include degree type and field of study',
          'Mention institution names clearly',
          'Add graduation dates or expected completion dates',
        ]
      ));
    } else if (!hasEducationSection) {
      warnings.push(createParseError(
        'section_missing',
        'No education section detected in resume',
        'education'
      ));
    }

    // Validate education entries
    const validatedEducation = education.filter(edu => {
      if (!edu.institution || edu.institution === 'Unknown Institution') {
        warnings.push(createParseError(
          'parsing_failed',
          `Education entry missing institution: "${edu.degree}"`,
          'education',
          ['Ensure each education entry includes the institution name']
        ));
        return false;
      }
      return true;
    });

    const confidence = calculateSectionConfidence('education', text, validatedEducation.length);
    
    return createSectionResult('education', true, validatedEducation, errors, warnings, confidence);
    
  } catch (error) {
    errors.push(createParseError(
      'parsing_failed',
      `Failed to parse education section: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'education'
    ));
    
    return createSectionResult('education', false, [], errors, warnings, 0);
  }
}

/**
 * Extracts achievements with comprehensive error handling
 */
function extractAchievementsWithErrorHandling(text: string): SectionParseResult {
  const errors: ParseError[] = [];
  const warnings: ParseError[] = [];
  
  try {
    const achievements = extractAchievements(text);
    
    // Check if section was found but parsing failed
    const hasAchievementsSection = /awards|recognition|achievements|honors|certifications/i.test(text);
    
    if (hasAchievementsSection && achievements.length === 0) {
      warnings.push(createParseError(
        'parsing_failed',
        'Achievements section found but no entries could be parsed',
        'achievements',
        [
          'Use bullet points or clear formatting for achievements',
          'Include dates and issuing organizations',
          'Describe the significance of each achievement',
        ]
      ));
    }
    // Note: Missing achievements section is not a warning as it's optional

    const confidence = calculateSectionConfidence('achievements', text, achievements.length);
    
    return createSectionResult('achievements', true, achievements, errors, warnings, confidence);
    
  } catch (error) {
    errors.push(createParseError(
      'parsing_failed',
      `Failed to parse achievements section: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'achievements'
    ));
    
    return createSectionResult('achievements', false, [], errors, warnings, 0);
  }
}

/**
 * Calculates confidence score for a specific section
 */
function calculateSectionConfidence(
  section: string,
  text: string,
  extractedCount: number
): number {
  let confidence = 0.1; // Base confidence

  // Check if section exists in text
  const sectionPatterns: Record<string, RegExp> = {
    experience: /(?:professional\s+)?experience|work\s+history|employment|career/i,
    skills: /(?:technical\s+)?skills|competencies|expertise|proficiencies/i,
    education: /education|academic|degree|university|college|school/i,
    achievements: /awards|recognition|achievements|honors|certifications/i,
  };

  const pattern = sectionPatterns[section];
  if (pattern && pattern.test(text)) {
    confidence += 0.3; // Section found
    
    if (extractedCount > 0) {
      confidence += 0.4; // Data extracted
      confidence += Math.min(extractedCount * 0.1, 0.2); // More items = higher confidence
    }
  }

  return Math.min(confidence, 1.0);
}

/**
 * Calculates overall confidence based on section results
 */
function calculateOverallConfidence(
  sectionResults: SectionParseResult[],
  rawText: string
): number {
  const weights = {
    experience: 0.4,
    skills: 0.2,
    education: 0.2,
    achievements: 0.1,
    personal_info: 0.1,
  };

  let weightedSum = 0;
  let totalWeight = 0;

  sectionResults.forEach(result => {
    const weight = weights[result.section] || 0.1;
    weightedSum += result.confidence * weight;
    totalWeight += weight;
  });

  // Base confidence from text quality
  const textQuality = Math.min(rawText.length / 1000, 1.0) * 0.1;
  
  return Math.min((weightedSum / totalWeight) + textQuality, 1.0);
}
/**
 * Parses a PDF resume file with enhanced error handling
 */
async function parsePdfResume(file: File): Promise<string> {
  try {
    // Dynamic import to avoid issues in non-Node environments
    const pdfParseModule = await import('pdf-parse');
    // Handle both CommonJS and ES module exports
    const pdfParse = (pdfParseModule as any).default || pdfParseModule;
    const buffer = await file.arrayBuffer();
    
    if (buffer.byteLength === 0) {
      throw new Error('PDF file appears to be empty');
    }
    
    const data = await pdfParse(buffer);
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('PDF contains no readable text content');
    }
    
    return data.text;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        throw new Error('The PDF file appears to be corrupted or invalid');
      } else if (error.message.includes('password')) {
        throw new Error('The PDF file is password protected. Please provide an unprotected version');
      } else if (error.message.includes('encrypted')) {
        throw new Error('The PDF file is encrypted. Please provide an unencrypted version');
      }
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
    throw new Error('Unknown error occurred while parsing PDF');
  }
}

/**
 * Parses a Word (.docx) resume file with enhanced error handling
 */
async function parseWordResume(file: File): Promise<string> {
  try {
    // Dynamic import to avoid issues in non-Node environments
    const mammoth = await import('mammoth');
    const buffer = await file.arrayBuffer();
    
    if (buffer.byteLength === 0) {
      throw new Error('Word document appears to be empty');
    }
    
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('Word document contains no readable text content');
    }
    
    // Check for conversion warnings
    if (result.messages && result.messages.length > 0) {
      const errors = result.messages.filter(msg => msg.type === 'error');
      if (errors.length > 0) {
        console.warn('Word document conversion warnings:', result.messages);
      }
    }
    
    return result.value;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not a valid zip file')) {
        throw new Error('The Word document appears to be corrupted or is not a valid .docx file');
      } else if (error.message.includes('password')) {
        throw new Error('The Word document is password protected. Please provide an unprotected version');
      }
      throw new Error(`Word document parsing failed: ${error.message}`);
    }
    throw new Error('Unknown error occurred while parsing Word document');
  }
}

/**
 * Parses a plain text resume file with enhanced error handling
 */
async function parsePlainTextResume(file: File): Promise<string> {
  try {
    const text = await file.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Text file appears to be empty');
    }
    
    if (text.length < 50) {
      throw new Error('Text file contains very little content');
    }
    
    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Text file parsing failed: ${error.message}`);
    }
    throw new Error('Unknown error occurred while parsing text file');
  }
}

/**
 * Extracts professional experience from resume text
 */
export function extractExperience(text: string): Experience[] {
  const experiences: Experience[] = [];

  // Common patterns for experience sections
  const experiencePatterns = [
    /(?:professional\s+)?experience|work\s+history|employment|career/i,
  ];

  // Find experience section
  let experienceStart = -1;
  for (const pattern of experiencePatterns) {
    const match = text.search(pattern);
    if (match !== -1) {
      experienceStart = match;
      break;
    }
  }

  if (experienceStart === -1) {
    return experiences;
  }

  // Extract text from experience section to next major section
  const sectionEnd = findNextSection(text, experienceStart);
  const experienceText = text.substring(experienceStart, sectionEnd);

  // Split by common job entry patterns
  const jobEntries = experienceText.split(/\n(?=[A-Z][a-z]+\s+(?:at|@|-|,|\d{4})|^\d{4})/m);

  for (const entry of jobEntries) {
    if (entry.trim().length < 20) continue;

    const experience = parseJobEntry(entry);
    if (experience) {
      experiences.push(experience);
    }
  }

  return experiences;
}

/**
 * Parses a single job entry
 */
function parseJobEntry(entry: string): Experience | null {
  const lines = entry.split('\n').filter((line) => line.trim());
  if (lines.length === 0) return null;

  // Extract company and position
  const firstLine = lines[0];
  const companyMatch = firstLine.match(/(?:at|@|-|,)\s*(.+?)(?:\s*\(|$)/);
  const company = companyMatch ? companyMatch[1].trim() : '';

  const positionMatch = firstLine.match(/^(.+?)(?:\s+at|\s+@|-|,)/i);
  const position = positionMatch ? positionMatch[1].trim() : '';

  // Extract dates
  const dateMatch = entry.match(/(\d{4})\s*[-–]\s*(?:(\d{4})|present|current|ongoing)/i);
  const startDate = dateMatch ? new Date(parseInt(dateMatch[1]), 0, 1) : new Date();
  const endDate = dateMatch && dateMatch[2] ? new Date(parseInt(dateMatch[2]), 0, 1) : undefined;

  // Extract location
  const locationMatch = entry.match(/(?:location|based|in)\s*[:–]\s*(.+?)(?:\n|$)/i);
  const location = locationMatch ? locationMatch[1].trim() : '';

  // Extract description and achievements
  const description = lines.slice(1).join(' ').substring(0, 500);
  const achievements = extractAchievementsFromText(entry);

  if (!company && !position) {
    return null;
  }

  return {
    id: generateId(),
    company: company || 'Unknown Company',
    position: position || 'Unknown Position',
    startDate,
    endDate,
    location: location || 'Unknown Location',
    description,
    achievements,
    technologies: extractTechnologies(entry),
    metrics: [],
  };
}

/**
 * Extracts skills from resume text
 */
export function extractSkills(text: string): Skill[] {
  const skills: Skill[] = [];
  const skillsSet = new Set<string>();

  // Common patterns for skills section
  const skillsPatterns = [/(?:technical\s+)?skills|competencies|expertise|proficiencies/i];

  // Find skills section
  let skillsStart = -1;
  for (const pattern of skillsPatterns) {
    const match = text.search(pattern);
    if (match !== -1) {
      skillsStart = match;
      break;
    }
  }

  let skillsText = text;
  if (skillsStart !== -1) {
    const sectionEnd = findNextSection(text, skillsStart);
    skillsText = text.substring(skillsStart, sectionEnd);
  }

  // Extract skills from common formats
  // Format 1: Comma-separated list
  const commaListMatch = skillsText.match(/(?:skills|expertise)[\s:]*([^:\n]+(?:,[^:\n]+)*)/i);
  if (commaListMatch) {
    const skillsList = commaListMatch[1].split(',').map((s) => s.trim());
    skillsList.forEach((skill) => {
      if (skill.length > 2 && skill.length < 50) {
        skillsSet.add(skill);
      }
    });
  }

  // Format 2: Bullet points
  const bulletMatches = skillsText.match(/[•\-\*]\s+([^\n]+)/g);
  if (bulletMatches) {
    bulletMatches.forEach((match) => {
      const skill = match.replace(/^[•\-\*]\s+/, '').trim();
      if (skill.length > 2 && skill.length < 50) {
        skillsSet.add(skill);
      }
    });
  }

  // Format 3: Common technical skills
  const technicalSkills = extractTechnologies(text);
  technicalSkills.forEach((skill) => skillsSet.add(skill));

  // Convert to Skill objects
  skillsSet.forEach((skillName) => {
    skills.push({
      id: generateId(),
      name: skillName,
      category: categorizeSkill(skillName),
      level: 'intermediate',
    });
  });

  return skills;
}

/**
 * Extracts education from resume text
 */
export function extractEducation(text: string): Education[] {
  const education: Education[] = [];

  // Common patterns for education section
  const educationPatterns = [/education|academic|degree|university|college|school/i];

  // Find education section
  let educationStart = -1;
  for (const pattern of educationPatterns) {
    const match = text.search(pattern);
    if (match !== -1) {
      educationStart = match;
      break;
    }
  }

  if (educationStart === -1) {
    return education;
  }

  // Extract text from education section to next major section
  const sectionEnd = findNextSection(text, educationStart);
  const educationText = text.substring(educationStart, sectionEnd);

  // Split by common education entry patterns
  const eduEntries = educationText.split(/\n(?=[A-Z][a-z]+\s+(?:University|College|School|Institute)|^\d{4})/m);

  for (const entry of eduEntries) {
    if (entry.trim().length < 10) continue;

    const edu = parseEducationEntry(entry);
    if (edu) {
      education.push(edu);
    }
  }

  return education;
}

/**
 * Parses a single education entry
 */
function parseEducationEntry(entry: string): Education | null {
  const lines = entry.split('\n').filter((line) => line.trim());
  if (lines.length === 0) return null;

  // Extract institution
  const institutionMatch = entry.match(/(?:from|at|@)?\s*([A-Z][^,\n]+(?:University|College|School|Institute)[^,\n]*)/i);
  const institution = institutionMatch ? institutionMatch[1].trim() : lines[0];

  // Extract degree
  const degreeMatch = entry.match(/(?:degree|earned|received)[\s:]*([^,\n]+)/i);
  const degree = degreeMatch ? degreeMatch[1].trim() : '';

  // Extract field of study
  const fieldMatch = entry.match(/(?:in|major|field)[\s:]*([^,\n]+)/i);
  const field = fieldMatch ? fieldMatch[1].trim() : '';

  // Extract dates
  const dateMatch = entry.match(/(\d{4})\s*[-–]\s*(?:(\d{4})|present|current)/i);
  const startDate = dateMatch ? new Date(parseInt(dateMatch[1]), 0, 1) : new Date();
  const endDate = dateMatch && dateMatch[2] ? new Date(parseInt(dateMatch[2]), 0, 1) : undefined;

  // Extract GPA
  const gpaMatch = entry.match(/(?:gpa|grade)[\s:]*(\d+\.?\d*)/i);
  const gpa = gpaMatch ? parseFloat(gpaMatch[1]) : undefined;

  if (!institution) {
    return null;
  }

  return {
    id: generateId(),
    institution,
    degree: degree || 'Degree',
    field: field || 'Field of Study',
    startDate,
    endDate,
    gpa,
    achievements: extractAchievementsFromText(entry),
  };
}

/**
 * Extracts achievements from resume text
 */
export function extractAchievements(text: string): Achievement[] {
  const achievements: Achievement[] = [];

  // Common patterns for achievements section
  const achievementPatterns = [/awards|recognition|achievements|honors|certifications/i];

  // Find achievements section
  let achievementsStart = -1;
  for (const pattern of achievementPatterns) {
    const match = text.search(pattern);
    if (match !== -1) {
      achievementsStart = match;
      break;
    }
  }

  if (achievementsStart === -1) {
    return achievements;
  }

  // Extract text from achievements section to next major section
  const sectionEnd = findNextSection(text, achievementsStart);
  const achievementsText = text.substring(achievementsStart, sectionEnd);

  // Split by bullet points or line breaks
  const achievementEntries = achievementsText.split(/\n[•\-\*]\s+/);

  for (const entry of achievementEntries) {
    if (entry.trim().length < 10) continue;

    const achievement = parseAchievementEntry(entry);
    if (achievement) {
      achievements.push(achievement);
    }
  }

  return achievements;
}

/**
 * Parses a single achievement entry
 */
function parseAchievementEntry(entry: string): Achievement | null {
  const title = entry.split('\n')[0].trim();
  if (!title || title.length < 5) return null;

  // Extract date
  const dateMatch = entry.match(/(\d{4})/);
  const date = dateMatch ? new Date(parseInt(dateMatch[1]), 0, 1) : new Date();

  // Extract organization
  const orgMatch = entry.match(/(?:from|by|at)\s+([^,\n]+)/i);
  const organization = orgMatch ? orgMatch[1].trim() : undefined;

  return {
    id: generateId(),
    title,
    description: entry.substring(0, 200),
    date,
    category: 'recognition',
    organization,
  };
}

/**
 * Extracts technologies from text
 */
function extractTechnologies(text: string): string[] {
  const technologies = new Set<string>();

  // Common technology keywords
  const techKeywords = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C#',
    'C++',
    'React',
    'Vue',
    'Angular',
    'Node.js',
    'Express',
    'Django',
    'Flask',
    'SQL',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'AWS',
    'Azure',
    'GCP',
    'Docker',
    'Kubernetes',
    'Git',
    'REST',
    'GraphQL',
    'HTML',
    'CSS',
    'Tailwind',
    'Bootstrap',
    'Next.js',
    'Nuxt',
    'Svelte',
    'Rust',
    'Go',
    'PHP',
    'Ruby',
    'Rails',
    'Laravel',
    'Spring',
    'Hibernate',
    'JPA',
    'Elasticsearch',
    'Redis',
    'RabbitMQ',
    'Kafka',
    'Jenkins',
    'GitLab',
    'GitHub',
    'Terraform',
    'Ansible',
    'Linux',
    'Windows',
    'macOS',
  ];

  // Search for technology keywords in text
  for (const tech of techKeywords) {
    if (new RegExp(`\\b${tech}\\b`, 'i').test(text)) {
      technologies.add(tech);
    }
  }

  return Array.from(technologies);
}

/**
 * Categorizes a skill
 */
function categorizeSkill(skill: string): 'technical' | 'soft' | 'industry' {
  const technicalKeywords = [
    'javascript',
    'python',
    'java',
    'react',
    'node',
    'sql',
    'aws',
    'docker',
    'git',
    'api',
    'database',
    'programming',
    'coding',
    'development',
    'software',
    'web',
    'mobile',
    'cloud',
    'devops',
    'frontend',
    'backend',
    'fullstack',
  ];

  const softKeywords = [
    'communication',
    'leadership',
    'teamwork',
    'problem-solving',
    'critical thinking',
    'time management',
    'organization',
    'collaboration',
    'presentation',
    'negotiation',
    'adaptability',
    'creativity',
    'analytical',
  ];

  const skillLower = skill.toLowerCase();

  if (technicalKeywords.some((keyword) => skillLower.includes(keyword))) {
    return 'technical';
  }

  if (softKeywords.some((keyword) => skillLower.includes(keyword))) {
    return 'soft';
  }

  return 'industry';
}

/**
 * Extracts achievements from a text block
 */
function extractAchievementsFromText(text: string): string[] {
  const achievements: string[] = [];

  // Look for achievement indicators
  const achievementPatterns = [
    /(?:achieved|accomplished|improved|increased|reduced|led|managed|delivered|implemented)\s+([^.\n]+)/gi,
    /(?:resulted in|led to|contributed to)\s+([^.\n]+)/gi,
  ];

  for (const pattern of achievementPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const achievement = match[1].trim();
      if (achievement.length > 10 && achievement.length < 200) {
        achievements.push(achievement);
      }
    }
  }

  return achievements.slice(0, 5); // Limit to 5 achievements
}

/**
 * Finds the next major section in the text
 */
function findNextSection(text: string, currentPos: number): number {
  const sectionPatterns = [
    /\n(?:education|experience|skills|certifications|awards|projects|publications|references|summary|objective|about)/i,
  ];

  let nextSectionPos = text.length;

  for (const pattern of sectionPatterns) {
    const match = text.substring(currentPos + 1).search(pattern);
    if (match !== -1) {
      nextSectionPos = Math.min(nextSectionPos, currentPos + 1 + match);
    }
  }

  return nextSectionPos;
}

/**
 * Calculates confidence score for parsed resume
 */
function calculateConfidence(
  experience: Experience[],
  skills: Skill[],
  education: Education[]
): number {
  let confidence = 0.5; // Base confidence

  // Increase confidence based on extracted data
  if (experience.length > 0) confidence += 0.15;
  if (experience.length > 2) confidence += 0.1;
  if (skills.length > 0) confidence += 0.1;
  if (skills.length > 5) confidence += 0.05;
  if (education.length > 0) confidence += 0.15;

  return Math.min(confidence, 1.0);
}
