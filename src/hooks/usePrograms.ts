// src/hooks/usePrograms.ts
// Hook for fetching program data and upcoming dates

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Program {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  duration: string | null;
  min_age: number | null;
  max_age: number | null;
  max_capacity: number;
  deposit_only: boolean;
  deposit_amount: number | null;
  full_price: number | null;
  price_label: string | null;
  scheduling: string;
  active: boolean;
}

interface ProgramDate {
  id: string;
  program_id: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  capacity: number | null;
  enrolled: number;
  status: string;
  notes: string | null;
}

interface ProgramWithDates extends Program {
  dates: ProgramDate[];
}

export function usePrograms(slugs?: string[]) {
  const [programs, setPrograms] = useState<ProgramWithDates[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, [slugs?.join(',')]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      // Fetch programs
      let query = supabase
        .from('programs')
        .select('*')
        .eq('active', true);

      if (slugs && slugs.length > 0) {
        query = query.in('slug', slugs);
      }

      const { data: programsData, error: programsError } = await query.order('name');
      if (programsError) throw programsError;

      if (!programsData || programsData.length === 0) {
        setPrograms([]);
        return;
      }

      // Fetch upcoming dates for these programs (including full ones to show as "Sold Out")
      const today = new Date().toISOString().split('T')[0];
      const programIds = programsData.map(p => p.id);

      const { data: datesData, error: datesError } = await supabase
        .from('program_dates')
        .select('*')
        .in('program_id', programIds)
        .in('status', ['open', 'full'])
        .gte('start_date', today)
        .order('start_date', { ascending: true });

      if (datesError) throw datesError;

      // Combine programs with their dates
      // Show up to 3 available dates per program, plus any full dates that come before them
      const programsWithDates: ProgramWithDates[] = programsData.map(program => {
        const programDates = (datesData || []).filter(d => d.program_id === program.id);
        const result: ProgramDate[] = [];
        let availableCount = 0;

        for (const date of programDates) {
          const capacity = date.capacity || program.max_capacity;
          const isFull = (capacity - date.enrolled) <= 0 || date.status === 'full';

          if (isFull) {
            // Always include full dates (they show as "Sold Out")
            result.push(date);
          } else {
            // Only include up to 3 available dates
            if (availableCount < 3) {
              result.push(date);
              availableCount++;
            } else {
              // We have 3 available dates, stop adding
              break;
            }
          }
        }

        return {
          ...program,
          dates: result,
        };
      });

      setPrograms(programsWithDates);
    } catch (err: any) {
      console.error('Error fetching programs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get a specific program by slug
  const getProgram = (slug: string) => programs.find(p => p.slug === slug);

  // Helper to format price
  const formatPrice = (cents: number | null) => {
    if (!cents) return null;
    return `$${(cents / 100).toFixed(0)}`;
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper to format time
  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH}:${minutes} ${ampm}`;
  };

  // Helper to get spots remaining
  const getSpotsRemaining = (date: ProgramDate, program: Program) => {
    const capacity = date.capacity || program.max_capacity;
    return capacity - date.enrolled;
  };

  return {
    programs,
    loading,
    error,
    getProgram,
    formatPrice,
    formatDate,
    formatTime,
    getSpotsRemaining,
    refetch: fetchPrograms,
  };
}
