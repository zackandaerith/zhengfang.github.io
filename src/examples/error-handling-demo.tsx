/**
 * Error Handling Demo Component
 * Demonstrates comprehensive error handling and user feedback for resume parsing
 */

import React, { useState } from 'react';
import { parseResumeDocument } from '../utils/resume-parser';
import { ParseResultDisplay, RecoveryGuide } from '../components/ErrorDisplay';
import ManualEntryForm from '../components/ManualEntryForm';
import type { ParseResult, ParsedResume, Experience, Skill, Education, Achievement } from '../types';

interface ErrorHandlingDemoState {
  parseResult: ParseResult<ParsedResume> | null;
  isLoading: boolean;
  showManualEntry: string | null;
  manualData: {
    experience: Experience[];
    skills: Skill[];
    education: Education[];
    achievements: Achievement[];
  };
}

export function ErrorHandlingDemo() {
  const [state, setState] = useState<ErrorHandlingDemoState>({
    parseResult: null,
    isLoading: false,
    showManualEntry: null,
    manualData: {
      experience: [],
      skills: [],
      education: [],
      achievements: [],
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setState(prev => ({ ...prev, isLoading: true, parseResult: null }));

    try {
      const result = await parseResumeDocument(file);
      setState(prev => ({ ...prev, parseResult: result, isLoading: false }));
    } catch (error) {
      console.error('Parsing error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleRetry = () => {
    setState(prev => ({ 
      ...prev, 
      parseResult: null,
      showManualEntry: null,
    }));
    // Reset file input
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleManualEntry = (section: string) => {
    setState(prev => ({ ...prev, showManualEntry: section }));
  };

  const handleManualSubmit = (section: string, data: any) => {
    setState(prev => ({
      ...prev,
      manualData: {
        ...prev.manualData,
        [section]: Array.isArray(data) ? data : [data],
      },
      showManualEntry: null,
    }));
  };

  const handleManualCancel = () => {
    setState(prev => ({ ...prev, showManualEntry: null }));
  };

  const getErrorTypes = () => {
    if (!state.parseResult) return [];
    return [
      ...state.parseResult.errors.map(e => e.type),
      ...state.parseResult.warnings.map(w => w.type),
    ];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Resume Parser Error Handling Demo
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Upload a resume to see comprehensive error handling and user feedback in action
        </p>
      </div>

      {/* File Upload Section */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="space-y-4">
          <div className="text-4xl">📄</div>
          <div>
            <label htmlFor="resume-upload" className="cursor-pointer">
              <span className="text-lg font-medium text-blue-600 hover:text-blue-500">
                Choose a resume file
              </span>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={state.isLoading}
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Supports PDF, Word (.docx), and plain text files
            </p>
          </div>
          {state.isLoading && (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-blue-600">Parsing resume...</span>
            </div>
          )}
        </div>
      </div>

      {/* Parse Results */}
      {state.parseResult && (
        <ParseResultDisplay
          result={state.parseResult}
          sectionResults={state.parseResult.data?.sectionResults || []}
          onRetry={handleRetry}
          onManualEntry={handleManualEntry}
        />
      )}

      {/* Recovery Guide */}
      {state.parseResult && getErrorTypes().length > 0 && (
        <RecoveryGuide errorTypes={getErrorTypes()} />
      )}

      {/* Manual Entry Form */}
      {state.showManualEntry && (
        <div className="bg-gray-50 rounded-lg p-6">
          <ManualEntryForm
            section={state.showManualEntry as any}
            onSubmit={(data) => handleManualSubmit(state.showManualEntry!, data)}
            onCancel={handleManualCancel}
          />
        </div>
      )}

      {/* Manual Data Summary */}
      {Object.values(state.manualData).some(arr => arr.length > 0) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">
            Manually Entered Data
          </h3>
          <div className="space-y-3">
            {state.manualData.experience.length > 0 && (
              <div>
                <span className="font-medium text-green-700">Experience:</span>
                <span className="ml-2 text-green-600">
                  {state.manualData.experience.length} entries
                </span>
              </div>
            )}
            {state.manualData.skills.length > 0 && (
              <div>
                <span className="font-medium text-green-700">Skills:</span>
                <span className="ml-2 text-green-600">
                  {state.manualData.skills.length} skills
                </span>
              </div>
            )}
            {state.manualData.education.length > 0 && (
              <div>
                <span className="font-medium text-green-700">Education:</span>
                <span className="ml-2 text-green-600">
                  {state.manualData.education.length} entries
                </span>
              </div>
            )}
            {state.manualData.achievements.length > 0 && (
              <div>
                <span className="font-medium text-green-700">Achievements:</span>
                <span className="ml-2 text-green-600">
                  {state.manualData.achievements.length} achievements
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Demo Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">
          Demo Instructions
        </h3>
        <div className="space-y-2 text-blue-700">
          <p>• Try uploading different file types to see format validation</p>
          <p>• Upload an empty file to see empty content handling</p>
          <p>• Upload a corrupted file to see error recovery suggestions</p>
          <p>• Upload a resume with missing sections to see parsing warnings</p>
          <p>• Use manual entry forms when parsing fails</p>
        </div>
      </div>

      {/* Error Scenarios for Testing */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">
          Test Error Scenarios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-yellow-700 mb-2">File Format Errors:</h4>
            <ul className="space-y-1 text-yellow-600">
              <li>• Upload .jpg or .png files</li>
              <li>• Upload password-protected PDFs</li>
              <li>• Upload very large files (&gt;10MB)</li>
              <li>• Upload empty files</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-yellow-700 mb-2">Content Errors:</h4>
            <ul className="space-y-1 text-yellow-600">
              <li>• Upload resumes without clear sections</li>
              <li>• Upload image-only PDFs</li>
              <li>• Upload resumes with unusual formatting</li>
              <li>• Upload minimal content files</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorHandlingDemo;