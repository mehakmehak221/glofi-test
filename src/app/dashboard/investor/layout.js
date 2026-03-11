"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileTopbar from "@/components/dashboard/MobileTopbar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-bg-dark">
           
            <Sidebar />

          
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
               
                <MobileTopbar />

                
                <DashboardHeader />

             
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
