'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Session {
  id: string;
  session_date: string;
  capacity: number;
  enrolled: number;
  status: string;
}

export function UpcomingSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('groundwork_sessions')
        .select('id, session_date, capacity, enrolled, status')
        .eq('status', 'open')
        .gte('session_date', new Date().toISOString().split('T')[0])
        .order('session_date', { ascending: true })
        .limit(3);

      if (!error && data) {
        setSessions(data);
      }
      setLoading(false);
    };

    fetchSessions();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-3 mb-10 font-sans text-base">
        <p className="text-groundwork-muted">Loading dates...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="space-y-3 mb-10 font-sans text-base">
        <p className="text-groundwork-muted">
          No dates currently scheduled — email to be notified
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-10 font-sans text-base">
      {sessions.map((session) => {
        const spotsLeft = session.capacity - session.enrolled;
        return (
          <p key={session.id} className="text-groundwork-dark">
            {formatDate(session.session_date)}
            <span className="text-groundwork-muted ml-2">
              — {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
            </span>
          </p>
        );
      })}
    </div>
  );
}
