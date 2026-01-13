import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/HeaderNew";
import Footer from "@/components/layout/FooterNew";

export const metadata: Metadata = {
  title: "Tansiq Hub - Premium E-commerce Store",
  description: "Your trusted destination for premium organic foods, books, modest fashion, and home decor. Quality products with guaranteed satisfaction.",
  keywords: "ecommerce, organic, books, fashion, home decor, health, beauty, quality products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white" style={{ fontFamily: 'var(--font-body)' }}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
