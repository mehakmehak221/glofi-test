"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StoreProvider } from "@/store/StoreProvider";
import PropertyDetailPage from "@/app/dashboard/investor/marketplace/[id]/page";
import Navbar from "@/components/sections/Navbar/Navbar";
import Link from "next/link";

interface Props {
  assetId: string;
}

function AssetPublicViewInner({ assetId }: Props) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      // Redirect authenticated users into the dashboard context
      router.replace(`/dashboard/investor/marketplace/${assetId}`);
    } else {
      setChecked(true);
    }
  }, [assetId, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090D0A]">
        <div className="w-8 h-8 border-2 border-[#00DAAF]/20 border-t-[#00DAAF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[var(--background)] theme-purple">
      {/* Public site navbar */}
      <div className="landing-page">
        <Navbar />
      </div>

      {/* Call-to-action banner for unauthenticated users */}
      <div className="bg-gradient-to-r from-[#00DAAF]/10 via-[#7B5EA7]/10 to-[#00DAAF]/10 border-b border-[#00DAAF]/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-montserrat">
          <p className="text-[var(--header-text)] font-medium text-center sm:text-left">
            <span className="text-[#00DAAF] font-bold">Sign up free</span> to invest in this property and explore 100+ premium opportunities
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/sign-in"
              className="px-4 py-1.5 rounded-lg border border-[var(--sidebar-border)] text-[var(--header-text)] hover:bg-[var(--sidebar-bg)] transition-all font-semibold text-xs"
            >
              Sign In
            </Link>
            <Link
              href={`/sign-up?redirect=${encodeURIComponent(`/assets/${assetId}`)}`}
              className="px-4 py-1.5 rounded-lg bg-[#00DAAF] text-[#090D0A] font-bold text-xs hover:bg-[#00DAAF]/90 transition-all shadow-sm"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </div>

      {/* Reuse the same PropertyDetailPage component, which already handles
          unauthenticated state (skip private queries, redirect on invest click) */}
      <PropertyDetailPage />
    </div>
  );
}

export default function AssetPublicView({ assetId }: Props) {
  // StoreProvider is already in root layout, but wrapping here is safe (it's idempotent)
  return <AssetPublicViewInner assetId={assetId} />;
}
