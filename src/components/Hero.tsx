import React from 'react';
import { ArrowRight, Shield, Zap, HeadphonesIcon, Users, CheckCircle, Clock, BarChart3 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pt-24 pb-20 overflow-hidden min-h-screen flex items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.2),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Customer Onboarding Platform
            </div>
            
            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Stop the
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Onboarding Chaos
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Replace confusing setup processes and scattered follow-ups with organized onboarding flows and automatic progress tracking that keep your customers engaged.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="group bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <Zap className="mr-2 w-5 h-5" />
                Start 7-Day Free Trial
              </button>
              <button className="group bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center border border-white/20 hover:border-white/30 backdrop-blur-sm">
                View Pricing
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-400" />
                Enterprise Security
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-emerald-400" />
                99.9% Uptime
              </div>
              <div className="flex items-center">
                <HeadphonesIcon className="w-4 h-4 mr-2 text-emerald-400" />
                24/7 Support
              </div>
            </div>
          </div>
          
          {/* Right side - Dashboard mockup */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">O</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Customer Onboarding 2025</h3>
                    <p className="text-sm text-gray-500">SaaS Platform • 12 active flows</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-600 text-sm font-medium">LIVE</span>
                </div>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  + New Flow
                </button>
              </div>
              
              {/* Main content area */}
              <div className="space-y-4">
                {/* Running flow */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-emerald-600 text-sm font-medium">RUNNING</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">2:34 PM</div>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Welcome Flow</h4>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Sarah Johnson</span>
                    <span className="mx-2">•</span>
                    <span>Step 3 of 5</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>60% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  {/* Next steps */}
                  <div className="bg-indigo-900 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-300 text-sm font-medium">#onboarding-team</span>
                      <span className="text-indigo-300 text-sm">2:34 PM</span>
                    </div>
                    <p className="text-sm mb-3">Account Setup - 3 minutes remaining</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                        <span>Next: Team Invitation (2 members)</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-indigo-300" />
                        <span>Sarah Johnson completing setup</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Next up section */}
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-purple-600 text-sm font-medium">NEXT UP</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600">45:00</div>
                      <div className="text-sm text-gray-600">Starts after current</div>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Integration Setup</h4>
                  <p className="text-sm text-gray-600 mb-3">Connect your tools and configure workflows</p>
                  
                  <div className="flex items-center justify-between">
                    <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                      Edit
                    </button>
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Start Now
                    </button>
                  </div>
                </div>
                
                {/* Analytics preview */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900">Flow Analytics</h4>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">15:00</div>
                      <div className="text-sm text-gray-600">Starts at 3:30 PM</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">85%</div>
                      <div className="text-xs text-gray-600">Completion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">2.3m</div>
                      <div className="text-xs text-gray-600">Avg. Time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}