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
    const [saleTypeFilter, setSaleTypeFilter] = useState<'FRACTIONAL' | 'WHOLE'>('FRACTIONAL');
    const [activeCategory, setActiveCategory] = useState("All");
    const [countryFilter, setCountryFilter] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [countryIsoCode, setCountryIsoCode] = useState("");
    const [stateIsoCode, setStateIsoCode] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const router = useRouter();

    const apiCategory = activeCategory === "All" ? undefined : CATEGORY_MAP[activeCategory];
    const { data: assetsData, isLoading, isError } = useGetAssetsQuery({
        category: apiCategory,
        country: countryFilter || undefined,
        state: stateFilter || undefined,
        city: cityFilter || undefined,
        saleType: saleTypeFilter
    });

    const allAssets = assetsData?.data || [];
    const assets = searchQuery.trim()
        ? allAssets.filter((a) => a.title?.toLowerCase().includes(searchQuery.toLowerCase()))
        : allAssets;

    const handleCardClick = (id) => {
        router.push(`/dashboard/investor/marketplace/${id}`);
    };

    useEffect(() => {

    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)]">
            <style>{DROPDOWN_STYLES}</style>

            <div className="max-w-6xl mx-auto mb-4">
                <InvestorBanners />
            </div>

            {/* Marketplace Mode Toggle */}
            <div className="flex max-w-6xl mx-auto border-b border-[var(--sidebar-border)] mb-6">
                <button
                    onClick={() => setSaleTypeFilter('FRACTIONAL')}
                    className={`pb-3 px-6 text-sm font-extrabold tracking-wide uppercase transition-all relative cursor-pointer border-0 bg-transparent ${
                        saleTypeFilter === 'FRACTIONAL'
                            ? 'text-[var(--sidebar-active-text)]'
                            : 'text-[var(--color-text-muted)] hover:text-[var(--header-text)]'
                    }`}
                >
                    Fractional Marketplace
                    {saleTypeFilter === 'FRACTIONAL' && (
                        <motion.div
                            layoutId="activeMarketplaceTab"
                            className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--sidebar-active-text)]"
                        />
                    )}
                </button>
                <button
                    onClick={() => setSaleTypeFilter('WHOLE')}
                    className={`pb-3 px-6 text-sm font-extrabold tracking-wide uppercase transition-all relative cursor-pointer border-0 bg-transparent ${
                        saleTypeFilter === 'WHOLE'
                            ? 'text-[var(--sidebar-active-text)]'
                            : 'text-[var(--color-text-muted)] hover:text-[var(--header-text)]'
                    }`}
                >
                    Whole Asset Marketplace
                    {saleTypeFilter === 'WHOLE' && (
                        <motion.div
                            layoutId="activeMarketplaceTab"
                            className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--sidebar-active-text)]"
                        />
                    )}
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-5 p-6 sm:p-8 relative z-20 shadow-sm"
                style={{
                    borderRadius: '24px',
                    border: '1px solid var(--marketplace-card-border)',
                    background: 'var(--marketplace-feature-card-bg)',
                }}
            >
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                    <div>
                        <h1
                            className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-1"
                            style={{
                                background: 'var(--marketplace-hero-text)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Discover Assets
                        </h1>
                        <div className="text-xs sm:text-sm text-[var(--marketplace-text-muted)] font-montserrat font-normal leading-relaxed max-w-md">
                            Institutional-grade real estate. Digitally simplified.
                            {saleTypeFilter === 'FRACTIONAL' ? (
                                <p> Invest fractionally starting from {currency.symbol}10,000.</p>
                            ) : (
                                <p> Buy complete institutional assets as a single whole transaction.</p>
                            )}
                        </div>
                    </div>


                    <div className="relative w-full sm:w-72 lg:w-80 flex-shrink-0">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sidebar-active-text)] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search properties..."
                            className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-[var(--field-surface)] border border-[var(--sidebar-border)] text-[var(--marketplace-text-primary)] placeholder-[var(--marketplace-text-muted)] focus:outline-none focus:border-[var(--sidebar-active-text)]/50 focus:ring-2 focus:ring-[var(--sidebar-active-text)]/15 transition-all duration-200 font-montserrat"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--marketplace-text-muted)] hover:text-[var(--marketplace-text-primary)] transition-colors flex items-center justify-center"
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>


                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border ${activeCategory === cat
                                ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border-[var(--sidebar-active-bg)] scale-[1.04] shadow-sm"
                                : "bg-transparent text-[var(--sidebar-text)] border-[var(--sidebar-border)] hover:border-[var(--sidebar-active-text)]/40 hover:text-[var(--sidebar-active-text)]"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>


                <div className="border-t border-[var(--sidebar-border)] my-5 opacity-60" />

                <div className="flex flex-wrap gap-3 items-center">
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
                            className="text-[11px] font-bold text-[var(--sidebar-active-text)] border border-[var(--sidebar-active-text)]/30 hover:bg-[var(--sidebar-active-text)]/10 px-3.5 py-1.5 rounded-full font-montserrat cursor-pointer transition-all duration-200"
                        >
                            ✕ Clear Filters
                        </button>
                    )}
                </div>
            </motion.div>


            {/* Result count when searching */}
            {searchQuery.trim() && !isLoading && (
                <p className="mb-4 text-xs text-[var(--marketplace-text-muted)] font-montserrat">
                    {assets.length} result{assets.length !== 1 ? 's' : ''} for &ldquo;<span className="text-[var(--sidebar-active-text)] font-semibold">{searchQuery}</span>&rdquo;
                </p>
            )}

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
                                        className="bg-[var(--marketplace-card-bg)] border border-[var(--marketplace-card-border)] rounded-[24px] overflow-hidden hover:border-[var(--sidebar-active-text)]/20 transition-colors duration-300 group cursor-pointer shadow-sm"
                                    >

                                        <div className="relative h-64 sm:h-72 overflow-hidden">
                                            <Image
                                                src={imageUrl}
                                                alt={property.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0" style={{ background: 'var(--marketplace-card-overlay)' }} />

                                            <span className="absolute bottom-3 left-3 px-3.5 py-1.5 rounded-full text-[11px] font-bold capitalize bg-[#FFFFFF] text-[#111111] shadow-md z-10 tracking-wide">
                                                {property.category.replace(/_/g, ' ').toLowerCase()}
                                            </span>

                                            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white border border-white/10 backdrop-blur-md shadow-sm z-10">
                                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor] ${property.riskRating === 'LOW'
                                                    ? 'bg-[#00DAAF] text-[#00DAAF]'
                                                    : property.riskRating === 'HIGH'
                                                        ? 'bg-[#FF5C5C] text-[#FF5C5C]'
                                                        : 'bg-[#E8940C] text-[#E8940C]'
                                                    }`} />
                                                {property.riskRating} RISK
                                            </span>

                                        </div>


                                        <div className="p-5 sm:p-6">
                                            <h3 className="text-[22px] font-extrabold text-[var(--header-text)] mb-1 leading-snug tracking-tight">{property.title}</h3>
                                            <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-[13px] mb-5 font-medium">
                                                <MapPinIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                                                {property.city && property.state ? `${property.city}, ${property.state}` : property.location}
                                            </div>

                                            {/* Valuation, Per Fraction, and Annual Return Stats Card */}
                                            <div className="bg-[#F9FAFB] dark:bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-[16px] p-4 mb-6 shadow-sm">
                                                <div className="grid grid-cols-3 divide-x divide-[var(--sidebar-border)]/65 text-center items-center">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] mb-1">Valuation</p>
                                                        <p className="text-[15px] font-extrabold text-[var(--header-text)]">{formatPrice(property.valuation, true)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] mb-1">Per Fraction</p>
                                                        <p className="text-[15px] font-extrabold text-[var(--header-text)]">{formatPrice(property.fractionPrice)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] mb-1">Annual Return</p>
                                                        <p className="text-[15px] font-extrabold text-[var(--sidebar-active-text)]">{formattedYield}%</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <div className="flex justify-between items-center mb-2 text-[12px] font-bold text-[var(--color-text-muted)]">
                                                    <span>{fundedPercentage}% funded</span>
                                                    <span>{property.availableFractions?.toLocaleString()} left</span>
                                                </div>
                                                <div className="w-full h-2.5 bg-[var(--sidebar-active-text)]/20 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full rounded-full bg-[var(--sidebar-active-text)]"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${fundedPercentage}%` }}
                                                        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                                    />
                                                </div>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCardClick(property.id);
                                                }}
                                                className="w-full py-3.5 rounded-full border-[1.5px] border-[#006D5B] bg-transparent text-sm font-extrabold uppercase tracking-wide cursor-pointer transition-colors duration-300"
                                                style={{ color: 'var(--header-text)' }}
                                            >
                                                VIEW DETAILS
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
