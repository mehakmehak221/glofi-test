"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PartnerDashboardRoot() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard/partner/overview");
    }, [router]);

    return null;
}
