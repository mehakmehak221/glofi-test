"use client";

import SearchBar from "./SearchBar";
import Avatar from "@/components/ui/Avatar";
import { BellIcon } from "@/components/VectorImages";

export default function DashboardHeader() {
    return (
        <header className="hidden lg:flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-30">
            <SearchBar placeholder="Search..." className="w-full max-w-md" />

            <div className="flex items-center gap-4 ml-4">
                {/* Notification Bell */}
                <button className="relative p-2 rounded-lg text-[#767676] hover:text-white hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-0">
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00FFCD] rounded-full" />
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-3 border-l border-white/[0.06]">
                    <Avatar name="Ishan" size="sm" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white leading-tight">Ishan</span>
                        <span className="text-[10px] text-[#767676] uppercase tracking-wider">Investor</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
