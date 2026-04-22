import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface SummerCampSession {
  id: string;
  session_key: string;
  name: string;
  start_date: string;
  end_date: string;
  capacity_explorers: number;
  capacity_trailblazers: number;
  enrolled_explorers: number;
  enrolled_trailblazers: number;
  early_bird_deadline: string | null;
  status: 'open' | 'full' | 'closed';
  notes: string | null;
}

// Fallback sessions if database table doesn't exist yet
const fallbackSessions: SummerCampSession[] = [
  { id: '1', session_key: 'session-1', name: 'Session 1', start_date: '2026-06-09', end_date: '2026-06-13', capacity_explorers: 8, capacity_trailblazers: 8, enrolled_explorers: 0, enrolled_trailblazers: 0, early_bird_deadline: '2026-04-10', status: 'open', notes: null },
  { id: '2', session_key: 'session-2', name: 'Session 2', start_date: '2026-06-16', end_date: '2026-06-20', capacity_explorers: 8, capacity_trailblazers: 8, enrolled_explorers: 0, enrolled_trailblazers: 0, early_bird_deadline: '2026-04-17', status: 'open', notes: null },
  { id: '3', session_key: 'session-3', name: 'Session 3', start_date: '2026-06-23', end_date: '2026-06-27', capacity_explorers: 8, capacity_trailblazers: 8, enrolled_explorers: 0, enrolled_trailblazers: 0, early_bird_deadline: '2026-04-24', status: 'open', notes: null },
  { id: '4', session_key: 'session-4', name: 'Session 4', start_date: '2026-07-07', end_date: '2026-07-11', capacity_explorers: 8, capacity_trailblazers: 8, enrolled_explorers: 0, enrolled_trailblazers: 0, early_bird_deadline: '2026-05-08', status: 'open', notes: null },
  { id: '5', session_key: 'session-5', name: 'Session 5', start_date: '2026-07-14', end_date: '2026-07-18', capacity_explorers: 8, capacity_trailblazers: 8, enrolled_explorers: 0, enrolled_trailblazers: 0, early_bird_deadline: '2026-05-15', status: 'open', notes: null },
  { id: '6', session_key: 'session-6', name: 'Session 6', start_date: '2026-07-21', end_date: '2026-07-25', capacity_explorers: 8, capacity_trailblazers: 8, enrolled_explorers: 0, enrolled_trailblazers: 0, early_bird_deadline: '2026-05-22', status: 'open', notes: null },
];

export function useSummerCampSessions() {
  const [sessions, setSessions] = useState<SummerCampSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('summer_camp_sessions')
          .select('*')
          .neq('status', 'closed')
          .order('start_date', { ascending: true });

        if (error) {
          // Table might not exist, use fallback
          console.log('Using fallback sessions:', error.message);
          setSessions(fallbackSessions);
        } else {
          setSessions(data || fallbackSessions);
        }
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setSessions(fallbackSessions);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Format date range for display
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start + 'T12:00:00');
    const endDate = new Date(end + 'T12:00:00');
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });

    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()}–${endDate.getDate()}`;
    }
    return `${startMonth} ${startDate.getDate()} – ${endMonth} ${endDate.getDate()}`;
  };

  // Check if session is available for a tier
  const isAvailableForTier = (session: SummerCampSession, tier: 'explorers' | 'trailblazers') => {
    if (session.status !== 'open') return false;
    if (tier === 'explorers') {
      return session.capacity_explorers - session.enrolled_explorers > 0;
    }
    return session.capacity_trailblazers - session.enrolled_trailblazers > 0;
  };

  // Check if early bird pricing applies
  const isEarlyBird = (session: SummerCampSession) => {
    if (!session.early_bird_deadline) return false;
    const deadline = new Date(session.early_bird_deadline + 'T23:59:59');
    return new Date() <= deadline;
  };

  // Get spots remaining for a tier
  const getSpotsRemaining = (session: SummerCampSession, tier: 'explorers' | 'trailblazers') => {
    if (tier === 'explorers') {
      return session.capacity_explorers - session.enrolled_explorers;
    }
    return session.capacity_trailblazers - session.enrolled_trailblazers;
  };

  return {
    sessions,
    loading,
    error,
    formatDateRange,
    isAvailableForTier,
    isEarlyBird,
    getSpotsRemaining,
  };
}
