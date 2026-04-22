import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Decode Horsemanship",
  description: "Rescue, rehabilitation, and responsible rehoming of horses. Equine Assisted Learning programs in Chapel Hill, NC.",
  openGraph: {
    title: "Decode Horsemanship",
    description: "Rescue, rehabilitation, and responsible rehoming of horses. Equine Assisted Learning programs in Chapel Hill, NC.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
