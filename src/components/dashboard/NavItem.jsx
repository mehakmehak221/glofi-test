"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NavItem({ href, icon: Icon, label, isActive, collapsed = false, onClick }) {
    return (
        <Link href={href} onClick={onClick} className="block">
            <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-200 group relative ${isActive
                        ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]"
                        : "text-[var(--sidebar-text)] opacity-70 hover:opacity-100 hover:bg-[var(--sidebar-active-bg)]"
                    }`}
                whileHover={{ x: collapsed ? 0 : 4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
                {isActive && (
                    <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[var(--sidebar-active-text)]"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                )}

                <span className="flex-shrink-0 ml-0.5">
                    <Icon className="w-5 h-5" />
                </span>

                <motion.span
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    animate={{
                        opacity: collapsed ? 0 : 1,
                        width: collapsed ? 0 : "auto",
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    {label}
                </motion.span>

                {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] text-xs text-[var(--sidebar-text)] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg">
                        {label}
                    </div>
                )}
            </motion.div>
        </Link>
    );
}
