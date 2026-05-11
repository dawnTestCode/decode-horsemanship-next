'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Loader2, ChevronDown, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  programDateId: string;
  sessionDate: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ageRange: string;
  referralSource: string;
  horseExperience: string;
  anythingToKnow: string;
  whatBroughtYou: string;
  agreeWaiver: boolean;
  agreePayment: boolean;
  digitalSignature: string;
}

const initialFormData: FormData = {
  programDateId: '',
  sessionDate: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  ageRange: '',
  referralSource: '',
  horseExperience: '',
  anythingToKnow: '',
  whatBroughtYou: '',
  agreeWaiver: false,
  agreePayment: false,
  digitalSignature: '',
};

const ageRanges = [
  { value: 'under-30', label: 'Under 30' },
  { value: '30-39', label: '30–39' },
  { value: '40-49', label: '40–49' },
  { value: '50-59', label: '50–59' },
  { value: '60+', label: '60+' },
];

const referralSources = [
  { value: 'friend', label: 'Friend referral' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'online', label: 'Online search' },
  { value: 'other', label: 'Other' },
];

const experienceLevels = [
  { value: 'none', label: 'None' },
  { value: 'a-little', label: 'A little' },
  { value: 'regular', label: 'Regular rider' },
  { value: 'own-horses', label: 'Own horses' },
];

