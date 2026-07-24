"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackReferralClick } from "@/utils/assetShare";

export default function TrackingBootstrap() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const ref = params.get("ref");
    if (!ref) return;

    trackReferralClick(params).catch((error) => {
      console.warn("Referral click tracking failed", error);
    });
  }, [pathname, searchParams]);

  return null;
}

