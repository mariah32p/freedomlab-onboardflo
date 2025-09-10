import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { APP_CONFIG } from '../config/app';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!APP_CONFIG.ENABLE_REAL_AUTH) {
      // Mock mode - simulate authentication
      setLoading(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'PASSWORD_RECOVERY') {
        window.location.replace('/reset-password');
      }
    });

    const initSession = async () => {
      if (window.location.hash.includes('type=recovery')) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          try {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) {
              console.error('Error recovering session from URL:', error);
              setUser(null);
              setSession(null);
              setLoading(false);
            } else {
              window.location.replace('/reset-password');
            }
          } catch (error) {
            console.error('Failed to recover session:', error);
            console.error('This may indicate a Supabase connection issue. Please check your environment variables.');
            setUser(null);
            setSession(null);
            setLoading(false);
          }
        } else {
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      } else {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        } catch (error) {
          console.error('Failed to get session:', error);
          console.error('This may indicate a Supabase connection issue. Please check your environment variables.');
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    };

    initSession();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    try {
      // Always attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      // Clear local state regardless of Supabase response
      setUser(null);
      setSession(null);
      
      // Only return error if it's not a session-related issue
      if (error && !error.message.includes('Session') && !error.message.includes('session')) {
        console.error('Sign out error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      // If anything fails, still clear local state
      setUser(null);
      setSession(null);
      console.error('Sign out failed:', err);
      return { error: null }; // Don't show error to user for sign out
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    return { error };
  };
  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}