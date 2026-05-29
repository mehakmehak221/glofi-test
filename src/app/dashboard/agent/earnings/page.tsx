"use client";

import { motion } from "framer-motion";
import { useGetAgentEarningsQuery, useGetAgentDashboardQuery, useGetAgentCommissionsQuery } from "@/store/api/agentApi";
import {
    FinancialIcon,
    CheckIcon,
    DollarIcon,
    TrendingUpIcon,
    InfoIcon,
    ClockIcon,
    AnalyticsIcon,
    LeadsIcon,
    VerifiedIcon
} from "@/components/VectorImages";

const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
};

export default function AgentEarningsPage() {
    const { data: earningsData, isLoading: earningsLoading } = useGetAgentEarningsQuery();
    const { data: dashboardData, isLoading: dashLoading } = useGetAgentDashboardQuery();
    const { data: commissionsData, isLoading: commissionsLoading } = useGetAgentCommissionsQuery();

    const isLoading = earningsLoading || dashLoading || commissionsLoading;

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen flex items-center justify-center">
                <div className="text-[var(--foreground)] opacity-50 font-montserrat animate-pulse">Loading earnings...</div>
            </div>
        );
    }

    const stats = [
        {
            label: "Total Earnings",
            value: formatCurrency(earningsData?.totalEarnings || 0),
            icon: DollarIcon,
            bgColor: "bg-green-500/10",
            iconColor: "text-green-500"
        },
        {
            label: "Completed",
            value: formatCurrency(earningsData?.completedEarnings || 0),
            icon: VerifiedIcon,
            bgColor: "bg-blue-500/10",
            iconColor: "text-blue-500"
        },
        {
            label: "Pending",
            value: formatCurrency(earningsData?.pendingEarnings || 0),
            icon: ClockIcon,
            bgColor: "bg-yellow-500/10",
            iconColor: "text-yellow-500"
        }
    ];

    const commissionRate = earningsData?.commissionRate?.effectivePercent || 1;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-[var(--foreground)] font-montserrat tracking-tight">
                    Earnings
                </h1>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.1 }}
                        className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl p-5 sm:p-6 flex flex-col justify-start hover:shadow-md transition-all relative overflow-hidden"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                            </div>
                            <span className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-60 font-montserrat uppercase tracking-[0.1em]">{stat.label}</span>
                        </div>
                        <span className="text-2xl font-bold text-[var(--foreground)] font-montserrat tracking-tight mt-1">{stat.value}</span>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-6">
                {/* Commission Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 }}
                    className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl p-6 sm:p-8"
                >
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat mb-6">Commission Breakdown</h2>
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <TrendingUpIcon className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-60 uppercase tracking-[0.1em] mb-1">Commission Rate</p>
                                    <p className="text-sm font-bold text-[var(--foreground)] opacity-90">{commissionRate}% per transaction</p>
                                </div>
                            </div>
                            <FinancialIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-10 flex-shrink-0" />
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <LeadsIcon className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-60 uppercase tracking-[0.1em] mb-1">Custom Commission</p>
                                    <p className="text-sm font-bold text-[var(--foreground)] opacity-90">Not Set</p>
                                </div>
                            </div>
                            <FinancialIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-10 flex-shrink-0" />
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <FinancialIcon className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-60 uppercase tracking-[0.1em] mb-1">Default / Early Agent Status</p>
                                    <p className="text-sm font-bold text-[var(--foreground)] opacity-90">{commissionRate}% · {earningsData?.commissionRate?.isEarlyAgent ? "Early Agent" : "Standard"}</p>
                                </div>
                            </div>
                            <TrendingUpIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-10 flex-shrink-0" />
                        </div>
                    </div>
                </motion.div>

                {/* Earnings History */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.4 }}
                    className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8"
                >
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat mb-8">Earnings History</h2>
                    <div className="space-y-8">
                        {commissionsData?.length ? (
                            commissionsData.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <div className="space-y-1.5">
                                        <p className="text-base font-bold text-[var(--foreground)] opacity-90">{item.assetName || "Commission"}</p>
                                        <p className="text-xs text-[var(--sidebar-text)] opacity-70 font-medium">
                                            {item.date} • {item.referredUser || "Referral"}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-lg font-bold text-[var(--color-primary-300)]">+{formatCurrency(item.commission)}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${item.status === 'Paid' ? 'text-green-500' : 'text-yellow-500'
                                            }`}>{item.status}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-[var(--sidebar-text)] opacity-60 font-montserrat italic">No earnings history found.</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}


