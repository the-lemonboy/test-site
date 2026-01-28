import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "CamThink · Vision AI Edge Solutions",
  description:
    "Explore CamThink NeoEyes edge AI cameras, developer resources, and community programs for building production-ready vision AI products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />
        <link
          rel="stylesheet"
          href="https://www.camthink.ai//wp-includes/plugin/animate@4.1.1/animate.min.css"
        />
      </head>
      <body className={`${manrope.variable} antialiased`}>
        <Menu />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
