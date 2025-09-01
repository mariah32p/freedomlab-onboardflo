import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle, TrendingUp, Users, Clock, Target, AlertCircle, Calendar, Eye } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-blue-50/30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-sans">
              Customer onboarding
              <span className="text-emerald-600"> made simple</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-sans">
              Create beautiful, trackable onboarding checklists that guide your customers 
              to success and reduce support tickets by 60%.
            </p>
            
            {/* CTA buttons */}
            <div className="mb-8">
              <Link 
                to="/signup" 
                className="group bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-sans w-full sm:w-auto sm:inline-flex rounded-md px-8 py-4 text-lg sm:px-6 sm:py-3 sm:text-base"
                style={{ 
                  width: 'auto',
                  minWidth: '160px',
                  height: '48px'
                }}
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <p className="text-gray-500 text-sm font-sans">
              ✓ 7-day free trial • ✓ Cancel anytime
            </p>
          </div>
          
          {/* Right side - Dashboard Visual */}
          <div className="relative max-w-lg mx-auto lg:mx-0">
            {/* Main Dashboard Container */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-sans">Onboarding Dashboard</h3>
                    <p className="text-emerald-100 text-sm font-sans">Real-time customer progress</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-sans">87%</div>
                    <div className="text-emerald-100 text-xs font-sans">Avg. Completion</div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 font-sans">247</div>
                    <div className="text-xs text-gray-600 font-sans">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Target className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 font-sans">215</div>
                    <div className="text-xs text-gray-600 font-sans">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 font-sans">2.3d</div>
                    <div className="text-xs text-gray-600 font-sans">Avg. Time</div>
                  </div>
                </div>
              </div>

              {/* Live Customer Progress */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 font-sans">Live Customer Progress</h4>
                  <div className="flex items-center text-sm text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-sans">Live</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: 'Sarah M.', company: 'TechCorp', progress: 85, status: 'active', timeLeft: '2 steps left' },
                    { name: 'Mike R.', company: 'StartupXYZ', progress: 100, status: 'completed', timeLeft: 'Completed!' },
                    { name: 'Lisa K.', company: 'GrowthCo', progress: 45, status: 'stuck', timeLeft: 'Needs help' },
                    { name: 'David L.', company: 'ScaleTech', progress: 70, status: 'active', timeLeft: '1 day left' }
                  ].map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold font-sans">{customer.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm font-sans">{customer.name}</div>
                          <div className="text-xs text-gray-500 font-sans">{customer.company}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                customer.status === 'completed' ? 'bg-emerald-500' :
                                customer.status === 'stuck' ? 'bg-red-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${customer.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-700 font-sans">{customer.progress}%</span>
                        </div>
                        <div className={`text-xs font-sans ${
                          customer.status === 'completed' ? 'text-emerald-600' :
                          customer.status === 'stuck' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {customer.timeLeft}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors group">
                    <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 font-sans">Send Reminder</span>
                  </button>
                  <button className="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors group">
                    <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 font-sans">Schedule Call</span>
                  </button>
                </div>
              </div>
            </div>
            
            
            {/* Pulsing notification */}
            <div className="absolute top-1/2 -right-16 bg-white rounded-lg shadow-lg p-3 border-l-4 border-emerald-500 animate-pulse">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                <div className="text-xs text-gray-700 font-sans">Sarah completed setup!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}