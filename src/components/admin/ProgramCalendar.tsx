'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO,
} from 'date-fns';

// Types for different program sources
interface ProgramDate {
  id: string;
  program_id: string;
  start_date: string;
  end_date: string | null;
  status: string;
  enrolled: number;
  capacity: number | null;
}

interface Program {
  id: string;
  name: string;
  slug: string;
  category: string;
  max_capacity: number;
}

interface GroundworkSession {
  id: string;
  session_date: string;
  status: string;
  enrolled: number;
  capacity: number;
}

interface SummerCampSession {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  enrolled_explorers: number;
  enrolled_trailblazers: number;
  capacity_explorers: number;
  capacity_trailblazers: number;
}

interface DustLeatherSession {
  id: string;
  session_date: string;
  status: string;
  enrolled: number;
  capacity: number;
}

// Unified calendar event type
interface CalendarEvent {
  id: string;
  date: string;
  endDate?: string;
  title: string;
  type: 'eal' | 'groundwork' | 'summercamp' | 'dustleather';
  category?: string;
  status: string;
  enrolled: number;
  capacity: number;
}

// Color schemes for different program types
const typeColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  eal: {
    bg: 'bg-blue-900/40',
    border: 'border-blue-700',
    text: 'text-blue-300',
    dot: 'bg-blue-500',
  },
  groundwork: {
    bg: 'bg-amber-900/40',
    border: 'border-amber-700',
    text: 'text-amber-300',
    dot: 'bg-amber-500',
  },
  summercamp: {
    bg: 'bg-green-900/40',
    border: 'border-green-700',
    text: 'text-green-300',
    dot: 'bg-green-500',
  },
  dustleather: {
    bg: 'bg-orange-900/40',
    border: 'border-orange-700',
    text: 'text-orange-300',
    dot: 'bg-orange-500',
  },
};

// Category colors for Workshops
const categoryColors: Record<string, string> = {
  youth: 'bg-purple-500',
  personal: 'bg-pink-500',
  corporate: 'bg-cyan-500',
};

const ProgramCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'eal' | 'groundwork' | 'summercamp' | 'dustleather'>('all');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch Workshops
      const { data: programsData } = await supabase
        .from('programs')
        .select('id, name, slug, category, max_capacity')
        .eq('active', true);

      setPrograms(programsData || []);

      // Fetch Workshop dates
      const { data: programDates } = await supabase
        .from('program_dates')
        .select('*')
        .order('start_date');

      // Fetch groundwork sessions
      const { data: groundworkSessions } = await supabase
        .from('groundwork_sessions')
        .select('*')
        .order('session_date');

      // Fetch summer camp sessions
      const { data: summerCampSessions } = await supabase
        .from('summer_camp_sessions')
        .select('*')
        .order('start_date');

      // Fetch Dust & Leather sessions
      const { data: dustLeatherSessions } = await supabase
        .from('dust_and_leather_sessions')
        .select('*')
        .order('session_date');

      // Convert all to unified CalendarEvent format
      const allEvents: CalendarEvent[] = [];

      // Workshop dates
      if (programDates && programsData) {
        programDates.forEach((pd: ProgramDate) => {
          const program = programsData.find((p: Program) => p.id === pd.program_id);
          if (program) {
            allEvents.push({
              id: `eal-${pd.id}`,
              date: pd.start_date,
              endDate: pd.end_date || undefined,
              title: program.name,
              type: 'eal',
              category: program.category,
              status: pd.status,
              enrolled: pd.enrolled,
              capacity: pd.capacity || program.max_capacity,
            });
          }
        });
      }

      // Groundwork sessions
      if (groundworkSessions) {
        groundworkSessions.forEach((gs: GroundworkSession) => {
          allEvents.push({
            id: `groundwork-${gs.id}`,
            date: gs.session_date,
            title: 'Groundwork',
            type: 'groundwork',
            status: gs.status,
            enrolled: gs.enrolled,
            capacity: gs.capacity,
          });
        });
      }

      // Summer camp sessions
      if (summerCampSessions) {
        summerCampSessions.forEach((sc: SummerCampSession) => {
          allEvents.push({
            id: `summercamp-${sc.id}`,
            date: sc.start_date,
            endDate: sc.end_date,
            title: sc.name,
            type: 'summercamp',
            status: sc.status,
            enrolled: sc.enrolled_explorers + sc.enrolled_trailblazers,
            capacity: sc.capacity_explorers + sc.capacity_trailblazers,
          });
        });
      }

      // Dust & Leather sessions
      if (dustLeatherSessions) {
        dustLeatherSessions.forEach((dl: DustLeatherSession) => {
          allEvents.push({
            id: `dustleather-${dl.id}`,
            date: dl.session_date,
            title: 'Dust & Leather',
            type: 'dustleather',
            status: dl.status,
            enrolled: dl.enrolled,
            capacity: dl.capacity,
          });
        });
      }

      setEvents(allEvents);
    } catch (err) {
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return events;
    return events.filter((e) => e.type === filterType);
  }, [events, filterType]);

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return filteredEvents.filter((event) => {
      const eventStart = event.date;
      const eventEnd = event.endDate || event.date;
      return dayStr >= eventStart && dayStr <= eventEnd;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-green-400';
      case 'full':
        return 'text-yellow-400';
      case 'closed':
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-stone-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div>
      {/* Header with navigation and filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-stone-400" />
          </button>
          <h2 className="text-xl font-bold text-stone-100 min-w-[200px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-stone-400" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1 text-sm bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-stone-600 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('eal')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              filterType === 'eal'
                ? 'bg-blue-700 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            EAL
          </button>
          <button
            onClick={() => setFilterType('groundwork')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              filterType === 'groundwork'
                ? 'bg-amber-700 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Groundwork
          </button>
          <button
            onClick={() => setFilterType('summercamp')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              filterType === 'summercamp'
                ? 'bg-green-700 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Summer Camp
          </button>
          <button
            onClick={() => setFilterType('dustleather')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              filterType === 'dustleather'
                ? 'bg-orange-700 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            Dust & Leather
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-stone-400">Workshops</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-stone-400">Groundwork</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-stone-400">Summer Camp</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-stone-400">Dust & Leather</span>
        </div>
        <div className="ml-4 flex items-center gap-4 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <span className="text-green-400">●</span> Open
          </span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-400">●</span> Full
          </span>
          <span className="flex items-center gap-1">
            <span className="text-red-400">●</span> Closed/Cancelled
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-stone-900/50 border border-stone-700 rounded-lg overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-stone-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="px-2 py-3 text-center text-sm font-medium text-stone-400 bg-stone-800/50"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={idx}
                className={`min-h-[100px] border-b border-r border-stone-800 p-1 ${
                  !isCurrentMonth ? 'bg-stone-900/30' : ''
                } ${isCurrentDay ? 'bg-blue-900/20' : ''}`}
              >
                <div
                  className={`text-sm mb-1 px-1 ${
                    isCurrentDay
                      ? 'text-blue-400 font-bold'
                      : isCurrentMonth
                      ? 'text-stone-300'
                      : 'text-stone-600'
                  }`}
                >
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => {
                    const colors = typeColors[event.type];
                    const categoryColor = event.category
                      ? categoryColors[event.category]
                      : colors.dot;

                    return (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`w-full text-left px-1.5 py-0.5 rounded text-xs truncate ${colors.bg} ${colors.border} border ${colors.text} hover:opacity-80 transition-opacity`}
                      >
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                            event.type === 'eal' ? categoryColor : colors.dot
                          }`}
                        />
                        {event.title}
                      </button>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-stone-500 px-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-stone-900 border border-stone-700 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-3 h-3 rounded-full ${typeColors[selectedEvent.type].dot}`}
                  />
                  <span className="text-xs uppercase tracking-wider text-stone-500">
                    {selectedEvent.type === 'eal'
                      ? `EAL - ${selectedEvent.category}`
                      : selectedEvent.type === 'groundwork'
                      ? 'Groundwork'
                      : selectedEvent.type === 'dustleather'
                      ? 'Dust & Leather'
                      : 'Summer Camp'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-stone-100">{selectedEvent.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 hover:bg-stone-800 rounded"
              >
                <Calendar size={18} className="text-stone-500" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Date</span>
                <span className="text-stone-200">
                  {format(parseISO(selectedEvent.date), 'EEEE, MMMM d, yyyy')}
                  {selectedEvent.endDate && selectedEvent.endDate !== selectedEvent.date && (
                    <span className="text-stone-500">
                      {' '}
                      – {format(parseISO(selectedEvent.endDate), 'MMM d')}
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-400">Status</span>
                <span className={`capitalize ${getStatusBadge(selectedEvent.status)}`}>
                  {selectedEvent.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-400">Enrollment</span>
                <span className="text-stone-200">
                  {selectedEvent.enrolled} / {selectedEvent.capacity}
                  <span className="text-stone-500 ml-2">
                    ({selectedEvent.capacity - selectedEvent.enrolled} spots left)
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramCalendar;
