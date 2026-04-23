"use client";

import { motion } from "framer-motion";
import { CheckIcon } from "@/components/VectorImages";

const TRANSACTIONS = [
    { date: "2026-01-20", user: "Ahmed Al Rashid", asset: "Burj Vista Tower", amount: "$250K", commission: "$3K", status: "Completed" },
    { date: "2026-02-05", user: "Sarah Chen", asset: "Palm Jumeirah Villa Estate", amount: "$190K", commission: "$2K", status: "Completed" },
];

export default function AgentTransactionsPage() {
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

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md overflow-hidden"
            >
                <div className="p-8 border-b border-[var(--sidebar-border)]">
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat">All Referral Transactions</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-montserrat border-collapse">
                        <thead>
                            <tr className="text-[11px] uppercase tracking-[0.15em] text-[var(--sidebar-text)] opacity-40 border-b border-[var(--sidebar-border)]">
                                <th className="px-8 py-6 font-bold">Date</th>
                                <th className="px-8 py-6 font-bold">User</th>
                                <th className="px-8 py-6 font-bold">Asset</th>
                                <th className="px-8 py-6 font-bold text-right">Amount</th>
                                <th className="px-8 py-6 font-bold text-right">Commission</th>
                                <th className="px-8 py-6 font-bold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--sidebar-border)]/20">
                            {TRANSACTIONS.map((tx, i) => (
                                <tr key={i} className="hover:bg-[var(--color-primary-300)]/[0.02] transition-colors group">
                                    <td className="px-8 py-6 text-sm text-[var(--sidebar-text)] opacity-60">{tx.date}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-[var(--foreground)]/90">{tx.user}</td>
                                    <td className="px-8 py-6 text-sm text-[var(--sidebar-text)] opacity-60">{tx.asset}</td>
                                    <td className="px-8 py-6 text-sm text-right font-medium text-[var(--foreground)] opacity-80">{tx.amount}</td>
                                    <td className="px-8 py-6 text-sm text-right font-bold text-[var(--color-primary-300)]">{tx.commission}</td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-primary-300)]/10 border border-[var(--color-primary-300)]/20 text-[var(--color-primary-300)] text-[10px] font-bold uppercase tracking-wider">
                                            <CheckIcon className="w-3 h-3" />
                                            {tx.status}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
               
                <div className="h-64"></div>
            </motion.div>
        </div>
    );
}
