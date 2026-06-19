import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "No Reins — A half-day retreat for women",
  description: "No riding. No agenda. Just you and a horse who can't be fooled. A morning to stop being fine.",
  openGraph: {
    title: "No Reins — A half-day retreat for women",
    description: "No riding. No agenda. Just you and a horse who can't be fooled. A morning to stop being fine.",
    type: "website",
    siteName: "Decode Horsemanship",
  },
};

export default function NoReinsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
}
