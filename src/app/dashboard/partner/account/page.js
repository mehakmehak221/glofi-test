"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProfileQuery } from "@/store/api/authApi";

const TABS = ["Profile", "KYB", "Wallet", "Settings"];

const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function PartnerAccountPage() {
    const [activeTab, setActiveTab] = useState("Profile");
    const { data: profileData, isLoading } = useGetProfileQuery();

    const PROFILE_FIELDS = useMemo(() => {
        if (!profileData) return [
            { label: "Full Name", value: "Loading...", type: "text" },
            { label: "Email", value: "Loading...", type: "email" },
            { label: "Phone", value: "Loading...", type: "tel" },
            { label: "Country", value: "Loading...", type: "text" },
        ];

        const profile = profileData.partnerProfile || profileData.investorProfile || {};

        return [
            { label: "Full Name", value: profile.fullName || profileData.fullName || profileData.name || "", type: "text" },
            { label: "Email", value: profileData.email || "", type: "email" },
            { label: "Phone", value: profileData.phoneNumber || profileData.phone || profile.phone || "", type: "tel" },
            { label: "Country", value: profile.country || profile.nationality || profileData.country || profileData.nationality || "", type: "text" },
        ];
    }, [profileData]);

    return (
        <div className="p-3 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)]">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--header-text)] mb-4 sm:mb-6"
            >
                Account Settings
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-2 sm:gap-2.5 mb-5 sm:mb-8"
            >
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-md text-[11px] sm:text-[13px] font-medium transition-all duration-300 cursor-pointer border ${activeTab === tab
                            ? "bg-[var(--color-primary-300)] text-black border-[var(--color-primary-300)] shadow-glow-primary"
                            : "bg-[var(--card-surface)] text-[var(--color-text-muted)] border-[var(--sidebar-border)] hover:border-[var(--sidebar-active-text)]/30 hover:text-[var(--header-text)]"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {activeTab === "Profile" && (
                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-md p-4 sm:p-6 lg:p-8 max-w-[800px] shadow-sm">
                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-300)]"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6 mb-6 sm:mb-8">
                                        {PROFILE_FIELDS.map((field) => (
                                            <div key={field.label} className="flex flex-col gap-1.5">
                                                <label className="text-[9px] sm:text-[10px] uppercase tracking-[1.5px] text-[var(--color-text-muted)] font-semibold">
                                                    {field.label}
                                                </label>
                                                <input
                                                    type={field.type}
                                                    defaultValue={field.value}
                                                    key={field.value}
                                                    className="w-full rounded-md px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-[var(--header-text)] bg-[var(--field-surface)] border border-[var(--sidebar-border)] transition-all hover:border-[var(--sidebar-active-text)]/30 focus:outline-none focus:border-[var(--sidebar-active-text)]/50"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-md bg-[var(--color-primary-300)] text-black font-semibold text-[11px] sm:text-[13px] tracking-wide cursor-pointer border-0 shadow-glow-primary"
                                    >
                                        Save Changes
                                    </motion.button>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === "KYB" && (
                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-4 sm:p-6 lg:p-8 max-w-[800px] shadow-sm">
                            <div className="flex items-center gap-3 sm:gap-5 mb-5 sm:mb-8">
                                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${profileData?.kybStatus === "APPROVED" || profileData?.kybStatus === "VERIFIED" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-7 sm:h-7">
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-xl font-bold text-[var(--header-text)] mb-0.5 sm:mb-1.5">
                                        {profileData?.kybStatus || "KYB Not Submitted"}
                                    </h2>
                                    <p className="text-[11px] sm:text-[13px] text-[var(--color-text-muted)] font-medium">Business verification status</p>
                                </div>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)]">Please contact support if you need to update your business details or documents.</p>
                        </div>
                    )}

                    {activeTab === "Wallet" && (
                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8 text-center text-[var(--color-text-muted)] text-sm shadow-sm">
                            Wallet functionality for partners is coming soon.
                        </div>
                    )}

                    {activeTab === "Settings" && (
                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-6 lg:p-8 max-w-[800px] shadow-sm">
                            <h3 className="text-sm font-bold text-[var(--header-text)] mb-4">Notification Settings</h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[var(--sidebar-border)] text-[var(--color-primary-300)]" />
                                    <span className="text-xs text-[var(--header-text)]">Email notifications for new leads</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[var(--sidebar-border)] text-[var(--color-primary-300)]" />
                                    <span className="text-xs text-[var(--header-text)]">Platform alerts for property updates</span>
                                </label>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
