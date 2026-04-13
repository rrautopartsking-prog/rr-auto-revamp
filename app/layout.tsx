import type { Metadata, Viewport } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@/components/analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://rrautorevamp.com"),
  title: {
    default: "RR Auto Revamp — Premium Automotive Parts",
    template: "%s | RR Auto Revamp",
  },
  description:
    "Source premium OEM, aftermarket, and performance automotive parts. Trusted by enthusiasts and garages across the GCC.",
  keywords: ["automotive parts", "car parts", "OEM parts", "luxury car parts", "UAE car parts", "GCC automotive"],
  authors: [{ name: "RR Auto Revamp" }],
  creator: "RR Auto Revamp",
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://rrautorevamp.com",
    siteName: "RR Auto Revamp",
    title: "RR Auto Revamp — Premium Automotive Parts",
    description: "Source premium OEM, aftermarket, and performance automotive parts.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "RR Auto Revamp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RR Auto Revamp — Premium Automotive Parts",
    description: "Source premium OEM, aftermarket, and performance automotive parts.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${rajdhani.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a1a1a",
                color: "#fff",
                border: "1px solid #303030",
              },
              success: { iconTheme: { primary: "#C9A84C", secondary: "#000" } },
            }}
          />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
