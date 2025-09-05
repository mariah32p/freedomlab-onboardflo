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
  Plus,
  ArrowLeft,
  Save,
  Play
} from 'lucide-react';

export default function SubmissionsPage() {
  const { user } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const { sessions, loading, error, deleteSession, getSessionStats, getSessionProgress } = useCustomerSessions();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedSessionId, setCopiedSessionId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [editingSession, setEditingSession] = useState(false);
  const [editFormData, setEditFormData] = useState({
    link_name: '',
    session_description: '',
    session_emails: ''
  });
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  const [createSessionData, setCreateSessionData] = useState({
    checklistId: '',
    sessionName: '',
    sessionDescription: '',
    sessionEmails: ''
  });
  const [creatingSession, setCreatingSession] = useState(false);
  const [checklists, setChecklists] = useState<any[]>([]);
  const [sendingEmail, setSendingEmail] = useState(false);
  const accessStatus = getAccessStatus();

  // Track progress for each session
  const [sessionProgress, setSessionProgress] = useState<Record<string, number>>({});

  // Load progress for all sessions
  useEffect(() => {
    const loadAllProgress = async () => {
      try {
        const progressData: Record<string, number> = {};
        
        for (const session of sessions) {
          if (session.submission_status !== 'pending' || session.started_at) {
            try {
              const progress = await getSessionProgress(session.id);
              
              const { data: steps, error: stepsError } = await supabase
                .from('checklist_steps')
                .select('id')
                .eq('checklist_id', session.checklist_id);
              
              if (stepsError) {
                console.warn(`Error fetching steps for checklist ${session.checklist_id}:`, stepsError);
                continue;
              }
              
              const totalSteps = steps?.length || 0;
              const completedSteps = progress.length;
              const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
              
              progressData[session.id] = percentage;
            } catch (sessionError) {
              console.warn(`Error loading progress for session ${session.id}:`, sessionError);
              progressData[session.id] = 0;
            }
          }
        }
        
        setSessionProgress(progressData);
      } catch (err) {
        console.error('Error in loadAllProgress:', err);
        setSessionProgress({});
      }
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
    if (!confirm('Are you sure you want to delete this session? This will remove all progress data and cannot be undone.')) {
      return;
    }
    
    setDeletingId(sessionId);
    const success = await deleteSession(sessionId);
    setDeletingId(null);
    
    // Close detail view if we're viewing the deleted session
    if (selectedSession?.id === sessionId) {
      setSelectedSession(null);
    }
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
      const sessionToken = Math.random().toString(36).substring(2, 10);
      
      const { data: newSession, error: createError } = await supabase
        .from('customer_sessions')
        .insert({
          checklist_id: createSessionData.checklistId,
          session_token: sessionToken,
          link_name: createSessionData.sessionName.trim(),
          session_description: createSessionData.sessionDescription.trim(),
          session_emails: createSessionData.sessionEmails.trim(),
          email: '',
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
      
      setCreateSessionData({
        checklistId: '',
        sessionName: '',
        sessionDescription: '',
        sessionEmails: ''
      });
      setShowCreateSessionModal(false);
      
      // Refresh sessions list
      window.location.reload();
    } catch (err) {
      console.error('Error creating session:', err);
      alert('Failed to create session. Please try again.');
    } finally {
      setCreatingSession(false);
    }
  };

  const handleEditSession = () => {
    if (!selectedSession) return;
    
    setEditFormData({
      link_name: selectedSession.link_name || '',
      session_description: selectedSession.session_description || '',
      session_emails: selectedSession.session_emails || ''
    });
    setEditingSession(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedSession) return;
    
    try {
      const { error } = await supabase
        .from('customer_sessions')
        .update({
          link_name: editFormData.link_name.trim(),
          session_description: editFormData.session_description.trim(),
          session_emails: editFormData.session_emails.trim(),
        })
        .eq('id', selectedSession.id);

      if (error) throw error;

      // Update selected session
      setSelectedSession(prev => ({
        ...prev,
        link_name: editFormData.link_name.trim(),
        session_description: editFormData.session_description.trim(),
        session_emails: editFormData.session_emails.trim(),
      }));
      
      setEditingSession(false);
      
      // Refresh sessions list
      window.location.reload();
    } catch (err) {
      console.error('Error updating session:', err);
      alert('Failed to update session');
    }
  };

  const handleSendEmail = async (type: 'welcome' | 'reminder') => {
    if (!selectedSession) return;
    
    setSendingEmail(true);
    
    try {
      // Parse emails from the session_emails field
      const emailList = selectedSession.session_emails
        .split(/[,\n]/)
        .map((email: string) => email.trim())
        .filter((email: string) => email.length > 0);
      
      if (emailList.length === 0) {
        alert('No email addresses found for this session');
        return;
      }
      
      const sessionUrl = `${window.location.origin}/c/${selectedSession.checklist_id}/${selectedSession.session_token}`;
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          sessionId: selectedSession.id,
          recipientEmails: emailList,
          sessionName: selectedSession.link_name,
          checklistTitle: (selectedSession as any).checklists?.title,
          sessionUrl,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }
      
      alert(`${type === 'welcome' ? 'Welcome' : 'Reminder'} email sent to ${emailList.length} recipient(s)!`);
    } catch (err) {
      console.error('Error sending email:', err);
      alert(`Failed to send ${type} email. Please try again.`);
    } finally {
      setSendingEmail(false);
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

  // Show detailed session view
  if (selectedSession) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-sans">
                  {selectedSession.link_name || 'Unnamed Session'}
                </h1>
                <p className="text-gray-600 font-sans">Session details and management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleCopyUrl(selectedSession)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors font-sans"
              >
                {copiedSessionId === selectedSession.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              <button
                onClick={handleEditSession}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-sans"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Session Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Session Information</h3>
                
                {editingSession ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Name</label>
                      <input
                        type="text"
                        value={editFormData.link_name}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, link_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                        placeholder="Session name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Description</label>
                      <textarea
                        value={editFormData.session_description}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, session_description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                        placeholder="Session description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Email Recipients</label>
                      <textarea
                        value={editFormData.session_emails}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, session_emails: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                        placeholder="john@company.com, sarah@company.com"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center font-sans"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingSession(false)}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-sans"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Name</label>
                      <p className="text-gray-900 font-sans">{selectedSession.link_name || 'Unnamed Session'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Description</label>
                      <p className="text-gray-900 font-sans">{selectedSession.session_description || 'No description'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Email Recipients</label>
                      <p className="text-gray-900 font-sans">{selectedSession.session_emails || 'No emails specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Status</label>
                      <span className={`font-medium font-sans ${getStatusColor(selectedSession)}`}>
                        {getStatusText(selectedSession)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Progress</label>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${sessionProgress[selectedSession.id] || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 font-sans">
                          {sessionProgress[selectedSession.id] || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              {selectedSession.email && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-900 font-sans">{selectedSession.email}</span>
                    </div>
                    {selectedSession.name && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-900 font-sans">{selectedSession.name}</span>
                      </div>
                    )}
                    {selectedSession.company && (
                      <div className="flex items-center">
                        <Building className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-900 font-sans">{selectedSession.company}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.open(`${window.location.origin}/c/${selectedSession.checklist_id}/${selectedSession.session_token}`, '_blank')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-sans"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview Session</span>
                  </button>
                  
                  <button
                    onClick={() => handleSendEmail('welcome')}
                    disabled={sendingEmail || !selectedSession.session_emails}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 font-sans"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{sendingEmail ? 'Sending...' : 'Send Welcome Email'}</span>
                  </button>
                  
                  <button
                    onClick={() => handleSendEmail('reminder')}
                    disabled={sendingEmail || !selectedSession.session_emails}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 font-sans"
                  >
                    <Send className="w-4 h-4" />
                    <span>{sendingEmail ? 'Sending...' : 'Send Reminder'}</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteSession(selectedSession.id)}
                    disabled={deletingId === selectedSession.id}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 font-sans"
                  >
                    {deletingId === selectedSession.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Session</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Session Timeline */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 font-sans">Session Created</p>
                      <p className="text-sm text-gray-600 font-sans">{formatDate(selectedSession.link_created_at || selectedSession.created_at)}</p>
                    </div>
                  </div>
                  
                  {selectedSession.started_at && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 font-sans">Customer Started</p>
                        <p className="text-sm text-gray-600 font-sans">{formatDate(selectedSession.started_at)}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedSession.completed_at && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 font-sans">Completed</p>
                        <p className="text-sm text-gray-600 font-sans">{formatDate(selectedSession.completed_at)}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 font-sans">Last Activity</p>
                      <p className="text-sm text-gray-600 font-sans">{getTimeSince(selectedSession.last_activity)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show main sessions overview
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Customer Sessions</h1>
            <p className="text-gray-600 font-sans">
              Track customer progress across all your onboarding checklists
            </p>
          </div>
          <button
            onClick={() => setShowCreateSessionModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center font-sans"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Session
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
                <div className="text-sm text-gray-600 font-sans">Total Sessions</div>
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

        {/* Sessions Grid */}
        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">No sessions yet</h3>
            <p className="text-gray-600 mb-6 font-sans">
              Create customer sessions to start tracking onboarding progress
            </p>
            <button
              onClick={() => setShowCreateSessionModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors font-sans"
            >
              Create First Session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedSession(session)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                      {session.link_name || 'Unnamed Session'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 font-sans">
                      {(session as any).checklists?.title || 'Unknown Checklist'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium font-sans ${
                    session.submission_status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    session.submission_status === 'started' ? 'bg-blue-100 text-blue-700' :
                    session.submission_status === 'pending' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {getStatusText(session)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 font-sans">Progress</span>
                    <span className="text-sm font-medium text-gray-700 font-sans">
                      {sessionProgress[session.id] || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${sessionProgress[session.id] || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Customer Info */}
                {session.email && (
                  <div className="mb-4 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-3 h-3 mr-2" />
                      <span className="font-sans">{session.email}</span>
                    </div>
                    {session.company && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="w-3 h-3 mr-2" />
                        <span className="font-sans">{session.company}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 font-sans">
                    {getTimeSince(session.last_activity)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(session);
                    }}
                    className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {copiedSessionId === session.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium font-sans">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm font-medium font-sans">Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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
                    Session Name *
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
                    placeholder="john@company.com, sarah@company.com"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 font-sans">
                    Comma or line-separated email addresses for collaboration
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
                    {creatingSession ? 'Creating...' : 'Create Session'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}