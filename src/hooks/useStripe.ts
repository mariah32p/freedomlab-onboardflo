import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { APP_CONFIG } from '../config/app';

export function useStripe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const createCheckoutSession = async (priceId: string, mode: 'payment' | 'subscription' = 'subscription') => {
    console.log('=== STRIPE CHECKOUT DEBUG ===');
    console.log('Creating checkout session with priceId:', priceId);
    console.log('Mode:', mode);
    
    // Get fresh session to ensure token is current
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    console.log('Current session exists:', !!currentSession);
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    
    if (!currentSession) {
      throw new Error('User must be authenticated');
    }
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`;
      console.log('Making request to:', apiUrl);
      
      const requestBody = {
        price_id: priceId,
        mode,
        success_url: `${window.location.origin}/dashboard?success=true`,
        cancel_url: `${window.location.origin}/pricing?canceled=true`,
      };
      console.log('Request body:', requestBody);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentSession.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Checkout session creation failed:', data);
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        window.open(data.url, '_blank', 'noopener,noreferrer');
      } else {
        console.error('No checkout URL received from server');
        throw new Error('No checkout URL received');
      }

      return data;
    } catch (err) {
      console.error('=== STRIPE CHECKOUT ERROR ===');
      console.error('Error details:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Final error message:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
      console.log('=== END STRIPE CHECKOUT DEBUG ===');
    }
  };

  return {
    createCheckoutSession,
    loading,
    error,
  };
}