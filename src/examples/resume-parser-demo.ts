/**
 * Resume Parser Demo
 * Demonstrates how to use the resume parser with comprehensive error handling
 */

import { parseResumeDocument } from '../utils/resume-parser';
import type { ParsedResume, ParseResult } from '../types';

/**
 * Demo function showing how to parse a resume file with error handling
 */
export async function demoResumeParser(file: File): Promise<ParsedResume | null> {
  try {
    console.log('Starting resume parsing...');
    console.log(`File: ${file.name} (${file.type})`);
    
    // Parse the resume document
    const parseResult = await parseResumeDocument(file);
    
    if (parseResult.success && parseResult.data) {
      const parsedResume = parseResult.data;
      console.log('Resume parsing completed successfully!');
      console.log(`Confidence: ${(parsedResume.confidence * 100).toFixed(1)}%`);
      console.log(`Experience entries: ${parsedResume.experience.length}`);
      console.log(`Skills found: ${parsedResume.skills.length}`);
      console.log(`Education entries: ${parsedResume.education.length}`);
      console.log(`Achievements: ${parsedResume.achievements.length}`);
      
      // Display warnings if any
      if (parseResult.warnings.length > 0) {
        console.log('\n⚠️ Warnings:');
        parseResult.warnings.forEach(warning => {
          console.log(`- ${warning.message}`);
        });
      }
      
      return parsedResume;
    } else {
      console.log('❌ Resume parsing failed with errors:');
      parseResult.errors.forEach(error => {
        console.log(`- ${error.type}: ${error.message}`);
        if (error.suggestions.length > 0) {
          console.log('  Suggestions:');
          error.suggestions.forEach(suggestion => {
            console.log(`    • ${suggestion}`);
          });
        }
      });
      
      return null;
    }
  } catch (error) {
    console.error('Resume parsing failed:', error);
    return null;
  }
}

/**
 * Demo function showing how to handle parsing results
 */
export function handleParsingResults(parsedResume: ParsedResume): void {
  console.log('\n=== PARSING RESULTS ===');
  
  // Display experience
  if (parsedResume.experience.length > 0) {
    console.log('\nPROFESSIONAL EXPERIENCE:');
    parsedResume.experience.forEach((exp, index) => {
      console.log(`${index + 1}. ${exp.position} at ${exp.company}`);
      console.log(`   Duration: ${exp.startDate.getFullYear()} - ${exp.endDate ? exp.endDate.getFullYear() : 'Present'}`);
      console.log(`   Location: ${exp.location}`);
      if (exp.achievements.length > 0) {
        console.log(`   Key achievements: ${exp.achievements.length} items`);
      }
    });
  }
  
  // Display skills by category
  if (parsedResume.skills.length > 0) {
    console.log('\nSKILLS BY CATEGORY:');
    const skillsByCategory = parsedResume.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);
    
    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      console.log(`${category.toUpperCase()}: ${skills.join(', ')}`);
    });
  }
  
  // Display education
  if (parsedResume.education.length > 0) {
    console.log('\nEDUCATION:');
    parsedResume.education.forEach((edu, index) => {
      console.log(`${index + 1}. ${edu.degree} in ${edu.field}`);
      console.log(`   Institution: ${edu.institution}`);
      if (edu.gpa) {
        console.log(`   GPA: ${edu.gpa}`);
      }
    });
  }
  
  // Display achievements
  if (parsedResume.achievements.length > 0) {
    console.log('\nACHIEVEMENTS:');
    parsedResume.achievements.forEach((achievement, index) => {
      console.log(`${index + 1}. ${achievement.title}`);
      if (achievement.organization) {
        console.log(`   Organization: ${achievement.organization}`);
      }
    });
  }
  
  // Confidence assessment
  console.log('\n=== PARSING ASSESSMENT ===');
  if (parsedResume.confidence >= 0.8) {
    console.log('✅ High confidence - Resume parsed successfully with comprehensive data');
  } else if (parsedResume.confidence >= 0.6) {
    console.log('⚠️ Medium confidence - Most data extracted, some manual review recommended');
  } else {
    console.log('❌ Low confidence - Significant manual review and data entry required');
  }
}

/**
 * Demo function showing error handling
 */
export function demoErrorHandling(): void {
  console.log('\n=== ERROR HANDLING DEMO ===');
  
  const errorScenarios = [
    {
      name: 'Unsupported file format',
      error: 'Unsupported file format: application/unknown',
      solution: 'Please upload a PDF, Word document (.docx), or plain text file'
    },
    {
      name: 'PDF parsing failure',
      error: 'Failed to parse PDF resume: Invalid PDF structure',
      solution: 'Try converting the PDF to text or uploading a different format'
    },
    {
      name: 'Word document parsing failure',
      error: 'Failed to parse Word resume: Corrupted document',
      solution: 'Try saving the document in a different format or upload as PDF'
    },
    {
      name: 'Empty or invalid content',
      error: 'No readable content found in the document',
      solution: 'Ensure the document contains text and is not image-based'
    }
  ];
  
  errorScenarios.forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.name}`);
    console.log(`   Error: ${scenario.error}`);
    console.log(`   Solution: ${scenario.solution}`);
  });
}

/**
 * Usage example for the application
 */
export const resumeParserUsageExample = `
// Example usage in a React component:

import { parseResumeDocument } from '../utils/resume-parser';
import { demoResumeParser, handleParsingResults } from '../examples/resume-parser-demo';

const ResumeUploadComponent = () => {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      // Parse the resume
      const parsedResume = await demoResumeParser(file);
      
      if (parsedResume) {
        // Handle successful parsing
        handleParsingResults(parsedResume);
        
        // Save to application state or send to API
        // updateUserProfile(parsedResume);
      }
    } catch (error) {
      console.error('Resume upload failed:', error);
      // Show error message to user
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        accept=".pdf,.docx,.txt"
        onChange={handleFileUpload}
      />
    </div>
  );
};
`;

console.log('Resume Parser Demo module loaded');
console.log('Available functions:');
console.log('- demoResumeParser(file): Parse a resume file');
console.log('- handleParsingResults(parsedResume): Display parsing results');
console.log('- demoErrorHandling(): Show error handling scenarios');