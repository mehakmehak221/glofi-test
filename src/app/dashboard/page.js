"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const userType = localStorage.getItem("userType");
        if (userType === "Partner") {
            router.replace("/dashboard/partner/overview");
        } else {
            router.replace("/dashboard/investor/marketplace");
        }
    }, [router]);

    return null;
}
