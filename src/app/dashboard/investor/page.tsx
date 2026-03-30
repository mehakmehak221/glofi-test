"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InvestorDashboardRoot() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard/investor/marketplace");
    }, [router]);

    return null;
}
