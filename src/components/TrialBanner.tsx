import React from 'react';
import { Clock } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { Link } from 'react-router-dom';

export default function TrialBanner() {
  const { subscription, getTrialDaysRemaining, loading } = useSubscription();

  // Don't render anything while loading to prevent flash
  if (loading) {
    return null;
  }

  if (!subscription || subscription.status !== 'trialing') {
    return null;
  }

  const daysRemaining = getTrialDaysRemaining();
  const chargeDate = subscription.current_period_end 
    ? new Date(subscription.current_period_end * 1000).toLocaleDateString()
    : 'Unknown';

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Clock className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-blue-700 font-sans">
            <strong>Trial ends in {daysRemaining} days.</strong> Your card will be charged on {chargeDate}.{' '}
            <Link to="/settings" className="underline hover:no-underline font-medium">
              Manage in Settings
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}