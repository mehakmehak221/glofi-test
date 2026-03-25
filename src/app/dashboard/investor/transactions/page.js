"use client";

import { motion } from "framer-motion";
import { useGetTransactionsQuery } from "@/store/api/investmentApi";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

function getTypeColor(type) {
    if (!type) return "bg-[var(--color-status-info-bg)] text-[var(--color-status-info)] border-[var(--color-status-info-border)]";
    const t = type.toUpperCase();
    if (t === "BUY" || t === "PURCHASE") return "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success-border)]";
    if (t === "SELL" || t === "RESALE") return "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)] border-[var(--color-status-warning-border)]";
    return "bg-[var(--color-status-info-bg)] text-[var(--color-status-info)] border-[var(--color-status-info-border)]";
}

function getStatusColor(status) {
    if (!status) return "";
    const s = status.toUpperCase();
    if (s === "COMPLETED" || s === "SUCCESS") return "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success-border)]";
    if (s === "PENDING") return "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)] border-[var(--color-status-warning-border)]";
    if (s === "FAILED") return "bg-[var(--color-status-error-bg)] text-[var(--color-status-error)] border-[var(--color-status-error-border)]";
    return "bg-[var(--color-status-info-bg)] text-[var(--color-status-info)] border-[var(--color-status-info-border)]";
}

function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatAmount(amount, currency) {
    if (amount === undefined || amount === null) return "-";
    return `$${parseFloat(amount).toLocaleString()} ${currency || ""}`.trim();
}

export default function TransactionsPage() {
    const { data, isLoading, isError } = useGetTransactionsQuery();

    const transactions = Array.isArray(data) ? data : (data?.data || data?.transactions || []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)]">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold text-[var(--header-text)] mb-6"
            >
                Transactions
            </motion.h1>

            {isLoading && (
                <div className="flex justify-center p-16">
                    <div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin" />
                </div>
            )}

            {isError && (
                <div className="bg-[var(--color-status-error-bg)] border border-[var(--color-status-error-border)] text-[var(--color-status-error)] rounded-xl p-4 text-sm">
                    Failed to load transactions.
                </div>
            )}

            {!isLoading && !isError && transactions.length === 0 && (
                <div className="bg-[var(--background)] border border-[var(--sidebar-border)] rounded-xl p-12 text-center text-[var(--color-text-muted)] text-sm">
                    No transactions found.
                </div>
            )}

            {!isLoading && !isError && transactions.length > 0 && (
                <>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="hidden md:block bg-[var(--background)] border border-[var(--sidebar-border)] rounded-md overflow-hidden shadow-sm"
                    >
                        <div className="overflow-x-auto w-full pb-4">
                            <table className="w-full whitespace-nowrap min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-[var(--sidebar-border)] bg-[var(--background)]/50">
                                        <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Date</th>
                                        <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Type</th>
                                        <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Asset</th>
                                        <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Amount</th>
                                        <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Method</th>
                                        <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                                    {transactions.map((tx, idx) => (
                                        <motion.tr
                                            key={tx.id || idx}
                                            variants={rowVariants}
                                            className="border-b border-[var(--sidebar-border)] hover:bg-[var(--sidebar-active-bg)] transition-colors"
                                        >
                                            <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">{formatDate(tx.createdAt || tx.date)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getTypeColor(tx.type)}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[var(--header-text)] font-medium">
                                                {tx.asset?.title || tx.assetTitle || tx.asset || "-"}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[var(--header-text)] font-semibold">
                                                {formatAmount(tx.amount, tx.currency)}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">
                                                {tx.paymentMethod || tx.method || "-"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(tx.status)}`}>
                                                    {tx.status?.toUpperCase() === "COMPLETED" ? "✓" : "◎"} {tx.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </motion.tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Mobile cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="md:hidden flex flex-col gap-3"
                    >
                        {transactions.map((tx, idx) => (
                            <motion.div
                                key={tx.id || idx}
                                variants={rowVariants}
                                className="bg-[var(--background)] border border-[var(--sidebar-border)] rounded-xl p-4 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getTypeColor(tx.type)}`}>
                                        {tx.type}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(tx.status)}`}>
                                        {tx.status?.toUpperCase() === "COMPLETED" ? "✓" : "◎"} {tx.status}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-[var(--header-text)] mb-4">
                                    {tx.asset?.title || tx.assetTitle || tx.asset || "-"}
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-xs bg-[var(--sidebar-active-bg)]/30 rounded-lg p-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Date</p>
                                        <p className="text-[var(--header-text)] font-bold">{formatDate(tx.createdAt || tx.date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Amount</p>
                                        <p className="text-[var(--header-text)] font-bold">{formatAmount(tx.amount, tx.currency)}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Method</p>
                                        <p className="text-[var(--header-text)] font-bold">{tx.paymentMethod || tx.method || "-"}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </>
            )}
        </div>
    );
}
