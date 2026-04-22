'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, Loader2, X, Move } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FocalPoint {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
}

interface ImageDropzoneProps {
  currentImage?: string | null;
  onImageChange: (url: string | null) => void;
  focalPoint?: FocalPoint;
  onFocalPointChange?: (point: FocalPoint) => void;
  storagePath?: string;
  className?: string;
  aspectRatio?: string;
  showFocalPointSelector?: boolean;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  currentImage,
  onImageChange,
  focalPoint = { x: 50, y: 50 },
  onFocalPointChange,
  storagePath = 'uploads',
  className = '',
  aspectRatio = 'aspect-[4/3]',
  showFocalPointSelector = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingFocalPoint, setIsSettingFocalPoint] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${storagePath}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('horse-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('horse-photos')
        .getPublicUrl(fileName);

      onImageChange(urlData.publicUrl);
      // Reset focal point to center for new images
      if (onFocalPointChange) {
        onFocalPointChange({ x: 50, y: 50 });
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onImageChange(null);
  };

  const handleFocalPointClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSettingFocalPoint || !imageContainerRef.current || !onFocalPointChange) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    onFocalPointChange({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  if (currentImage) {
    return (
      <div className={className}>
        <div
          ref={imageContainerRef}
          className={`relative ${aspectRatio} overflow-hidden rounded-lg border border-stone-700`}
          onClick={handleFocalPointClick}
          style={{ cursor: isSettingFocalPoint ? 'crosshair' : 'default' }}
        >
          <img
            src={currentImage}
            alt="Uploaded"
            className="w-full h-full object-cover"
            style={{
              objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
            }}
          />

          {/* Focal point indicator */}
          {showFocalPointSelector && onFocalPointChange && isSettingFocalPoint && (
            <div
              className="absolute w-8 h-8 border-2 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${focalPoint.x}%`,
                top: `${focalPoint.y}%`,
                boxShadow: '0 0 0 2px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          )}

          {/* Remove button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleRemove(); }}
            className="absolute top-2 right-2 p-2 bg-red-700 hover:bg-red-600 rounded-full text-white transition-colors shadow-lg"
          >
            <X size={16} />
          </button>
        </div>

        {/* Focal point toggle button */}
        {showFocalPointSelector && onFocalPointChange && (
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSettingFocalPoint(!isSettingFocalPoint)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isSettingFocalPoint
                  ? 'bg-red-700 text-white'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <Move size={16} />
              {isSettingFocalPoint ? 'Click image to set focus' : 'Adjust crop position'}
            </button>
            {isSettingFocalPoint && (
              <span className="text-xs text-stone-500">
                Click where you want the image centered
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <label
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full ${aspectRatio} border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          dragActive
            ? 'border-red-500 bg-red-500/10'
            : 'border-stone-700 hover:border-red-500 bg-stone-800/50'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={uploading}
        />
        {uploading ? (
          <div className="text-center">
            <Loader2 className="animate-spin text-red-500 mx-auto mb-2" size={32} />
            <span className="text-stone-400 text-sm">Uploading...</span>
          </div>
        ) : (
          <div className="text-center p-4">
            <Upload className={`mx-auto mb-2 ${dragActive ? 'text-red-500' : 'text-stone-500'}`} size={32} />
            <p className={`text-sm ${dragActive ? 'text-red-400' : 'text-stone-400'}`}>
              {dragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-stone-600 mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default ImageDropzone;
