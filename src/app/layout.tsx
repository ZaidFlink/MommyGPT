import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/auth/AuthProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MommyGPT - Your Caring AI Assistant",
  description: "Chat with MommyGPT, your warm and understanding virtual companion with persistent chat history.",
  keywords: ["AI assistant", "chat", "caring", "virtual companion", "motherly AI"],
  authors: [{ name: "MommyGPT Team" }],
  creator: "MommyGPT",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://mommygpt.vercel.app'), // Update with your actual domain
  openGraph: {
    title: "MommyGPT 💕 - Your Caring AI Assistant",
    description: "Chat with MommyGPT, your warm and understanding virtual companion",
    type: "website",
    siteName: "MommyGPT",
  },
  twitter: {
    card: "summary_large_image",
    title: "MommyGPT 💕 - Your Caring AI Assistant",
    description: "Chat with MommyGPT, your warm and understanding virtual companion",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
