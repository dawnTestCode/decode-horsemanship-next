'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLogin from '@/components/admin/AdminLogin';
import { Loader2, Star, Bold, List, CalendarCheck, PhoneIncoming, PhoneOutgoing, GripVertical } from 'lucide-react';

type ContactType = 'visited' | 'cold_called' | 'emailed' | 'other';

type ContactDirection = 'inbound' | 'outbound';

type CommunityStatus = 'prospect' | 'active';

type CommunityRow = {
  id: string;
  name: string;
  main_phone: string | null;
  coordinator_name: string | null;
  coordinator_email: string | null;
  coordinator_phone: string | null;
  notes: string | null;
  status: CommunityStatus;
  priority: boolean;
  scheduled: boolean;
  last_contact_type: ContactType | null;
  last_contact_date: string | null;
  last_contact_summary: string | null;
  last_contact_direction: ContactDirection | null;
};

type ContactLog = {
  id: string;
  community_id: string;
  contact_type: ContactType;
  contacted_by: string | null;
  contact_date: string;
  summary: string;
  direction: ContactDirection;
  created_at: string;
};

type Script = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
};

type PageTab = 'communities' | 'scripts';

const CONTACT_LABELS: Record<ContactType, string> = {
  visited: 'Visited',
  cold_called: 'Called',
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

function getBusinessDaysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  let count = 0;
  const current = new Date(date);

  while (current < today) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
  }

  return count;
}

function isContactStale(lastContactDate: string | null, scheduled: boolean, direction: ContactDirection | null): boolean {
  if (!lastContactDate || scheduled) return false;
  const daysSince = getBusinessDaysSince(lastContactDate);
  // If they contacted us, we need to respond within 1 business day
  if (direction === 'inbound') return daysSince > 1;
  // Otherwise, follow up within 3 business days
  return daysSince > 3;
}

