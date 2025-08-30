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
        .order('started_at', { ascending: false });

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
    try {
      const { data, error } = await supabase
        .from('session_progress')
        .select('*')
        .eq('session_id', sessionId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching session progress:', err);
      return [];
    }
  };

  const getSessionStats = () => {
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.completed_at).length;
    const activeSessions = sessions.filter(s => s.is_active && !s.completed_at).length;
    const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    return {
      totalSessions,
      completedSessions,
      activeSessions,
      completionRate,
    };
  };

  return {
    sessions,
    loading,
    error,
    deleteSession,
    getSessionProgress,
    getSessionStats,
    refetch: fetchSessions,
  };
}