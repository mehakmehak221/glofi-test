"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "@/components/ui/Avatar";
import {
    CloseIcon,
    MarketplaceIcon,
    PortfolioIcon,
    TransactionsIcon,
    AccountIcon,
    SignOutIcon,
    SecondaryMarketplaceIcon,
    OverviewIcon,
    PropertyIcon,
    LeadsIcon,
    FinancialIcon
} from "@/components/VectorImages";

const NAV_ITEMS = [
    { href: "/dashboard/investor/marketplace", icon: MarketplaceIcon, label: "Marketplace" },
    { href: "/dashboard/investor/secondary-marketplace", icon: SecondaryMarketplaceIcon, label: "Secondary Marketplace" },
    { href: "/dashboard/investor/portfolio", icon: PortfolioIcon, label: "Portfolio" },
    { href: "/dashboard/investor/transactions", icon: TransactionsIcon, label: "Transactions" },
    { href: "/dashboard/investor/account", icon: AccountIcon, label: "Account" },
];

const PARTNER_NAV_ITEMS = [
    { href: "/dashboard/partner/overview", icon: OverviewIcon, label: "Overview" },
    { href: "/dashboard/partner/properties", icon: PropertyIcon, label: "Properties" },
    { href: "/dashboard/partner/leads", icon: LeadsIcon, label: "Leads & AI" },
    { href: "/dashboard/partner/finance", icon: FinancialIcon, label: "Finance" },
];

const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const itemVariants = {
    hidden: { x: 40, opacity: 0 },
    visible: (i) => ({
        x: 0,
        opacity: 1,
        transition: { delay: i * 0.06, type: "spring", stiffness: 300, damping: 25 },
    }),
};

export default function MobileDrawer({ isOpen, onClose }) {
    const pathname = usePathname();
    const isPartner = pathname.startsWith("/dashboard/partner");
    const activeNavItems = isPartner ? PARTNER_NAV_ITEMS : NAV_ITEMS;

    return (
        <AnimatePresence>
            {isOpen && (
                <>

                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />


                    <motion.div
                        className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#0d0d0d] border-l border-white/[0.06] z-50 flex flex-col lg:hidden"
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <Avatar name="Ishan" size="md" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-white">Ishan</span>
                                    <span className="text-[10px] text-[#767676] uppercase tracking-wider">{isPartner ? "Partner" : "Investor"}</span>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-[#767676] hover:text-white hover:bg-white/5 transition-colors bg-transparent border-0 cursor-pointer"
                                aria-label="Close menu"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Nav Items */}
                        <nav className="flex-1 px-4 py-5 flex flex-col gap-1">
                            <motion.div
                                className="px-4 pt-5 pb-2 overflow-hidden"

                            >
                                <span className="text-[10px] font-normal text-[#00F4C4] tracking-[0.15em] uppercase border border-[#00DAAF33]/30 font-montserrat bg-[#00DAAF0D] rounded-full px-3 py-1 inline-block">
                                    {isPartner ? "Partner Panel" : "Investor Panel"}
                                </span>
                            </motion.div>
                            {activeNavItems.map((item, i) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                return (
                                    <motion.div
                                        key={item.href}
                                        custom={i}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors no-underline ${isActive
                                                ? "bg-[#00FFCD]/10 text-[#00FFCD]"
                                                : "text-[#a0a0a0] hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </nav>

                        {/* Footer */}
                        <div className="px-4 pb-6 pt-3 border-t border-white/[0.06]">
                            <motion.div
                                custom={NAV_ITEMS.length}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#767676] hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer w-full border-0 bg-transparent">
                                    <SignOutIcon className="w-5 h-5" />
                                    <span className="text-sm font-medium">Sign Out</span>
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
