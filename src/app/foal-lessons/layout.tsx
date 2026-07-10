import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Foal Handling Lessons — Decode Horsemanship',
  description: 'Join the waitlist for hands-on foal handling lessons. Learn to work with young horses from the ground up at Decode Horsemanship in Chapel Hill, NC.',
  openGraph: {
    title: 'Foal Handling Lessons — Decode Horsemanship',
    description: 'Join the waitlist for hands-on foal handling lessons. Learn to work with young horses from the ground up.',
    type: 'website',
  },
};

export default function FoalLessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
