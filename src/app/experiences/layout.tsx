import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";

// Re-render hourly so a featured event drops off once it has passed
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Workshops & Experiences — Decode Horsemanship",
  description: "Horse-led workshops in Chapel Hill, NC for first-timers, leaders, teams, and lifelong horse lovers. Ground-based, small groups, no horse experience required.",
  openGraph: {
    title: "Workshops & Experiences — Decode Horsemanship",
    description: "Horse-led workshops in Chapel Hill, NC for first-timers, leaders, teams, and lifelong horse lovers. Ground-based, small groups, no horse experience required.",
    type: "website",
    siteName: "Decode Horsemanship",
    images: [
      {
        url: "/og-image-experiences.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workshops & Experiences — Decode Horsemanship",
    description: "Horse-led workshops in Chapel Hill, NC for first-timers, leaders, teams, and lifelong horse lovers. Ground-based, small groups, no horse experience required.",
    images: ["/og-image-experiences.png"],
  },
};

export default function ExperiencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
}
