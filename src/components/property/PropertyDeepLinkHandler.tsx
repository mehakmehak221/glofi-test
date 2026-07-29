"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/sections/Navbar/Navbar";
import GlofiCopyrightSection from "@/components/sections/GlofiCopyrightSection/GlofiCopyrightSection";

interface PropertyDeepLinkHandlerProps {
  propertyIdParam?: string;
}

export default function PropertyDeepLinkHandler({ propertyIdParam }: PropertyDeepLinkHandlerProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0E0F12] text-white flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      }
    >
      <PropertyDeepLinkContent propertyIdParam={propertyIdParam} />
    </Suspense>
  );
}

function PropertyDeepLinkContent({ propertyIdParam }: PropertyDeepLinkHandlerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = propertyIdParam || searchParams.get("id") || "";

  const [deviceType, setDeviceType] = useState<"android" | "ios" | "desktop" | "detecting">("detecting");

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

  const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=app.glofiestates.com";
  const APP_STORE_URL = "https://apps.apple.com/in/app/glofi-estates/id6764258977";

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

  const isAndroid = deviceType === "android";
  const isIos = deviceType === "ios";

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-8">
        <div className="max-w-md w-full bg-[#16181F] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/5 text-center flex flex-col items-center">
          
          {/* Logo / App Icon Badge */}
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-6 bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-emerald-400/5 border border-emerald-500/30 flex items-center justify-center p-2 shadow-lg shadow-emerald-500/10">
            <Image
              src="/assets/images/logo/glofi_logo.png"
              alt="GloFi Estates"
              width={64}
              height={64}
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = "none";
              }}
            />
            <span className="text-xl font-extrabold text-emerald-400">GloFi</span>
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
            GloFi Estates Property
          </h1>

          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            {propertyId
              ? `You are viewing property #${propertyId} on GloFi Estates.`
              : "Discover fractionally owned high-yield real estate investments on GloFi Estates."}
          </p>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            {/* Primary Device App Store Button */}
            {isAndroid ? (
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.61-1.616V3.43a2.37 2.37 0 0 1 .609-1.616zm11.3 9.072l2.364-2.364-11.758-6.72 9.394 9.084zm0 2.228l-9.394 9.084 11.758-6.72-2.364-2.364zm1.114-1.114l3.187 1.821c.887.507.887 1.332 0 1.839l-3.187 1.821-2.072-2.072 2.072-2.072z"/>
                </svg>
                <span>Get App on Google Play Store</span>
              </a>
            ) : isIos ? (
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.12-.97.04-2.18.65-2.88 1.47-.63.73-1.18 1.89-1.03 3.02 1.09.08 2.23-.55 2.92-1.37z" />
                </svg>
                <span>Get App on Apple App Store</span>
              </a>
            ) : null}

            {/* Alternative App Store Option (Secondary) */}
            {isAndroid ? (
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-xl font-semibold text-xs text-gray-300 hover:text-emerald-400 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.12-.97.04-2.18.65-2.88 1.47-.63.73-1.18 1.89-1.03 3.02 1.09.08 2.23-.55 2.92-1.37z" />
                </svg>
                <span>Get App on Apple App Store</span>
              </a>
            ) : isIos ? (
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-xl font-semibold text-xs text-gray-300 hover:text-emerald-400 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.61-1.616V3.43a2.37 2.37 0 0 1 .609-1.616zm11.3 9.072l2.364-2.364-11.758-6.72 9.394 9.084zm0 2.228l-9.394 9.084 11.758-6.72-2.364-2.364zm1.114-1.114l3.187 1.821c.887.507.887 1.332 0 1.839l-3.187 1.821-2.072-2.072 2.072-2.072z"/>
                </svg>
                <span>Get App on Google Play Store</span>
              </a>
            ) : null}

            {/* Web Marketplace Option */}
            <button
              onClick={handleContinueWeb}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-emerald-500/40"
            >
              <span>Continue on Web Marketplace</span>
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
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

