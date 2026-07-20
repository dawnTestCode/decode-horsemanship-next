'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLogin from '@/components/admin/AdminLogin';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

type ContactType = 'visited' | 'cold_called' | 'emailed' | 'other';

type CommunityRow = {
  id: string;
  name: string;
  coordinator_name: string | null;
  coordinator_email: string | null;
  coordinator_phone: string | null;
  notes: string | null;
  last_contact_type: ContactType | null;
  last_contact_date: string | null;
  last_contact_summary: string | null;
};

const CONTACT_LABELS: Record<ContactType, string> = {
  visited: 'Visited in person',
  cold_called: 'Cold called',
  emailed: 'Emailed',
  other: 'Other',
};

const TEAM_MEMBERS = ['Dawn', 'Michael'] as const;

const CONTACT_STYLES: Record<ContactType, string> = {
  visited: 'bg-[#9E1B32] text-white',
  cold_called: 'bg-[#3A3A3A] text-white',
  emailed: 'bg-[#E9E4DE] text-[#1A1A1A]',
  other: 'bg-white text-[#6B6B6B] border border-[#D8D3CC]',
};

export default function CommunityCRM() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [rows, setRows] = useState<CommunityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ContactType | 'all'>('all');

  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<CommunityRow | null>(null);

  const [logModalFor, setLogModalFor] = useState<CommunityRow | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const storedToken = localStorage.getItem('admin_token');
    const expiresAt = localStorage.getItem('admin_token_expires');

    if (storedToken && expiresAt) {
      if (new Date(expiresAt) > new Date()) {
        try {
          const { data } = await supabase.functions.invoke('admin-auth', {
            body: { action: 'verify', token: storedToken }
          });

          if (data?.valid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_token_expires');
          }
        } catch {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_token_expires');
        }
      } else {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_token_expires');
      }
    }
    setAuthLoading(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  async function loadRows() {
    setLoading(true);
    const { data, error } = await supabase
      .from('communities_with_last_contact')
      .select('*')
      .order('name', { ascending: true });
    if (!error && data) setRows(data as CommunityRow[]);
    setLoading(false);
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadRows();
    }
  }, [isAuthenticated]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.coordinator_name ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'all' || r.last_contact_type === filterType;
      return matchesSearch && matchesType;
    });
  }, [rows, search, filterType]);

  async function deleteCommunity(id: string) {
    if (!confirm('Remove this community and its contact history? This cannot be undone.')) return;
    await supabase.from('communities').delete().eq('id', id);
    loadRows();
  }

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#9E1B32]" />
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F3F0]">
        <div className="pt-12 pb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Community Outreach
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Admin access required
          </p>
        </div>
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3F0] text-[#1A1A1A] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#9E1B32] pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black">
              Community Outreach
            </h1>
            <p className="text-sm text-[#6B6B6B]">
              Every community we&apos;ve reached out to, and where things stand.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingCommunity(null);
              setShowCommunityModal(true);
            }}
            className="bg-[#9E1B32] hover:bg-[#7A1526] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            + Add community
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by community or coordinator..."
            className="flex-1 border border-[#D8D3CC] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9E1B32]"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ContactType | 'all')}
            className="border border-[#D8D3CC] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9E1B32]"
          >
            <option value="all">All contact types</option>
            {Object.entries(CONTACT_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E3E0DB] rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-[#6B6B6B]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#6B6B6B]">
              No communities yet. Add the first one to get started.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-white text-left">
                  <th className="px-4 py-3 font-medium">Community</th>
                  <th className="px-4 py-3 font-medium">Coordinator</th>
                  <th className="px-4 py-3 font-medium">Last contact</th>
                  <th className="px-4 py-3 font-medium">Summary</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-[#E3E0DB] align-top">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-[#3A3A3A]">
                      {r.coordinator_name || <span className="text-[#B0ABA3]">Unknown</span>}
                      {r.coordinator_email && (
                        <div className="text-xs text-[#6B6B6B]">{r.coordinator_email}</div>
                      )}
                      {r.coordinator_phone && (
                        <div className="text-xs text-[#6B6B6B]">{r.coordinator_phone}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.last_contact_type ? (
                        <div className="space-y-1">
                          <span className={`inline-block text-xs px-2 py-1 rounded-full ${CONTACT_STYLES[r.last_contact_type]}`}>
                            {CONTACT_LABELS[r.last_contact_type]}
                          </span>
                          <div className="text-xs text-[#6B6B6B]">{r.last_contact_date}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-[#B0ABA3]">No contact logged</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#3A3A3A] max-w-xs">
                      {r.last_contact_summary || <span className="text-[#B0ABA3]">&mdash;</span>}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setLogModalFor(r)}
                        className="text-[#9E1B32] hover:underline text-xs font-medium mr-3"
                      >
                        Log contact
                      </button>
                      <button
                        onClick={() => {
                          setEditingCommunity(r);
                          setShowCommunityModal(true);
                        }}
                        className="text-[#3A3A3A] hover:underline text-xs font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCommunity(r.id)}
                        className="text-[#6B6B6B] hover:underline text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showCommunityModal && (
        <CommunityModal
          community={editingCommunity}
          onClose={() => setShowCommunityModal(false)}
          onSaved={() => {
            setShowCommunityModal(false);
            loadRows();
          }}
        />
      )}

      {logModalFor && (
        <LogContactModal
          community={logModalFor}
          onClose={() => setLogModalFor(null)}
          onSaved={() => {
            setLogModalFor(null);
            loadRows();
          }}
        />
      )}
    </div>
  );
}

function ModalShell({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black">{title}</h2>
          <button onClick={onClose} className="text-[#6B6B6B] hover:text-black text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CommunityModal({
  community,
  onClose,
  onSaved,
}: {
  community: CommunityRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(community?.name ?? '');
  const [coordinatorName, setCoordinatorName] = useState(community?.coordinator_name ?? '');
  const [coordinatorEmail, setCoordinatorEmail] = useState(community?.coordinator_email ?? '');
  const [coordinatorPhone, setCoordinatorPhone] = useState(community?.coordinator_phone ?? '');
  const [notes, setNotes] = useState(community?.notes ?? '');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    const payload = {
      name: name.trim(),
      coordinator_name: coordinatorName.trim() || null,
      coordinator_email: coordinatorEmail.trim() || null,
      coordinator_phone: coordinatorPhone.trim() || null,
      notes: notes.trim() || null,
    };
    if (community) {
      await supabase.from('communities').update(payload).eq('id', community.id);
    } else {
      await supabase.from('communities').insert(payload);
    }
    setSaving(false);
    onSaved();
  }

  return (
    <ModalShell title={community ? 'Edit community' : 'Add community'} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Community name">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]" placeholder="e.g. Carol Woods Retirement Community" />
        </Field>
        <Field label="Event coordinator (if known)">
          <input value={coordinatorName} onChange={(e) => setCoordinatorName(e.target.value)} className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]" placeholder="Name" />
        </Field>
        <Field label="Coordinator email">
          <input type="email" value={coordinatorEmail} onChange={(e) => setCoordinatorEmail(e.target.value)} className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]" placeholder="email@example.com" />
        </Field>
        <Field label="Coordinator phone">
          <input type="tel" value={coordinatorPhone} onChange={(e) => setCoordinatorPhone(e.target.value)} className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]" placeholder="(555) 123-4567" />
        </Field>
        <Field label="Notes">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]" rows={3} placeholder="Anything standing/general about this community" />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="text-sm px-3 py-2 text-[#6B6B6B]">Cancel</button>
          <button
            onClick={save}
            disabled={saving || !name.trim()}
            className="text-sm px-4 py-2 bg-[#9E1B32] hover:bg-[#7A1526] text-white rounded-md disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function LogContactModal({
  community,
  onClose,
  onSaved,
}: {
  community: CommunityRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [contactType, setContactType] = useState<ContactType>('emailed');
  const [contactedBy, setContactedBy] = useState<string>(TEAM_MEMBERS[0]);
  const [contactDate, setContactDate] = useState(new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!summary.trim()) return;
    setSaving(true);
    await supabase.from('contact_logs').insert({
      community_id: community.id,
      contact_type: contactType,
      contacted_by: contactedBy,
      contact_date: contactDate,
      summary: summary.trim(),
    });
    setSaving(false);
    onSaved();
  }

  return (
    <ModalShell title={`Log contact — ${community.name}`} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Contact type">
          <select value={contactType} onChange={(e) => setContactType(e.target.value as ContactType)} className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]">
            {Object.entries(CONTACT_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </Field>
        <Field label="Contacted by">
          <select value={contactedBy} onChange={(e) => setContactedBy(e.target.value)} className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]">
            {TEAM_MEMBERS.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </Field>
        <Field label="Date">
          <input type="date" value={contactDate} onChange={(e) => setContactDate(e.target.value)} className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]" />
        </Field>
        <Field label="Summary">
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]"
            rows={4}
            placeholder="What happened, who you spoke with, next steps..."
          />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="text-sm px-3 py-2 text-[#6B6B6B]">Cancel</button>
          <button
            onClick={save}
            disabled={saving || !summary.trim()}
            className="text-sm px-4 py-2 bg-[#9E1B32] hover:bg-[#7A1526] text-white rounded-md disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-[#6B6B6B] mb-1">{label}</span>
      {children}
    </label>
  );
}
