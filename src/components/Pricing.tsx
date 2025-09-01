import React from 'react';
import { Check, Zap, Building, ArrowRight } from 'lucide-react';

import { stripeProducts } from '../stripe-config';
import { Link } from 'react-router-dom';

const planIcons = {
  'Basic': Zap,
  'Pro': Building,
};

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose your plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start with a 7-day free trial. Choose the plan that fits your business needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {stripeProducts.map((plan, index) => {
            const Icon = planIcons[plan.name as keyof typeof planIcons];
            const planName = plan.name === 'Basic' ? 'Standard' : 'Professional';

            return (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-200 hover:shadow-xl border border-gray-200 hover:border-emerald-300"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 font-sans">{planName}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <div>
                      <span className="text-5xl font-bold text-gray-900 font-sans">${plan.price}</span>
                      <span className="text-gray-600 ml-2 font-sans">/month</span>
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/signup"
                  className="w-full block py-4 rounded-md font-semibold text-lg transition-all duration-200 text-center bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl font-sans"
                  style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  Start 7-Day Free Trial
                </Link>
              </div>
            );
          })}
        </div>
        
        {/* Secondary CTA */}
        <div className="text-center mt-12 space-y-4">
          <Link
            to="/pricing"
            className="inline-flex items-center border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 px-6 py-3 rounded-md font-semibold transition-all duration-200 font-sans"
            style={{ width: '180px', height: '44px', justifyContent: 'center' }}
          >
            View Full Pricing Details
          </Link>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            7-day free trial • Choose your plan after creating your account
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <span>✓ Cancel anytime</span>
            <span>✓ 30-day money back guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}