import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import PaymentBanner from '../components/PaymentBanner';
import TrialBanner from '../components/TrialBanner';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  Send
} from 'lucide-react';

export default function SubmissionsPage() {
  const { user } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const accessStatus = getAccessStatus();

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
            Track customer progress and submissions across all your checklists
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 font-sans">12</div>
                <div className="text-sm text-gray-600 font-sans">Need Help</div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Submissions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 font-sans">Recent Submissions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { customer: 'Sarah M.', email: 'sarah@techcorp.com', company: 'TechCorp', checklist: 'SaaS Setup', progress: 85, status: 'in_progress', lastUpdate: '2 hours ago' },
                { customer: 'Mike R.', email: 'mike@startupxyz.com', company: 'StartupXYZ', checklist: 'Quick Start', progress: 100, status: 'completed', lastUpdate: '1 day ago' },
                { customer: 'Lisa K.', email: 'lisa@growthco.com', company: 'GrowthCo', checklist: 'Enterprise Setup', progress: 45, status: 'stuck', lastUpdate: '3 days ago' },
                { customer: 'David L.', email: 'david@scaletech.com', company: 'ScaleTech', checklist: 'SaaS Setup', progress: 70, status: 'in_progress', lastUpdate: '5 hours ago' }
              ].map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-sm font-bold font-sans">
                        {submission.customer.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 font-sans">{submission.customer}</h3>
                          <p className="text-sm text-gray-600 font-sans">{submission.email} • {submission.company}</p>
                          <p className="text-xs text-gray-500 font-sans">{submission.checklist} • Last updated {submission.lastUpdate}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center mb-1">
                            <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  submission.status === 'completed' ? 'bg-emerald-500' :
                                  submission.status === 'stuck' ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${submission.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 font-sans">{submission.progress}%</span>
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
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Send reminder">
                      <Send className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Schedule call">
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}