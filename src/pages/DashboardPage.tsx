import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import PaymentBanner from '../components/PaymentBanner';
import TrialBanner from '../components/TrialBanner';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock, 
  Plus, 
  FileText,
  Send,
  Home
} from 'lucide-react';

// Dashboard sections
const DashboardOverview = () => (
  <div className="space-y-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900 font-sans">247</div>
            <div className="text-sm text-gray-600 font-sans">Active Customers</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900 font-sans">87%</div>
            <div className="text-sm text-gray-600 font-sans">Completion Rate</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900 font-sans">2.3</div>
            <div className="text-sm text-gray-600 font-sans">Avg Days</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900 font-sans">12</div>
            <div className="text-sm text-gray-600 font-sans">Active Flows</div>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 font-sans">Recent Activity</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[
            { user: 'Sarah M.', action: 'completed setup', time: '2 min ago', type: 'success' },
            { user: 'Mike R.', action: 'started onboarding', time: '15 min ago', type: 'info' },
            { user: 'Lisa K.', action: 'needs assistance', time: '1 hour ago', type: 'warning' },
            { user: 'David L.', action: 'completed step 3', time: '2 hours ago', type: 'success' }
          ].map((activity, index) => (
            <div key={index} className="flex items-start">
              <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                activity.type === 'success' ? 'bg-emerald-500' :
                activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-sans">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500 font-sans">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ChecklistsSection = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900 font-sans">Onboarding Checklists</h2>
      <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center font-sans">
        <Plus className="w-4 h-4 mr-2" />
        New Checklist
      </button>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="space-y-4">
          {[
            { name: 'SaaS Setup Checklist', customers: 45, completion: 89, status: 'active' },
            { name: 'Enterprise Onboarding', customers: 12, completion: 76, status: 'active' },
            { name: 'Quick Start Guide', customers: 89, completion: 94, status: 'active' }
          ].map((flow, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <h3 className="font-medium text-gray-900 font-sans">{flow.name}</h3>
                <p className="text-sm text-gray-600 font-sans">{flow.customers} customers • {flow.completion}% completion</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium font-sans">
                  {flow.status}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SubmissionsSection = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900 font-sans">Customer Submissions</h2>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="space-y-4">
          {[
            { customer: 'Sarah M. - TechCorp', checklist: 'SaaS Setup', progress: 85, status: 'in_progress', lastUpdate: '2 hours ago' },
            { customer: 'Mike R. - StartupXYZ', checklist: 'Quick Start', progress: 100, status: 'completed', lastUpdate: '1 day ago' },
            { customer: 'Lisa K. - GrowthCo', checklist: 'Enterprise Setup', progress: 45, status: 'stuck', lastUpdate: '3 days ago' },
            { customer: 'David L. - ScaleTech', checklist: 'SaaS Setup', progress: 70, status: 'in_progress', lastUpdate: '5 hours ago' }
          ].map((submission, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 font-sans">{submission.customer}</h3>
                <p className="text-sm text-gray-600 font-sans">{submission.checklist} • Last updated {submission.lastUpdate}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          submission.status === 'completed' ? 'bg-emerald-500' :
                          submission.status === 'stuck' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${submission.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 font-sans">{submission.progress}%</span>
                  </div>
                  <div className={`text-xs font-sans ${
                    submission.status === 'completed' ? 'text-emerald-600' :
                    submission.status === 'stuck' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {submission.status === 'completed' ? 'Completed' :
                     submission.status === 'stuck' ? 'Needs Help' : 'In Progress'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);


export default function DashboardPage() {
  const { user } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const urlParams = new URLSearchParams(window.location.search);
  const tabFromUrl = urlParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'dashboard');
  const isSuccess = urlParams.get('success') === 'true';
  const accessStatus = getAccessStatus();

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'checklists', name: 'Checklists', icon: CheckCircle },
    { id: 'submissions', name: 'Submissions', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'checklists':
        return <ChecklistsSection />;
      case 'submissions':
        return <SubmissionsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial Banner */}
        <TrialBanner />
        
        {/* Payment Issue Banner */}
        <PaymentBanner />
        
        {/* Success message */}
        {isSuccess && (
          <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-emerald-800 font-sans">Welcome to OnboardFlo!</h3>
                <p className="text-emerald-700 font-sans">
                  Your trial has started! You have full access to all features.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">
            {accessStatus.isTrialing ? 'Welcome to your trial!' : 'Welcome back!'}
          </h1>
          <p className="text-gray-600 font-sans">
            {accessStatus.isTrialing 
              ? 'Explore all features during your trial period'
              : 'Manage your onboarding flows and track customer progress'
            }
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors font-sans ${
                      activeTab === tab.id
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}