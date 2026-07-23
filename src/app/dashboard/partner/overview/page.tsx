"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
    OverviewIcon,
    LeadIcon,
    FinancialIcon,
    TrendingUpIcon,
    PhoneIcon,
    PropertyIcon,
    SparkleIcon,
} from "@/components/VectorImages";
import { useGetKybStatusQuery } from "@/store/api/kybApi";
import { useGetKycStatusQuery } from "@/store/api/kycApi";
import { useGetMyListingsQuery } from "@/store/api/assetApi";
import { useGetPartnerPortfolioQuery, useGetListingPerformanceQuery } from "@/store/api/partnerApi";
import { API_URL } from "@/constants";


const STAT_CARDS = [
    {
        label: "LISTINGS",
        value: "8",
        delta: "+2 this month",
        icon: PropertyIcon,
    },
    {
        label: "ACTIVE LEADS",
        value: "47",
        delta: "+12 this week",
        icon: LeadIcon,
    },
    {
        label: "FUNDS RAISED",
        value: "₹4.2 Cr",
        delta: "+₹85 L",
        icon: FinancialIcon,
    },
    {
        label: "COMMISSIONS",
        value: "₹1.2 L",
        delta: "+₹28,000",
        icon: TrendingUpIcon,
    },
];

const HOT_LEADS = [
    { name: "Ahmed Al Rashid", property: "Burj Vista Tower", initials: "A", color: "var(--color-accent-red-alpha-10)", textColor: "var(--color-accent-red)" },
    { name: "Sarah Chen", property: "Marina Walk Residences", initials: "S", color: "var(--color-accent-orange-alpha-10)", textColor: "var(--color-accent-orange)" },
    { name: "Raj Patel", property: "Dubai South Development Land", initials: "R", color: "var(--color-accent-red-alpha-10)", textColor: "var(--color-accent-red)" },
    { name: "Fatima Al Mansoori", property: "Marina Business Hub", initials: "F", color: "var(--color-accent-orange-alpha-10)", textColor: "var(--color-accent-orange)" },
];

const AI_STATS = [
    { label: "Calls Today", value: "342", delta: "+83" },
    { label: "Conversion", value: "23.5%", delta: "+2.1%" },
    { label: "Lead Score Avg", value: "7.8", delta: "+0.4" },
    { label: "Automation Runs", value: "1,247", delta: "12 active" },
];

const LISTINGS = [
    { name: "Burj Vista Tower", pct: 68, img: "/assets/images/content/img_burj.png" },
    { name: "Marina Business Hub", pct: 30, img: "/assets/images/content/img_marina.png" },
    { name: "Palm Jumeirah Villa Estate", pct: 76, img: "/assets/images/content/img_palm.png" },
    { name: "Dubai South Development Land", pct: 7, img: "/assets/images/content/img_dubai.png" },
    { name: "DIFC Innovation Tower", pct: 30, img: "/assets/images/content/img_difc.png" },
    { name: "Marina Walk Residences", pct: 45, img: "/assets/images/content/img_walk.png" },
];


function StatCard({ label, value, delta, icon: Icon, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.07 }}
            className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-4 sm:p-5 flex flex-col gap-3 hover:shadow-md transition-all"
        >
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-[0.15em] text-[var(--sidebar-text)] font-montserrat uppercase opacity-60">
                    {label}
                </span>
                <span className="text-[var(--sidebar-active-text)] bg-[var(--sidebar-active-bg)] rounded-md p-2">
                    <Icon className="w-5 h-5" />
                </span>
            </div>

            <p className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)] font-montserrat tracking-tight">
                {value}
            </p>

            <div className="flex items-center gap-1.5 text-[var(--sidebar-active-text)]/70 text-xs font-medium font-montserrat">
                <TrendingUpIcon className="w-3.5 h-3.5" />
                <span>{delta}</span>
            </div>
        </motion.div>
    );
}

function LeadRow({ lead, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.06 }}
            className="flex items-center justify-between px-3 py-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors group mb-1 last:mb-0"
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-montserrat flex-shrink-0"
                    style={{ backgroundColor: lead.color, color: lead.textColor }}
                >
                    {lead.initials}
                </div>
                <div>
                    <p className="text-sm font-semibold text-[var(--foreground)] font-montserrat leading-tight">{lead.name}</p>
                    <p className="text-[11px] text-[var(--sidebar-text)] font-montserrat mt-0.5 opacity-60">{lead.property}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-7 h-7 rounded-md bg-[var(--sidebar-active-bg)] flex items-center justify-center hover:opacity-80 transition-opacity">
                    <PhoneIcon className="w-3.5 h-3.5 text-[var(--sidebar-active-text)]" />
                </button>
                <button className="w-7 h-7 rounded-md bg-black/5 dark:bg-white/5 flex items-center justify-center hover:opacity-80 transition-opacity">
                    <svg className="w-3.5 h-3.5 text-[var(--sidebar-text)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                </button>
            </div>
        </motion.div>
    );
}

function ListingBar({ listing, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.06 }}
            className="flex items-center gap-3 p-2 rounded-md bg-black/[0.02] dark:bg-white/[0.02] cursor-default"
        >

            <div className="w-10 h-10 rounded-lg bg-[var(--sidebar-active-bg)]  flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                {listing.img ? (
                    <Image
                        src={listing.img}
                        alt={listing.name}
                        fill
                        className="object-cover opacity-80"
                        sizes="40px"
                    />
                ) : (
                    <svg className="w-5 h-5 text-[var(--sidebar-active-text)]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="7" width="20" height="15" rx="1" />
                        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                    </svg>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[12px] text-[var(--foreground)] font-montserrat font-medium truncate pr-2 opacity-80">{listing.name}</p>
                    <span className="text-[var(--sidebar-active-text)] text-[11px] font-bold font-montserrat flex-shrink-0">{listing.pct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden bg-[var(--marketplace-card-border)]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${listing.pct}%` }}
                        transition={{ duration: 0.7, delay: 0.4 + index * 0.06, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                            background:
                                "linear-gradient(90deg, var(--marketplace-card-progress-fill-start) 0%, var(--marketplace-card-progress-fill-end) 100%)",
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
}




const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}/${imagePath.replace(/^\//, '')}`;
};

const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
};

