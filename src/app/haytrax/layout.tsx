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
    apple: '/haytrax-icon.png',
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
  return children;
}
