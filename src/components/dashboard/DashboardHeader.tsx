"use client";

import { useState, useEffect } from "react";
import Avatar from "@/components/ui/Avatar";
import { usePathname } from "next/navigation";
import { MoonIcon, SunIcon } from "@/components/VectorImages";
import { useGetProfileQuery } from "@/store/api/authApi";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

export default function DashboardHeader() {
    const [mounted, setMounted] = useState(false);
    const [isLight, setIsLight] = useState(false);
    const pathname = usePathname();
    const { data: profileData } = useGetProfileQuery();

    useEffect(() => {
        setTimeout(() => {
            setMounted(true);
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme === "light") {
                setIsLight(true);
            }
        }, 0);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;
        if (isLight) {
            root.classList.add("light");
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            root.classList.add("dark");
            root.classList.remove("light");
            localStorage.setItem("theme", "dark");
        }
    }, [isLight, mounted]);

    const profile = profileData?.agentProfile || profileData?.partnerProfile || profileData?.investorProfile || {};
    const fullName = profileData?.fullName || profile.fullName || profileData?.name || profile.name || "Guest";
    const avatarUrl = profileData?.avatarUrl || profile.avatarUrl || "";

    let displayRole = "Investor";
    if (pathname.startsWith("/dashboard/partner")) {
        displayRole = "Developer";
    } else if (pathname.startsWith("/dashboard/agent")) {
        displayRole = "Agent";
    } else if (pathname.startsWith("/dashboard/investor")) {
        displayRole = "Investor";
    } else {
        const storedRole = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
        if (storedRole) {
            displayRole = storedRole.charAt(0).toUpperCase() + storedRole.slice(1).toLowerCase();
        } else if (profileData?.role) {
            displayRole = profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1).toLowerCase();
        }
    }

    return (
        <header className="hidden md:flex items-center justify-end px-6 py-3 bg-[var(--header-bg)]/80 backdrop-blur-md border-b border-[var(--header-border)] sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <LanguageSwitcher variant="dashboard" />
                <button
                    onClick={() => setIsLight(!isLight)}
                    className="flex items-center w-14 h-8 p-1 rounded-full transition-colors cursor-pointer bg-[var(--search-bg)] border border-[var(--search-border)] relative outline-none"
                    title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
                >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isLight ? 'translate-x-6 bg-[var(--sidebar-active-text)] shadow-sm' : 'translate-x-0 bg-[var(--dashboard-border)]'}`}>
                        {isLight ? (
                            <SunIcon className="w-3.5 h-3.5 text-white" />
                        ) : (
                            <MoonIcon className="w-3.5 h-3.5 text-[var(--sidebar-text)]" />
                        )}
                    </div>
                </button>

                <div className="flex items-center gap-3 pl-3 border-l border-[var(--header-border)]">
                    <Avatar src={avatarUrl} name={fullName} size="sm" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[var(--header-text)] leading-tight">{fullName}</span>
                        <span className="text-[10px] text-[var(--header-text)] opacity-60 uppercase tracking-wider">{displayRole}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
