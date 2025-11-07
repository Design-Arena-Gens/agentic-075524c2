import type { Metadata } from "next";
import "./globals.css";
import { Inter, Playfair_Display, Lora, Montserrat } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "Ebook Studio",
  description: "Design and export ebooks to PDF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${lora.variable} ${montserrat.variable} bg-gray-50 text-gray-900`}>{children}</body>
    </html>
  );
}
