"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const userType = (localStorage.getItem("userType") || "").toUpperCase();
        if (userType === "PARTNER") {
            router.replace("/dashboard/partner/overview");
        } else if (userType === "AGENT") {
            router.replace("/dashboard/agent/overview");
        } else {
            router.replace("/dashboard/investor/marketplace");
        }
    }, [router]);

    return null;
}
