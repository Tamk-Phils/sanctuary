import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/supabase/context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChatButton from "@/components/FloatingChatButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://elliesbichonsanctuary.com"),
  title: "Ellie's Bichon Frise Sanctuary | Purebred Bichon Frise Puppies",
  description: "Find your perfect companion at Ellie's Bichon Frise Sanctuary. Healthy, family-raised Bichon Frise puppies with a 1-year health guarantee. Safe global transport available.",
  keywords: ["Bichon Frise", "puppy adoption", "dog breeder", "Bichon Frise puppies for sale", "healthy puppies", "purebred dogs"],
  authors: [{ name: "Ellie's Sanctuary" }],
  openGraph: {
    title: "Ellie's Bichon Frise Sanctuary",
    description: "Healthy, happy Bichon Frise puppies raised with love. Find your new family member today.",
    url: "https://elliesbichonsanctuary.com",
    siteName: "Ellie's Bichon Frise Sanctuary",
    images: [
      {
        url: "/images/hero-bg.png",
        width: 1200,
        height: 630,
        alt: "Adorable Bichon Frise Puppy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ellie's Bichon Frise Sanctuary",
    description: "Premium Bichon Frise puppies delivered safely to your door.",
    images: ["/images/hero-bg.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-cream-50 text-brown-900`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-20">{children}</main>
          <FloatingChatButton />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
