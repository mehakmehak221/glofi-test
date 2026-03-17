"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUpIcon, SearchIcon, EyeOpenIcon, DownloadIcon, AboutIcon } from "@/components/VectorImages";
import PaymentModal from "@/components/dashboard/PaymentModal";

const STATS = [
    { label: "Total Listings", value: "8", change: "+3 this week", icon: TrendingUpIcon, color: "text-white" },
    { label: "Total Value", value: "$3.1M", change: "+8.5% overall", icon: TrendingUpIcon, color: "text-white" },
    { label: "Average ROI", value: "13.6%", change: "High performing", icon: TrendingUpIcon, color: "text-white" },
    { label: "Active Sellers", value: "8", change: "Verified users", icon: TrendingUpIcon, color: "text-white" },
];

const MARKETPLACE_ASSETS = [
    {
        
        id: 1,
        name: "Burj Vista Tower",
        image: "/assets/marketplace/Burj.png",
        seller: "Sarah Chen",
        change: "+15%",
        fractions: "25/100",
        price: "$625K",
        currentValue: "$719K",
    },
    {
        id: 2,
        name: "Palm Jumeirah Villa",
        image: "/assets/marketplace/Palm.png",
        seller: "Michael Torres",
        change: "+12.4%",
        fractions: "10/50",
        price: "$190K",
        currentValue: "$214K",
    },
    {
        id: 3,
        name: "Marina Walk Residences",
        image: "/assets/marketplace/Marina.png",
        seller: "James Wilson",
        change: "+12%",
        fractions: "15/80",
        price: "$300K",
        currentValue: "$336K",
    },
    {
        id: 4,
        name: "Downtown Dubai",
        image: "/assets/marketplace/Burj.png",
        seller: "Emily Rodriguez",
        change: "+16%",
        fractions: "30/120",
        price: "$450K",
        currentValue: "$522K",
    },
    {
        id: 5,
        name: "Arabian Ranches Villa",
        image: "/assets/marketplace/Palm.png",
        seller: "David Kim",
        change: "+10%",
        fractions: "8/40",
        price: "$160K",
        currentValue: "$176K",
    },
    {
        id: 6,
        name: "Business Bay Corporate",
        image: "/assets/marketplace/Bay.png",
        seller: "Anna Martinez",
        change: "+15%",
        fractions: "20/100",
        price: "$400K",
        currentValue: "$460K",
    },
    {
        id: 7,
        name: "Jumeirah Beach",
        image: "/assets/marketplace/Burj.png",
        seller: "Robert Lee",
        change: "+11.7%",
        fractions: "12/60",
        price: "$240K",
        currentValue: "$268K",
    },
    {
        id: 8,
        name: "Dubai Creek Harbor",
        image: "/assets/marketplace/Palm.png",
        seller: "Sofia Ahmed",
        change: "+17%",
        fractions: "18/90",
        price: "$360K",
        currentValue: "$421K",
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function SecondaryMarketplacePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All Properties");
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);

    const handleBuyFractions = (asset) => {
        setSelectedAsset(asset);
        setIsPaymentModalOpen(true);
    };

    const filters = ["All Properties", "High ROI (15%+)", "Best Value"];

    return (
        <div className="p-4 sm:p-6 lg:p-10 bg-[#0A0F0D] min-h-screen text-white font-sans">
            <div className="max-w-[1400px] mx-auto">

                <header className="mb-8">
                    <h1 className="text-3xl sm:text-[40px] font-bold mb-3 font-Montserrat tracking-tight">Secondary Marketplace</h1>
                    <p className="text-base sm:text-lg text-[#A4A7AE] mb-8 font-Montserrat max-w-2xl leading-relaxed">Browse properties relisted by investors. All fractions available for immediate purchase.</p>

                    <div className="relative max-w-md w-full">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-[#444]" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search properties by name..."
                            className="w-full bg-[#0D1411] border border-[#FFFFFF0A] rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00FFCD33] transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>


                <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="bg-[#0D1411] border border-[#FFFFFF0A] rounded-2xl p-5 sm:p-6 relative overflow-hidden group hover:border-[#00FFCD1A] transition-colors">
                            <div className="flex justify-between items-start mb-6 sm:mb-8">
                                <span className="text-[10px] text-[#767676] uppercase tracking-[0.1em] font-bold">{stat.label}</span>
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#00FFCD10] flex items-center justify-center">
                                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#00FFCD]" />
                                </div>
                            </div>
                            <div className="mb-1">
                                <span className="text-3xl sm:text-4xl font-bold">{stat.value}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className="text-[11px] text-[#00FFCD] font-medium">{stat.change}</span>
                            </div>
                        </div>
                    ))}
                </section>


                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-2 p-1 bg-[#0D1411] rounded-xl border border-[#FFFFFF0A] overflow-x-auto max-w-full no-scrollbar">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeFilter === filter
                                    ? "bg-[#00F4C4] text-black shadow-[0_0_15px_rgba(0,244,196,0.3)]"
                                    : "text-[#767676] hover:text-white"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[#0D1411] border border-[#FFFFFF0A] rounded-xl text-xs font-bold text-[#767676] hover:text-white transition-colors">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M1.5 3H14.5V4.5H1.5V3ZM4 7H12V8.5H4V7ZM6.5 11H9.5V12.5H6.5V11Z" />
                            </svg>
                            <span className="md:hidden lg:inline">Filters</span>
                        </button>
                        <button className="flex-[2] md:flex-none flex items-center justify-between gap-4 px-6 py-3 bg-[#0D1411] border border-[#FFFFFF0A] rounded-xl text-xs font-bold min-w-[140px]">
                            <span>Most Recent</span>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                <path d="M1 1L5 5L9 1" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>


                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-16"
                >
                    {MARKETPLACE_ASSETS.map((asset) => (
                        <MarketplaceCard key={asset.id} asset={asset} onBuy={() => handleBuyFractions(asset)} />
                    ))}
                </motion.div>


                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    asset={selectedAsset}
                />


                <section className="bg-[#0D1411] border border-[#FFFFFF0A] rounded-[32px] p-8 sm:p-10 flex flex-col md:flex-row items-start gap-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#00F4C41A] flex items-center justify-center flex-shrink-0">
                        <AboutIcon className="w-4 h-4 text-[#00F4C4]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4 font-Montserrat">About Secondary Marketplace</h2>
                        <p className="text-base text-[#767676] leading-relaxed max-w-5xl font-Montserrat">
                            The Secondary Marketplace allows investors to buy property fractions that have been relisted by other investors. All properties shown here were previously purchased from the primary marketplace and are now available for immediate transfer. Prices may vary based on current market value and seller preferences.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

function MarketplaceCard({ asset, onBuy }) {
    return (
        <motion.div
            variants={itemVariants}
            className="group bg-[#0D1411] border border-[#FFFFFF0A] rounded-[40px] overflow-hidden flex flex-col hover:border-[#00FFCD33] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500"
        >

            <div className="relative h-56 sm:h-48 lg:h-52 xl:h-48 overflow-hidden">
                <Image
                    src={asset.image}
                    alt={asset.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 rounded-full bg-[#00FFCD]/90 backdrop-blur-md text-black text-[11px] font-bold flex items-center gap-1 shadow-lg ring-1 ring-white/20">
                        {asset.change}
                    </div>
                </div>
                <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full pr-4 border border-white/10 ring-1 ring-black/20">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00FFCD] to-[#009976] flex items-center justify-center text-[10px] font-bold text-black border border-white/20 shadow-sm">
                            {asset.seller.charAt(0)}
                        </div>
                        <span className="text-[11px] font-semibold text-white tracking-tight">{asset.seller}</span>
                    </div>
                </div>
            </div>


            <div className="p-7 sm:p-6 lg:p-7 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-6 font-Montserrat leading-snug group-hover:text-[#00FFCD] transition-colors line-clamp-2 min-h-[3.5rem]">{asset.name}</h3>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-[#050B08] rounded-3xl p-5 flex flex-col justify-between min-h-[90px] ring-1 ring-white/5">
                        <p className="text-[10px] text-[#444] uppercase tracking-widest font-bold">Fractions</p>
                        <p className="text-base font-bold text-white font-Montserrat">{asset.fractions}</p>
                    </div>
                    <div className="bg-[#050B08] rounded-3xl p-5 flex flex-col justify-between min-h-[90px] ring-1 ring-white/5">
                        <p className="text-[10px] text-[#444] uppercase tracking-widest font-bold">Price</p>
                        <p className="text-base font-bold text-white font-Montserrat">{asset.price}</p>
                    </div>
                    <div className="col-span-2 bg-[#00F4C40D] rounded-3xl p-6 flex flex-col justify-between min-h-[110px] ring-1 ring-[#00FFCD1A]">
                        <p className="text-[10px] text-[#A4A7AE] uppercase tracking-widest font-bold opacity-70">Current Value</p>
                        <p className="text-xl font-black text-[#00FFCD] font-Montserrat">{asset.currentValue}</p>
                    </div>
                </div>

                <div className="mt-auto space-y-4">
                    <button
                        onClick={onBuy}
                        className="w-full py-4 rounded-xl bg-[#00F4C4] text-black text-sm font-black uppercase tracking-wider hover:bg-[#00e6b8] hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_4px_20px_rgba(0,255,205,0.2)]"
                    >
                        Buy Fractions
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-4 rounded-xl bg-[#FFFFFF0A] text-xs font-bold text-white hover:bg-[#FFFFFF1A] transition-all">
                            <EyeOpenIcon className="w-4 h-4 opacity-70" />
                            <span>View</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-4 rounded-xl bg-[#FFFFFF0A] text-xs font-bold text-white hover:bg-[#FFFFFF1A] transition-all">
                            <DownloadIcon className="w-4 h-4 opacity-70" />
                            <span>Info</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
