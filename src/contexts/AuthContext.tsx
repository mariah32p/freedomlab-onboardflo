import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
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

    // Real mode - use Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    if (!APP_CONFIG.ENABLE_REAL_AUTH) {
      // Mock mode - simulate successful signup
      const mockUser = { ...APP_CONFIG.DEMO_USER, email } as User;
      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      return { error: null };
    }

    // Real mode - use Supabase
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
    if (!APP_CONFIG.ENABLE_REAL_AUTH) {
      // Mock mode - simulate successful signin
      const mockUser = { ...APP_CONFIG.DEMO_USER, email } as User;
      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      return { error: null };
    }

    // Real mode - use Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    if (!APP_CONFIG.ENABLE_REAL_AUTH) {
      // Mock mode - simulate signout
      setUser(null);
      setSession(null);
      return { error: null };
    }

    // Real mode - use Supabase
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    if (!APP_CONFIG.ENABLE_REAL_AUTH) {
      // Mock mode - simulate password reset
      return { error: null };
    }

    // Real mode - use Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const resetPassword = async (password: string) => {
    if (!APP_CONFIG.ENABLE_REAL_AUTH) {
      // Mock mode - simulate password update
      return { error: null };
    }

    // Real mode - use Supabase
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