export default function PartnerOverviewPage() {
    const { data: portfolioData, isLoading: isLoadingPortfolio } = useGetPartnerPortfolioQuery();
    const { data: performanceData, isLoading: isLoadingPerformance, isError, error } = useGetListingPerformanceQuery();
    const { data: kycData } = useGetKycStatusQuery();
    const { data: kybData } = useGetKybStatusQuery();
    const err = error as { status?: number; data?: { message?: string } } | undefined;
    const kycStatus = kycData?.status;
    const kybStatus = kybData?.status;

    const isKycRequired = err?.status === 403 && (
        err?.data?.message?.includes('KYC') || 
        kycStatus === 'REJECTED' || 
        kycStatus === 'PENDING' || 
        !kycStatus || 
        (kycStatus !== 'APPROVED' && kycStatus !== 'VERIFIED')
    );

    const isKybRequired = err?.status === 403 && !isKycRequired && (
        err?.data?.message?.includes('KYB') || 
        kybStatus === 'REJECTED' || 
        kybStatus === 'PENDING' || 
        !kybStatus || 
        (kybStatus !== 'APPROVED' && kybStatus !== 'VERIFIED')
    );

    const displayListings = performanceData?.data || [];

    const stats = [
        {
            label: "LISTINGS",
            value: portfolioData?.listings?.total || 0,
            delta: `+${portfolioData?.listings?.thisMonth || 0} this month`,
            icon: PropertyIcon,
        },
        {
            label: "ACTIVE LEADS",
            value: "0",
            delta: "0 this week",
            icon: LeadIcon,
        },
        {
            label: "FUNDS RAISED",
            value: formatCurrency(portfolioData?.fundsRaised?.total || 0),
            delta: `+${formatCurrency(portfolioData?.fundsRaised?.thisMonth || 0)}`,
            icon: FinancialIcon,
        },
        {
            label: "COMMISSIONS",
            value: formatCurrency(portfolioData?.commissions?.total || 0),
            delta: `+${formatCurrency(portfolioData?.commissions?.thisMonth || 0)}`,
            icon: TrendingUpIcon,
        },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
            >
                <h1 className="text-xl lg:text-2xl font-semibold text-[var(--foreground)] font-montserrat tracking-tight opacity-90 uppercase tracking-widest">
                    Overview
                </h1>
                <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] font-montserrat mt-2 text-[var(--sidebar-text)] opacity-40 uppercase">Developer command center</p>
            </motion.div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((card, i) => (
                    <StatCard key={card.label} {...card} index={i} />
                ))}
            </div>

            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl p-5"
                >
                    <h2 className="text-sm font-semibold text-[var(--foreground)] font-montserrat mb-4 opacity-70 uppercase tracking-wider">Hot Leads</h2>
                    <div className="flex flex-col gap-1">
                        {HOT_LEADS.map((lead, i) => (
                            <LeadRow key={lead.name} lead={lead} index={i} />
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 }}
                    className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl p-5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-semibold text-[var(--foreground)] font-montserrat opacity-70 uppercase tracking-wider">AI Agent Performance</h2>
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] text-[var(--sidebar-active-text)] font-montserrat uppercase bg-[var(--sidebar-active-bg)] rounded-full px-2.5 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--sidebar-active-text)] animate-pulse" />
                            ACTIVE
                        </span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {AI_STATS.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.25 + i * 0.06 }}
                                className="flex items-center justify-between"
                            >
                                <span className="text-sm text-[var(--sidebar-text)] font-montserrat opacity-60">{stat.label}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-[var(--foreground)] font-montserrat">{stat.value}</span>
                                    <span className="text-[11px] text-[var(--sidebar-active-text)] opacity-50 font-montserrat">{stat.delta}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div> */}

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-5"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] font-montserrat uppercase tracking-wider">Listing Performance</h2>
                    {isLoadingPerformance && <div className="w-4 h-4 border border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin" />}
                </div>

                {isError ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <p className="text-sm font-bold text-[var(--foreground)] opacity-90 mb-2 uppercase tracking-wide">
                            {isKycRequired ? "Verification Required" : isKybRequired ? "Business Verification Required" : "Error Loading Data"}
                        </p>
                        <p className="text-[11px] text-[var(--sidebar-text)] opacity-60 max-w-xs mb-4">
                            {isKycRequired ? "You need to complete identity verification to view and manage your listings performance." : isKybRequired ? "You need to complete business verification to view and manage your listings performance." : "Your account verification is pending. Real-time listing performance will appear once approved."}
                        </p>
                    </div>
                ) : displayListings.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4 border border-dashed border-[var(--sidebar-border)] rounded-md">
                        <p className="text-sm font-bold text-[var(--foreground)] opacity-70 mb-1 uppercase tracking-wider">No active listings</p>
                        <p className="text-[11px] text-[var(--sidebar-text)] opacity-40">Your property performance metrics will appear here once you list an asset.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                        {displayListings.slice(0, 6).map((l, i) => (
                            <ListingBar
                                key={l.id || l.title + i}
                                listing={{
                                    name: l.title,
                                    pct: l.fundedPercentage || 0,
                                    img: getImageUrl(l.images?.[0])
                                }}
                                index={i}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
