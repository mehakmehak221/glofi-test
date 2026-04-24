"use client";

import { motion } from "framer-motion";
import { useGetAgentEarningsQuery, useGetAgentDashboardQuery, useGetAgentCommissionsQuery } from "@/store/api/agentApi";
import { 
    FinancialIcon, 
    CheckIcon, 
    DollarIcon, 
    TrendingUpIcon, 
    InfoIcon 
} from "@/components/VectorImages";

const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
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
            bgColor: "bg-[var(--color-primary-300)]/10", 
            iconColor: "text-[var(--color-primary-300)]" 
        },
        { 
            label: "Completed", 
            value: formatCurrency(earningsData?.completedEarnings || 0), 
            icon: CheckIcon, 
            bgColor: "bg-blue-500/10", 
            iconColor: "text-blue-500" 
        },
        { 
            label: "Pending", 
            value: formatCurrency(earningsData?.pendingEarnings || 0), 
            icon: InfoIcon, 
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
                        className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-6 flex flex-col gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                            <span className="text-xs font-bold text-[var(--sidebar-text)] opacity-40 font-montserrat uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <span className="text-3xl font-bold text-[var(--foreground)] font-montserrat">{stat.value}</span>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 }}
                    className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8"
                >
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat mb-8">Commission Breakdown</h2>
                    <div className="space-y-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-30 uppercase tracking-[0.15em] mb-1.5">Commission Rate</p>
                                <p className="text-base font-bold text-[var(--foreground)]/90">{commissionRate}% per transaction</p>
                            </div>
                            <FinancialIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-10" />
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-30 uppercase tracking-[0.15em] mb-1.5">Platform Fee Split</p>
                                <p className="text-base font-bold text-[var(--foreground)]/90">Agent Commission</p>
                            </div>
                            <FinancialIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-10" />
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-30 uppercase tracking-[0.15em] mb-1.5">Early Agent Status</p>
                                <p className="text-base font-bold text-[var(--foreground)]/90">{earningsData?.commissionRate?.isEarlyAgent ? "Active (Higher Rates)" : "Standard"}</p>
                            </div>
                            <TrendingUpIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-10" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.4 }}
                    className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8"
                >
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat mb-8">Recent Earnings History</h2>
                    <div className="space-y-8">
                        {commissionsData?.length ? (
                            commissionsData.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <div className="space-y-1.5">
                                        <p className="text-base font-bold text-[var(--foreground)]/90">{item.assetName || "Commission"}</p>
                                        <p className="text-xs text-[var(--sidebar-text)] opacity-40 font-medium">
                                            {item.date} • {item.referredUser || "Referral"}
                                        </p>
                                        {item.amount && <p className="text-[10px] text-[var(--sidebar-text)] opacity-20 uppercase font-bold tracking-tight">Transaction: ${item.amount}</p>}
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-lg font-bold text-[var(--color-primary-300)]">+{formatCurrency(item.commission)}</p>
                                        <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-30 uppercase">{item.status}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-[var(--sidebar-text)] opacity-30 font-montserrat italic">No earnings history found.</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
