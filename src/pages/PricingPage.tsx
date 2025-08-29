import React from 'react';
import { Check, Zap, Building } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    description: 'Perfect for small teams, agencies, consultants',
    price: 29,
    icon: Zap,
    popular: false,
    cta: 'Start 7-Day Free Trial',
    features: [
      'Up to 3 active checklists',
      'Up to 100 customers tracked per month',
      'Shareable public links for each checklist',
      'Simple branding (logo + 1 color)',
      'Progress tracking dashboard',
      'Email completion notifications',
      '7-day free trial'
    ]
  },
  {
    name: 'Pro',
    description: 'For SaaS companies, larger agencies',
    price: 49,
    icon: Building,
    popular: true,
    cta: 'Start 7-Day Free Trial',
    features: [
      'Everything in Basic, plus:',
      'Unlimited checklists',
      'Unlimited customer tracking',
      'Password protection for checklists',
      'Custom completion pages',
      'Redirect to your website when done',
      'Priority support'
    ]
  }
];

export default function PricingPage() {
  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Choose the plan that fits your client load. All plans include a 7-day free trial.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-2xl p-8 border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                plan.popular 
                  ? 'border-emerald-500 ring-4 ring-emerald-500/20' 
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium font-sans">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  plan.popular ? 'bg-emerald-500' : 'bg-gray-100'
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-sans">{plan.name}</h3>
                <p className="text-gray-600 mb-4 font-sans">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900 font-sans">${plan.price}</span>
                  <span className="text-gray-600 ml-2 font-sans">/month</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-sans">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 font-sans ${
                plan.popular
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4 font-sans">
            All plans include a 7-day free trial. No credit card required.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 font-sans">
            <span>✓ Cancel anytime</span>
            <span>✓ 30-day money back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}