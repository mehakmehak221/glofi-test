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
    <div className="w-full min-h-screen bg-[var(--background)] theme-purple light">
      {/* Public site navbar */}
      <div className="landing-page">
        <Navbar />
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
