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
  title: "Glofi Real Estate — Global Finance Platform",
  description: "Glofi – the global real estate and finance platform connecting investors worldwide.",
  icons: {
    icon: "/assets/images/branding/favicon.png",
  },
};

import { CurrencyProvider } from "@/providers/CurrencyProvider";
import GlobalToast from "@/components/GlobalToast";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased bg-[var(--background)] theme-purple`}>
        <CurrencyProvider>
          <StoreProvider>
            <GlobalToast />
            {children}
          </StoreProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
