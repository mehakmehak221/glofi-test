"use client";

import { motion } from "framer-motion";
import { useGetAgentTransactionsQuery } from "@/store/api/agentApi";
import { CheckIcon, PendingIcon, LoadingSpinner, AnalyticsIcon, ChartLineIcon, DocumentIcon } from "@/components/VectorImages";

const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
};

export default function AgentTransactionsPage() {
    const { data: txData, isLoading } = useGetAgentTransactionsQuery();
    const transactions = txData?.data || [];

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen flex items-center justify-center">
                <div className="text-[var(--foreground)] opacity-50 font-montserrat animate-pulse flex items-center gap-3">
                    <LoadingSpinner />
                    Loading transactions...
                </div>
            </div>
        );
    }

    const stats = [
        { label: "Total Volume", value: "INR 0", icon: DocumentIcon, color: "text-[var(--color-primary-300)]", bg: "bg-[var(--color-primary-300)]/10" },
        { label: "Commission", value: "INR 0", icon: ChartLineIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Completed", value: "0 / 0", icon: CheckIcon, color: "text-green-500", bg: "bg-green-500/10" },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-[var(--foreground)] font-montserrat tracking-tight">
                    Transactions
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
                            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <span className="text-xs font-bold text-[var(--sidebar-text)] opacity-40 font-montserrat uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <span className="text-3xl font-bold text-[var(--foreground)] font-montserrat">{stat.value}</span>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 }}
                className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md overflow-hidden"
            >
                <div className="p-8 border-b border-[var(--sidebar-border)]">
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat">All Referral Transactions</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-montserrat border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-[11px] uppercase tracking-[0.15em] text-[var(--sidebar-text)] opacity-40 border-b border-[var(--sidebar-border)]">
                                <th className="px-8 py-6 font-bold">Date</th>
                                <th className="px-8 py-6 font-bold">User</th>
                                <th className="px-8 py-6 font-bold">Asset</th>
                                <th className="px-8 py-6 font-bold text-right">Amount</th>
                                <th className="px-8 py-6 font-bold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--sidebar-border)]/20">
                            {transactions.length > 0 ? (
                                transactions.map((tx, i) => (
                                    <tr key={i} className="hover:bg-[var(--color-primary-300)]/[0.02] transition-colors group">
                                        <td className="px-8 py-6 text-sm text-[var(--sidebar-text)] opacity-60">{tx.date}</td>
                                        <td className="px-8 py-6 text-sm font-bold text-[var(--foreground)]/90">{tx.referredUser}</td>
                                        <td className="px-8 py-6 text-sm text-[var(--sidebar-text)] opacity-60">{tx.assetName}</td>
                                        <td className="px-8 py-6 text-sm text-right font-bold text-[var(--foreground)] opacity-80">{formatCurrency(tx.amount)}</td>
                                        <td className="px-8 py-6 text-center">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                tx.status === "Completed" || tx.status === "SUCCESS"
                                                    ? "bg-[var(--color-primary-300)]/10 border border-[var(--color-primary-300)]/20 text-[var(--color-primary-300)]"
                                                    : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500"
                                            }`}>
                                                {tx.status === "Completed" || tx.status === "SUCCESS" ? (
                                                    <CheckIcon className="w-3 h-3" />
                                                ) : (
                                                    <PendingIcon className="w-3 h-3" />
                                                )}
                                                {tx.status}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-sm text-[var(--sidebar-text)] opacity-30 font-montserrat italic">No transactions available yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}