// ─── Form Components ─────────────────────────────────────────────────────────

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
      <label className="block text-sm text-stone-400 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3
          text-stone-200 placeholder-stone-600
          focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/30
          transition-colors"
      />
      {hint && <p className="text-stone-600 text-xs mt-1.5">{hint}</p>}
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
      <label className="block text-sm text-stone-400 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full appearance-none bg-stone-800 border border-stone-700 rounded-lg
            px-4 py-3 text-stone-200
            focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/30
            transition-colors"
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
          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none"
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
      <label className="block text-sm text-stone-400 mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3
          text-stone-200 placeholder-stone-600 resize-none
          focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/30
          transition-colors"
      />
      {hint && <p className="text-stone-600 text-xs mt-1.5">{hint}</p>}
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
          className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
            checked
              ? 'bg-red-700 border-red-700'
              : 'bg-stone-800 border-stone-600 group-hover:border-stone-500'
          }`}
        >
          {checked && <Check size={14} className="text-white" strokeWidth={3} />}
        </div>
      </div>
      <span className="text-stone-300 text-sm">{label}</span>
    </label>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8 px-1 py-1">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              transition-all duration-200
              ${
                i < current
                  ? 'bg-red-700 text-white'
                  : i === current
                  ? 'bg-red-700 text-white ring-2 ring-red-500 ring-offset-2 ring-offset-stone-900'
                  : 'bg-stone-800 text-stone-500'
              }
            `}
          >
            {i < current ? <Check size={14} strokeWidth={3} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`flex-1 h-0.5 ${
                i < current ? 'bg-red-700' : 'bg-stone-800'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface RetreatDate {
  id: string;
  start_date: string;
  start_time: string | null;
  end_time: string | null;
  capacity: number | null;
  enrolled: number;
  status: string;
}

interface Program {
  id: string;
  full_price: number | null;
  max_capacity: number;
}

function WomensRetreatRegisterForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState<RetreatDate[]>([]);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  const steps = ['Date', 'About You', 'Questions', 'Payment'];
  const price = program?.full_price || 37500; // $375 default

  // Fetch available dates
  useEffect(() => {
    const fetchDates = async () => {
      try {
        // First get the program
        const { data: programData, error: programError } = await supabase
          .from('programs')
          .select('id, full_price, max_capacity')
          .eq('slug', 'womens-retreat')
          .single();

        if (programError || !programData) {
          console.error('Program not found:', programError);
          setLoading(false);
          return;
        }

        setProgram(programData);

        // Then get available dates
        const today = new Date().toISOString().split('T')[0];
        const { data: datesData, error: datesError } = await supabase
          .from('program_dates')
          .select('*')
          .eq('program_id', programData.id)
          .eq('status', 'open')
          .gte('start_date', today)
          .order('start_date', { ascending: true });

        if (datesError) {
          console.error('Error fetching dates:', datesError);
        } else {
          setDates(datesData || []);
          // Pre-select from URL param
          const dateParam = searchParams.get('date');
          if (dateParam) {
            const matchingDate = datesData?.find(d => d.start_date === dateParam);
            if (matchingDate) {
              setForm(prev => ({
                ...prev,
                programDateId: matchingDate.id,
                sessionDate: matchingDate.start_date,
              }));
            }
          }
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [searchParams]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH}:${minutes} ${ampm}`;
  };

  const dateOptions = dates.map((d) => {
    const capacity = d.capacity || program?.max_capacity || 8;
    const spotsLeft = capacity - d.enrolled;
    let label = formatDate(d.start_date);
    if (d.start_time) {
      label += ` · ${formatTime(d.start_time)}`;
    }
    if (spotsLeft < capacity) {
      label += ` (${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left)`;
    }
    return {
      value: d.id,
      label,
      disabled: spotsLeft <= 0,
    };
  });

  const handleDateChange = (dateId: string) => {
    const selectedDate = dates.find(d => d.id === dateId);
    setForm(prev => ({
      ...prev,
      programDateId: dateId,
      sessionDate: selectedDate?.start_date || '',
    }));
  };

  const updateForm = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return !!form.programDateId;
      case 1:
        return !!form.firstName && !!form.lastName && !!form.email && !!form.phone;
      case 2:
        return !!form.horseExperience;
      case 3:
        return form.agreeWaiver && form.agreePayment && !!form.digitalSignature;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/womens-retreat-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: price,
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
        <h2 className="text-xl font-bold text-white mb-2">Choose Your Date</h2>
        <p className="text-stone-400 text-sm">
          Select the retreat date you&apos;d like to attend.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-stone-400">
          <Loader2 className="animate-spin" size={18} />
          <span className="text-sm">Loading available dates...</span>
        </div>
      ) : dates.length === 0 ? (
        <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-6 text-center">
          <p className="text-stone-300 mb-2">No dates currently available.</p>
          <p className="text-stone-500 text-sm">
            <Link href="/eal/contact" className="text-red-500 hover:text-red-400">
              Contact us
            </Link>{' '}
            to join the waitlist.
          </p>
        </div>
      ) : (
        <Select
          label="Retreat Date"
          value={form.programDateId}
          onChange={handleDateChange}
          options={dateOptions}
          required
          placeholder="Select a date"
        />
      )}
    </div>
  );

  const stepPersonal = (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">About You</h2>
        <p className="text-stone-400 text-sm">
          Basic contact information.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={form.firstName}
          onChange={(v) => updateForm('firstName', v)}
          required
        />
        <Input
          label="Last Name"
          value={form.lastName}
          onChange={(v) => updateForm('lastName', v)}
          required
        />
      </div>

      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(v) => updateForm('email', v)}
        required
      />

      <Input
        label="Phone"
        type="tel"
        value={form.phone}
        onChange={(v) => updateForm('phone', v)}
        required
      />

      <Select
        label="Age Range"
        value={form.ageRange}
        onChange={(v) => updateForm('ageRange', v)}
        options={ageRanges}
        placeholder="Optional"
      />

      <Select
        label="How did you hear about us?"
        value={form.referralSource}
        onChange={(v) => updateForm('referralSource', v)}
        options={referralSources}
        placeholder="Optional"
      />
    </div>
  );

  const stepQuestions = (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">A Few Questions</h2>
        <p className="text-stone-400 text-sm">
          Brief answers help us prepare for your experience.
        </p>
      </div>

      <Select
        label="Any horse experience?"
        value={form.horseExperience}
        onChange={(v) => updateForm('horseExperience', v)}
        options={experienceLevels}
        required
      />

      <Input
        label="Anything we should know?"
        value={form.anythingToKnow}
        onChange={(v) => updateForm('anythingToKnow', v)}
        placeholder="Medical conditions, dietary restrictions, etc."
        hint="Optional"
      />

      <Textarea
        label="What brought you here?"
        value={form.whatBroughtYou}
        onChange={(v) => updateForm('whatBroughtYou', v)}
        placeholder="A sentence or two is fine. Feel free to skip if you prefer."
        hint="Optional"
        rows={3}
      />
    </div>
  );

  const stepPayment = (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Confirm & Pay</h2>
        <p className="text-stone-400 text-sm">
          Review your registration and complete payment.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-stone-900/50 border border-stone-800 rounded-xl overflow-hidden">
        <div className="bg-stone-800/50 px-5 py-3 border-b border-stone-700">
          <p className="text-stone-300 text-sm font-semibold">Registration Summary</p>
        </div>
        <div className="px-5 py-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-400">Name</span>
            <span className="text-stone-200 font-medium">
              {form.firstName} {form.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Email</span>
            <span className="text-stone-200">{form.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Date</span>
            <span className="text-stone-200">
              {form.sessionDate ? formatDate(form.sessionDate) : '—'}
            </span>
          </div>
          <div className="border-t border-stone-700 pt-3 mt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-stone-300">Total</span>
              <span className="text-white">${(price / 100).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Checkbox
          label={
            <span>
              I have read and agree to the{' '}
              <a
                href="https://forms.gle/DszFyex1HKBbLDw6A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400 underline"
              >
                liability waiver
              </a>
            </span>
          }
          checked={form.agreeWaiver}
          onChange={(v) => updateForm('agreeWaiver', v)}
        />

        <Checkbox
          label="I understand payment is due in full today and is non-refundable"
          checked={form.agreePayment}
          onChange={(v) => updateForm('agreePayment', v)}
        />
      </div>

      <div className="pt-4 border-t border-stone-800">
        <Input
          label="Digital Signature"
          value={form.digitalSignature}
          onChange={(v) => updateForm('digitalSignature', v)}
          required
          placeholder="Type your full name"
          hint="By typing your name, you agree to the terms above"
        />
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );

  const stepContent = [stepDate, stepPersonal, stepQuestions, stepPayment];
  const isLastStep = step === steps.length - 1;

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-stone-900 to-black min-h-screen">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/eal/no-reins"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-500 text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to No Reins
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Heart className="text-amber-500" size={28} />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              No Reins
            </h1>
          </div>
          <p className="text-stone-400">A Half-Day Retreat for Women</p>
        </div>

        {/* Progress */}
        <StepIndicator current={step} total={steps.length} />

        {/* Form */}
        <div className="bg-stone-900/80 rounded-2xl border border-stone-800 p-6 md:p-8">
          {stepContent[step]}

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-stone-800">
            {step > 0 && (
              <button
                onClick={() => {
                  setStep((s) => s - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2.5 border border-stone-700
                  hover:border-stone-500 text-stone-400 hover:text-stone-200
                  rounded-lg text-sm transition-colors"
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
                  px-6 py-3 bg-red-700 hover:bg-red-600
                  disabled:bg-stone-800 disabled:text-stone-600 disabled:cursor-not-allowed
                  text-white font-semibold rounded-lg transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Redirecting to checkout...
                  </>
                ) : (
                  <>
                    Pay ${(price / 100).toFixed(0)}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  setStep((s) => s + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2
                  px-6 py-3 bg-red-700 hover:bg-red-600
                  disabled:bg-stone-800 disabled:text-stone-600 disabled:cursor-not-allowed
                  text-white font-semibold rounded-lg transition-colors"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WomensRetreatRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 flex items-center justify-center">
          <Loader2 className="animate-spin text-red-500" size={32} />
        </div>
      }
    >
      <WomensRetreatRegisterForm />
    </Suspense>
  );
}
