'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, Clock, MessageSquare, Check, CheckCheck, Trash2, X, Loader2, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: string;
  horse_id: string | null;
  horse_name: string | null;
  message: string;
  status: 'unread' | 'read' | 'responded';
  admin_notes: string | null;
  created_at: string;
  read_at: string | null;
  responded_at: string | null;
}

interface InquiriesPanelProps {
  onClose: () => void;
}

const InquiriesPanel: React.FC<InquiriesPanelProps> = ({ onClose }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (err: any) {
      console.error('Error fetching inquiries:', err);
      setError('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const markAsRead = async (inquiry: Inquiry) => {
    if (inquiry.status !== 'unread') return;
    
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', inquiry.id);

      if (error) throw error;
      fetchInquiries();
    } catch (err: any) {
      console.error('Error marking as read:', err);
    }
  };

  const markAsResponded = async (inquiry: Inquiry) => {
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ 
          status: 'responded',
          responded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', inquiry.id);

      if (error) throw error;
      fetchInquiries();
    } catch (err: any) {
      console.error('Error marking as responded:', err);
    }
  };

  const saveNotes = async (inquiryId: string) => {
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ 
          admin_notes: notesText,
          updated_at: new Date().toISOString()
        })
        .eq('id', inquiryId);

      if (error) throw error;
      setEditingNotes(null);
      fetchInquiries();
    } catch (err: any) {
      console.error('Error saving notes:', err);
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDeleteConfirm(null);
      fetchInquiries();
    } catch (err: any) {
      console.error('Error deleting inquiry:', err);
    }
  };

  const toggleExpand = (inquiry: Inquiry) => {
    if (expandedId === inquiry.id) {
      setExpandedId(null);
    } else {
      setExpandedId(inquiry.id);
      if (inquiry.status === 'unread') {
        markAsRead(inquiry);
      }
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.horse_name && inquiry.horse_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    const matchesType = typeFilter === 'all' || inquiry.inquiry_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-red-700 text-red-100';
      case 'read':
        return 'bg-yellow-700 text-yellow-100';
      case 'responded':
        return 'bg-green-700 text-green-100';
      default:
        return 'bg-stone-700 text-stone-300';
    }
  };

  const getInquiryTypeBadge = (type: string) => {
    switch (type) {
      case 'adoption':
        return 'bg-red-900/50 text-red-300';
      case 'boarding':
        return 'bg-blue-900/50 text-blue-300';
      case 'volunteer':
        return 'bg-purple-900/50 text-purple-300';
      default:
        return 'bg-stone-800 text-stone-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const unreadCount = inquiries.filter(i => i.status === 'unread').length;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 bg-stone-900 border-b border-stone-700 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-800 rounded-lg transition-colors text-stone-400 hover:text-stone-200"
            >
              <X size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-stone-100">Contact Inquiries</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-red-400">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-stone-100">{inquiries.length}</div>
            <div className="text-stone-500 text-sm">Total Inquiries</div>
          </div>
          <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-500">
              {inquiries.filter(i => i.status === 'unread').length}
            </div>
            <div className="text-stone-500 text-sm">Unread</div>
          </div>
          <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-500">
              {inquiries.filter(i => i.status === 'read').length}
            </div>
            <div className="text-stone-500 text-sm">Awaiting Response</div>
          </div>
          <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-500">
              {inquiries.filter(i => i.status === 'responded').length}
            </div>
            <div className="text-stone-500 text-sm">Responded</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500" size={20} />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg pl-10 pr-4 py-2 text-stone-200 focus:border-red-500 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-stone-200 focus:border-red-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-stone-200 focus:border-red-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="adoption">Adoption</option>
            <option value="boarding">Boarding</option>
            <option value="general">General</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 flex items-center justify-between">
            {error}
            <button onClick={() => setError(null)} className="p-1 hover:bg-red-800 rounded">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Inquiries List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-red-500" size={40} />
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="mx-auto text-stone-600 mb-4" size={48} />
            <div className="text-stone-500">
              {inquiries.length === 0 ? 'No inquiries yet' : 'No inquiries match your filters'}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`bg-stone-900/50 border rounded-lg overflow-hidden transition-colors ${
                  inquiry.status === 'unread' 
                    ? 'border-red-700/50 bg-red-900/10' 
                    : 'border-stone-800'
                }`}
              >
                {/* Header Row */}
                <div 
                  className="p-4 cursor-pointer hover:bg-stone-800/30 transition-colors"
                  onClick={() => toggleExpand(inquiry)}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${inquiry.status === 'unread' ? 'text-stone-100' : 'text-stone-300'}`}>
                          {inquiry.name}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded capitalize ${getStatusBadge(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded capitalize ${getInquiryTypeBadge(inquiry.inquiry_type)}`}>
                          {inquiry.inquiry_type}
                        </span>
                        {inquiry.horse_name && (
                          <span className="text-xs px-2 py-0.5 rounded bg-red-900/30 text-red-300">
                            Re: {inquiry.horse_name}
                          </span>
                        )}
                      </div>
                      <p className="text-stone-500 text-sm truncate">{inquiry.message}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(inquiry.created_at)}
                      </span>
                      {expandedId === inquiry.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === inquiry.id && (
                  <div className="border-t border-stone-800 p-4 bg-stone-900/30">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Contact Info */}
                      <div>
                        <h4 className="text-sm font-semibold text-stone-400 mb-3">Contact Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-stone-300">
                            <User size={16} className="text-stone-500" />
                            {inquiry.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-stone-500" />
                            <a 
                              href={`mailto:${inquiry.email}`} 
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              {inquiry.email}
                            </a>
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={16} className="text-stone-500" />
                              <a 
                                href={`tel:${inquiry.phone}`} 
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                {inquiry.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <h4 className="text-sm font-semibold text-stone-400 mb-3">Message</h4>
                        <p className="text-stone-300 whitespace-pre-wrap">{inquiry.message}</p>
                      </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-stone-400 mb-3">Admin Notes</h4>
                      {editingNotes === inquiry.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2 text-stone-200 focus:border-red-500 focus:outline-none resize-none"
                            rows={3}
                            placeholder="Add notes about this inquiry..."
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); saveNotes(inquiry.id); }}
                              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                            >
                              Save Notes
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingNotes(null); }}
                              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={(e) => { e.stopPropagation(); setEditingNotes(inquiry.id); setNotesText(inquiry.admin_notes || ''); }}
                          className="p-3 bg-stone-800/50 rounded-lg text-stone-400 cursor-pointer hover:bg-stone-800 transition-colors min-h-[60px]"
                        >
                          {inquiry.admin_notes || 'Click to add notes...'}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-4 border-t border-stone-800 flex flex-wrap gap-3">
                      {inquiry.status !== 'responded' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markAsResponded(inquiry); }}
                          className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                        >
                          <CheckCheck size={16} />
                          Mark as Responded
                        </button>
                      )}
                      <a
                        href={`mailto:${inquiry.email}?subject=Re: Your inquiry about ${inquiry.horse_name || 'Decode Horsemanship'}`}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Mail size={16} />
                        Send Email
                      </a>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(inquiry.id); }}
                        className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 rounded-xl p-6 max-w-md w-full border border-stone-700">
            <h3 className="text-xl font-bold text-stone-100 mb-4">Delete Inquiry?</h3>
            <p className="text-stone-400 mb-6">
              Are you sure you want to delete this inquiry? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-stone-600 hover:border-stone-500 text-stone-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteInquiry(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesPanel;
