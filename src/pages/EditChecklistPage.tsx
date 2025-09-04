import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useChecklists, useChecklistSteps } from '../hooks/useChecklists';
import PaymentBanner from '../components/PaymentBanner';
import TrialBanner from '../components/TrialBanner';
import { CreateChecklistData } from '../types/checklist';
import { 
  ArrowLeft, 
  CheckCircle, 
  Plus, 
  Lock, 
  Globe, 
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  X
} from 'lucide-react';

interface StepData {
  id?: string;
  title: string;
  description: string;
  step_type: 'checkbox' | 'text' | 'textarea' | 'file_upload' | 'url' | 'email' | 'secure_text';
  options?: string;
  is_required: boolean;
  order_index: number;
}

const STEP_TYPE_OPTIONS = [
  { value: 'checkbox', label: 'Checkbox', description: 'Simple yes/no confirmation' },
  { value: 'text', label: 'Text Input', description: 'Short text response' },
  { value: 'textarea', label: 'Long Text', description: 'Detailed description' },
  { value: 'file_upload', label: 'File Upload', description: 'Document collection' },
  { value: 'url', label: 'Website URL', description: 'Link collection' },
  { value: 'email', label: 'Email Address', description: 'Email validation' },
  { value: 'secure_text', label: 'Secure Text', description: 'Sensitive information' }
];

