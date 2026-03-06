"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoIcon, SearchIcon, MenuIcon } from "@/components/VectorImages";
import MobileDrawer from "./MobileDrawer";

export default function MobileTopbar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            <header className="flex lg:hidden items-center justify-between px-4 py-3 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-40">
                {/* Logo */}
                <Link href="/dashboard/marketplace" className="flex items-center gap-2 no-underline">
                    <LogoIcon className="w-7 h-7" />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold bg-gradient-to-r from-[#00FFCD] to-[#009976] bg-clip-text text-transparent leading-tight">
                            GloFi
                        </span>
                    </div>
                </Link>

                {/* Search + Hamburger */}
                <div className="flex items-center gap-2">
                    {searchOpen ? (
                        <div className="relative animate-fade-in">
                            <input
                                type="text"
                                placeholder="Search..."
                                autoFocus
                                onBlur={() => setSearchOpen(false)}
                                className="w-40 sm:w-56 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-[#4c4c4c] bg-[#1a1a1a] border border-white/10 focus:outline-none focus:border-[#00FFCD]/60"
                            />
                            <SearchIcon className="w-4 h-4 text-[#767676] absolute left-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                    ) : (
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 rounded-lg text-[#767676] hover:text-white hover:bg-white/5 transition-colors bg-transparent border-0 cursor-pointer"
                        >
                            <SearchIcon className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="p-2 rounded-lg text-[#767676] hover:text-white hover:bg-white/5 transition-colors bg-transparent border-0 cursor-pointer"
                        aria-label="Open menu"
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    );
}
