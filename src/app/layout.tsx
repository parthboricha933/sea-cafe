import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bawarchi - The Indian Cuisine Restaurant | Pure Veg | Diu",
  description: "100% Pure Vegetarian Restaurant in Diu. Indian, Chinese, Paneer, Tandoor, Thalis & more. Grand Party Hall for 900+ guests. Open 9 AM - 3 AM. Order online!",
  keywords: ["Bawarchi", "Bawarchi Diu", "pure veg restaurant Diu", "vegetarian restaurant Diu", "best veg restaurant Diu", "Indian cuisine Diu", "veg food Diu", "thali Diu", "paneer Diu", "party hall Diu", "restaurant in Diu", "Diu restaurant"],
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://bawarchirestaurantdiu.com"),
  openGraph: {
    title: "Bawarchi - The Indian Cuisine Restaurant | Pure Veg | Diu",
    description: "100% Pure Vegetarian Restaurant in Diu. Indian, Chinese, Paneer, Tandoor, Thalis & more. Grand Party Hall for 900+ guests.",
    url: "https://bawarchirestaurantdiu.com",
    siteName: "Bawarchi Restaurant Diu",
    images: [{ url: "/restaurant-bg.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bawarchi - Pure Veg Restaurant | Diu",
    description: "100% Pure Vegetarian Restaurant in Diu. Indian, Chinese, Paneer, Tandoor, Thalis & more.",
    images: ["/restaurant-bg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://bawarchirestaurantdiu.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
