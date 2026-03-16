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
        image: "/assets/img_ext_0.jpeg",
        seller: "Sarah Chen",
        change: "+15%",
        fractions: "25/100",
        price: "$625K",
        currentValue: "$719K",
    },
    {
        id: 2,
        name: "Palm Jumeirah Villa",
        image: "/assets/img_ext_1.jpeg",
        seller: "Michael Torres",
        change: "+12.4%",
        fractions: "10/50",
        price: "$190K",
        currentValue: "$214K",
    },
    {
        id: 3,
        name: "Marina Walk Residences",
        image: "/assets/img_ext_2.png",
        seller: "James Wilson",
        change: "+12%",
        fractions: "15/80",
        price: "$300K",
        currentValue: "$336K",
    },
    {
        id: 4,
        name: "Downtown Dubai",
        image: "/assets/img_ext_0.jpeg",
        seller: "Emily Rodriguez",
        change: "+16%",
        fractions: "30/120",
        price: "$450K",
        currentValue: "$522K",
    },
    {
        id: 5,
        name: "Arabian Ranches Villa",
        image: "/assets/img_ext_5.png",
        seller: "David Kim",
        change: "+10%",
        fractions: "8/40",
        price: "$160K",
        currentValue: "$176K",
    },
    {
        id: 6,
        name: "Business Bay Corporate",
        image: "/assets/img_ext_1.jpeg",
        seller: "Anna Martinez",
        change: "+15%",
        fractions: "20/100",
        price: "$400K",
        currentValue: "$460K",
    },
    {
        id: 7,
        name: "Jumeirah Beach",
        image: "/assets/img_ext_0.jpeg",
        seller: "Robert Lee",
        change: "+11.7%",
        fractions: "12/60",
        price: "$240K",
        currentValue: "$268K",
    },
    {
        id: 8,
        name: "Dubai Creek Harbor",
        image: "/assets/img_ext_1.jpeg",
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
        <div className="p-4 sm:p-6 lg:p-10 bg-black min-h-screen text-white font-sans">
            <div className="max-w-[1400px] mx-auto">

                <header className="mb-8">
                    <h1 className="text-[32px] font-bold mb-2 font-Montserrat">Secondary Marketplace</h1>
                    <p className="text-lg text-[#A4A7AE] mb-6 font-Montserrat">Browse properties relisted by investors. All fractions available for immediate purchase.</p>

                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-[#444]" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search properties by name or location..."
                            className="w-full bg-[#0D1411] border border-[#FFFFFF0A] rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00FFCD33] transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>


                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="bg-[#0D1411] border border-[#FFFFFF0A] rounded-lg p-5 relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] text-[#767676] uppercase tracking-[0.1em] font-bold">{stat.label}</span>
                                <div className="w-8 h-8 rounded-md bg-[#00FFCD10] flex items-center justify-center">
                                    <stat.icon className="w-4 h-4 text-[#00FFCD]" />
                                </div>
                            </div>
                            <div className="mb-1">
                                <span className="text-3xl font-bold">{stat.value}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-[#00FFCD] font-medium">{stat.change}</span>
                            </div>
                        </div>
                    ))}
                </section>


                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2 p-1 bg-[#0D1411] rounded-md border border-[#FFFFFF0A]">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2 rounded-md text-xs font-medium transition-all ${activeFilter === filter
                                    ? "bg-[#00F4C4] text-black"
                                    : "text-[#767676] hover:text-white"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#0D1411] border border-[#FFFFFF0A] rounded-xl text-xs font-bold text-[#767676] hover:text-white transition-colors">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M1.5 3H14.5V4.5H1.5V3ZM4 7H12V8.5H4V7ZM6.5 11H9.5V12.5H6.5V11Z" />
                            </svg>
                        </button>
                        <button className="flex items-center gap-3 px-6 py-2 bg-[#0D1411] border border-[#FFFFFF0A] rounded-xl text-xs font-bold">
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
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
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


                <section className="bg-[#0D1411] border border-[#FFFFFF0A] rounded-3xl p-8 flex flex-col sm:flex-row items-start gap-6">
                    <div className="w-12 h-12 rounded-full bg-[#00F4C41A] flex items-center justify-center flex-shrink-0">
                        <AboutIcon className="w-3 h-3 text-[#050505]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-3">About Secondary Marketplace</h2>
                        <p className="text-sm text-[#767676] leading-relaxed max-w-4xl font-Montserrat">
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
            className="group bg-[#0D1411] border border-[#FFFFFF0A] rounded-[32px] overflow-hidden flex flex-col hover:border-[#00FFCD33] transition-all duration-300"
        >

            <div className="relative h-48 overflow-hidden">
                <Image
                    src={asset.image}
                    alt={asset.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 rounded-full bg-[#00FFCD]/90 backdrop-blur-md text-black text-[11px] font-bold flex items-center gap-1 shadow-lg">

                        {asset.change}
                    </div>
                </div>
                <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full pr-4 border border-white/10">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00FFCD] to-[#009976] flex items-center justify-center text-[10px] font-bold text-black border border-white/20">
                            {asset.seller.charAt(0)}
                        </div>
                        <span className="text-[11px] font-medium text-white">{asset.seller}</span>
                    </div>
                </div>
            </div>


            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-6 truncate">{asset.name}</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#050B08] rounded-[24px] p-5 flex flex-col justify-between min-h-[90px]">
                        <p className="text-[11px] text-[#444] uppercase tracking-wider font-bold">Fractions</p>
                        <p className="text-md font-bold text-white">{asset.fractions}</p>
                    </div>
                    <div className="bg-[#050B08] rounded-[24px] p-5 flex flex-col justify-between min-h-[90px]">
                        <p className="text-[11px] text-[#444] uppercase tracking-wider font-bold">Price</p>
                        <p className="text-md font-bold text-white">{asset.price}</p>
                    </div>
                    <div className="col-span-2 bg-[#00F4C40D] rounded-[24px] p-6 flex flex-col justify-between min-h-[110px]">
                        <p className="text-[11px] text-[#A4A7AE] uppercase tracking-wider font-bold">Current Value</p>
                        <p className="text-md font-bold text-[#00FFCD]">{asset.currentValue}</p>
                    </div>
                </div>

                <div className="mt-auto space-y-4">
                    <button
                        onClick={onBuy}
                        className="w-full py-3 rounded-md bg-[#00F4C4] text-black text-base font-bold hover:bg-[#00e6b8] transition-all duration-300 shadow-[0_0_20px_rgba(0,255,205,0.2)]"
                    >
                        Buy Fractions
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-4 rounded-[20px] bg-[#FFFFFF0A] text-xs font-bold text-white hover:bg-[#FFFFFF0A] transition-colors">
                            <EyeOpenIcon className="w-4 h-4 opacity-70" />
                            View
                        </button>
                        <button className="flex items-center justify-center gap-2 py-4 rounded-[20px] bg-[#FFFFFF0A] text-xs font-bold text-white hover:bg-[#FFFFFF0A] transition-colors">
                            <DownloadIcon />
                            Info
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
