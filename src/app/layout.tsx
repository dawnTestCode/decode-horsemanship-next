import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Decode Horsemanship",
  description: "Rescue, rehabilitate, rehome. Quality horses with professional training in Chapel Hill, NC.",
  metadataBase: new URL("https://decodehorsemanship.com"),
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192" },
      { url: "/icon-512.png", sizes: "512x512" },
    ],
  },
  openGraph: {
    title: "Decode Horsemanship",
    description: "Rescue, rehabilitate, rehome. Quality horses with professional training in Chapel Hill, NC.",
    type: "website",
    url: "https://decodehorsemanship.com",
    images: [
      {
        url: "/og-image-main.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Decode Horsemanship",
    description: "Rescue, rehabilitate, rehome. Quality horses with professional training in Chapel Hill, NC.",
    images: ["/og-image-main.png"],
  },
  other: {
    "theme-color": "#0c0a09",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0c0a09" />
      </head>
      <body>{children}</body>
    </html>
  );
}
