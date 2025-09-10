import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { useChecklists } from '../hooks/useChecklists';
import { useCustomerSessions } from '../hooks/useCustomerSessions';
import PaymentBanner from '../components/PaymentBanner';
import TrialBanner from '../components/TrialBanner';
import { 
  Plus, 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BarChart3,
  Calendar,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const { checklists, loading: checklistsLoading } = useChecklists();
  const { sessions, getSessionStats } = useCustomerSessions();
  const navigate = useNavigate();
  const accessStatus = getAccessStatus();

  // Redirect to get-started if no active subscription
  useEffect(() => {
    if (!accessStatus.hasAccess || accessStatus.shouldRedirectToGetStarted) {
      navigate('/get-started');
    }
  }, [accessStatus, navigate]);

  const stats = getSessionStats();

  if (checklistsLoading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Loading dashboard...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Dashboard</h1>
          <p className="text-gray-600 font-sans">
            Welcome back! Here's an overview of your onboarding activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 font-sans">{checklists.length}</div>
                <div className="text-sm text-gray-600 font-sans">Checklists</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 font-sans">{stats.totalSessions}</div>
                <div className="text-sm text-gray-600 font-sans">Total Sessions</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Checklists */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 font-sans">Recent Checklists</h2>
              <button
                onClick={() => navigate('/checklists')}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm font-sans"
              >
                View All
              </button>
            </div>
            
            {checklists.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">No checklists yet</h3>
                <p className="text-gray-600 mb-4 font-sans">Create your first onboarding checklist</p>
                <button
                  onClick={() => navigate('/checklists/create')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors font-sans"
                >
                  Create Checklist
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {checklists.slice(0, 3).map((checklist) => (
                  <div key={checklist.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 font-sans">{checklist.title}</h4>
                      <p className="text-sm text-gray-600 font-sans">
                        Created {new Date(checklist.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/checklists/edit/${checklist.id}`)}
                      className="text-emerald-600 hover:text-emerald-700 p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 font-sans">Quick Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/checklists/create')}
                className="w-full flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-4">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 font-sans">Create Checklist</div>
                    <div className="text-sm text-gray-600 font-sans">Build a new onboarding flow</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/submissions')}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 font-sans">Manage Sessions</div>
                    <div className="text-sm text-gray-600 font-sans">Track customer progress</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/branding')}
                className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 font-sans">Customize Branding</div>
                    <div className="text-sm text-gray-600 font-sans">Update colors and logo</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {sessions.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 font-sans">Recent Activity</h2>
              <button
                onClick={() => navigate('/submissions')}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm font-sans"
              >
                View All Sessions
              </button>
            </div>
            
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold font-sans">
                        {(session.name || session.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm font-sans">
                        {session.link_name || 'Unnamed Session'}
                      </div>
                      <div className="text-xs text-gray-600 font-sans">
                        {session.email || 'No email'} • {session.submission_status}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 font-sans">
                    {new Date(session.last_activity).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}