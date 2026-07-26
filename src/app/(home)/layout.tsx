import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Decode Horsemanship | Lessons, Experiences & Horse Rescue — Chapel Hill, NC',
  description: 'Private lessons for kids and adults, hands-on horsemanship experiences, and horses given a second chance — all in Chapel Hill, NC. No experience required.',
  openGraph: {
    title: 'Decode Horsemanship | Lessons, Experiences & Horse Rescue — Chapel Hill, NC',
    description: 'Lessons for kids and adults, guided experiences, and rescued horses finding forever homes — all under one roof in Chapel Hill.',
    type: 'website',
    siteName: 'Decode Horsemanship',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Decode Horsemanship | Lessons, Experiences & Horse Rescue — Chapel Hill, NC',
    description: 'Private horsemanship lessons, hands-on experiences, and horse rescue & rehab — Chapel Hill, NC. Cracking the code to better horsemanship.',
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
