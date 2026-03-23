"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetPendingApprovalsQuery, useApproveInvestmentMutation, useRejectInvestmentMutation } from "@/store/api/investmentApi";
import { CheckIcon } from "@/components/VectorImages";

const TABS = ["Commissions", "Payouts", "Approvals", "AI Plans"];

const STATS = [
    { label: "TOTAL EARNED", value: "$126,450", color: "var(--color-primary-300-alpha-10)" },
    { label: "PENDING PAYOUT", value: "$18,200", color: "var(--color-bg-surface-subtle)" },
    { label: "THIS MONTH", value: "$28,750", color: "var(--color-primary-300-alpha-10)" },
];

const COMMISSIONS = [
    { name: "Burj Vista Tower", detail: "Sale · Feb 10", amount: "$12,500", status: "Paid", color: "var(--color-primary-300)" },
    { name: "Marina Walk", detail: "Referral · Feb 8", amount: "$3,200", status: "Paid", color: "var(--color-primary-300)" },
    { name: "Palm Villa", detail: "Sale · Feb 5", amount: "$8,750", status: "Pending", color: "var(--color-status-warning)" },
    { name: "DIFC Tower", detail: "Sale · Jan 28", amount: "$15,800", status: "Paid", color: "var(--color-primary-300)" },
];

const PAYOUTS = [
    { name: "Burj Vista Tower", detail: "Feb 10 · Bank Transfer", amount: "$125,000", status: "Completed", color: "var(--color-primary-300)" },
    { name: "Marina Walk", detail: "Feb 5 · Bank Transfer", amount: "$89,400", status: "Completed", color: "var(--color-primary-300)" },
    { name: "Palm Villa", detail: "Feb 28 · Bank Transfer", amount: "$67,200", status: "Scheduled", color: "var(--color-status-warning)" },
];

