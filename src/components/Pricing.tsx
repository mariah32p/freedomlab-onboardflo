import React from 'react';
import { Check, Zap, Building } from 'lucide-react';

import { stripeProducts } from '../stripe-config';
import { Link } from 'react-router-dom';

const planIcons = {
  'Basic': Zap,
  'Pro': Building,
};

// Updated feature lists with realistic limits
const planFeatures = {
  'Basic': [
    'Up to 3 active checklists',
    'Up to 50 customer submissions per month',
    'All 6 step types (checkbox, text, file upload, etc.)',
    'Real-time progress tracking',
    'Basic branding (logo + colors)',
    'Shareable customer links',
    'Email notifications'
  ],
  'Pro': [
    'Unlimited checklists',
    'Unlimited customer submissions',
    'All 6 step types (checkbox, text, file upload, etc.)',
    'Real-time progress tracking',
    'Advanced branding (logo, colors, fonts)',
    'Password-protected checklists',
    'Custom completion pages',
    'Priority support'
  ]
};

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Same powerful tool, different limits. Start with a 7-day free trial on any plan.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {stripeProducts.map((plan, index) => {
            const Icon = planIcons[plan.name as keyof typeof planIcons];
            const isPopular = plan.name === 'Pro';
            const features = planFeatures[plan.name as keyof typeof planFeatures];

            return (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-200 hover:shadow-xl border-2 hover:-translate-y-1 ${
                  isPopular 
                    ? 'border-emerald-500 ring-4 ring-emerald-500/20' 
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium font-sans">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                    isPopular ? 'bg-emerald-500' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${isPopular ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 font-sans">{plan.name}</h3>
                  <p className="text-gray-600 mb-4 font-sans">{plan.description}</p>
                  <div className="mb-6">
                    <div>
                      <span className="text-5xl font-bold text-gray-900 font-sans">${plan.price}</span>
                      <span className="text-gray-600 ml-2 font-sans">/month</span>
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-sans">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-16">
          <Link
            to="/signup"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl font-sans mb-6"
          >
            Start 7-Day Free Trial
          </Link>
          <p className="text-gray-600 mb-4 font-sans">
            7-day free trial • Full access to all features during trial • Cancel anytime
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 font-sans">
            <span>✓ Cancel anytime</span>
            <span>✓ 30-day money back guarantee</span>
            <span>✓ No setup fees</span>
          </div>
        </div>
      </div>
    </section>
  );
}