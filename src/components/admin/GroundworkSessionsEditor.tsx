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
  Clock,
  Edit2,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface GroundworkSession {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  enrolled: number;
  status: 'open' | 'full' | 'closed' | 'cancelled';
  notes: string | null;
  created_at: string;
}

interface GroundworkRegistration {
  id: string;
  confirmation_code: string;
  session_date: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  deposit_amount: number;
  balance_due: number;
  created_at: string;
}

const emptyNewSession = {
  session_date: '',
  start_time: '08:30',
  end_time: '16:00',
  capacity: 8,
  status: 'open' as const,
  notes: '',
};

const GroundworkSessionsEditor: React.FC<{ embedded?: boolean }> = ({ embedded }) => {
  const [sessions, setSessions] = useState<GroundworkSession[]>([]);
  const [registrations, setRegistrations] = useState<GroundworkRegistration[]>([]);
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
        .from('groundwork_sessions')
        .select('*')
        .order('session_date', { ascending: true });

      if (sessionsError) {
        console.log('Sessions table may not exist yet:', sessionsError);
        setSessions([]);
      } else {
        setSessions(sessionsData || []);
      }

      // Fetch registrations
      const { data: regsData, error: regsError } = await supabase
        .from('groundwork_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (regsError) {
        console.log('Registrations error:', regsError);
      }
      setRegistrations(regsData || []);
    } catch (err) {
      console.error('Error fetching groundwork data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add a new session
  const addSession = async () => {
    if (!newSession.session_date) {
      setError('Please select a date');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('groundwork_sessions')
        .insert({
          session_date: newSession.session_date,
          start_time: newSession.start_time,
          end_time: newSession.end_time,
          capacity: newSession.capacity,
          enrolled: 0,
          status: newSession.status,
          notes: newSession.notes || null,
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

  // Update a session
  const updateSession = async (session: GroundworkSession) => {
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('groundwork_sessions')
        .update({
          session_date: session.session_date,
          start_time: session.start_time,
          end_time: session.end_time,
          capacity: session.capacity,
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
        .from('groundwork_sessions')
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

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH}:${minutes} ${ampm}`;
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
        <Loader2 className="animate-spin text-groundwork-dark" size={32} />
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
              ? 'bg-stone-700 text-white'
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
              ? 'bg-stone-700 text-white'
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
          <button onClick={() => setError(null)} className="ml-auto">
            <X size={16} />
          </button>
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
          {/* Add Session Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Session Date
            </button>
          </div>

          {/* Add Session Form */}
          {showAddForm && (
            <div className="mb-6 p-4 bg-stone-800/50 border border-stone-700 rounded-lg space-y-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Plus size={18} className="text-stone-400" />
                Add New Groundwork Session
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-stone-400 mb-1">
                    Session Date *
                  </label>
                  <input
                    type="date"
                    value={newSession.session_date}
                    onChange={(e) =>
                      setNewSession((prev) => ({ ...prev, session_date: e.target.value }))
                    }
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-400 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={newSession.capacity}
                    onChange={(e) =>
                      setNewSession((prev) => ({ ...prev, capacity: parseInt(e.target.value) || 8 }))
                    }
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-stone-400 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newSession.start_time}
                    onChange={(e) =>
                      setNewSession((prev) => ({ ...prev, start_time: e.target.value }))
                    }
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-400 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newSession.end_time}
                    onChange={(e) =>
                      setNewSession((prev) => ({ ...prev, end_time: e.target.value }))
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
                  Notes (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Special session, limited spots"
                  value={newSession.notes}
                  onChange={(e) =>
                    setNewSession((prev) => ({ ...prev, notes: e.target.value }))
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

          {sessions.length === 0 && !showAddForm ? (
            <div className="text-center py-12 bg-stone-900/50 rounded-xl border border-stone-800">
              <Calendar className="mx-auto mb-4 text-stone-600" size={48} />
              <h3 className="text-lg font-semibold text-white mb-2">
                No Sessions Scheduled
              </h3>
              <p className="text-stone-400 mb-6">
                Add session dates for Groundwork participants to register for.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-stone-700 hover:bg-stone-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Add First Session
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => {
                const spotsLeft = session.capacity - session.enrolled;
                const isPast = new Date(session.session_date) < new Date(new Date().toDateString());

                return (
                  <div
                    key={session.id}
                    className={`bg-stone-900/50 rounded-xl border overflow-hidden ${
                      isPast ? 'border-stone-800 opacity-60' : 'border-stone-700'
                    }`}
                  >
                    {editingSession === session.id ? (
                      // Edit form
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-stone-400 mb-1">
                              Session Date
                            </label>
                            <input
                              type="date"
                              value={session.session_date}
                              onChange={(e) =>
                                setSessions((prev) =>
                                  prev.map((s) =>
                                    s.id === session.id
                                      ? { ...s, session_date: e.target.value }
                                      : s
                                  )
                                )
                              }
                              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-stone-400 mb-1">
                              Capacity
                            </label>
                            <input
                              type="number"
                              value={session.capacity}
                              onChange={(e) =>
                                setSessions((prev) =>
                                  prev.map((s) =>
                                    s.id === session.id
                                      ? { ...s, capacity: parseInt(e.target.value) || 0 }
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
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={session.start_time}
                              onChange={(e) =>
                                setSessions((prev) =>
                                  prev.map((s) =>
                                    s.id === session.id
                                      ? { ...s, start_time: e.target.value }
                                      : s
                                  )
                                )
                              }
                              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-stone-400 mb-1">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={session.end_time}
                              onChange={(e) =>
                                setSessions((prev) =>
                                  prev.map((s) =>
                                    s.id === session.id
                                      ? { ...s, end_time: e.target.value }
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
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-stone-400 mb-1">
                            Notes
                          </label>
                          <input
                            type="text"
                            value={session.notes || ''}
                            onChange={(e) =>
                              setSessions((prev) =>
                                prev.map((s) =>
                                  s.id === session.id
                                    ? { ...s, notes: e.target.value || null }
                                    : s
                                )
                              )
                            }
                            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                          />
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
                            onClick={() => {
                              setEditingSession(null);
                              fetchData(); // Reset any unsaved changes
                            }}
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
                                : session.status === 'cancelled'
                                ? 'bg-red-900/30 text-red-400'
                                : 'bg-stone-800 text-stone-500'
                            }`}
                          >
                            <Calendar size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">
                              {formatDate(session.session_date)}
                            </h4>
                            <p className="text-stone-400 text-sm flex items-center gap-1">
                              <Clock size={14} />
                              {formatTime(session.start_time)} - {formatTime(session.end_time)}
                            </p>
                            {session.notes && (
                              <p className="text-stone-500 text-xs mt-1">{session.notes}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className={`font-medium ${
                              spotsLeft <= 0 ? 'text-red-400' :
                              spotsLeft <= 2 ? 'text-amber-400' : 'text-stone-200'
                            }`}>
                              {session.enrolled} / {session.capacity}
                            </p>
                            <p className="text-stone-500 text-xs">Enrolled</p>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              session.status === 'open'
                                ? 'bg-green-900/30 text-green-400'
                                : session.status === 'full'
                                ? 'bg-amber-900/30 text-amber-400'
                                : session.status === 'cancelled'
                                ? 'bg-red-900/30 text-red-400'
                                : 'bg-stone-800 text-stone-500'
                            }`}
                          >
                            {session.status}
                          </span>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingSession(session.id)}
                              className="p-2 text-stone-400 hover:text-white transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => deleteSession(session.id)}
                              className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
                Registrations will appear here as participants sign up.
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
                          {reg.first_name} {reg.last_name}
                        </h4>
                        <span className="text-xs font-mono text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                          {reg.confirmation_code}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            reg.status === 'deposit_paid'
                              ? 'bg-green-900/30 text-green-400'
                              : reg.status === 'paid_in_full'
                              ? 'bg-blue-900/30 text-blue-400'
                              : reg.status === 'cancelled'
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {reg.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-stone-400 text-sm mt-1">
                        {formatDate(reg.session_date)}
                      </p>
                      <p className="text-stone-500 text-xs mt-1">
                        {reg.email} &middot; {reg.phone}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-green-400 font-medium">
                        ${(reg.deposit_amount / 100).toFixed(0)} paid
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

export default GroundworkSessionsEditor;
