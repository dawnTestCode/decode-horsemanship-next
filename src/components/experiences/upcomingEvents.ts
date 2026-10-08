import type { usePrograms } from '@/hooks/usePrograms';
import type { ManualUpcomingEvent } from '@/config/experiences';

type ProgramWithDates = ReturnType<typeof usePrograms>['programs'][number];

export const UPCOMING_PROGRAM_SLUGS = ['no-reins', 'dust-and-leather', 'copper-and-lace', 'groundwork'];

export const UPCOMING_WINDOW_DAYS = 60;

export type UpcomingEvent =
  | {
      id: string;
      source: 'database';
      slug: string;
      name: string;
      startDate: string;
      startTime: string | null;
      endTime: string | null;
      spotsRemaining: number;
      isFull: boolean;
    }
  | (ManualUpcomingEvent & { startTime: null });

// YYYY-MM-DD for the visitor's local calendar day (never via UTC, which can shift the date)
const toLocalDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function getUpcomingWindow(now: Date) {
  const start = toLocalDateString(now);
  const end = toLocalDateString(new Date(now.getFullYear(), now.getMonth(), now.getDate() + UPCOMING_WINDOW_DAYS));
  return { start, end };
}

export function buildUpcomingEvents(
  programs: ProgramWithDates[],
  manualEvents: ManualUpcomingEvent[],
  now: Date
): UpcomingEvent[] {
  const { start, end } = getUpcomingWindow(now);
  const inWindow = (date: string) => date >= start && date <= end;
  const replaced = new Set(
    manualEvents.flatMap((e) => (e.replaces ?? []).map((r) => `${r.slug}|${r.startDate}`))
  );

  const databaseEvents: UpcomingEvent[] = programs.flatMap((program) =>
    program.dates
      .filter((date) => inWindow(date.start_date))
      // Hidden whether open or full, so a replacement and its original never appear together
      .filter((date) => !replaced.has(`${program.slug}|${date.start_date}`))
      .map((date) => {
        const spotsRemaining = (date.capacity || program.max_capacity) - date.enrolled;
        return {
          id: date.id,
          source: 'database' as const,
          slug: program.slug,
          name: program.name,
          startDate: date.start_date,
          startTime: date.start_time,
          endTime: date.end_time,
          spotsRemaining,
          isFull: spotsRemaining <= 0 || date.status === 'full',
        };
      })
  );

  const manual: UpcomingEvent[] = manualEvents
    .filter((e) => inWindow(e.startDate))
    .map((e) => ({ ...e, startTime: null }));

  // Untimed events sort after timed ones on the same date
  const sortKey = (e: UpcomingEvent) => `${e.startDate} ${e.startTime ?? '99:99'}`;
  return [...databaseEvents, ...manual].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
}
