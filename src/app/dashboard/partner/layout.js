"use client";

import PartnerSidebar from "@/components/dashboard/PartnerSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileTopbar from "@/components/dashboard/MobileTopbar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[var(--background)]">

            <PartnerSidebar />


            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

                <MobileTopbar />


                <DashboardHeader />


                <main className="flex-1 overflow-y-auto bg-[var(--background)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
