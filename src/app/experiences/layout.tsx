import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "Experiences — Decode Horsemanship",
  description: "Horses respond to who you really are, not who you're trying to be. Every experience here uses that truth as the foundation.",
  openGraph: {
    title: "Experiences — Decode Horsemanship",
    description: "Horses respond to who you really are, not who you're trying to be. Every experience here uses that truth as the foundation.",
    type: "website",
    siteName: "Decode Horsemanship",
  },
};

export default function ExperiencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
}
