/**
 * Manual Entry Form Components
 * Provides fallback forms for manual data entry when parsing fails
 */

import React, { useState } from 'react';
import type { Experience, Skill, Education, Achievement } from '../types';
import { generateId } from '../utils';

interface ManualEntryFormProps {
  section: 'experience' | 'skills' | 'education' | 'achievements';
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  className?: string;
}

interface ExperienceFormData {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

interface SkillFormData {
  name: string;
  category: 'technical' | 'soft' | 'industry';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description?: string;
}

interface EducationFormData {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: number;
  achievements: string[];
}

interface AchievementFormData {
  title: string;
  description: string;
  date: string;
  category: 'award' | 'recognition' | 'milestone' | 'publication';
  organization?: string;
}

/**
 * Main manual entry form component
 */
export function ManualEntryForm({
  section,
  onSubmit,
  onCancel,
  initialData,
  className = '',
}: ManualEntryFormProps) {
  const renderForm = () => {
    switch (section) {
      case 'experience':
        return <ExperienceForm onSubmit={onSubmit} onCancel={onCancel} initialData={initialData} />;
      case 'skills':
        return <SkillsForm onSubmit={onSubmit} onCancel={onCancel} initialData={initialData} />;
      case 'education':
        return <EducationForm onSubmit={onSubmit} onCancel={onCancel} initialData={initialData} />;
      case 'achievements':
        return <AchievementsForm onSubmit={onSubmit} onCancel={onCancel} initialData={initialData} />;
      default:
        return <div>Unknown section: {section}</div>;
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          Add {section.replace('_', ' ')} Manually
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Fill out the form below to add this information to your profile.
        </p>
      </div>
      {renderForm()}
    </div>
  );
}

/**
 * Experience entry form
 */
function ExperienceForm({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (data: Experience) => void;
  onCancel: () => void;
  initialData?: Partial<ExperienceFormData>;
}) {
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: initialData?.company || '',
    position: initialData?.position || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    achievements: initialData?.achievements || [''],
    technologies: initialData?.technologies || [''],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const experience: Experience = {
      id: generateId(),
      company: formData.company,
      position: formData.position,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      location: formData.location,
      description: formData.description,
      achievements: formData.achievements.filter(a => a.trim()),
      technologies: formData.technologies.filter(t => t.trim()),
      metrics: [],
    };

    onSubmit(experience);
  };

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, ''],
    }));
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const addTechnology = () => {
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, ''],
    }));
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company *
          </label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position *
          </label>
          <input
            type="text"
            required
            value={formData.position}
            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Job title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty if current position</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="City, State or Remote"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description of your role and responsibilities"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Key Achievements
        </label>
        {formData.achievements.map((achievement, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={achievement}
              onChange={(e) => {
                const newAchievements = [...formData.achievements];
                newAchievements[index] = e.target.value;
                setFormData(prev => ({ ...prev, achievements: newAchievements }));
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe a key achievement"
            />
            {formData.achievements.length > 1 && (
              <button
                type="button"
                onClick={() => removeAchievement(index)}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addAchievement}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Achievement
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Technologies Used
        </label>
        {formData.technologies.map((tech, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={tech}
              onChange={(e) => {
                const newTechnologies = [...formData.technologies];
                newTechnologies[index] = e.target.value;
                setFormData(prev => ({ ...prev, technologies: newTechnologies }));
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Technology, tool, or programming language"
            />
            {formData.technologies.length > 1 && (
              <button
                type="button"
                onClick={() => removeTechnology(index)}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addTechnology}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Technology
        </button>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Experience
        </button>
      </div>
    </form>
  );
}

/**
 * Skills entry form
 */
function SkillsForm({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (data: Skill[]) => void;
  onCancel: () => void;
  initialData?: Partial<SkillFormData>[];
}) {
  const [skills, setSkills] = useState<SkillFormData[]>([
    {
      name: '',
      category: 'technical',
      level: 'intermediate',
      description: '',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const skillsData: Skill[] = skills
      .filter(skill => skill.name.trim())
      .map(skill => ({
        id: generateId(),
        name: skill.name,
        category: skill.category,
        level: skill.level,
        description: skill.description,
      }));

    onSubmit(skillsData);
  };

  const addSkill = () => {
    setSkills(prev => [...prev, {
      name: '',
      category: 'technical',
      level: 'intermediate',
      description: '',
    }]);
  };

  const removeSkill = (index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, field: keyof SkillFormData, value: string) => {
    setSkills(prev => {
      const newSkills = [...prev];
      newSkills[index] = { ...newSkills[index], [field]: value };
      return newSkills;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900">Skill {index + 1}</h4>
              {skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={skill.name}
                  onChange={(e) => updateSkill(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., JavaScript, Leadership"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={skill.category}
                  onChange={(e) => updateSkill(index, 'category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="technical">Technical</option>
                  <option value="soft">Soft Skill</option>
                  <option value="industry">Industry Knowledge</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  value={skill.level}
                  onChange={(e) => updateSkill(index, 'level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={skill.description}
                onChange={(e) => updateSkill(index, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description or context"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSkill}
        className="text-blue-600 hover:text-blue-800 text-sm"
      >
        + Add Another Skill
      </button>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Skills
        </button>
      </div>
    </form>
  );
}

/**
 * Education entry form
 */
function EducationForm({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (data: Education) => void;
  onCancel: () => void;
  initialData?: Partial<EducationFormData>;
}) {
  const [formData, setFormData] = useState<EducationFormData>({
    institution: initialData?.institution || '',
    degree: initialData?.degree || '',
    field: initialData?.field || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    gpa: initialData?.gpa,
    achievements: initialData?.achievements || [''],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const education: Education = {
      id: generateId(),
      institution: formData.institution,
      degree: formData.degree,
      field: formData.field,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      gpa: formData.gpa,
      achievements: formData.achievements.filter(a => a.trim()),
    };

    onSubmit(education);
  };

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, ''],
    }));
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution *
          </label>
          <input
            type="text"
            required
            value={formData.institution}
            onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="University or school name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree *
          </label>
          <input
            type="text"
            required
            value={formData.degree}
            onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Bachelor of Science, Master of Arts"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field of Study *
          </label>
          <input
            type="text"
            required
            value={formData.field}
            onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Computer Science, Business Administration"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GPA (Optional)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={formData.gpa || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value ? parseFloat(e.target.value) : undefined }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="3.75"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty if currently enrolled</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Academic Achievements (Optional)
        </label>
        {formData.achievements.map((achievement, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={achievement}
              onChange={(e) => {
                const newAchievements = [...formData.achievements];
                newAchievements[index] = e.target.value;
                setFormData(prev => ({ ...prev, achievements: newAchievements }));
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Dean's List, Magna Cum Laude, Relevant Coursework"
            />
            {formData.achievements.length > 1 && (
              <button
                type="button"
                onClick={() => removeAchievement(index)}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addAchievement}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Achievement
        </button>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Education
        </button>
      </div>
    </form>
  );
}

/**
 * Achievements entry form
 */
function AchievementsForm({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (data: Achievement) => void;
  onCancel: () => void;
  initialData?: Partial<AchievementFormData>;
}) {
  const [formData, setFormData] = useState<AchievementFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    date: initialData?.date || '',
    category: initialData?.category || 'recognition',
    organization: initialData?.organization || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const achievement: Achievement = {
      id: generateId(),
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date),
      category: formData.category,
      organization: formData.organization,
    };

    onSubmit(achievement);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Achievement Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Employee of the Year, Best Innovation Award"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as AchievementFormData['category'] }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="award">Award</option>
            <option value="recognition">Recognition</option>
            <option value="milestone">Milestone</option>
            <option value="publication">Publication</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Organization (Optional)
        </label>
        <input
          type="text"
          value={formData.organization}
          onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Organization or company that gave the award"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the achievement and its significance"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Achievement
        </button>
      </div>
    </form>
  );
}

export default ManualEntryForm;