"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NavItem from "./NavItem";
import { useLogoutMutation } from "@/store/api/authApi";
import { removeCookie } from "@/utils/cookieUtils";
import { useI18n } from "@/providers/LocaleProvider";

import {
    OverviewIcon,
    PropertyIcon,
    FinancialIcon,
    CollapseIcon,
    SignOutIcon,
    SupportIcon,
    AccountIcon,
} from "@/components/VectorImages";

const NAV_ITEMS = [
    { href: "/dashboard/partner/overview", icon: OverviewIcon, labelKey: "Overview" },
    { href: "/dashboard/partner/properties", icon: PropertyIcon, labelKey: "Properties" },
    { href: "/dashboard/partner/finance", icon: FinancialIcon, labelKey: "Finance" },
    { href: "/dashboard/partner/account", icon: AccountIcon, labelKey: "Account" },
];

export default function PartnerSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [isLight, setIsLight] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [logout] = useLogoutMutation();
    const { t } = useI18n();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (err) {

            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("userType");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("access_token");
            removeCookie("isLoggedIn");
            removeCookie("access_token");
            localStorage.setItem("toastMessage", t("Logged out successfully"));
            window.location.href = "/sign-in?clear=true";
        }
    };

    useEffect(() => {
        setIsLight(document.documentElement.classList.contains('light'));
        const observer = new MutationObserver(() => {
            setIsLight(document.documentElement.classList.contains('light'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return (
        <motion.aside
            className="hidden md:flex flex-col h-screen sticky top-0 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] z-40 overflow-hidden"
            animate={{ width: collapsed ? 80 : 220 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >

            <div className="flex items-center justify-center h-16 px-4 border-b border-[var(--sidebar-border)] overflow-hidden">
                <Link href="/dashboard/partner/overview" className="flex items-center justify-center w-full gap-3 no-underline">
                    <motion.div
                        animate={{
                            opacity: collapsed ? 0 : 1,
                            width: collapsed ? 0 : "auto",
                            x: collapsed ? -20 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center gap-3 flex-shrink-0"
                    >
                        <Image
                            src={isLight ? "/assets/images/branding/light-logo.png" : "/assets/images/branding/logo.png"}
                            alt="Glofi Logo"
                            width={120}
                            height={40}
                            className="h-10 w-auto object-contain"
                        />
                    </motion.div>

                    {collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full flex justify-center"
                        >
                            <Image
                                src="/assets/images/branding/favicon.png"
                                alt="Glofi Mark"
                                width={32}
                                height={32}
                                className="w-8 h-8 object-contain"
                            />
                        </motion.div>
                    )}
                </Link>
            </div>


            <motion.div
                className="px-4 pt-5 pb-2 overflow-hidden"
                animate={{ opacity: collapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
            >
                <span className="text-[10px] font-medium text-[var(--panel-chip-text)] tracking-[0.15em] uppercase border border-[var(--panel-chip-border)] font-montserrat bg-[var(--panel-chip-bg)] rounded-full px-3 py-1 inline-block">
                    {t("Developer Panel")}
                </span>
            </motion.div>


            <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={t(item.labelKey)}
                        isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                        collapsed={collapsed}
                    />
                ))}
            </nav>


            <div className="px-3 pb-4 border-t border-[var(--color-border-subtle)] pt-3 flex flex-col gap-2">

                <motion.button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-hover)] hover:bg-[var(--sidebar-active-bg)] transition-colors cursor-pointer w-full border-0 bg-transparent"
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.span
                        className="flex-shrink-0"
                        animate={{ rotate: collapsed ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CollapseIcon className="w-5 h-5" />
                    </motion.span>
                    <motion.span
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                        animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                        transition={{ duration: 0.2 }}
                    >
                        {t("Collapse")}
                    </motion.span>
                </motion.button>


                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--sidebar-text)] hover:text-[var(--color-status-error)] hover:bg-[var(--color-status-error-bg)] transition-colors cursor-pointer w-full border-0 bg-transparent group"
                >
                    <span className="flex-shrink-0 ml-0.5">
                        <SignOutIcon className="w-5 h-5" />
                    </span>
                    <motion.span
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                        animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                        transition={{ duration: 0.2 }}
                    >
                        {t("Sign Out")}
                    </motion.span>
                </button>
            </div>
        </motion.aside>
    );
}
