import type { Metadata, Viewport } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@/components/analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
    default: "RR Auto Revamp — Premium Automotive Parts Dubai & UAE",
    template: "%s | RR Auto Revamp",
  },
  description:
    "RR Auto Revamp — your trusted source for OEM, aftermarket, and performance automotive parts in Dubai, UAE & GCC. Genuine parts for Porsche, BMW, Mercedes, Land Rover, Audi and more.",
  keywords: [
    "RR Auto Revamp",
    "RR Auto Parts",
    "rrautorevamp",
    "automotive parts UAE",
    "car parts Dubai",
    "OEM car parts",
    "aftermarket car parts",
    "luxury car parts UAE",
    "performance car parts GCC",
    "used car parts Dubai",
    "genuine car parts",
    "auto spare parts Dubai",
    "auto spare parts UAE",
    "car spare parts GCC",
    "Porsche parts UAE",
    "BMW parts Dubai",
    "Mercedes parts UAE",
    "Land Rover parts Dubai",
    "Range Rover parts UAE",
    "Audi parts Dubai",
    "bulk auto parts",
    "wholesale car parts UAE",
  ],
  authors: [{ name: "RR Auto Revamp" }],
  creator: "RR Auto Revamp",
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://rrautorevamp.com",
    siteName: "RR Auto Revamp",
    title: "RR Auto Revamp — Premium Automotive Parts Dubai & UAE",
    description: "OEM, aftermarket & performance car parts in Dubai, UAE & GCC. Trusted by enthusiasts and garages.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "RR Auto Revamp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RR Auto Revamp — Premium Automotive Parts Dubai & UAE",
    description: "OEM, aftermarket & performance car parts in Dubai, UAE & GCC. Trusted by enthusiasts and garages.",
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
        <SpeedInsights />
      </body>
    </html>
  );
}
