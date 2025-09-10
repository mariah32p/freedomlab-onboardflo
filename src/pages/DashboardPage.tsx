import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useStripe } from '../hooks/useStripe';
import PaymentBanner from '../components/PaymentBanner';
import TrialBanner from '../components/TrialBanner';
import { stripeProducts } from '../stripe-config';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  Send,
  Zap,
  Building,
  ArrowRight,
  Check,
  CreditCard
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const { createCheckoutSession, loading: stripeLoading, error: stripeError } = useStripe();
  const urlParams = new URLSearchParams(window.location.search);
  const isSuccess = urlParams.get('success') === 'true';
  const accessStatus = getAccessStatus();

  const handleSelectPlan = async (priceId: string) => {
    try {
      await createCheckoutSession(priceId, 'subscription');
    } catch (err) {
      console.error('Failed to create checkout session:', err);
    }
  };

  const handleUpdatePayment = () => {
    // This would open the Stripe Customer Portal
    alert('This would open the Stripe Customer Portal to update payment method');
  };

  // Show trial CTA if no subscription
  if (!subscription) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
              Start your free trial
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              Choose your plan to begin creating customer onboarding checklists. 
              Your 7-day trial includes full access to all features.
            </p>
          </div>
          
          {stripeError && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 max-w-4xl mx-auto">
              <p className="text-red-600 text-sm font-sans">{stripeError}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {stripeProducts
              .filter(plan => !plan.disabled)
              .map((plan, index) => {
                const Icon = plan.name === 'Standard' ? Zap : Building;
                return (
                  <div 
                    key={index}
                    className="relative bg-white rounded-2xl p-8 border-2 border-emerald-500 ring-4 ring-emerald-500/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium font-sans">
                        7-Day Free Trial
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
                      disabled={stripeLoading}
                      className="w-full py-4 rounded-lg font-semibold text-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-sans disabled:opacity-50"
                    >
                      {stripeLoading ? 'Loading...' : 'Start 7-Day Free Trial'}
                    </button>
                  </div>
                );
              })}
            
            {/* Pro plan coming soon card */}
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 opacity-60">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium font-sans">
                  Coming Soon
                </div>
              </div>
              
              <div className="text-center mb-8">
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
              </div>
              
              <ul className="space-y-4 mb-8">
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
              
              <div className="w-full py-4 rounded-lg font-semibold text-lg text-center bg-gray-200 text-gray-500 cursor-not-allowed">
                Coming Soon
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4 font-sans">
              7-day free trial on Standard plan • Pro features coming soon • Cancel anytime
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 font-sans">
              <span>✓ Cancel anytime</span>
              <span>✓ No setup fees</span>
              <span>✓ Full access during trial</span>
              <span>✓ Full access during trial</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show reactivation CTA for inactive subscriptions
  if (subscription.status === 'canceled' || subscription.status === 'past_due') {
    const isPastDue = subscription.status === 'past_due';
    
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-sans">
              {isPastDue ? 'Payment Issue' : 'Subscription Canceled'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
              {isPastDue 
                ? 'We couldn\'t process your payment. Update your payment method to continue using OnboardFlo.'
                : 'Your subscription has been canceled. Reactivate to continue using OnboardFlo.'
              }
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
            <div className="text-center space-y-6">
              {isPastDue ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 font-sans">Update Payment Method</h3>
                  <p className="text-gray-600 font-sans">
                    Your subscription is still active. Simply update your payment method to continue.
                  </p>
                  <button
                    onClick={handleUpdatePayment}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center mx-auto font-sans"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Update Payment Method
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 font-sans">Choose a New Plan</h3>
                  <p className="text-gray-600 font-sans">
                    Select a plan to reactivate your OnboardFlo account and regain access to your checklists.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stripeProducts
                      .filter(plan => !plan.disabled)
                      .map((plan, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectPlan(plan.priceId)}
                          disabled={stripeLoading}
                          className="p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left disabled:opacity-50"
                        >
                          <h4 className="text-lg font-bold text-gray-900 mb-2 font-sans">{plan.name}</h4>
                          <p className="text-3xl font-bold text-gray-900 mb-2 font-sans">${plan.price}<span className="text-base text-gray-600">/mo</span></p>
                          <p className="text-sm text-gray-600 font-sans">{plan.description}</p>
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show full dashboard for active/trialing subscriptions
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial Banner */}
        <TrialBanner />
        
        {/* Payment Issue Banner */}
        <PaymentBanner />
        
        {/* Success message */}
        {isSuccess && (
          <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-emerald-800 font-sans">Welcome to OnboardFlo!</h3>
                <p className="text-emerald-700 font-sans">
                  Your trial has started! You have full access to all features.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Dashboard</h1>
          <p className="text-gray-600 font-sans">
            Overview of your onboarding performance
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900 font-sans">247</div>
                  <div className="text-sm text-gray-600 font-sans">Active Customers</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900 font-sans">87%</div>
                  <div className="text-sm text-gray-600 font-sans">Completion Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900 font-sans">2.3</div>
                  <div className="text-sm text-gray-600 font-sans">Avg Days</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900 font-sans">12</div>
                  <div className="text-sm text-gray-600 font-sans">Need Help</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 font-sans">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { user: 'Sarah M.', action: 'completed setup', time: '2 min ago', type: 'success' },
                  { user: 'Mike R.', action: 'started onboarding', time: '15 min ago', type: 'info' },
                  { user: 'Lisa K.', action: 'needs assistance', time: '1 hour ago', type: 'warning' },
                  { user: 'David L.', action: 'completed step 3', time: '2 hours ago', type: 'success' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                      activity.type === 'success' ? 'bg-emerald-500' :
                      activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-sans">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 font-sans">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}