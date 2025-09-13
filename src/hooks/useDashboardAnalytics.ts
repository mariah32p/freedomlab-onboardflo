import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface DashboardAnalytics {
  activeCustomers: number;
  completionRate: number;
  avgCompletionDays: number;
  totalSessions: number;
  completedSessions: number;
  pendingSessions: number;
  activeSessions: number;
  loading: boolean;
  error: string | null;
}

export function useDashboardAnalytics(): DashboardAnalytics {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<DashboardAnalytics>({
    activeCustomers: 0,
    completionRate: 0,
    avgCompletionDays: 0,
    totalSessions: 0,
    completedSessions: 0,
    pendingSessions: 0,
    activeSessions: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setAnalytics(prev => ({ ...prev, loading: true, error: null }));

      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your_supabase_url' || 
          supabaseKey === 'your_supabase_anon_key' ||
          !supabaseUrl.startsWith('https://')) {
        // Use mock data when Supabase is not configured
        setAnalytics({
          activeCustomers: 247,
          completionRate: 87,
          avgCompletionDays: 2.3,
          totalSessions: 312,
          completedSessions: 271,
          pendingSessions: 23,
          activeSessions: 18,
          loading: false,
          error: null,
        });
        return;
      }

      // Get all customer sessions for user's checklists
      const { data: sessions, error: sessionsError } = await supabase
        .from('customer_sessions')
        .select(`
          id,
          submission_status,
          started_at,
          completed_at,
          last_activity,
          is_active,
          checklists!inner(
            id,
            user_id
          )
        `)
        .eq('checklists.user_id', user.id);

      if (sessionsError) throw sessionsError;

      const allSessions = sessions || [];
      
      // Calculate metrics
      const totalSessions = allSessions.length;
      const completedSessions = allSessions.filter(s => s.submission_status === 'completed').length;
      const pendingSessions = allSessions.filter(s => s.submission_status === 'pending').length;
      
      // Active customers: those who have started but not completed (all time)
      const activeSessions = allSessions.filter(s => s.submission_status === 'started').length;
      
      // Active customers = sessions currently in progress
      const activeCustomers = activeSessions;

      // Completion rate: completed / (completed + started + abandoned)
      // Exclude pending sessions as they haven't been attempted yet
      const attemptedSessions = allSessions.filter(s => s.submission_status !== 'pending');
      const completionRate = attemptedSessions.length > 0 
        ? Math.round((completedSessions / attemptedSessions.length) * 100)
        : 0;

      // Average completion time: only for completed sessions
      const completedSessionsWithTimes = allSessions.filter(s => 
        s.submission_status === 'completed' && s.started_at && s.completed_at
      );

      let avgCompletionDays = 0;
      if (completedSessionsWithTimes.length > 0) {
        const totalDays = completedSessionsWithTimes.reduce((sum, session) => {
          const startDate = new Date(session.started_at!);
          const endDate = new Date(session.completed_at!);
          const diffInMs = endDate.getTime() - startDate.getTime();
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
          return sum + diffInDays;
        }, 0);
        
        avgCompletionDays = Math.round((totalDays / completedSessionsWithTimes.length) * 10) / 10;
      }

      setAnalytics({
        activeCustomers,
        completionRate,
        avgCompletionDays,
        totalSessions,
        completedSessions,
        pendingSessions,
        activeSessions,
        loading: false,
        error: null,
      });

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setAnalytics(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch analytics'
      }));
    }
  };

  return analytics;
}