import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "Contact — Decode Horsemanship",
  description: "Have questions about our programs? Ready to schedule an experience? We'd love to hear from you.",
  openGraph: {
    title: "Contact — Decode Horsemanship",
    description: "Have questions about our programs? Ready to schedule an experience? We'd love to hear from you.",
    type: "website",
    siteName: "Decode Horsemanship",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
}
