"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NavItem from "./NavItem";
import {
    LogoIcon,
    MarketplaceIcon,
    PortfolioIcon,
    TransactionsIcon,
    AccountIcon,
    CollapseIcon,
    SignOutIcon,
} from "@/components/VectorImages";

const NAV_ITEMS = [
    { href: "/dashboard/marketplace", icon: MarketplaceIcon, label: "Marketplace" },
    { href: "/dashboard/portfolio", icon: PortfolioIcon, label: "Portfolio" },
    { href: "/dashboard/transactions", icon: TransactionsIcon, label: "Transactions" },
    { href: "/dashboard/account", icon: AccountIcon, label: "Account" },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <motion.aside
            className="hidden lg:flex flex-col h-screen sticky top-0 bg-[#0a0a0a] border-r border-white/[0.06] z-40 overflow-hidden"
            animate={{ width: collapsed ? 80 : 250 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.06]">
                <Link href="/dashboard/marketplace" className="flex items-center gap-2.5 no-underline">
                    <LogoIcon className="w-8 h-8 flex-shrink-0" />
                    <motion.div
                        className="flex flex-col overflow-hidden whitespace-nowrap"
                        animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                        transition={{ duration: 0.2 }}
                    >
                        <span className="text-base font-bold bg-gradient-to-r from-[#00FFCD] to-[#009976] bg-clip-text text-transparent leading-tight">
                            GloFi
                        </span>
                        <span className="text-[10px] text-[#767676] tracking-widest uppercase">Real Estate</span>
                    </motion.div>
                </Link>
            </div>

            {/* Investor Panel Label */}
            <motion.div
                className="px-4 pt-5 pb-2 overflow-hidden"
                animate={{ opacity: collapsed ? 0 : 1, height: collapsed ? 0 : "auto" }}
                transition={{ duration: 0.2 }}
            >
                <span className="text-[10px] font-semibold text-[#00FFCD] tracking-[0.15em] uppercase border border-[#00FFCD]/30 rounded-full px-3 py-1 inline-block">
                    Investor Panel
                </span>
            </motion.div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
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

            {/* Bottom Section */}
            <div className="px-3 pb-4 border-t border-white/[0.06] pt-3 flex flex-col gap-2">
                {/* Collapse Toggle */}
                <motion.button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#767676] hover:text-white hover:bg-white/5 transition-colors cursor-pointer w-full border-0 bg-transparent"
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

                {/* Sign Out */}
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#767676] hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer w-full border-0 bg-transparent group">
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
