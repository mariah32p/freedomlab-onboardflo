import React, { useState, useEffect } from 'react';
import { X, Save, Plus, GripVertical, Trash2, Eye, Lock, Palette } from 'lucide-react';
import { useChecklistSteps } from '../../hooks/useChecklists';
import { Checklist, ChecklistStep, CreateChecklistData, CreateStepData } from '../../types/checklist';
import { StepType } from '../../types/checklist';
import { ChecklistTemplate } from '../../data/checklistTemplates';

interface ChecklistBuilderProps {
  checklist: Checklist | null;
  template?: ChecklistTemplate | null;
  onSave: (data: CreateChecklistData) => Promise<void>;
  onClose: () => void;
  isCreating: boolean;
}

const getStepTypeIcon = (stepType: StepType) => {
  switch (stepType) {
    case 'checkbox': return '☑️';
    case 'text': return '📝';
    case 'textarea': return '📄';
    case 'file_upload': return '📎';
    case 'url': return '🔗';
    case 'email': return '📧';
    default: return '☑️';
  }
};

const getStepTypeLabel = (stepType: StepType) => {
  switch (stepType) {
    case 'checkbox': return 'Checkbox';
    case 'text': return 'Text Input';
    case 'textarea': return 'Long Text';
    case 'file_upload': return 'File Upload';
    case 'url': return 'Website URL';
    case 'email': return 'Email';
    default: return 'Checkbox';
  }
};

