"use client";

import { motion } from "framer-motion";
import { useGetAgentReferralLinkQuery, useGetAgentDashboardQuery } from "@/store/api/agentApi";
import { CopyIcon, LoadingSpinner } from "@/components/VectorImages";
import { useState } from "react";

export default function AgentReferralsPage() {
    const [copied, setCopied] = useState(false);
    
    const { data: linkData, isLoading: isLinkLoading } = useGetAgentReferralLinkQuery();
    const { data: dashboardData, isLoading: isDashLoading } = useGetAgentDashboardQuery();

    const referralCode = linkData?.referralCode || "---";
    const referralLink = linkData?.referralLink || "---";
    const referralsCount = dashboardData?.referralsCount || 0;

    const handleCopy = () => {
        if (!linkData?.referralLink) return;
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLinkLoading || isDashLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen flex items-center justify-center">
                <div className="text-[var(--foreground)] opacity-50 font-montserrat animate-pulse flex items-center gap-3">
                    <LoadingSpinner />
                    Loading referral data...
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-[var(--foreground)] font-montserrat tracking-tight">
                    Referrals
                </h1>
                <p className="text-sm text-white/40 mt-1 font-montserrat">Grow your network and track your performance</p>
            </motion.div>

            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8"
                >
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat mb-6">Generate Referral Link</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-[var(--sidebar-text)] opacity-40 tracking-wider font-montserrat uppercase text-white/50">Your Unique Referral Link</label>
                            <span className="text-[10px] font-mono text-[#00FFCC] bg-[#00FFCC]/10 px-2 py-0.5 rounded uppercase font-bold tracking-widest border border-[#00FFCC]/20">{referralCode}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 h-14 bg-[var(--background)] rounded-md border border-[var(--sidebar-border)] flex items-center px-5 text-sm text-[var(--foreground)] opacity-60 font-montserrat overflow-hidden group hover:border-[#00FFCC]/30 transition-all">
                                <span className="truncate">{referralLink}</span>
                            </div>
                            <button 
                                onClick={handleCopy}
                                className="h-14 px-8 rounded-md bg-[var(--color-primary-300)]/5 border border-[var(--color-primary-300)]/20 text-[var(--color-primary-300)] font-bold text-sm font-montserrat hover:bg-[var(--color-primary-300)]/10 transition-all flex items-center justify-center gap-3 flex-shrink-0 cursor-pointer"
                            >
                                <CopyIcon className="w-4 h-4" />
                                {copied ? "COPIED" : "COPY LINK"}
                            </button>
                        </div>
                        <p className="text-xs text-[var(--sidebar-text)] opacity-40 font-montserrat leading-relaxed pt-4">
                            <span className="font-bold text-[var(--foreground)] opacity-80 uppercase text-[10px] tracking-wider text-[#00FFCC]">How it works:</span> Share this link with potential investors. When they click the link and sign up, they&apos;ll be automatically tagged as your referral. Any purchases they make will earn you commission.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 }}
                    className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8"
                >
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat mb-10">Referral Performance</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                        <div className="space-y-2">
                            <span className="text-[11px] font-bold text-[var(--sidebar-text)] opacity-40 uppercase tracking-widest font-montserrat">Total Referrals</span>
                            <p className="text-3xl font-bold text-[var(--foreground)] font-montserrat">{referralsCount}</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[11px] font-bold text-[var(--sidebar-text)] opacity-40 uppercase tracking-widest font-montserrat">Conversion Rate</span>
                            <p className="text-3xl font-bold text-[var(--foreground)] font-montserrat">0%</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[11px] font-bold text-[var(--sidebar-text)] opacity-40 uppercase tracking-widest font-montserrat">Avg. Transaction Value</span>
                            <p className="text-3xl font-bold text-[var(--foreground)] font-montserrat">$0</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
