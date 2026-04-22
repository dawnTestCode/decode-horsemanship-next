'use client';

// src/components/ProgramDatesEditor.tsx
// Admin UI for managing program dates

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2, Calendar, Users, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Program {
  id: string;
  slug: string;
  name: string;
  category: string;
  max_capacity: number;
  scheduling: string;
  default_start_time: string | null;
  default_end_time: string | null;
}

interface ProgramDate {
  id: string;
  program_id: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  capacity: number | null;
  enrolled: number;
  status: string;
  notes: string | null;
}

interface ProgramDatesEditorProps {
  onClose: () => void;
  embedded?: boolean;
}

const ProgramDatesEditor: React.FC<ProgramDatesEditorProps> = ({ onClose, embedded = false }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [dates, setDates] = useState<ProgramDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New date form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState({
    program_id: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    capacity: '',
    notes: '',
  });

  // When program is selected, auto-fill the default times
  const handleProgramSelect = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    setNewDate({
      ...newDate,
      program_id: programId,
      start_time: program?.default_start_time?.substring(0, 5) || '09:00',
      end_time: program?.default_end_time?.substring(0, 5) || '13:00',
    });
  };

  // Filter
  const [filterProgramId, setFilterProgramId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch programs
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select('id, slug, name, category, max_capacity, scheduling, default_start_time, default_end_time')
        .eq('active', true)
        .order('category, name');

      if (programsError) throw programsError;
      setPrograms(programsData || []);

      // Fetch all program dates
      const { data: datesData, error: datesError } = await supabase
        .from('program_dates')
        .select('*')
        .order('start_date', { ascending: true });

      if (datesError) throw datesError;
      setDates(datesData || []);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDate = async () => {
    if (!newDate.program_id || !newDate.start_date) {
      setError('Please select a program and date');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { error } = await supabase.from('program_dates').insert({
        program_id: newDate.program_id,
        start_date: newDate.start_date,
        end_date: newDate.end_date || null,
        start_time: newDate.start_time || null,
        end_time: newDate.end_time || null,
        capacity: newDate.capacity ? parseInt(newDate.capacity) : null,
        notes: newDate.notes || null,
        status: 'open',
        enrolled: 0,
      });

      if (error) throw error;

      // Reset form and refresh
      setNewDate({
        program_id: '',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        capacity: '',
        notes: '',
      });
      setShowAddForm(false);
      await fetchData();
    } catch (err: any) {
      console.error('Error adding date:', err);
      setError('Failed to add program date');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (dateId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('program_dates')
        .update({ status: newStatus })
        .eq('id', dateId);

      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const handleDeleteDate = async (dateId: string) => {
    if (!confirm('Are you sure you want to delete this date? This cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('program_dates')
        .delete()
        .eq('id', dateId);

      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      console.error('Error deleting date:', err);
      setError('Failed to delete date');
    }
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string | null): string => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-900/50 text-green-400 border-green-700';
      case 'full':
        return 'bg-yellow-900/50 text-yellow-400 border-yellow-700';
      case 'closed':
        return 'bg-stone-800 text-stone-400 border-stone-600';
      case 'cancelled':
        return 'bg-red-900/50 text-red-400 border-red-700';
      default:
        return 'bg-stone-800 text-stone-400 border-stone-600';
    }
  };

  const getProgramById = (id: string) => programs.find(p => p.id === id);

  // Filter dates
  const filteredDates = dates.filter(d => {
    if (filterProgramId !== 'all' && d.program_id !== filterProgramId) return false;
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    return true;
  });

  // Group by program for display
  const datesByProgram = filteredDates.reduce((acc, date) => {
    const program = getProgramById(date.program_id);
    const key = program?.name || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(date);
    return acc;
  }, {} as Record<string, ProgramDate[]>);

  const content = (
    <>
      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters & Add Button */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filterProgramId}
          onChange={(e) => setFilterProgramId(e.target.value)}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 text-sm"
        >
          <option value="all">All Programs</option>
          {programs.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 text-sm"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="full">Full</option>
          <option value="closed">Closed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          onClick={() => setShowAddForm(true)}
          className="ml-auto px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Add Date
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-stone-800/50 border border-stone-700 rounded-lg">
          <h3 className="font-semibold text-stone-100 mb-4">Add New Program Date</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-stone-400 mb-1">Program *</label>
              <select
                value={newDate.program_id}
                onChange={(e) => handleProgramSelect(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
              >
                <option value="">Select a program...</option>
                {programs.filter(p => p.scheduling === 'preset').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-stone-400 mb-1">Start Date *</label>
              <input
                type="date"
                value={newDate.start_date}
                onChange={(e) => setNewDate({ ...newDate, start_date: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>

            <div>
              <label className="block text-sm text-stone-400 mb-1">End Date (optional)</label>
              <input
                type="date"
                value={newDate.end_date}
                onChange={(e) => setNewDate({ ...newDate, end_date: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>

            <div>
              <label className="block text-sm text-stone-400 mb-1">
                Start Time
                {newDate.program_id && (
                  <span className="text-stone-500 ml-1">(from program default)</span>
                )}
              </label>
              <input
                type="time"
                value={newDate.start_time}
                onChange={(e) => setNewDate({ ...newDate, start_time: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>

            <div>
              <label className="block text-sm text-stone-400 mb-1">
                End Time
                {newDate.program_id && (
                  <span className="text-stone-500 ml-1">(from program default)</span>
                )}
              </label>
              <input
                type="time"
                value={newDate.end_time}
                onChange={(e) => setNewDate({ ...newDate, end_time: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>

            <div>
              <label className="block text-sm text-stone-400 mb-1">Capacity (override)</label>
              <input
                type="number"
                placeholder="Uses program default if empty"
                value={newDate.capacity}
                onChange={(e) => setNewDate({ ...newDate, capacity: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>

            <div>
              <label className="block text-sm text-stone-400 mb-1">Notes (optional)</label>
              <input
                type="text"
                placeholder="e.g., Special location"
                value={newDate.notes}
                onChange={(e) => setNewDate({ ...newDate, notes: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-stone-600 hover:border-stone-500 text-stone-300 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAddDate}
              disabled={saving || !newDate.program_id || !newDate.start_date}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-stone-700 disabled:text-stone-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Add Date
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : filteredDates.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p>No program dates found</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-sm"
          >
            Add Your First Date
          </button>
        </div>
      ) : (
        /* Dates List */
        <div className="space-y-6">
          {Object.entries(datesByProgram).map(([programName, programDates]) => (
            <div key={programName}>
              <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-3">
                {programName}
              </h3>
              <div className="space-y-2">
                {programDates.map((date) => {
                  const program = getProgramById(date.program_id);
                  const capacity = date.capacity || program?.max_capacity || 0;
                  const spotsLeft = capacity - date.enrolled;
                  const isPast = new Date(date.start_date) < new Date(new Date().toDateString());

                  return (
                    <div
                      key={date.id}
                      className={`p-4 bg-stone-800/50 border rounded-lg flex flex-wrap items-center gap-4 ${
                        isPast ? 'border-stone-800 opacity-60' : 'border-stone-700'
                      }`}
                    >
                      {/* Date & Time */}
                      <div className="flex-1 min-w-[200px]">
                        <p className="font-medium text-stone-100">
                          {formatDate(date.start_date)}
                          {date.end_date && date.end_date !== date.start_date && (
                            <span className="text-stone-500"> – {formatDate(date.end_date)}</span>
                          )}
                        </p>
                        {date.start_time && (
                          <p className="text-sm text-stone-400 flex items-center gap-1 mt-1">
                            <Clock size={14} />
                            {formatTime(date.start_time)}
                            {date.end_time && ` – ${formatTime(date.end_time)}`}
                          </p>
                        )}
                        {date.notes && (
                          <p className="text-xs text-stone-500 mt-1">{date.notes}</p>
                        )}
                      </div>

                      {/* Enrollment */}
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-stone-500" />
                        <span className={`text-sm font-medium ${
                          spotsLeft <= 0 ? 'text-red-400' :
                          spotsLeft <= 2 ? 'text-yellow-400' : 'text-stone-300'
                        }`}>
                          {date.enrolled}/{capacity}
                        </span>
                      </div>

                      {/* Status */}
                      <select
                        value={date.status}
                        onChange={(e) => handleUpdateStatus(date.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg border text-sm ${getStatusBadge(date.status)} bg-transparent cursor-pointer`}
                      >
                        <option value="open">Open</option>
                        <option value="full">Full</option>
                        <option value="closed">Closed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteDate(date.id)}
                        className="p-2 text-stone-500 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  // Embedded mode - just render content directly
  if (embedded) {
    return <div>{content}</div>;
  }

  // Modal mode
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-stone-700 flex flex-col my-4">
        {/* Header */}
        <div className="p-4 border-b border-stone-700 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-500" size={24} />
            <h2 className="text-xl font-bold text-stone-100">Program Dates</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-stone-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {content}
        </div>
      </div>
    </div>
  );
};

export default ProgramDatesEditor;
