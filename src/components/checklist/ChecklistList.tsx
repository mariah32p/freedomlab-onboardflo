import React, { useState } from 'react';
import { Plus, Edit, Trash2, Sparkles, ExternalLink, Copy, Check, X, Users, Link as LinkIcon, Info } from 'lucide-react';
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

interface ShareLinkModalProps {
  checklist: Checklist;
  onClose: () => void;
}

function ShareLinkModal({ checklist, onClose }: ShareLinkModalProps) {
  const [linkName, setLinkName] = useState('');
  const [copied, setCopied] = useState(false);

  const getChecklistUrl = () => {
    const sessionToken = Math.random().toString(36).substring(2, 10);
    return `${window.location.origin}/c/${checklist.id}/${sessionToken}`;
  };

  const handleCopyLink = async () => {
    const url = getChecklistUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // TODO: Save link name and session token for tracking
      if (linkName.trim()) {
        console.log('Link created:', { name: linkName, url, checklistId: checklist.id });
      }
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-sans">Share Checklist</h3>
              <p className="text-sm text-gray-600 font-sans">{checklist.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* How it works */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2 font-sans">How Customer Links Work</h4>
                <ul className="text-sm text-blue-800 space-y-1 font-sans">
                  <li>• Each link creates a unique session for one customer</li>
                  <li>• Multiple customers can work simultaneously</li>
                  <li>• Progress is saved automatically and persists</li>
                  <li>• You can see real-time activity from your dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Link Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 font-sans">
              Link Name (Optional)
            </label>
            <input
              type="text"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
              placeholder="e.g., Sarah from TechCorp, Q1 Onboarding Batch"
            />
            <p className="text-xs text-gray-600 mt-1 font-sans">
              Add a name to help you track this link in your submissions dashboard
            </p>
          </div>

          {/* Link generation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 font-sans">
              Customer Link
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm font-sans">Unique Session Link</div>
                  <div className="text-xs text-gray-600 font-sans">Each click generates a new customer session</div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 font-mono text-sm text-gray-600 break-all">
                    {getChecklistUrl()}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center font-sans"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2 font-sans">Sharing Instructions</h4>
            <ol className="text-sm text-gray-700 space-y-1 font-sans">
              <li>1. Add an optional name to help you track this link</li>
              <li>2. Click "Copy Link" to get a unique customer link</li>
              <li>3. Send this link to your customer via email or message</li>
              <li>4. Each customer gets their own progress tracking</li>
              <li>5. Monitor all progress from your Submissions page</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors font-sans"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ChecklistCard({ checklist, onEdit, onDelete, onPreview, onShare, deletingId }: {
  checklist: Checklist;
  onEdit: (checklist: Checklist) => void;
  onDelete: (id: string) => void;
  onPreview: (checklist: Checklist) => void;
  onShare: (checklist: Checklist) => void;
  deletingId: string | null;
}) {
  const { steps, loading: stepsLoading } = useChecklistSteps(checklist.id);
  const stepCount = steps.length;
  const needsSetup = stepCount === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Header with brand color */}
      <div 
        className="h-2 rounded-t-xl"
        style={{ backgroundColor: checklist.brand_color }}
      ></div>
      
      <div className="p-6">
        {/* Title and description */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900 font-sans line-clamp-2 flex-1">
              {checklist.title}
            </h3>
            {needsSetup && (
              <span className="ml-3 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium font-sans whitespace-nowrap">
                Setup Required
              </span>
            )}
          </div>
          <p className="text-gray-600 font-sans line-clamp-2 leading-relaxed">
            {checklist.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900 font-sans">
              {stepsLoading ? '...' : stepCount}
            </div>
            <div className="text-xs text-gray-600 font-sans">
              {stepCount === 1 ? 'Step' : 'Steps'}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900 font-sans">0</div>
            <div className="text-xs text-gray-600 font-sans">Sessions</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900 font-sans">0%</div>
            <div className="text-xs text-gray-600 font-sans">Completed</div>
          </div>
        </div>

        {/* Primary Action */}
        <button
          onClick={() => onShare(checklist)}
          disabled={needsSetup}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4 font-sans"
        >
          {needsSetup ? 'Add Steps to Share' : 'Create Customer Link'}
        </button>

        {/* Secondary Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPreview(checklist)}
              disabled={needsSetup}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={needsSetup ? "Add steps before previewing" : "Preview checklist"}
            >
              <ExternalLink className="w-4 h-4" />
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
  const [shareModalChecklist, setShareModalChecklist] = useState<Checklist | null>(null);
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

  const handlePreview = (checklist: Checklist) => {
    const sessionToken = Math.random().toString(36).substring(2, 10);
    const url = `${window.location.origin}/c/${checklist.id}/${sessionToken}`;
    window.open(url, '_blank');
  };

  const handleShare = (checklist: Checklist) => {
    setShareModalChecklist(checklist);
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-sans">Your Checklists</h2>
          <p className="text-gray-600 font-sans">Create and manage onboarding flows for your customers</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreateFromTemplate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center shadow-sm hover:shadow-md font-sans"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Use Template
          </button>
          <button
            onClick={() => onCreateNew()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center shadow-sm hover:shadow-md font-sans"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Custom
          </button>
        </div>
      </div>

      {/* Checklists Grid */}
      {checklists.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 font-sans">Create Your First Checklist</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto font-sans">
            Start with a proven template or build a custom onboarding flow from scratch
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCreateFromTemplate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center shadow-sm hover:shadow-md font-sans"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Browse Templates
            </button>
            <button
              onClick={() => onCreateNew()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center shadow-sm hover:shadow-md font-sans"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start from Scratch
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {checklists.map((checklist) => (
            <ChecklistCard
              key={checklist.id}
              checklist={checklist}
              onEdit={onEditChecklist}
              onDelete={handleDelete}
              onPreview={handlePreview}
              onShare={handleShare}
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

      {/* Share Link Modal */}
      {shareModalChecklist && (
        <ShareLinkModal
          checklist={shareModalChecklist}
          onClose={() => {
            setShareModalChecklist(null);
          }}
        />
      )}
    </div>
  );
}