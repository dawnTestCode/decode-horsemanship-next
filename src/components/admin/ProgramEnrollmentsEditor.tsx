'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Mail,
  Phone,
  DollarSign,
  ChevronDown,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Enrollment {
  id: string;
  program_id: string;
  program_date_id: string | null;
  participant_name: string;
  participant_email: string;
  participant_phone: string | null;
  participant_age: number | null;
  guardian_name: string | null;
  guardian_email: string | null;
  guardian_phone: string | null;
  guardian_relationship: string | null;
  referral_source: string | null;
  notes: string | null;
  payment_type: string;
  amount_paid: number;
  balance_due: number;
  balance_due_date: string | null;
  status: string;
  confirmation_code: string;
  confirmed_at: string | null;
  created_at: string;
  // Joined fields
  program_name?: string;
  program_slug?: string;
  date_start?: string;
  date_end?: string;
}

interface Program {
  id: string;
  name: string;
  slug: string;
}

const ProgramEnrollmentsEditor: React.FC<{ embedded?: boolean }> = ({ embedded }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedEnrollment, setExpandedEnrollment] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch programs for filter dropdown
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select('id, name, slug')
        .order('name');

      if (programsError) throw programsError;
      setPrograms(programsData || []);

      // Fetch enrollments with program and date info
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          *,
          programs:program_id (name, slug),
          program_dates:program_date_id (start_date, end_date)
        `)
        .order('created_at', { ascending: false });

      if (enrollmentsError) throw enrollmentsError;

      // Flatten the joined data
      const flattenedEnrollments = (enrollmentsData || []).map((e: any) => ({
        ...e,
        program_name: e.programs?.name,
        program_slug: e.programs?.slug,
        date_start: e.program_dates?.start_date,
        date_end: e.program_dates?.end_date,
      }));

      setEnrollments(flattenedEnrollments);
    } catch (err: any) {
      console.error('Error fetching enrollments:', err);
      setError('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update enrollment status
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === 'confirmed' && !enrollments.find(e => e.id === id)?.confirmed_at) {
        updates.confirmed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('enrollments')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setSuccess('Status updated!');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((e) => {
    if (filterProgram !== 'all' && e.program_id !== filterProgram) return false;
    if (filterStatus !== 'all' && e.status !== filterStatus) return false;
    return true;
  });

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateRange = (start: string, end: string | null) => {
    const startDate = new Date(start + 'T12:00:00');
    if (!end) return formatDate(start);
    const endDate = new Date(end + 'T12:00:00');
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });

    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()}–${endDate.getDate()}`;
    }
    return `${startMonth} ${startDate.getDate()} – ${endMonth} ${endDate.getDate()}`;
  };

  // Clear messages after delay
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-900/30 text-green-400';
      case 'pending':
        return 'bg-amber-900/30 text-amber-400';
      case 'cancelled':
        return 'bg-red-900/30 text-red-400';
      case 'refunded':
        return 'bg-stone-800 text-stone-400';
      default:
        return 'bg-stone-800 text-stone-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div>
      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-2 text-red-400">
          <AlertCircle size={18} />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <X size={16} />
          </button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-lg flex items-center gap-2 text-green-400">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm text-stone-400">Program:</label>
          <div className="relative">
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="appearance-none bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 pr-8 text-stone-200 text-sm"
            >
              <option value="all">All Programs</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-stone-400">Status:</label>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 pr-8 text-stone-200 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none"
            />
          </div>
        </div>

        <div className="ml-auto text-sm text-stone-500">
          {filteredEnrollments.length} enrollment{filteredEnrollments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Enrollments List */}
      {filteredEnrollments.length === 0 ? (
        <div className="text-center py-12 bg-stone-900/50 rounded-xl border border-stone-800">
          <Users className="mx-auto mb-4 text-stone-600" size={48} />
          <h3 className="text-lg font-semibold text-white mb-2">No Enrollments Found</h3>
          <p className="text-stone-400">
            {filterProgram !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your filters.'
              : 'Enrollments will appear here as participants sign up.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEnrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-stone-900/50 rounded-xl border border-stone-800 overflow-hidden"
            >
              {/* Main Row */}
              <div
                className="p-4 cursor-pointer hover:bg-stone-800/30 transition-colors"
                onClick={() =>
                  setExpandedEnrollment(
                    expandedEnrollment === enrollment.id ? null : enrollment.id
                  )
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="font-semibold text-white">
                        {enrollment.participant_name}
                      </h4>
                      <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">
                        {enrollment.confirmation_code}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${getStatusBadge(
                          enrollment.status
                        )}`}
                      >
                        {enrollment.status}
                      </span>
                    </div>
                    <p className="text-stone-400 text-sm mt-1">
                      {enrollment.program_name}
                      {enrollment.date_start && (
                        <span className="text-stone-500">
                          {' '}
                          · {formatDateRange(enrollment.date_start, enrollment.date_end || null)}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-green-400 font-medium">
                      ${(enrollment.amount_paid / 100).toFixed(0)} paid
                    </p>
                    {enrollment.balance_due > 0 && (
                      <p className="text-amber-400 text-sm">
                        ${(enrollment.balance_due / 100).toFixed(0)} due
                      </p>
                    )}
                    <p className="text-stone-600 text-xs mt-1">
                      {formatDate(enrollment.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedEnrollment === enrollment.id && (
                <div className="border-t border-stone-800 p-4 bg-stone-900/30">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Contact Info */}
                    <div>
                      <h5 className="text-sm font-semibold text-stone-300 mb-3">
                        Contact Information
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-stone-400">
                          <Mail size={14} />
                          <a
                            href={`mailto:${enrollment.participant_email}`}
                            className="text-blue-400 hover:underline"
                          >
                            {enrollment.participant_email}
                          </a>
                        </div>
                        {enrollment.participant_phone && (
                          <div className="flex items-center gap-2 text-stone-400">
                            <Phone size={14} />
                            {enrollment.participant_phone}
                          </div>
                        )}
                        {enrollment.participant_age && (
                          <p className="text-stone-400">
                            Age: {enrollment.participant_age}
                          </p>
                        )}
                      </div>

                      {/* Guardian Info */}
                      {enrollment.guardian_name && (
                        <div className="mt-4">
                          <h5 className="text-sm font-semibold text-stone-300 mb-2">
                            Guardian
                          </h5>
                          <p className="text-stone-400 text-sm">
                            {enrollment.guardian_name}
                            {enrollment.guardian_relationship && (
                              <span className="text-stone-500">
                                {' '}
                                ({enrollment.guardian_relationship})
                              </span>
                            )}
                          </p>
                          {enrollment.guardian_email && (
                            <p className="text-stone-400 text-sm">
                              {enrollment.guardian_email}
                            </p>
                          )}
                          {enrollment.guardian_phone && (
                            <p className="text-stone-400 text-sm">
                              {enrollment.guardian_phone}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Payment & Status */}
                    <div>
                      <h5 className="text-sm font-semibold text-stone-300 mb-3">
                        Payment Details
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-stone-400">
                          <span>Payment Type</span>
                          <span className="text-stone-200 capitalize">
                            {enrollment.payment_type}
                          </span>
                        </div>
                        <div className="flex justify-between text-stone-400">
                          <span>Amount Paid</span>
                          <span className="text-green-400">
                            ${(enrollment.amount_paid / 100).toFixed(2)}
                          </span>
                        </div>
                        {enrollment.balance_due > 0 && (
                          <>
                            <div className="flex justify-between text-stone-400">
                              <span>Balance Due</span>
                              <span className="text-amber-400">
                                ${(enrollment.balance_due / 100).toFixed(2)}
                              </span>
                            </div>
                            {enrollment.balance_due_date && (
                              <div className="flex justify-between text-stone-400">
                                <span>Due Date</span>
                                <span>{formatDate(enrollment.balance_due_date)}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Status Update */}
                      <div className="mt-4">
                        <h5 className="text-sm font-semibold text-stone-300 mb-2">
                          Update Status
                        </h5>
                        <div className="flex gap-2 flex-wrap">
                          {['confirmed', 'pending', 'cancelled', 'refunded'].map(
                            (status) => (
                              <button
                                key={status}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(enrollment.id, status);
                                }}
                                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                                  enrollment.status === status
                                    ? getStatusBadge(status)
                                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                                }`}
                              >
                                {status}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      {enrollment.notes && (
                        <div className="mt-4">
                          <h5 className="text-sm font-semibold text-stone-300 mb-2">
                            Notes
                          </h5>
                          <p className="text-stone-400 text-sm">{enrollment.notes}</p>
                        </div>
                      )}

                      {/* Referral */}
                      {enrollment.referral_source && (
                        <p className="text-stone-500 text-xs mt-4">
                          Referral: {enrollment.referral_source}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramEnrollmentsEditor;
