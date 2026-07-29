"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackReferralClick } from "@/utils/assetShare";

export default function TrackingBootstrap() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const referralCode = params.get("ref") || params.get("referral");
    const utmSource = params.get("utm_source");
    const utmMedium = params.get("utm_medium");
    const utmCampaign = params.get("utm_campaign");
    const utmTerm = params.get("utm_term");
    const utmContent = params.get("utm_content");

    if (!referralCode && !utmSource && !utmMedium && !utmCampaign && !utmTerm && !utmContent) {
      return;
    }

    trackReferralClick(params).catch((error) => {
      console.warn("Referral click tracking failed", error);
    });
  }, [pathname, searchParams]);

  return null;
}

