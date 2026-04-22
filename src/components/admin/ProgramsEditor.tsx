'use client';

// src/components/ProgramsEditor.tsx
// Admin UI for managing EAL programs (pricing, descriptions, settings)

import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Loader2, DollarSign, Users, Clock, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Program {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  duration: string | null;
  min_age: number | null;
  max_age: number | null;
  max_capacity: number;
  deposit_only: boolean;
  deposit_amount: number | null;
  full_price: number | null;
  price_label: string | null;
  scheduling: string;
  active: boolean;
}

interface ProgramsEditorProps {
  embedded?: boolean;
}

const ProgramsEditor: React.FC<ProgramsEditorProps> = ({ embedded = false }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edit state
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    category: 'personal',
    description: '',
    duration: '',
    min_age: '',
    max_age: '',
    max_capacity: '6',
    deposit_only: false,
    deposit_amount: '',
    full_price: '',
    price_label: '',
    scheduling: 'preset',
    active: true,
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('category, name');

      if (error) throw error;
      setPrograms(data || []);
    } catch (err: any) {
      console.error('Error fetching programs:', err);
      setError('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      slug: program.slug,
      name: program.name,
      category: program.category,
      description: program.description || '',
      duration: program.duration || '',
      min_age: program.min_age?.toString() || '',
      max_age: program.max_age?.toString() || '',
      max_capacity: program.max_capacity.toString(),
      deposit_only: program.deposit_only,
      deposit_amount: program.deposit_amount ? (program.deposit_amount / 100).toString() : '',
      full_price: program.full_price ? (program.full_price / 100).toString() : '',
      price_label: program.price_label || '',
      scheduling: program.scheduling,
      active: program.active,
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingProgram(null);
    setFormData({
      slug: '',
      name: '',
      category: 'personal',
      description: '',
      duration: '',
      min_age: '',
      max_age: '',
      max_capacity: '6',
      deposit_only: false,
      deposit_amount: '',
      full_price: '',
      price_label: '',
      scheduling: 'preset',
      active: true,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      setError('Name and slug are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const programData = {
        slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        category: formData.category,
        description: formData.description || null,
        duration: formData.duration || null,
        min_age: formData.min_age ? parseInt(formData.min_age) : null,
        max_age: formData.max_age ? parseInt(formData.max_age) : null,
        max_capacity: parseInt(formData.max_capacity) || 6,
        deposit_only: formData.deposit_only,
        deposit_amount: formData.deposit_amount ? Math.round(parseFloat(formData.deposit_amount) * 100) : null,
        full_price: formData.full_price ? Math.round(parseFloat(formData.full_price) * 100) : null,
        price_label: formData.price_label || null,
        scheduling: formData.scheduling,
        active: formData.active,
        updated_at: new Date().toISOString(),
      };

      if (editingProgram) {
        const { error } = await supabase
          .from('programs')
          .update(programData)
          .eq('id', editingProgram.id);
        if (error) throw error;
        setSuccess('Program updated successfully');
      } else {
        const { error } = await supabase
          .from('programs')
          .insert(programData);
        if (error) throw error;
        setSuccess('Program created successfully');
      }

      setShowForm(false);
      setEditingProgram(null);
      await fetchPrograms();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error saving program:', err);
      setError(err.message || 'Failed to save program');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (program: Program) => {
    try {
      const { error } = await supabase
        .from('programs')
        .update({ active: !program.active })
        .eq('id', program.id);
      if (error) throw error;
      await fetchPrograms();
    } catch (err: any) {
      console.error('Error toggling active:', err);
      setError('Failed to update program');
    }
  };

  const handleDelete = async (program: Program) => {
    if (!confirm(`Delete "${program.name}"? This will also delete all associated dates and cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', program.id);
      if (error) throw error;
      await fetchPrograms();
      setSuccess('Program deleted');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error deleting program:', err);
      setError('Failed to delete program. It may have enrollments.');
    }
  };

  const formatPrice = (cents: number | null) => {
    if (!cents) return '—';
    return `$${(cents / 100).toFixed(0)}`;
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'youth': return 'bg-green-900/50 text-green-400';
      case 'personal': return 'bg-purple-900/50 text-purple-400';
      case 'corporate': return 'bg-blue-900/50 text-blue-400';
      default: return 'bg-stone-800 text-stone-400';
    }
  };

  // Group by category
  const programsByCategory = programs.reduce((acc, program) => {
    if (!acc[program.category]) acc[program.category] = [];
    acc[program.category].push(program);
    return acc;
  }, {} as Record<string, Program[]>);

  const categoryLabels: Record<string, string> = {
    youth: 'Youth Programs',
    personal: 'Personal Growth',
    corporate: 'Corporate Programs',
  };

  const content = (
    <>
      {/* Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
          <button onClick={() => setError(null)} className="ml-auto"><X size={16} /></button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-400 flex items-center gap-2">
          <Check size={18} />
          {success}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-stone-400 text-sm">
          Manage program details, pricing, and settings.
        </p>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Add Program
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
          <p>No programs found</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(programsByCategory).map(([category, categoryPrograms]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-3">
                {categoryLabels[category] || category}
              </h3>
              <div className="space-y-3">
                {categoryPrograms.map((program) => (
                  <div
                    key={program.id}
                    className={`p-4 bg-stone-800/50 border rounded-lg ${
                      program.active ? 'border-stone-700' : 'border-stone-800 opacity-60'
                    }`}
                  >
                    <div className="flex flex-wrap items-start gap-4">
                      {/* Info */}
                      <div className="flex-1 min-w-[250px]">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-stone-100">{program.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded ${getCategoryBadge(program.category)}`}>
                            {program.category}
                          </span>
                          {!program.active && (
                            <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-500">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-stone-500 mb-2">{program.slug}</p>
                        {program.description && (
                          <p className="text-sm text-stone-400 line-clamp-2">{program.description}</p>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="text-right min-w-[120px]">
                        <p className="text-lg font-bold text-stone-100">
                          {formatPrice(program.full_price)}
                        </p>
                        {program.deposit_only && program.deposit_amount && (
                          <p className="text-xs text-stone-500">
                            or {formatPrice(program.deposit_amount)} deposit
                          </p>
                        )}
                        {program.price_label && (
                          <p className="text-xs text-stone-500 mt-1">{program.price_label}</p>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-stone-400">
                        {program.duration && (
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {program.duration}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          Max {program.max_capacity}
                        </div>
                        {(program.min_age || program.max_age) && (
                          <div>
                            Ages {program.min_age || '—'}–{program.max_age || '∞'}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(program)}
                          className={`p-2 rounded-lg transition-colors ${
                            program.active
                              ? 'bg-green-900/30 text-green-500 hover:bg-green-900/50'
                              : 'bg-stone-800 text-stone-500 hover:bg-stone-700'
                          }`}
                          title={program.active ? 'Deactivate' : 'Activate'}
                        >
                          {program.active ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button
                          onClick={() => handleEdit(program)}
                          className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(program)}
                          className="p-2 text-stone-500 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-stone-700 my-4">
            <div className="p-4 border-b border-stone-700 flex items-center justify-between sticky top-0 bg-stone-900">
              <h2 className="text-lg font-bold text-stone-100">
                {editingProgram ? 'Edit Program' : 'Add Program'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-stone-400" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Name & Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-stone-400 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                    placeholder="Women's Retreat"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-400 mb-1">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                    placeholder="womens-retreat"
                  />
                </div>
              </div>

              {/* Category & Scheduling */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-stone-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                  >
                    <option value="youth">Youth</option>
                    <option value="personal">Personal Growth</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-stone-400 mb-1">Scheduling</label>
                  <select
                    value={formData.scheduling}
                    onChange={(e) => setFormData({ ...formData, scheduling: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                  >
                    <option value="preset">Preset dates (enrollable)</option>
                    <option value="inquiry">By inquiry only</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-stone-400 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 resize-none"
                  placeholder="Program description..."
                />
              </div>

              {/* Duration & Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-stone-400 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                    placeholder="Half day (4 hours)"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-400 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={formData.max_capacity}
                    onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                  />
                </div>
              </div>

              {/* Age Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-stone-400 mb-1">Min Age</label>
                  <input
                    type="number"
                    value={formData.min_age}
                    onChange={(e) => setFormData({ ...formData, min_age: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                    placeholder="18"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-400 mb-1">Max Age</label>
                  <input
                    type="number"
                    value={formData.max_age}
                    onChange={(e) => setFormData({ ...formData, max_age: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                    placeholder="Leave empty for no max"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-stone-700 pt-4 mt-4">
                <h3 className="font-semibold text-stone-200 mb-3">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-stone-400 mb-1">Full Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.full_price}
                      onChange={(e) => setFormData({ ...formData, full_price: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                      placeholder="175"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-400 mb-1">Price Label</label>
                    <input
                      type="text"
                      value={formData.price_label}
                      onChange={(e) => setFormData({ ...formData, price_label: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                      placeholder="$175 or Starting at $175"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.deposit_only}
                      onChange={(e) => setFormData({ ...formData, deposit_only: e.target.checked })}
                      className="w-4 h-4 rounded border-stone-600 bg-stone-800 text-blue-600"
                    />
                    <span className="text-sm text-stone-300">Allow deposit payment (pay remainder later)</span>
                  </label>
                </div>

                {formData.deposit_only && (
                  <div className="mt-3">
                    <label className="block text-sm text-stone-400 mb-1">Deposit Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.deposit_amount}
                      onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200"
                      placeholder="100"
                    />
                  </div>
                )}
              </div>

              {/* Active */}
              <div className="border-t border-stone-700 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded border-stone-600 bg-stone-800 text-blue-600"
                  />
                  <span className="text-sm text-stone-300">Active (visible on website)</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-stone-600 hover:border-stone-500 text-stone-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-stone-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editingProgram ? 'Save Changes' : 'Create Program'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div>{content}</div>;
  }

  return content;
};

export default ProgramsEditor;
