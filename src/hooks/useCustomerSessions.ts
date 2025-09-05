import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CustomerSession } from '../types/checklist';

export function useCustomerSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<CustomerSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get all sessions for user's checklists
      const { data, error: fetchError } = await supabase
        .from('customer_sessions')
        .select(`
          *,
          checklists!inner(
            id,
            title,
            user_id
          )
        `)
        .eq('checklists.user_id', user.id)
        .order('link_created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setSessions(data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('customer_sessions')
        .delete()
        .eq('id', sessionId);

      if (deleteError) throw deleteError;

      // Remove from local state
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      return true;
    } catch (err) {
      console.error('Error deleting session:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete session');
      return false;
    }
  };

  const getSessionProgress = async (sessionId: string) => {
    // Validate sessionId before making the query
    if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
      console.warn('Invalid sessionId provided to getSessionProgress');
      return [];
    }

    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.error('Supabase environment variables are missing. Please check your .env file.');
        console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
        return [];
      }

      const { data, error } = await supabase
        .from('session_progress')
        .select('*')
        .eq('session_id', sessionId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching session progress:', err);
      
      // Provide specific guidance for different error types
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        console.error('=== SUPABASE CONNECTION ERROR ===');
        console.error('This usually means:');
        console.error('1. Missing or incorrect environment variables in .env file');
        console.error('2. Supabase project URL is incorrect');
        console.error('3. CORS settings in Supabase don\'t allow localhost:5173');
        console.error('4. Supabase project is paused or deleted');
        console.error('');
        console.error('To fix:');
        console.error('1. Check your .env file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
        console.error('2. Restart the dev server after updating .env');
        console.error('3. Check Supabase project settings -> API -> CORS origins includes localhost:5173');
      }
      
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  };

  const getSessionStats = () => {
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.submission_status === 'completed').length;
    const activeSessions = sessions.filter(s => s.submission_status === 'started').length;
    const pendingSessions = sessions.filter(s => s.submission_status === 'pending').length;
    const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    return {
      totalSessions,
      completedSessions,
      activeSessions,
      pendingSessions,
      completionRate,
    };
  };

  const createPendingSubmission = async (checklistId: string, linkName: string = ''): Promise<string | null> => {
    if (!user) return null;

    try {
      setError(null);

      // Generate unique session token
      const sessionToken = Math.random().toString(36).substring(2, 10);

      const { data, error } = await supabase
        .from('customer_sessions')
        .insert({
          checklist_id: checklistId,
          session_token: sessionToken,
          email: '', // Will be filled when customer accesses
          name: '',
          company: '',
          link_name: linkName,
          submission_status: 'pending',
          link_created_by: user.id,
          link_created_at: new Date().toISOString(),
          is_active: false,
        })
        .select()
        .single();

      if (error) throw error;
      // Add to local state
      setSessions(prev => [data, ...prev]);
      
      return sessionToken;
    } catch (err) {
      console.error('Error creating pending submission:', err);
      setError(err instanceof Error ? err.message : 'Failed to create customer link');
      return null;
    }
  };
  return {
    sessions,
    loading,
    error,
    deleteSession,
    getSessionProgress,
    getSessionStats,
    createPendingSubmission,
    refetch: fetchSessions,
  };
}