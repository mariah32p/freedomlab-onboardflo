import React, { useState } from 'react';
import { Plus, Edit, Trash2, Sparkles, ExternalLink, Copy, Check } from 'lucide-react';
import { useChecklists } from '../../hooks/useChecklists';
import { useChecklistSteps } from '../../hooks/useChecklists';
import { useSubscription } from '../../hooks/useSubscription';
import { Checklist } from '../../types/checklist';
import TemplateSelector from './TemplateSelector';
import { ChecklistTemplate } from '../../data/checklistTemplates';

interface ChecklistListProps {
  onEditChecklist: (checklist: Checklist) => void;
  onCreateNew: (template?: ChecklistTemplate) => void;
}

function ChecklistCard({ checklist, onEdit, onDelete, onPreview, onCopyLink, copiedId, deletingId }: {
  checklist: Checklist;
  onEdit: (checklist: Checklist) => void;
  onDelete: (id: string) => void;
  onPreview: (checklist: Checklist) => void;
  onCopyLink: (checklist: Checklist) => void;
  copiedId: string | null;
  deletingId: string | null;
}) {
  const { steps, loading: stepsLoading } = useChecklistSteps(checklist.id);
  const stepCount = steps.length;
  const needsSetup = stepCount === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header with brand color */}
      <div 
        className="h-2 rounded-t-xl"
        style={{ backgroundColor: checklist.brand_color }}
      ></div>
      
      <div className="p-6">
        {/* Title and description */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 font-sans line-clamp-2 flex-1">
              {checklist.title}
            </h3>
            {needsSetup && (
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium font-sans whitespace-nowrap">
                Needs Setup
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm font-sans line-clamp-3">
            {checklist.description}
          </p>
        </div>

        {/* Step count and stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 font-sans">
              {stepsLoading ? '...' : stepCount}
            </div>
            <div className="text-xs text-gray-600 font-sans">
              {stepCount === 1 ? 'Step' : 'Steps'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 font-sans">0</div>
            <div className="text-xs text-gray-600 font-sans">Customers</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPreview(checklist)}
              disabled={needsSetup}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={needsSetup ? "Add steps before previewing" : "Preview checklist"}
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => onCopyLink(checklist)}
              disabled={needsSetup}
              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={needsSetup ? "Add steps before sharing" : "Copy share link"}
            >
              {copiedId === checklist.id ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => onEdit(checklist)}
              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Edit checklist"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(checklist.id)}
              disabled={deletingId === checklist.id}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete checklist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-xs text-gray-500 font-sans">
            {new Date(checklist.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChecklistList({ onEditChecklist, onCreateNew }: ChecklistListProps) {
  const { checklists, loading, error, deleteChecklist } = useChecklists();
  const { getAccessStatus } = useSubscription();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const accessStatus = getAccessStatus();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this checklist? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    const success = await deleteChecklist(id);
    if (!success) {
      // Error is handled by the hook
    }
    setDeletingId(null);
  };

  const handleCreateFromTemplate = () => {
    setShowTemplateSelector(true);
  };

  const handleSelectTemplate = (template: ChecklistTemplate) => {
    setShowTemplateSelector(false);
    onCreateNew(template);
  };

  const handleCreateBlank = () => {
    setShowTemplateSelector(false);
    onCreateNew();
  };

  const getChecklistUrl = (checklist: Checklist) => {
    // Generate a new session token for sharing
    const sessionToken = Math.random().toString(36).substring(2, 10);
    return `${window.location.origin}/c/${checklist.id}/${sessionToken}`;
  };

  const handleCopyLink = async (checklist: Checklist) => {
    const url = getChecklistUrl(checklist);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(checklist.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handlePreview = (checklist: Checklist) => {
    const url = getChecklistUrl(checklist);
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm font-sans">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreateFromTemplate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center font-sans"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Use Template
          </button>
          <button
            onClick={() => onCreateNew()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center font-sans"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Custom
          </button>
        </div>
      </div>

      {/* Checklists Grid */}
      {checklists.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sans">No checklists yet</h3>
          <p className="text-gray-600 mb-6 font-sans">
            Create your first onboarding checklist to get started
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleCreateFromTemplate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center font-sans"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Use Template
            </button>
            <button
              onClick={() => onCreateNew()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center font-sans"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Custom
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checklists.map((checklist) => (
            <ChecklistCard
              key={checklist.id}
              checklist={checklist}
              onEdit={onEditChecklist}
              onDelete={handleDelete}
              onPreview={handlePreview}
              onCopyLink={handleCopyLink}
              copiedId={copiedId}
              deletingId={deletingId}
            />
          ))}
        </div>
      )}

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplateSelector(false)}
          onCreateBlank={handleCreateBlank}
        />
      )}
    </div>
  );
}