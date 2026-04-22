'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ImageDropzone from './ImageDropzone';

export interface EALImage {
  id: string;
  image_key: string;
  title: string;
  description: string | null;
  image_url: string | null;
  focal_x: number;
  focal_y: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

interface EALImageFormProps {
  image: EALImage;
  onClose: () => void;
  onSave: () => void;
}

const EALImageForm: React.FC<EALImageFormProps> = ({ image, onClose, onSave }) => {
  const isNew = !image.id;
  const [formData, setFormData] = useState({
    image_key: image.image_key,
    title: image.title,
    description: image.description || '',
    image_url: image.image_url || '',
    focal_x: image.focal_x ?? 50,
    focal_y: image.focal_y ?? 50,
    is_visible: image.is_visible,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Validate image_key for new images
    if (isNew && !formData.image_key.trim()) {
      setError('Image key is required');
      setSaving(false);
      return;
    }

    try {
      if (isNew) {
        // Create new image
        const { error: insertError } = await supabase
          .from('eal_images')
          .insert({
            image_key: formData.image_key.trim().toLowerCase().replace(/\s+/g, '-'),
            title: formData.title,
            description: formData.description || null,
            image_url: formData.image_url || null,
            focal_x: Math.round(formData.focal_x),
            focal_y: Math.round(formData.focal_y),
            is_visible: formData.is_visible,
          });

        if (insertError) throw insertError;
      } else {
        // Update existing image
        const { error: updateError } = await supabase
          .from('eal_images')
          .update({
            title: formData.title,
            description: formData.description || null,
            image_url: formData.image_url || null,
            focal_x: Math.round(formData.focal_x),
            focal_y: Math.round(formData.focal_y),
            is_visible: formData.is_visible,
            updated_at: new Date().toISOString(),
          })
          .eq('id', image.id);

        if (updateError) throw updateError;
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-stone-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-700">
        <div className="sticky top-0 bg-stone-900 border-b border-stone-700 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-100">
              {isNew ? 'Add New EAL Image' : 'Edit EAL Image'}
            </h2>
            {!isNew && <p className="text-sm text-stone-500">{image.image_key}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Image Key (only for new images) */}
          {isNew && (
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">
                Image Key *
              </label>
              <input
                type="text"
                value={formData.image_key}
                onChange={(e) => setFormData(prev => ({ ...prev, image_key: e.target.value }))}
                placeholder="e.g., womens-retreat-infographic"
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors"
                required
              />
              <p className="text-xs text-stone-500 mt-1">
                This key is used to reference the image in the code. Use lowercase with hyphens, no spaces.
              </p>
            </div>
          )}

          {/* Image Upload with Drag & Drop and Focal Point */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Image
            </label>
            <ImageDropzone
              currentImage={formData.image_url || null}
              onImageChange={(url) => setFormData(prev => ({ ...prev, image_url: url || '' }))}
              focalPoint={{ x: formData.focal_x, y: formData.focal_y }}
              onFocalPointChange={(point) => setFormData(prev => ({ ...prev, focal_x: point.x, focal_y: point.y }))}
              storagePath={`eal/${isNew ? (formData.image_key || 'new') : image.image_key}`}
              aspectRatio="aspect-[4/3]"
              showFocalPointSelector={true}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors resize-none"
              placeholder="Brief description of where this image is used..."
            />
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
              className="w-5 h-5 rounded border-stone-700 bg-stone-800 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="is_visible" className="text-stone-300">
              Visible on site
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-stone-600 text-stone-300 hover:bg-stone-800 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-red-700 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EALImageForm;
