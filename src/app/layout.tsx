import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wild Forest Hunter - 2D Browser Game",
  description: "A wild hunter living in a forest captures animals. Survive the wild, hunt animals, and earn your glory in this 2D browser game!",
  keywords: ["game", "2D", "forest", "hunter", "browser game", "animals", "survival"],
  authors: [{ name: "Wild Forest Hunter" }],
  openGraph: {
    title: "Wild Forest Hunter",
    description: "Hunt animals. Survive the wild. Earn your glory.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wild Forest Hunter",
    description: "Hunt animals. Survive the wild. Earn your glory.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
