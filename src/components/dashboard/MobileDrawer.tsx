"use client";

import { usePathname, useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/store/api/authApi";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Avatar from "@/components/ui/Avatar";
import { useLogoutMutation } from "@/store/api/authApi";
import { removeCookie } from "@/utils/cookieUtils";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/providers/LocaleProvider";
import {
    CloseIcon,
    MarketplaceIcon,
    PortfolioIcon,
    TransactionsIcon,
    AccountIcon,
    SignOutIcon,
    OverviewIcon,
    PropertyIcon,
    LeadsIcon,
    DollarIcon,
    ProfileIcon,
    SecondaryMarketplaceIcon,
    FinancialIcon,
    SupportIcon,
} from "@/components/VectorImages";

const NAV_ITEMS = [
    { href: "/dashboard/investor/marketplace", icon: MarketplaceIcon, label: "Marketplace" },
    { href: "/dashboard/investor/secondary-marketplace", icon: SecondaryMarketplaceIcon, label: "Secondary Marketplace" },
    { href: "/dashboard/investor/portfolio", icon: PortfolioIcon, label: "Portfolio" },
    { href: "/dashboard/investor/transactions", icon: TransactionsIcon, label: "Transactions" },
    { href: "/dashboard/investor/rewards", icon: DollarIcon, label: "Rewards" },
    { href: "/dashboard/investor/account", icon: AccountIcon, label: "Account" },
    { href: "/dashboard/investor/support", icon: SupportIcon, label: "Support" },
];

const PARTNER_NAV_ITEMS = [
    { href: "/dashboard/partner/overview", icon: OverviewIcon, label: "Overview" },
    { href: "/dashboard/partner/properties", icon: PropertyIcon, label: "Properties" },
    // { href: "/dashboard/partner/leads", icon: LeadsIcon, label: "Leads & AI" },

    { href: "/dashboard/partner/finance", icon: FinancialIcon, label: "Finance" },
    { href: "/dashboard/partner/account", icon: AccountIcon, label: "Account" },
    { href: "/dashboard/partner/support", icon: SupportIcon, label: "Support" },
];

const AGENT_NAV_ITEMS = [
    { href: "/dashboard/agent/overview", icon: OverviewIcon, label: "Overview" },
    { href: "/dashboard/agent/leads", icon: LeadsIcon, label: "Leads & CRM" },
    { href: "/dashboard/agent/followups", icon: FinancialIcon, label: "Follow-ups" },
    { href: "/dashboard/agent/referrals", icon: PropertyIcon, label: "Asset Sharing" },
    { href: "/dashboard/agent/transactions", icon: AccountIcon, label: "Transactions" },
    { href: "/dashboard/agent/earnings", icon: DollarIcon, label: "Earnings" },
    { href: "/dashboard/agent/profile", icon: ProfileIcon, label: "Profile" },
];

const drawerVariants: Variants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const itemVariants: Variants = {
    hidden: { x: 40, opacity: 0 },
    visible: (i: number) => ({
        x: 0,
        opacity: 1,
        transition: { delay: i * 0.06, type: "spring", stiffness: 300, damping: 25 },
    }),
};

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
    const pathname = usePathname();
    const router = useRouter();
    const isPartner = pathname.startsWith("/dashboard/partner");
    const isAgent = pathname.startsWith("/dashboard/agent");
    const activeNavItems = isPartner ? PARTNER_NAV_ITEMS : isAgent ? AGENT_NAV_ITEMS : NAV_ITEMS;
    const [logout] = useLogoutMutation();
    const { data: profileData } = useGetProfileQuery();
    const { t } = useI18n();

    const profile = profileData?.agentProfile || profileData?.partnerProfile || profileData?.investorProfile || {};
    const fullName = profileData?.fullName || profile.fullName || profileData?.name || profile.name || "Guest";
    const avatarUrl = profileData?.avatarUrl || profile.avatarUrl || "";
    const role = profileData?.role ? (profileData.role.charAt(0) + profileData.role.slice(1).toLowerCase()) : (isPartner ? "Developer" : isAgent ? "Agent" : "Investor");

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
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>

                    <motion.div
                        className="fixed inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-sm z-50 md:hidden"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />


                    <motion.div
                        className="fixed top-0 right-0 bottom-0 w-[280px] bg-[var(--sidebar-bg)] border-l border-[var(--sidebar-border)] z-50 flex flex-col shadow-2xl sm:w-[320px] md:w-[380px] md:hidden"
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--sidebar-border)] sm:px-6 sm:py-5">
                            <div className="flex items-center gap-3">
                                <Avatar src={avatarUrl} name={fullName} size="md" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-[var(--header-text)]">{fullName}</span>
                                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">{t(role)}</span>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:bg-[var(--sidebar-active-bg)] transition-colors bg-transparent border-0 cursor-pointer"
                                aria-label="Close menu"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Nav Items */}
                        <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-5 flex flex-col gap-1 sm:px-5 sm:py-6">
                            <motion.div
                                className="px-4 pt-5 pb-2 overflow-hidden"

                            >
                                <span className="text-[10px] font-medium text-[var(--panel-chip-text)] tracking-[0.15em] uppercase border border-[var(--panel-chip-border)] font-montserrat bg-[var(--panel-chip-bg)] rounded-full px-3 py-1 inline-block">
                                    {isPartner ? t("Developer Panel") : isAgent ? t("Agent Panel") : t("Investor Panel")}
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
                                                ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]"
                                                : "text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:bg-[var(--sidebar-active-bg)]"
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="text-sm font-medium">{t(item.label)}</span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </nav>

                        {/* Footer */}
                        <div className="px-4 pb-6 pt-3 border-t border-[var(--color-border-subtle)] sm:px-5 flex flex-col gap-3">
                            <div className="px-4 flex justify-start">
                                <LanguageSwitcher variant="dashboard" />
                            </div>
                            <motion.div
                                custom={NAV_ITEMS.length}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-status-error)] hover:bg-[var(--color-status-error-bg)] transition-colors cursor-pointer w-full border-0 bg-transparent"
                                >
                                    <SignOutIcon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{t("Sign Out")}</span>
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
