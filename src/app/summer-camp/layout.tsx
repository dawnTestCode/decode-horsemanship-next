import type { Metadata } from 'next';
import PageLayout from '@/components/layout/PageLayout';

export const metadata: Metadata = {
  title: 'Summer Camp | Decode Horsemanship',
  description: 'A natural horsemanship day camp for kids who want to understand horses — not just ride them. Ages 6-14, Chapel Hill NC.',
};

export default function SummerCampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
}
