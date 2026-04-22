'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  Sun,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSummerCampSessions } from '@/hooks/useSummerCampSessions';

const tiers = [
  { value: 'explorers', label: 'Explorers (Ages 6–9)' },
  { value: 'trailblazers', label: 'Trailblazers (Ages 10–14)' },
];

const tshirtSizes = [
  { value: 'youth-s', label: 'Youth S' },
  { value: 'youth-m', label: 'Youth M' },
  { value: 'youth-l', label: 'Youth L' },
  { value: 'adult-s', label: 'Adult S' },
  { value: 'adult-m', label: 'Adult M' },
];

const experienceLevels = [
  { value: 'none', label: 'None' },
  { value: 'a-little', label: 'A little' },
  { value: 'regular', label: 'Regular rider' },
];

const referralSources = [
  { value: '', label: 'Select one' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'google', label: 'Google / Website' },
  { value: 'friend', label: 'Friend or family' },
  { value: 'returning', label: 'Returning camper' },
  { value: 'school', label: 'School / Flyer' },
  { value: 'other', label: 'Other' },
];

interface FormData {
  tier: string;
  session1: string;
  addSecondSession: boolean;
  session2: string;
  camperFirstName: string;
  camperLastName: string;
  camperDob: string;
  tshirtSize: string;
  horseExperience: string;
  referralSource: string;
  isSibling: boolean;
  siblingConfirmationCode: string;
  parentName: string;
  parentRelationship: string;
  parentEmail: string;
  parentPhone: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  allergies: string;
  medicalConditions: string;
  needsAccommodations: boolean;
  accommodationsDetails: string;
  photoRelease: boolean;
  agreeWaiver: boolean;
  agreeDeposit: boolean;
  agreeBalance: boolean;
  digitalSignature: string;
}

const initialFormData: FormData = {
  tier: '',
  session1: '',
  addSecondSession: false,
  session2: '',
  camperFirstName: '',
  camperLastName: '',
  camperDob: '',
  tshirtSize: '',
  horseExperience: '',
  referralSource: '',
  isSibling: false,
  siblingConfirmationCode: '',
  parentName: '',
  parentRelationship: 'Parent',
  parentEmail: '',
  parentPhone: '',
  emergencyName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
  allergies: '',
  medicalConditions: '',
  needsAccommodations: false,
  accommodationsDetails: '',
  photoRelease: true,
  agreeWaiver: false,
  agreeDeposit: false,
  agreeBalance: false,
  digitalSignature: '',
};

// Input Components
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
      {hint && <p className="text-stone-600 text-xs mt-1">{hint}</p>}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
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
          <option value="">Select one</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
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
  required,
  placeholder,
  hint,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm text-stone-400 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3
          text-stone-200 placeholder-stone-600 resize-none
          focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/30
          transition-colors"
      />
      {hint && <p className="text-stone-600 text-xs mt-1">{hint}</p>}
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
          className={`w-5 h-5 rounded border transition-colors ${
            checked
              ? 'bg-red-700 border-red-700'
              : 'bg-stone-800 border-stone-600 group-hover:border-stone-500'
          }`}
        >
          {checked && <CheckCircle size={20} className="text-white" />}
        </div>
      </div>
      <span className="text-stone-300 text-sm">{label}</span>
    </label>
  );
}

function RadioGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  options: { value: boolean; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm text-stone-400 mb-2">{label}</label>
      <div className="flex gap-4">
        {options.map((opt) => (
          <label
            key={String(opt.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                value === opt.value
                  ? 'border-red-500'
                  : 'border-stone-600 hover:border-stone-500'
              }`}
            >
              {value === opt.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              )}
            </div>
            <span className="text-stone-300 text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div
            className={`flex items-center gap-2 flex-shrink-0 ${
              i <= current ? 'text-white' : 'text-stone-600'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                i < current
                  ? 'bg-red-700 text-white'
                  : i === current
                  ? 'bg-red-700 text-white ring-2 ring-red-500 ring-offset-2 ring-offset-stone-900'
                  : 'bg-stone-800 text-stone-500'
              }`}
            >
              {i < current ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className="text-sm hidden sm:inline">{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 min-w-4 ${
                i < current ? 'bg-red-700' : 'bg-stone-800'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function SummerCampRegisterPage() {
  const { sessions, loading: sessionsLoading, formatDateRange, isAvailableForTier } = useSummerCampSessions();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = ['Session', 'Camper', 'Parent', 'Health', 'Agreement', 'Payment'];

  const updateForm = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const sessionCount = form.addSecondSession && form.session2 ? 2 : 1;
  const depositAmount = 100 * sessionCount;

  const selectedSession = sessions.find((s) => s.session_key === form.session1);
  const today = new Date().toISOString().split('T')[0];
  const isEarlyBird = selectedSession?.early_bird_deadline && today <= selectedSession.early_bird_deadline;

  const basePrice = 475;
  const discountPerType = 50;
  let totalDiscount = 0;
  if (isEarlyBird) totalDiscount += discountPerType;
  if (form.isSibling) totalDiscount += discountPerType;
  const pricePerSession = basePrice - totalDiscount;
  const totalPrice = pricePerSession * sessionCount;
  const balanceAmount = totalPrice - depositAmount;

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return !!form.tier && !!form.session1;
      case 1:
        return (
          !!form.camperFirstName &&
          !!form.camperLastName &&
          !!form.camperDob &&
          !!form.tshirtSize &&
          !!form.horseExperience
        );
      case 2:
        return (
          !!form.parentName &&
          !!form.parentEmail &&
          !!form.parentPhone &&
          !!form.emergencyName &&
          !!form.emergencyRelationship &&
          !!form.emergencyPhone
        );
      case 3:
        return !!form.allergies;
      case 4:
        return (
          form.agreeWaiver &&
          form.agreeDeposit &&
          form.agreeBalance &&
          !!form.digitalSignature
        );
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('summer-camp-checkout', {
        body: {
          ...form,
          sessionCount,
          depositAmount: depositAmount * 100,
          totalPrice: totalPrice * 100,
          isEarlyBird,
          discountType:
            isEarlyBird && form.isSibling
              ? 'early_bird_sibling'
              : form.isSibling
              ? 'sibling'
              : isEarlyBird
              ? 'early_bird'
              : null,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      window.location.href = data.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setSubmitting(false);
    }
  };

  const stepSession = (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Choose Your Session</h2>
        <p className="text-stone-400 text-sm">
          Select your camper&apos;s age group and preferred week(s).
        </p>
      </div>

      <Select
        label="Age Group / Tier"
        value={form.tier}
        onChange={(v) => updateForm('tier', v)}
        options={tiers}
        required
      />

      {sessionsLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin text-amber-500" size={24} />
        </div>
      ) : (
        <>
          <Select
            label="Session Week"
            value={form.session1}
            onChange={(v) => updateForm('session1', v)}
            options={sessions
              .filter((s) => !form.tier || isAvailableForTier(s, form.tier as 'explorers' | 'trailblazers'))
              .map((s) => ({
                value: s.session_key,
                label: `${s.name}: ${formatDateRange(s.start_date, s.end_date)}`,
              }))}
            required
          />

          <Checkbox
            label="Add a second session"
            checked={form.addSecondSession}
            onChange={(v) => updateForm('addSecondSession', v)}
          />

          {form.addSecondSession && (
            <Select
              label="Second Session Week"
              value={form.session2}
              onChange={(v) => updateForm('session2', v)}
              options={sessions
                .filter(
                  (s) =>
                    s.session_key !== form.session1 &&
                    (!form.tier || isAvailableForTier(s, form.tier as 'explorers' | 'trailblazers'))
                )
                .map((s) => ({
                  value: s.session_key,
                  label: `${s.name}: ${formatDateRange(s.start_date, s.end_date)}`,
                }))}
            />
          )}
        </>
      )}
    </div>
  );

  const stepCamper = (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Camper Information</h2>
        <p className="text-stone-400 text-sm">Tell us about your camper.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={form.camperFirstName}
          onChange={(v) => updateForm('camperFirstName', v)}
          required
          placeholder="Alex"
        />
        <Input
          label="Last Name"
          value={form.camperLastName}
          onChange={(v) => updateForm('camperLastName', v)}
          required
          placeholder="Smith"
        />
      </div>

      <Input
        label="Date of Birth"
        type="date"
        value={form.camperDob}
        onChange={(v) => updateForm('camperDob', v)}
        required
      />

      <Select
        label="T-Shirt Size"
        value={form.tshirtSize}
        onChange={(v) => updateForm('tshirtSize', v)}
        options={tshirtSizes}
        required
      />

      <Select
        label="Prior Horse Experience"
        value={form.horseExperience}
        onChange={(v) => updateForm('horseExperience', v)}
        options={experienceLevels}
        required
      />

      <Select
        label="How did you hear about Decode?"
        value={form.referralSource}
        onChange={(v) => updateForm('referralSource', v)}
        options={referralSources}
      />

      <div className="border-t border-stone-800 pt-6 mt-6">
        <Checkbox
          label={
            <span>
              This camper has a sibling already registered for summer camp
              <span className="text-amber-400 ml-1">($50 discount)</span>
            </span>
          }
          checked={form.isSibling}
          onChange={(v) => updateForm('isSibling', v)}
        />
        {form.isSibling && (
          <div className="mt-4">
            <Input
              label="Sibling's Confirmation Code"
              value={form.siblingConfirmationCode}
              onChange={(v) => updateForm('siblingConfirmationCode', v.toUpperCase())}
              placeholder="SC-XXXXXX"
              hint="Enter the confirmation code from your sibling's registration"
            />
          </div>
        )}
      </div>
    </div>
  );

  const stepParent = (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Parent / Guardian</h2>
        <p className="text-stone-400 text-sm">Primary contact for camp communications.</p>
      </div>

      <Input
        label="Parent/Guardian Name"
        value={form.parentName}
        onChange={(v) => updateForm('parentName', v)}
        required
        placeholder="Jordan Smith"
      />

      <Select
        label="Relationship to Camper"
        value={form.parentRelationship}
        onChange={(v) => updateForm('parentRelationship', v)}
        options={[
          { value: 'Parent', label: 'Parent' },
          { value: 'Guardian', label: 'Legal Guardian' },
          { value: 'Grandparent', label: 'Grandparent' },
          { value: 'Other', label: 'Other' },
        ]}
        required
      />

      <Input
        label="Email"
        type="email"
        value={form.parentEmail}
        onChange={(v) => updateForm('parentEmail', v)}
        required
        placeholder="jordan@example.com"
        hint="Confirmation and updates will be sent here"
      />

      <Input
        label="Phone (mobile preferred)"
        type="tel"
        value={form.parentPhone}
        onChange={(v) => updateForm('parentPhone', v)}
        required
        placeholder="(919) 555-0123"
      />

      <div className="border-t border-stone-800 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Emergency Contact</h3>
        <p className="text-stone-500 text-sm mb-4">Must be different from parent/guardian above.</p>

        <div className="space-y-4">
          <Input
            label="Emergency Contact Name"
            value={form.emergencyName}
            onChange={(v) => updateForm('emergencyName', v)}
            required
            placeholder="Full name"
          />

          <Input
            label="Relationship to Camper"
            value={form.emergencyRelationship}
            onChange={(v) => updateForm('emergencyRelationship', v)}
            required
            placeholder="e.g., Aunt, Neighbor, Family Friend"
          />

          <Input
            label="Emergency Contact Phone"
            type="tel"
            value={form.emergencyPhone}
            onChange={(v) => updateForm('emergencyPhone', v)}
            required
            placeholder="(919) 555-0456"
          />
        </div>
      </div>
    </div>
  );

  const stepHealth = (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Health & Safety</h2>
        <p className="text-stone-400 text-sm">Help us keep your camper safe and comfortable.</p>
      </div>

      <Textarea
        label="Allergies"
        value={form.allergies}
        onChange={(v) => updateForm('allergies', v)}
        required
        placeholder="List any allergies, or type 'None'"
        hint="We are not a nut-free facility"
      />

      <Textarea
        label="Medical Conditions or Medications"
        value={form.medicalConditions}
        onChange={(v) => updateForm('medicalConditions', v)}
        placeholder="Any conditions or medications we should know about (or leave blank)"
      />

      <RadioGroup
        label="Does your camper need special accommodations?"
        value={form.needsAccommodations}
        onChange={(v) => updateForm('needsAccommodations', v)}
        options={[
          { value: false, label: 'No' },
          { value: true, label: 'Yes' },
        ]}
      />

      {form.needsAccommodations && (
        <Textarea
          label="Please describe the accommodations needed"
          value={form.accommodationsDetails}
          onChange={(v) => updateForm('accommodationsDetails', v)}
          placeholder="We'll do our best to make it work"
        />
      )}

      <RadioGroup
        label="Photo/Video Release"
        value={form.photoRelease}
        onChange={(v) => updateForm('photoRelease', v)}
        options={[
          { value: true, label: 'Yes, I consent' },
          { value: false, label: 'No' },
        ]}
      />
      <p className="text-stone-600 text-xs -mt-4">
        Allow photos/videos of your camper for Decode Horsemanship promotional use (website, social media).
      </p>
    </div>
  );

  const stepAgreement = (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Liability & Agreement</h2>
        <p className="text-stone-400 text-sm">Please review and acknowledge the following.</p>
      </div>

      <div className="space-y-4">
        <Checkbox
          label={
            <span>
              I agree to complete the{' '}
              <a
                href="https://forms.gle/DszFyex1HKBbLDw6A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400 underline"
              >
                liability waiver
              </a>{' '}
              before the first day of camp
            </span>
          }
          checked={form.agreeWaiver}
          onChange={(v) => updateForm('agreeWaiver', v)}
        />

        <Checkbox
          label="I understand the $100 deposit is non-refundable"
          checked={form.agreeDeposit}
          onChange={(v) => updateForm('agreeDeposit', v)}
        />

        <Checkbox
          label="I understand the balance is due 2 weeks before the session start date"
          checked={form.agreeBalance}
          onChange={(v) => updateForm('agreeBalance', v)}
        />
      </div>

      <div className="border-t border-stone-800 pt-6 mt-6">
        <Input
          label="Digital Signature (type your full name)"
          value={form.digitalSignature}
          onChange={(v) => updateForm('digitalSignature', v)}
          required
          placeholder="Your full legal name"
          hint="By typing your name, you agree to the terms above"
        />
      </div>
    </div>
  );

  const stepPayment = (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Review & Pay</h2>
        <p className="text-stone-400 text-sm">Confirm your registration details before proceeding to payment.</p>
      </div>

      <div className="bg-stone-900/50 border border-stone-800 rounded-xl overflow-hidden">
        <div className="bg-stone-800/50 px-5 py-3 border-b border-stone-700">
          <p className="text-stone-300 text-sm font-semibold">Registration Summary</p>
        </div>
        <div className="px-5 py-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-400">Camper</span>
            <span className="text-stone-200 font-medium">
              {form.camperFirstName} {form.camperLastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Tier</span>
            <span className="text-stone-200">
              {form.tier === 'explorers' ? 'Explorers (6–9)' : 'Trailblazers (10–14)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Session(s)</span>
            <span className="text-stone-200 text-right">
              {(() => {
                const s1 = sessions.find((s) => s.session_key === form.session1);
                return s1 ? formatDateRange(s1.start_date, s1.end_date) : form.session1;
              })()}
              {form.addSecondSession && form.session2 && (
                <>
                  <br />
                  {(() => {
                    const s2 = sessions.find((s) => s.session_key === form.session2);
                    return s2 ? formatDateRange(s2.start_date, s2.end_date) : form.session2;
                  })()}
                </>
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Parent/Guardian</span>
            <span className="text-stone-200">{form.parentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Contact</span>
            <span className="text-stone-200">{form.parentEmail}</span>
          </div>

          <div className="border-t border-stone-700 pt-3 mt-3 space-y-2">
            <div className="flex justify-between text-stone-400 text-sm">
              <span>
                {sessionCount} session{sessionCount > 1 ? 's' : ''} × ${basePrice}
              </span>
              <span>${basePrice * sessionCount}</span>
            </div>
            {isEarlyBird && (
              <div className="flex justify-between text-amber-400 text-sm">
                <span>Early bird discount</span>
                <span>-${discountPerType * sessionCount}</span>
              </div>
            )}
            {form.isSibling && (
              <div className="flex justify-between text-amber-400 text-sm">
                <span>Sibling discount</span>
                <span>-${discountPerType * sessionCount}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-300">
              <span>Deposit due today</span>
              <span className="text-white font-bold text-lg">${depositAmount}</span>
            </div>
            <div className="flex justify-between text-stone-400 text-sm">
              <span>Balance due later</span>
              <span>${balanceAmount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-amber-900/20 border border-amber-800/50 rounded-lg p-4">
        <Sun size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-stone-200 text-sm font-medium mb-0.5">
            You&apos;ll only be charged ${depositAmount} today
          </p>
          <p className="text-stone-400 text-xs">
            This non-refundable deposit holds your spot. The remaining balance will be invoiced separately.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-stone-900/30 rounded-lg p-4 border border-stone-800">
        <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-stone-300 text-sm font-medium mb-0.5">Secure checkout via Stripe</p>
          <p className="text-stone-500 text-xs">
            You&apos;ll be redirected to Stripe to complete payment. Card details are never stored by Decode
            Horsemanship.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-900/20 border border-red-800 rounded-lg p-4">
          <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );

  const stepContent = [stepSession, stepCamper, stepParent, stepHealth, stepAgreement, stepPayment];

  const isLastStep = step === steps.length - 1;

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-stone-900 to-black min-h-screen">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <Link
            href="/summer-camp"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-300 text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Summer Camp
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Summer Camp <span className="text-red-500">Registration</span>
          </h1>
        </div>

        <StepIndicator current={step} steps={steps} />

        <div className="bg-stone-900/80 rounded-2xl border border-stone-800 p-6 md:p-8">
          {stepContent[step]}

          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-stone-800">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
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
                    Pay ${depositAmount} Deposit
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => s + 1)}
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
