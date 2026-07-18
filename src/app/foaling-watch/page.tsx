'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, ChevronDown, ChevronUp, Camera, X } from 'lucide-react';
import Image from 'next/image';

// Types
interface FoalingCheck {
  id: string;
  created_at: string;
  checker_name: string;
  udder_status: string;
  vulva_status: string;
  behavior_flags: string[];
  notes: string | null;
  photo_urls: string[];
}

// Constants
const UDDER_OPTIONS = [
  { value: 'none', label: 'None / Normal' },
  { value: 'filling', label: 'Filling' },
  { value: 'tight-full', label: 'Tight / Full' },
  { value: 'waxing', label: 'Waxing' },
  { value: 'dripping', label: 'Dripping milk' },
];

const VULVA_OPTIONS = [
  { value: 'same', label: 'Same as before' },
  { value: 'more-relaxed', label: 'More relaxed' },
  { value: 'very-loose', label: 'Very loose / elongated' },
];

const BEHAVIOR_FLAGS = [
  { value: 'restless', label: 'Restless / pacing' },
  { value: 'lying-down-repeatedly', label: 'Lying down repeatedly' },
  { value: 'pawing', label: 'Pawing' },
  { value: 'watching-flank', label: 'Biting at flank' },
  { value: 'sweating', label: 'Sweating' },
  { value: 'loose-stool', label: 'Loose stool' },
  { value: 'refusing-grain', label: 'Refusing grain' },
];

// Format timestamp as "July 17, 9:36pm"
function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 || 12;
  const minStr = minutes.toString().padStart(2, '0');
  return `${month} ${day}, ${hour12}:${minStr}${ampm}`;
}

// Get display label for status values
function getUdderLabel(value: string): string {
  return UDDER_OPTIONS.find(o => o.value === value)?.label || value;
}

function getVulvaLabel(value: string): string {
  return VULVA_OPTIONS.find(o => o.value === value)?.label || value;
}

function getBehaviorLabel(value: string): string {
  return BEHAVIOR_FLAGS.find(o => o.value === value)?.label || value;
}

