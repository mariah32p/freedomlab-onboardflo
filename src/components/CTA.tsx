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
          Ready to fix your onboarding?
        </h2>
        <p className="text-xl text-blue-100 mb-12 font-sans">
          Start your 7-day free trial and see the difference organized onboarding makes.
        </p>
        
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button className="group bg-white hover:bg-gray-50 text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-sans">
            <Zap className="mr-2 w-5 h-5" />
            Start 7-Day Free Trial
          </button>
          <Link 
            to="/pricing" 
            className="group bg-emerald-500/20 hover:bg-emerald-500/30 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center border border-emerald-400/30 hover:border-emerald-400/50 font-sans"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            View Pricing
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <p className="text-blue-200 text-sm font-sans">
          No credit card required • Setup in under 5 minutes • Cancel anytime
        </p>
      </div>
    </section>
  );
}