export default function EditChecklistPage() {
  const navigate = useNavigate();
  const { checklistId } = useParams<{ checklistId: string }>();
  const { user } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const { checklists, updateChecklist } = useChecklists();
  const { steps: checklistSteps, createStep, updateStep, deleteStep, reorderSteps } = useChecklistSteps(checklistId || null);
  
  const [loading, setLoading] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateChecklistData>({
    title: '',
    description: '',
    is_public: true,
    password: '',
    completion_page_content: '',
  });

  const [steps, setSteps] = useState<StepData[]>([]);

  // Find the current checklist
  const checklist = checklists.find(c => c.id === checklistId);

  useEffect(() => {
    if (!checklistId) {
      navigate('/checklists');
      return;
    }

    if (checklist) {
      setFormData({
        title: checklist.title,
        description: checklist.description,
        is_public: checklist.is_public,
        password: checklist.password_hash || '',
        completion_page_content: checklist.completion_page_content,
      });
    }
  }, [checklist, checklistId, navigate]);

  useEffect(() => {
    if (checklistSteps.length > 0) {
      const stepsData: StepData[] = checklistSteps.map(step => ({
        id: step.id,
        title: step.title,
        description: step.description,
        step_type: step.step_type,
        options: step.options || undefined,
        is_required: step.is_required,
        order_index: step.order_index,
      }));
      setSteps(stepsData);
    }
  }, [checklistSteps]);

  const handleAddStep = async () => {
    const newStepData = {
      title: 'New Step',
      description: '',
      step_type: 'text' as const,
      is_required: true,
    };

    const createdStep = await createStep(newStepData);
    if (createdStep) {
      setEditingStepIndex(steps.length);
    }
  };

  const handleUpdateStep = async (index: number, updates: Partial<StepData>) => {
    const step = steps[index];
    const updatedSteps = steps.map((s, i) => 
      i === index ? { ...s, ...updates } : s
    );
    setSteps(updatedSteps);

    // If step has an ID, update in database
    if (step.id) {
      await updateStep(step.id, updates);
    }
  };

  const handleDeleteStep = async (index: number) => {
    const step = steps[index];
    
    if (step.id) {
      const success = await deleteStep(step.id);
      if (!success) {
        setError('Failed to delete step');
        return;
      }
    }
    
    setSteps(prev => prev.filter((_, i) => i !== index).map((step, i) => ({ ...step, order_index: i })));
    setEditingStepIndex(null);
  };

  const handleMoveStep = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    const newSteps = [...steps];
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    
    // Update order indices
    newSteps.forEach((step, i) => {
      step.order_index = i;
    });
    
    setSteps(newSteps);
    
    // Update editing index if needed
    if (editingStepIndex === index) {
      setEditingStepIndex(newIndex);
    } else if (editingStepIndex === newIndex) {
      setEditingStepIndex(index);
    }

    // Update in database
    const stepsWithIds = newSteps.filter(s => s.id).map(s => ({
      id: s.id!,
      title: s.title,
      description: s.description,
      step_type: s.step_type,
      options: s.options,
      is_required: s.is_required,
      order_index: s.order_index,
      checklist_id: checklistId!,
      created_at: '',
      updated_at: '',
    }));
    
    await reorderSteps(stepsWithIds);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError('Please enter a checklist title');
      return;
    }

    if (!checklistId) {
      setError('Checklist ID not found');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const success = await updateChecklist(checklistId, formData);
      if (success) {
        setSuccess('Checklist updated successfully!');
        setTimeout(() => {
          navigate('/checklists');
        }, 1500);
      } else {
        setError('Failed to update checklist');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepEditor = (step: StepData, index: number) => {
    const isEditing = editingStepIndex === index;
    
    if (!isEditing) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start flex-1">
              <span className="text-lg mr-3 mt-1">
                {step.step_type === 'textarea' ? '📝' : 
                 step.step_type === 'file_upload' ? '📎' : 
                 step.step_type === 'secure_text' ? '🔒' :
                 step.step_type === 'url' ? '🔗' :
                 step.step_type === 'email' ? '📧' :
                 step.step_type === 'text' ? '✏️' : '☑️'}
              </span>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h4 className="font-semibold text-gray-900 font-sans">{step.title || 'Untitled Step'}</h4>
                  {step.is_required && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-sans">{step.description || 'No description'}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium font-sans">
                  {STEP_TYPE_OPTIONS.find(opt => opt.value === step.step_type)?.label || step.step_type}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1 ml-4">
              <button
                onClick={() => handleMoveStep(index, 'up')}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMoveStep(index, 'down')}
                disabled={index === steps.length - 1}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingStepIndex(index)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteStep(index)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Step Title</label>
              <input
                type="text"
                value={step.title}
                onChange={(e) => handleUpdateStep(index, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                placeholder="Enter step title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Step Type</label>
              <select
                value={step.step_type}
                onChange={(e) => handleUpdateStep(index, { step_type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              >
                {STEP_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Description</label>
            <textarea
              value={step.description}
              onChange={(e) => handleUpdateStep(index, { description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              placeholder="Describe what the customer should do"
              rows={2}
            />
          </div>

          {step.step_type === 'file_upload' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Accepted File Types</label>
              <input
                type="text"
                value={step.options || ''}
                onChange={(e) => handleUpdateStep(index, { options: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                placeholder=".pdf,.jpg,.png,.doc"
              />
              <p className="text-xs text-gray-500 mt-1 font-sans">Comma-separated file extensions</p>
            </div>
          )}

          {step.step_type === 'secure_text' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Expiry Hours</label>
                <input
                  type="number"
                  value={step.options || '24'}
                  onChange={(e) => handleUpdateStep(index, { options: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  placeholder="24"
                  min="1"
                  max="168"
                />
                <p className="text-xs text-gray-500 mt-1 font-sans">Hours before secure data expires (1-168)</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h5 className="text-sm font-medium text-blue-900 mb-2 font-sans">🔒 Security Information</h5>
                <div className="text-xs text-blue-800 space-y-1 font-sans">
                  <p>• Data is encrypted using base64 encoding before storage</p>
                  <p>• Automatically expires after the specified time period</p>
                  <p>• Stored separately from regular step data for added security</p>
                  <p>• Use for passwords, API keys, or other sensitive information</p>
                  <p>• Consider shorter expiry times for highly sensitive data</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={step.is_required}
              onChange={(e) => handleUpdateStep(index, { is_required: e.target.checked })}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700 font-sans">Required step</label>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-blue-200">
            <button
              onClick={() => setEditingStepIndex(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors font-sans"
            >
              Cancel
            </button>
            <button
              onClick={() => setEditingStepIndex(null)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center font-sans"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Step
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!checklistId) {
    return null;
  }

  if (!checklist) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Loading checklist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial Banner */}
        <TrialBanner />
        
        {/* Payment Issue Banner */}
        <PaymentBanner />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-sans">Edit Checklist</h1>
            <p className="text-gray-600 font-sans">
              Modify your checklist settings and steps
            </p>
          </div>
          <button
            onClick={() => navigate('/checklists')}
            className="text-gray-600 hover:text-gray-800 font-medium font-sans"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm font-sans">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-emerald-600 text-sm font-sans">{success}</p>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Settings */}
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Basic Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                      Checklist Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                      placeholder="e.g., Website Design Project Onboarding"
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
                      Access Control
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
                          <Globe className="w-4 h-4 text-emerald-500 mr-2" />
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
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Completion Message</h3>
                <textarea
                  value={formData.completion_page_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, completion_page_content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                  placeholder="Message shown when customers complete the checklist"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1 font-sans">
                  This message will be displayed to customers when they complete all steps
                </p>
              </div>
            </div>

            {/* Steps Editor */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 font-sans">
                  Steps ({steps.length})
                </h3>
                <button
                  onClick={handleAddStep}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium flex items-center font-sans"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </button>
              </div>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {steps.map((step, index) => (
                  <div key={step.id || index}>
                    {renderStepEditor(step, index)}
                  </div>
                ))}
                
                {steps.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-sans">No steps added yet</p>
                    <button
                      onClick={handleAddStep}
                      className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium font-sans"
                    >
                      Add First Step
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <button
              onClick={() => navigate('/checklists')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center font-sans"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Checklists
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !formData.title.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center disabled:opacity-50 font-sans"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}