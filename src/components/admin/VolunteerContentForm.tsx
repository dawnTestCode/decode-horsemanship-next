'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, MapPin, FileText, Utensils, Calendar, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import RichTextEditor from './RichTextEditor';
import ImageDropzone from './ImageDropzone';

interface VolunteerContent {
  id: string;
  section_key: string;
  title: string;
  content: string;
  content_type: 'richtext' | 'embed' | 'image' | 'pdf';
  is_visible: boolean;
  sort_order: number;
}

interface VolunteerContentFormProps {
  item: VolunteerContent;
  onSave: (item: VolunteerContent) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const sectionIcons: Record<string, React.ReactNode> = {
  property_map: <MapPin className="w-5 h-5" />,
  procedures: <FileText className="w-5 h-5" />,
  feed_charts: <Utensils className="w-5 h-5" />,
  calendar: <Calendar className="w-5 h-5" />,
};

const VolunteerContentForm: React.FC<VolunteerContentFormProps> = ({
  item,
  onSave,
  onCancel,
  isSaving,
}) => {
  const [formData, setFormData] = useState<VolunteerContent>(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderContentEditor = () => {
    // Property Map or Feed Chart - Image upload with drag & drop
    if (formData.section_key === 'property_map' || formData.section_key === 'feed_charts') {
      const label = formData.section_key === 'property_map' ? 'property map' : 'feed chart';
      return (
        <div>
          <p className="text-sm text-stone-400 mb-3">
            Drag & drop or click to upload an image of the {label}
          </p>

          <ImageDropzone
            currentImage={formData.content || null}
            onImageChange={(url) => setFormData({ ...formData, content: url || '' })}
            storagePath={`volunteer/${formData.section_key}`}
            aspectRatio="aspect-[16/9]"
          />

          {/* Or enter URL manually */}
          <div className="mt-4">
            <p className="text-sm text-stone-500 mb-2">Or paste an image URL:</p>
            <input
              type="url"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-700"
              placeholder="https://..."
            />
          </div>
        </div>
      );
    }

    // Procedures - PDF link
    if (formData.section_key === 'procedures') {
      return (
        <div>
          <p className="text-sm text-stone-400 mb-3">
            Enter a link to a PDF file (e.g., from Google Drive, Dropbox, or any direct PDF URL)
          </p>

          <input
            type="url"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-700"
            placeholder="https://drive.google.com/file/d/.../view or direct PDF URL"
          />

          <div className="mt-3 p-3 bg-stone-800/50 rounded-lg">
            <p className="text-xs text-stone-500">
              <strong>Tips:</strong><br />
              • For Google Drive: Use "Get link" and make sure it's set to "Anyone with the link can view"<br />
              • For direct PDFs: Paste the full URL ending in .pdf<br />
              • The PDF will be embedded on the volunteer portal page
            </p>
          </div>

          {formData.content && (
            <div className="mt-4">
              <a
                href={formData.content}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-500 hover:text-green-400"
              >
                <ExternalLink className="w-4 h-4" />
                Test link in new tab
              </a>
            </div>
          )}
        </div>
      );
    }

    // Calendar - Embed URL
    if (formData.section_key === 'calendar') {
      return (
        <div>
          <input
            type="url"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-700"
            placeholder="https://calendar.google.com/calendar/embed?src=..."
          />
          <p className="text-xs text-stone-500 mt-2">
            For Google Calendar: Go to Calendar Settings → Integrate Calendar → Copy the "Embed code" URL
          </p>
          {formData.content && (
            <div className="mt-4">
              <p className="text-sm text-stone-400 mb-2">Preview:</p>
              <div className="w-full h-64 rounded-lg overflow-hidden border border-stone-700 bg-stone-800">
                <iframe
                  src={formData.content}
                  className="w-full h-full"
                  frameBorder="0"
                />
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default - Rich text editor (for feed_charts and any others)
    return (
      <RichTextEditor
        value={formData.content}
        onChange={(value) => setFormData({ ...formData, content: value })}
        placeholder="Enter content for this section..."
      />
    );
  };

  const getContentTypeLabel = () => {
    switch (formData.section_key) {
      case 'property_map':
      case 'feed_charts':
        return 'Image (upload or URL)';
      case 'procedures':
        return 'PDF Link';
      case 'calendar':
        return 'Embed URL (Google Calendar)';
      default:
        return 'Rich Text';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-stone-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-stone-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {sectionIcons[item.section_key] || <FileText className="w-5 h-5 text-green-500" />}
            <h2 className="text-xl font-bold text-white">Edit {item.title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-stone-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm text-stone-400 mb-2">Section Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-700"
              required
            />
          </div>

          {/* Content Type Info */}
          <div className="mb-4 p-3 bg-stone-800/50 rounded-lg">
            <p className="text-sm text-stone-400">
              <span className="text-stone-300 font-medium">Content Type:</span>{' '}
              {getContentTypeLabel()}
            </p>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm text-stone-400 mb-2">Content</label>
            {renderContentEditor()}
          </div>

          {/* Visibility Toggle */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_visible}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                className="w-5 h-5 rounded border-stone-600 bg-stone-800 text-green-600 focus:ring-green-700"
              />
              <span className="text-stone-300">Show this section to volunteers</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VolunteerContentForm;
