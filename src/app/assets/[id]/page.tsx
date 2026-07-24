"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function AssetRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assetId = params.id as string;

  useEffect(() => {
    if (!assetId) return;

    // Check if the user is authenticated
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const ref = searchParams.get("ref");
    const queryStr = ref ? `?ref=${encodeURIComponent(ref)}` : "";

    if (isLoggedIn) {
      router.replace(`/dashboard/investor/marketplace/${assetId}${queryStr}`);
    } else {
      router.replace(`/sign-up${queryStr}`);
    }
  }, [assetId, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090D0A]">
      <div className="w-8 h-8 border-2 border-[#00DAAF]/20 border-t-[#00DAAF] rounded-full animate-spin" />
    </div>
  );
}
