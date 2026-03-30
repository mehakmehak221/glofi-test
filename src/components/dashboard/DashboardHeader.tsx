"use client";

import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import Avatar from "@/components/ui/Avatar";
import { BellIcon, MoonIcon, SunIcon } from "@/components/VectorImages";
import { useGetProfileQuery } from "@/store/api/authApi";

export default function DashboardHeader() {
    const [mounted, setMounted] = useState(false);
    const [isLight, setIsLight] = useState(false);
    const { data: profileData } = useGetProfileQuery();

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            setIsLight(true);
        }
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

    const profile = profileData?.partnerProfile || profileData?.investorProfile || {};
    const fullName = profile.fullName || profileData?.name || "Guest";
    const role = profileData?.role ? (profileData.role.charAt(0) + profileData.role.slice(1).toLowerCase()) : "User";

    return (
        <header className="hidden lg:flex items-center justify-between px-6 py-3 bg-[var(--header-bg)]/80 backdrop-blur-md border-b border-[var(--header-border)] sticky top-0 z-30">
            <SearchBar placeholder="Search..." className="w-full max-w-md" />

            <div className="flex items-center gap-4 ml-4">
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
            
                <button className="relative p-2 rounded-lg text-[var(--sidebar-text)] hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-0">
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--sidebar-active-text)] rounded-full" />
                </button>

              
                <div className="flex items-center gap-3 pl-3 border-l border-[var(--header-border)]">
                    <Avatar name={fullName} size="sm" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[var(--header-text)] leading-tight">{fullName}</span>
                        <span className="text-[10px] text-[var(--header-text)] opacity-60 uppercase tracking-wider">{role}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
