import type { Metadata } from 'next';
import PageLayout from '@/components/layout/PageLayout';

const title = 'Summer Camp | Decode Horsemanship';
const description = 'A natural horsemanship day camp for kids who want to understand horses — not just ride them. Ages 6-14, Chapel Hill NC.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: 'Decode Horsemanship',
    images: [
      {
        url: 'https://www.decodehorsemanship.com/og-image-main.png',
        width: 1200,
        height: 630,
        alt: 'Decode Horsemanship Summer Camp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.decodehorsemanship.com/og-image-main.png'],
  },
};

export default function SummerCampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
}
