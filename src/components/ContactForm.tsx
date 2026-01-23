'use client';

import React, { useState } from 'react';
import { ContactFormData } from '@/types';

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  className = '',
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default submission - simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Form submitted:', formData);
      }
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName: keyof ContactFormData) => `
    w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
    ${errors[fieldName] 
      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
    }
    text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
  `;

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={inputClasses('name')}
            placeholder="Your full name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={inputClasses('email')}
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Company Field */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company (Optional)
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className={inputClasses('company')}
            placeholder="Your company name"
            disabled={isSubmitting}
          />
        </div>

        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={inputClasses('subject')}
            placeholder="What would you like to discuss?"
            disabled={isSubmitting}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleInputChange}
            className={inputClasses('message')}
            placeholder="Tell me about your project, goals, or how I can help..."
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }
              text-white shadow-lg hover:shadow-xl
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending Message...
              </span>
            ) : (
              'Send Message'
            )}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <p className="text-green-800 dark:text-green-200 font-medium">
                Message sent successfully!
              </p>
            </div>
            <p className="text-green-700 dark:text-green-300 text-sm mt-1">
              Thank you for reaching out. I'll get back to you within 24 hours.
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-red-600 dark:text-red-400">✗</span>
              <p className="text-red-800 dark:text-red-200 font-medium">
                Failed to send message
              </p>
            </div>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">
              Please try again or contact me directly at john.fang0626@icloud.com
            </p>
          </div>
        )}
      </form>

      {/* Contact Information */}
      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Other Ways to Reach Me
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-blue-600 dark:text-blue-400">📧</span>
            <a 
              href="mailto:john.fang0626@icloud.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              john.fang0626@icloud.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-blue-600 dark:text-blue-400">📱</span>
            <a 
              href="tel:701-936-1040"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              (701) 936-1040
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-blue-600 dark:text-blue-400">💼</span>
            <a 
              href="https://www.linkedin.com/in/zheng-fang-johon/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              LinkedIn Profile
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-blue-600 dark:text-blue-400">📍</span>
            <span className="text-gray-700 dark:text-gray-300">
              Waltham, MA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;