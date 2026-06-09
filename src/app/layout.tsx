import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import FloatingHub from "@/components/FloatingHub";
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
  title: "The Olowojare's Wedding",
  description:
    "A luxury celebration experience for the Olowojare wedding in Ilorin, featuring event details, RSVP flow, live event mode, and guest support.",
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
        <FloatingHub />
      </body>
    </html>
  );
}
