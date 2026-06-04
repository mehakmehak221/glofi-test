"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Navbar from "@/components/sections/Navbar/Navbar";
import { useGetAssetsQuery } from "@/store/api/assetApi";
import { CATEGORIES } from "@/data/propertyData";
import { Country, State, City } from "country-state-city";
import { API_URL } from "@/constants";
import { MapPinIcon, TrendingUpIcon, VerifiedIcon, SecondaryMarketplaceIcon } from "@/components/VectorImages";
import Link from "next/link";

import { useCurrency } from "@/providers/CurrencyProvider";

const DROPDOWN_STYLES = `
  .dropdown-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .dropdown-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .dropdown-scroll::-webkit-scrollbar-thumb {
    background: var(--sidebar-border);
    border-radius: 10px;
  }
  .dropdown-scroll::-webkit-scrollbar-thumb:hover {
    background: var(--sidebar-active-text);
  }
`;

function PillDropdown({ label, options, value, onChange, placeholder, disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`flex flex-col gap-1.5 relative ${isOpen ? 'z-30' : 'z-10'}`} ref={dropdownRef}>
            <label className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold px-1 font-Montserrat">{label}</label>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`flex justify-between items-center bg-[var(--color-bg-card)] border border-white/10 rounded-full px-4 py-1.5 text-xs font-Montserrat cursor-pointer transition-all min-w-[150px] ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/20'} ${isOpen ? 'border-white/30 shadow-sm' : ''}`}
            >
                <span className={value ? "text-white" : "text-[var(--color-text-muted)]"}>
                    {value || placeholder}
                </span>
                <svg className={`w-3 h-3 text-[var(--color-text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute z-[100] top-[calc(100%+6px)] left-0 min-w-[200px] bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="p-2 border-b border-white/5">
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-full px-3 py-1.5 text-[10px] text-white focus:outline-none font-Montserrat"
                            />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto dropdown-scroll">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <div
                                        key={opt.isoCode || opt.name}
                                        onClick={() => {
                                            onChange(opt);
                                            setIsOpen(false);
                                            setSearchTerm("");
                                        }}
                                        className={`px-4 py-2 text-[11px] font-Montserrat cursor-pointer hover:bg-white/5 hover:text-white transition-colors ${value === opt.name ? 'bg-white/10 text-white' : 'text-[var(--color-text-muted)]'}`}
                                    >
                                        {opt.name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-[10px] text-[var(--color-text-muted)] font-Montserrat text-center italic">
                                    No results found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const CATEGORY_MAP = {
    "Dubai Skyscrapers": "DUBAI_SKYSCRAPER",
    "Land Parcels": "LAND_PARCEL",
    "Commercial Real Estate": "COMMERCIAL_REAL_ESTATE",
    "Residential": "RESIDENTIAL"
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardVariants: Variants = {
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

export default function ExplorePage() {
    const { formatPrice, currency } = useCurrency();
    const [activeCategory, setActiveCategory] = useState("All");
    const [countryFilter, setCountryFilter] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [countryIsoCode, setCountryIsoCode] = useState("");
    const [stateIsoCode, setStateIsoCode] = useState("");

    const apiCategory = activeCategory === "All" ? undefined : CATEGORY_MAP[activeCategory];
    const { data: assetsData, isLoading, isError } = useGetAssetsQuery({
        category: apiCategory,
        country: countryFilter || undefined,
        state: stateFilter || undefined,
        city: cityFilter || undefined
    });

    const assets = assetsData?.data || [];

    return (
        <div className="min-h-screen bg-black text-white font-Montserrat overflow-x-hidden">
            <Navbar />
            <style>{DROPDOWN_STYLES}</style>

            <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-28 pb-12 sm:pt-36 sm:pb-16">


                <div className="flex flex-col gap-10 mb-16 bg-[var(--color-bg-card)] p-8 sm:p-10 rounded-[32px] border border-white/5 shadow-2xl backdrop-blur-xl relative z-20">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter bg-gradient-to-r from-[#00DAAF] to-[#00DAAF]/60 bg-clip-text text-transparent">
                            Discover Assets
                        </h1>
                        <p className="text-sm sm:text-base text-[var(--color-text-muted)] max-w-xl font-medium leading-relaxed">
                            Institutional-grade real estate. Digitally simplified. Invest fractionally starting from {currency.symbol}15,000.
                        </p>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="flex flex-wrap gap-3">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border ${activeCategory === cat
                                        ? "bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] border-[var(--color-primary-300)]/30 shadow-[0_0_20px_rgba(0,218,175,0.1)]"
                                        : "bg-white/5 text-[var(--color-text-muted)] border-white/10 hover:border-white/20 hover:bg-white/10"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-6 items-center border-t border-white/5 pt-8">
                            <PillDropdown
                                label="Country"
                                options={Country.getAllCountries()}
                                value={countryFilter}
                                onChange={(opt) => {
                                    setCountryIsoCode(opt.isoCode);
                                    setCountryFilter(opt.name);
                                    setStateFilter("");
                                    setCityFilter("");
                                    setStateIsoCode("");
                                }}
                                placeholder="Select Country"
                            />
                            <PillDropdown
                                label="State"
                                options={countryIsoCode ? State.getStatesOfCountry(countryIsoCode) : []}
                                value={stateFilter}
                                onChange={(opt) => {
                                    setStateIsoCode(opt.isoCode);
                                    setStateFilter(opt.name);
                                    setCityFilter("");
                                }}
                                placeholder="Select State"
                                disabled={!countryIsoCode}
                            />
                            <PillDropdown
                                label="City"
                                options={(countryIsoCode && stateIsoCode) ? City.getCitiesOfState(countryIsoCode, stateIsoCode) : []}
                                value={cityFilter}
                                onChange={(opt) => {
                                    setCityFilter(opt.name);
                                }}
                                placeholder="Select City"
                                disabled={!stateIsoCode}
                            />
                            {(countryFilter || stateFilter || cityFilter) && (
                                <button
                                    onClick={() => {
                                        setCountryFilter("");
                                        setStateFilter("");
                                        setCityFilter("");
                                        setStateIsoCode("");
                                        setCountryIsoCode("");
                                    }}
                                    className="mt-5 text-[10px] text-[var(--color-primary-300)] font-semibold hover:underline uppercase tracking-widest cursor-pointer transition-colors duration-200 hover:text-[var(--color-primary-300)]/80"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-24 gap-4">
                            <div className="w-12 h-12 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin" />
                            <p className="text-sm text-[var(--color-text-muted)] font-medium animate-pulse">Loading Institutional Assets...</p>
                        </div>
                    ) : isError ? (
                        <div className="text-center p-24 bg-[var(--color-bg-card)] rounded-[32px] border border-white/5">
                            <p className="text-[var(--color-text-muted)] mb-4">Error loading assets. Please try again later.</p>
                            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition-all">Retry</button>
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="text-center p-24 bg-[var(--color-bg-card)] rounded-[32px] border border-dashed border-white/10">
                            <p className="text-[var(--color-text-muted)] font-medium">No assets found in this category.</p>
                        </div>
                    ) : (
                        <motion.div
                            key={activeCategory}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className={
                                assets.length === 1
                                    ? "grid grid-cols-1 gap-6 sm:gap-8 max-w-lg w-full justify-items-stretch"
                                    : assets.length === 2
                                        ? "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl w-full justify-items-stretch"
                                        : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 w-full"
                            }
                        >
                            {assets.map((property) => {
                                const propertyImage = property.images?.[0];
                                const imageUrl = propertyImage
                                    ? (propertyImage.startsWith('http') ? propertyImage : `${API_URL}/${propertyImage.replace(/^\//, '')}`)
                                    : "/assets/images/content/img_ext_0.jpeg";
                                const expectedYield = parseFloat(property.expectedYield || 0);
                                const expectedAnnualRent = parseFloat(property.expectedAnnualRent || 0);
                                const rentalGrowthRate = parseFloat(property.rentalGrowthRate || 0);
                                const expectedAppreciationRate = parseFloat(property.expectedAppreciationRate || 0);
                                const operatingCostRate = parseFloat(property.operatingCostRate || 0);

                                const rawYield = expectedYield + expectedAnnualRent + rentalGrowthRate + expectedAppreciationRate - operatingCostRate;
                                const formattedYield = rawYield.toFixed(2).replace(/\.?0+$/, '');

                                const total = property.totalFractions || 1;
                                const available = property.availableFractions || 0;
                                const fundedPercentage = Math.max(0, Math.min(100, Math.round(((total - available) / total) * 100)));
                                const riskLevel = (property.riskRating || "MEDIUM").toString().toUpperCase();

                                const detailHref = `/dashboard/investor/marketplace/${property.id}`;

                                return (
                                    <motion.div
                                        key={property.id}
                                        variants={cardVariants}
                                        whileHover={{ y: -6 }}
                                        className="bg-[var(--color-bg-card)] border border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-[var(--color-primary-300)]/30 transition-all duration-500 group shadow-xl relative"
                                    >
                                        <Link
                                            href={detailHref}
                                            className="absolute inset-0 z-[1] rounded-2xl sm:rounded-3xl cursor-pointer outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-300)]"
                                            aria-label={`View details for ${property.title}`}
                                            prefetch={false}
                                        />
                                        <div className="relative z-[2] pointer-events-none flex flex-col">
                                            <div className="relative h-44 sm:h-48 md:h-52 overflow-hidden shrink-0">
                                                <Image
                                                    src={imageUrl}
                                                    alt={property.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                                                <div className="absolute top-3 left-3 flex gap-2 sm:top-4 sm:left-4">
                                                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-md ring-2 ring-black/60 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/75 text-white border border-white/20">
                                                        {property.category.replace('_', ' ')}
                                                    </span>
                                                </div>

                                                <div className="absolute top-3 right-3 z-10 sm:top-4 sm:right-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-lg ring-2 ring-black/70 ${riskLevel === "LOW"
                                                            ? "text-[#B8FFF0] bg-[#041512] border border-[#00DAAF]/80"
                                                            : riskLevel === "HIGH"
                                                                ? "text-[#FFB4B4] bg-[#1a0808] border border-[#FF5C5C]/80"
                                                                : "text-[#FFD699] bg-[#1a1206] border border-[#E8940C]/90"
                                                            }`}
                                                    >
                                                        {riskLevel} risk
                                                    </span>
                                                </div>

                                                <div className="absolute bottom-3 left-3 right-3 text-left sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 shadow-sm max-w-xl">
                                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">{property.title}</h3>
                                                    <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold">
                                                        <MapPinIcon className="w-3.5 h-3.5" />
                                                        {property.city && property.state ? `${property.city}, ${property.state}` : property.location}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 sm:p-5 pt-4">
                                                <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 mb-4 sm:mb-5 text-left items-start">
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-bold mb-1 leading-tight">
                                                            Asset valuation
                                                        </p>
                                                        <p className="text-sm sm:text-base font-black text-white tracking-tight tabular-nums leading-snug">
                                                            {formatPrice(property.valuation, true)}
                                                        </p>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-bold mb-1 leading-tight">
                                                            Entry point
                                                        </p>
                                                        <p className="text-sm sm:text-base font-black text-white tracking-tight tabular-nums leading-snug break-words">
                                                            {formatPrice(property.fractionPrice)}
                                                        </p>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-bold mb-1 leading-tight">
                                                            Potential annual return
                                                        </p>
                                                        <p className="text-sm sm:text-base font-black text-[var(--color-primary-300)] tracking-tight tabular-nums leading-snug">
                                                            {formattedYield}% p.a.
                                                        </p>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-bold mb-1 leading-tight">
                                                            Available
                                                        </p>
                                                        <p className="text-sm sm:text-base font-black text-white tracking-tight tabular-nums leading-snug">
                                                            {property.availableFractions?.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-4 sm:mb-5">
                                                    <div className="flex justify-between items-baseline gap-4 mb-1.5 sm:mb-2">
                                                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-bold leading-tight shrink-0">
                                                            Funding progress
                                                        </p>
                                                        <p className="text-[11px] sm:text-xs font-black text-[var(--color-primary-300)] tabular-nums shrink-0">
                                                            {fundedPercentage}%
                                                        </p>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                        <motion.div
                                                            className="h-full rounded-full"
                                                            style={{ background: 'linear-gradient(90deg, #00DAAF 0%, #00B28F 100%)' }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${fundedPercentage}%` }}
                                                            transition={{ delay: 0.5, duration: 1, ease: "circOut" }}
                                                        />
                                                    </div>
                                                </div>

                                                <Link
                                                    href="/sign-in"
                                                    prefetch={false}
                                                    className="relative z-[3] block pointer-events-auto w-full py-3 rounded-xl bg-white/5 text-white font-bold text-xs sm:text-sm text-center border border-white/10 transition-all duration-300 shadow-lg hover:scale-[1.01] hover:bg-[#00DAAF] hover:text-black hover:border-[var(--color-primary-300)]/50 active:scale-[0.99]"
                                                >
                                                    Start Investing
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
