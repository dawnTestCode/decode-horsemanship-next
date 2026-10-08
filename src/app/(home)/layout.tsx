import type { Metadata } from 'next';

// Re-render hourly so a featured event drops off once it has passed
export const revalidate = 3600;

const title = 'Horse-Led Workshops, Leadership & Horsemanship | Decode Horsemanship';
const description =
  'Ground-based horse experiences in Chapel Hill, NC for first-timers, leaders, teams, organizations navigating change, and lifelong horse lovers. No horse experience required.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: 'Decode Horsemanship',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image-main.png'],
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
