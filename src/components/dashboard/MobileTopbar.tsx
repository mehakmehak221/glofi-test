"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { SearchIcon, MenuIcon, BellIcon } from "@/components/VectorImages";
import { useI18n } from "@/providers/LocaleProvider";
import MobileDrawer from "./MobileDrawer";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

export default function MobileTopbar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isLight, setIsLight] = useState(false);
    const { t } = useI18n();

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
            <header className="flex md:hidden items-center justify-between px-4 py-3 bg-[var(--header-bg)]/80 backdrop-blur-md border-b border-[var(--header-border)] sticky top-0 z-40">

                <Link href="/dashboard" className="flex items-center gap-3 no-underline">
                    <Image
                        src={isLight ? "/assets/images/branding/light-logo.png" : "/assets/images/branding/logo.png"}
                        alt="Glofi Logo"
                        width={107}
                        height={32}
                        className="h-8 w-auto object-contain flex-shrink-0"
                    />

                </Link>

                <div className="flex items-center gap-2">
                    <LanguageSwitcher variant="dashboard" />
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:bg-[var(--sidebar-active-bg)] transition-colors bg-transparent border-0 cursor-pointer"
                        aria-label={t("Open menu")}
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    );
}
