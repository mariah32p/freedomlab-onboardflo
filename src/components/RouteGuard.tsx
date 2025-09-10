import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while still loading auth
    if (loading) return;

    // Public routes that don't need authentication
    const publicRoutes = ['/pricing', '/signup', '/signin', '/forgot-password', '/demo'];
    const isPublicRoute = publicRoutes.includes(location.pathname);
    
    // Public checklist routes (no auth required)
    const isPublicChecklistRoute = location.pathname.startsWith('/c/');

    // Handle landing page - redirect authenticated users to dashboard
    if (location.pathname === '/' && user) {
      navigate('/dashboard');
      return;
    }

    // If not signed in and trying to access protected route
    if (!user && !isPublicRoute && !isPublicChecklistRoute && location.pathname !== '/') {
      navigate('/signin');
      return;
    }
  }, [user, loading, location.pathname, navigate]);

  // Show loading while checking auth
  if (loading) {
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