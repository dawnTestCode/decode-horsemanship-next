'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Save, Loader2, AlertCircle, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FieldAssignment {
  id: string;
  field_name: string;
  horse_names: string[];
  notes: string | null;
  sort_order: number;
  updated_at: string;
}

interface FieldAssignmentsEditorProps {
  onClose: () => void;
}

const FieldAssignmentsEditor: React.FC<FieldAssignmentsEditorProps> = ({ onClose }) => {
  const [fields, setFields] = useState<FieldAssignment[]>([]);
  const [horseInputs, setHorseInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('field_assignments')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFields(data || []);

      // Initialize horse input strings from existing data
      const inputs: Record<string, string> = {};
      (data || []).forEach((f: FieldAssignment) => {
        inputs[f.id] = f.horse_names.join(', ');
      });
      setHorseInputs(inputs);
    } catch (err: any) {
      console.error('Error loading fields:', err);
      setError('Failed to load field assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldNameChange = (id: string, name: string) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, field_name: name } : f));
    setHasChanges(true);
  };

  const handleHorseNamesChange = (id: string, value: string) => {
    // Store the raw input string
    setHorseInputs(prev => ({ ...prev, [id]: value }));
    // Parse into array for the field data
    const names = value.split(',').map(n => n.trim()).filter(n => n);
    setFields(prev => prev.map(f => f.id === id ? { ...f, horse_names: names } : f));
    setHasChanges(true);
  };

  const handleNotesChange = (id: string, notes: string) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, notes: notes || null } : f));
    setHasChanges(true);
  };

  const addField = () => {
    const newId = `new-${Date.now()}`;
    const newField: FieldAssignment = {
      id: newId,
      field_name: '',
      horse_names: [],
      notes: null,
      sort_order: fields.length + 1,
      updated_at: new Date().toISOString(),
    };
    setFields(prev => [...prev, newField]);
    setHorseInputs(prev => ({ ...prev, [newId]: '' }));
    setHasChanges(true);
  };

  const removeField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    setHasChanges(true);
  };

  const saveAll = async () => {
    setSaving(true);
    setError(null);

    try {
      // Delete all existing fields
      await supabase.from('field_assignments').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Insert all current fields
      const fieldsToInsert = fields.map((f, index) => ({
        field_name: f.field_name,
        horse_names: f.horse_names,
        notes: f.notes,
        sort_order: index + 1,
        updated_at: new Date().toISOString(),
      }));

      if (fieldsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('field_assignments')
          .insert(fieldsToInsert);

        if (insertError) throw insertError;
      }

      // Reload to get fresh IDs
      await loadFields();
      setHasChanges(false);
    } catch (err: any) {
      console.error('Error saving fields:', err);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-stone-900 rounded-2xl p-8 border border-stone-800">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-stone-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-stone-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Field Assignments</h2>
            <p className="text-sm text-stone-400">Manage which horses are in which fields</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-stone-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-stone-800/50 rounded-lg p-4 border border-stone-700"
              >
                <div className="flex items-start gap-3">
                  <div className="text-stone-600 mt-2">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-3">
                    {/* Field Name */}
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Field Name</label>
                      <input
                        type="text"
                        value={field.field_name}
                        onChange={(e) => handleFieldNameChange(field.id, e.target.value)}
                        placeholder="e.g., Front Pasture"
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                      />
                    </div>

                    {/* Horses */}
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">
                        Horses (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={horseInputs[field.id] ?? field.horse_names.join(', ')}
                        onChange={(e) => handleHorseNamesChange(field.id, e.target.value)}
                        placeholder="e.g., Thunder, Luna, Rosie"
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">
                        Notes (optional)
                      </label>
                      <input
                        type="text"
                        value={field.notes || ''}
                        onChange={(e) => handleNotesChange(field.id, e.target.value)}
                        placeholder="e.g., Layla needs grazing muzzle"
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => removeField(field.id)}
                    className="p-2 text-stone-500 hover:text-red-500 hover:bg-stone-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Field Button */}
            <button
              onClick={addField}
              className="w-full py-3 border-2 border-dashed border-stone-700 hover:border-green-600 rounded-lg text-stone-400 hover:text-green-500 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Field
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-800 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={saveAll}
              disabled={saving || !hasChanges}
              className="px-4 py-2 bg-green-700 hover:bg-green-600 disabled:bg-stone-700 disabled:text-stone-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldAssignmentsEditor;
