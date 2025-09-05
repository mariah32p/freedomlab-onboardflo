import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { CustomerSession, SessionProgress } from '../types/checklist';
import { useCallback } from 'react';
import { useSecureText } from './useSecureText';

interface UseSessionProgressProps {
  checklistId: string;
  sessionToken: string;
}

export function useSessionProgress({ checklistId, sessionToken }: UseSessionProgressProps) {
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [progress, setProgress] = useState<SessionProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otherActiveUsers, setOtherActiveUsers] = useState<CustomerSession[]>([]);
  const [showConcurrentEditNotification, setShowConcurrentEditNotification] = useState(false);
  
  const activityInterval = useRef<NodeJS.Timeout | null>(null);
  const realtimeChannel = useRef<any>(null);
  
  const { getSecureText } = useSecureText(session?.id || '');

  useEffect(() => {
    if (checklistId && sessionToken) {
      initializeSession();
      setupRealtimeSubscription();
      startActivityHeartbeat();
    }

    return () => {
      cleanup();
    };
  }, [checklistId, sessionToken]);

  const cleanup = () => {
    if (activityInterval.current) {
      clearInterval(activityInterval.current);
    }
    if (realtimeChannel.current) {
      supabase.removeChannel(realtimeChannel.current);
    }
    // Mark session as inactive when leaving
    if (session) {
      updateSessionActivity(false);
    }
  };

  const initializeSession = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to find existing session
      const { data: existingSession, error: sessionError } = await supabase
        .from('customer_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .eq('checklist_id', checklistId)
        .maybeSingle();

      if (sessionError && sessionError.code !== 'PGRST116') {
        throw sessionError;
      }

      if (existingSession) {
        setSession(existingSession);
        await loadProgress(existingSession.id);
        await updateSessionActivity(true);
      } else {
        setSession(null);
      }

      await loadOtherActiveSessions();
    } catch (err) {
      console.error('Error initializing session:', err);
      setError('Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (customerData: { email: string; name: string; company: string }) => {
    try {
      setError(null);

      const { data: newSession, error: createError } = await supabase
        .from('customer_sessions')
        .update({
          email: customerData.email,
          company: customerData.company,
          submission_status: 'started',
          started_at: new Date().toISOString(),
          is_active: true
        })
        .eq('session_token', sessionToken)
        .eq('checklist_id', checklistId)
        .select()
        .single();

      if (createError) throw createError;

      setSession(newSession);
      return newSession;
    } catch (err) {
      console.error('Error creating session:', err);
      setError('Failed to create session');
      return null;
    }
  };

  const loadProgress = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('session_progress')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setProgress(data || []);
    } catch (err) {
      console.error('Error loading progress:', err);
      setError('Failed to load progress');
    }
  };

  // Immediate save - no debouncing
  const saveStepProgress = useCallback(async (stepId: string, notes: string = '') => {
    if (!session) return false;

    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('session_progress')
        .upsert({
          session_id: session.id,
          step_id: stepId,
          notes,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'session_id,step_id'
        });

      if (error) throw error;

      // Update local state immediately
      setProgress(prev => {
        const existing = prev.find(p => p.step_id === stepId);
        if (existing) {
          return prev.map(p =>
            p.step_id === stepId
              ? { ...p, notes, completed_at: new Date().toISOString() }
              : p
          );
        } else {
          return [...prev, {
            id: crypto.randomUUID(),
            session_id: session.id,
            step_id: stepId,
            notes,
            completed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          }];
        }
      });

      await updateSessionActivity(true);
      return true;
    } catch (err) {
      console.error('Error saving step progress:', err);
      setError('Failed to save progress');
      return false;
    } finally {
      setSaving(false);
    }
  }, [session]);

  const removeStepProgress = useCallback(async (stepId: string) => {
    if (!session) return false;

    try {
      const { error } = await supabase
        .from('session_progress')
        .delete()
        .eq('session_id', session.id)
        .eq('step_id', stepId);

      if (error) throw error;

      // Update local state
      setProgress(prev => prev.filter(p => p.step_id !== stepId));
      await updateSessionActivity(true);
      return true;
    } catch (err) {
      console.error('Error removing step progress:', err);
      return false;
    }
  }, [session]);

  const completeSession = async () => {
    if (!session) return false;

    try {
      const { error } = await supabase
        .from('customer_sessions')
        .update({
          completed_at: new Date().toISOString(),
          last_activity: new Date().toISOString(),
          is_active: false,
          submission_status: 'completed',
        })
        .eq('id', session.id);

      if (error) throw error;

      setSession(prev => prev ? {
        ...prev,
        completed_at: new Date().toISOString(),
        is_active: false,
        submission_status: 'completed',
      } : null);

      return true;
    } catch (err) {
      console.error('Error completing session:', err);
      setError('Failed to complete session');
      return false;
    }
  };

  const updateSessionActivity = async (isActive: boolean = true) => {
    if (!session) return;

    try {
      await supabase
        .from('customer_sessions')
        .update({
          last_activity: new Date().toISOString(),
          is_active: isActive,
        })
        .eq('id', session.id);
    } catch (err) {
      console.error('Error updating session activity:', err);
    }
  };

  const loadOtherActiveSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_sessions')
        .select('*')
        .eq('checklist_id', checklistId)
        .eq('is_active', true)
        .neq('session_token', sessionToken)
        .gte('last_activity', new Date(Date.now() - 5 * 60 * 1000).toISOString());

      if (error) throw error;

      setOtherActiveUsers(data || []);
    } catch (err) {
      console.error('Error loading other active sessions:', err);
    }
  };

  const setupRealtimeSubscription = () => {
    realtimeChannel.current = supabase
      .channel(`checklist-${checklistId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customer_sessions',
          filter: `checklist_id=eq.${checklistId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const updatedSession = payload.new as CustomerSession;
            
            if (updatedSession.session_token !== sessionToken && updatedSession.is_active) {
              setOtherActiveUsers(prev => {
                const existing = prev.find(s => s.id === updatedSession.id);
                if (existing) {
                  return prev.map(s => s.id === updatedSession.id ? updatedSession : s);
                } else {
                  setShowConcurrentEditNotification(true);
                  setTimeout(() => setShowConcurrentEditNotification(false), 5000);
                  return [...prev, updatedSession];
                }
              });
            }
          }
          
          if (payload.eventType === 'DELETE' || 
              (payload.eventType === 'UPDATE' && !payload.new.is_active)) {
            setOtherActiveUsers(prev => prev.filter(s => s.id !== payload.old?.id));
          }
        }
      )
      .subscribe();
  };

  const startActivityHeartbeat = () => {
    activityInterval.current = setInterval(() => {
      if (session && document.visibilityState === 'visible' && document.hasFocus()) {
        updateSessionActivity(true);
      }
    }, 30000);
  };

  const getStepProgress = (stepId: string) => {
    return progress.find(p => p.step_id === stepId);
  };

  const isStepCompleted = (stepId: string) => {
    return progress.some(p => p.step_id === stepId);
  };

  const getCompletionPercentage = (totalSteps: number) => {
    if (totalSteps === 0) return 0;
    return Math.round((progress.length / totalSteps) * 100);
  };

  return {
    session,
    progress,
    loading,
    saving,
    error,
    otherActiveUsers,
    showConcurrentEditNotification,
    createSession,
    saveStepProgress,
    removeStepProgress,
    completeSession,
    getStepProgress,
    isStepCompleted,
    getCompletionPercentage,
    getSecureText,
    updateSessionInfo: async (customerData: { email: string; name: string; company: string }) => {
      if (!session) return false;
      
      try {
        const { error } = await supabase
          .from('customer_sessions')
          .update({
            email: customerData.email,
            company: customerData.company,
            last_activity: new Date().toISOString(),
          })
          .eq('id', session.id);

        if (error) throw error;

        setSession(prev => prev ? { ...prev, ...customerData } : null);
        return true;
      } catch (err) {
        console.error('Error updating session info:', err);
        return false;
      }
    },
  };
}