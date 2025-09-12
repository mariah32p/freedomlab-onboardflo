import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import PaymentBanner from '../components/PaymentBanner';
import TrialBanner from '../components/TrialBanner';
import SettingsSkeleton from '../components/SettingsSkeleton';
import { supabase } from '../lib/supabase';

export default function SettingsPage() {
  const { user } = useAuth();
  // Use a single subscription hook instance to avoid inconsistent state
  const { subscription, loading, getAccessStatus } = useSubscription();
  const navigate = useNavigate();
  const [portalLoading, setPortalLoading] = useState(false);

  const accessStatus = getAccessStatus();

  // Redirect to dashboard if no active subscription
  React.useEffect(() => {
    if (!loading && accessStatus.shouldRedirectToGetStarted) {
      navigate('/get-started');
    }
  }, [accessStatus, navigate, loading]);

  const handleManageBilling = async () => {
    if (!user || !subscription) return;
    
    setPortalLoading(true);
    
    try {
      // Get current session for authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        alert('Please sign in again to access billing portal');
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-portal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          return_url: `${window.location.origin}/settings`
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session');
      }

      // Open the portal in the same tab
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Error opening billing portal:', err);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  // Show skeleton while loading
  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial Banner */}
        <TrialBanner />
        
        {/* Payment Issue Banner */}
        <PaymentBanner />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Settings</h1>
          <p className="text-gray-600 font-sans">
            Manage your account and subscription settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 font-sans">Account</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Email</label>
                <div className="text-gray-900 font-sans">{user?.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Plan</label>
                <div className="text-gray-900 font-sans">
                  {!subscription ? 'Basic' : 
                   subscription.price_id === import.meta.env.VITE_STRIPE_PRO_PRICE_ID ? 'Pro' : 'Standard'}
                  {subscription?.status === 'trialing' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium font-sans">
                      Trial
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 font-sans">Subscription</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 font-sans">Manage Subscription</div>
                  <div className="text-sm text-gray-600 font-sans">Update payment method, view invoices, or cancel subscription</div>
                </div>
                <button 
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors font-sans disabled:opacity-50"
                >
                  {portalLoading ? 'Loading...' : 'Manage Billing'}
                </button>
              </div>
              <div className="text-sm text-gray-500 font-sans mt-2">
                Opens Stripe's billing portal where you can update payment methods, view invoices, and manage your subscription.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}