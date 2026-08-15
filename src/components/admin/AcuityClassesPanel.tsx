'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Loader2, Users, Download, ChevronLeft, RefreshCw, X } from 'lucide-react';

interface ClassSession {
  id: number;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  capacity: number | null;
  registered_count: number;
  canceled: boolean;
  appointment_type_id: number;
  class_name: string;
  category: string | null;
  calendar_id: number | null;
  calendar_name: string | null;
}

interface Attendee {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  canceled: boolean;
  no_show: boolean;
  created_at: string | null;
}

export default function AcuityClassesPanel() {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail view state
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('acuity_class_sessions_view')
        .select('*')
        .gte('starts_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('starts_at', { ascending: true })
        .limit(200);

      if (fetchError) throw fetchError;
      setSessions(data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendees = async (sessionId: number) => {
    setLoadingAttendees(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('acuity_attendees')
        .select('*')
        .eq('class_session_id', sessionId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setAttendees(data || []);
    } catch (err) {
      console.error('Error fetching attendees:', err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSessionClick = (session: ClassSession) => {
    setSelectedSession(session);
    fetchAttendees(session.id);
  };

  const handleBack = () => {
    setSelectedSession(null);
    setAttendees([]);
  };

  // Detail view for a single session
  if (selectedSession) {
    const activeAttendees = attendees.filter(a => !a.canceled);

    return (
      <div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mb-4"
        >
          <ChevronLeft size={16} />
          All classes
        </button>

        <h2 className="text-xl font-semibold text-stone-100 mb-1">
          {selectedSession.class_name}
        </h2>
        <p className="text-sm text-stone-500 mb-6">
          {new Date(selectedSession.starts_at).toLocaleString(undefined, {
            dateStyle: 'full',
            timeStyle: 'short',
          })}
          {selectedSession.calendar_name ? ` · ${selectedSession.calendar_name}` : ''}
        </p>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-stone-300">
            <span className="font-medium">{activeAttendees.length}</span> registered
            {selectedSession.capacity ? ` of ${selectedSession.capacity} spots` : ''}
          </p>
          <a
            href={`/api/acuity/export?sessionId=${selectedSession.id}`}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
          >
            <Download size={16} />
            Export CSV
          </a>
        </div>

        {loadingAttendees ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-stone-500" size={24} />
          </div>
        ) : (
          <div className="border border-stone-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-800/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-stone-300">Name</th>
                  <th className="px-4 py-3 font-medium text-stone-300">Email</th>
                  <th className="px-4 py-3 font-medium text-stone-300">Phone</th>
                  <th className="px-4 py-3 font-medium text-stone-300">Notes</th>
                  <th className="px-4 py-3 font-medium text-stone-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendees.length > 0 ? (
                  attendees.map((a) => (
                    <tr key={a.id} className="border-t border-stone-800">
                      <td className="px-4 py-3 text-stone-200">
                        {a.first_name} {a.last_name}
                      </td>
                      <td className="px-4 py-3">
                        {a.email ? (
                          <a href={`mailto:${a.email}`} className="text-blue-400 hover:underline">
                            {a.email}
                          </a>
                        ) : (
                          <span className="text-stone-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-400">{a.phone || '—'}</td>
                      <td className="px-4 py-3 text-stone-500 max-w-xs truncate">{a.notes || '—'}</td>
                      <td className="px-4 py-3">
                        {a.canceled ? (
                          <span className="text-red-400 font-medium">Canceled</span>
                        ) : a.no_show ? (
                          <span className="text-amber-400 font-medium">No-show</span>
                        ) : (
                          <span className="text-green-400">Registered</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-8 text-stone-500 text-center" colSpan={5}>
                      No attendees yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-stone-100">Classes & Registrations</h2>
          <p className="text-sm text-stone-500">
            Synced from Acuity Scheduling. Click a class to see who&apos;s registered.
          </p>
        </div>
        <button
          onClick={fetchSessions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="p-1 hover:bg-red-800 rounded">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-stone-100">{sessions.length}</div>
          <div className="text-stone-500 text-sm">Upcoming Classes</div>
        </div>
        <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-500">
            {sessions.reduce((sum, s) => sum + s.registered_count, 0)}
          </div>
          <div className="text-stone-500 text-sm">Total Registrations</div>
        </div>
        <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-500">
            {sessions.filter(s => new Date(s.starts_at) > new Date() && new Date(s.starts_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
          </div>
          <div className="text-stone-500 text-sm">This Week</div>
        </div>
        <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-amber-500">
            {sessions.filter(s => s.canceled).length}
          </div>
          <div className="text-stone-500 text-sm">Canceled</div>
        </div>
      </div>

      {/* Sessions Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-stone-500" size={40} />
        </div>
      ) : (
        <div className="border border-stone-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-800/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-stone-300">Date & Time</th>
                <th className="px-4 py-3 font-medium text-stone-300">Class</th>
                <th className="px-4 py-3 font-medium text-stone-300">Calendar</th>
                <th className="px-4 py-3 font-medium text-stone-300">Registered</th>
                <th className="px-4 py-3 font-medium text-stone-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length > 0 ? (
                sessions.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-stone-800 hover:bg-stone-800/30 cursor-pointer transition-colors"
                    onClick={() => handleSessionClick(s)}
                  >
                    <td className="px-4 py-3 text-stone-300">
                      {new Date(s.starts_at).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-blue-400 hover:underline">
                        {s.class_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-400">{s.calendar_name ?? '—'}</td>
                    <td className="px-4 py-3 text-stone-300">
                      <span className="flex items-center gap-1">
                        <Users size={14} className="text-stone-500" />
                        {s.registered_count}
                        {s.capacity ? ` / ${s.capacity}` : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.canceled ? (
                        <span className="text-red-400 font-medium">Canceled</span>
                      ) : (
                        <span className="text-green-400">Scheduled</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-12 text-stone-500 text-center" colSpan={5}>
                    No classes found. Run a sync to pull data from Acuity.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
