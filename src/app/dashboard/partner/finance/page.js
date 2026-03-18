"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUpIcon,
    FinancialIcon,
    PropertyIcon,
    CheckIcon
} from "@/components/VectorImages";

const TABS = ["Commissions", "Payouts", "AI Plans"];

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

    return (
        <div className="p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <h1 className="text-3xl font-semibold text-white font-montserrat tracking-tight">
                    Finance
                </h1>

                <div className="flex bg-[var(--color-bg-surface-subtle)] p-1 rounded-full border border-[var(--color-border-subtle)] self-start md:self-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-md text-xs font-semibold font-montserrat transition-all ${activeTab === tab
                                ? "bg-[var(--color-primary-300)]/5 text-[var(--color-primary-300)] shadow-sm"
                                : "text-[var(--color-text-muted)] hover:text-white"
                                }`}
                        >
                            {tab}
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
                        className="rounded-md p-6 bg-[var(--color-primary-300)]/10 hover:border-[var(--color-primary-300)]/10 transition-colors"
                        style={{ backgroundColor: stat.color }}
                    >
                        <p className="text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] font-montserrat mb-4">
                            {stat.label}
                        </p>
                        <p className="text-3xl font-semibold text-[var(--color-text-primary)] font-montserrat tracking-tight">
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
                    className="rounded-md bg-[var(--color-bg-surface-subtle)] p-5"
                >
                    {activeTab === "Commissions" && (
                        <div>
                            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] font-montserrat mb-6">Commission History</h2>
                            <div className="space-y-3">
                                {COMMISSIONS.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-[var(--color-bg-surface-subtle)] p-5 rounded-md flex items-center justify-between border border-[var(--color-border-subtle)] hover:border-[var(--color-primary-300)]/20 transition-colors group"
                                    >
                                        <div>
                                            <h3 className="text-sm font-semibold text-white font-montserrat group-hover:text-[var(--color-primary-300)] transition-colors">{item.name}</h3>
                                            <p className="text-xs text-[var(--color-text-muted)] font-montserrat mt-1">{item.detail}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[var(--color-status-success)]/70 font-montserrat">{item.amount}</p>
                                            <p className={`text-[10px] font-bold font-montserrat mt-1 uppercase tracking-tighter`} style={{ color: item.color + '99' }}>
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
                            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] font-montserrat mb-6">Payout History</h2>
                            <div className="space-y-3">
                                {PAYOUTS.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-[var(--color-bg-surface-subtle)] p-5 rounded-md flex items-center justify-between border border-[var(--color-border-subtle)] hover:border-[var(--color-primary-300)]/20 transition-colors group"
                                    >
                                        <div>
                                            <h3 className="text-sm font-semibold text-white font-montserrat group-hover:text-[var(--color-primary-300)] transition-colors">{item.name}</h3>
                                            <p className="text-xs text-[var(--color-text-muted)] font-montserrat mt-1">{item.detail}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[var(--color-primary-300)]/70 font-montserrat">{item.amount}</p>
                                            <p className={`text-[10px] font-bold font-montserrat mt-1 uppercase tracking-tighter`} style={{ color: item.color + '99' }}>
                                                {item.status}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "AI Plans" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {PLANS.map((plan, i) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.02, borderColor: 'var(--color-primary-300-alpha-30)', backgroundColor: 'var(--color-bg-surface-elevated)' }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`bg-[var(--color-bg-surface-subtle)] p-7 rounded-3xl border ${plan.popular ? 'border-[var(--color-primary-300)]/20' : 'border-[var(--color-border-subtle)]'} flex flex-col items-start relative overflow-hidden cursor-pointer transition-colors duration-300`}
                                >
                                    {plan.popular && (
                                        <div className="absolute top-4 right-4 bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)]/70 text-[9px] font-bold px-2.5 py-1 rounded-full border border-[var(--color-primary-300)]/20">
                                            POPULAR
                                        </div>
                                    )}
                                    <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] font-montserrat mb-2 uppercase tracking-wide">{plan.name}</h3>
                                    <p className="text-2xl font-bold text-white font-montserrat mb-8">{plan.price}</p>

                                    <ul className="space-y-4 mb-10 w-full">
                                        {plan.features.map((feature, fidx) => (
                                            <li key={fidx} className="flex items-center gap-3 text-[11px] text-[var(--color-text-secondary)] font-montserrat">
                                                <CheckIcon className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button className={`w-full py-3.5 rounded-2xl text-[11px] font-bold font-montserrat transition-all ${plan.popular
                                        ? 'bg-[var(--color-primary-300)]/70 text-black hover:bg-[var(--color-primary-100)] shadow-[var(--shadow-glow-primary)]'
                                        : 'bg-[var(--color-bg-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-elevated)] border border-transparent hover:border-[var(--color-border-subtle)]'
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
