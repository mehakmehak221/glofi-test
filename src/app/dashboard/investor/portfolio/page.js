"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TrendingUpIcon, DollarIcon, TopArrow, Asset, ResaleIcon } from "@/components/VectorImages";
import ResaleModal from "@/components/dashboard/ResaleModal";

const STATS = [
    { label: "Invested", value: "$1.1M", change: "+$19K this month", icon: DollarIcon, color: "var(--color-gradient-glofi)" },
    { label: "Current Value", value: "$1.3M", change: "+15.2% overall", icon: TrendingUpIcon, color: "var(--color-gradient-glofi)" },
    { label: "ROI", value: "13.7%", change: "+3.1% this quarter", icon: TopArrow, color: "var(--color-gradient-glofi)" },
    { label: "Assets Owned", value: "3", change: null, icon: Asset, color: "var(--color-gradient-glofi)" },
];

const ASSETS = [
    {
        id: 1,
        name: "Burj Vista Tower",
        image: "/assets/img_ext_0.jpeg",
        fractions: 25,
        invested: "$625K",
        value: "$719K",
        roi: "+15%",
        isResale: true,
    },
    {
        id: 2,
        name: "Palm Jumeirah Villa Estate",
        image: "/assets/img_2.jpeg",
        fractions: 10,
        invested: "$190K",
        value: "$214K",
        roi: "+12.4%",
        isResale: false,
    },
    {
        id: 3,
        name: "Marina Walk Residences",
        image: "/assets/img_ext_1.jpeg",
        fractions: 15,
        invested: "$300K",
        value: "$336K",
        roi: "+12%",
        isResale: false,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function PortfolioPage() {
    const [selectedAsset, setSelectedAsset] = useState(null);

    return (
        <div className="p-4 sm:p-6 lg:p-10 bg-[var(--color-bg-dark)] min-h-screen">

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-[32px] font-bold text-white mb-8"
            >
                Portfolio
            </motion.h1>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            >
                {STATS.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        variants={itemVariants}
                        className="bg-[var(--color-bg-card-alt)] border border-[var(--color-border-subtle)] rounded-2xl p-6 hover:border-[var(--color-border-muted)] transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.1em] font-bold">{stat.label}</span>
                            <div className={`w-10 h-10 rounded-full bg-[var(--color-primary-100)]/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5 text-[var(--color-primary-100)]" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                        {stat.change && (
                            <p className="text-[11px] text-[var(--color-primary-100)] flex items-center gap-1.5 font-medium">
                                <TrendingUpIcon className="w-3.5 h-3.5" />
                                {stat.change}
                            </p>
                        )}
                    </motion.div>
                ))}
            </motion.div>


            <div className="flex flex-col gap-12">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-xl font-bold text-white">Your Active Resale Listings</h2>
                        <span className="px-2 py-0.5 rounded-full bg-[var(--color-gradient-glofi)] text-black text-[10px] font-bold uppercase tracking-wider">1 Active</span>
                    </div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-5"
                    >
                        {ASSETS.filter(a => a.isResale).map((asset) => (
                            <AssetCard
                                key={asset.id}
                                asset={asset}
                                onResale={() => setSelectedAsset(asset)}
                            />
                        ))}
                    </motion.div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-white mb-6">Your Other Properties</h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-5"
                    >
                        {ASSETS.filter(a => !a.isResale).map((asset) => (
                            <AssetCard
                                key={asset.id}
                                asset={asset}
                                onResale={() => setSelectedAsset(asset)}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>

            <ResaleModal
                isOpen={!!selectedAsset}
                onClose={() => setSelectedAsset(null)}
                asset={selectedAsset}
            />
        </div>
    );
}

function AssetCard({ asset, onResale }) {
    const totalFractions = asset.name === "Burj Vista Tower" ? 100 : (asset.name.includes("Palm") ? 50 : 80);

    return (
        <motion.div
            variants={itemVariants}
            className={`bg-[var(--color-bg-card-alt)] border ${asset.isResale ? 'border-[var(--color-primary-100)]/10' : 'border-[var(--color-border-subtle)]'} rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-[var(--color-border-muted)] transition-all duration-300 relative group`}
        >
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-8">

                <div className="w-full sm:w-[280px] lg:w-[240px] h-48 sm:h-[160px] lg:h-[135px] rounded-xl overflow-hidden flex-shrink-0 relative">
                    <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 280px"
                        className="object-cover"
                    />
                    {asset.isResale && (
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-[var(--color-gradient-glofi)] text-black text-[9px] font-bold uppercase tracking-wider">
                            On Sale
                        </div>
                    )}
                </div>

                <div className="flex-1 w-full flex flex-col justify-center">
                    <div className="flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-4 mb-5 lg:mb-4">
                        <div className="flex-1 w-full flex flex-col gap-4 sm:gap-2">
                            <div className="flex flex-row items-center justify-between sm:justify-start gap-4">
                                <h3 className="text-lg sm:text-xl font-bold text-white">{asset.name}</h3>
                                {asset.isResale && (
                                    <div className="sm:hidden px-3 py-1.5 rounded-full bg-[var(--color-primary-100)]/10 border border-[var(--color-primary-100)]/20 flex items-center shrink-0">
                                        <span className="text-[9px] text-[var(--color-primary-200)] font-bold uppercase tracking-wider">{asset.fractions} Listed</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 w-full">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Fractions</p>
                                    <p className="text-xs sm:text-sm font-bold text-white">{asset.fractions}/{totalFractions}</p>
                                </div>
                                <div className="block">
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Invested</p>
                                    <p className="text-xs sm:text-sm font-bold text-white">{asset.invested}</p>
                                </div>
                                <div className="block">
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Value</p>
                                    <p className="text-xs sm:text-sm font-bold text-[var(--color-primary-100)]">{asset.value}</p>
                                </div>
                                <div className="block">
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">ROI</p>
                                    <p className="text-xs sm:text-sm font-bold text-[var(--color-primary-100)]">{asset.roi}</p>
                                </div>
                            </div>
                        </div>

                        {asset.isResale && (
                             <div className="hidden sm:flex px-3 py-1.5 rounded-full bg-[var(--color-primary-100)]/10 border border-[var(--color-primary-100)]/20 items-center shrink-0 self-start lg:self-center">
                                <span className="text-[10px] text-[var(--color-primary-200)] font-bold uppercase tracking-wider">{asset.fractions} Listed for Resale</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg bg-[var(--color-bg-surface-subtle)] text-[var(--color-primary-100)] text-[11px] font-bold border border-transparent hover:border-[var(--color-border-muted)] transition-all cursor-pointer group/btn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover/btn:scale-110">
                                <g clipPath="url(#clip0_80_1082)">
                                    <path d="M1.03125 6.17394C0.989582 6.06168 0.989582 5.93819 1.03125 5.82594C1.4371 4.84186 2.12601 4.00046 3.01064 3.40839C3.89527 2.81631 4.93577 2.50024 6.00025 2.50024C7.06473 2.50024 8.10524 2.81631 8.98987 3.40839C9.87449 4.00046 10.5634 4.84186 10.9693 5.82594C11.0109 5.93819 11.0109 6.06168 10.9693 6.17394C10.5634 7.15801 9.87449 7.99942 8.98987 8.59149C8.10524 9.18356 7.06473 9.49963 6.00025 9.49963C4.93577 9.49963 3.89527 9.18356 3.01064 8.59149C2.12601 7.99942 1.4371 7.15801 1.03125 6.17394Z" stroke="var(--color-primary-200)" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6 7.5C6.82843 7.5 7.5 6.82843 7.5 6C7.5 5.17157 6.82843 4.5 6 4.5C5.17157 4.5 4.5 5.17157 4.5 6C4.5 6.82843 5.17157 7.5 6 7.5Z" stroke="var(--color-primary-200)" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs><clipPath id="clip0_80_1082"><rect width="12" height="12" fill="white" /></clipPath></defs>
                            </svg>
                            Certificate
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg bg-[var(--color-bg-surface-subtle)] text-[var(--color-text-muted)] text-[11px] font-bold hover:text-white transition-all border border-transparent hover:border-[var(--color-border-muted)] cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none">
                                <path d="M10.5 7.5V9.5C10.5 9.76522 10.3946 10.0196 10.2071 10.2071C10.0196 10.3946 9.76522 10.5 9.5 10.5H2.5C2.23478 10.5 1.98043 10.3946 1.79289 10.2071C1.60536 10.0196 1.5 9.76522 1.5 9.5V7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3.5 5L6 7.5L8.5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 7.5V1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Download
                        </motion.button>
                        {!asset.isResale && (
                            <motion.button
                                onClick={onResale}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg bg-[var(--color-primary-100)]/10 text-[var(--color-primary-100)] text-[11px] font-bold border border-[var(--color-primary-100)]/20 cursor-pointer hover:bg-[var(--color-primary-100)]/20 transition-all"
                            >
                                <ResaleIcon className="w-4 h-4" />
                                Resell
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
