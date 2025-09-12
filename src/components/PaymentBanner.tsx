import React from 'react';
import { AlertTriangle, CreditCard } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

export default function PaymentBanner() {
  const { subscription, isInGracePeriod, loading } = useSubscription();

  // Don't render anything while loading to prevent flash
  if (loading) {
    return null;
  }

  if (!subscription || subscription.status !== 'past_due' || !isInGracePeriod()) {
    return null;
  }

  const issueDate = subscription.payment_issue_since ? new Date(subscription.payment_issue_since) : new Date();
  const gracePeriodEnd = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((gracePeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handleUpdatePayment = () => {
    // This would open the Stripe Customer Portal
    // For now, we'll just show an alert
    alert('This would open the Stripe Customer Portal to update payment method');
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-orange-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-orange-700 font-sans">
            <strong>Payment Issue:</strong> We couldn't process your payment. 
            You have {daysLeft} days remaining to update your payment method before your account is suspended.
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleUpdatePayment}
            className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center font-sans"
          >
            <CreditCard className="w-4 h-4 mr-1" />
            Update Payment
          </button>
        </div>
      </div>
    </div>
  );
}