'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Loader2,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Sun,
  ChevronDown,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SummerCampSession {
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

interface SummerCampRegistration {
  id: string;
  confirmation_code: string;
  camper_first_name: string;
  camper_last_name: string;
  tier: string;
  session_1: string;
  session_2: string | null;
  parent_name: string;
  parent_email: string;
  status: string;
  deposit_paid: number;
  balance_due: number;
  created_at: string;
}

const defaultSessions: Omit<SummerCampSession, 'id'>[] = [
  { session_key: 'session-1', name: 'Session 1', start_date: '2026-06-09', end_date: '2026-06-13', capacity_explorers: 8, capacity_trailblazers: 8, enrolled_explorers: 0, enrolled_trailblazers: 0, early_bird_deadline: '2026-04-10', status: 'open', notes: null },
  { session_key: 'session-2', name: 'Session 2', start_date: '2026-06-16', end_date: '2026-06-20', capacity_explorers: 8, capacity_trailblazers: 8, enrolled_explorers: 0, enrolled_trailblazers: 0, early_bird_deadline: '2026-04-17', status: 'open', notes: null },
  { session_key: 'session-3', name: 'Session 3', start_date: '2026-06-23', end_date: '2026-06-27', capacity_explorers: 8, capacity_trailblazers: 8, enrolled_explorers: 0, enrolled_trailblazers: 0, early_bird_deadline: '2026-04-24', status: 'open', notes: null },
  { session_key: 'session-4', name: 'Session 4', start_date: '2026-07-07', end_date: '2026-07-11', capacity_explorers: 8, capacity_trailblazers: 8, enrolled_explorers: 0, enrolled_trailblazers: 0, early_bird_deadline: '2026-05-08', status: 'open', notes: null },
  { session_key: 'session-5', name: 'Session 5', start_date: '2026-07-14', end_date: '2026-07-18', capacity_explorers: 8, capacity_trailblazers: 8, enrolled_explorers: 0, enrolled_trailblazers: 0, early_bird_deadline: '2026-05-15', status: 'open', notes: null },
  { session_key: 'session-6', name: 'Session 6', start_date: '2026-07-21', end_date: '2026-07-25', capacity_explorers: 8, capacity_trailblazers: 8, enrolled_explorers: 0, enrolled_trailblazers: 0, early_bird_deadline: '2026-05-22', status: 'open', notes: null },
];

const emptyNewSession = {
  session_key: '',
  name: '',
  start_date: '',
  end_date: '',
  capacity_explorers: 8,
  capacity_trailblazers: 8,
  early_bird_deadline: '',
  status: 'open' as const,
};

const SummerCampSessionsEditor: React.FC<{ embedded?: boolean }> = ({ embedded }) => {
  const [sessions, setSessions] = useState<SummerCampSession[]>([]);
  const [registrations, setRegistrations] = useState<SummerCampRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<'sessions' | 'registrations'>('sessions');
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSession, setNewSession] = useState(emptyNewSession);

  // Fetch sessions and registrations
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('summer_camp_sessions')
        .select('*')
        .order('start_date', { ascending: true });

      if (sessionsError) {
        // Table might not exist yet, use defaults
        console.log('Sessions table not found, using defaults');
        setSessions([]);
      } else {
        setSessions(sessionsData || []);
      }

      // Fetch registrations
      const { data: regsData, error: regsError } = await supabase
        .from('summer_camp_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (regsError) {
        console.log('Registrations error:', regsError);
      }
      setRegistrations(regsData || []);
    } catch (err) {
      console.error('Error fetching summer camp data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Initialize default sessions if none exist
  const initializeSessions = async () => {
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('summer_camp_sessions')
        .insert(defaultSessions);

      if (error) throw error;
      setSuccess('Sessions initialized successfully!');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to initialize sessions');
    } finally {
      setSaving(false);
    }
  };

  // Update a session
  const updateSession = async (session: SummerCampSession) => {
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('summer_camp_sessions')
        .update({
          name: session.name,
          start_date: session.start_date,
          end_date: session.end_date,
          capacity_explorers: session.capacity_explorers,
          capacity_trailblazers: session.capacity_trailblazers,
          early_bird_deadline: session.early_bird_deadline,
          status: session.status,
          notes: session.notes,
        })
        .eq('id', session.id);

      if (error) throw error;
      setSuccess('Session updated!');
      setEditingSession(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to update session');
    } finally {
      setSaving(false);
    }
  };

  // Delete a session
  const deleteSession = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('summer_camp_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Session deleted!');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete session');
    } finally {
      setSaving(false);
    }
  };

  // Add a new session
  const addSession = async () => {
    if (!newSession.session_key || !newSession.name || !newSession.start_date || !newSession.end_date) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('summer_camp_sessions')
        .insert({
          session_key: newSession.session_key,
          name: newSession.name,
          start_date: newSession.start_date,
          end_date: newSession.end_date,
          capacity_explorers: newSession.capacity_explorers,
          capacity_trailblazers: newSession.capacity_trailblazers,
          early_bird_deadline: newSession.early_bird_deadline || null,
          status: newSession.status,
        });

      if (error) throw error;
      setSuccess('Session added!');
      setShowAddForm(false);
      setNewSession(emptyNewSession);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to add session');
    } finally {
      setSaving(false);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

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

  // Clear messages after delay
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSubTab('sessions')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            subTab === 'sessions'
              ? 'bg-amber-700 text-white'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
          }`}
        >
          <Calendar size={16} />
          Sessions
        </button>
        <button
          onClick={() => setSubTab('registrations')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            subTab === 'registrations'
              ? 'bg-amber-700 text-white'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
          }`}
        >
          <Users size={16} />
          Registrations
          {registrations.length > 0 && (
            <span className="px-2 py-0.5 bg-black/20 rounded text-xs">
              {registrations.length}
            </span>
          )}
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-2 text-red-400">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-lg flex items-center gap-2 text-green-400">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {/* Sessions Tab */}
      {subTab === 'sessions' && (
        <div>
          {sessions.length === 0 ? (
            <div className="text-center py-12 bg-stone-900/50 rounded-xl border border-stone-800">
              <Sun className="mx-auto mb-4 text-amber-500" size={48} />
              <h3 className="text-lg font-semibold text-white mb-2">
                No Sessions Configured
              </h3>
              <p className="text-stone-400 mb-6">
                Initialize the default summer camp sessions to get started.
              </p>
              <button
                onClick={initializeSessions}
                disabled={saving}
                className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Plus size={18} />
                )}
                Initialize Sessions
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Add Session Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Session
                </button>
              </div>

              {/* Add Session Form */}
              {showAddForm && (
                <div className="bg-stone-900/50 rounded-xl border border-amber-800 p-4 space-y-4">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Plus size={18} className="text-amber-500" />
                    Add New Session
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-stone-400 mb-1">
                        Session Key *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., session-7"
                        value={newSession.session_key}
                        onChange={(e) =>
                          setNewSession((prev) => ({ ...prev, session_key: e.target.value }))
                        }
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-stone-400 mb-1">
                        Session Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Session 7"
                        value={newSession.name}
                        onChange={(e) =>
                          setNewSession((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-stone-400 mb-1">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={newSession.start_date}
                        onChange={(e) =>
                          setNewSession((prev) => ({ ...prev, start_date: e.target.value }))
                        }
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-stone-400 mb-1">
                        End Date *
                      </label>
                      <input
                        type="date"
                        value={newSession.end_date}
                        onChange={(e) =>
                          setNewSession((prev) => ({ ...prev, end_date: e.target.value }))
                        }
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-stone-400 mb-1">
                        Explorers Capacity (6-9)
                      </label>
                      <input
                        type="number"
                        value={newSession.capacity_explorers}
                        onChange={(e) =>
                          setNewSession((prev) => ({ ...prev, capacity_explorers: parseInt(e.target.value) || 0 }))
                        }
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-stone-400 mb-1">
                        Trailblazers Capacity (10-14)
                      </label>
                      <input
                        type="number"
                        value={newSession.capacity_trailblazers}
                        onChange={(e) =>
                          setNewSession((prev) => ({ ...prev, capacity_trailblazers: parseInt(e.target.value) || 0 }))
                        }
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-stone-400 mb-1">
                        Status
                      </label>
                      <select
                        value={newSession.status}
                        onChange={(e) =>
                          setNewSession((prev) => ({ ...prev, status: e.target.value as any }))
                        }
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                      >
                        <option value="open">Open</option>
                        <option value="full">Full</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-stone-400 mb-1">
                      Early Bird Deadline
                    </label>
                    <input
                      type="date"
                      value={newSession.early_bird_deadline}
                      onChange={(e) =>
                        setNewSession((prev) => ({ ...prev, early_bird_deadline: e.target.value }))
                      }
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={addSession}
                      disabled={saving}
                      className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      {saving ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      Add Session
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewSession(emptyNewSession);
                      }}
                      className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-stone-900/50 rounded-xl border border-stone-800 overflow-hidden"
                >
                  {editingSession === session.id ? (
                    // Edit form
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-stone-400 mb-1">
                            Session Name
                          </label>
                          <input
                            type="text"
                            value={session.name}
                            onChange={(e) =>
                              setSessions((prev) =>
                                prev.map((s) =>
                                  s.id === session.id
                                    ? { ...s, name: e.target.value }
                                    : s
                                )
                              )
                            }
                            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-stone-400 mb-1">
                            Status
                          </label>
                          <select
                            value={session.status}
                            onChange={(e) =>
                              setSessions((prev) =>
                                prev.map((s) =>
                                  s.id === session.id
                                    ? { ...s, status: e.target.value as any }
                                    : s
                                )
                              )
                            }
                            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                          >
                            <option value="open">Open</option>
                            <option value="full">Full</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-stone-400 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={session.start_date}
                            onChange={(e) =>
                              setSessions((prev) =>
                                prev.map((s) =>
                                  s.id === session.id
                                    ? { ...s, start_date: e.target.value }
                                    : s
                                )
                              )
                            }
                            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-stone-400 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={session.end_date}
                            onChange={(e) =>
                              setSessions((prev) =>
                                prev.map((s) =>
                                  s.id === session.id
                                    ? { ...s, end_date: e.target.value }
                                    : s
                                )
                              )
                            }
                            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-stone-400 mb-1">
                            Explorers Capacity (6-9)
                          </label>
                          <input
                            type="number"
                            value={session.capacity_explorers}
                            onChange={(e) =>
                              setSessions((prev) =>
                                prev.map((s) =>
                                  s.id === session.id
                                    ? { ...s, capacity_explorers: parseInt(e.target.value) || 0 }
                                    : s
                                )
                              )
                            }
                            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-stone-400 mb-1">
                            Trailblazers Capacity (10-14)
                          </label>
                          <input
                            type="number"
                            value={session.capacity_trailblazers}
                            onChange={(e) =>
                              setSessions((prev) =>
                                prev.map((s) =>
                                  s.id === session.id
                                    ? { ...s, capacity_trailblazers: parseInt(e.target.value) || 0 }
                                    : s
                                )
                              )
                            }
                            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-stone-400 mb-1">
                            Early Bird Deadline
                          </label>
                          <input
                            type="date"
                            value={session.early_bird_deadline || ''}
                            onChange={(e) =>
                              setSessions((prev) =>
                                prev.map((s) =>
                                  s.id === session.id
                                    ? { ...s, early_bird_deadline: e.target.value || null }
                                    : s
                                )
                              )
                            }
                            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => updateSession(session)}
                          disabled={saving}
                          className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          {saving ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSession(null)}
                          className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display view
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            session.status === 'open'
                              ? 'bg-green-900/30 text-green-400'
                              : session.status === 'full'
                              ? 'bg-amber-900/30 text-amber-400'
                              : 'bg-stone-800 text-stone-500'
                          }`}
                        >
                          <Sun size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {session.name}
                          </h4>
                          <p className="text-stone-400 text-sm">
                            {formatDateRange(session.start_date, session.end_date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-stone-200 font-medium">
                            {session.enrolled_explorers} / {session.capacity_explorers}
                          </p>
                          <p className="text-stone-500 text-xs">Explorers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-stone-200 font-medium">
                            {session.enrolled_trailblazers} / {session.capacity_trailblazers}
                          </p>
                          <p className="text-stone-500 text-xs">Trailblazers</p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            session.status === 'open'
                              ? 'bg-green-900/30 text-green-400'
                              : session.status === 'full'
                              ? 'bg-amber-900/30 text-amber-400'
                              : 'bg-stone-800 text-stone-500'
                          }`}
                        >
                          {session.status}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingSession(session.id)}
                            className="p-2 text-stone-400 hover:text-white transition-colors"
                          >
                            <Calendar size={18} />
                          </button>
                          <button
                            onClick={() => deleteSession(session.id)}
                            className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Registrations Tab */}
      {subTab === 'registrations' && (
        <div>
          {registrations.length === 0 ? (
            <div className="text-center py-12 bg-stone-900/50 rounded-xl border border-stone-800">
              <Users className="mx-auto mb-4 text-stone-600" size={48} />
              <h3 className="text-lg font-semibold text-white mb-2">
                No Registrations Yet
              </h3>
              <p className="text-stone-400">
                Registrations will appear here as families sign up.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-stone-900/50 rounded-xl border border-stone-800 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-white">
                          {reg.camper_first_name} {reg.camper_last_name}
                        </h4>
                        <span className="text-xs font-mono text-amber-500 bg-amber-900/30 px-2 py-0.5 rounded">
                          {reg.confirmation_code}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            reg.status === 'confirmed'
                              ? 'bg-green-900/30 text-green-400'
                              : reg.status === 'cancelled'
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </div>
                      <p className="text-stone-400 text-sm mt-1">
                        {reg.tier === 'explorers' ? 'Explorers (6-9)' : 'Trailblazers (10-14)'} ·{' '}
                        {reg.session_1}
                        {reg.session_2 && ` + ${reg.session_2}`}
                      </p>
                      <p className="text-stone-500 text-xs mt-1">
                        Parent: {reg.parent_name} · {reg.parent_email}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-green-400 font-medium">
                        ${(reg.deposit_paid / 100).toFixed(0)} paid
                      </p>
                      {reg.balance_due > 0 && (
                        <p className="text-amber-400 text-sm">
                          ${(reg.balance_due / 100).toFixed(0)} due
                        </p>
                      )}
                      <p className="text-stone-600 text-xs mt-1">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SummerCampSessionsEditor;
