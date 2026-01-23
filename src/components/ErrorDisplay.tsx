/**
 * Error Display Components
 * Provides user-friendly error messages and recovery suggestions
 */

import React from 'react';
import type { ParseError, ParseResult, SectionParseResult } from '../types';
import { formatErrorMessage, formatWarningMessage, createParsingSummary, ERROR_RECOVERY_GUIDE } from '../utils/error-handling';

interface ErrorDisplayProps {
  errors: ParseError[];
  className?: string;
}

interface WarningDisplayProps {
  warnings: ParseError[];
  className?: string;
}

interface ParseResultDisplayProps {
  result: ParseResult<any>;
  sectionResults?: SectionParseResult[];
  onRetry?: () => void;
  onManualEntry?: (section: string) => void;
  className?: string;
}

interface SectionErrorsProps {
  sectionResults: SectionParseResult[];
  onManualEntry?: (section: string) => void;
  className?: string;
}

interface RecoveryGuideProps {
  errorTypes: ParseError['type'][];
  className?: string;
}

/**
 * Displays individual error messages with icons and styling
 */
export function ErrorDisplay({ errors, className = '' }: ErrorDisplayProps) {
  if (errors.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {errors.map((error, index) => (
        <div
          key={index}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-red-500 text-lg">❌</span>
            </div>
            <div className="flex-1">
              <h4 className="text-red-800 font-medium">
                {formatErrorMessage(error)}
              </h4>
              {error.suggestions.length > 0 && (
                <div className="mt-2">
                  <p className="text-red-700 text-sm font-medium mb-1">
                    Suggestions to fix this issue:
                  </p>
                  <ul className="text-red-600 text-sm space-y-1">
                    {error.suggestions.map((suggestion, suggestionIndex) => (
                      <li key={suggestionIndex} className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {error.section && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Section: {error.section}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Displays warning messages with appropriate styling
 */
export function WarningDisplay({ warnings, className = '' }: WarningDisplayProps) {
  if (warnings.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {warnings.map((warning, index) => (
        <div
          key={index}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-yellow-500 text-lg">⚠️</span>
            </div>
            <div className="flex-1">
              <h4 className="text-yellow-800 font-medium">
                {formatWarningMessage(warning)}
              </h4>
              {warning.suggestions.length > 0 && (
                <div className="mt-2">
                  <p className="text-yellow-700 text-sm font-medium mb-1">
                    Suggestions to improve:
                  </p>
                  <ul className="text-yellow-600 text-sm space-y-1">
                    {warning.suggestions.map((suggestion, suggestionIndex) => (
                      <li key={suggestionIndex} className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {warning.section && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Section: {warning.section}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Comprehensive display for parse results with summary and actions
 */
export function ParseResultDisplay({
  result,
  sectionResults = [],
  onRetry,
  onManualEntry,
  className = '',
}: ParseResultDisplayProps) {
  const summary = createParsingSummary(sectionResults, result.errors, result.warnings);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Status */}
      <div className={`rounded-lg p-4 ${
        summary.overallSuccess 
          ? 'bg-green-50 border border-green-200' 
          : summary.totalErrors > 0
          ? 'bg-red-50 border border-red-200'
          : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">
            {summary.overallSuccess ? '✅' : summary.totalErrors > 0 ? '❌' : '⚠️'}
          </span>
          <div>
            <h3 className={`font-semibold ${
              summary.overallSuccess 
                ? 'text-green-800' 
                : summary.totalErrors > 0
                ? 'text-red-800'
                : 'text-yellow-800'
            }`}>
              {summary.overallSuccess 
                ? 'Resume Parsed Successfully!' 
                : summary.totalErrors > 0
                ? 'Resume Parsing Failed'
                : 'Resume Parsed with Warnings'
              }
            </h3>
            <p className={`text-sm ${
              summary.overallSuccess 
                ? 'text-green-600' 
                : summary.totalErrors > 0
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}>
              {summary.totalErrors} errors, {summary.totalWarnings} warnings
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Successful Sections:</p>
            <p className="text-sm text-gray-600">
              {summary.successfulSections.length > 0 
                ? summary.successfulSections.join(', ')
                : 'None'
              }
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Failed Sections:</p>
            <p className="text-sm text-gray-600">
              {summary.failedSections.length > 0 
                ? summary.failedSections.join(', ')
                : 'None'
              }
            </p>
          </div>
        </div>

        {/* Recommendations */}
        {summary.recommendations.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {summary.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        )}
        {onManualEntry && summary.failedSections.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {summary.failedSections.map((section) => (
              <button
                key={section}
                onClick={() => onManualEntry(section)}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
              >
                Enter {section} manually
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Errors */}
      {result.errors.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">Errors</h4>
          <ErrorDisplay errors={result.errors} />
        </div>
      )}

      {/* Detailed Warnings */}
      {result.warnings.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">Warnings</h4>
          <WarningDisplay warnings={result.warnings} />
        </div>
      )}

      {/* Section-specific errors */}
      {sectionResults.length > 0 && (
        <SectionErrorsDisplay 
          sectionResults={sectionResults} 
          onManualEntry={onManualEntry}
        />
      )}
    </div>
  );
}

/**
 * Displays section-specific parsing results and errors
 */
export function SectionErrorsDisplay({ 
  sectionResults, 
  onManualEntry,
  className = '' 
}: SectionErrorsProps) {
  const sectionsWithIssues = sectionResults.filter(
    result => result.errors.length > 0 || result.warnings.length > 0
  );

  if (sectionsWithIssues.length === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-lg font-medium text-gray-900">Section Details</h4>
      
      {sectionsWithIssues.map((sectionResult) => (
        <div key={sectionResult.section} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-900 capitalize">
              {sectionResult.section.replace('_', ' ')}
            </h5>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Confidence: {Math.round(sectionResult.confidence * 100)}%
              </span>
              {onManualEntry && !sectionResult.success && (
                <button
                  onClick={() => onManualEntry(sectionResult.section)}
                  className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Manual Entry
                </button>
              )}
            </div>
          </div>

          {sectionResult.errors.length > 0 && (
            <div className="mb-3">
              <ErrorDisplay errors={sectionResult.errors} />
            </div>
          )}

          {sectionResult.warnings.length > 0 && (
            <WarningDisplay warnings={sectionResult.warnings} />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Displays recovery guide based on error types
 */
export function RecoveryGuide({ errorTypes, className = '' }: RecoveryGuideProps) {
  const uniqueErrorTypes = Array.from(new Set(errorTypes));
  
  // Determine which guides to show
  const showFileFormatGuide = uniqueErrorTypes.some(type => 
    ['file_format', 'file_corrupted', 'unsupported_format', 'file_too_large'].includes(type)
  );
  
  const showContentGuide = uniqueErrorTypes.some(type => 
    ['section_missing', 'file_empty'].includes(type)
  );
  
  const showParsingGuide = uniqueErrorTypes.includes('parsing_failed');

  if (!showFileFormatGuide && !showContentGuide && !showParsingGuide) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">Recovery Guide</h3>
      
      {showFileFormatGuide && (
        <GuideSection guide={ERROR_RECOVERY_GUIDE.fileFormat} />
      )}
      
      {showContentGuide && (
        <GuideSection guide={ERROR_RECOVERY_GUIDE.missingContent} />
      )}
      
      {showParsingGuide && (
        <GuideSection guide={ERROR_RECOVERY_GUIDE.parsingErrors} />
      )}
      
      <GuideSection guide={ERROR_RECOVERY_GUIDE.manualEntry} />
    </div>
  );
}

/**
 * Individual guide section component
 */
function GuideSection({ guide }: { guide: typeof ERROR_RECOVERY_GUIDE[keyof typeof ERROR_RECOVERY_GUIDE] }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-medium text-blue-900 mb-2">{guide.title}</h4>
      <p className="text-blue-800 text-sm mb-3">{guide.description}</p>
      <ol className="text-blue-700 text-sm space-y-1">
        {guide.steps.map((step, index) => (
          <li key={index} className="flex items-start">
            <span className="font-medium text-blue-600 mr-2">{index + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default {
  ErrorDisplay,
  WarningDisplay,
  ParseResultDisplay,
  SectionErrorsDisplay,
  RecoveryGuide,
};