export default function FoalingWatchPage() {
  // Form state
  const [formExpanded, setFormExpanded] = useState(true);
  const [checkerName, setCheckerName] = useState('');
  const [udderStatus, setUdderStatus] = useState('none');
  const [vulvaStatus, setVulvaStatus] = useState('same');
  const [behaviorFlags, setBehaviorFlags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Feed state
  const [checks, setChecks] = useState<FoalingCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Remember checker name in localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('foaling-watch-name');
    if (savedName) setCheckerName(savedName);
  }, []);

  // Fetch initial checks
  const fetchChecks = useCallback(async () => {
    const { data, error } = await supabase
      .from('foaling_checks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching checks:', error);
    } else {
      setChecks(data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchChecks();

    // Set up realtime subscription
    const channel = supabase
      .channel('foaling_checks_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'foaling_checks' },
        (payload) => {
          setChecks(prev => [payload.new as FoalingCheck, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchChecks]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Add new files to existing selection
    setSelectedFiles(prev => [...prev, ...files]);

    // Create preview URLs
    const newUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);
  };

  // Remove a selected file
  const removeFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Handle behavior flag toggle
  const toggleBehaviorFlag = (flag: string) => {
    setBehaviorFlags(prev =>
      prev.includes(flag)
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    );
  };

  // Upload photos to Supabase Storage
  const uploadPhotos = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];

    const urls: string[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setUploadProgress(`Uploading photo ${i + 1} of ${selectedFiles.length}...`);

      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${timestamp}-${random}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('foaling-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('foaling-photos')
        .getPublicUrl(fileName);

      urls.push(urlData.publicUrl);
    }

    return urls;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress(null);

    try {
      // Upload photos first
      const photoUrls = await uploadPhotos();
      setUploadProgress(null);

      // Insert check record
      const { error: insertError } = await supabase
        .from('foaling_checks')
        .insert({
          checker_name: checkerName.trim(),
          udder_status: udderStatus,
          vulva_status: vulvaStatus,
          behavior_flags: behaviorFlags,
          notes: notes.trim() || null,
          photo_urls: photoUrls,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Save name to localStorage for next time
      localStorage.setItem('foaling-watch-name', checkerName.trim());

      // Reset form (but keep checker name)
      setUdderStatus('none');
      setVulvaStatus('same');
      setBehaviorFlags([]);
      setNotes('');
      setSelectedFiles([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setSubmitSuccess(true);

      // Clear success message after a few seconds
      setTimeout(() => setSubmitSuccess(false), 3000);

      // Collapse form after successful submission
      setFormExpanded(false);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit check');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="bg-stone-900 border-b border-stone-800 px-4 py-6">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-800 flex-shrink-0 border-2 border-crimson-600">
            <Image
              src="/cali.png"
              alt="Cali"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-100">Foaling Watch</h1>
            <p className="text-stone-400 text-sm">Cali — Grulla Gypsy Vanner (maiden)</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Log a Check Form */}
        <section className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setFormExpanded(!formExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-800/50 transition-colors"
          >
            <span className="font-semibold text-lg">Log a Check</span>
            {formExpanded ? (
              <ChevronUp className="text-stone-400" size={20} />
            ) : (
              <ChevronDown className="text-stone-400" size={20} />
            )}
          </button>

          {formExpanded && (
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
              {/* Success Message */}
              {submitSuccess && (
                <div className="p-4 bg-crimson-900/30 border border-crimson-700 rounded-lg text-crimson-300 text-sm">
                  Check logged successfully!
                </div>
              )}

              {/* Checker Name */}
              <div>
                <label className="block text-sm text-stone-400 mb-2">Your Name *</label>
                <input
                  type="text"
                  required
                  value={checkerName}
                  onChange={(e) => setCheckerName(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-crimson-500 focus:outline-none transition-colors"
                  placeholder="Who's checking?"
                />
              </div>

              {/* Udder Status */}
              <div>
                <label className="block text-sm text-stone-400 mb-2">Udder Status *</label>
                <select
                  required
                  value={udderStatus}
                  onChange={(e) => setUdderStatus(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-crimson-500 focus:outline-none transition-colors"
                >
                  {UDDER_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Vulva/Tailhead Status */}
              <div>
                <label className="block text-sm text-stone-400 mb-2">Vulva / Tailhead Status *</label>
                <select
                  required
                  value={vulvaStatus}
                  onChange={(e) => setVulvaStatus(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-crimson-500 focus:outline-none transition-colors"
                >
                  {VULVA_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Behavior Flags */}
              <div>
                <label className="block text-sm text-stone-400 mb-3">Behavior (select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {BEHAVIOR_FLAGS.map(flag => (
                    <label
                      key={flag.value}
                      className={`
                        flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors
                        ${behaviorFlags.includes(flag.value)
                          ? 'bg-crimson-900/40 border-crimson-600 text-crimson-200'
                          : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-600'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={behaviorFlags.includes(flag.value)}
                        onChange={() => toggleBehaviorFlag(flag.value)}
                        className="sr-only"
                      />
                      <div className={`
                        w-4 h-4 rounded border flex items-center justify-center flex-shrink-0
                        ${behaviorFlags.includes(flag.value)
                          ? 'bg-crimson-600 border-crimson-600'
                          : 'border-stone-600'
                        }
                      `}>
                        {behaviorFlags.includes(flag.value) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm">{flag.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-stone-400 mb-2">Notes (optional)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-crimson-500 focus:outline-none transition-colors resize-none"
                  placeholder="Anything else to note..."
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm text-stone-400 mb-2">Photos (optional)</label>

                {/* Preview Grid */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-stone-800">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center hover:bg-black transition-colors"
                        >
                          <X size={14} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-800 border border-stone-700 border-dashed rounded-lg cursor-pointer hover:bg-stone-700/50 transition-colors">
                  <Camera size={20} className="text-stone-400" />
                  <span className="text-stone-300 text-sm">Add Photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
                  {submitError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !checkerName.trim()}
                className="w-full px-6 py-4 bg-crimson-700 hover:bg-crimson-600 disabled:bg-stone-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {uploadProgress || 'Submitting...'}
                  </>
                ) : (
                  'Log Check'
                )}
              </button>
            </form>
          )}
        </section>

        {/* Recent Checks Feed */}
        <section>
          <h2 className="text-lg font-semibold text-stone-200 mb-4">Recent Checks</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-stone-500" size={32} />
            </div>
          ) : checks.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              No checks logged yet. Be the first!
            </div>
          ) : (
            <div className="space-y-4">
              {checks.map(check => (
                <article
                  key={check.id}
                  className="bg-stone-900 rounded-xl border border-stone-800 p-4 space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-stone-200">{check.checker_name}</span>
                    <span className="text-sm text-stone-500">{formatTimestamp(check.created_at)}</span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-800 text-stone-300 border border-stone-700">
                      Udder: {getUdderLabel(check.udder_status)}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-800 text-stone-300 border border-stone-700">
                      Vulva: {getVulvaLabel(check.vulva_status)}
                    </span>
                  </div>

                  {/* Behavior Flags */}
                  {check.behavior_flags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {check.behavior_flags.map(flag => (
                        <span
                          key={flag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-crimson-900/40 text-crimson-300 border border-crimson-800"
                        >
                          {getBehaviorLabel(flag)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {check.notes && (
                    <p className="text-stone-400 text-sm whitespace-pre-wrap">{check.notes}</p>
                  )}

                  {/* Photos */}
                  {check.photo_urls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {check.photo_urls.map((url, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setLightboxUrl(url)}
                          className="relative aspect-square rounded-lg overflow-hidden bg-stone-800 hover:opacity-90 transition-opacity"
                        >
                          <Image
                            src={url}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 33vw, 200px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-stone-700 transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
          <Image
            src={lightboxUrl}
            alt="Full size photo"
            width={1200}
            height={1200}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
