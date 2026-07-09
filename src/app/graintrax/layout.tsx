import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'GrainTrax',
  description: 'Grain and feed tracking for the farm',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GrainTrax',
  },
  applicationName: 'GrainTrax',
  icons: {
    apple: '/apple-touch-icon-graintrax.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#065f46',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function GrainTraxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
