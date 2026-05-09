"use client";

import { motion } from "framer-motion";
import { useGetAgentReferralLinkQuery, useGetAgentDashboardQuery } from "@/store/api/agentApi";
import { 
    LinkIcon, 
    LoadingSpinner, 
    CopyIcon, 
    AnalyticsIcon, 
    GuideIcon, 
    UserGroupIcon, 
    ChartLineIcon, 
    DollarIcon,
    UserPlusIcon,
    ShareIcon,
    SparkleIcon
} from "@/components/VectorImages";
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
                {/* Share Card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat">Generate Referral Link</h2>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-[var(--color-primary-300)] font-montserrat tracking-widest bg-[var(--color-primary-300)]/10 px-2 py-0.5 rounded border border-[var(--color-primary-300)]/20 uppercase">{referralCode}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="flex-1 h-14 bg-black/20 rounded-md border border-[var(--sidebar-border)] flex items-center px-5 text-sm text-[var(--foreground)] opacity-60 font-montserrat overflow-hidden group hover:border-[var(--color-primary-300)]/30 transition-all">
                             <LinkIcon className="w-4 h-4 mr-3 opacity-40" />
                             <span className="truncate">{referralLink}</span>
                        </div>
                        <button 
                            onClick={handleCopy}
                            className="h-14 px-8 rounded-md bg-[var(--color-primary-300)] text-black font-bold text-sm font-montserrat hover:opacity-90 transition-all flex items-center justify-center gap-3 flex-shrink-0"
                        >
                            <CopyIcon className="w-4 h-4" />
                            {copied ? "COPIED" : "COPY LINK"}
                        </button>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-[var(--color-primary-300)]/5 rounded-md border border-[var(--color-primary-300)]/10">
                        <SparkleIcon className="w-4 h-4 text-[var(--color-primary-300)] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-[var(--sidebar-text)] opacity-60 font-montserrat leading-relaxed">
                            <span className="font-bold text-[var(--foreground)] opacity-80 uppercase text-[10px] tracking-wider text-[var(--color-primary-300)] mr-2">How it works:</span>
                            Share your link to grow your network. Earn commissions automatically on every successful referral purchase.
                        </p>
                    </div>
                </motion.div>

                {/* Analytics Section */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 }}
                    className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8"
                >
                    <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat mb-10">Referral Performance</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--sidebar-text)] opacity-40 uppercase tracking-widest font-montserrat">
                                <UserGroupIcon className="w-3.5 h-3.5" />
                                Total Referrals
                            </div>
                            <p className="text-3xl font-bold text-[var(--foreground)] font-montserrat">{referralsCount}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--sidebar-text)] opacity-40 uppercase tracking-widest font-montserrat">
                                <ChartLineIcon className="w-3.5 h-3.5" />
                                Conversion Rate
                            </div>
                            <p className="text-3xl font-bold text-[var(--foreground)] font-montserrat">0%</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--sidebar-text)] opacity-40 uppercase tracking-widest font-montserrat">
                                <DollarIcon className="w-3.5 h-3.5" />
                                Avg Transaction Value
                            </div>
                            <p className="text-3xl font-bold text-[var(--foreground)] font-montserrat">₹0</p>
                        </div>
                    </div>
                </motion.div>

                {/* How It Works Section */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 }}
                    className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8"
                >
                    <div className="flex items-center gap-3 mb-10">
                         <GuideIcon className="w-5 h-5 text-[var(--color-primary-300)]" />
                         <h2 className="text-base font-bold text-[var(--foreground)] font-montserrat">How It Works</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-300)]/10 border border-[var(--color-primary-300)]/20 flex items-center justify-center text-[var(--color-primary-300)] font-bold text-xs">1</div>
                            <h3 className="text-sm font-bold text-[var(--foreground)] font-montserrat">Share Your Link</h3>
                            <p className="text-xs text-[var(--sidebar-text)] opacity-40 font-montserrat leading-relaxed text-balance">Send your unique referral link to potential investors through your network.</p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 font-bold text-xs">2</div>
                            <h3 className="text-sm font-bold text-[var(--foreground)] font-montserrat">Investor Signs Up</h3>
                            <p className="text-xs text-[var(--sidebar-text)] opacity-40 font-montserrat leading-relaxed text-balance">They register using your link and are automatically tagged as your referral in our system.</p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 font-bold text-xs">3</div>
                            <h3 className="text-sm font-bold text-[var(--foreground)] font-montserrat">Earn Commission</h3>
                            <p className="text-xs text-[var(--sidebar-text)] opacity-40 font-montserrat leading-relaxed text-balance">You earn a commission on every successful purchase they make on the platform.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}


