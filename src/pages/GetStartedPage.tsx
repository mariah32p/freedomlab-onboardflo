import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useStripe } from '../hooks/useStripe';
import { stripeProducts } from '../stripe-config';

export default function GetStartedPage() {
  const { user } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const { createCheckoutSession, loading, error } = useStripe();
  const navigate = useNavigate();

  // Redirect to signup if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/signup');
      return;
    }

    // If user already has active subscription, redirect to dashboard
    const accessStatus = getAccessStatus();
    if (accessStatus.hasAccess && !accessStatus.shouldRedirectToGetStarted) {
      navigate('/dashboard');
    }
  }, [user, subscription, navigate, getAccessStatus]);

  const handleSelectPlan = async (priceId: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    try {
      await createCheckoutSession(priceId, 'subscription');
    } catch (err) {
      console.error('Failed to create checkout session:', err);
    }
  };

  const planIcons = {
    'Standard': Zap,
    'Pro': Building,
  };

  if (!user) {
    return null; // Will redirect to signup
  }

  // If user has active subscription, will redirect to dashboard
  const accessStatus = getAccessStatus();
  if (accessStatus.hasAccess && !accessStatus.shouldRedirectToGetStarted) {
    return null; // Will redirect to dashboard
  }
  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
            Choose your plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Start your 7-day free trial. Your card will be charged after the trial ends.
          </p>
        </div>
        
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 max-w-4xl mx-auto">
            <p className="text-red-600 text-sm font-sans">{error}</p>
          </div>
        )}
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Standard Plan */}
            {stripeProducts
              .filter(plan => !plan.disabled) // Only show enabled plans
              .map((plan, index) => {
                const Icon = planIcons[plan.name as keyof typeof planIcons];
                return (
                  <div 
                    key={index}
                    className="relative bg-white rounded-2xl p-8 border-2 border-emerald-500 ring-4 ring-emerald-500/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium font-sans">
                        Available Now
                      </div>
                    </div>
                    
                    <div className="text-center mb-8">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-white" />
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
                    
                    <button 
                      onClick={() => handleSelectPlan(plan.priceId)}
                      disabled={loading}
                      className="w-full py-4 rounded-lg font-semibold text-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-sans disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Start 7-Day Free Trial'}
                    </button>
                  </div>
                );
            })}
            
            {/* Pro plan coming soon card */}
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 opacity-60">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Building className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-sans">Pro Plan</h3>
                <p className="text-gray-600 mb-4 font-sans">Advanced features coming soon!</p>
                <div className="mb-6">
                  <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium font-sans inline-block">
                    Coming Soon
                  </div>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600 font-sans">Unlimited checklists</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600 font-sans">Unlimited customer tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600 font-sans">Password protection</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600 font-sans">Custom completion pages</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4 font-sans">
            7-day free trial on Standard plan • Your card will be charged after the trial ends • Pro features coming soon
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 font-sans">
            <span>✓ Cancel anytime</span>
            <span>✓ No setup fees</span>
          </div>
        </div>
      </div>
    </div>
  );
}