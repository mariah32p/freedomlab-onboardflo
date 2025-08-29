import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { APP_CONFIG } from '../config/app';

export interface SubscriptionData {
  customer_id: string | null;
  subscription_id: string | null;
  price_id: string | null;
  status: string;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean | null;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
  payment_issue_since: string | null;
}

export function useSubscription() {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [user, session]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // First get the customer record
      const { data: customerData, error: customerError } = await supabase
        .from('stripe_customers')
        .select('customer_id')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .maybeSingle();

      if (customerError) {
        throw customerError;
      }

      if (!customerData) {
        // No customer record means no subscription
        setSubscription(null);
        setLoading(false);
        return;
      }

      // Get subscription data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('stripe_subscriptions')
        .select('*')
        .eq('customer_id', customerData.customer_id)
        .is('deleted_at', null)
        .maybeSingle();

      if (subscriptionError) {
        throw subscriptionError;
      }

      setSubscription(subscriptionData);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine if user is in 30-day grace period
  const isInGracePeriod = (): boolean => {
    if (!subscription?.payment_issue_since) return false;
    
    const issueDate = new Date(subscription.payment_issue_since);
    const now = new Date();
    const daysSinceIssue = (now.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceIssue <= 30;
  };

  // Helper function to get trial days remaining
  const getTrialDaysRemaining = (): number => {
    if (!subscription?.current_period_end || subscription.status !== 'trialing') return 0;
    
    const trialEnd = new Date(subscription.current_period_end * 1000);
    const now = new Date();
    const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, daysRemaining);
  };

  // Helper function to determine user's access level
  const getAccessStatus = () => {
    if (!subscription) {
      return { 
        hasAccess: false, 
        shouldRedirectToGetStarted: true,
        showPaymentBanner: false,
        isTrialing: false,
        isPro: false
      };
    }

    const { status } = subscription;
    const inGrace = isInGracePeriod();

    switch (status) {
      case 'trialing':
        return {
          hasAccess: true,
          shouldRedirectToGetStarted: false,
          showPaymentBanner: false,
          isTrialing: true,
          isPro: true // During trial, give full access
        };
      
      case 'active':
        return {
          hasAccess: true,
          shouldRedirectToGetStarted: false,
          showPaymentBanner: false,
          isTrialing: false,
          isPro: subscription.price_id === 'price_0987654321' // Pro price ID
        };
      
      case 'past_due':
        return {
          hasAccess: inGrace,
          shouldRedirectToGetStarted: !inGrace,
          showPaymentBanner: true,
          isTrialing: false,
          isPro: subscription.price_id === 'price_0987654321'
        };
      
      default: // canceled, unpaid, etc.
        return {
          hasAccess: false,
          shouldRedirectToGetStarted: true,
          showPaymentBanner: false,
          isTrialing: false,
          isPro: false
        };
    }
  };

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
    isInGracePeriod,
    getTrialDaysRemaining,
    getAccessStatus,
  };
}