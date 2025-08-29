import React from 'react';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-emerald-50 pt-24 pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            Transform your customer onboarding today
          </div>
          
          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Customer onboarding
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              made simple
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Turn chaotic setups into smooth, trackable flows with visual progress tracking, 
            automated reminders, and team collaboration that reduces churn and support tickets.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
          </div>
          
          {/* Social proof */}
          <div className="text-sm text-gray-500 mb-12">
            Trusted by 500+ companies to onboard their customers
          </div>
          
          {/* Hero image/dashboard preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl overflow-hidden">
                {/* Mock dashboard header */}
                <div className="bg-white/10 backdrop-blur-sm p-4 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                      <div className="text-white font-medium">Customer Onboarding Dashboard</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white/80 text-sm">Live</span>
                    </div>
                  </div>
                </div>
                
                {/* Mock dashboard content */}
                <div className="p-8 h-80 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">85% Completion Rate</h3>
                    <p className="text-emerald-100 text-lg mb-6">Your onboarding flows are performing great!</p>
                    
                    {/* Progress indicators */}
                    <div className="flex justify-center space-x-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                          <span className="text-sm font-bold">1</span>
                        </div>
                        <div className="w-16 h-1 bg-white/40 rounded-full"></div>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                          <span className="text-sm font-bold">2</span>
                        </div>
                        <div className="w-16 h-1 bg-white/40 rounded-full"></div>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mb-2">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="w-16 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-teal-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}