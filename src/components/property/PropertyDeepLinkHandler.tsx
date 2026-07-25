"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/sections/Navbar/Navbar";
import GlofiCopyrightSection from "@/components/sections/GlofiCopyrightSection/GlofiCopyrightSection";

interface PropertyDeepLinkHandlerProps {
  propertyIdParam?: string;
}

export default function PropertyDeepLinkHandler({ propertyIdParam }: PropertyDeepLinkHandlerProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0E0F12] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <PropertyDeepLinkContent propertyIdParam={propertyIdParam} />
    </Suspense>
  );
}

function PropertyDeepLinkContent({ propertyIdParam }: PropertyDeepLinkHandlerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = propertyIdParam || searchParams.get("id") || "";

  const [deviceType, setDeviceType] = useState<"android" | "ios" | "desktop" | "detecting">("detecting");
  const [isOpeningApp, setIsOpeningApp] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || navigator.vendor;
      let detected: "android" | "ios" | "desktop" = "desktop";
      if (/android/i.test(ua)) {
        detected = "android";
      } else if (/iPad|iPhone|iPod/.test(ua)) {
        detected = "ios";
      }
      setDeviceType(detected);

      // On desktop / laptop / mac, immediately auto-redirect to web marketplace
      if (detected === "desktop") {
        const targetUrl = propertyId
          ? `/dashboard/investor/marketplace/${propertyId}`
          : `/dashboard/investor/marketplace`;
        router.replace(targetUrl);
      }
    }
  }, [propertyId, router]);

  const getStoreUrl = () => {
    if (deviceType === "android") {
      return "https://play.google.com/store/apps/details?id=app.glofiestates.com";
    } else if (deviceType === "ios") {
      return "https://apps.apple.com/in/app/glofi-estates/id6764258977";
    }
    return "https://play.google.com/store/apps/details?id=app.glofiestates.com";
  };

  const handleOpenApp = () => {
    setIsOpeningApp(true);
    const deepLinkScheme = propertyId ? `glofi://property?id=${propertyId}` : `glofi://properties`;

    // Trigger custom app scheme attempt
    window.location.href = deepLinkScheme;

    // Reset loading state after 2 seconds
    const timer = setTimeout(() => {
      setIsOpeningApp(false);
    }, 2000);

    return () => clearTimeout(timer);
  };

  const handleContinueWeb = () => {
    if (propertyId) {
      router.push(`/dashboard/investor/marketplace/${propertyId}`);
    } else {
      router.push(`/dashboard/investor/marketplace`);
    }
  };

  if (deviceType === "desktop" || deviceType === "detecting") {
    return (
      <div className="min-h-screen bg-[#0B0C10] text-white flex flex-col justify-between font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-gray-300">
              Opening property in web marketplace...
            </p>
          </div>
        </main>
        <GlofiCopyrightSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-8">
        <div className="max-w-md w-full bg-[#16181F] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center">
          
          {/* Logo / App Icon Badge */}
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-6 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center p-2 shadow-lg shadow-emerald-500/10">
            <Image
              src="/assets/images/logo/glofi_logo.png"
              alt="GloFi Estates"
              width={64}
              height={64}
              className="object-contain"
              onError={(e) => {
                // Fallback icon if logo image not found at exact path
                const target = e.target as HTMLElement;
                target.style.display = "none";
              }}
            />
            <span className="text-xl font-extrabold text-emerald-400">GloFi</span>
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
            GloFi Estates Property Deep Link
          </h1>

          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            {propertyId
              ? `You are viewing property #${propertyId} on GloFi Estates.`
              : "Discover fractionally owned high-yield real estate investments on GloFi Estates."}
          </p>

          {/* Device Actions */}
          <div className="w-full space-y-3">
            <button
              onClick={handleOpenApp}
              disabled={isOpeningApp}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {isOpeningApp ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Opening App...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 002-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Open in GloFi Mobile App
                </>
              )}
            </button>

            <a
              href={getStoreUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 rounded-xl font-semibold text-xs text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Get App on {deviceType === "ios" ? "Apple App Store" : "Google Play Store"}
            </a>

            <button
              onClick={handleContinueWeb}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all cursor-pointer"
            >
              Continue on Web Marketplace &rarr;
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 w-full flex items-center justify-center gap-4 text-[11px] text-gray-500 font-medium">
            <span>🔒 Secure Platform</span>
            <span>•</span>
            <span>Real World Assets</span>
          </div>

        </div>
      </main>

      <GlofiCopyrightSection />
    </div>
  );
}
