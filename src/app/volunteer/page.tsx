'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, LogOut, MapPin, FileText, Utensils, Calendar, Fence, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import VolunteerLogin from '@/components/volunteer/VolunteerLogin';

interface VolunteerContent {
  id: string;
  section_key: string;
  title: string;
  content: string;
  content_type: 'richtext' | 'embed' | 'image' | 'pdf';
  is_visible: boolean;
  sort_order: number;
}

interface FieldAssignment {
  id: string;
  field_name: string;
  horse_names: string[];
  notes: string | null;
  sort_order: number;
  updated_at: string;
}

const cleanHtmlContent = (html: string): string => {
  if (!html) return '';
  return html.replace(/&nbsp;/g, ' ');
};

const sectionIcons: Record<string, React.ReactNode> = {
  property_map: <MapPin className="w-5 h-5" />,
  procedures: <FileText className="w-5 h-5" />,
  feed_charts: <Utensils className="w-5 h-5" />,
  calendar: <Calendar className="w-5 h-5" />,
};

export default function VolunteerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [volunteerToken, setVolunteerToken] = useState<string | null>(null);
  const [content, setContent] = useState<VolunteerContent[]>([]);
  const [fieldAssignments, setFieldAssignments] = useState<FieldAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    checkExistingSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadContent();
      loadFieldAssignments();
    }
  }, [isAuthenticated]);

  const checkExistingSession = async () => {
    const storedToken = localStorage.getItem('volunteer_token');
    const expiresAt = localStorage.getItem('volunteer_token_expires');

    if (storedToken && expiresAt) {
      if (new Date(expiresAt) > new Date()) {
        try {
          const { data } = await supabase.functions.invoke('admin-auth', {
            body: { action: 'volunteer-verify', token: storedToken }
          });

          if (data?.valid) {
            setVolunteerToken(storedToken);
            setIsAuthenticated(true);
          } else {
            clearSession();
          }
        } catch (err) {
          console.error('Token verification error:', err);
          clearSession();
        }
      } else {
        clearSession();
      }
    }
    setAuthLoading(false);
  };

  const clearSession = () => {
    localStorage.removeItem('volunteer_token');
    localStorage.removeItem('volunteer_token_expires');
  };

  const handleLoginSuccess = (token: string) => {
    setVolunteerToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      if (volunteerToken) {
        await supabase.functions.invoke('admin-auth', {
          body: { action: 'volunteer-logout', token: volunteerToken }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
    clearSession();
    setIsAuthenticated(false);
    setVolunteerToken(null);
  };

  const loadContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('volunteer_content')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setContent(data || []);
      if (data && data.length > 0) {
        setActiveSection(data[0].section_key);
      }
    } catch (err) {
      console.error('Error loading volunteer content:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFieldAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('field_assignments')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFieldAssignments(data || []);
    } catch (err) {
      console.error('Error loading field assignments:', err);
    }
  };

  const renderContent = (item: VolunteerContent) => {
    if ((item.section_key === 'property_map' || item.section_key === 'feed_charts') && item.content) {
      return (
        <div className="flex flex-col items-center">
          <img
            src={item.content}
            alt={item.section_key === 'property_map' ? 'Property Map' : 'Feed Chart'}
            className="max-w-full h-auto rounded-lg border border-stone-700"
          />
        </div>
      );
    }

    if (item.section_key === 'procedures' && item.content) {
      let pdfUrl = item.content;
      if (pdfUrl.includes('drive.google.com')) {
        const fileIdMatch = pdfUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (fileIdMatch) {
          pdfUrl = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
        }
      }

      return (
        <div>
          <div className="w-full h-[600px] rounded-lg overflow-hidden border border-stone-700 bg-stone-800">
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay"
            />
          </div>
          <div className="mt-4 text-center">
            <a
              href={item.content}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open PDF in New Tab
            </a>
          </div>
        </div>
      );
    }

    if (item.section_key === 'calendar' && item.content) {
      let calendarUrl = item.content;
      if (calendarUrl.includes('calendar.google.com') && !calendarUrl.includes('mode=')) {
        calendarUrl += (calendarUrl.includes('?') ? '&' : '?') + 'mode=AGENDA';
      }

      return (
        <div className="w-full h-[600px] rounded-lg overflow-hidden border border-stone-700">
          <iframe
            src={calendarUrl}
            className="w-full h-full"
            frameBorder="0"
            scrolling="no"
          />
        </div>
      );
    }

    if (!item.content) {
      return (
        <p className="text-stone-500 italic">No content added yet.</p>
      );
    }

    return (
      <div
        className="prose prose-invert prose-sm max-w-none prose-a:text-green-500 prose-headings:text-stone-200"
        dangerouslySetInnerHTML={{ __html: cleanHtmlContent(item.content) }}
      />
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-950">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Header */}
      <header className="bg-stone-900 border-b border-stone-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2 text-stone-400 hover:text-stone-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Site</span>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Volunteer Portal</h1>
              <p className="text-sm text-stone-400">Decode Horsemanship</p>
            </div>
          </div>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-73px)]">
        {!isAuthenticated ? (
          <VolunteerLogin onLoginSuccess={handleLoginSuccess} />
        ) : loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : content.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-stone-400">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p>No content available yet.</p>
            <p className="text-sm">Check back soon!</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto p-4">
            {/* Field Assignments Table */}
            {fieldAssignments.length > 0 && (
              <div className="bg-stone-900 rounded-xl border border-stone-800 mb-6 overflow-hidden">
                <div className="px-4 py-3 bg-stone-800/50 border-b border-stone-700 flex items-center gap-2">
                  <Fence className="w-5 h-5 text-green-500" />
                  <h2 className="font-semibold text-white">Today&apos;s Field Assignments</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-800">
                        <th className="px-4 py-3 text-left text-sm font-medium text-stone-400">Field</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-stone-400">Horses</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-stone-400">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fieldAssignments.map((field) => (
                        <tr key={field.id} className="border-b border-stone-800/50 last:border-0">
                          <td className="px-4 py-3 text-stone-200 font-medium whitespace-nowrap">
                            {field.field_name}
                          </td>
                          <td className="px-4 py-3 text-stone-300">
                            {field.horse_names.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {field.horse_names.map((name, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-stone-800 rounded text-sm"
                                  >
                                    {name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-stone-500 text-sm italic">Empty</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {field.notes ? (
                              <div className="flex items-center gap-2 text-yellow-500 text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {field.notes}
                              </div>
                            ) : (
                              <span className="text-stone-600">&mdash;</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-stone-800">
              {content.map((item) => (
                <button
                  key={item.section_key}
                  onClick={() => setActiveSection(item.section_key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeSection === item.section_key
                      ? 'bg-green-700 text-white'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {sectionIcons[item.section_key] || <FileText className="w-5 h-5" />}
                  <span>{item.title}</span>
                </button>
              ))}
            </div>

            {/* Active Section Content */}
            {content.map((item) => (
              item.section_key === activeSection && (
                <div key={item.id} className="bg-stone-900 rounded-xl p-6 border border-stone-800">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    {sectionIcons[item.section_key] || <FileText className="w-6 h-6" />}
                    {item.title}
                  </h2>
                  {renderContent(item)}
                </div>
              )
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
