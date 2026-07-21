import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Salahaddin University-Erbil | Research Center Portal",
  description: "Official portal of Salahaddin University-Erbil Research Center, offering dynamic search, laboratory scheduling, equipment bookings, open datasets, and research priorities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col font-sans">
        {/* SUE Theme Nav Header */}
        <Navbar />
        
        {/* Dynamic page content */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* SUE Theme Footer */}
        <Footer />
      </body>
    </html>
  );
}
