"use client";

import { motion } from "framer-motion";

const TRANSACTIONS = [
    {
        id: 1,
        date: "2025-12-15",
        type: "BUY",
        typeColor: "bg-[#00FFCD]/15 text-[#00FFCD] border-[#00FFCD]/20",
        asset: "Burj Vista Tower",
        amount: "$250,000",
        method: "Credit Card",
        status: "COMPLETED",
        statusColor: "bg-[#00FFCD]/10 text-[#00FFCD] border-[#00FFCD]/20",
    },
    {
        id: 2,
        date: "2025-12-20",
        type: "BUY",
        typeColor: "bg-[#00FFCD]/15 text-[#00FFCD] border-[#00FFCD]/20",
        asset: "Palm Jumeirah Villa Estate",
        amount: "$190,000",
        method: "Crypto (USDT)",
        status: "COMPLETED",
        statusColor: "bg-[#00FFCD]/10 text-[#00FFCD] border-[#00FFCD]/20",
    },
    {
        id: 3,
        date: "2026-01-05",
        type: "BUY",
        typeColor: "bg-[#00FFCD]/15 text-[#00FFCD] border-[#00FFCD]/20",
        asset: "Burj Vista Tower",
        amount: "$375,000",
        method: "E-Fiat Wallet (AED)",
        status: "COMPLETED",
        statusColor: "bg-[#00FFCD]/10 text-[#00FFCD] border-[#00FFCD]/20",
    },
    {
        id: 4,
        date: "2026-01-18",
        type: "BUY",
        typeColor: "bg-[#00FFCD]/15 text-[#00FFCD] border-[#00FFCD]/20",
        asset: "Marina Walk Residences",
        amount: "$300,000",
        method: "Bank Transfer",
        status: "COMPLETED",
        statusColor: "bg-[#00FFCD]/10 text-[#00FFCD] border-[#00FFCD]/20",
    },
    {
        id: 5,
        date: "2026-02-01",
        type: "PAYOUT",
        typeColor: "bg-purple-500/15 text-purple-400 border-purple-500/20",
        asset: "Burj Vista Tower",
        amount: "$15,625",
        method: "E-Fiat Wallet",
        status: "COMPLETED",
        statusColor: "bg-[#00FFCD]/10 text-[#00FFCD] border-[#00FFCD]/20",
    },
    {
        id: 6,
        date: "2026-02-10",
        type: "BUY",
        typeColor: "bg-[#00FFCD]/15 text-[#00FFCD] border-[#00FFCD]/20",
        asset: "DIFC Innovation Tower",
        amount: "$53,334",
        method: "Crypto (ETH)",
        status: "PENDING",
        statusColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
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
        <div className="p-4 sm:p-6 lg:p-8 bg-[#0A0F0D] min-h-screen">
           
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
                className="hidden md:block bg-[#0D1411] border border-white/[0.06] rounded-xl overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[#767676] font-semibold">Date</th>
                                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[#767676] font-semibold">Type</th>
                                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[#767676] font-semibold">Asset</th>
                                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[#767676] font-semibold">Amount</th>
                                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[#767676] font-semibold">Method</th>
                                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[#767676] font-semibold">Status</th>
                            </tr>
                        </thead>
                        <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                            {TRANSACTIONS.map((tx) => (
                                <motion.tr
                                    key={tx.id}
                                    variants={rowVariants}
                                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-5 py-4 text-sm text-[#a0a0a0]">{tx.date}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider  ${tx.typeColor}`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-white font-medium">{tx.asset}</td>
                                    <td className="px-5 py-4 text-sm text-white font-semibold">{tx.amount}</td>
                                    <td className="px-5 py-4 text-sm text-[#a0a0a0]">{tx.method}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider  ${tx.statusColor}`}>
                                            {tx.status === "COMPLETED" ? "✓" : "◎"} {tx.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </table>
                </div>
            </motion.div>

            {/* Mobile Cards */}
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
                        className="bg-[#111111] border border-white/[0.06] rounded-xl p-4"
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
                                <p className="text-[#767676]">Date</p>
                                <p className="text-white font-medium">{tx.date}</p>
                            </div>
                            <div>
                                <p className="text-[#767676]">Amount</p>
                                <p className="text-white font-medium">{tx.amount}</p>
                            </div>
                            <div>
                                <p className="text-[#767676]">Method</p>
                                <p className="text-white font-medium">{tx.method}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
