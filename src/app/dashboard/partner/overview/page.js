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
        value: "$4.2M",
        delta: "+$850K",
        icon: FinancialIcon,
    },
    {
        label: "COMMISSIONS",
        value: "$126K",
        delta: "+$28K",
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
    { name: "Burj Vista Tower", pct: 68, img: "/assets/img_burj.png" },
    { name: "Marina Business Hub", pct: 30, img: "/assets/img_marina.png" },
    { name: "Palm Jumeirah Villa Estate", pct: 76, img: "/assets/img_palm.png" },
    { name: "Dubai South Development Land", pct: 7, img: "/assets/img_dubai.png" },
    { name: "DIFC Innovation Tower", pct: 30, img: "/assets/img_difc.png" },
    { name: "Marina Walk Residences", pct: 45, img: "/assets/img_walk.png" },
];


function StatCard({ label, value, delta, icon: Icon, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.07 }}
            className="bg-[var(--color-bg-nav)] rounded-xl p-5 flex flex-col gap-3 hover:border-[var(--color-primary-300)]/10 transition-colors"
        >
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-[0.15em] text-[var(--color-text-muted)] font-montserrat uppercase">
                    {label}
                </span>
                <span className="text-[var(--color-primary-300)] opacity-80 bg-[var(--color-primary-300)]/10 rounded-full p-2">
                    <Icon className="w-5 h-5" />
                </span>
            </div>

            <p className="text-3xl font-semibold text-white font-montserrat tracking-tight">
                {value}
            </p>

            <div className="flex items-center gap-1.5 text-[var(--color-primary-300)]/60 text-xs font-medium font-montserrat">
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
            className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-[var(--color-bg-surface-subtle)] transition-colors group"
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-montserrat flex-shrink-0"
                    style={{ backgroundColor: lead.color, color: lead.textColor }}
                >
                    {lead.initials}
                </div>
                <div>
                    <p className="text-sm font-semibold text-[var(--color-text-secondary)] font-montserrat leading-tight">{lead.name}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-montserrat mt-0.5">{lead.property}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-7 h-7 rounded-md bg-[var(--color-bg-surface-subtle)] flex items-center justify-center hover:bg-[var(--color-primary-300)]/10 transition-colors">
                    <PhoneIcon className="w-3.5 h-3.5 text-[var(--color-primary-300)]" />
                </button>
                <button className="w-7 h-7 rounded-md bg-[var(--color-bg-surface-subtle)] flex items-center justify-center hover:bg-[var(--color-bg-surface-subtle)]/10 transition-colors">
                    <svg className="w-3.5 h-3.5 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            className="flex items-center gap-3"
        >

            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-300)]/10  flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                {listing.img ? (
                    <Image
                        src={listing.img}
                        alt={listing.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                    />
                ) : (
                    <svg className="w-5 h-5 text-[var(--color-primary-300)]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="7" width="20" height="15" rx="1" />
                        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                    </svg>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm text-white font-montserrat font-medium truncate pr-2">{listing.name}</p>
                    <span className="text-[var(--color-primary-300)] text-sm font-bold font-montserrat flex-shrink-0">{listing.pct}%</span>
                </div>
                <div className="h-[3px] w-full bg-[var(--color-border-subtle)] rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${listing.pct}%` }}
                        transition={{ duration: 0.7, delay: 0.4 + index * 0.06, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                            background: "var(--color-gradient-glofi)",
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
}


function KybStatusBanner() {
    const { data: kybStatus, isLoading } = useGetKybStatusQuery();

    if (isLoading || kybStatus?.status === 'APPROVED') return null;

    const isPending = kybStatus?.status === 'PENDING';
    const isRejected = kybStatus?.status === 'REJECTED';

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-xl border flex items-center justify-between ${isRejected ? 'bg-red-500/10 border-red-500/20' : 'bg-[var(--color-primary-300)]/5 border-[var(--color-primary-300)]/10'
                }`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isRejected ? 'bg-red-500/20 text-red-500' : 'bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)]'
                    }`}>
                    <SparkleIcon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-white font-montserrat">
                        {isRejected ? 'KYB Rejected' : isPending ? 'KYB Verification Pending' : 'Complete your KYB'}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] font-montserrat mt-0.5">
                        {isRejected
                            ? 'Your business verification was rejected. Please update your details.'
                            : isPending
                                ? 'We are currently reviewing your business documents.'
                                : 'To start listing properties and raising funds, please complete your business verification.'}
                    </p>
                </div>
            </div>
            {!isPending && (
                <button 
                    onClick={() => window.location.href = '/onboarding/kyb'}
                    className={`px-4 py-2 rounded-lg text-xs font-bold font-montserrat transition-all ${isRejected ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[var(--color-primary-300)] text-black hover:opacity-90'
                    }`}
                >
                    {isRejected ? 'Re-submit' : 'Complete Setup'}
                </button>
            )}
        </motion.div>
    );
}

export default function PartnerOverviewPage() {
    return (
        <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">


            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
            >
                <h1 className="text-xl lg:text-2xl font-semibold text-white font-montserrat">
                    Overview
                </h1>
                <p className="text-sm  font-montserrat mt-1 text-[var(--color-text-muted)]">Partner command center</p>
            </motion.div>

            <KybStatusBanner />



            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {STAT_CARDS.map((card, i) => (
                    <StatCard key={card.label} {...card} index={i} />
                ))}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">


                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="bg-[var(--color-bg-nav)] rounded-xl p-5"
                >
                    <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] font-montserrat mb-4">Hot Leads</h2>
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
                    className="bg-[var(--color-bg-nav)]  rounded-xl p-5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] font-montserrat">AI Agent</h2>
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] text-[var(--color-primary-300)]/60 font-montserrat uppercase bg-[var(--color-primary-300)]/5 rounded-full px-2.5 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-300)] animate-pulse" />
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
                                <span className="text-sm text-[var(--color-text-muted)] font-montserrat">{stat.label}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-white font-montserrat">{stat.value}</span>
                                    <span className="text-[11px] text-[var(--color-primary-300)]/40 font-montserrat">{stat.delta}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>


            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                className="bg-[var(--color-bg-nav)]  rounded-xl p-5"
            >
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] font-montserrat mb-6">Listing Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                    {LISTINGS.map((listing, i) => (
                        <ListingBar key={listing.name} listing={listing} index={i} />
                    ))}
                </div>
            </motion.div>

        </div>
    );
}
