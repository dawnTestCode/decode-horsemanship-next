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
    icon: [
      { url: '/apple-touch-icon-graintrax.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon-graintrax.png', sizes: '180x180', type: 'image/png' },
    ],
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
  return (
    <>
      <link rel="icon" type="image/png" href="/apple-touch-icon-graintrax.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-graintrax.png" />
      {children}
    </>
  );
}
