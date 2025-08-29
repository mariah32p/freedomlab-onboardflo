import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle, Users, TrendingUp, Clock } from 'lucide-react';

export default function Hero() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-blue-50/30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-left">
            <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6 font-sans">
              <CheckCircle className="w-4 h-4 mr-2" />
              Trusted by 500+ companies
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight font-sans">
              Customer onboarding
              <span className="text-emerald-600"> made simple</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed font-sans">
              Create beautiful, trackable onboarding checklists that guide your customers 
              to success and reduce support tickets by 60%.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-gray-700 font-medium font-sans">85% completion rate</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-gray-700 font-medium font-sans">5-min setup</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-gray-700 font-medium font-sans">500+ customers</span>
              </div>
            </div>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                to="/get-started" 
                className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-sans"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md font-sans">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </div>
            
            <p className="text-gray-500 text-sm font-sans">
              ✓ No credit card required • ✓ 7-day free trial • ✓ Setup in 5 minutes
            </p>
          </div>
          
          {/* Right side - Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              {/* Mock checklist interface */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 font-sans">Customer Setup Checklist</h3>
                <div className="text-sm text-emerald-600 font-medium bg-emerald-100 px-3 py-1 rounded-full font-sans">
                  3 of 5 complete
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { text: 'Create account', completed: true },
                  { text: 'Verify email address', completed: true },
                  { text: 'Complete profile setup', completed: true },
                  { text: 'Connect integrations', completed: false },
                  { text: 'Schedule onboarding call', completed: false }
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                      item.completed 
                        ? 'bg-emerald-500 text-white' 
                        : 'border-2 border-gray-300'
                    }`}>
                      {item.completed && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span className={`font-medium font-sans ${
                      item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-sans">Progress</span>
                  <span className="text-emerald-600 font-medium font-sans">60% complete</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-3/5 transition-all duration-300"></div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-3 rounded-lg shadow-lg">
              <div className="text-xs font-medium font-sans">+60% completion</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg">
              <div className="text-xs font-medium font-sans">-40% support tickets</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}