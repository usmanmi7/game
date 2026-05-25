import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Usman Milas — Freelance Designer & Developer",
  description:
    "Helping brands stand out in the digital era. Freelance web designer & developer from Sri Lanka with over 4 years of experience in modern, responsive, and user-focused website design.",
  keywords: [
    "web designer",
    "freelance developer",
    "Sri Lanka",
    "Webflow",
    "WordPress",
    "UI/UX",
    "portfolio",
  ],
  authors: [{ name: "Usman Milas" }],
  openGraph: {
    title: "Usman Milas — Freelance Designer & Developer",
    description:
      "Helping brands stand out in the digital era. Modern, responsive, and user-focused website design.",
    type: "website",
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
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-white text-[#0a0a0a] overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
