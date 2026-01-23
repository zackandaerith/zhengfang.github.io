import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Customer Success Manager | Professional Portfolio",
    template: "%s | CS Manager Portfolio"
  },
  description: "Professional portfolio showcasing customer success achievements, metrics, and case studies. Experienced in driving customer retention, growth, and satisfaction.",
  keywords: [
    "customer success manager",
    "customer success",
    "portfolio",
    "professional",
    "customer retention",
    "customer satisfaction",
    "SaaS",
    "account management",
    "customer experience"
  ],
  authors: [{ name: "Customer Success Manager" }],
  creator: "Customer Success Manager",
  publisher: "Customer Success Manager",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Customer Success Manager | Professional Portfolio',
    description: 'Professional portfolio showcasing customer success achievements, metrics, and case studies.',
    siteName: 'CS Manager Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Customer Success Manager Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Success Manager | Professional Portfolio',
    description: 'Professional portfolio showcasing customer success achievements, metrics, and case studies.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      >
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
