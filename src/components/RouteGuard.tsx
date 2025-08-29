import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subscriptionLoading, getAccessStatus } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while still loading
    if (authLoading || subscriptionLoading) return;

    // Public routes that don't need authentication
    const publicRoutes = ['/', '/pricing', '/signup', '/signin', '/forgot-password'];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    // If not signed in and trying to access protected route
    if (!user && !isPublicRoute) {
      navigate('/signup');
      return;
    }

    // If signed in, check subscription status for protected routes
    if (user && !isPublicRoute) {
      const accessStatus = getAccessStatus();

      // Route logic based on subscription status
      if (location.pathname === '/get-started') {
        // If user has active subscription, redirect to dashboard
        if (accessStatus.hasAccess && !accessStatus.shouldRedirectToGetStarted) {
          navigate('/dashboard');
        }
      } else if (location.pathname === '/dashboard') {
        // If user should be redirected to get started
        if (accessStatus.shouldRedirectToGetStarted) {
          navigate('/get-started');
        }
      } else if (location.pathname === '/reset-password') {
        // Allow reset password page regardless of subscription status
        return;
      }
    }
  }, [user, subscription, authLoading, subscriptionLoading, location.pathname, navigate, getAccessStatus]);

  // Show loading while checking auth/subscription
  if (authLoading || (user && subscriptionLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}