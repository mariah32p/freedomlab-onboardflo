import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useCustomerSessions } from '../hooks/useCustomerSessions';
import PaymentBanner from '../components/PaymentBanner';
import TrialBanner from '../components/TrialBanner';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  Send,
  Trash2,
  ExternalLink,
  Mail,
  Building,
  User,
  Link as LinkIcon,
  Eye,
  Copy,
  Check
} from 'lucide-react';

export default function SubmissionsPage() {
  const { user } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const { sessions, loading, error, deleteSession, getSessionStats, getSessionProgress } = useCustomerSessions();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedSessionId, setCopiedSessionId] = useState<string | null>(null);
  const accessStatus = getAccessStatus();

  // Track progress for each session
  const [sessionProgress, setSessionProgress] = useState<Record<string, number>>({});

  // Load progress for all sessions
  useEffect(() => {
    const loadAllProgress = async () => {
      const progressData: Record<string, number> = {};
      
      for (const session of sessions) {
        // Calculate progress for all sessions that might have progress data
        if (session.submission_status !== 'pending' || session.started_at) {
          const progress = await getSessionProgress(session.id);
          
          // Get total steps for this checklist
          const { data: steps } = await supabase
            .from('checklist_steps')
            .select('id')
            .eq('checklist_id', session.checklist_id);
          
          const totalSteps = steps?.length || 0;
          const completedSteps = progress.length;
          const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
          
          progressData[session.id] = percentage;
        }
      }
      
      setSessionProgress(progressData);
    };

    if (sessions.length > 0) {
      loadAllProgress();
    }
  }, [sessions, getSessionProgress]);

  const stats = getSessionStats();

  const handleDeleteSession = async (sessionId: string) => {
    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this session? This will remove all progress data and cannot be undone.')) {
      return;
    }
    
    setDeletingId(sessionId);
    const success = await deleteSession(sessionId);
    setDeletingId(null);
  };

  const handlePreviewSession = (session: any) => {
    const url = `${window.location.origin}/c/${session.checklist_id}/${session.session_token}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendReminder = (session: any) => {
    // TODO: Implement email notification via Resend
    // API Key: re_HuAgNbtA_NUGsRpLZK4t4WdXFFBrxSZGg
    // From: info@freedomlab.ai - OnboardFlo by Freedom Lab
    alert('Email reminder feature coming soon! Will use Resend API to send reminder emails.');
  };

  const handleCopyUrl = async (session: any) => {
    const url = `${window.location.origin}/c/${session.checklist_id}/${session.session_token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSessionId(session.id);
      setTimeout(() => setCopiedSessionId(null), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const getStatusColor = (session: any) => {
    switch (session.submission_status) {
      case 'completed': return 'text-emerald-600';
      case 'started': return 'text-blue-600';
      case 'pending': return 'text-orange-600';
      case 'abandoned': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (session: any) => {
    switch (session.submission_status) {
      case 'completed': return 'Completed';
      case 'started': return 'In Progress';
      case 'pending': return 'Pending';
      case 'abandoned': return 'Abandoned';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Loading submissions...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Customer Submissions</h1>
          <p className="text-gray-600 font-sans">
            Track customer progress across all your onboarding checklists
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm font-sans">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 font-sans">{stats.totalSessions}</div>
                <div className="text-sm text-gray-600 font-sans">Total Links</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 font-sans">{stats.pendingSessions}</div>
                <div className="text-sm text-gray-600 font-sans">Pending</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 font-sans">{stats.activeSessions}</div>
                <div className="text-sm text-gray-600 font-sans">Active</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 font-sans">{stats.completedSessions}</div>
                <div className="text-sm text-gray-600 font-sans">Completed</div>
              </div>
            </div>
          </div>

        </div>

        {/* Customer Sessions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 font-sans">Customer Sessions</h2>
          </div>
          
          {sessions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">No submissions yet</h3>
              <p className="text-gray-600 mb-6 font-sans">
                Create customer links from your checklists to start tracking submissions. Each link you create will appear here immediately.
              </p>
              <button
                onClick={() => window.location.href = '/checklists'}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors font-sans"
              >
                Go to Checklists
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-sm font-bold font-sans">
                          {(session.name || session.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-gray-900 font-sans">
                                {session.name || (session.submission_status === 'pending' ? 'Pending Customer' : 'Anonymous')}
                              </h3>
                              {session.link_name && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium font-sans">
                                  {session.link_name}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-1">
                              <div className="flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                <span className="font-sans">{session.email || 'Not provided yet'}</span>
                              </div>
                              {session.company && (
                                <div className="flex items-center">
                                  <Building className="w-3 h-3 mr-1" />
                                  <span className="font-sans">{session.company}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="font-sans">
                                Checklist: {(session as any).checklists?.title || 'Unknown'}
                              </span>
                              <span className="font-sans">
                                Created: {formatDate(session.link_created_at || session.created_at)}
                              </span>
                              {session.started_at && session.submission_status !== 'pending' && (
                                <span className="font-sans">
                                  Started: {formatDate(session.started_at)}
                                </span>
                              )}
                              {session.completed_at && (
                                <span className="font-sans">
                                  Completed: {formatDate(session.completed_at)}
                                </span>
                              )}
                              <span className="font-sans">
                                Last activity: {getTimeSince(session.last_activity)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className={`text-sm font-medium font-sans ${getStatusColor(session)}`}>
                              {getStatusText(session)}
                            </div>
                            {session.submission_status === 'started' && (
                              <div className="text-xs text-gray-500 mt-1 font-sans">
                                {sessionProgress[session.id] !== undefined ? `${sessionProgress[session.id]}% complete` : 'Loading progress...'}
                              </div>
                            )}
                            {session.submission_status === 'pending' && sessionProgress[session.id] > 0 && (
                              <div className="text-xs text-blue-600 mt-1 font-sans">
                                {sessionProgress[session.id]}% complete
                              </div>
                            )}
                            {session.submission_status === 'completed' && (
                              <div className="text-xs text-emerald-600 mt-1 font-sans font-medium">
                                100% complete
                              </div>
                            )}
                            {session.submission_status === 'started' && session.is_active && (
                              <div className="flex items-center mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-xs text-green-600 font-sans">Active now</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => handlePreviewSession(session)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="View customer session"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleCopyUrl(session)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                        title="Copy customer link"
                      >
                        {copiedSessionId === session.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button 
                        onClick={() => handleSendReminder(session)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                        title="Send reminder"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        disabled={deletingId === session.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete session"
                      >
                        {deletingId === session.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}