import React, { useState } from 'react';
import { X, Search, Sparkles } from 'lucide-react';
import { checklistTemplates, getTemplatesByCategory, ChecklistTemplate } from '../../data/checklistTemplates';

interface TemplateSelectorProps {
  onSelectTemplate: (template: ChecklistTemplate) => void;
  onClose: () => void;
  onCreateBlank: () => void;
}

export default function TemplateSelector({ onSelectTemplate, onClose, onCreateBlank }: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const templatesByCategory = getTemplatesByCategory();
  const categories = ['All', ...Object.keys(templatesByCategory)];
  
  const filteredTemplates = checklistTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-sans">Choose a Template</h2>
            <p className="text-gray-600 font-sans">Start with a proven template or create from scratch</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                placeholder="Search templates..."
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Blank Option */}
            <div 
              onClick={onCreateBlank}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer group"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Sparkles className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">Start from Scratch</h3>
                <p className="text-gray-600 text-sm font-sans">
                  Create a completely custom checklist tailored to your specific needs
                </p>
              </div>
            </div>

            {/* Template Options */}
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Template header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4"
                      style={{ backgroundColor: `${template.brandColor}20` }}
                    >
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 font-sans">{template.name}</h3>
                      <span 
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: template.brandColor }}
                      >
                        {template.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 font-sans">{template.description}</p>

                {/* Steps preview */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700 mb-2 font-sans">
                    {template.steps.length} steps included:
                  </div>
                  {template.steps.slice(0, 3).map((step, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                      <span className="font-sans">{step.title}</span>
                      {step.isRequired && (
                        <span className="ml-2 px-1 py-0.5 bg-red-100 text-red-600 rounded text-xs font-sans">Required</span>
                      )}
                    </div>
                  ))}
                  {template.steps.length > 3 && (
                    <div className="text-xs text-gray-500 font-sans">
                      +{template.steps.length - 3} more steps
                    </div>
                  )}
                </div>

                {/* Use template button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="w-full bg-gray-100 group-hover:bg-emerald-100 text-gray-700 group-hover:text-emerald-700 py-2 rounded-lg font-medium transition-colors font-sans">
                    Use This Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">No templates found</h3>
              <p className="text-gray-600 font-sans">
                Try adjusting your search or create a custom checklist from scratch
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600 font-sans">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors font-sans"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}