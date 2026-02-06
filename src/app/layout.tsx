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
  title: "ProposeKit — Feche vendas mais rápido com Closing Kit integrado",
  description: "Crie propostas profissionais com IA, aceite digital e pagamento de entrada. Tudo em um só link.",
  openGraph: {
    title: "ProposeKit — Plataforma completa de fechamento de vendas",
    description: "Propostas + Aceite Digital + Pagamento de Entrada. Feche negócios em minutos, não em dias.",
    url: "https://proposekit.com",
    siteName: "ProposeKit",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ProposeKit - Plataforma de Fechamento de Vendas",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProposeKit — Closing Kit integrado",
    description: "Propostas profissionais com IA + aceite digital + pagamento de entrada.",
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
