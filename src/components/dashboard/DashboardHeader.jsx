"use client";

import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import Avatar from "@/components/ui/Avatar";
import { BellIcon, MoonIcon, SunIcon } from "@/components/VectorImages";

export default function DashboardHeader() {
    const [isLight, setIsLight] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "light";
        }
        return false;
    });

    useEffect(() => {
        const root = document.documentElement;
        console.log("Setting theme to:", isLight ? "light" : "dark");
        if (isLight) {
            root.classList.add("light");
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            root.classList.add("dark");
            root.classList.remove("light");
            localStorage.setItem("theme", "dark");
        }
    }, [isLight]);

    return (
        <header className="hidden lg:flex items-center justify-between px-6 py-3 bg-[var(--header-bg)]/80 backdrop-blur-md border-b border-[var(--header-border)] sticky top-0 z-30">
            <SearchBar placeholder="Search..." className="w-full max-w-md" />

            <div className="flex items-center gap-4 ml-4">
                <button 
                    onClick={() => setIsLight(!isLight)}
                    className="flex items-center w-11 h-6 p-1 rounded-full transition-colors cursor-pointer bg-[var(--search-bg)] border border-[var(--search-border)] relative outline-none"
                    title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
                >
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${isLight ? 'translate-x-5 bg-[var(--sidebar-active-text)] shadow-sm' : 'translate-x-0 bg-[#333333]'}`}>
                        {isLight ? (
                            <SunIcon className="w-2.5 h-2.5 text-white" />
                        ) : (
                            <MoonIcon className="w-2.5 h-2.5 text-white/70" />
                        )}
                    </div>
                </button>
            
                <button className="relative p-2 rounded-lg text-[var(--sidebar-text)] hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-0">
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--sidebar-active-text)] rounded-full" />
                </button>

              
                <div className="flex items-center gap-3 pl-3 border-l border-[var(--header-border)]">
                    <Avatar name="Ishan" size="sm" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[var(--header-text)] leading-tight">Ishan</span>
                        <span className="text-[10px] text-[var(--header-text)] opacity-60 uppercase tracking-wider">Investor</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
