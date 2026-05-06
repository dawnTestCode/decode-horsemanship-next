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
  Edit2,
  X,
  Flame,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DustLeatherSession {
  id: string;
  session_date: string;
  capacity: number;
  enrolled: number;
  status: 'open' | 'full' | 'closed' | 'cancelled';
  notes: string | null;
  created_at: string;
}

interface DustLeatherBooking {
  id: string;
  session_id: string | null;
  session_date: string;
  confirmation_code: string;
  name: string;
  email: string;
  phone: string | null;
  party_size: number;
  package_type: 'day-pass' | 'stay-for-fire';
  message: string | null;
  amount_paid: number;
  status: string;
  created_at: string;
}

const emptyNewSession = {
  session_date: '',
  capacity: 4,
  status: 'open' as const,
  notes: '',
};

const DustLeatherSessionsEditor: React.FC<{ embedded?: boolean }> = ({ embedded }) => {
  const [sessions, setSessions] = useState<DustLeatherSession[]>([]);
  const [bookings, setBookings] = useState<DustLeatherBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<'sessions' | 'bookings'>('sessions');
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSession, setNewSession] = useState(emptyNewSession);

  // Fetch sessions and bookings
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('dust_and_leather_sessions')
        .select('*')
        .order('session_date', { ascending: true });

      if (sessionsError) {
        console.log('Sessions table may not exist yet:', sessionsError);
        setSessions([]);
      } else {
        setSessions(sessionsData || []);
      }

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('dust_and_leather_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsError) {
        console.log('Bookings error:', bookingsError);
      }
      setBookings(bookingsData || []);
    } catch (err) {
      console.error('Error fetching Dust & Leather data:', err);
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
        .from('dust_and_leather_sessions')
        .insert({
          session_date: newSession.session_date,
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
  const updateSession = async (session: DustLeatherSession) => {
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('dust_and_leather_sessions')
        .update({
          session_date: session.session_date,
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
        .from('dust_and_leather_sessions')
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

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(cents / 100);
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
        <Loader2 className="animate-spin text-amber-600" size={32} />
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
          onClick={() => setSubTab('bookings')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            subTab === 'bookings'
              ? 'bg-amber-700 text-white'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
          }`}
        >
          <Users size={16} />
          Bookings
          {bookings.length > 0 && (
            <span className="px-2 py-0.5 bg-black/20 rounded text-xs">
              {bookings.length}
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
              className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Available Date
            </button>
          </div>

          {/* Add Session Form */}
          {showAddForm && (
            <div className="mb-6 p-4 bg-stone-800/50 border border-stone-700 rounded-lg space-y-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Plus size={18} className="text-amber-500" />
                Add New Dust & Leather Date
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-stone-400 mb-1">
                    Date *
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
                    Capacity (2-4 men)
                  </label>
                  <select
                    value={newSession.capacity}
                    onChange={(e) =>
                      setNewSession((prev) => ({ ...prev, capacity: parseInt(e.target.value) }))
                    }
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                  >
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-stone-400 mb-1">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Special session, private group"
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
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  Add Date
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
              <Flame className="mx-auto mb-4 text-amber-600" size={48} />
              <h3 className="text-lg font-semibold text-white mb-2">
                No Dates Available
              </h3>
              <p className="text-stone-400 mb-6">
                Add dates for Dust & Leather that participants can book.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Add First Date
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
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-stone-400 mb-1">
                              Date
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
                            <select
                              value={session.capacity}
                              onChange={(e) =>
                                setSessions((prev) =>
                                  prev.map((s) =>
                                    s.id === session.id
                                      ? { ...s, capacity: parseInt(e.target.value) }
                                      : s
                                  )
                                )
                              }
                              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                            >
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                            </select>
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
                            <Flame size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">
                              {formatDate(session.session_date)}
                            </h4>
                            <p className="text-stone-400 text-sm">
                              8:00 AM – 4:30 PM (or later with Fire option)
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
                              spotsLeft <= 1 ? 'text-amber-400' : 'text-stone-200'
                            }`}>
                              {session.enrolled} / {session.capacity}
                            </p>
                            <p className="text-stone-500 text-xs">Booked</p>
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

      {/* Bookings Tab */}
      {subTab === 'bookings' && (
        <div>
          {bookings.length === 0 ? (
            <div className="text-center py-12 bg-stone-900/50 rounded-xl border border-stone-800">
              <Users className="mx-auto mb-4 text-stone-600" size={48} />
              <h3 className="text-lg font-semibold text-white mb-2">
                No Bookings Yet
              </h3>
              <p className="text-stone-400">
                Bookings will appear here as participants sign up.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-stone-900/50 rounded-xl border border-stone-800 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-white">
                          {booking.name}
                        </h4>
                        <span className="text-xs font-mono text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                          {booking.confirmation_code}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            booking.status === 'paid'
                              ? 'bg-green-900/30 text-green-400'
                              : booking.status === 'completed'
                              ? 'bg-blue-900/30 text-blue-400'
                              : booking.status === 'cancelled'
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-stone-400 text-sm mt-1">
                        {formatDate(booking.session_date)}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-stone-500 text-xs">
                          {booking.email}
                        </span>
                        {booking.phone && (
                          <span className="text-stone-500 text-xs">
                            {booking.phone}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs bg-stone-800 px-2 py-1 rounded text-stone-300">
                          {booking.party_size} men
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          booking.package_type === 'stay-for-fire'
                            ? 'bg-amber-900/30 text-amber-400'
                            : 'bg-stone-800 text-stone-300'
                        }`}>
                          {booking.package_type === 'stay-for-fire' ? 'Stay for the Fire' : 'Day Pass'}
                        </span>
                      </div>
                      {booking.message && (
                        <p className="text-stone-500 text-xs mt-2 italic">
                          "{booking.message}"
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-green-400 font-medium">
                        {formatCurrency(booking.amount_paid)}
                      </p>
                      <p className="text-stone-600 text-xs mt-1">
                        {new Date(booking.created_at).toLocaleDateString()}
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

export default DustLeatherSessionsEditor;
