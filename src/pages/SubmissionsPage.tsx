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
  Check,
  Edit,
  X,
  Plus
} from 'lucide-react';

export default function SubmissionsPage() {
  const { user } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const { sessions, loading, error, deleteSession, getSessionStats, getSessionProgress } = useCustomerSessions();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedSessionId, setCopiedSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingLinkName, setEditingLinkName] = useState('');
  const [sessionActions, setSessionActions] = useState<Record<string, 'saved' | 'sent' | 'scheduled'>>({});
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  const [createSessionData, setCreateSessionData] = useState({
    checklistId: '',
    sessionName: '',
    sessionDescription: '',
    sessionEmails: ''
  });
  const [creatingSession, setCreatingSession] = useState(false);
  const [checklists, setChecklists] = useState<any[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [newSessionData, setNewSessionData] = useState<any>(null);
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

  // Load checklists for the dropdown
  useEffect(() => {
    const fetchChecklists = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('checklists')
          .select('id, title')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setChecklists(data || []);
      } catch (err) {
        console.error('Error fetching checklists:', err);
      }
    };

    fetchChecklists();
  }, [user]);

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

  const handleEditLinkName = (session: any) => {
    setEditingSessionId(session.id);
    setEditingLinkName(session.link_name || '');
  };

  const handleSaveLinkName = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('customer_sessions')
        .update({ link_name: editingLinkName.trim() })
        .eq('id', sessionId);

      if (error) throw error;

      // Update local state
      // Note: This would normally trigger a refetch, but for immediate UI update:
      setEditingSessionId(null);
      setEditingLinkName('');
      
      // Refresh the sessions list
      window.location.reload();
    } catch (err) {
      console.error('Error updating link name:', err);
      alert('Failed to update link name');
    }
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditingLinkName('');
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createSessionData.checklistId) {
      alert('Please select a checklist');
      return;
    }
    
    if (!createSessionData.sessionName.trim()) {
      alert('Please enter a session name');
      return;
    }
    
    if (!createSessionData.sessionEmails.trim()) {
      alert('Please enter at least one email address');
      return;
    }
    
    setCreatingSession(true);
    
    try {
      // Generate unique session token
      const sessionToken = Math.random().toString(36).substring(2, 10);
      
      // Create session in database
      const { data: newSession, error: createError } = await supabase
        .from('customer_sessions')
        .insert({
          checklist_id: createSessionData.checklistId,
          session_token: sessionToken,
          link_name: createSessionData.sessionName.trim(),
          session_description: createSessionData.sessionDescription.trim(),
          session_emails: createSessionData.sessionEmails.trim(),
          email: '', // Will be filled when customer accesses
          name: '',
          company: '',
          submission_status: 'pending',
          link_created_by: user?.id,
          link_created_at: new Date().toISOString(),
          is_active: false,
        })
        .select()
        .single();

      if (createError) throw createError;
      
      // Copy the session URL to clipboard
      const sessionUrl = `${window.location.origin}/c/${createSessionData.checklistId}/${sessionToken}`;
      
      // Store session data for popup
      setNewSessionData({ ...newSession, sessionUrl });
      
      // Reset form and close modal
      setCreateSessionData({
        checklistId: '',
        sessionName: '',
        sessionDescription: '',
        sessionEmails: ''
      });
      setShowCreateSessionModal(false);
      setShowSuccessPopup(true);
      
    } catch (err) {
      console.error('Error creating session:', err);
      alert('Failed to create session. Please try again.');
    } finally {
      setCreatingSession(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Customer Sessions</h1>
          <p className="text-gray-600 font-sans">
            Track customer progress across all your onboarding checklists
          </p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowCreateSessionModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center font-sans"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Session
          </button>
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
                Create customer links from your checklists to start tracking sessions. Each link you create will appear here immediately.
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
                  <div key={session.id} className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center flex-1">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              {editingSessionId === session.id ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={editingLinkName}
                                    onChange={(e) => setEditingLinkName(e.target.value)}
                                    className="font-medium text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 text-sm font-sans"
                                    placeholder="Enter session name"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleSaveLinkName(session.id);
                                      } else if (e.key === 'Escape') {
                                        handleCancelEdit();
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => handleSaveLinkName(session.id)}
                                    className="text-emerald-600 hover:text-emerald-700 p-1"
                                    title="Save"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-medium text-gray-900 font-sans">
                                    {session.link_name || 'Unnamed Session'}
                                  </h3>
                                  <button
                                    onClick={() => handleEditLinkName(session)}
                                    className="text-gray-400 hover:text-gray-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Edit name"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                </div>
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
                      {/* Show action buttons for newly created sessions */}
                      {sessionActions[session.id] === 'saved' && (
                        <div className="flex items-center space-x-2 mr-2">
                          <button
                            onClick={() => handleSendWelcomeEmail(session)}
                            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors font-sans"
                          >
                            Send Welcome Email
                          </button>
                          <button
                            onClick={() => handleCopyUrl(session)}
                            className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs font-medium transition-colors font-sans"
                          >
                            Copy Link
                          </button>
                        </div>
                      )}
                      {sessionActions[session.id] === 'sent' && (
                        <div className="flex items-center space-x-2 mr-2">
                          <button
                            onClick={() => handleScheduleReminders(session)}
                            className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-medium transition-colors font-sans"
                          >
                            Schedule Reminders
                          </button>
                        </div>
                      )}
                      {sessionActions[session.id] === 'scheduled' && (
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium font-sans">
                          ✓ Reminders Scheduled
                        </div>
                      )}
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

        {/* Create Session Modal */}
        {showCreateSessionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-sans">Create New Session</h2>
                <button
                  onClick={() => setShowCreateSessionModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Checklist *
                  </label>
                  <select
                    value={createSessionData.checklistId}
                    onChange={(e) => setCreateSessionData(prev => ({ ...prev, checklistId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                    required
                  >
                    <option value="">Select a checklist...</option>
                    {checklists.map((checklist) => (
                      <option key={checklist.id} value={checklist.id}>
                        {checklist.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={createSessionData.sessionName}
                    onChange={(e) => setCreateSessionData(prev => ({ ...prev, sessionName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                    placeholder="e.g., John's Website Project"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Description
                  </label>
                  <textarea
                    value={createSessionData.sessionDescription}
                    onChange={(e) => setCreateSessionData(prev => ({ ...prev, sessionDescription: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                    placeholder="Optional description for this session"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Email Recipients *
                  </label>
                  <textarea
                    value={createSessionData.sessionEmails}
                    onChange={(e) => setCreateSessionData(prev => ({ ...prev, sessionEmails: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                    placeholder="john@company.com, sarah@company.com&#10;or one email per line:&#10;john@company.com&#10;sarah@company.com"
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 font-sans">
                    <strong>Collaboration Link:</strong> Enter email addresses separated by commas or line breaks. All recipients will receive the SAME session link to collaborate on this specific checklist together. This is NOT bulk sending - it's one shared session for team collaboration.
                  </p>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateSessionModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingSession}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 font-sans"
                  >
                    {creatingSession ? 'Creating...' : 'Save Session'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && newSessionData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-sans">Session Created!</h2>
                <p className="text-gray-600 font-sans">
                  Your session "{newSessionData.link_name}" is ready. What would you like to do next?
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleSendWelcomeEmail(newSessionData)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center font-sans"
                >
                  <Mail className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div>Send Welcome Email</div>
                    <div className="text-blue-200 text-sm font-normal">Send personalized email with session link</div>
                  </div>
                </button>

                <button
                  onClick={() => handleCopySessionUrl(newSessionData.sessionUrl)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center font-sans"
                >
                  <Copy className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div>Copy Session Link</div>
                    <div className="text-emerald-200 text-sm font-normal">Copy link to share manually</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowSuccessPopup(false);
                    window.location.reload();
                  }}
                  className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors font-sans"
                >
                  I'll do this later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}