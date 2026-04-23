'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Loader2, ChevronDown } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
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
  agreeDeposit: boolean;
  digitalSignature: string;
}

const initialFormData: FormData = {
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
  agreeDeposit: false,
  digitalSignature: '',
};

const ageRanges = [
  { value: 'under-40', label: 'Under 40' },
  { value: '40-49', label: '40–49' },
  { value: '50-59', label: '50–59' },
  { value: '60-69', label: '60–69' },
  { value: '70+', label: '70+' },
];

const referralSources = [
  { value: 'friend', label: 'Friend referral' },
  { value: 'card', label: 'From a card' },
  { value: 'online', label: 'Online search' },
  { value: 'other', label: 'Other' },
];

const experienceLevels = [
  { value: 'none', label: 'None' },
  { value: 'a-little', label: 'A little' },
  { value: 'regular', label: 'Regular rider' },
  { value: 'own-horses', label: 'Own horses' },
];

const availableSessions = [
  { value: 'tba-1', label: 'Date TBA — email to be notified' },
  { value: 'tba-2', label: 'Date TBA — email to be notified' },
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
      <label className="block font-sans text-sm text-groundwork-muted mb-1.5">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-groundwork-border rounded px-4 py-3
          font-sans text-groundwork-dark placeholder-groundwork-label/50
          focus:border-groundwork-dark focus:outline-none focus:ring-1 focus:ring-groundwork-dark/20
          transition-colors"
      />
      {hint && <p className="font-sans text-groundwork-label text-xs mt-1.5">{hint}</p>}
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
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block font-sans text-sm text-groundwork-muted mb-1.5">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full appearance-none bg-white border border-groundwork-border rounded
            px-4 py-3 font-sans text-groundwork-dark
            focus:border-groundwork-dark focus:outline-none focus:ring-1 focus:ring-groundwork-dark/20
            transition-colors"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-groundwork-muted pointer-events-none"
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
      <label className="block font-sans text-sm text-groundwork-muted mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-white border border-groundwork-border rounded px-4 py-3
          font-sans text-groundwork-dark placeholder-groundwork-label/50 resize-none
          focus:border-groundwork-dark focus:outline-none focus:ring-1 focus:ring-groundwork-dark/20
          transition-colors"
      />
      {hint && <p className="font-sans text-groundwork-label text-xs mt-1.5">{hint}</p>}
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
              ? 'bg-groundwork-dark border-groundwork-dark'
              : 'bg-white border-groundwork-border group-hover:border-groundwork-muted'
          }`}
        >
          {checked && <Check size={14} className="text-groundwork-cream" strokeWidth={3} />}
        </div>
      </div>
      <span className="font-sans text-sm text-groundwork-dark/90">{label}</span>
    </label>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center font-sans text-sm font-medium
              transition-all duration-200
              ${
                i < current
                  ? 'bg-groundwork-dark text-groundwork-cream'
                  : i === current
                  ? 'bg-groundwork-dark text-groundwork-cream ring-2 ring-groundwork-dark/30 ring-offset-2 ring-offset-groundwork-cream'
                  : 'bg-groundwork-border text-groundwork-muted'
              }
            `}
          >
            {i < current ? <Check size={14} strokeWidth={3} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`flex-1 h-0.5 ${
                i < current ? 'bg-groundwork-dark' : 'bg-groundwork-border'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function GroundworkRegisterPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = ['Session', 'About You', 'Questions', 'Agreement'];

  const updateForm = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return !!form.sessionDate;
      case 1:
        return !!form.firstName && !!form.lastName && !!form.email && !!form.phone;
      case 2:
        return !!form.horseExperience;
      case 3:
        return form.agreeWaiver && form.agreeDeposit && !!form.digitalSignature;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/groundwork-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          depositAmount: 20000,
          totalPrice: 85000,
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

  const stepSession = (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-groundwork-dark mb-2">Select a Date</h2>
        <p className="font-sans text-groundwork-muted text-sm">
          Choose the session you&apos;d like to attend.
        </p>
      </div>

      <Select
        label="Session Date"
        value={form.sessionDate}
        onChange={(v) => updateForm('sessionDate', v)}
        options={availableSessions}
        required
      />
    </div>
  );

  const stepPersonal = (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-groundwork-dark mb-2">About You</h2>
        <p className="font-sans text-groundwork-muted text-sm">
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
        label="How did you hear about Groundwork?"
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
        <h2 className="font-serif text-2xl text-groundwork-dark mb-2">A Few Questions</h2>
        <p className="font-sans text-groundwork-muted text-sm">
          Brief answers help us prepare.
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
        placeholder="Medical conditions, dietary restrictions, or anything else relevant."
        hint="Optional"
      />

      <Textarea
        label="What brought you here?"
        value={form.whatBroughtYou}
        onChange={(v) => updateForm('whatBroughtYou', v)}
        placeholder="One or two sentences is fine. If you'd rather skip this, leave it blank."
        hint="Optional"
        rows={3}
      />
    </div>
  );

  const stepAgreement = (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-groundwork-dark mb-2">Acknowledgments</h2>
        <p className="font-sans text-groundwork-muted text-sm">
          Review and confirm.
        </p>
      </div>

      <div className="space-y-5">
        <Checkbox
          label={
            <span>
              I have read and agree to the{' '}
              <a
                href="https://forms.gle/DszFyex1HKBbLDw6A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-groundwork-dark underline hover:no-underline"
              >
                liability waiver
              </a>
            </span>
          }
          checked={form.agreeWaiver}
          onChange={(v) => updateForm('agreeWaiver', v)}
        />

        <Checkbox
          label="I understand the $200 deposit is non-refundable, and the balance is due 14 days before the session"
          checked={form.agreeDeposit}
          onChange={(v) => updateForm('agreeDeposit', v)}
        />
      </div>

      <div className="pt-4 border-t border-groundwork-border-light">
        <Input
          label="Digital Signature"
          value={form.digitalSignature}
          onChange={(v) => updateForm('digitalSignature', v)}
          required
          placeholder="Type your full name"
          hint="By typing your name, you agree to the terms above"
        />
      </div>

      {/* Payment summary */}
      <div className="bg-white border border-groundwork-border rounded-lg p-6 mt-8">
        <p className="font-sans text-sm text-groundwork-muted mb-4">Payment Summary</p>
        <div className="space-y-3 font-sans text-sm">
          <div className="flex justify-between">
            <span className="text-groundwork-muted">Session fee</span>
            <span className="text-groundwork-dark">$850</span>
          </div>
          <div className="flex justify-between">
            <span className="text-groundwork-muted">Deposit due today</span>
            <span className="text-groundwork-dark font-medium text-lg">$200</span>
          </div>
          <div className="flex justify-between text-groundwork-label">
            <span>Balance due later</span>
            <span>$650</span>
          </div>
        </div>
        <p className="font-sans text-xs text-groundwork-label mt-4 pt-4 border-t border-groundwork-border-light">
          You&apos;ll only be charged $200 today to hold your spot.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="font-sans text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );

  const stepContent = [stepSession, stepPersonal, stepQuestions, stepAgreement];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-groundwork-cream font-serif">
      <section className="py-12 px-4 min-h-screen">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/groundwork"
              className="inline-flex items-center gap-2 font-sans text-sm text-groundwork-muted hover:text-groundwork-dark transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back to Groundwork
            </Link>
            <h1 className="text-3xl font-serif font-medium text-groundwork-dark">
              Reserve a Spot
            </h1>
          </div>

          {/* Progress */}
          <StepIndicator current={step} total={steps.length} />

          {/* Form */}
          <div className="bg-groundwork-cream">
            {stepContent[step]}

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-10 pt-8 border-t border-groundwork-border-light">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 border border-groundwork-border
                    hover:border-groundwork-muted text-groundwork-muted hover:text-groundwork-dark
                    rounded font-sans text-sm transition-colors"
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
                    px-6 py-3 bg-groundwork-dark hover:bg-groundwork-dark/90
                    disabled:bg-groundwork-border disabled:text-groundwork-muted disabled:cursor-not-allowed
                    text-groundwork-cream font-sans font-medium rounded transition-colors"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      Pay $200 Deposit
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="flex-1 flex items-center justify-center gap-2
                    px-6 py-3 bg-groundwork-dark hover:bg-groundwork-dark/90
                    disabled:bg-groundwork-border disabled:text-groundwork-muted disabled:cursor-not-allowed
                    text-groundwork-cream font-sans font-medium rounded transition-colors"
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
