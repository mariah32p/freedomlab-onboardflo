import React from 'react';
import { Check, Zap, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStripe } from '../hooks/useStripe';
import { stripeProducts } from '../stripe-config';
import { Link } from 'react-router-dom';

const planIcons = {
  'Basic': Zap,
  'Pro': Building,
};

export default function PricingPage() {
  const { user } = useAuth();
  const { createCheckoutSession, loading, error } = useStripe();

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      // Redirect to sign up if not authenticated
      window.location.href = '/get-started';
      return;
    }

    try {
      await createCheckoutSession(priceId, 'subscription');
    } catch (err) {
      console.error('Failed to create checkout session:', err);
    }
  };

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
        
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 max-w-4xl mx-auto">
            <p className="text-red-600 text-sm font-sans">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {stripeProducts.map((plan, index) => {
            const Icon = planIcons[plan.name as keyof typeof planIcons];
            const isPopular = plan.name === 'Pro';
            return (
              <div 
                key={index}
                className={`relative bg-white rounded-2xl p-8 border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
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
                
                <div className="text-center mb-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                    isPopular ? 'bg-emerald-500' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${isPopular ? 'text-white' : 'text-gray-600'}`} />
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
                
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4 font-sans">
            All plans include a 7-day free trial • Choose your plan after creating your account
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