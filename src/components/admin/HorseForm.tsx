'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Loader2, Trash2, Plus, Video, Link as LinkIcon, GripVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import RichTextEditor from './RichTextEditor';

export interface HorseData {
  id?: string;
  name: string;
  age: number;
  breed: string;
  gender: 'Mare' | 'Gelding' | 'Stallion';
  height: string;
  price: string;
  temperament: 'Calm' | 'Moderate' | 'Spirited';
  experience_level: 'Beginner' | 'Intermediate' | 'Advanced';
  training_status: 'Green' | 'In Training' | 'Trained' | 'Well Trained';
  story: string;
  photos: string[];
  videos: string[];
  status: 'available' | 'pending' | 'sold' | 'not_for_sale';
  show_in_listing: boolean;
  featured: boolean;
}

interface HorseFormProps {
  horse?: HorseData | null;
  onSave: (horse: HorseData) => Promise<void>;
  onCancel: () => void;
}

const HorseForm: React.FC<HorseFormProps> = ({ horse, onSave, onCancel }) => {
  const [formData, setFormData] = useState<HorseData>({
    name: horse?.name || '',
    age: horse?.age || 5,
    breed: horse?.breed || '',
    gender: horse?.gender || 'Gelding',
    height: horse?.height || '',
    price: horse?.price || '',
    temperament: horse?.temperament || 'Calm',
    experience_level: horse?.experience_level || 'Intermediate',
    training_status: horse?.training_status || 'In Training',
    story: horse?.story || '',
    photos: horse?.photos || [],
    videos: horse?.videos || [],
    status: horse?.status || 'available',
    show_in_listing: horse?.show_in_listing ?? true,
    featured: horse?.featured ?? false,
    ...(horse?.id && { id: horse.id })
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate YouTube, Vimeo, or Facebook URL
  const isValidVideoUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/(video\/)?|player\.vimeo\.com\/video\/)[\d]+/;
    const facebookRegex = /^(https?:\/\/)?(www\.|m\.)?(facebook\.com|fb\.watch)\/(reel|watch|.*\/videos)\/[\w.-]+/;
    return youtubeRegex.test(url) || vimeoRegex.test(url) || facebookRegex.test(url);
  };

  // Extract video ID and type for thumbnail
  const getVideoInfo = (url: string): { type: 'youtube' | 'vimeo' | 'facebook' | null; id: string | null } => {
    // YouTube patterns
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/)|youtu\.be\/)([\w-]+)/);
    if (youtubeMatch) {
      return { type: 'youtube', id: youtubeMatch[1] };
    }

    // Vimeo patterns
    const vimeoMatch = url.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch) {
      return { type: 'vimeo', id: vimeoMatch[1] };
    }

    // Facebook patterns (reels, watch, videos)
    const facebookMatch = url.match(/(?:facebook\.com|fb\.watch)\/(?:reel|watch|.*\/videos)\/([\w.-]+)/);
    if (facebookMatch) {
      return { type: 'facebook', id: facebookMatch[1] };
    }

    return { type: null, id: null };
  };

  const addVideo = () => {
    setVideoError(null);
    
    if (!newVideoUrl.trim()) {
      setVideoError('Please enter a video URL');
      return;
    }

    if (!isValidVideoUrl(newVideoUrl)) {
      setVideoError('Please enter a valid YouTube, Vimeo, or Facebook URL');
      return;
    }

    if (formData.videos.includes(newVideoUrl)) {
      setVideoError('This video has already been added');
      return;
    }

    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, newVideoUrl]
    }));
    setNewVideoUrl('');
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Only accept image files
        if (!file.type.startsWith('image/')) {
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `horses/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('horse-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('horse-photos')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...uploadedUrls]
      }));
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      await uploadFiles(files);
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

    const files = e.dataTransfer.files;
    if (files) {
      await uploadFiles(files);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // Photo drag and drop reordering
  const handlePhotoDragStart = (e: React.DragEvent, index: number) => {
    setDraggedPhotoIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePhotoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handlePhotoDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    if (draggedPhotoIndex === null || draggedPhotoIndex === targetIndex) {
      setDraggedPhotoIndex(null);
      return;
    }

    const newPhotos = [...formData.photos];
    const [draggedPhoto] = newPhotos.splice(draggedPhotoIndex, 1);
    newPhotos.splice(targetIndex, 0, draggedPhoto);

    setFormData(prev => ({ ...prev, photos: newPhotos }));
    setDraggedPhotoIndex(null);
  };

  const handlePhotoDragEnd = () => {
    setDraggedPhotoIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save horse. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-stone-700 my-4">
        <div className="sticky top-0 bg-stone-900 border-b border-stone-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-stone-100">
            {horse?.id ? 'Edit Horse' : 'Add New Horse'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-stone-400 mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none"
                placeholder="Horse name"
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-2">Breed *</label>
              <input
                type="text"
                required
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none"
                placeholder="Quarter Horse, Paint, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-stone-400 mb-2">Age *</label>
              <input
                type="number"
                required
                min="0"
                max="40"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-2">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none"
              >
                <option value="Gelding">Gelding</option>
                <option value="Mare">Mare</option>
                <option value="Stallion">Stallion</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-2">Height *</label>
              <input
                type="text"
                required
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none"
                placeholder="15.2 hh"
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-2">Price *</label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none"
                placeholder="e.g. $4,500 or mid-fours"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-stone-400 mb-2">Temperament *</label>
              <select
                value={formData.temperament}
                onChange={(e) => setFormData({ ...formData, temperament: e.target.value as any })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none"
              >
                <option value="Calm">Calm</option>
                <option value="Moderate">Moderate</option>
                <option value="Spirited">Spirited</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-2">Suitable For *</label>
              <select
                value={formData.experience_level}
                onChange={(e) => setFormData({ ...formData, experience_level: e.target.value as any })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none"
              >
                <option value="Beginner">Beginner Riders</option>
                <option value="Intermediate">Intermediate Riders</option>
                <option value="Advanced">Advanced Riders</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-2">Training Status *</label>
              <select
                value={formData.training_status}
                onChange={(e) => setFormData({ ...formData, training_status: e.target.value as any })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none"
              >
                <option value="Green">Green</option>
                <option value="In Training">In Training</option>
                <option value="Trained">Trained</option>
                <option value="Well Trained">Well Trained</option>
              </select>
            </div>
          </div>

          {/* Status & Visibility */}
          <div className="bg-stone-800/50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-stone-200">Status & Visibility</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-stone-400 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none"
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                  <option value="not_for_sale">Not For Sale</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="show_in_listing"
                  checked={formData.show_in_listing}
                  onChange={(e) => setFormData({ ...formData, show_in_listing: e.target.checked })}
                  className="w-5 h-5 rounded border-stone-600 bg-stone-800 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="show_in_listing" className="text-stone-300">
                  Show in public listing
                </label>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-stone-600 bg-stone-800 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="featured" className="text-stone-300">
                  Featured horse
                </label>
              </div>
            </div>
          </div>

          {/* Story */}
          <div>
            <label className="block text-sm text-stone-400 mb-2">Story / Description</label>
            <RichTextEditor
              value={formData.story}
              onChange={(value) => setFormData({ ...formData, story: value })}
              placeholder="Tell this horse's rescue story and describe their personality..."
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm text-stone-400 mb-2">Photos (drag to reorder)</label>
            <div className="space-y-4">
              {/* Photo Grid */}
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handlePhotoDragStart(e, index)}
                      onDragOver={handlePhotoDragOver}
                      onDrop={(e) => handlePhotoDrop(e, index)}
                      onDragEnd={handlePhotoDragEnd}
                      className={`relative aspect-square rounded-lg overflow-hidden group cursor-move transition-all ${
                        draggedPhotoIndex === index
                          ? 'opacity-50 ring-2 ring-red-500'
                          : ''
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                      <div className="absolute top-2 left-2 p-1.5 bg-black/60 rounded text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={14} />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 text-xs bg-red-700 px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button / Drop Zone */}
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
                {uploadingImages ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-red-500" size={32} />
                    <span className="text-stone-400">Uploading...</span>
                  </div>
                ) : isDragging ? (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="text-red-500" size={32} />
                    <span className="text-red-400">Drop photos here</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="text-stone-500" size={32} />
                    <span className="text-stone-400">Drag & drop photos here, or click to browse</span>
                    <span className="text-stone-600 text-sm">PNG, JPG up to 10MB each</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Videos */}
          <div>
            <label className="block text-sm text-stone-400 mb-2">
              <div className="flex items-center gap-2">
                <Video size={16} />
                Videos (YouTube, Vimeo, or Facebook)
              </div>
            </label>
            <div className="space-y-4">
              {/* Video List */}
              {formData.videos.length > 0 && (
                <div className="space-y-3">
                  {formData.videos.map((video, index) => {
                    const videoInfo = getVideoInfo(video);
                    return (
                      <div key={index} className="flex items-center gap-3 bg-stone-800/50 p-3 rounded-lg group">
                        {/* Video Thumbnail */}
                        <div className="w-24 h-16 bg-stone-700 rounded overflow-hidden flex-shrink-0 relative">
                          {videoInfo.type === 'youtube' && videoInfo.id ? (
                            <img
                              src={`https://img.youtube.com/vi/${videoInfo.id}/mqdefault.jpg`}
                              alt="Video thumbnail"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video className="text-stone-500" size={24} />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        {/* Video URL */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-stone-400 text-sm mb-1">
                            <LinkIcon size={12} />
                            <span className="capitalize">{videoInfo.type || 'Video'}</span>
                          </div>
                          <p className="text-stone-300 text-sm truncate">{video}</p>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="p-2 text-stone-500 hover:text-red-500 hover:bg-stone-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Video Input */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="url"
                    value={newVideoUrl}
                    onChange={(e) => {
                      setNewVideoUrl(e.target.value);
                      setVideoError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addVideo();
                      }
                    }}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none"
                    placeholder="Paste YouTube, Vimeo, or Facebook URL..."
                  />
                </div>
                <button
                  type="button"
                  onClick={addVideo}
                  className="px-4 py-3 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
              
              {videoError && (
                <p className="text-red-400 text-sm">{videoError}</p>
              )}
              
              <p className="text-stone-600 text-sm">
                Add videos to help potential adopters see this horse in action. Supports YouTube and Vimeo links.
              </p>
            </div>
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
              disabled={isSubmitting || uploadingImages}
              className="flex-1 px-6 py-3 bg-red-700 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                horse?.id ? 'Update Horse' : 'Add Horse'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HorseForm;
