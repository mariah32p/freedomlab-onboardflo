import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { APP_CONFIG } from '../config/app';

export function useStripe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const createCheckoutSession = async (priceId: string, mode: 'payment' | 'subscription' = 'subscription') => {
    if (!session) {
      throw new Error('User must be authenticated');
    }

    if (!APP_CONFIG.ENABLE_REAL_AUTH) {
      // Mock mode - simulate checkout process
      setLoading(true);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to success page
      window.location.href = `${window.location.origin}/dashboard?success=true&demo=true`;
      return { sessionId: 'mock-session-id', url: null };
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: priceId,
          mode,
          success_url: `${window.location.origin}/dashboard?success=true`,
          cancel_url: `${window.location.origin}/pricing?canceled=true`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckoutSession,
    loading,
    error,
  };
}