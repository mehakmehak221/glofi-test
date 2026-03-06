"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = ["Profile", "KYC", "Wallet", "Certificates", "Referrals"];

const PROFILE_FIELDS = [
    { label: "Full Name", value: "Ishan", type: "text" },
    { label: "Email", value: "demo@glofi.estate", type: "email" },
    { label: "Phone", value: "+971 50 123 4567", type: "tel" },
    { label: "Country", value: "United Arab Emirates", type: "text" },
];

const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState("Profile");

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Page Title */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold text-white mb-6"
            >
                Account
            </motion.h1>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-2 mb-8"
            >
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer border ${activeTab === tab
                                ? "bg-[#00FFCD] text-black border-[#00FFCD] shadow-[0_0_15px_rgba(0,255,205,0.3)]"
                                : "bg-transparent text-[#a0a0a0] border-white/10 hover:border-white/30 hover:text-white"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {activeTab === "Profile" && (
                        <div className="max-w-2xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                {PROFILE_FIELDS.map((field) => (
                                    <div key={field.label} className="flex flex-col gap-1.5">
                                        <label className="text-[10px] uppercase tracking-wider text-[#767676] font-semibold">
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            defaultValue={field.value}
                                            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-[#4c4c4c] bg-[#111111] border border-white/[0.06] transition-all duration-200 focus:outline-none focus:ring-2 focus:border-[#00FFCD]/60 focus:ring-[#00FFCD]/20"
                                        />
                                    </div>
                                ))}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00FFCD] to-[#009976] text-black font-semibold text-sm cursor-pointer border-0 transition-shadow hover:shadow-[0_0_20px_rgba(0,255,205,0.3)]"
                            >
                                Save Changes
                            </motion.button>
                        </div>
                    )}

                    {activeTab === "KYC" && (
                        <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-6 max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 text-lg">⚠</div>
                                <div>
                                    <h3 className="text-white font-semibold">KYC Verification</h3>
                                    <p className="text-xs text-[#767676]">Complete your identity verification to unlock all features</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] rounded-lg border border-white/[0.04]">
                                    <span className="text-sm text-[#a0a0a0]">Identity Document</span>
                                    <span className="text-xs text-yellow-400 font-medium">PENDING</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] rounded-lg border border-white/[0.04]">
                                    <span className="text-sm text-[#a0a0a0]">Address Proof</span>
                                    <span className="text-xs text-[#767676] font-medium">NOT STARTED</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] rounded-lg border border-white/[0.04]">
                                    <span className="text-sm text-[#a0a0a0]">Selfie Verification</span>
                                    <span className="text-xs text-[#767676] font-medium">NOT STARTED</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Wallet" && (
                        <div className="max-w-2xl space-y-4">
                            <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-6">
                                <h3 className="text-white font-semibold mb-1">E-Fiat Wallet</h3>
                                <p className="text-3xl font-bold text-[#00FFCD] mb-4">$12,450.00</p>
                                <div className="flex gap-3">
                                    <button className="px-5 py-2.5 rounded-lg bg-[#00FFCD]/10 text-[#00FFCD] text-sm font-medium border border-[#00FFCD]/20 cursor-pointer hover:bg-[#00FFCD]/20 transition-colors">
                                        Deposit
                                    </button>
                                    <button className="px-5 py-2.5 rounded-lg text-[#a0a0a0] text-sm font-medium border border-white/10 cursor-pointer hover:text-white hover:border-white/30 transition-colors bg-transparent">
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                            <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-6">
                                <h3 className="text-white font-semibold mb-1">Crypto Wallet</h3>
                                <p className="text-xs text-[#767676] mb-3">Connected wallets</p>
                                <div className="px-4 py-3 bg-[#0a0a0a] rounded-lg border border-white/[0.04] flex items-center justify-between">
                                    <span className="text-sm text-white">0x7a3f...9b2e</span>
                                    <span className="text-xs text-[#00FFCD] font-medium">CONNECTED</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Certificates" && (
                        <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-6 max-w-2xl">
                            <h3 className="text-white font-semibold mb-4">Ownership Certificates</h3>
                            <div className="space-y-3">
                                {["Burj Vista Tower", "Palm Jumeirah Villa Estate", "Marina Walk Residences"].map((name) => (
                                    <div key={name} className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] rounded-lg border border-white/[0.04]">
                                        <span className="text-sm text-white">{name}</span>
                                        <button className="text-xs text-[#00FFCD] font-medium hover:text-[#00FFCD]/80 transition-colors cursor-pointer bg-transparent border-0">
                                            ↓ Download PDF
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "Referrals" && (
                        <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-6 max-w-2xl">
                            <h3 className="text-white font-semibold mb-2">Referral Program</h3>
                            <p className="text-sm text-[#767676] mb-4">Invite friends and earn rewards on their investments</p>
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    readOnly
                                    value="https://glofi.estate/ref/ISHAN2024"
                                    className="flex-1 rounded-lg px-4 py-2.5 text-sm text-white bg-[#0a0a0a] border border-white/[0.06] focus:outline-none"
                                />
                                <button className="px-4 py-2.5 rounded-lg bg-[#00FFCD]/10 text-[#00FFCD] text-sm font-medium border border-[#00FFCD]/20 cursor-pointer hover:bg-[#00FFCD]/20 transition-colors whitespace-nowrap">
                                    Copy Link
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#0a0a0a] rounded-lg p-4 border border-white/[0.04]">
                                    <p className="text-xs text-[#767676] mb-1">Total Referrals</p>
                                    <p className="text-xl font-bold text-white">12</p>
                                </div>
                                <div className="bg-[#0a0a0a] rounded-lg p-4 border border-white/[0.04]">
                                    <p className="text-xs text-[#767676] mb-1">Earnings</p>
                                    <p className="text-xl font-bold text-[#00FFCD]">$2,340</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
