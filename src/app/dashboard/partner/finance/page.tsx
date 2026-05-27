"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetPartnerFinanceQuery, useGetCommissionHistoryQuery, useGetPayoutHistoryQuery } from "@/store/api/partnerApi";
import { CheckIcon } from "@/components/VectorImages";

const TABS = ["Commissions", "Payouts"];

const STATS = [
    { label: "TOTAL EARNED", value: "₹1.2 L", color: "var(--color-primary-300-alpha-10)" },
    { label: "PENDING PAYOUT", value: "₹18,200", color: "var(--color-bg-surface-subtle)" },
    { label: "THIS MONTH", value: "₹28,750", color: "var(--color-primary-300-alpha-10)" },
];

const COMMISSIONS = [
    { name: "Burj Vista Tower", detail: "Sale · Feb 10", amount: "₹12,500", status: "Paid", color: "var(--color-primary-300)" },
    { name: "Marina Walk", detail: "Referral · Feb 8", amount: "₹3,200", status: "Paid", color: "var(--color-primary-300)" },
    { name: "Palm Villa", detail: "Sale · Feb 5", amount: "₹8,750", status: "Pending", color: "var(--color-status-warning)" },
    { name: "DIFC Tower", detail: "Sale · Jan 28", amount: "₹15,800", status: "Paid", color: "var(--color-primary-300)" },
];

const PAYOUTS = [
    { name: "Burj Vista Tower", detail: "Feb 10 · Bank Transfer", amount: "₹1.2 L", status: "Completed", color: "var(--color-primary-300)" },
    { name: "Marina Walk", detail: "Feb 5 · Bank Transfer", amount: "₹89,400", status: "Completed", color: "var(--color-primary-300)" },
    { name: "Palm Villa", detail: "Feb 28 · Bank Transfer", amount: "₹67,200", status: "Scheduled", color: "var(--color-status-warning)" },
];



const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
};

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState("Commissions");

    const { data: partnerFinance } = useGetPartnerFinanceQuery();
    const { data: commissionHistory, isLoading: isLoadingCommissions } = useGetCommissionHistoryQuery(undefined, {
        skip: activeTab !== "Commissions"
    });
    const { data: payoutHistory, isLoading: isLoadingPayouts } = useGetPayoutHistoryQuery(undefined, {
        skip: activeTab !== "Payouts"
    });


    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <h1 className="text-2xl lg:text-3xl font-semibold text-[var(--foreground)] font-montserrat tracking-tight opacity-90">
                    Finance
                </h1>

                <div className="flex overflow-x-auto whitespace-nowrap w-full md:w-auto bg-black/5 dark:bg-white/5 p-1 rounded-md border border-[var(--sidebar-border)] self-start md:self-auto custom-scrollbar-hide">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-shrink-0 px-4 sm:px-6 py-2 rounded-md text-[11px] sm:text-[12px] font-medium font-montserrat transition-all relative ${activeTab === tab
                                ? "text-[var(--sidebar-active-text)]"
                                : "text-[var(--sidebar-text)] opacity-60 hover:opacity-90"
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTabPill"
                                    className="absolute inset-0 bg-[var(--sidebar-active-bg)] rounded-md shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab}</span>
                        </button>
                    ))}
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                {[
                    { label: "TOTAL EARNED", value: partnerFinance?.totalEarned || 0 },
                    { label: "PENDING PAYOUT", value: partnerFinance?.pendingPayout || 0 },
                    { label: "THIS MONTH", value: partnerFinance?.thisMonth || 0 },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.1 }}
                        className="rounded-md p-6 bg-[var(--card-surface)] border border-[var(--sidebar-border)] hover:shadow-md transition-all relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[var(--sidebar-active-text)] opacity-[0.03] pointer-events-none" />
                        <p className="text-[10px] font-bold tracking-[1.2px] text-[var(--sidebar-text)] opacity-60 font-montserrat mb-4 uppercase">
                            {stat.label}
                        </p>
                        <p className="text-2xl font-semibold text-[var(--foreground)] opacity-90 font-montserrat tracking-tight">
                            {formatCurrency(stat.value || 0)}
                        </p>
                    </motion.div>
                ))}
            </div>


            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-md bg-[var(--card-surface)] p-5 border border-[var(--sidebar-border)]"
                >
                    {activeTab === "Commissions" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-[13px] font-medium text-[var(--foreground)] opacity-90 font-montserrat">Commission History</h2>
                                {isLoadingCommissions && <div className="w-4 h-4 border-2 border-[var(--sidebar-active-text)]/20 border-t-[var(--sidebar-active-text)] rounded-full animate-spin" />}
                            </div>

                            {!commissionHistory?.data?.length ? (
                                <div className="py-12 text-center text-[var(--sidebar-text)] opacity-60 font-montserrat text-sm border border-dashed border-[var(--sidebar-border)] rounded-md">
                                    No commissions found.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {commissionHistory.data.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bg-black/[0.02] dark:bg-white/[0.02] p-4 lg:p-5 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-all group"
                                        >
                                            <div>
                                                <h3 className="text-[14px] font-medium text-[var(--foreground)] opacity-90 font-montserrat group-hover:text-[var(--sidebar-active-text)] transition-colors">{item.asset?.title || "Commission Payment"}</h3>
                                                <p className="text-[11px] text-[var(--sidebar-text)] opacity-70 font-montserrat mt-1">
                                                    {item.type || 'Sale'} · {(item.date || item.createdAt) ? new Date(item.date || item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "-"}
                                                </p>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="text-[14px] font-semibold text-[var(--sidebar-active-text)] font-montserrat">{formatCurrency(item.amount || 0)}</p>
                                                <p className={`text-[10px] font-medium font-montserrat mt-0.5 sm:mt-1 uppercase tracking-tighter opacity-80`} style={{ color: item.status === "Paid" ? 'var(--sidebar-active-text)' : 'var(--color-status-warning)' }}>
                                                    {item.status}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Payouts" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-[13px] font-medium text-[var(--foreground)] opacity-90 font-montserrat">Payout History</h2>
                                {isLoadingPayouts && <div className="w-4 h-4 border-2 border-[var(--sidebar-active-text)]/20 border-t-[var(--sidebar-active-text)] rounded-full animate-spin" />}
                            </div>

                            {!payoutHistory?.data?.length ? (
                                <div className="py-12 text-center text-[var(--sidebar-text)] opacity-60 font-montserrat text-sm border border-dashed border-[var(--sidebar-border)] rounded-md">
                                    No payouts found.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {payoutHistory.data.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bg-black/[0.02] dark:bg-white/[0.02] p-4 lg:p-5 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-all group"
                                        >
                                            <div>
                                                <h3 className="text-[14px] font-medium text-[var(--foreground)] opacity-90 font-montserrat group-hover:text-[var(--sidebar-active-text)] transition-colors">{item.method || "Bank Transfer"}</h3>
                                                <p className="text-[11px] text-[var(--sidebar-text)] opacity-70 font-montserrat mt-1">
                                                    {(item.payoutDate || item.createdAt) ? new Date(item.payoutDate || item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "-"} · {item.reference || "Completed"}
                                                </p>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="text-[14px] font-semibold text-[var(--sidebar-active-text)] font-montserrat">{formatCurrency(item.amount || 0)}</p>
                                                <p className={`text-[10px] font-medium font-montserrat mt-0.5 sm:mt-1 uppercase tracking-tighter opacity-80`} style={{ color: item.status === "Completed" ? 'var(--sidebar-active-text)' : 'var(--color-status-warning)' }}>
                                                    {item.status}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}




                </motion.div>
            </AnimatePresence>
        </div>
    );
}
