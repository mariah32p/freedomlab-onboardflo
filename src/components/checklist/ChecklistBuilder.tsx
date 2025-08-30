import React, { useState, useEffect } from 'react';
import { X, Save, Plus, GripVertical, Trash2, Eye, Lock, Palette, ArrowUp, ArrowDown } from 'lucide-react';
import { Checklist, CreateChecklistData, StepType } from '../../types/checklist';
import { ChecklistTemplate } from '../../data/checklistTemplates';

interface ChecklistBuilderProps {
  checklist: Checklist | null;
  template?: ChecklistTemplate | null;
  onSave: (data: CreateChecklistData & { steps: StepData[] }) => Promise<void>;
  onClose: () => void;
  isCreating: boolean;
}

interface StepData {
  title: string;
  description: string;
  step_type: StepType;
  options?: string;
  is_required: boolean;
  order_index: number;
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
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'steps'>('settings');
  
  const [formData, setFormData] = useState<CreateChecklistData>({
    title: '',
    description: '',
    is_public: true,
    password: '',
    completion_page_content: 'Congratulations! You have successfully completed the onboarding process.',
  });

  const [steps, setSteps] = useState<StepData[]>([]);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [showStepForm, setShowStepForm] = useState(false);

  const [newStep, setNewStep] = useState<StepData>({
    title: '',
    description: '',
    step_type: 'checkbox',
    options: '',
    is_required: true,
    order_index: 0,
  });

  // Initialize form data
  useEffect(() => {
    if (checklist) {
      // Editing existing checklist
      setFormData({
        title: checklist.title,
        description: checklist.description,
        is_public: checklist.is_public,
        password: '', // Don't show existing password
        completion_page_content: checklist.completion_page_content,
      });
      // TODO: Load existing steps when editing
    } else if (template) {
      // Creating from template
      setFormData({
        title: template.name,
        description: template.description,
        is_public: true,
        password: '',
        completion_page_content: template.completionMessage,
      });
      
      // Add template steps
      const templateSteps: StepData[] = template.steps.map((step, index) => ({
        title: step.title,
        description: step.description,
        step_type: step.step_type,
        options: step.options || '',
        is_required: step.isRequired,
        order_index: index,
      }));
      
      setSteps(templateSteps);
      setActiveTab('steps'); // Start on steps tab for templates
    }
  }, [checklist, template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ ...formData, steps });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = () => {
    const stepToAdd = {
      ...newStep,
      order_index: steps.length,
    };
    
    setSteps(prev => [...prev, stepToAdd]);
    setNewStep({
      title: '',
      description: '',
      step_type: 'checkbox',
      options: '',
      is_required: true,
      order_index: 0,
    });
    setShowStepForm(false);
  };

  const handleEditStep = (index: number) => {
    setEditingStepIndex(index);
    setNewStep(steps[index]);
    setShowStepForm(true);
  };

  const handleUpdateStep = () => {
    if (editingStepIndex === null) return;
    
    const updatedSteps = [...steps];
    updatedSteps[editingStepIndex] = {
      ...newStep,
      order_index: editingStepIndex,
    };
    
    setSteps(updatedSteps);
    setEditingStepIndex(null);
    setNewStep({
      title: '',
      description: '',
      step_type: 'checkbox',
      options: '',
      is_required: true,
      order_index: 0,
    });
    setShowStepForm(false);
  };

  const handleDeleteStep = (index: number) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    // Update order indices
    const reorderedSteps = updatedSteps.map((step, i) => ({
      ...step,
      order_index: i,
    }));
    setSteps(reorderedSteps);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    const updatedSteps = [...steps];
    [updatedSteps[index], updatedSteps[newIndex]] = [updatedSteps[newIndex], updatedSteps[index]];
    
    // Update order indices
    const reorderedSteps = updatedSteps.map((step, i) => ({
      ...step,
      order_index: i,
    }));
    
    setSteps(reorderedSteps);
  };

  const renderStepForm = () => (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 font-sans">
          {editingStepIndex !== null ? 'Edit Step' : 'Add New Step'}
        </h4>
        <button
          onClick={() => {
            setShowStepForm(false);
            setEditingStepIndex(null);
            setNewStep({
              title: '',
              description: '',
              step_type: 'checkbox',
              options: '',
              is_required: true,
              order_index: 0,
            });
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">
          Step Title
        </label>
        <input
          type="text"
          value={newStep.title}
          onChange={(e) => setNewStep(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
          placeholder="e.g., Complete your profile"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">
          Description (optional)
        </label>
        <textarea
          value={newStep.description}
          onChange={(e) => setNewStep(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
          placeholder="Additional instructions or details"
          rows={2}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">
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
          <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">
            Placeholder Text
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
          <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">
            Accepted File Types
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
        <button
          type="button"
          onClick={editingStepIndex !== null ? handleUpdateStep : handleAddStep}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors font-sans"
        >
          {editingStepIndex !== null ? 'Update Step' : 'Add Step'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
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

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-medium text-sm transition-colors font-sans ${
                activeTab === 'settings'
                  ? 'border-b-2 border-emerald-500 text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('steps')}
              className={`px-6 py-3 font-medium text-sm transition-colors font-sans ${
                activeTab === 'steps'
                  ? 'border-b-2 border-emerald-500 text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Steps ({steps.length})
            </button>
          </nav>
        </div>

        <div className="h-[calc(90vh-200px)] overflow-y-auto">
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Basic Settings */}
                <div className="space-y-6">
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
                </div>

                {/* Right Column - Completion Message */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                      Completion Message
                    </label>
                    <textarea
                      value={formData.completion_page_content}
                      onChange={(e) => setFormData(prev => ({ ...prev, completion_page_content: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                      placeholder="Message shown when customers complete the checklist"
                      rows={6}
                    />
                  </div>

                  {/* Branding Note */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Palette className="h-5 w-5 text-blue-400 mt-0.5" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800 font-sans">Branding Settings</h4>
                        <p className="text-sm text-blue-700 mt-1 font-sans">
                          Your checklists will use your global brand settings (logo, colors, fonts). 
                          <a href="/branding" target="_blank" className="underline hover:no-underline ml-1">
                            Update branding →
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Steps Tab */}
          {activeTab === 'steps' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 font-sans">Checklist Steps</h3>
                <button
                  onClick={() => setShowStepForm(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center font-sans"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </button>
              </div>

              {/* Add/Edit Step Form */}
              {showStepForm && renderStepForm()}

              {/* Steps List */}
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start">
                      <div className="flex items-center mr-3 mt-1">
                        <span className="text-sm text-gray-500 mr-2 font-sans">{index + 1}</span>
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
                          <div className="flex items-center space-x-1 ml-4">
                            <button
                              onClick={() => moveStep(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveStep(index, 'down')}
                              disabled={index === steps.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditStep(index)}
                              className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                              title="Edit step"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStep(index)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete step"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {steps.length === 0 && !showStepForm && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">No steps added yet</h3>
                    <p className="text-gray-600 mb-6 font-sans">
                      Add steps to create your onboarding checklist
                    </p>
                    <button
                      onClick={() => setShowStepForm(true)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors font-sans"
                    >
                      Add First Step
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600 font-sans">
            {steps.length} step{steps.length !== 1 ? 's' : ''} configured
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
              disabled={loading || !formData.title.trim()}
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