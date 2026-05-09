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
                {/* Commission Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 }}
                    className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8"
                >
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat mb-8">Commission Breakdown</h2>
                    <div className="space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <TrendingUpIcon className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-30 uppercase tracking-[0.15em] mb-1.5">Commission Rate</p>
                                    <p className="text-base font-bold text-[var(--foreground)]/90">{commissionRate}% per transaction</p>
                                </div>
                            </div>
                            <FinancialIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-10" />
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <LeadsIcon className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-30 uppercase tracking-[0.15em] mb-1.5">Custom Commission</p>
                                    <p className="text-base font-bold text-[var(--foreground)]/90">Not Set</p>
                                </div>
                            </div>
                            <FinancialIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-10" />
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                    <FinancialIcon className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-30 uppercase tracking-[0.15em] mb-1.5">Default / Early Agent Status</p>
                                    <p className="text-base font-bold text-[var(--foreground)]/90">{commissionRate}% · {earningsData?.commissionRate?.isEarlyAgent ? "Early Agent" : "Standard"}</p>
                                </div>
                            </div>
                            <TrendingUpIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-10" />
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
                                        <p className="text-base font-bold text-[var(--foreground)]/90">{item.assetName || "Commission"}</p>
                                        <p className="text-xs text-[var(--sidebar-text)] opacity-40 font-medium">
                                            {item.date} • {item.referredUser || "Referral"}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-lg font-bold text-[var(--color-primary-300)]">+{formatCurrency(item.commission)}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${
                                            item.status === 'Paid' ? 'text-green-500' : 'text-yellow-500'
                                        }`}>{item.status}</p>
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


