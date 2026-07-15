import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Decode Horsemanship | Private Riding & Horsemanship Lessons — Chapel Hill, NC',
  description: 'Private lessons in natural horsemanship for adults — never ridden, used to ride, or somewhere in between. No experience required. Chapel Hill, NC.',
  openGraph: {
    title: 'Decode Horsemanship | Private Riding & Horsemanship Lessons — Chapel Hill, NC',
    description: 'Private, one-on-one horsemanship and riding lessons for adults. Not a one-day event — ongoing instruction built around wherever you actually are.',
    type: 'website',
    siteName: 'Decode Horsemanship',
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
