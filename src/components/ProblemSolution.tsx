import React from 'react';
import { X, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';

export default function ProblemSolution() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
            Stop losing customers during onboarding
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Most companies lose 40-60% of new customers during setup. 
            OnboardFlo fixes that with clear, trackable onboarding flows.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Problem side */}
          <div className="bg-white rounded-2xl p-8 border border-red-100 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-2 font-sans">
                Without OnboardFlo
              </h3>
            </div>
            
            <div className="space-y-4">
              {[
                'Customers get lost in setup',
                'No visibility into drop-off points',
                'Manual follow-ups get forgotten',
                'Support overwhelmed with basic questions'
              ].map((problem, index) => (
                <div key={index} className="flex items-start">
                  <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700 font-sans">{problem}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1 font-sans">60%</div>
                <div className="text-sm text-red-600 font-medium font-sans">Customer Drop-off Rate</div>
              </div>
            </div>
          </div>
          
          {/* Solution side */}
          <div className="bg-white rounded-2xl p-8 border border-emerald-100 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-600 mb-2 font-sans">
                With OnboardFlo
              </h3>
            </div>
            
            <div className="space-y-4">
              {[
                'Visual progress guides users',
                'See exactly where to improve',
                'Automated reminders keep users engaged',
                'Self-service reduces support tickets'
              ].map((solution, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700 font-sans">{solution}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-1 font-sans">85%</div>
                <div className="text-sm text-emerald-600 font-medium font-sans">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}