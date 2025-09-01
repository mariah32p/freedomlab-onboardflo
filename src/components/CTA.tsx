import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-600 to-blue-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.2),transparent_50%)]"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-sans">
          Ready to transform your onboarding?
        </h2>
        <p className="text-xl text-blue-100 mb-12 font-sans">
          Join hundreds of companies using OnboardFlo to create seamless customer experiences.
        </p>
        
        {/* CTA buttons */}
        <div className="mb-8">
          <Link 
            to="/signup" 
            className="group bg-white hover:bg-gray-50 text-emerald-600 font-semibold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-sans w-full sm:w-auto sm:inline-flex rounded-md px-8 py-4"
            style={{ 
              minWidth: '200px',
              height: '56px'
            }}
          >
            Start 7-Day Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
        
        <p className="text-blue-200 text-sm font-sans">
          Setup in under 10 minutes • Cancel anytime • No setup fees
        </p>
      </div>
    </section>
  );
}