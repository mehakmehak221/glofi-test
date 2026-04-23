"use client";

import { motion } from "framer-motion";
import { FinancialIcon, CheckIcon, DollarIcon, TrendingUpIcon, InfoIcon } from "@/components/VectorImages";

const EARNINGS_HISTORY = [
    { 
        asset: "Burj Vista Tower", 
        date: "2026-01-20", 
        user: "Ahmed Al Rashid", 
        detail: "Transaction: $250K • Platform Fee: $13K • Rate: 1%", 
        amount: "+$3K", 
        status: "Completed" 
    },
    { 
        asset: "Palm Jumeirah Villa Estate", 
        date: "2026-02-05", 
        user: "Sarah Chen", 
        detail: "Transaction: $190K • Platform Fee: $10K • Rate: 1%", 
        amount: "+$2K", 
        status: "Completed" 
    },
];

export default function AgentEarningsPage() {
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
                {[
                    { label: "Total Earnings", value: "$13K", icon: DollarIcon, bgColor: "bg-[var(--color-primary-300)]/10", iconColor: "text-[var(--color-primary-300)]" },
                    { label: "Completed", value: "$4K", icon: CheckIcon, bgColor: "bg-blue-500/10", iconColor: "text-blue-500" },
                    { label: "Pending", value: "$0", icon: InfoIcon, bgColor: "bg-yellow-500/10", iconColor: "text-yellow-500" }
                ].map((stat, i) => (
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
                                <p className="text-base font-bold text-[var(--foreground)]/90">1% per transaction</p>
                            </div>
                            <FinancialIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-10" />
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-30 uppercase tracking-[0.15em] mb-1.5">Platform Fee Split</p>
                                <p className="text-base font-bold text-[var(--foreground)]/90">50% of platform fee</p>
                            </div>
                            <FinancialIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-10" />
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-30 uppercase tracking-[0.15em] mb-1.5">Total Platform Fee</p>
                                <p className="text-base font-bold text-[var(--foreground)]/90">5% (3% seller + 2% buyer)</p>
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
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat mb-8">Earnings History</h2>
                    <div className="space-y-8">
                        {EARNINGS_HISTORY.map((item, i) => (
                            <div key={i} className="flex justify-between items-center group">
                                <div className="space-y-1.5">
                                    <p className="text-base font-bold text-[var(--foreground)]/90">{item.asset}</p>
                                    <p className="text-xs text-[var(--sidebar-text)] opacity-40 font-medium">
                                        {item.date} • {item.user}
                                    </p>
                                    <p className="text-[10px] text-[var(--sidebar-text)] opacity-20 uppercase font-bold tracking-tight">{item.detail}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-lg font-bold text-[var(--color-primary-300)]">{item.amount}</p>
                                    <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-30 uppercase">{item.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
