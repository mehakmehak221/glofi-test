"use client";

import SearchBar from "./SearchBar";
import Avatar from "@/components/ui/Avatar";
import { BellIcon } from "@/components/VectorImages";

export default function DashboardHeader() {
    return (
        <header className="hidden lg:flex items-center justify-between px-6 py-3 bg-[var(--color-bg-dark)]/80 backdrop-blur-md border-b border-[var(--color-border-subtle)] sticky top-0 z-30">
            <SearchBar placeholder="Search..." className="w-full max-w-md" />

            <div className="flex items-center gap-4 ml-4">
            
                <button className="relative p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface-subtle)] transition-colors cursor-pointer bg-transparent border-0">
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-primary-300)] rounded-full" />
                </button>

              
                <div className="flex items-center gap-3 pl-3 border-l border-[var(--color-border-subtle)]">
                    <Avatar name="Ishan" size="sm" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white leading-tight">Ishan</span>
                        <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider">Investor</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
