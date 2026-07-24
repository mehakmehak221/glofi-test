import { ReactNode } from "react";
import { Montserrat, Poppins } from "next/font/google";
import "./satoshi.css";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.glofiestates.com"),
  title: "Glofi Estates | Own Premium Real Estate, Fraction by Fraction",
  description: "Glofi Estates is a modern real estate investment platform that makes premium property ownership accessible through fractional investing. Explore curated real estate opportunities, diversify your portfolio, earn passive income, and track your investments with complete transparency—all from a single platform.",
  keywords: [
    "Alternative Investment Platform",
    "Passive Income Through Real Estate",
    "Real Estate Crowdfunding India",
    "Smart Property Investments",
    "High Return Real Estate Investments",
    "Wealth Building Through Real Estate",
    "Real Estate Portfolio Diversification",
    "Premium Property Investment",
    "Fractional Real Estate Investment"
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/assets/images/branding/favicon.png",
  },
};

import { CurrencyProvider } from "@/providers/CurrencyProvider";
import GlobalToast from "@/components/GlobalToast";
import Script from "next/script";
import TrackingBootstrap from "@/components/TrackingBootstrap";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z15Q0W903Y"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z15Q0W903Y');
          `}
        </Script>
      </head>
      <body className={`${montserrat.variable} antialiased bg-[var(--background)] theme-purple`}>
        <CurrencyProvider>
          <StoreProvider>
            <GlobalToast />
            <TrackingBootstrap />
            {children}
          </StoreProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
