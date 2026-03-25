"use client";

import { usePathname, useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/store/api/authApi";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "@/components/ui/Avatar";
import { useLogoutMutation } from "@/store/api/authApi";
import { removeCookie } from "@/utils/cookieUtils";
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
    // { href: "/dashboard/partner/leads", icon: LeadsIcon, label: "Leads & AI" },
     { href: "/dashboard/partner/secondary-approvals", icon: SecondaryMarketplaceIcon, label: "Resale Approvals" },
    { href: "/dashboard/partner/finance", icon: FinancialIcon, label: "Finance" },
    // { href: "/dashboard/partner/account", icon: AccountIcon, label: "Account" },
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
    const router = useRouter();
    const isPartner = pathname.startsWith("/dashboard/partner");
    const activeNavItems = isPartner ? PARTNER_NAV_ITEMS : NAV_ITEMS;
    const [logout] = useLogoutMutation();
    const { data: profileData } = useGetProfileQuery();

    const profile = profileData?.partnerProfile || profileData?.investorProfile || {};
    const fullName = profile.fullName || profileData?.fullName || profileData?.name || "Guest";
    const role = profileData?.role ? (profileData.role.charAt(0) + profileData.role.slice(1).toLowerCase()) : (isPartner ? "Partner" : "Investor");

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("userType");
            localStorage.removeItem("isLoggedIn");
            removeCookie("isLoggedIn");
            removeCookie("access_token");
            router.push("/");
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>

                    <motion.div
                        className="fixed inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-sm z-50 lg:hidden"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />


                    <motion.div
                        className="fixed top-0 right-0 bottom-0 w-[280px] bg-[var(--color-bg-dark)] border-l border-[var(--color-border-subtle)] z-50 flex flex-col lg:hidden"
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
                            <div className="flex items-center gap-3">
                                <Avatar name={fullName} size="md" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-white">{fullName}</span>
                                    <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider">{role}</span>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface-subtle)] transition-colors bg-transparent border-0 cursor-pointer"
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
                                <span className="text-[10px] font-normal text-[var(--color-primary-200)] tracking-[0.15em] uppercase border border-[var(--color-primary-300)]/30 font-montserrat bg-[var(--color-primary-300)]/5 rounded-full px-3 py-1 inline-block">
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
                                                ? "bg-[var(--color-primary-100)]/10 text-[var(--color-primary-100)]"
                                                : "text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface-subtle)]"
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
                        <div className="px-4 pb-6 pt-3 border-t border-[var(--color-border-subtle)]">
                            <motion.div
                                custom={NAV_ITEMS.length}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer w-full border-0 bg-transparent"
                                >
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
