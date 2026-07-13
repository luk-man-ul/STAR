import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Star Stitcher | Ladies Custom Tailoring Boutique",
  description: "Bespoke ladies custom stitching center in Kasaragod, Kerala. Submit measurements online, explore dynamic designer lookbooks, and track your tailoring orders.",
  metadataBase: new URL("https://starstitcher.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Star Stitcher | Ladies Custom Tailoring Boutique",
    description: "Bespoke ladies custom stitching center in Kasaragod, Kerala. Submit measurements online, explore dynamic designer lookbooks, and track your tailoring orders.",
    url: "https://starstitcher.com",
    siteName: "Star Stitcher",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Star Stitcher Ladies Custom Tailoring",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Star Stitcher | Ladies Custom Tailoring Boutique",
    description: "Bespoke ladies custom stitching center in Kasaragod, Kerala. Submit measurements online, explore dynamic designer lookbooks, and track your tailoring orders.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
