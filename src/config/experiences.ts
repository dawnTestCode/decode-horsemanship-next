// Shared workshop / experience content - used by the homepage and /experiences.
// Edit this file to add, retire, or publish offers. Only `published` cards render publicly.

export type ExperienceStatus = 'published' | 'draft' | 'past';

export type ExperienceCard = {
  slug: string;
  title: string;
  audience: string;
  description: string;
  details?: string[];
  href?: string;
  ctaLabel?: string;
  status: ExperienceStatus;
  featured?: boolean;
  // Cards tied to a dated event drop off automatically once it ends.
  endsAt?: string;
  // Cards shown on /experiences but not in the homepage grid.
  experiencesPageOnly?: boolean;
};

export type FeaturedEvent = {
  slug: string;
  status: ExperienceStatus;
  title: string;
  facilitator: string;
  startDate: string;
  // ISO timestamp after which the event is no longer featured anywhere.
  endsAt: string;
  displayDate: string;
  location: string;
  description: string;
  detailLine: string;
  price: number;
  // Owner-approved destinations. Leave undefined until confirmed; the CTA will not render.
  bookingUrl?: string;
  facilitatorUrl?: string;
};

export const featuredEvents: FeaturedEvent[] = [
  {
    slug: 'harmonic-horse-connection',
    status: 'published',
    title: 'Harmonic Horse Connection',
    facilitator: 'Victoria Haffer',
    startDate: '2026-11-14',
    endsAt: '2026-11-14T23:59:59-05:00',
    displayDate: 'Saturday, November 14, 2026',
    location: 'Chapel Hill, NC',
    description:
      'A one-day immersion with Victoria Haffer for people ready to slow down, listen differently, and explore what becomes possible when connection with a horse is not forced. Come with experience or without it. The work starts with attention.',
    detailLine: 'Hosted at Decode Horsemanship · $255',
    price: 255,
    bookingUrl: 'https://victoriahaffer.com/events/',
    facilitatorUrl: 'https://victoriahaffer.com/about-victoria/',
  },
];

export const experienceCards: ExperienceCard[] = [
  {
    slug: 'harmonic-horse-connection',
    title: 'Harmonic Horse Connection',
    audience: 'Special event',
    description:
      'A one-day immersion with Victoria Haffer for people who want to explore connection with a horse through attention, presence, and a different kind of listening.',
    details: ['Saturday, November 14, 2026', '$255'],
    href: 'https://victoriahaffer.com/events/',
    ctaLabel: 'View the clinic',
    status: 'published',
    featured: true,
    endsAt: '2026-11-14T23:59:59-05:00',
  },
  {
    slug: 'no-reins',
    title: 'No Reins',
    audience: 'For women',
    description:
      'A half-day with the herd, one horse, and no role to perform. No riding. No forced sharing. No horse experience required. Just enough quiet to notice what follows you through the gate.',
    details: ['Third Saturday monthly', '10 AM–2 PM', 'Lunch included', '$375'],
    href: '/no-reins',
    ctaLabel: 'See No Reins',
    status: 'published',
  },
  {
    slug: 'dust-and-leather',
    title: 'Dust & Leather',
    audience: 'For men',
    description:
      'A working day with horses, fence, fire, leather, and the kind of tired that feels earned. Learn to read and handle a horse, do the work the farm sets, and cut a belt that goes home with you.',
    details: ['First Saturday monthly', '2–4 men', 'From $725'],
    href: '/dust-and-leather',
    ctaLabel: 'See Dust & Leather',
    status: 'published',
  },
  {
    slug: 'mustang',
    title: 'Mustang Immersion',
    audience: 'Three days with a wild horse',
    description:
      'Work directly with a BLM mustang learning to trust humans.',
    details: ['Limited availability'],
    href: '/mustang',
    ctaLabel: 'See Mustang Immersion',
    status: 'published',
    experiencesPageOnly: true,
  },
  {
    slug: 'groundwork',
    title: 'Groundwork',
    audience: 'Program in development',
    description:
      'This program is in development. Dawn will confirm who it is for, what happens, and what a participant takes away before it appears on the live site.',
    // Unpublished until Dawn confirms audience, duration, group size, price, and route.
    status: 'draft',
  },
  {
    slug: 'copper-and-lace',
    title: 'Copper & Lace',
    audience: 'Program in development',
    description:
      'This program is in development. Dawn will confirm its audience, format, and promise before it appears on the live site.',
    // Unpublished until Dawn confirms concept, audience, duration, price, and route.
    status: 'draft',
  },
];

const isOver = (endsAt: string | undefined, now: Date) =>
  endsAt !== undefined && new Date(endsAt).getTime() < now.getTime();

export function getCurrentFeaturedEvent(now = new Date()): FeaturedEvent | undefined {
  return featuredEvents
    .filter((e) => e.status === 'published' && !isOver(e.endsAt, now))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
}

export function getPublishedExperiences(
  { page, now = new Date() }: { page: 'home' | 'experiences'; now?: Date }
): ExperienceCard[] {
  return experienceCards
    .filter((c) => c.status === 'published' && !isOver(c.endsAt, now))
    .filter((c) => page === 'experiences' || !c.experiencesPageOnly);
}

// Approved testimonials only. Each entry needs the person's permission to show name/initial and program.
export type Testimonial = {
  quote: string;
  attribution: string;
  program: string;
  door: 'personal' | 'newcomer' | 'organization';
};

// TODO(owner): add two or three approved testimonials covering different doors into the work.
export const approvedTestimonials: Testimonial[] = [];
