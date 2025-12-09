import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Educação com Evidências",
  description: "Transformamos dados e boas evidências em acolhimento e ações reais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} antialiased font-sans text-gray-900 bg-white selection:bg-pink-200`}
      >
        <Navbar />
        {children}
        <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
            {/* Logo Footer Placeholder */}
            <span className="text-xl font-bold text-gray-400">EcE</span>
          </div>
          <p className="text-gray-500 text-sm">© 2025 Educação com Evidências. Feito com afeto e ciência.</p>
        </footer>
      </body>
    </html>
  );
}
