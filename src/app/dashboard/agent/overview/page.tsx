"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import {
    RibbonIcon,
    CheckIcon,
    CalendarIcon,
    TrendingUpIcon,
    DollarIcon,
    PeopleIcon,
    InfoIcon,
    CopyIcon,
    LocationIcon,
    CloseIcon,
    PendingIcon,
} from "@/components/VectorImages";
import { useGetAgentDashboardQuery, useGetAgentMeQuery } from "@/store/api/agentApi";
import { useGetAssetsQuery } from "@/store/api/assetApi";
import { useI18n } from "@/providers/LocaleProvider";

const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
};

const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export default function AgentOverviewPage() {
    const [copied, setCopied] = useState(false);
    const { data: dashboardData, isLoading: dashLoading } = useGetAgentDashboardQuery();
    const { data: agentData, isLoading: agentLoading } = useGetAgentMeQuery();
    const { data: assetsData, isLoading: assetsLoading } = useGetAssetsQuery({ limit: 3 });
    const { t } = useI18n();

    const handleCopy = () => {
        if (dashboardData?.referralCode) {
            navigator.clipboard.writeText(dashboardData.referralCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const isLoading = dashLoading || agentLoading || assetsLoading;

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen flex items-center justify-center">
                <div className="text-[var(--foreground)] opacity-50 font-montserrat animate-pulse">{t("Loading dashboard...")}</div>
            </div>
        );
    }

    const referralCode = dashboardData?.referralCode || "---";

    const STAT_CARDS = [
        {
            label: t("Total Sales"),
            value: formatCurrency(dashboardData?.totalSales || 0),
            delta: "+12.5%",
            icon: TrendingUpIcon,
            iconColor: "text-blue-500",
        },
        {
            label: t("Total Earnings"),
            value: formatCurrency(dashboardData?.totalEarnings || 0),
            delta: "+8.3%",
            icon: DollarIcon,
            iconColor: "text-[#00DAAF]",
        },
        {
            label: t("Referrals"),
            value: dashboardData?.referralsCount?.toString() || "0",
            delta: "+3 this month",
            icon: PeopleIcon,
            iconColor: "text-purple-500",
        },
        {
            label: t("Commission Rate"),
            value: `${dashboardData?.commissionRate || 0}%`,
            delta: t("First 100 Agent"),
            icon: RibbonIcon,
            iconColor: "text-[var(--foreground)] opacity-20",
        },
    ];

    const getStatusBadge = (type: string, status: string | undefined, defaultStatus: string) => {
        const s = (status || defaultStatus).toUpperCase();
        let colorClass = "text-[var(--color-primary-300)]";
        let Icon = CheckIcon;

        if (s === "REJECTED" || s === "INACTIVE" || s === "SUSPENDED" || s === "EXPIRED") {
            colorClass = "text-red-500";
            Icon = CloseIcon;
        } else if (s === "PENDING" || s === "UNDER_REVIEW") {
            colorClass = "text-yellow-500";
            Icon = PendingIcon;
        }

        return (
            <div className={`flex items-center gap-2 text-[11px] font-bold ${colorClass} uppercase tracking-wider`}>
                <Icon className="w-3.5 h-3.5" />
                {type}: {s}
            </div>
        );
    };

    const kycStatus = agentData?.kyc?.status || dashboardData?.kycStatus || "PENDING";
    const reraStatus = (agentData?.status?.isActive === false || agentData?.userStatus?.isActive === false)
        ? "INACTIVE"
        : agentData?.status?.isReraExpired
            ? "EXPIRED"
            : dashboardData?.reraStatus
                ? dashboardData.reraStatus
                : agentData?.status?.isVerified
                    ? "ACTIVE"
                    : "PENDING";

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-[var(--foreground)] font-montserrat tracking-tight">
                    {t("Overview")}
                </h1>
            </motion.div>

            {/* Banner */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-6 mb-8 relative overflow-hidden"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-12 h-12 rounded-md bg-[var(--color-primary-300)]/10 flex items-center justify-center flex-shrink-0">
                        <RibbonIcon className="w-6 h-6 text-[var(--color-primary-300)]" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-[var(--foreground)] font-montserrat mb-1">{t("First 100 Agent")}</h2>
                        <p className="text-sm text-[var(--sidebar-text)] font-montserrat opacity-80">
                            {t("You're earning higher commission rates as one of our first 100 verified agents!")}
                        </p>
                        <div className="flex flex-wrap items-center gap-6 mt-4">
                            {getStatusBadge("KYC", kycStatus, "PENDING")}
                            {getStatusBadge("RERA", reraStatus, "PENDING")}
                            <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--sidebar-text)] opacity-60 uppercase tracking-wider">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                {t("Expires")}: {agentData?.profile?.expiryDate ? formatDate(agentData.profile.expiryDate) : dashboardData?.expiryDate || "2027-12-31"}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {STAT_CARDS.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.2 + i * 0.05 }}
                        className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-6"
                    >
                        <stat.icon className={`w-5 h-5 ${stat.iconColor} mb-5`} />
                        <p className="text-3xl font-bold text-[var(--foreground)] font-montserrat mb-0.5 leading-none">{stat.value}</p>
                        <p className="text-[11px] font-medium text-[var(--sidebar-text)] font-montserrat opacity-60 mb-3 mt-1">{stat.label}</p>
                        <p className="text-[10px] font-bold text-[var(--color-primary-300)] uppercase tracking-wider">
                            {stat.delta}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Referral Code */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.4 }}
                    className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8"
                >
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat mb-8">{t("Your Referral Code")}</h2>
                    <div className="flex flex-col items-center justify-between gap-6 p-1 bg-[var(--background)] rounded-md border border-[var(--sidebar-border)] pr-4">
                        <div className="px-6 py-4 w-full">
                            <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-60 uppercase tracking-[0.15em] mb-1.5">{t("Referral Code")}</p>
                            <p className="text-2xl font-bold text-[var(--color-primary-300)] font-montserrat tracking-wider">{referralCode}</p>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="w-full h-12 px-8 rounded-md bg-[var(--color-primary-300)]/5 border border-[var(--color-primary-300)]/20 text-[var(--color-primary-300)] font-bold text-xs font-montserrat hover:bg-[var(--color-primary-300)]/10 transition-all flex items-center justify-center gap-3"
                        >
                            <CopyIcon className="w-4 h-4" />
                            {copied ? t("COPIED") : t("COPY CODE")}
                        </button>
                    </div>
                    <div className="flex items-start gap-3 mt-8 text-[var(--sidebar-text)] opacity-60">
                        <InfoIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--color-primary-300)]" />
                        <p className="text-xs leading-relaxed font-montserrat">
                            {t("Investors using your code earn you 1% commission on their purchases.")}
                        </p>
                    </div>
                </motion.div>

                {/* Available Assets (Marketplace Integration) */}
                <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.5 }}
                    className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat">{t("Live Assets")}</h2>
                        <span className="text-[10px] font-bold text-[var(--color-primary-300)] uppercase tracking-widest opacity-70">{t("Marketplace")}</span>
                    </div>
                    <div className="space-y-4">
                        {assetsData?.data?.slice(0, 3).map((asset: any) => (
                            <div
                                key={asset.id}
                                className="flex gap-4 p-3 rounded-lg border border-[var(--sidebar-border)]/60 bg-[var(--background)]/35 cursor-default"
                            >
                                <div className="w-16 h-16 rounded-md overflow-hidden bg-[var(--background)] flex-shrink-0 relative">
                                    <Image
                                        src={asset.images?.[0] || "/placeholder-asset.jpg"}
                                        alt={asset.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[var(--foreground)] leading-snug">{asset.title}</p>
                                    <div className="flex items-center gap-1 text-[10px] text-[var(--sidebar-text)] opacity-60 mt-1 uppercase font-bold tracking-tight">
                                        <LocationIcon className="w-3 h-3" />
                                        {asset.location}{asset.city ? `, ${asset.city}` : ""}
                                    </div>
                                    <p className="text-xs font-bold text-[var(--color-primary-300)] mt-2 font-montserrat">
                                        {formatCurrency(Number(asset.fractionPrice))} {t("/ Fraction")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Transactions */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.6 }}
                className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8"
            >
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat">{t("Recent Referral Transactions")}</h2>
                    <button className="text-[11px] font-bold text-[var(--sidebar-text)] opacity-60 hover:opacity-100 hover:text-[var(--foreground)] transition-all uppercase tracking-widest font-montserrat">{t("View All")}</button>
                </div>
                <div className="space-y-10">
                    {dashboardData?.recentTransactions?.length ? (
                        dashboardData.recentTransactions.map((tx, i) => (
                            <div key={i} className="flex justify-between items-center group">
                                <div className="space-y-1.5">
                                    <p className="text-base font-bold text-[var(--foreground)] font-montserrat">{tx.assetName}</p>
                                    <p className="text-xs text-[var(--sidebar-text)] opacity-70 font-medium font-montserrat">
                                        {t("Referred")}: {tx.referredUser} • {tx.date}
                                    </p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-lg font-bold text-[var(--color-primary-300)] font-montserrat">+{formatCurrency(tx.commission)}</p>
                                    <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-50 uppercase tracking-widest">{tx.status}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-[var(--sidebar-text)] opacity-60 font-montserrat italic">{t("No recent transactions found.")}</div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
