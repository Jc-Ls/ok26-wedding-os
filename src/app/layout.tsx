import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import FloatingHub from "./FloatingHub";
import PageFooter from "../components/PageFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M'K26 Royal Gala - The Olowojare's Wedding",
  description:
    "Join us for M'K26 Royal Gala, a luxury celebration experience for the Olowojares wedding in Ilorin. Featuring event details, RSVP, live stream, and exclusive guest experiences.",
  openGraph: {
    title: "M'K26 Royal Gala - A Luxury Wedding Celebration",
    description: "Experience the Olowojares' premium wedding celebration with exclusive features, RSVP, and live streaming.",
    images: [
      {
        url: "https://res.cloudinary.com/din74ljlu/image/upload/v1779078967/SAVE_20260518_242717_kylnnd.jpg",
        width: 1200,
        height: 630,
        alt: "M'K26 Royal Gala Wedding Celebration",
      },
    ],
    type: "website",
    siteName: "M'K26 Royal Gala",
  },
  twitter: {
    card: "summary_large_image",
    title: "M'K26 Royal Gala - The Olowojare's Wedding",
    description: "A luxury celebration experience in Ilorin",
    images: ["https://res.cloudinary.com/din74ljlu/image/upload/v1779078967/SAVE_20260518_242717_kylnnd.jpg"],
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
      <body className="min-h-full flex flex-col bg-[#060e18] text-white">
        {children}
        <PageFooter />
        <FloatingHub />
      </body>
    </html>
  );
}
