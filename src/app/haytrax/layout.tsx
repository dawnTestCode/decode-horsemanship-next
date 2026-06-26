import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'HayTrax',
  description: 'Hay inventory tracking for the farm',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HayTrax',
  },
  applicationName: 'HayTrax',
  icons: {
    apple: [
      { url: '/apple-touch-icon-haytrax.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#78350f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function HayTraxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-haytrax.png" />
      {children}
    </>
  );
}
