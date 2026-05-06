'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Loader2, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  sessionId: string;
  sessionDate: string;
  name: string;
  email: string;
  phone: string;
  partySize: string;
  packageType: 'day-pass' | 'stay-for-fire' | '';
  message: string;
  agreeTerms: boolean;
}

const initialFormData: FormData = {
  sessionId: '',
  sessionDate: '',
  name: '',
  email: '',
  phone: '',
  partySize: '',
  packageType: '',
  message: '',
  agreeTerms: false,
};

interface DustLeatherSession {
  id: string;
  session_date: string;
  capacity: number;
  enrolled: number;
  status: string;
}

// ─── Styled Form Components ──────────────────────────────────────────────────

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block font-mono-old uppercase tracking-[0.25em] text-sage text-xs mb-2">
        {label}
        {required && <span className="text-ember ml-1">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-char border border-tobacco/40 text-bone font-body px-4 py-3
          placeholder-dust/50
          focus:outline-none focus:border-sage transition-colors"
      />
      {hint && <p className="font-body text-tobacco text-sm mt-1.5">{hint}</p>}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required,
  placeholder = 'Select one',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block font-mono-old uppercase tracking-[0.25em] text-sage text-xs mb-2">
        {label}
        {required && <span className="text-ember ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full appearance-none bg-char border border-tobacco/40 text-bone font-body
            px-4 py-3 focus:outline-none focus:border-sage transition-colors cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sage pointer-events-none"
        />
      </div>
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className="block font-mono-old uppercase tracking-[0.25em] text-sage text-xs mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-char border border-tobacco/40 text-bone font-body px-4 py-3
          placeholder-dust/50 resize-none
          focus:outline-none focus:border-sage transition-colors"
      />
      {hint && <p className="font-body text-tobacco text-sm mt-1.5">{hint}</p>}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 border-2 transition-colors flex items-center justify-center ${
            checked
              ? 'bg-field border-field'
              : 'bg-transparent border-tobacco/60 group-hover:border-sage'
          }`}
        >
          {checked && <Check size={14} className="text-bone" strokeWidth={3} />}
        </div>
      </div>
      <span className="font-body text-bone text-sm">{label}</span>
    </label>
  );
}

function RadioOption({
  label,
  description,
  price,
  value,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  price: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <label
      className={`block p-4 border cursor-pointer transition-colors ${
        checked
          ? 'border-field bg-field/10'
          : 'border-tobacco/30 hover:border-tobacco/60'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0 mt-1">
          <input
            type="radio"
            checked={checked}
            onChange={() => onChange(value)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              checked ? 'border-field' : 'border-tobacco/60'
            }`}
          >
            {checked && <div className="w-2.5 h-2.5 rounded-full bg-field" />}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <span className="font-body font-semibold text-bone">{label}</span>
            <span className="font-display text-bone text-xl">{price}</span>
          </div>
          <p className="font-voice italic text-dust text-sm mt-1">{description}</p>
        </div>
      </div>
    </label>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center font-mono-old text-sm
              transition-all duration-200
              ${
                i < current
                  ? 'bg-field text-bone'
                  : i === current
                  ? 'bg-field text-bone ring-2 ring-field/30 ring-offset-2 ring-offset-char'
                  : 'bg-tobacco/30 text-dust'
              }
            `}
          >
            {i < current ? <Check size={14} strokeWidth={3} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`flex-1 h-0.5 ${
                i < current ? 'bg-field' : 'bg-tobacco/30'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Main Form Component ─────────────────────────────────────────────────────

function DustLeatherRegisterForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<DustLeatherSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const steps = ['Date', 'Details', 'Confirm'];

  // Fetch available sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('dust_and_leather_sessions')
          .select('*')
          .eq('status', 'open')
          .gte('session_date', new Date().toISOString().split('T')[0])
          .order('session_date', { ascending: true });

        if (error) {
          console.log('Sessions not available:', error);
          setSessions([]);
        } else {
          setSessions(data || []);
          // Pre-select date from URL if provided
          const dateParam = searchParams.get('date');
          if (dateParam) {
            const session = data?.find(s => s.session_date === dateParam);
            if (session) {
              setForm(prev => ({
                ...prev,
                sessionId: session.id,
                sessionDate: dateParam,
              }));
            }
          }
        }
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessions();
  }, [searchParams]);

  // Format session for display
  const formatSessionDate = (dateStr: string) => {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Build session options
  const sessionOptions = sessions.map((s) => {
    const spotsLeft = s.capacity - s.enrolled;
    return {
      value: s.id,
      label: `${formatSessionDate(s.session_date)}${spotsLeft < s.capacity ? ` (${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left)` : ''}`,
      disabled: spotsLeft <= 0,
    };
  });

  const handleSessionChange = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    setForm(prev => ({
      ...prev,
      sessionId,
      sessionDate: session?.session_date || '',
    }));
  };

  const updateForm = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const getPrice = () => {
    const partySize = parseInt(form.partySize) || 1;
    if (form.packageType === 'day-pass') return 72500 * partySize;
    if (form.packageType === 'stay-for-fire') return 89500 * partySize;
    return 0;
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return !!form.sessionId && !!form.partySize && !!form.packageType;
      case 1:
        return !!form.name && !!form.email;
      case 2:
        return form.agreeTerms;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/dust-and-leather/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: form.sessionId,
          sessionDate: form.sessionDate,
          name: form.name,
          email: form.email,
          phone: form.phone,
          partySize: form.partySize,
          packageType: form.packageType,
          message: form.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      window.location.href = data.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setSubmitting(false);
    }
  };

  // ─── Step Content ──────────────────────────────────────────────────────────

  const stepDate = (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-bone text-2xl mb-2">Pick Your Day</h2>
        <p className="font-voice italic text-dust">
          Choose when you want to come and what kind of day you want.
        </p>
      </div>

      {loadingSessions ? (
        <div className="flex items-center gap-2 text-dust">
          <Loader2 className="animate-spin" size={18} />
          <span className="font-body text-sm">Loading available dates...</span>
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-6 border border-tobacco/30 text-center">
          <p className="font-body text-bone mb-2">No dates currently available.</p>
          <p className="font-voice italic text-dust text-sm">
            Text the horseman at (919) 244-2647 to request a date.
          </p>
        </div>
      ) : (
        <Select
          label="Date"
          value={form.sessionId}
          onChange={handleSessionChange}
          options={sessionOptions}
          required
          placeholder="Select a Saturday"
        />
      )}

      <Select
        label="How many men"
        value={form.partySize}
        onChange={(v) => updateForm('partySize', v)}
        options={[
          { value: '1', label: '1 (just me)' },
          { value: '2', label: '2 men' },
          { value: '3', label: '3 men' },
          { value: '4', label: '4 men' },
        ]}
        required
        placeholder="Select party size"
      />

      <div>
        <p className="font-mono-old uppercase tracking-[0.25em] text-sage text-xs mb-3">
          Package <span className="text-ember">*</span>
        </p>
        <div className="space-y-3">
          <RadioOption
            label="Day Pass"
            description="From sunup to four-thirty. Lunch and belt included."
            price="$725/person"
            value="day-pass"
            checked={form.packageType === 'day-pass'}
            onChange={(v) => updateForm('packageType', v as 'day-pass')}
          />
          <RadioOption
            label="Stay for the Fire"
            description="Day Pass plus Dutch oven supper, whiskey, and cards."
            price="$895/person"
            value="stay-for-fire"
            checked={form.packageType === 'stay-for-fire'}
            onChange={(v) => updateForm('packageType', v as 'stay-for-fire')}
          />
        </div>
      </div>
    </div>
  );

  const stepDetails = (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-bone text-2xl mb-2">Your Details</h2>
        <p className="font-voice italic text-dust">
          Who&apos;s booking this day?
        </p>
      </div>

      <Input
        label="Name"
        value={form.name}
        onChange={(v) => updateForm('name', v)}
        required
        placeholder="Your full name"
      />

      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(v) => updateForm('email', v)}
        required
        placeholder="you@example.com"
      />

      <Input
        label="Phone"
        type="tel"
        value={form.phone}
        onChange={(v) => updateForm('phone', v)}
        placeholder="Optional, but helpful"
        hint="We may text to confirm details"
      />

      <Textarea
        label="Anything we should know?"
        value={form.message}
        onChange={(v) => updateForm('message', v)}
        placeholder="Dietary restrictions, occasion, or anything else"
        hint="Optional"
        rows={3}
      />
    </div>
  );

  const selectedSession = sessions.find(s => s.id === form.sessionId);

  const stepConfirm = (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-bone text-2xl mb-2">Confirm & Pay</h2>
        <p className="font-voice italic text-dust">
          Review your booking and complete payment.
        </p>
      </div>

      {/* Summary */}
      <div className="border border-tobacco/30 divide-y divide-tobacco/20">
        <div className="p-4 flex justify-between">
          <span className="font-mono-old uppercase tracking-[0.2em] text-sage text-xs">Date</span>
          <span className="font-body text-bone">
            {selectedSession ? formatSessionDate(selectedSession.session_date) : '—'}
          </span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="font-mono-old uppercase tracking-[0.2em] text-sage text-xs">Party</span>
          <span className="font-body text-bone">{form.partySize} men</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="font-mono-old uppercase tracking-[0.2em] text-sage text-xs">Package</span>
          <span className="font-body text-bone">
            {form.packageType === 'day-pass' ? 'Day Pass' : 'Stay for the Fire'}
          </span>
        </div>
        <div className="p-4 flex justify-between items-baseline">
          <span className="font-mono-old uppercase tracking-[0.2em] text-sage text-xs">Total</span>
          <span className="font-display text-bone text-2xl">
            ${(getPrice() / 100).toLocaleString()}
          </span>
        </div>
      </div>

      <Checkbox
        label={
          <span>
            I understand this is a private booking for my group. Payment is due in full today.
            The horseman will reach out to confirm details.
          </span>
        }
        checked={form.agreeTerms}
        onChange={(v) => updateForm('agreeTerms', v)}
      />

      {error && (
        <div className="bg-ember/10 border border-ember/30 p-4">
          <p className="font-body text-ember text-sm">{error}</p>
        </div>
      )}
    </div>
  );

  const stepContent = [stepDate, stepDetails, stepConfirm];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-char">
      {/* Header */}
      <div className="py-3 border-b border-tobacco/20">
        <div className="max-w-lg mx-auto px-6">
          <p className="font-mono-old uppercase tracking-[0.2em] sm:tracking-[0.4em] text-sage text-[10px] sm:text-xs text-center">
            Decode Horsemanship · Chapel Hill, NC
          </p>
        </div>
      </div>

      <section className="py-10 px-6">
        <div className="max-w-lg mx-auto">
          {/* Back link */}
          <Link
            href="/dust-and-leather"
            className="inline-flex items-center gap-2 font-body text-sm text-sage hover:text-bone transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Dust & Leather
          </Link>

          {/* Title */}
          <h1 className="font-display text-bone text-3xl sm:text-4xl mb-8">
            Book the Day
          </h1>

          {/* Progress */}
          <StepIndicator current={step} total={steps.length} />

          {/* Form content */}
          <div>
            {stepContent[step]}

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-10 pt-8 border-t border-tobacco/20">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 border border-tobacco/40
                    hover:border-sage text-dust hover:text-bone
                    font-mono-old uppercase tracking-[0.2em] text-xs transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              )}

              {isLastStep ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !canProceed()}
                  className="flex-1 flex items-center justify-center gap-2
                    px-6 py-3 bg-field hover:bg-field-deep
                    disabled:bg-tobacco/30 disabled:text-dust disabled:cursor-not-allowed
                    text-bone font-mono-old uppercase tracking-[0.2em] text-sm transition-colors"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      Pay ${(getPrice() / 100).toLocaleString()}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="flex-1 flex items-center justify-center gap-2
                    px-6 py-3 bg-field hover:bg-field-deep
                    disabled:bg-tobacco/30 disabled:text-dust disabled:cursor-not-allowed
                    text-bone font-mono-old uppercase tracking-[0.2em] text-sm transition-colors"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function DustLeatherRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-char flex items-center justify-center">
          <Loader2 className="animate-spin text-sage" size={32} />
        </div>
      }
    >
      <DustLeatherRegisterForm />
    </Suspense>
  );
}
