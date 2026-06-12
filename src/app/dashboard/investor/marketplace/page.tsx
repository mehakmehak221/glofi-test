"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MapPinIcon } from "@/components/VectorImages";

import { InvestorBanners } from "@/components/dashboard/investor/InvestorBanners";
import { useGetAssetsQuery } from "@/store/api/assetApi";
import { useGetKycStatusQuery } from "@/store/api/kycApi";
import { CATEGORIES } from "@/data/propertyData";
import { Country, State, City } from "country-state-city";

import { API_URL } from "@/constants";

const DROPDOWN_STYLES = `
  :root { --btn-view-color: #000000; }
  .dark { --btn-view-color: #D9F4EF; }
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
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
            <label className="text-[10px] uppercase tracking-wider text-[var(--marketplace-text-muted)] font-semibold px-1 font-montserrat">{label}</label>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`flex justify-between items-center bg-[var(--field-surface)] border border-[var(--sidebar-border)] rounded-full px-4 py-1.5 text-xs font-montserrat cursor-pointer transition-all min-w-[150px] ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[var(--sidebar-active-text)]/30'} ${isOpen ? 'border-[var(--sidebar-active-text)]/30 shadow-sm' : ''}`}
            >
                <span className={value ? "text-[var(--marketplace-text-primary)]" : "text-[var(--marketplace-text-muted)]"}>
                    {value || placeholder}
                </span>
                <svg className={`w-3 h-3 text-[var(--marketplace-text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute z-[100] top-[calc(100%+6px)] left-0 min-w-[200px] bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="p-2 border-b border-[var(--sidebar-border)]">
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-full px-3 py-1.5 text-[10px] text-[var(--marketplace-text-primary)] focus:outline-none font-montserrat"
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
                                        className={`px-4 py-2 text-[11px] font-montserrat cursor-pointer hover:bg-[var(--sidebar-active-bg)] hover:text-[var(--sidebar-active-text)] transition-colors ${value === opt.name ? 'bg-[var(--sidebar-active-text)] text-black' : 'text-[var(--marketplace-text-secondary)]'}`}
                                    >
                                        {opt.name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-[10px] text-[var(--marketplace-text-muted)] font-montserrat text-center italic">
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

import { useCurrency } from "@/providers/CurrencyProvider";

export default function MarketplacePage() {
    const { formatPrice, currency } = useCurrency();
    const [activeCategory, setActiveCategory] = useState("All");
    const [countryFilter, setCountryFilter] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [countryIsoCode, setCountryIsoCode] = useState("");
    const [stateIsoCode, setStateIsoCode] = useState("");

    const router = useRouter();

    const apiCategory = activeCategory === "All" ? undefined : CATEGORY_MAP[activeCategory];
    const { data: assetsData, isLoading, isError } = useGetAssetsQuery({
        category: apiCategory,
        country: countryFilter || undefined,
        state: stateFilter || undefined,
        city: cityFilter || undefined
    });

    const assets = assetsData?.data || [];

    const handleCardClick = (id) => {
        router.push(`/dashboard/investor/marketplace/${id}`);
    };

    useEffect(() => {

    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)]">
            <style>{DROPDOWN_STYLES}</style>

            <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
                <InvestorBanners />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 sm:mb-10 p-6 sm:p-8 lg:p-10 relative z-20 shadow-2xl"
                style={{
                    borderRadius: '24px',
                    border: '0.667px solid var(--marketplace-card-border)',
                    background: 'var(--marketplace-hero-bg)',
                }}
            >
                <h1
                    className="text-xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2"
                    style={{
                        background: 'var(--marketplace-hero-text)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Discover Assets
                </h1>
                <p
                    className="text-xs sm:text-base lg:text-lg max-w-xl font-montserrat text-[var(--marketplace-text-muted)] font-normal tracking-tight"
                >
                    Institutional-grade real estate. Digitally simplified. Invest fractionally starting from {currency.symbol}15,000.
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-5">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer border ${activeCategory === cat
                                ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border-[var(--sidebar-active-bg)]"
                                : "bg-transparent text-[var(--sidebar-text)] border-[var(--sidebar-border)] hover:text-[var(--sidebar-text-hover)] hover:border-[var(--sidebar-text-hover)]"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-4 mt-6 items-center">
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
                            className="mt-5 text-[10px] text-[var(--sidebar-active-text)] font-semibold hover:underline font-montserrat cursor-pointer transition-colors duration-200 hover:text-[var(--sidebar-active-text)]/80"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </motion.div>


            <AnimatePresence mode="wait">
                {
                    isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin" />
                        </div>
                    ) : isError ? (
                        <div className="text-center p-12 text-[var(--marketplace-text-muted)]">
                            Error loading assets. Please try again later.
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="text-center p-12 text-[var(--marketplace-text-muted)] border border-dashed border-[var(--sidebar-border)] rounded-2xl">
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

                                return (
                                    <motion.div
                                        key={property.id}
                                        variants={cardVariants}
                                        layout
                                        onClick={() => handleCardClick(property.id)}
                                        className="bg-[var(--marketplace-card-bg)] border border-[var(--marketplace-card-border)] rounded-md overflow-hidden hover:border-[var(--sidebar-active-text)]/20 transition-colors duration-300 group cursor-pointer shadow-[var(--marketplace-card-shadow)]"
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



                                            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold capitalize bg-[#FFFFFF] text-[#111111] shadow-md z-10">
                                                {property.category.replace(/_/g, ' ').toLowerCase()}
                                            </span>

                                            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider bg-black/50 text-white border border-white/10 backdrop-blur-md shadow-sm z-10">
                                                <span className={`w-2 h-2 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor] ${property.riskRating === 'LOW'
                                                    ? 'bg-[#00DAAF] text-[#00DAAF]'
                                                    : property.riskRating === 'HIGH'
                                                        ? 'bg-[#FF5C5C] text-[#FF5C5C]'
                                                        : 'bg-[#E8940C] text-[#E8940C]'
                                                    }`} />
                                                {property.riskRating}
                                            </span>

                                        </div>


                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-[var(--marketplace-text-primary)] mb-1 leading-snug">{property.title}</h3>
                                            <div className="flex items-center gap-1.5 text-[var(--marketplace-text-muted)] text-xs mb-4 font-montserrat">
                                                <MapPinIcon className="w-3.5 h-3.5" />
                                                {property.city && property.state ? `${property.city}, ${property.state}` : property.location}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-[var(--marketplace-text-muted)] mb-0.5">Valuation</p>
                                                    <p className="text-base font-bold text-[var(--marketplace-text-primary)]">{formatPrice(property.valuation, true)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-[var(--marketplace-text-muted)] mb-0.5">Per Fraction</p>
                                                    <p className="text-base font-bold text-[var(--marketplace-text-primary)]">{formatPrice(property.fractionPrice)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-[var(--marketplace-text-muted)] mb-0.5">Potential Annual Return</p>
                                                    <p className="text-base font-bold text-[var(--sidebar-active-text)]">{formattedYield}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-[var(--marketplace-text-muted)] mb-0.5">Available</p>
                                                    <p className="text-base font-bold text-[var(--marketplace-text-primary)]">{property.availableFractions?.toLocaleString()}</p>
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
                                                whileHover={{ scale: 1.02, backgroundColor: '#D9F4EF', color: '#006D5B' }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCardClick(property.id);
                                                }}
                                                className="w-full py-3 rounded-full border border-[#006D5B] bg-transparent text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors duration-300 drop-shadow-md"
                                                style={{ color: 'var(--btn-view-color)', textShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)' }}
                                            >
                                                VIEW DETAIL
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
