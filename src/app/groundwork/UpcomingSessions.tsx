'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
      // Fetch upcoming sessions (including full ones to show as "Sold Out")
      const { data, error } = await supabase
        .from('groundwork_sessions')
        .select('id, session_date, capacity, enrolled, status')
        .in('status', ['open', 'full'])
        .gte('session_date', new Date().toISOString().split('T')[0])
        .order('session_date', { ascending: true });

      if (!error && data) {
        // Show up to 3 available dates, plus any full dates that come before them
        const result: Session[] = [];
        let availableCount = 0;

        for (const session of data) {
          const isFull = (session.capacity - session.enrolled) <= 0 || session.status === 'full';

          if (isFull) {
            // Always include full dates (they show as "Sold Out")
            result.push(session);
          } else {
            // Only include up to 3 available dates
            if (availableCount < 3) {
              result.push(session);
              availableCount++;
            } else {
              // We have 3 available dates, stop adding
              break;
            }
          }
        }

        setSessions(result);
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
    <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-10 font-sans text-base">
      {sessions.map((session) => {
        const spotsLeft = session.capacity - session.enrolled;
        const isFull = spotsLeft <= 0 || session.status === 'full';

        if (isFull) {
          return (
            <span
              key={session.id}
              className="text-groundwork-muted"
            >
              {formatDate(session.session_date)}
              <span className="ml-2">— Sold Out</span>
            </span>
          );
        }

        return (
          <Link
            key={session.id}
            href={`/groundwork/register?date=${session.session_date}`}
            className="text-groundwork-dark hover:text-groundwork-dark/70 transition-colors"
          >
            {formatDate(session.session_date)}
            <span className="text-groundwork-muted ml-2">
              — {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
            </span>
          </Link>
        );
      })}
    </div>
  );
}
