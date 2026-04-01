"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { SearchIcon, MenuIcon, BellIcon } from "@/components/VectorImages";
import MobileDrawer from "./MobileDrawer";

export default function MobileTopbar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        const checkTheme = () => {
            setIsLight(document.documentElement.classList.contains('light'));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <header className="flex lg:hidden items-center justify-between px-4 py-3 bg-[var(--header-bg)]/80 backdrop-blur-md border-b border-[var(--header-border)] sticky top-0 z-40">

                <Link href="/dashboard/investor/marketplace" className="flex items-center gap-3 no-underline">
                    <Image
                        src={isLight ? "/assets/images/branding/light-logo.png" : "/assets/images/branding/logo.png"}
                        alt="Glofi Logo"
                        width={80}
                        height={24}
                        className="h-6 w-auto object-contain flex-shrink-0"
                    />
                   
                </Link>

                <div className="flex items-center gap-2">
                    {searchOpen ? (
                        <div className="relative animate-fade-in">
                            <input
                                type="text"
                                placeholder="Search..."
                                autoFocus
                                onBlur={() => setSearchOpen(false)}
                                className="w-40 sm:w-56 rounded-lg pl-8 pr-3 py-2 text-sm text-[var(--header-text)] placeholder:[var(--color-text-muted)] bg-[var(--field-surface)] border border-[var(--sidebar-border)] focus:outline-none focus:border-[var(--sidebar-active-text)]/50"
                            />
                            <SearchIcon className="w-4 h-4 text-[var(--color-text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                    ) : (
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:bg-[var(--sidebar-active-bg)] transition-colors bg-transparent border-0 cursor-pointer"
                        >
                            <SearchIcon className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        className="relative p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:bg-[var(--sidebar-active-bg)] transition-colors bg-transparent border-0 cursor-pointer"
                        aria-label="Notifications"
                    >
                        <BellIcon className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[var(--sidebar-active-text)] rounded-full border-2 border-[var(--header-bg)]" />
                    </button>

                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:bg-[var(--sidebar-active-bg)] transition-colors bg-transparent border-0 cursor-pointer"
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
