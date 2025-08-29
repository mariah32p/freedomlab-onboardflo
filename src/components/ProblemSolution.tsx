import React from 'react';
import { X, ArrowRight, CheckCircle } from 'lucide-react';

export default function ProblemSolution() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Stop losing customers during onboarding
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Most companies lose 40-60% of new customers during the first week. 
            OnboardFlo changes that with structured, engaging onboarding flows.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Problem side */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center justify-center lg:justify-start">
                <X className="w-8 h-8 mr-3" />
                Without OnboardFlo
              </h3>
            </div>
            
            <div className="space-y-4">
              {[
                'Customers get lost in complex setup processes',
                'No visibility into where users drop off',
                'Manual follow-ups that often get forgotten',
                'Support team overwhelmed with basic questions',
                'High churn rates in the first 30 days',
                'Inconsistent onboarding experiences'
              ].map((problem, index) => (
                <div key={index} className="flex items-start">
                  <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">{problem}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Solution side */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center justify-center lg:justify-start">
                <CheckCircle className="w-8 h-8 mr-3" />
                With OnboardFlo
              </h3>
            </div>
            
            <div className="space-y-4">
              {[
                'Clear, visual progress tracking guides users',
                'Real-time analytics show exactly where to improve',
                'Automated, personalized reminders keep users engaged',
                'Self-service resources reduce support burden',
                'Proven flows that increase completion rates by 3x',
                'Consistent, branded experience every time'
              ].map((solution, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <button className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            See OnboardFlo in Action
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}