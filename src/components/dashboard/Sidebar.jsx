"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import NavItem from "./NavItem";
import {
    MarketplaceIcon,
    PortfolioIcon,
    TransactionsIcon,
    AccountIcon,
    CollapseIcon,
    SignOutIcon,
    SecondaryMarketplaceIcon,
} from "@/components/VectorImages";

const NAV_ITEMS = [
    { href: "/dashboard/investor/marketplace", icon: MarketplaceIcon, label: "Marketplace" },
    { href: "/dashboard/investor/secondary-marketplace", icon: SecondaryMarketplaceIcon, label: "Secondary Marketplace" },
    { href: "/dashboard/investor/portfolio", icon: PortfolioIcon, label: "Portfolio" },
    { href: "/dashboard/investor/transactions", icon: TransactionsIcon, label: "Transactions" },
    { href: "/dashboard/investor/account", icon: AccountIcon, label: "Account" },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <motion.aside
            className="hidden lg:flex flex-col h-screen sticky top-0 bg-[var(--color-bg-dark)] border-r border-[var(--color-border-subtle)] z-40 overflow-hidden"
            animate={{ width: collapsed ? 80 : 250 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >

            <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[var(--color-border-subtle)]">
                <Link href="/dashboard/investor/marketplace" className="flex items-center gap-3 no-underline">
                    <Image
                        src="/assets/logo.png"
                        alt="GloFi Logo"
                        width={120}
                        height={40}
                        className="h-7 w-auto flex-shrink-0 object-contain"
                    />
                    <motion.span
                        className="font-montserrat text-[10px] font-normal text-[var(--color-text-secondary)] uppercase tracking-[1.5px] leading-[15px] whitespace-nowrap overflow-hidden"
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
                <span className="text-[10px] font-normal text-[var(--color-primary-200)] tracking-[0.15em] uppercase border border-[var(--color-primary-300)]/30 font-montserrat bg-[var(--color-primary-300)]/5 rounded-full px-3 py-1 inline-block">
                    Investor Panel
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface-subtle)] transition-colors cursor-pointer w-full border-0 bg-transparent"
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


                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer w-full border-0 bg-transparent group">
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
