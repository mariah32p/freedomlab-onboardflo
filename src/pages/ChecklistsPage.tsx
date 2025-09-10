import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { useChecklists } from '../hooks/useChecklists';
import { useCustomerSessions } from '../hooks/useCustomerSessions';
import PaymentBanner from '../components/PaymentBanner';
import TrialBanner from '../components/TrialBanner';
import { Checklist } from '../types/checklist';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Eye,
  Globe,
  Lock,
  Calendar,
  Users,
  Link as LinkIcon
} from 'lucide-react';

export default function ChecklistsPage() {
  const { user } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const { checklists, loading, error, deleteChecklist } = useChecklists();
  const { createPendingSubmission } = useCustomerSessions();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [creatingSessionId, setCreatingSessionId] = useState<string | null>(null);
  const accessStatus = getAccessStatus();
  const navigate = useNavigate();

  // Redirect to dashboard if no active subscription
  useEffect(() => {
    if (!accessStatus.hasAccess || accessStatus.shouldRedirectToGetStarted) {
      navigate('/dashboard');
    }
  }, [accessStatus, navigate]);

  const handleDeleteChecklist = async (id: string) => {
    if (!confirm('Are you sure you want to delete this checklist? This will also delete all customer sessions and cannot be undone.')) {
      return;
    }
    
    setDeletingId(id);
    const success = await deleteChecklist(id);
    setDeletingId(null);
  };

  const handleCopyUrl = async (checklist: Checklist) => {
    try {
      // Copy the base checklist URL (customers will create their own sessions)
      const url = `${window.location.origin}/c/${checklist.id}`;
      await navigator.clipboard.writeText(url);
      setCopiedId(checklist.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewSubmissions = (checklist: Checklist) => {
    navigate('/submissions');
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Loading checklists...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 font-sans">Checklists</h1>
            <p className="text-gray-600 font-sans">
              Create and manage your customer onboarding checklists
            </p>
          </div>
          <button
            onClick={() => navigate('/checklists/create')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center font-sans"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Checklist
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm font-sans">{error}</p>
          </div>
        )}

        {/* Checklists Grid */}
        {checklists.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sans">Create your first checklist</h3>
            <p className="text-gray-600 mb-6 font-sans">
              Build a step-by-step onboarding experience that guides your customers to success
            </p>
            <button
              onClick={() => navigate('/checklists/create')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors font-sans"
            >
              Create Checklist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {checklists.map((checklist) => (
              <div
                key={checklist.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                      {checklist.title}
                    </h3>
                    {checklist.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 font-sans">
                        {checklist.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {checklist.is_public ? (
                        <Globe className="w-4 h-4 mr-1 text-emerald-500" />
                      ) : (
                        <Lock className="w-4 h-4 mr-1 text-orange-500" />
                      )}
                      <span className="font-sans">{checklist.is_public ? 'Public' : 'Protected'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="font-sans">{formatDate(checklist.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/checklists/edit/${checklist.id}`)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit checklist"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteChecklist(checklist.id)}
                    disabled={deletingId === checklist.id}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete checklist"
                  >
                    {deletingId === checklist.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