export default function ChecklistBuilder({ checklist, template, onSave, onClose, isCreating }: ChecklistBuilderProps) {
  const { steps, createStep, updateStep, deleteStep, reorderSteps } = useChecklistSteps(checklist?.id || null);
  const [loading, setLoading] = useState(false);
  const [draggedStep, setDraggedStep] = useState<ChecklistStep | null>(null);
  const [templateStepsAdded, setTemplateStepsAdded] = useState(false);
  
  const [formData, setFormData] = useState<CreateChecklistData>({
    title: '',
    description: '',
    is_public: true,
    password: '',
    brand_color: '#10b981',
    logo_url: '',
    completion_page_content: 'Congratulations! You have successfully completed the onboarding process.',
  });

  const [newStep, setNewStep] = useState<CreateStepData>({
    title: '',
    description: '',
    step_type: 'checkbox',
    options: '',
    is_required: true,
  });

  const [showStepForm, setShowStepForm] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (checklist) {
      // Editing existing checklist
      setFormData({
        title: checklist.title,
        description: checklist.description,
        is_public: checklist.is_public,
        password: '', // Don't show existing password
        brand_color: checklist.brand_color,
        logo_url: checklist.logo_url || '',
        completion_page_content: checklist.completion_page_content,
      });
    } else if (template && !templateStepsAdded) {
      // Creating from template
      setFormData({
        title: template.name,
        description: template.description,
        is_public: true,
        password: '',
        brand_color: template.brandColor,
        logo_url: '',
        completion_page_content: template.completionMessage,
      });
    }
  }, [checklist, template, templateStepsAdded]);

  // Add template steps after checklist is created
  useEffect(() => {
    if (template && checklist && !templateStepsAdded && steps.length === 0) {
      const addTemplateSteps = async () => {
        for (const stepData of template.steps) {
          await createStep({
            title: stepData.title,
            description: stepData.description,
            step_type: stepData.step_type,
            options: stepData.options,
            is_required: stepData.isRequired, // Map isRequired to is_required
          });
        }
        setTemplateStepsAdded(true);
      };
      addTemplateSteps();
    }
  }, [template, checklist, templateStepsAdded, steps.length, createStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStep.title.trim()) return;

    const step = await createStep(newStep);
    if (step) {
      setNewStep({ title: '', description: '', step_type: 'checkbox', options: '', is_required: true });
      setShowStepForm(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, step: ChecklistStep) => {
    setDraggedStep(step);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStep: ChecklistStep) => {
    e.preventDefault();
    if (!draggedStep || draggedStep.id === targetStep.id) return;

    const newSteps = [...steps];
    const draggedIndex = newSteps.findIndex(s => s.id === draggedStep.id);
    const targetIndex = newSteps.findIndex(s => s.id === targetStep.id);

    // Remove dragged item and insert at new position
    newSteps.splice(draggedIndex, 1);
    newSteps.splice(targetIndex, 0, draggedStep);

    // Update order_index for all steps
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      order_index: index,
    }));

    reorderSteps(reorderedSteps);
    setDraggedStep(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 font-sans">
            {isCreating ? (template ? `Create from Template: ${template.name}` : 'Create New Checklist') : 'Edit Checklist'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Left Panel - Checklist Settings */}
          <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                  Checklist Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                  placeholder="e.g., SaaS Onboarding Checklist"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                  placeholder="Brief description of this onboarding flow"
                  rows={3}
                />
              </div>

              {/* Visibility Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 font-sans">
                  Visibility
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      checked={formData.is_public}
                      onChange={() => setFormData(prev => ({ ...prev, is_public: true, password: '' }))}
                      className="mr-3 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 text-emerald-500 mr-2" />
                      <span className="font-sans">Public - Anyone with the link can access</span>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      checked={!formData.is_public}
                      onChange={() => setFormData(prev => ({ ...prev, is_public: false }))}
                      className="mr-3 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="font-sans">Password Protected</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Password field (only show if password protected) */}
              {!formData.is_public && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                    placeholder="Enter password for this checklist"
                  />
                </div>
              )}


              {/* Completion Page */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                  Completion Message
                </label>
                <textarea
                  value={formData.completion_page_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, completion_page_content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                  placeholder="Message shown when customers complete the checklist"
                  rows={3}
                />
              </div>

              {/* Branding Note */}
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Palette className="h-5 w-5 text-blue-400 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800 font-sans">Branding Settings</h4>
                      <p className="text-sm text-blue-700 mt-1 font-sans">
                        Your checklists will use your global brand settings (logo, colors, fonts). 
                        <a href="/branding" className="underline hover:no-underline ml-1">
                          Update branding →
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 font-sans"
              >
                {loading ? 'Saving...' : (isCreating ? 'Create Checklist' : 'Save Changes')}
              </button>
            </form>
          </div>

          {/* Right Panel - Steps Management */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 font-sans">Checklist Steps</h3>
                {!isCreating && (
                  <button
                    onClick={() => setShowStepForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center text-sm font-sans"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Step
                  </button>
                )}
              </div>

              {isCreating ? (
                <div className="text-center py-8 text-gray-500 font-sans">
                  <p>Save the checklist first to add steps</p>
                </div>
              ) : (
                <>
                  {/* Add Step Form */}
                  {showStepForm && (
                    <form onSubmit={handleAddStep} className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div>
                        <input
                          type="text"
                          value={newStep.title}
                          onChange={(e) => setNewStep(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                          placeholder="Step title"
                          required
                        />
                      </div>
                      <div>
                        <textarea
                          value={newStep.description}
                          onChange={(e) => setNewStep(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                          placeholder="Step description (optional)"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                          Step Type
                        </label>
                        <select
                          value={newStep.step_type}
                          onChange={(e) => setNewStep(prev => ({ ...prev, step_type: e.target.value as StepType }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                        >
                          <option value="checkbox">Simple Checkbox</option>
                          <option value="text">Text Input</option>
                          <option value="textarea">Long Text</option>
                          <option value="file_upload">File Upload</option>
                          <option value="url">Website URL</option>
                          <option value="email">Email Address</option>
                        </select>
                      </div>
                      {(newStep.step_type === 'text' || newStep.step_type === 'textarea') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                            Placeholder Text (optional)
                          </label>
                          <input
                            type="text"
                            value={newStep.options || ''}
                            onChange={(e) => setNewStep(prev => ({ ...prev, options: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                            placeholder="Enter placeholder text..."
                          />
                        </div>
                      )}
                      {newStep.step_type === 'file_upload' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                            Accepted File Types (optional)
                          </label>
                          <input
                            type="text"
                            value={newStep.options || ''}
                            onChange={(e) => setNewStep(prev => ({ ...prev, options: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                            placeholder="e.g., .pdf,.doc,.jpg (leave blank for all types)"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newStep.is_required}
                            onChange={(e) => setNewStep(prev => ({ ...prev, is_required: e.target.checked }))}
                            className="mr-2 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-gray-700 font-sans">Required step</span>
                        </label>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowStepForm(false)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 font-sans"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1 rounded-lg font-medium transition-colors font-sans"
                          >
                            Add Step
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Steps List */}
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div
                        key={step.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, step)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, step)}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-move"
                      >
                        <div className="flex items-start">
                          <div className="flex items-center mr-3 mt-1">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500 ml-2 font-sans">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="text-sm mr-2">{getStepTypeIcon(step.step_type)}</span>
                                  <h4 className="font-medium text-gray-900 font-sans">{step.title}</h4>
                                </div>
                                {step.description && (
                                  <p className="text-sm text-gray-600 mt-1 font-sans">{step.description}</p>
                                )}
                                <div className="flex items-center mt-2">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium font-sans mr-2">
                                    {getStepTypeLabel(step.step_type)}
                                  </span>
                                  {step.is_required && (
                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                                      Required
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => deleteStep(step.id)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-2"
                                title="Delete step"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {steps.length === 0 && !showStepForm && (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg font-sans">
                        <p className="mb-4">No steps added yet</p>
                        <button
                          onClick={() => setShowStepForm(true)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors font-sans"
                        >
                          Add First Step
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600 font-sans">
            {isCreating ? 'Create your checklist to start adding steps' : `${steps.length} steps configured`}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors font-sans"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center font-sans"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : (isCreating ? 'Create Checklist' : 'Save Changes')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}