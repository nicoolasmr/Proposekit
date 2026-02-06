import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProposeKit — Propostas claras fecham negócios mais rápido.",
  description: "Crie uma proposta profissional em minutos — direto no chat.",
  openGraph: {
    title: "ProposeKit — Propostas claras fecham negócios mais rápido.",
    description: "Crie uma proposta profissional em minutos — direto no chat.",
    url: "https://proposekit.com",
    siteName: "ProposeKit",
    images: [
      {
        url: "/og-image.jpg", // Needs to be added eventually, but defining it is key
        width: 1200,
        height: 630,
        alt: "ProposeKit Interface",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProposeKit",
    description: "Crie uma proposta profissional em minutos.",
    creator: "@proposekit",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" expand={false} richColors />
      </body>
    </html>
  );
}
