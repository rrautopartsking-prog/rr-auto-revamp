import type { Metadata, Viewport } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@/components/analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSettings } from "@/lib/settings";

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
    default: "RR Auto Revamp — Premium Automotive Parts Delhi & India",
    template: "%s | RR Auto Revamp",
  },
  description:
    "RR Auto Revamp — your trusted source for OEM, aftermarket, and performance automotive parts in Delhi, India. Genuine parts for Porsche, BMW, Mercedes, Land Rover, Audi, Maruti, Hyundai and more.",
  keywords: [
  "Delhi Auto Revamp",
  "Delhi Auto Parts",
  "car spare parts Delhi",
  "auto spare parts Delhi",
  "automotive parts Delhi",
  "car parts Delhi",
  "OEM car parts Delhi",
  "aftermarket car parts Delhi",
  "genuine car parts Delhi",
  "used car parts Delhi",
  "luxury car parts Delhi",
  "performance car parts Delhi",
  "wholesale car parts Delhi",
  "bulk auto parts Delhi",
  "online car parts Delhi",
  "car accessories Delhi",
  "vehicle spare parts Delhi",
  "automobile spare parts Delhi",
  "best auto parts shop Delhi",
  "car spare parts supplier Delhi",
  "car spare parts near me Delhi",
  "cheap car parts Delhi",
  "premium car parts Delhi",
  "imported car parts Delhi",
  "car engine parts Delhi",
  "car body parts Delhi",
  "car suspension parts Delhi",
  "car brake parts Delhi",
  "car modification parts Delhi",
  "car tuning parts Delhi",
  "car repair parts Delhi",
  "car maintenance parts Delhi",
  "used auto parts Delhi",
  "new car parts Delhi",
  "car spare parts India",
  "auto spare parts India",
  "spare parts marketplace Delhi",
  "automotive components Delhi",
  "car parts ecommerce Delhi",
  "Delhi NCR auto parts",
  "Mahindra spare parts Delhi",
  "Maruti Suzuki spare parts Delhi",
  "Hyundai spare parts Delhi",
  "Toyota spare parts Delhi",
  "Honda spare parts Delhi",
  "Kia spare parts Delhi",
  "MG spare parts Delhi",
  "Tata spare parts Delhi",
  "Skoda spare parts Delhi",
  "Volkswagen spare parts Delhi",
  "BMW spare parts Delhi",
  "Mercedes spare parts Delhi",
  "Audi spare parts Delhi",
  "Porsche spare parts Delhi",
  "Range Rover spare parts Delhi",
  "Land Rover spare parts Delhi",
  "Jaguar spare parts Delhi",
  "Ford spare parts Delhi",
  "Nissan spare parts Delhi",
  "Renault spare parts Delhi",
  "Chevrolet spare parts Delhi",
  "Jeep spare parts Delhi",
  "car spare parts wholesaler Delhi",
  "auto parts distributor Delhi",
  "best spare parts website Delhi",
  "buy car parts online Delhi",
  "fast delivery auto parts Delhi",
  "genuine OEM spare parts Delhi",
  "aftermarket accessories Delhi",
  "high performance auto parts Delhi",
  "Delhi luxury auto spare parts",
  "car dismantling parts Delhi",
  "second hand car parts Delhi",
  "automobile spare parts store Delhi",
  "engine spare parts Delhi",
  "transmission parts Delhi",
  "SUV spare parts Delhi",
  "sedan spare parts Delhi",
  "hatchback spare parts Delhi",
  "car workshop spare parts Delhi",
  "automotive spare parts ecommerce India"
],
  authors: [{ name: "RR Auto Revamp" }],
  creator: "RR Auto Revamp",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rrautorevamp.com",
    siteName: "RR Auto Revamp",
    title: "RR Auto Revamp — Premium Automotive Parts Delhi & India",
    description: "OEM, aftermarket & performance car parts in Delhi, India. Trusted by enthusiasts and garages across India.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "RR Auto Revamp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RR Auto Revamp — Premium Automotive Parts Delhi & India",
    description: "OEM, aftermarket & performance car parts in Delhi, India. Trusted by enthusiasts and garages across India.",
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const gaId = settings.google_analytics_id || "G-S3L852Q8DS";
  const pixelId = settings.meta_pixel_id || undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics — injected in <head> so GA can detect the tag */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `,
          }}
        />
      </head>
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
        <Analytics gaId={gaId} pixelId={pixelId} />
        <SpeedInsights />
      </body>
    </html>
  );
}
