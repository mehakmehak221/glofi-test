"use client";

import { motion } from "framer-motion";
import { TrendingUpIcon, DollarIcon, CubeIcon, DownloadIcon } from "@/components/VectorImages";

const STATS = [
    { label: "Invested", value: "$1.1M", change: "+$19K this month", icon: DollarIcon, color: "from-[#00FFCD] to-[#009976]" },
    { label: "Current Value", value: "$1.3M", change: "+15.2% overall", icon: TrendingUpIcon, color: "from-[#00FFCD] to-[#009976]" },
    { label: "ROI", value: "13.7%", change: "+3.1% this quarter", icon: TrendingUpIcon, color: "from-[#00FFCD] to-[#009976]" },
    { label: "Assets Owned", value: "3", change: null, icon: CubeIcon, color: "from-[#00FFCD] to-[#009976]" },
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
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Page Title */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold text-white mb-6"
            >
                Portfolio
            </motion.h1>

            {/* Stats Grid */}
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
                        className="bg-[#111111] border border-white/[0.06] rounded-xl p-5 hover:border-[#00FFCD]/20 transition-colors duration-300"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-[#767676] uppercase tracking-wider font-medium">{stat.label}</span>
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
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

            {/* Assets List */}
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
                        className="bg-[#111111] border border-white/[0.06] rounded-xl p-4 sm:p-5 hover:border-[#00FFCD]/20 transition-colors duration-300"
                    >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Image */}
                            <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={asset.image}
                                    alt={asset.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 w-full">
                                <h3 className="text-lg font-bold text-white mb-3">{asset.name}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[#767676] mb-0.5">Fractions</p>
                                        <p className="text-sm font-bold text-white">{asset.fractions}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[#767676] mb-0.5">Invested</p>
                                        <p className="text-sm font-bold text-white">{asset.invested}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[#767676] mb-0.5">Value</p>
                                        <p className="text-sm font-bold text-white">{asset.value}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[#767676] mb-0.5">ROI</p>
                                        <p className="text-sm font-bold text-[#00FFCD]">{asset.roi}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 sm:flex-col w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00FFCD]/10 text-[#00FFCD] text-xs font-semibold border border-[#00FFCD]/20 cursor-pointer hover:bg-[#00FFCD]/20 transition-colors"
                                >
                                    ✓ Certificate
                                </motion.button>
                                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[#767676] text-xs font-medium hover:text-white hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-0">
                                    <DownloadIcon className="w-3.5 h-3.5" />
                                    Download
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
