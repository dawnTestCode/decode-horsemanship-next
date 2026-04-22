import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Decode Horsemanship | Horse Rescue & Rehabilitation',
  description: 'We rescue horses from the auction and slaughter pipeline, rehabilitate them with patience and expertise, and match them with loving forever homes. Chapel Hill, NC.',
  openGraph: {
    title: 'Decode Horsemanship | Horse Rescue & Rehabilitation',
    description: 'We rescue horses from the auction and slaughter pipeline, rehabilitate them with patience and expertise, and match them with loving forever homes.',
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
