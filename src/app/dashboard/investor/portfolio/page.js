"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { TrendingUpIcon, DollarIcon, TopArrow, Asset } from "@/components/VectorImages";

const STATS = [
    { label: "Invested", value: "$1.1M", change: "+$19K this month", icon: DollarIcon, color: "from-[#00FFCD] to-[#009976]" },
    { label: "Current Value", value: "$1.3M", change: "+15.2% overall", icon: TrendingUpIcon, color: "from-[#00FFCD] to-[#009976]" },
    { label: "ROI", value: "13.7%", change: "+3.1% this quarter", icon: TopArrow, color: "from-[#00FFCD] to-[#009976]" },
    { label: "Assets Owned", value: "3", change: null, icon: Asset, color: "from-[#00FFCD] to-[#009976]" },
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
    },
    {
        id: 2,
        name: "Palm Jumeirah Villa Estate",
        image: "/assets/img_2.jpeg",
        fractions: 10,
        invested: "$190K",
        value: "$214K",
        roi: "+12.4%",
    },
    {
        id: 3,
        name: "Marina Walk Residences",
        image: "/assets/img_ext_1.jpeg",
        fractions: 15,
        invested: "$300K",
        value: "$336K",
        roi: "+12%",
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
    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[#0A0F0D]">

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold text-white mb-6"
            >
                Portfolio
            </motion.h1>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
                {STATS.map((stat) => (
                    <motion.div
                        key={stat.label}
                        variants={itemVariants}
                        className="bg-[#0D1411] border border-[#FFFFFF0A] rounded-xl p-5 hover:border-[#00FFCD]/20 transition-colors duration-300"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-[#767676] uppercase tracking-wider font-medium">{stat.label}</span>
                            <div className={`w-8 h-8 rounded-lg bg-[#00DAAF1A] ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-4 h-4 text-black" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                        {stat.change && (
                            <p className="text-xs text-[#00FFCD] flex items-center gap-1">
                                <TrendingUpIcon className="w-3 h-3" />
                                {stat.change}
                            </p>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4"
            >
                {ASSETS.map((asset) => (
                    <motion.div
                        key={asset.id}
                        variants={itemVariants}
                        className="bg-[#0D1411] border border-[#FFFFFF0A] rounded-xl p-3 sm:p-5 hover:border-[#00FFCD]/20 transition-colors duration-300"
                    >
                        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-5">

                            <div className="w-full sm:w-64 lg:w-56 h-48 sm:h-36 lg:h-32 rounded-lg overflow-hidden flex-shrink-0 relative">
                                <Image
                                    src={asset.image}
                                    alt={asset.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 256px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1 w-full flex flex-col justify-center">
                                <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">{asset.name}</h3>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#767676] mb-0.5">Fractions</p>
                                        <p className="text-xs sm:text-sm font-bold text-white">{asset.fractions}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#767676] mb-0.5">Invested</p>
                                        <p className="text-xs sm:text-sm font-bold text-white">{asset.invested}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#767676] mb-0.5">Value</p>
                                        <p className="text-xs sm:text-sm font-bold text-[#00FFCD]">{asset.value}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#767676] mb-0.5">ROI</p>
                                        <p className="text-xs sm:text-sm font-bold text-[#00FFCD]">{asset.roi}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#00FFCD]/10 text-[#00FFCD] text-[10px] sm:text-xs font-semibold border border-[#00FFCD]/20 cursor-pointer hover:bg-[#00FFCD]/20 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <g clipPath="url(#clip0_80_1082)">
                                                <path d="M1.03125 6.17394C0.989582 6.06168 0.989582 5.93819 1.03125 5.82594C1.4371 4.84186 2.12601 4.00046 3.01064 3.40839C3.89527 2.81631 4.93577 2.50024 6.00025 2.50024C7.06473 2.50024 8.10524 2.81631 8.98987 3.40839C9.87449 4.00046 10.5634 4.84186 10.9693 5.82594C11.0109 5.93819 11.0109 6.06168 10.9693 6.17394C10.5634 7.15801 9.87449 7.99942 8.98987 8.59149C8.10524 9.18356 7.06473 9.49963 6.00025 9.49963C4.93577 9.49963 3.89527 9.18356 3.01064 8.59149C2.12601 7.99942 1.4371 7.15801 1.03125 6.17394Z" stroke="#00F4C4" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6 7.5C6.82843 7.5 7.5 6.82843 7.5 6C7.5 5.17157 6.82843 4.5 6 4.5C5.17157 4.5 4.5 5.17157 4.5 6C4.5 6.82843 5.17157 7.5 6 7.5Z" stroke="#00F4C4" strokeLinecap="round" strokeLinejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_80_1082">
                                                    <rect width="12" height="12" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        Certificate
                                    </motion.button>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[#A4A7AE] text-[10px] sm:text-xs font-medium hover:text-white bg-white/5 transition-colors cursor-pointer bg-transparent border-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M10.5 7.5V9.5C10.5 9.76522 10.3946 10.0196 10.2071 10.2071C10.0196 10.3946 9.76522 10.5 9.5 10.5H2.5C2.23478 10.5 1.98043 10.3946 1.79289 10.2071C1.60536 10.0196 1.5 9.76522 1.5 9.5V7.5" stroke="#A4A7AE" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3.5 5L6 7.5L8.5 5" stroke="#A4A7AE" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M6 7.5V1.5" stroke="#A4A7AE" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
