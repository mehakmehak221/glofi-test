"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/store/api/authApi";
import { getCookie } from "@/utils/cookieUtils";

export function SessionSynchronizer() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Skip fetching profile if there is no access token in the cookies
  const token = typeof window !== "undefined" ? getCookie("access_token") : null;
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (!profileData) return;

    // Sync session state to localStorage if missing or out of sync
    const savedToken = localStorage.getItem("access_token");
    if (!savedToken && token) {
      localStorage.setItem("access_token", token);
    }
    localStorage.setItem("isLoggedIn", "true");

    const currentRole = profileData.role?.toUpperCase(); // e.g. "INVESTOR", "PARTNER", "AGENT"
    if (currentRole) {
      const savedRole = localStorage.getItem("userType");
      if (savedRole !== currentRole) {
        localStorage.setItem("userType", currentRole);
      }

      // Perform auto-redirection if they land on the wrong dashboard subpath
      if (pathname === "/dashboard") {
        if (currentRole === "PARTNER") {
          router.replace("/dashboard/partner/overview");
        } else if (currentRole === "AGENT") {
          router.replace("/dashboard/agent/overview");
        } else {
          router.replace("/dashboard/investor/marketplace");
        }
      } else if (pathname.startsWith("/dashboard/investor") && currentRole !== "INVESTOR") {
        if (currentRole === "PARTNER") {
          router.replace("/dashboard/partner/overview");
        } else if (currentRole === "AGENT") {
          router.replace("/dashboard/agent/overview");
        }
      } else if (pathname.startsWith("/dashboard/partner") && currentRole !== "PARTNER") {
        if (currentRole === "AGENT") {
          router.replace("/dashboard/agent/overview");
        } else {
          router.replace("/dashboard/investor/marketplace");
        }
      } else if (pathname.startsWith("/dashboard/agent") && currentRole !== "AGENT") {
        if (currentRole === "PARTNER") {
          router.replace("/dashboard/partner/overview");
        } else {
          router.replace("/dashboard/investor/marketplace");
        }
      }
    }
  }, [profileData, token, pathname, router]);

  return null;
}
