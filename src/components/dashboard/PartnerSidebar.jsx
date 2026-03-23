"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import NavItem from "./NavItem";
import {
    OverviewIcon,
    PropertyIcon,
    LeadsIcon,
    FinancialIcon,
    CollapseIcon,
    SignOutIcon,
} from "@/components/VectorImages";

const NAV_ITEMS = [
    { href: "/dashboard/partner/overview", icon: OverviewIcon, label: "Overview" },
    { href: "/dashboard/partner/properties", icon: PropertyIcon, label: "Properties" },
    { href: "/dashboard/partner/leads", icon: LeadsIcon, label: "Leads & AI" },
    { href: "/dashboard/partner/finance", icon: FinancialIcon, label: "Finance" },
];

export default function PartnerSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [isLight, setIsLight] = useState(false);
    const pathname = usePathname();

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
            className="hidden lg:flex flex-col h-screen sticky top-0 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] z-40 overflow-hidden"
            animate={{ width: collapsed ? 80 : 220 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >

            <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[var(--color-border-subtle)]">
                <Link href="/dashboard/partner/overview" className="flex items-center gap-3 no-underline">
                    <Image
                        src={isLight ? "/light-logo.png" : "/assets/logo.png"}
                        alt="GloFi Logo"
                        width={120}
                        height={40}
                        className="h-7 w-auto flex-shrink-0 object-contain"
                    />
                    <motion.span
                        className="font-montserrat text-[10px] font-normal text-[var(--sidebar-text)] uppercase tracking-[1.5px] leading-[15px] whitespace-nowrap overflow-hidden"
                        animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                        transition={{ duration: 0.2 }}
                    >
                        Real Estate
                    </motion.span>
                </Link>
            </div>


            <motion.div
                className="px-4 pt-5 pb-2 overflow-hidden"
                animate={{ opacity: collapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
            >
                <span className="text-[10px] font-normal text-[var(--badge-text)] tracking-[0.15em] uppercase border border-[var(--badge-border)] font-montserrat bg-[var(--badge-bg)] rounded-full px-3 py-1 inline-block">
                    Partner Panel
                </span>
            </motion.div>


            <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
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
                        Collapse
                    </motion.span>
                </motion.button>


                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--sidebar-text)] hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer w-full border-0 bg-transparent group">
                    <span className="flex-shrink-0 ml-0.5">
                        <SignOutIcon className="w-5 h-5" />
                    </span>
                    <motion.span
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                        animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                        transition={{ duration: 0.2 }}
                    >
                        Sign Out
                    </motion.span>
                </button>
            </div>
        </motion.aside>
    );
}
