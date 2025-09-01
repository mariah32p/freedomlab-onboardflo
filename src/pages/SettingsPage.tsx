import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import PaymentBanner from '../components/PaymentBanner';
import TrialBanner from '../components/TrialBanner';

export default function SettingsPage() {
  const { user } = useAuth();
  const { subscription } = useSubscription();

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
                  {subscription?.price_id === 'price_1RzrMYDn6VTzl81bTSgcl0ZA' ? 'Pro' : 'Basic'}
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
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors font-sans">
                  Manage Billing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}