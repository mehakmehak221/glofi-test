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
    { label: "TOTAL EARNED", value: "$126,450", color: "#00DAAF1A" },
    { label: "PENDING PAYOUT", value: "$18,200", color: "#FFFFFF05" },
    { label: "THIS MONTH", value: "$28,750", color: "#00DAAF0A" },
];

const COMMISSIONS = [
    { name: "Burj Vista Tower", detail: "Sale · Feb 10", amount: "$12,500", status: "Paid", color: "#00DAAF" },
    { name: "Marina Walk", detail: "Referral · Feb 8", amount: "$3,200", status: "Paid", color: "#00DAAF" },
    { name: "Palm Villa", detail: "Sale · Feb 5", amount: "$8,750", status: "Pending", color: "#FE9A00" },
    { name: "DIFC Tower", detail: "Sale · Jan 28", amount: "$15,800", status: "Paid", color: "#00DAAF" },
];

const PAYOUTS = [
    { name: "Burj Vista Tower", detail: "Feb 10 · Bank Transfer", amount: "$125,000", status: "Completed", color: "#00DAAF" },
    { name: "Marina Walk", detail: "Feb 5 · Bank Transfer", amount: "$89,400", status: "Completed", color: "#00DAAF" },
    { name: "Palm Villa", detail: "Feb 28 · Bank Transfer", amount: "$67,200", status: "Scheduled", color: "#FE9A00" },
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

                <div className="flex bg-[#111] p-1 rounded-full border border-white/5 self-start md:self-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-md text-xs font-semibold font-montserrat transition-all ${activeTab === tab
                                ? "bg-from-[#00DAAF0F] to-[#00DAAF1A] text-[#00DAAF] shadow-sm"
                                : "text-[#767676] hover:text-white"
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
                        className="rounded-md p-6 bg-from-[#00DAAF0F] to-[#007E5F0F] hover:border-[#00DAAF1A] transition-colors"
                        style={{ backgroundColor: stat.color }}
                    >
                        <p className="text-[10px] font-bold tracking-widest text-[#FFFFFF33] font-montserrat mb-4">
                            {stat.label}
                        </p>
                        <p className="text-3xl font-semibold text-[#FFFFFFD9] font-montserrat tracking-tight">
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
                    className="rounded-md bg-[#FFFFFF05] p-5"
                >
                    {activeTab === "Commissions" && (
                        <div>
                            <h2 className="text-sm font-semibold text-[#FFFFFF99] font-montserrat mb-6">Commission History</h2>
                            <div className="space-y-3">
                                {COMMISSIONS.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-[#FFFFFF05] p-5 rounded-md flex items-center justify-between border border-white/5 hover:border-[#00DAAF33] transition-colors group"
                                    >
                                        <div>
                                            <h3 className="text-sm font-semibold text-white font-montserrat group-hover:text-[#00DAAF] transition-colors">{item.name}</h3>
                                            <p className="text-xs text-[#767676] font-montserrat mt-1">{item.detail}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[#00DAAFB2] font-montserrat">{item.amount}</p>
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
                            <h2 className="text-sm font-semibold text-[#FFFFFF99] font-montserrat mb-6">Payout History</h2>
                            <div className="space-y-3">
                                {PAYOUTS.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-[#FFFFFF05] p-5 rounded-md flex items-center justify-between border border-white/5 hover:border-[#00DAAF33] transition-colors group"
                                    >
                                        <div>
                                            <h3 className="text-sm font-semibold text-white font-montserrat group-hover:text-[#00DAAF] transition-colors">{item.name}</h3>
                                            <p className="text-xs text-[#767676] font-montserrat mt-1">{item.detail}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[#00DAAFB2] font-montserrat">{item.amount}</p>
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
                                    whileHover={{ scale: 1.02, borderColor: '#00DAAF66', backgroundColor: '#FFFFFF0D' }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`bg-[#FFFFFF08] p-7 rounded-3xl border ${plan.popular ? 'border-[#00DAAF33]' : 'border-[#FFFFFF08]'} flex flex-col items-start relative overflow-hidden cursor-pointer transition-colors duration-300`}
                                >
                                    {plan.popular && (
                                        <div className="absolute top-4 right-4 bg-[#00DAAF1A] text-[#00DAAFB2] text-[9px] font-bold px-2.5 py-1 rounded-full border border-[#00DAAF33]">
                                            POPULAR
                                        </div>
                                    )}
                                    <h3 className="text-sm font-semibold text-[#FFFFFFB2] font-montserrat mb-2 uppercase tracking-wide">{plan.name}</h3>
                                    <p className="text-2xl font-bold text-white font-montserrat mb-8">{plan.price}</p>

                                    <ul className="space-y-4 mb-10 w-full">
                                        {plan.features.map((feature, fidx) => (
                                            <li key={fidx} className="flex items-center gap-3 text-[11px] text-[#FFFFFFB2] font-montserrat">
                                                <CheckIcon className="w-3.5 h-3.5 text-[#FFFFFF4D]" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button className={`w-full py-3.5 rounded-2xl text-[11px] font-bold font-montserrat transition-all ${plan.popular
                                        ? 'bg-[#00DAAFB2] text-black hover:bg-[#00FFCD] shadow-[0_0_20px_#00DAAF1A]'
                                        : 'bg-[#FFFFFF08] text-[#FFFFFFB2] hover:bg-[#FFFFFF0D] border border-transparent hover:border-[#FFFFFF1A]'
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
