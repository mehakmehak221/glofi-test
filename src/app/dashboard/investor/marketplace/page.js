"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinIcon } from "@/components/VectorImages";
import { CATEGORIES, PROPERTIES } from "@/data/propertyData";

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
    const router = useRouter();

    const filtered =
        activeCategory === "All"
            ? PROPERTIES
            : PROPERTIES.filter((p) => p.category === activeCategory);

    const handleCardClick = (id) => {
        router.push(`/dashboard/investor/marketplace/${id}`);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[var(--color-bg-dark)]">

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 sm:mb-8 p-4 sm:p-6 lg:p-8"
                style={{
                    borderRadius: '24px',
                    border: '0.667px solid var(--color-primary-300-alpha-10)',
                    background: 'var(--color-gradient-marketplace-hero)',
                }}
            >
                <h1
                    className="text-xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2"
                    style={{
                        background: 'var(--color-gradient-text-hero)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Discover Premium Assets
                </h1>
                <p
                    className="text-xs sm:text-base lg:text-lg max-w-xl font-montserrat text-[var(--color-text-muted)] font-normal tracking-tight"
                >
                    Institutional-grade real estate. Digitally simplified. Invest fractionally starting from $15,000.
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-5">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer border ${activeCategory === cat
                                ? "bg-[var(--color-primary-100)] text-black border-[var(--color-primary-100)]"
                                : "bg-[var(--color-bg-surface-subtle)] text-text-secondary border-[var(--color-border-muted)]"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>


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
                            onClick={() => handleCardClick(property.id)}
                            className="bg-[var(--color-bg-card-alt)] border border-[var(--color-border-subtle)] rounded-[16px] overflow-hidden hover:border-[var(--color-primary-100)]/20 transition-colors duration-300 group cursor-pointer"
                        >

                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={property.image}
                                    alt={property.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #050505 0%, rgba(0, 0, 0, 0.00) 50%, rgba(0, 0, 0, 0.00) 100%)' }} />


                                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-bg-dark)]/80 text-[var(--color-text-secondary)] border border-[var(--color-border-muted)] backdrop-blur-sm">
                                    {property.category}
                                </span>


                                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-normal uppercase tracking-wider ${property.riskTextColor} ${property.riskColor}`}>
                                    {property.risk}
                                </span>
                            </div>


                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white mb-1">{property.name}</h3>
                                <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-xs mb-4">
                                    <MapPinIcon className="w-3.5 h-3.5" />
                                    {property.location}
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Valuation</p>
                                        <p className="text-base font-bold text-white">{property.valuation}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Per Fraction</p>
                                        <p className="text-base font-bold text-white">{property.perFraction}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Yield</p>
                                        <p className="text-base font-bold text-[var(--color-primary-100)]">{property.yield}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Available</p>
                                        <p className="text-base font-bold text-white">{property.available}</p>
                                    </div>
                                </div>


                                <div className="mb-4">
                                    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-[#00FFCD] to-[#009976] rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${property.funded}%` }}
                                            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{property.funded}% funded</p>
                                </div>


                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardClick(property.id);
                                    }}
                                    className="w-full py-3 rounded-xl bg-[var(--color-primary-100)] text-black font-semibold text-sm cursor-pointer border-0 transition-shadow hover:shadow-[var(--shadow-glow-primary)]"
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
