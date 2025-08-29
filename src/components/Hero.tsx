import React from 'react';
import { ArrowRight, Play, Users, Clock, CheckCircle, BarChart3 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-medium mb-8">
              Customer Onboarding Platform
            </div>
            
            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight font-sans">
              Stop the
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Onboarding Chaos
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-lg font-sans">
              Replace chaotic customer setups with organized flow management and automatic progress tracking that keeps your team informed.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="group bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-sans">
                Start 7-Day Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center border border-white/20 hover:border-white/30 backdrop-blur-sm font-sans">
                View Pricing
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap gap-8 text-sm text-gray-400 font-sans">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                Enterprise Security
              </span>
              <span className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-emerald-400" />
                99.9% Uptime
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-emerald-400" />
                24/7 Support
              </span>
            </div>
          </div>
          
          {/* Right side - Dashboard Mockup */}
          <div className="relative">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 font-sans">Client Project Setup</h3>
                    <p className="text-sm text-gray-500 font-sans">New Client Checklist • TechCorp Website</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium font-sans">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    IN PROGRESS
                  </div>
                  <button className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors font-sans">
                    Send Reminder
                  </button>
                </div>
              </div>
              
              {/* Client Info Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-blue-700 font-sans">CLIENT INFO</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 font-sans">Started Jan 15</div>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2 font-sans">TechCorp Website Redesign</h4>
                <div className="flex items-center text-sm text-gray-600 mb-3 font-sans">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Sarah Chen</span>
                  <span className="mx-2">•</span>
                  <span>sarah@techcorp.com</span>
                </div>
                
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1 font-sans">
                    <span className="text-gray-600">Checklist Progress</span>
                    <span className="font-medium text-emerald-600">7 of 12 completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                </div>
                
                {/* Checklist Items */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700 font-sans">Brand guidelines & logo files</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700 font-sans">Content & copy provided</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                    <span className="text-gray-500 font-sans">High-res product images</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                    <span className="text-gray-500 font-sans">Domain & hosting details</span>
                  </div>
                </div>
              </div>
              
              {/* Next Steps */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-orange-700 font-sans">PENDING</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-orange-600 font-sans">5 items</div>
                    <div className="text-xs text-gray-500 font-sans">Awaiting client</div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-1 font-sans">Wireframe Approval</h4>
                <p className="text-sm text-gray-600 mb-3 font-sans">Review & approve initial layouts</p>
                
                <div className="flex justify-between items-center">
                  <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors font-sans">
                    View Details
                  </button>
                  <button className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors font-sans">
                    Send Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}