const PLANS = [
    {
        name: "Preemium",
        price: "Free",
        features: ["1 day access", "Up to 5 calls/user", "Max 50 free calls", "Basic analytics"],
        button: "Select",
        popular: false
    },
    {
        name: "Basic",
        price: "$10/mo",
        features: ["30-day access", "Up to 50 calls/user", "500 total calls", "Lead scoring", "Basic analytics"],
        button: "Select",
        popular: false
    },
    {
        name: "Pro",
        price: "$25/mo",
        features: ["30-day access", "Unlimited calls/user", "2000 total calls", "Advanced lead scoring", "Priority support", "Custom scripts"],
        button: "Select",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        features: ["Annual contract", "Unlimited calls", "Custom AI training", "Dedicated account manager", "API access", "White-label option"],
        button: "Contact",
        popular: false
    }
];

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState("Commissions");
    const { data: pendingData, isLoading: isLoadingPending } = useGetPendingApprovalsQuery(undefined, {
        skip: activeTab !== "Approvals"
    });
    const [approveInvestment] = useApproveInvestmentMutation();
    const [rejectInvestment] = useRejectInvestmentMutation();

    const handleApprove = async (id) => {
        if (!confirm("Approve this investment?")) return;
        try {
            await approveInvestment(id).unwrap();
            alert("Investment approved successfully");
        } catch (err) {
            console.error("Approval failed:", err);
            alert("Failed to approve investment");
        }
    };

    const handleReject = async (id) => {
        const reason = prompt("Enter reason for rejection:");
        if (!reason) return;
        try {
            await rejectInvestment({ id, reason }).unwrap();
            alert("Investment rejected");
        } catch (err) {
            console.error("Rejection failed:", err);
            alert("Failed to reject investment");
        }
    };

    return (
        <div className="p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <h1 className="text-2xl lg:text-3xl font-semibold text-[var(--foreground)] font-montserrat tracking-tight opacity-90">
                    Finance
                </h1>

                <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-[var(--sidebar-border)] self-start md:self-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-xl text-[12px] font-medium font-montserrat transition-all relative ${activeTab === tab
                                ? "text-[var(--sidebar-active-text)]"
                                : "text-[var(--sidebar-text)] opacity-40 hover:opacity-80"
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTabPill"
                                    className="absolute inset-0 bg-[var(--sidebar-active-bg)] rounded-xl shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab}</span>
                        </button>
                    ))}
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.1 }}
                        className="rounded-2xl p-6 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] hover:shadow-md transition-all relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[var(--sidebar-active-text)] opacity-[0.03] pointer-events-none" />
                        <p className="text-[10px] font-bold tracking-[1.2px] text-[var(--sidebar-text)] opacity-30 font-montserrat mb-4 uppercase">
                            {stat.label}
                        </p>
                        <p className="text-2xl font-semibold text-[var(--foreground)] opacity-90 font-montserrat tracking-tight">
                            {stat.value}
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
                    className="rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] p-5 border border-[var(--sidebar-border)]"
                >
                    {activeTab === "Commissions" && (
                        <div>
                            <h2 className="text-[13px] font-medium text-[var(--foreground)] opacity-70 font-montserrat mb-6">Commission History</h2>
                            <div className="space-y-2">
                                {COMMISSIONS.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-black/[0.02] dark:bg-white/[0.02] p-4 lg:p-5 rounded-2xl flex items-center justify-between hover:shadow-sm transition-all group"
                                    >
                                        <div>
                                            <h3 className="text-[14px] font-medium text-[var(--foreground)] opacity-70 font-montserrat group-hover:text-[var(--sidebar-active-text)] transition-colors">{item.name}</h3>
                                            <p className="text-[11px] text-[var(--sidebar-text)] opacity-30 font-montserrat mt-1">{item.detail}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[14px] font-semibold text-[var(--sidebar-active-text)] opacity-80 font-montserrat">{item.amount}</p>
                                            <p className={`text-[10px] font-medium font-montserrat mt-1 uppercase tracking-tighter opacity-50`} style={{ color: item.status === "Paid" ? 'var(--sidebar-active-text)' : 'var(--color-status-warning)' }}>
                                                {item.status}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "Payouts" && (
                        <div>
                            <h2 className="text-[13px] font-medium text-[var(--foreground)] opacity-70 font-montserrat mb-6">Payout History</h2>
                            <div className="space-y-2">
                                {PAYOUTS.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-black/[0.02] dark:bg-white/[0.02] p-4 lg:p-5 rounded-2xl flex items-center justify-between hover:shadow-sm transition-all group"
                                    >
                                        <div>
                                            <h3 className="text-[14px] font-medium text-[var(--foreground)] opacity-70 font-montserrat group-hover:text-[var(--sidebar-active-text)] transition-colors">{item.name}</h3>
                                            <p className="text-[11px] text-[var(--sidebar-text)] opacity-30 font-montserrat mt-1">{item.detail}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[14px] font-semibold text-[var(--sidebar-active-text)] opacity-80 font-montserrat">{item.amount}</p>
                                            <p className={`text-[10px] font-medium font-montserrat mt-1 uppercase tracking-tighter opacity-50`} style={{ color: item.status === "Completed" ? 'var(--sidebar-active-text)' : 'var(--color-status-warning)' }}>
                                                {item.status}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "Approvals" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-[13px] font-medium text-[var(--foreground)] opacity-70 font-montserrat">Pending Investment Approvals</h2>
                                {isLoadingPending && <div className="w-4 h-4 border-2 border-[var(--sidebar-active-text)]/20 border-t-[var(--sidebar-active-text)] rounded-full animate-spin" />}
                            </div>

                            {pendingData?.length === 0 ? (
                                <div className="py-12 text-center text-[var(--sidebar-text)] opacity-40 font-montserrat text-sm border border-dashed border-[var(--sidebar-border)] rounded-2xl">
                                    No pending approvals found.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingData?.map((item, i) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bg-black/[0.02] dark:bg-white/[0.02] p-5 rounded-2xl flex items-center justify-between group border border-transparent hover:border-[var(--sidebar-border)] transition-all"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-[14px] font-semibold text-[var(--foreground)] opacity-80 font-montserrat">{item.asset?.title || "Unknown Asset"}</h3>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] font-bold uppercase">{item.fractions} Frac</span>
                                                </div>
                                                <p className="text-[11px] text-[var(--sidebar-text)] opacity-40 font-montserrat flex items-center gap-2">
                                                    Investor: <span className="text-[var(--foreground)] opacity-60 font-medium">{item.user?.fullName || item.user?.email || "Anonymous"}</span>
                                                    • {new Date(item.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 text-right">
                                                <div>
                                                    <p className="text-[14px] font-bold text-[var(--foreground)] opacity-90 font-montserrat">${item.amount?.toLocaleString()}</p>
                                                    <p className="text-[10px] text-[var(--sidebar-text)] opacity-30 font-montserrat uppercase tracking-wider">{item.paymentMethod}</p>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <button
                                                        onClick={() => handleApprove(item.id)}
                                                        className="w-8 h-8 rounded-full bg-[var(--color-status-success)]/10 text-[var(--color-status-success)] flex items-center justify-center hover:bg-[var(--color-status-success)] hover:text-white transition-all shadow-sm"
                                                        title="Approve"
                                                    >
                                                        <CheckIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(item.id)}
                                                        className="w-8 h-8 rounded-full bg-[var(--color-status-error)]/10 text-[var(--color-status-error)] flex items-center justify-center hover:bg-[var(--color-status-error)] hover:text-white transition-all shadow-sm"
                                                        title="Reject"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "AI Plans" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {PLANS.map((plan, i) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`bg-[var(--sidebar-bg)] p-7 rounded-3xl border ${plan.popular ? 'border-[var(--sidebar-active-text)]/30' : 'border-[var(--sidebar-border)]'} flex flex-col items-start relative overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300`}
                                >
                                    {plan.popular && (
                                        <div className="absolute top-4 right-4 bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] text-[9px] font-bold px-2.5 py-1 rounded-full border border-[var(--sidebar-active-text)]/10">
                                            POPULAR
                                        </div>
                                    )}
                                    <h3 className="text-xs font-semibold text-[var(--sidebar-text)] opacity-50 font-montserrat mb-2 uppercase tracking-widest">{plan.name}</h3>
                                    <p className="text-2xl font-bold text-[var(--foreground)] opacity-90 font-montserrat mb-8">{plan.price}</p>

                                    <ul className="space-y-4 mb-10 w-full">
                                        {plan.features.map((feature, fidx) => (
                                            <li key={fidx} className="flex items-center gap-3 text-[11px] text-[var(--foreground)] opacity-60 font-montserrat">
                                                <CheckIcon className="w-3.5 h-3.5 text-[var(--sidebar-active-text)]" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button className={`w-full py-3.5 rounded-2xl text-[11px] font-bold font-montserrat transition-all ${plan.popular
                                        ? 'bg-[var(--sidebar-active-text)] text-white hover:opacity-90 shadow-md'
                                        : 'bg-black/5 dark:bg-white/5 text-[var(--foreground)] opacity-70 hover:opacity-100 border border-[var(--sidebar-border)]'
                                        }`}>
                                        {plan.button}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
