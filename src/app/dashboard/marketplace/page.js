"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinIcon } from "@/components/VectorImages";

const CATEGORIES = [
    "All",
    "Dubai Skyscrapers",
    "Land Parcels",
    "Commercial Real Estate",
    "Residential",
];

const PROPERTIES = [
    {
        id: 1,
        name: "Burj Vista Tower",
        location: "Downtown Dubai, UAE",
        category: "Dubai Skyscrapers",
        image: "/assets/img_ext_0.jpeg",
        valuation: "$250.0M",
        perFraction: "$25K",
        yield: "12.5%",
        available: "3,240",
        funded: 68,
        risk: "MEDIUM",
        riskColor: "bg-yellow-500/80",
    },
    {
        id: 2,
        name: "Marina Business Hub",
        location: "Dubai Marina, UAE",
        category: "Commercial Real Estate",
        image: "/assets/img_ext_2.png",
        valuation: "$180.0M",
        perFraction: "$23K",
        yield: "9.8%",
        available: "5,600",
        funded: 30,
        risk: "LOW",
        riskColor: "bg-green-500/80",
    },
    {
        id: 3,
        name: "Palm Jumeirah Villa Estate",
        location: "Palm Jumeirah, Dubai",
        category: "Residential",
        image: "/assets/img_2.jpeg",
        valuation: "$95.0M",
        perFraction: "$19K",
        yield: "15.2%",
        available: "1,200",
        funded: 76,
        risk: "LOW",
        riskColor: "bg-green-500/80",
    },
    {
        id: 4,
        name: "Desert Oasis Resort",
        location: "Al Ain, UAE",
        category: "Land Parcels",
        image: "/assets/img_3.jpeg",
        valuation: "$120.0M",
        perFraction: "$15K",
        yield: "11.3%",
        available: "4,100",
        funded: 45,
        risk: "HIGH",
        riskColor: "bg-red-500/80",
    },
    {
        id: 5,
        name: "DIFC Innovation Tower",
        location: "DIFC, Dubai",
        category: "Dubai Skyscrapers",
        image: "/assets/img_1.jpeg",
        valuation: "$320.0M",
        perFraction: "$30K",
        yield: "8.5%",
        available: "2,800",
        funded: 55,
        risk: "MEDIUM",
        riskColor: "bg-yellow-500/80",
    },
    {
        id: 6,
        name: "Waterfront Residences",
        location: "JBR, Dubai",
        category: "Residential",
        image: "/assets/img_ext_1.jpeg",
        valuation: "$75.0M",
        perFraction: "$12K",
        yield: "14.1%",
        available: "6,200",
        funded: 22,
        risk: "LOW",
        riskColor: "bg-green-500/80",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 },
    },
};

export default function MarketplacePage() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered =
        activeCategory === "All"
            ? PROPERTIES
            : PROPERTIES.filter((p) => p.category === activeCategory);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                    Discover Premium Assets
                </h1>
                <p className="text-sm sm:text-base text-[#767676] max-w-xl">
                    Institutional-grade real estate. Digitally simplified. Invest fractionally starting from $15,000.
                </p>
            </motion.div>

            {/* Category Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex flex-wrap gap-2 mb-8"
            >
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer border ${activeCategory === cat
                                ? "bg-[#00FFCD] text-black border-[#00FFCD] shadow-[0_0_15px_rgba(0,255,205,0.3)]"
                                : "bg-transparent text-[#a0a0a0] border-white/10 hover:border-white/30 hover:text-white"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </motion.div>

            {/* Property Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                    {filtered.map((property) => (
                        <motion.div
                            key={property.id}
                            variants={cardVariants}
                            layout
                            className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#00FFCD]/20 transition-colors duration-300 group"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={property.image}
                                    alt={property.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                {/* Category Badge */}
                                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-[#0a0a0a]/80 text-[#a0a0a0] border border-white/10 backdrop-blur-sm">
                                    {property.category}
                                </span>

                                {/* Risk Badge */}
                                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white ${property.riskColor} backdrop-blur-sm`}>
                                    {property.risk}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white mb-1">{property.name}</h3>
                                <div className="flex items-center gap-1.5 text-[#767676] text-xs mb-4">
                                    <MapPinIcon className="w-3.5 h-3.5" />
                                    {property.location}
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[#767676] mb-0.5">Valuation</p>
                                        <p className="text-base font-bold text-white">{property.valuation}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[#767676] mb-0.5">Per Fraction</p>
                                        <p className="text-base font-bold text-white">{property.perFraction}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[#767676] mb-0.5">Yield</p>
                                        <p className="text-base font-bold text-[#00FFCD]">{property.yield}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[#767676] mb-0.5">Available</p>
                                        <p className="text-base font-bold text-white">{property.available}</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-[#00FFCD] to-[#009976] rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${property.funded}%` }}
                                            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-[#767676] mt-1">{property.funded}% funded</p>
                                </div>

                                {/* CTA */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00FFCD] to-[#009976] text-black font-semibold text-sm cursor-pointer border-0 transition-shadow hover:shadow-[0_0_20px_rgba(0,255,205,0.3)]"
                                >
                                    Invest Now
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
