import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Foaling Watch — Decode Horsemanship',
  description: 'A shared log for the vigil — every check, logged together. Tracking Cali, grulla Gypsy Vanner maiden mare.',
  openGraph: {
    title: 'Foaling Watch',
    description: 'A shared log for the vigil — every check, logged together.',
    type: 'website',
    url: 'https://decodehorsemanship.com/foaling-watch',
    images: [
      {
        url: '/foaling-watch/og.png',
        width: 1200,
        height: 630,
        alt: 'Foaling Watch — Cali, grulla Gypsy Vanner, maiden mare',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foaling Watch — Decode Horsemanship',
    description: 'A shared log for the vigil — every check, logged together.',
    images: ['/foaling-watch/og.png'],
  },
};

export default function FoalingWatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
