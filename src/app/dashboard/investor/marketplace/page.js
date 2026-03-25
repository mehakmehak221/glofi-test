"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinIcon } from "@/components/VectorImages";
import { useGetAssetsQuery } from "@/store/api/assetApi";
import { useGetKycStatusQuery } from "@/store/api/kycApi";
import { CATEGORIES } from "@/data/propertyData";

import { API_URL } from "@/constants";

const CATEGORY_MAP = {
    "Dubai Skyscrapers": "DUBAI_SKYSCRAPER",
    "Land Parcels": "LAND_PARCEL",
    "Commercial Real Estate": "COMMERCIAL_REAL_ESTATE",
    "Residential": "RESIDENTIAL"
};

const formatValuation = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "N/A";
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toLocaleString()}`;
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function MarketplacePage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const router = useRouter();

    const apiCategory = activeCategory === "All" ? undefined : CATEGORY_MAP[activeCategory];
    const { data: assetsData, isLoading, isError } = useGetAssetsQuery({ category: apiCategory });

    const assets = assetsData?.data || [];

    const handleCardClick = (id) => {
        router.push(`/dashboard/investor/marketplace/${id}`);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 sm:mb-8 p-4 sm:p-6 lg:p-8"
                style={{
                    borderRadius: '24px',
                    border: '0.667px solid var(--marketplace-card-border)',
                    background: 'var(--marketplace-hero-bg)',
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
                    Discover Assets
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
                                ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border-[var(--sidebar-active-bg)]"
                                : "bg-transparent text-[var(--sidebar-text)] border-transparent hover:text-[var(--sidebar-text-hover)]"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>


            <AnimatePresence mode="wait">
                {
                    isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin" />
                        </div>
                    ) : isError ? (
                        <div className="text-center p-12 text-[var(--color-text-muted)]">
                            Error loading assets. Please try again later.
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="text-center p-12 text-[var(--color-text-muted)] border border-dashed border-[var(--color-border-subtle)] rounded-2xl">
                            No assets found in this category.
                        </div>
                    ) : (
                        <motion.div
                            key={activeCategory}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                        >
                            {assets.map((property, index) => {
                                const propertyImage = property.images?.[0];
                                const imageUrl = propertyImage
                                    ? (propertyImage.startsWith('http') ? propertyImage : `${API_URL}/${propertyImage.replace(/^\//, '')}`)
                                    : "/assets/img_ext_0.jpeg";
                                const rawYield = parseFloat(property.expectedYield || 0);
                                const formattedYield = rawYield.toFixed(2).replace(/\.?0+$/, '');

                                const total = property.totalFractions || 1;
                                const available = property.availableFractions || 0;
                                const fundedPercentage = Math.max(0, Math.min(100, Math.round(((total - available) / total) * 100)));

                                return (
                                    <motion.div
                                        key={property.id}
                                        variants={cardVariants}
                                        layout
                                        onClick={() => handleCardClick(property.id)}
                                        className="bg-[var(--marketplace-card-bg)] border border-[var(--marketplace-card-border)] rounded-[16px] overflow-hidden hover:border-[var(--sidebar-active-text)]/20 transition-colors duration-300 group cursor-pointer shadow-[var(--marketplace-card-shadow)]"
                                    >

                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={imageUrl}
                                                alt={property.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0" style={{ background: 'var(--marketplace-card-overlay)' }} />


                                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/50 text-white/90 border border-white/10 backdrop-blur-sm">
                                                {property.category.replace('_', ' ')}
                                            </span>


                                            <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-normal uppercase tracking-wider ${property.riskRating === 'LOW' ? 'text-[var(--color-status-success)] bg-[var(--color-status-success-bg)]' :
                                                property.riskRating === 'HIGH' ? 'text-[var(--color-status-error)] bg-[var(--color-status-error-bg)]' :
                                                    'text-[var(--color-status-warning)] bg-[var(--color-status-warning-bg)]'
                                                }`}>
                                                {property.riskRating}
                                            </span>
                                        </div>


                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-[var(--header-text)] mb-1 line-clamp-1">{property.title}</h3>
                                            <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-xs mb-4">
                                                <MapPinIcon className="w-3.5 h-3.5" />
                                                {property.location}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Valuation</p>
                                                    <p className="text-base font-bold text-[var(--header-text)]">{formatValuation(property.valuation)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Per Fraction</p>
                                                    <p className="text-base font-bold text-[var(--header-text)]">${Number(property.fractionPrice).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Yield</p>
                                                    <p className="text-base font-bold text-[var(--sidebar-active-text)] truncate">{formattedYield}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Available</p>
                                                    <p className="text-base font-bold text-[var(--header-text)] truncate">{property.availableFractions?.toLocaleString()}</p>
                                                </div>
                                            </div>


                                            <div className="mb-4">
                                                <div className="w-full h-1.5 bg-[var(--marketplace-card-border)] rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full rounded-full"
                                                        style={{ background: 'linear-gradient(90deg, var(--marketplace-card-progress-fill-start) 0%, var(--marketplace-card-progress-fill-end) 100%)' }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${fundedPercentage}%` }}
                                                        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-[var(--marketplace-card-progress-text)] mt-1">{fundedPercentage}% funded</p>
                                            </div>


                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCardClick(property.id);
                                                }}
                                                className="w-full py-3 rounded-xl bg-[var(--btn-mint-bg)] text-[var(--btn-mint-text)] font-semibold text-sm cursor-pointer border-0 transition-shadow hover:shadow-[var(--shadow-glow-primary)]"
                                            >
                                                Invest Now
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </div >
    );
}
