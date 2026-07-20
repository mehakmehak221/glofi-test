"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    useGetAgentEarningsQuery, 
    useGetAgentDashboardQuery, 
    useGetAgentCommissionsQuery,
    useGetAgentCommissionSummaryQuery,
    useRequestCommissionWithdrawalMutation
} from "@/store/api/agentApi";
import {
    FinancialIcon,
    DollarIcon,
    ClockIcon,
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
    const { data: summaryData, isLoading: summaryLoading, refetch: refetchSummary } = useGetAgentCommissionSummaryQuery();
    const [requestWithdrawal, { isLoading: isWithdrawing }] = useRequestCommissionWithdrawalMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
    const [withdrawError, setWithdrawError] = useState<string | null>(null);

    const isLoading = earningsLoading || dashLoading || commissionsLoading || summaryLoading;

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen flex items-center justify-center">
                <div className="text-[var(--foreground)] opacity-50 font-montserrat animate-pulse">Loading earnings and commissions...</div>
            </div>
        );
    }

    const summary = summaryData || {
        Pending: 0,
        Approved: 0,
        Locked: 0,
        Withdrawable: 0,
        Paid: 0
    };

    const stats = [
        {
            label: "Pending",
            value: formatCurrency(summary.Pending),
            icon: ClockIcon,
            bgColor: "bg-amber-500/10 border-amber-500/30",
            iconColor: "text-amber-500",
            badgeStyle: "bg-amber-500/20 text-amber-500"
        },
        {
            label: "Approved",
            value: formatCurrency(summary.Approved),
            icon: VerifiedIcon,
            bgColor: "bg-blue-500/10 border-blue-500/30",
            iconColor: "text-blue-500",
            badgeStyle: "bg-blue-500/20 text-blue-500"
        },
        {
            label: "Locked",
            value: formatCurrency(summary.Locked),
            icon: FinancialIcon,
            bgColor: "bg-purple-500/10 border-purple-500/30",
            iconColor: "text-purple-500",
            badgeStyle: "bg-purple-500/20 text-purple-500"
        },
        {
            label: "Withdrawable",
            value: formatCurrency(summary.Withdrawable),
            icon: DollarIcon,
            bgColor: "bg-emerald-500/10 border-emerald-500/30",
            iconColor: "text-emerald-500",
            badgeStyle: "bg-emerald-500/20 text-emerald-500"
        },
        {
            label: "Paid",
            value: formatCurrency(summary.Paid),
            icon: DollarIcon,
            bgColor: "bg-green-700/10 border-green-700/30",
            iconColor: "text-green-600",
            badgeStyle: "bg-green-700/20 text-green-600"
        }
    ];

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
            case "APPROVED":
                return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
            case "LOCKED":
                return "bg-purple-500/10 text-purple-500 border border-purple-500/20";
            case "WITHDRAWABLE":
                return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
            case "PAID":
                return "bg-green-600/10 text-green-500 border border-green-600/20";
            case "CANCELLED":
                return "bg-red-500/10 text-red-500 border border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border border-gray-500/20";
        }
    };

    const handleWithdrawSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setWithdrawSuccess(null);
        setWithdrawError(null);

        const amountNum = parseFloat(withdrawAmount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setWithdrawError("Please enter a valid amount.");
            return;
        }

        if (amountNum > summary.Withdrawable) {
            setWithdrawError("Withdrawal request exceeds your withdrawable balance.");
            return;
        }

        try {
            await requestWithdrawal({ amount: amountNum }).unwrap();
            setWithdrawSuccess("Withdrawal request submitted successfully!");
            setWithdrawAmount("");
            refetchSummary();
            setTimeout(() => {
                setIsModalOpen(false);
                setWithdrawSuccess(null);
            }, 2000);
        } catch (err: any) {
            setWithdrawError(err?.data?.message || "Failed to submit withdrawal request.");
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-[var(--foreground)] font-montserrat tracking-tight">
                        Commissions & Earnings
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1 font-medium">
                        Track and withdraw your agent rewards.
                    </p>
                </div>
            </motion.div>

            {/* Action Banner for Withdrawable Balance */}
            {summary.Withdrawable > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm"
                >
                    <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                            <DollarIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[var(--foreground)] font-montserrat">Payout Available!</h3>
                            <p className="text-sm text-[var(--color-text-muted)] mt-0.5 font-medium">
                                You have <span className="text-emerald-500 font-bold">{formatCurrency(summary.Withdrawable)}</span> ready for withdrawal.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-emerald-500/20 cursor-pointer border-0 shrink-0"
                    >
                        Withdraw to Bank
                    </button>
                </motion.div>
            )}

            {/* 5 Summary Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.05 }}
                        className={`bg-[var(--card-surface)] border ${stat.bgColor} rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden group min-h-[130px]`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${stat.badgeStyle}`}>
                                {stat.label}
                            </span>
                            <div className="opacity-60 group-hover:scale-110 transition-transform">
                                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                            </div>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)] font-montserrat tracking-tight">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Commissions History Table */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 }}
                className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-2xl overflow-hidden shadow-sm"
            >
                <div className="p-6 border-b border-[var(--sidebar-border)]">
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat">Commissions History</h2>
                </div>
                <div className="overflow-x-auto">
                    {commissionsData && commissionsData.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--sidebar-border)] bg-[var(--field-surface)]/50">
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Date</th>
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Investment / Asset</th>
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Type</th>
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Amount</th>
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--sidebar-border)]">
                                {commissionsData.map((item) => (
                                    <tr key={item.id} className="hover:bg-[var(--field-surface)]/30 transition-colors">
                                        <td className="p-4 text-xs font-mono text-[var(--foreground)]">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-bold text-[var(--foreground)]">
                                                {item.investment?.asset?.title || "Direct Referrals"}
                                            </div>
                                            {item.investmentId && (
                                                <div className="text-[10px] text-[var(--color-text-muted)] font-mono mt-0.5">
                                                    ID: {item.investmentId}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] bg-[var(--field-surface)] px-2 py-0.5 rounded border border-[var(--sidebar-border)]">
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs font-bold text-[var(--foreground)]">
                                            {formatCurrency(parseFloat(item.amount))}
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusBadgeClass(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-sm text-[var(--color-text-muted)] italic font-montserrat">
                            No commissions found.
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Withdrawal Request Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative z-10 p-6 sm:p-8"
                        >
                            <h3 className="text-lg font-bold text-[var(--foreground)] font-montserrat mb-2">
                                Request Withdrawal
                            </h3>
                            <p className="text-xs text-[var(--color-text-muted)] mb-6 font-medium">
                                Funds will be sent directly to your verified primary bank account.
                            </p>

                            <form onSubmit={handleWithdrawSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-bold">
                                        Amount to Withdraw
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)] font-bold text-sm">
                                            ₹
                                        </div>
                                        <input
                                            type="number"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full rounded-xl pl-8 pr-4 py-3 text-sm font-medium text-[var(--foreground)] bg-[var(--field-surface)] border border-[var(--sidebar-border)] focus:outline-none focus:border-[var(--color-primary-300)]"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-medium mt-1">
                                        <span>Withdrawable Balance: {formatCurrency(summary.Withdrawable)}</span>
                                    </div>
                                </div>

                                {withdrawError && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                                        {withdrawError}
                                    </div>
                                )}

                                {withdrawSuccess && (
                                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
                                        {withdrawSuccess}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 border border-[var(--sidebar-border)] hover:bg-[var(--field-surface)] text-[var(--foreground)] font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer bg-transparent"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isWithdrawing}
                                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 shadow-md"
                                    >
                                        {isWithdrawing ? "Submitting..." : "Submit Payout"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