export default function CommunityCRM() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [pageTab, setPageTab] = useState<PageTab>('communities');

  const [rows, setRows] = useState<CommunityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ContactType | 'all'>('all');
  const [statusTab, setStatusTab] = useState<CommunityStatus>('active');

  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<CommunityRow | null>(null);

  const [logModalFor, setLogModalFor] = useState<CommunityRow | null>(null);
  const [historyModalFor, setHistoryModalFor] = useState<CommunityRow | null>(null);
  const [viewModalFor, setViewModalFor] = useState<CommunityRow | null>(null);

  // Scripts state
  const [scripts, setScripts] = useState<Script[]>([]);
  const [scriptsLoading, setScriptsLoading] = useState(true);
  const [scriptSearch, setScriptSearch] = useState('');
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [draggedScript, setDraggedScript] = useState<string | null>(null);

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

  async function loadScripts() {
    setScriptsLoading(true);
    const { data, error } = await supabase
      .from('outreach_scripts')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) setScripts(data as Script[]);
    setScriptsLoading(false);
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadRows();
      loadScripts();
    }
  }, [isAuthenticated]);

  const filteredScripts = useMemo(() => {
    if (!scriptSearch) return scripts;
    const lower = scriptSearch.toLowerCase();
    return scripts.filter(
      (s) =>
        s.question.toLowerCase().includes(lower) ||
        s.answer.toLowerCase().includes(lower)
    );
  }, [scripts, scriptSearch]);

  async function deleteScript(id: string) {
    if (!confirm('Delete this script? This cannot be undone.')) return;
    await supabase.from('outreach_scripts').delete().eq('id', id);
    loadScripts();
  }

  async function handleScriptDrop(targetId: string) {
    if (!draggedScript || draggedScript === targetId) {
      setDraggedScript(null);
      return;
    }

    const oldIndex = scripts.findIndex(s => s.id === draggedScript);
    const newIndex = scripts.findIndex(s => s.id === targetId);
    if (oldIndex === -1 || newIndex === -1) {
      setDraggedScript(null);
      return;
    }

    // Reorder locally
    const reordered = [...scripts];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setScripts(reordered);
    setDraggedScript(null);

    // Update sort_order in database
    const updates = reordered.map((s, i) => ({ id: s.id, sort_order: i }));
    for (const update of updates) {
      await supabase.from('outreach_scripts').update({ sort_order: update.sort_order }).eq('id', update.id);
    }
  }

  const filtered = useMemo(() => {
    const result = rows.filter((r) => {
      const matchesStatus = r.status === statusTab;
      const matchesSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.coordinator_name ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'all' || r.last_contact_type === filterType;
      return matchesStatus && matchesSearch && matchesType;
    });
    // Sort priority items to the top for prospects
    if (statusTab === 'prospect') {
      result.sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0));
    }
    // Sort active communities: stale first, then neutral, then scheduled
    if (statusTab === 'active') {
      result.sort((a, b) => {
        const aStale = isContactStale(a.last_contact_date, a.scheduled, a.last_contact_direction);
        const bStale = isContactStale(b.last_contact_date, b.scheduled, b.last_contact_direction);
        // Stale (red) comes first
        if (aStale && !bStale) return -1;
        if (!aStale && bStale) return 1;
        // Scheduled (green) goes last
        if (a.scheduled && !b.scheduled) return 1;
        if (!a.scheduled && b.scheduled) return -1;
        // Otherwise maintain alphabetical order
        return a.name.localeCompare(b.name);
      });
    }
    return result;
  }, [rows, search, filterType, statusTab]);

  const prospectCount = useMemo(() => rows.filter(r => r.status === 'prospect').length, [rows]);
  const activeCount = useMemo(() => rows.filter(r => r.status === 'active').length, [rows]);

  async function deleteCommunity(id: string) {
    if (!confirm('Remove this community and its contact history? This cannot be undone.')) return;
    await supabase.from('communities').delete().eq('id', id);
    loadRows();
  }

  async function updateStatus(id: string, status: CommunityStatus) {
    await supabase.from('communities').update({ status }).eq('id', id);
    loadRows();
  }

  async function togglePriority(id: string, currentPriority: boolean) {
    // Optimistically update local state to avoid scroll reset
    setRows(prev => prev.map(r => r.id === id ? { ...r, priority: !currentPriority } : r));
    const { error } = await supabase.from('communities').update({ priority: !currentPriority }).eq('id', id);
    if (error) {
      // Revert on error
      setRows(prev => prev.map(r => r.id === id ? { ...r, priority: currentPriority } : r));
      console.error('Failed to update priority:', error);
    }
  }

  async function toggleScheduled(id: string, currentScheduled: boolean) {
    // Optimistically update local state to avoid scroll reset
    setRows(prev => prev.map(r => r.id === id ? { ...r, scheduled: !currentScheduled } : r));
    const { error } = await supabase.from('communities').update({ scheduled: !currentScheduled }).eq('id', id);
    if (error) {
      // Revert on error
      setRows(prev => prev.map(r => r.id === id ? { ...r, scheduled: currentScheduled } : r));
      console.error('Failed to update scheduled:', error);
    }
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
              Track communities and keep your talking points ready.
            </p>
          </div>
        </div>

        {/* Page Tabs + Action Button */}
        <div className="flex items-center justify-between mb-4 border-b border-[#D8D3CC]">
          <div className="flex gap-4">
            <button
              onClick={() => setPageTab('communities')}
              className={`pb-2 text-sm font-medium transition-colors ${
                pageTab === 'communities'
                  ? 'text-[#9E1B32] border-b-2 border-[#9E1B32]'
                  : 'text-[#6B6B6B] hover:text-[#3A3A3A]'
              }`}
            >
              Communities
            </button>
            <button
              onClick={() => setPageTab('scripts')}
              className={`pb-2 text-sm font-medium transition-colors ${
                pageTab === 'scripts'
                  ? 'text-[#9E1B32] border-b-2 border-[#9E1B32]'
                  : 'text-[#6B6B6B] hover:text-[#3A3A3A]'
              }`}
            >
              Scripts
            </button>
          </div>
          {pageTab === 'communities' && (
            <button
              onClick={() => {
                setEditingCommunity(null);
                setShowCommunityModal(true);
              }}
              className="bg-[#9E1B32] hover:bg-[#7A1526] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors mb-2"
            >
              + Add community
            </button>
          )}
          {pageTab === 'scripts' && (
            <button
              onClick={() => {
                setEditingScript(null);
                setShowScriptModal(true);
              }}
              className="bg-[#9E1B32] hover:bg-[#7A1526] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors mb-2"
            >
              + Add script
            </button>
          )}
        </div>

        {pageTab === 'communities' && (
          <>
        {/* Status Tabs + Search Row */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="flex gap-1">
            <button
              onClick={() => setStatusTab('active')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                statusTab === 'active'
                  ? 'bg-[#9E1B32] text-white'
                  : 'bg-[#E9E4DE] text-[#6B6B6B] hover:text-[#3A3A3A]'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusTab('prospect')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                statusTab === 'prospect'
                  ? 'bg-[#9E1B32] text-white'
                  : 'bg-[#E9E4DE] text-[#6B6B6B] hover:text-[#3A3A3A]'
              }`}
            >
              Prospects ({prospectCount})
            </button>
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 border border-[#D8D3CC] rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9E1B32]"
            />
            {statusTab === 'active' && (
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as ContactType | 'all')}
                className="border border-[#D8D3CC] rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9E1B32]"
              >
                <option value="all">All types</option>
                {Object.entries(CONTACT_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            )}
          </div>
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
                  {statusTab === 'prospect' && (
                    <th className="px-4 py-3 font-medium w-10"></th>
                  )}
                  {statusTab === 'active' && (
                    <th className="px-4 py-3 font-medium w-10"></th>
                  )}
                  <th className="px-4 py-3 font-medium">Community</th>
                  {statusTab === 'active' && (
                    <>
                      <th className="px-4 py-3 font-medium">Coordinator</th>
                      <th className="px-4 py-3 font-medium">Last contact</th>
                      <th className="px-4 py-3 font-medium">Summary</th>
                    </>
                  )}
                  {statusTab === 'prospect' && (
                    <>
                      <th className="px-4 py-3 font-medium">Phone</th>
                      <th className="px-4 py-3 font-medium">Notes</th>
                    </>
                  )}
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => {
                  const showDivider = statusTab === 'prospect' && idx > 0 && filtered[idx - 1].priority && !r.priority;
                  const stale = statusTab === 'active' && isContactStale(r.last_contact_date, r.scheduled, r.last_contact_direction);
                  return (
                  <tr
                    key={r.id}
                    onClick={() => setViewModalFor(r)}
                    className={`align-top cursor-pointer hover:bg-[#F5F3F0] transition-colors ${
                      showDivider ? 'border-t-2 border-[#D8D3CC]' : 'border-t border-[#E3E0DB]'
                    } ${statusTab === 'prospect' && r.priority ? 'bg-amber-50 hover:bg-amber-100' : ''} ${
                      stale ? 'bg-red-50 hover:bg-red-100' : ''
                    } ${statusTab === 'active' && r.scheduled ? 'bg-green-50 hover:bg-green-100' : ''}`}
                  >
                    {statusTab === 'prospect' && (
                      <td className="px-2 py-3 text-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); togglePriority(r.id, r.priority); }}
                          className={`p-1 rounded transition-colors ${
                            r.priority
                              ? 'text-amber-500 hover:text-amber-600'
                              : 'text-[#D8D3CC] hover:text-amber-400'
                          }`}
                          title={r.priority ? 'Remove priority' : 'Mark as priority'}
                        >
                          <Star size={16} fill={r.priority ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                    )}
                    {statusTab === 'active' && (
                      <td className="px-2 py-3 text-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleScheduled(r.id, r.scheduled); }}
                          className={`p-1 rounded transition-colors ${
                            r.scheduled
                              ? 'text-green-600 hover:text-green-700'
                              : 'text-[#D8D3CC] hover:text-green-500'
                          }`}
                          title={r.scheduled ? 'Mark as not scheduled' : 'Mark as scheduled'}
                        >
                          <CalendarCheck size={16} />
                        </button>
                      </td>
                    )}
                    <td className="px-4 py-3 font-medium">
                        {r.name}
                        {statusTab === 'active' && r.main_phone && (
                          <div className="text-xs text-[#6B6B6B] font-normal">{r.main_phone}</div>
                        )}
                      </td>
                    {statusTab === 'active' && (
                      <td className="px-4 py-3 text-[#3A3A3A]">
                        {r.coordinator_name || <span className="text-[#B0ABA3]">Unknown</span>}
                        {r.coordinator_email && (
                          <div className="text-xs text-[#6B6B6B]">{r.coordinator_email}</div>
                        )}
                        {r.coordinator_phone && (
                          <div className="text-xs text-[#6B6B6B]">{r.coordinator_phone}</div>
                        )}
                      </td>
                    )}
                    {statusTab === 'prospect' && (
                      <td className="px-4 py-3 text-[#3A3A3A]">
                        {r.main_phone || <span className="text-[#B0ABA3]">&mdash;</span>}
                      </td>
                    )}
                    {statusTab === 'active' && (
                      <>
                        <td className="px-4 py-3">
                          {r.last_contact_type ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <span className={`inline-block text-xs px-2 py-1 rounded-full ${CONTACT_STYLES[r.last_contact_type]}`}>
                                  {CONTACT_LABELS[r.last_contact_type]}
                                </span>
                                {r.last_contact_direction === 'inbound' ? (
                                  <span title="From them"><PhoneIncoming size={14} className="text-blue-600" /></span>
                                ) : (
                                  <span title="To them"><PhoneOutgoing size={14} className="text-[#6B6B6B]" /></span>
                                )}
                              </div>
                              <div className="text-xs text-[#6B6B6B]">{r.last_contact_date}</div>
                            </div>
                          ) : (
                            <span className="text-xs text-[#B0ABA3]">No contact logged</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#3A3A3A] max-w-xs">
                          {r.last_contact_summary || <span className="text-[#B0ABA3]">&mdash;</span>}
                        </td>
                      </>
                    )}
                    {statusTab === 'prospect' && (
                      <td className="px-4 py-3 text-[#3A3A3A] max-w-xs">
                        {r.notes || <span className="text-[#B0ABA3]">&mdash;</span>}
                      </td>
                    )}
                    <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {statusTab === 'active' && (
                        <>
                          <button
                            onClick={() => setLogModalFor(r)}
                            className="text-[#9E1B32] hover:underline text-xs font-medium mr-3"
                          >
                            Log contact
                          </button>
                          <button
                            onClick={() => setHistoryModalFor(r)}
                            className="text-[#9E1B32] hover:underline text-xs font-medium mr-3"
                          >
                            History
                          </button>
                        </>
                      )}
                      {statusTab === 'prospect' && (
                        <button
                          onClick={() => updateStatus(r.id, 'active')}
                          className="text-[#9E1B32] hover:underline text-xs font-medium mr-3"
                        >
                          Mark Active
                        </button>
                      )}
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
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
          </>
        )}

        {pageTab === 'scripts' && (
          <>
            <div className="mb-4">
              <input
                value={scriptSearch}
                onChange={(e) => setScriptSearch(e.target.value)}
                placeholder="Search questions and answers..."
                className="w-full border border-[#D8D3CC] rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9E1B32]"
              />
            </div>

            <div className="space-y-4">
              {scriptsLoading ? (
                <div className="p-8 text-center text-sm text-[#6B6B6B]">Loading...</div>
              ) : filteredScripts.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#6B6B6B] bg-white border border-[#E3E0DB] rounded-lg">
                  {scriptSearch ? 'No scripts match your search.' : 'No scripts yet. Add your first one to get started.'}
                </div>
              ) : (
                filteredScripts.map((script) => (
                  <div
                    key={script.id}
                    draggable={!scriptSearch}
                    onDragStart={() => setDraggedScript(script.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleScriptDrop(script.id)}
                    onDragEnd={() => setDraggedScript(null)}
                    className={`bg-white border border-[#E3E0DB] rounded-lg overflow-hidden transition-opacity ${
                      draggedScript === script.id ? 'opacity-50' : ''
                    } ${draggedScript && draggedScript !== script.id ? 'border-dashed border-[#9E1B32]' : ''}`}
                  >
                    <div className="flex items-center justify-between px-4 py-3 bg-[#F5F3F0] border-b border-[#E3E0DB]">
                      <div className="flex items-center gap-2">
                        {!scriptSearch && (
                          <GripVertical size={16} className="text-[#B0ABA3] cursor-grab shrink-0" />
                        )}
                        <h3 className="font-semibold text-[#9E1B32] text-base">{script.question}</h3>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingScript(script);
                            setShowScriptModal(true);
                          }}
                          className="text-[#3A3A3A] hover:underline text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteScript(script.id)}
                          className="text-[#6B6B6B] hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div
                        className="text-sm text-[#3A3A3A] prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                        dangerouslySetInnerHTML={{ __html: script.answer }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
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

      {historyModalFor && (
        <HistoryModal
          community={historyModalFor}
          onClose={() => setHistoryModalFor(null)}
        />
      )}

      {viewModalFor && (
        <ViewCommunityModal
          community={viewModalFor}
          onClose={() => setViewModalFor(null)}
          onEdit={() => {
            setViewModalFor(null);
            setEditingCommunity(viewModalFor);
            setShowCommunityModal(true);
          }}
        />
      )}

      {showScriptModal && (
        <ScriptModal
          script={editingScript}
          onClose={() => setShowScriptModal(false)}
          onSaved={() => {
            setShowScriptModal(false);
            loadScripts();
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
  const [status, setStatus] = useState<CommunityStatus>(community?.status ?? 'active');
  const [mainPhone, setMainPhone] = useState(community?.main_phone ?? '');
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
      status,
      main_phone: mainPhone.trim() || null,
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
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value as CommunityStatus)} className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]">
            <option value="prospect">Prospect (on radar, not yet contacted)</option>
            <option value="active">Active (have been contacted)</option>
          </select>
        </Field>
        <Field label="Main phone">
          <input type="tel" value={mainPhone} onChange={(e) => setMainPhone(e.target.value)} className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]" placeholder="(555) 123-4567" />
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
  const [direction, setDirection] = useState<ContactDirection>('outbound');
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
      direction,
    });
    setSaving(false);
    onSaved();
  }

  return (
    <ModalShell title={`Log contact — ${community.name}`} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Direction">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDirection('outbound')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                direction === 'outbound'
                  ? 'bg-[#9E1B32] text-white border-[#9E1B32]'
                  : 'bg-white text-[#3A3A3A] border-[#D8D3CC] hover:border-[#9E1B32]'
              }`}
            >
              <PhoneOutgoing size={16} /> We contacted them
            </button>
            <button
              type="button"
              onClick={() => setDirection('inbound')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                direction === 'inbound'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-[#3A3A3A] border-[#D8D3CC] hover:border-blue-600'
              }`}
            >
              <PhoneIncoming size={16} /> They contacted us
            </button>
          </div>
        </Field>
        <Field label="Contact type">
          <select value={contactType} onChange={(e) => setContactType(e.target.value as ContactType)} className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]">
            {Object.entries(CONTACT_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </Field>
        {direction === 'outbound' && (
          <Field label="Contacted by">
            <select value={contactedBy} onChange={(e) => setContactedBy(e.target.value)} className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]">
              {TEAM_MEMBERS.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </Field>
        )}
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

function HistoryModal({
  community,
  onClose,
}: {
  community: CommunityRow;
  onClose: () => void;
}) {
  const [logs, setLogs] = useState<ContactLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      const { data, error } = await supabase
        .from('contact_logs')
        .select('*')
        .eq('community_id', community.id)
        .order('contact_date', { ascending: false });
      if (!error && data) setLogs(data as ContactLog[]);
      setLoading(false);
    }
    loadLogs();
  }, [community.id]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black">Contact History — {community.name}</h2>
          <button onClick={onClose} className="text-[#6B6B6B] hover:text-black text-xl leading-none">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-[#6B6B6B]">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="p-4 text-center text-sm text-[#6B6B6B]">No contact history yet.</div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className={`border rounded-lg p-4 ${log.direction === 'inbound' ? 'border-blue-200 bg-blue-50' : 'border-[#E3E0DB]'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {log.direction === 'inbound' ? (
                        <PhoneIncoming size={14} className="text-blue-600" />
                      ) : (
                        <PhoneOutgoing size={14} className="text-[#6B6B6B]" />
                      )}
                      <span className={`inline-block text-xs px-2 py-1 rounded-full ${CONTACT_STYLES[log.contact_type]}`}>
                        {CONTACT_LABELS[log.contact_type]}
                      </span>
                      {log.contacted_by && log.direction === 'outbound' && (
                        <span className="text-xs text-[#6B6B6B]">by {log.contacted_by}</span>
                      )}
                      {log.direction === 'inbound' && (
                        <span className="text-xs text-blue-600 font-medium">From them</span>
                      )}
                    </div>
                    <span className="text-xs text-[#6B6B6B]">{log.contact_date}</span>
                  </div>
                  <p className="text-sm text-[#3A3A3A]">{log.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 mt-4 border-t border-[#E3E0DB]">
          <button onClick={onClose} className="text-sm px-4 py-2 bg-[#3A3A3A] hover:bg-[#1A1A1A] text-white rounded-md">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewCommunityModal({
  community,
  onClose,
  onEdit,
}: {
  community: CommunityRow;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black">{community.name}</h2>
          <button onClick={onClose} className="text-[#6B6B6B] hover:text-black text-xl leading-none">&times;</button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              community.status === 'active'
                ? 'bg-[#9E1B32] text-white'
                : 'bg-[#E9E4DE] text-[#3A3A3A]'
            }`}>
              {community.status === 'active' ? 'Active' : 'Prospect'}
            </span>
            {community.priority && (
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                <Star size={12} fill="currentColor" /> Priority
              </span>
            )}
          </div>

          {community.main_phone && (
            <DetailRow label="Main phone" value={community.main_phone} />
          )}

          <div className="border-t border-[#E3E0DB] pt-4">
            <h3 className="text-xs font-medium text-[#6B6B6B] mb-2">Coordinator</h3>
            {community.coordinator_name ? (
              <div className="space-y-1">
                <p className="text-sm text-black">{community.coordinator_name}</p>
                {community.coordinator_email && (
                  <p className="text-sm text-[#6B6B6B]">{community.coordinator_email}</p>
                )}
                {community.coordinator_phone && (
                  <p className="text-sm text-[#6B6B6B]">{community.coordinator_phone}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#B0ABA3]">No coordinator info</p>
            )}
          </div>

          {community.notes && (
            <div className="border-t border-[#E3E0DB] pt-4">
              <h3 className="text-xs font-medium text-[#6B6B6B] mb-2">Notes</h3>
              <p className="text-sm text-[#3A3A3A] whitespace-pre-wrap">{community.notes}</p>
            </div>
          )}

          {community.last_contact_type && (
            <div className="border-t border-[#E3E0DB] pt-4">
              <h3 className="text-xs font-medium text-[#6B6B6B] mb-2">Last contact</h3>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-1 rounded-full ${CONTACT_STYLES[community.last_contact_type]}`}>
                  {CONTACT_LABELS[community.last_contact_type]}
                </span>
                <span className="text-xs text-[#6B6B6B]">{community.last_contact_date}</span>
              </div>
              {community.last_contact_summary && (
                <p className="text-sm text-[#3A3A3A]">{community.last_contact_summary}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-6 mt-4 border-t border-[#E3E0DB]">
          <button onClick={onClose} className="text-sm px-3 py-2 text-[#6B6B6B]">Close</button>
          <button
            onClick={onEdit}
            className="text-sm px-4 py-2 bg-[#3A3A3A] hover:bg-[#1A1A1A] text-white rounded-md"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-[#6B6B6B]">{label}</span>
      <p className="text-sm text-black">{value}</p>
    </div>
  );
}

const EDITOR_COLORS = [
  { name: 'Black', value: '#1A1A1A' },
  { name: 'Crimson', value: '#9E1B32' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Orange', value: '#ea580c' },
];

function ScriptModal({
  script,
  onClose,
  onSaved,
}: {
  script: Script | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [question, setQuestion] = useState(script?.question ?? '');
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  async function save() {
    const answer = editorRef.current?.innerHTML ?? '';
    if (!question.trim() || !answer.trim() || answer === '<br>') return;
    setSaving(true);
    const payload = {
      question: question.trim(),
      answer,
    };
    if (script) {
      await supabase.from('outreach_scripts').update(payload).eq('id', script.id);
    } else {
      await supabase.from('outreach_scripts').insert(payload);
    }
    setSaving(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black">{script ? 'Edit script' : 'Add script'}</h2>
          <button onClick={onClose} className="text-[#6B6B6B] hover:text-black text-xl leading-none">&times;</button>
        </div>

        <div className="space-y-3">
          <Field label="Question">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-[#D8D3CC] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9E1B32]"
              placeholder="e.g. What is Decode Horsemanship?"
            />
          </Field>
          <Field label="Answer">
            <div className="border border-[#D8D3CC] rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#9E1B32]">
              {/* Toolbar */}
              <div className="flex items-center gap-1 px-2 py-1.5 bg-[#F5F3F0] border-b border-[#D8D3CC]">
                <button
                  type="button"
                  onClick={() => execCommand('bold')}
                  className="p-1.5 rounded hover:bg-[#E9E4DE] text-[#3A3A3A]"
                  title="Bold"
                >
                  <Bold size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand('insertUnorderedList')}
                  className="p-1.5 rounded hover:bg-[#E9E4DE] text-[#3A3A3A]"
                  title="Bullet list"
                >
                  <List size={16} />
                </button>
                <div className="w-px h-5 bg-[#D8D3CC] mx-1" />
                {EDITOR_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => execCommand('foreColor', color.value)}
                    className="w-5 h-5 rounded border border-[#D8D3CC] hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              {/* Editable area */}
              <div
                ref={editorRef}
                contentEditable
                className="min-h-[150px] px-3 py-2 text-sm focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: script?.answer ?? '' }}
              />
            </div>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="text-sm px-3 py-2 text-[#6B6B6B]">Cancel</button>
            <button
              onClick={save}
              disabled={saving || !question.trim()}
              className="text-sm px-4 py-2 bg-[#9E1B32] hover:bg-[#7A1526] text-white rounded-md disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
