import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStripe } from '../hooks/useStripe';
import { stripeProducts } from '../stripe-config';

export default function GetStartedPage() {
  const { user } = useAuth();
  const { createCheckoutSession, loading, error } = useStripe();
  const navigate = useNavigate();

  // Redirect to signup if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/signup');
    }
  }, [user, navigate]);

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
    'Basic': Zap,
    'Pro': Building,
  };

  if (!user) {
    return null; // Will redirect to signup
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
                
                <button 
                  onClick={() => handleSelectPlan(plan.priceId)}
                  disabled={loading}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 font-sans ${
                  isPopular
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                } disabled:opacity-50`}>
                  {loading ? 'Loading...' : 'Start 7-Day Free Trial'}
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4 font-sans">
            7-day free trial • Your card will be charged after the trial ends
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

          {/* Terms */}
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 font-sans">
              I agree to the{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-500 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-500 font-medium">
                Privacy Policy
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors font-sans"
            >
              {loading ? 'Creating account...' : 'Start 7-Day Free Trial'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 font-sans">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-emerald-600 hover:text-emerald-500 font-sans">
                Sign in
              </Link>
            </p>
          </div>
        </form>

        {/* Trust indicators */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-sans">
            ✓ Cancel anytime • ✓ Setup in 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
}