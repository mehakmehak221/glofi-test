"use client";

import { motion } from "framer-motion";

const TRANSACTIONS = [
    {
        id: 1,
        date: "2025-12-15",
        type: "BUY",
        typeColor: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success-border)]",
        asset: "Burj Vista Tower",
        amount: "$250,000",
        method: "Credit Card",
        status: "COMPLETED",
        statusColor: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success-border)]",
    },
    {
        id: 2,
        date: "2025-12-20",
        type: "BUY",
        typeColor: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success-border)]",
        asset: "Palm Jumeirah Villa Estate",
        amount: "$190,000",
        method: "Crypto (USDT)",
        status: "COMPLETED",
        statusColor: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success-border)]",
    },
    {
        id: 3,
        date: "2026-01-05",
        type: "BUY",
        typeColor: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success-border)]",
        asset: "Burj Vista Tower",
        amount: "$375,000",
        method: "E-Fiat Wallet (AED)",
        status: "COMPLETED",
        statusColor: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success-border)]",
    },
    {
        id: 4,
        date: "2026-01-18",
        type: "BUY",
        typeColor: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success-border)]",
        asset: "Marina Walk Residences",
        amount: "$300,000",
        method: "Bank Transfer",
        status: "COMPLETED",
        statusColor: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success-border)]",
    },
    {
        id: 5,
        date: "2026-02-01",
        type: "PAYOUT",
        typeColor: "bg-[var(--color-status-info-bg)] text-[var(--color-status-info)] border-[var(--color-status-info-border)]",
        asset: "Burj Vista Tower",
        amount: "$15,625",
        method: "E-Fiat Wallet",
        status: "COMPLETED",
        statusColor: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success-border)]",
    },
    {
        id: 6,
        date: "2026-02-10",
        type: "BUY",
        typeColor: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success-border)]",
        asset: "DIFC Innovation Tower",
        amount: "$53,334",
        method: "Crypto (ETH)",
        status: "PENDING",
        statusColor: "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)] border-[var(--color-status-warning-border)]",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function TransactionsPage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[var(--color-bg-dark)] min-h-screen">
           
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold text-white mb-6"
            >
                Transactions
            </motion.h1>

          
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="hidden md:block bg-[var(--color-bg-dark-alt)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--color-border-subtle)]">
                                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Date</th>
                                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Type</th>
                                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Asset</th>
                                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Amount</th>
                                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Method</th>
                                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Status</th>
                            </tr>
                        </thead>
                        <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                            {TRANSACTIONS.map((tx) => (
                                <motion.tr
                                    key={tx.id}
                                    variants={rowVariants}
                                    className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-surface-subtle)] transition-colors"
                                >
                                    <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">{tx.date}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border  ${tx.typeColor}`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-white font-medium">{tx.asset}</td>
                                    <td className="px-5 py-4 text-sm text-white font-semibold">{tx.amount}</td>
                                    <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">{tx.method}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border  ${tx.statusColor}`}>
                                            {tx.status === "COMPLETED" ? "✓" : "◎"} {tx.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </table>
                </div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="md:hidden flex flex-col gap-3"
            >
                {TRANSACTIONS.map((tx) => (
                    <motion.div
                        key={tx.id}
                        variants={rowVariants}
                        className="bg-[var(--color-bg-dark-alt)] border border-[var(--color-border-subtle)] rounded-xl p-4"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${tx.typeColor}`}>
                                {tx.type}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${tx.statusColor}`}>
                                {tx.status === "COMPLETED" ? "✓" : "◎"} {tx.status}
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-2">{tx.asset}</h3>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                                <p className="text-[var(--color-text-muted)]">Date</p>
                                <p className="text-white font-medium">{tx.date}</p>
                            </div>
                            <div>
                                <p className="text-[var(--color-text-muted)]">Amount</p>
                                <p className="text-white font-medium">{tx.amount}</p>
                            </div>
                            <div>
                                <p className="text-[var(--color-text-muted)]">Method</p>
                                <p className="text-white font-medium">{tx.method}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
