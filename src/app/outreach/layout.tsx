import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Communities Outreach',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
