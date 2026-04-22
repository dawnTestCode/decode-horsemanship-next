'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Loader2, Video, Link as LinkIcon, Image } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import RichTextEditor from './RichTextEditor';

export interface GalleryItem {
  id?: string;
  title: string;
  description: string;
  media_type: 'photo' | 'video';
  media_url: string;
  sort_order: number;
  show_in_gallery: boolean;
}

interface GalleryFormProps {
  item?: GalleryItem | null;
  onSave: (item: GalleryItem) => Promise<void>;
  onCancel: () => void;
}

const GalleryForm: React.FC<GalleryFormProps> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState<GalleryItem>({
    title: item?.title || '',
    description: item?.description || '',
    media_type: item?.media_type || 'photo',
    media_url: item?.media_url || '',
    sort_order: item?.sort_order || 0,
    show_in_gallery: item?.show_in_gallery ?? true,
    ...(item?.id && { id: item.id })
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate video URL (YouTube, Vimeo, or Facebook)
  const isValidVideoUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/(video\/)?|player\.vimeo\.com\/video\/)[\d]+/;
    const facebookRegex = /^(https?:\/\/)?(www\.|m\.)?(facebook\.com|fb\.watch)\/(reel|watch|.*\/videos)\/[\w.-]+/;
    return youtubeRegex.test(url) || vimeoRegex.test(url) || facebookRegex.test(url);
  };

  const uploadFile = async (file: File) => {
    setUploadingImage(true);
    setError(null);

    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('horse-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('horse-photos')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        media_url: publicUrl,
        media_type: 'photo'
      }));
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate
    if (!formData.media_url) {
      setError('Please upload a photo or enter a video URL');
      setIsSubmitting(false);
      return;
    }

    if (formData.media_type === 'video' && !isValidVideoUrl(formData.media_url)) {
      setError('Please enter a valid YouTube, Vimeo, or Facebook URL');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSave(formData);
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto border border-stone-700 my-4">
        <div className="sticky top-0 bg-stone-900 border-b border-stone-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-stone-100">
            {item?.id ? 'Edit Gallery Item' : 'Add to Gallery'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Media Type Toggle */}
          <div>
            <label className="block text-sm text-stone-400 mb-2">Media Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, media_type: 'photo', media_url: '' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  formData.media_type === 'photo'
                    ? 'bg-red-700 text-white'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                }`}
              >
                <Image size={18} />
                Photo
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, media_type: 'video', media_url: '' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  formData.media_type === 'video'
                    ? 'bg-red-700 text-white'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                }`}
              >
                <Video size={18} />
                Video
              </button>
            </div>
          </div>

          {/* Photo Upload */}
          {formData.media_type === 'photo' && (
            <div>
              <label className="block text-sm text-stone-400 mb-2">Photo</label>

              {/* Preview */}
              {formData.media_url && (
                <div className="mb-4 relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={formData.media_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, media_url: '' })}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-500 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Upload Zone */}
              {!formData.media_url && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-stone-700 hover:border-red-500'
                  }`}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-red-500" size={32} />
                      <span className="text-stone-400">Uploading...</span>
                    </div>
                  ) : isDragging ? (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="text-red-500" size={32} />
                      <span className="text-red-400">Drop photo here</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="text-stone-500" size={32} />
                      <span className="text-stone-400">Drag & drop a photo here, or click to browse</span>
                      <span className="text-stone-600 text-sm">PNG, JPG up to 10MB</span>
                    </div>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Video URL */}
          {formData.media_type === 'video' && (
            <div>
              <label className="block text-sm text-stone-400 mb-2">
                <div className="flex items-center gap-2">
                  <LinkIcon size={14} />
                  Video URL (YouTube, Vimeo, or Facebook)
                </div>
              </label>
              <input
                type="url"
                value={formData.media_url}
                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none"
                placeholder="Paste YouTube, Vimeo, or Facebook URL..."
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm text-stone-400 mb-2">Title (optional)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none"
              placeholder="Give this item a title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-stone-400 mb-2">Description (optional)</label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Add a description..."
            />
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="show_in_gallery"
              checked={formData.show_in_gallery}
              onChange={(e) => setFormData({ ...formData, show_in_gallery: e.target.checked })}
              className="w-5 h-5 rounded border-stone-600 bg-stone-800 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="show_in_gallery" className="text-stone-300">
              Show in gallery
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-stone-700">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-stone-600 hover:border-stone-500 text-stone-300 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className="flex-1 px-6 py-3 bg-red-700 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                item?.id ? 'Update' : 'Add to Gallery'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryForm;
