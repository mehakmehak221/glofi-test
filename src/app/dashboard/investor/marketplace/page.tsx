"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MapPinIcon, ShareIcon } from "@/components/VectorImages";

import { InvestorBanners } from "@/components/dashboard/investor/InvestorBanners";
import { useGetAssetsQuery } from "@/store/api/assetApi";
import { CATEGORIES } from "@/data/propertyData";
import { useCurrency } from "@/providers/CurrencyProvider";
import { useI18n } from "@/providers/LocaleProvider";
import { API_URL } from "@/constants";

const CATEGORY_MAP: Record<string, string> = {
    "Dubai Skyscrapers": "DUBAI_SKYSCRAPER",
    "Land Parcels": "LAND_PARCEL",
    "Commercial Real Estate": "COMMERCIAL_REAL_ESTATE",
    "Residential": "RESIDENTIAL",
};

const RISK_OPTIONS = (t: (k: string) => string) => [
    { label: t("All Risk"), value: "" },
    { label: t("Low Risk"), value: "LOW" },
    { label: t("Medium Risk"), value: "MEDIUM" },
    { label: t("High Risk"), value: "HIGH" },
];

const SORT_OPTIONS = (t: (k: string) => string) => [
    { label: t("Newest"), value: "createdAt", order: "desc" as const },
    { label: t("Oldest"), value: "createdAt", order: "asc" as const },
    { label: t("Price: Low to High"), value: "fractionPrice", order: "asc" as const },
    { label: t("Price: High to Low"), value: "fractionPrice", order: "desc" as const },
    { label: t("Yield: High to Low"), value: "expectedYield", order: "desc" as const },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function FilterDropdown({
    options,
    value,
    onChange,
    placeholder,
}: {
    options: { label: string; value: string }[];
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const selected = options.find((o) => o.value === value);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((p) => !p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold border transition-all cursor-pointer ${value
                    ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border-[var(--sidebar-active-text)]/30"
                    : "bg-[var(--field-surface)] text-[var(--color-text-muted)] border-[var(--sidebar-border)] hover:border-[var(--sidebar-active-text)]/30 hover:text-[var(--header-text)]"
                    }`}
            >
                {selected ? selected.label : placeholder}
                <svg
                    className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 top-[calc(100%+6px)] left-0 min-w-[180px] bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md shadow-2xl overflow-hidden"
                    >
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => { onChange(opt.value); setOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer border-0 ${value === opt.value
                                    ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]"
                                    : "text-[var(--color-text-muted)] hover:bg-[var(--sidebar-bg)] hover:text-[var(--header-text)]"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function MarketplacePage() {
    const { formatPrice, currency } = useCurrency();
    const { t } = useI18n();
    const router = useRouter();

    const riskOptions = RISK_OPTIONS(t);
    const sortOptions = SORT_OPTIONS(t);

    const [saleTypeFilter, setSaleTypeFilter] = useState<"FRACTIONAL" | "WHOLE">("FRACTIONAL");
    const [activeCategory, setActiveCategory] = useState("All");
    const [riskFilter, setRiskFilter] = useState("");
    const [sortIndex, setSortIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const handleCardShare = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/assets/${id}`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const sortOpt = sortOptions[sortIndex];
    const apiCategory = activeCategory === "All" ? undefined : CATEGORY_MAP[activeCategory];

    const { data: assetsData, isLoading, isError } = useGetAssetsQuery({
        category: apiCategory,
        saleType: saleTypeFilter,
        riskRating: riskFilter || undefined,
        search: debouncedSearch || undefined,
        sortBy: sortOpt.value,
        sortOrder: sortOpt.order,
        limit: 50,
        page: 1,
    });

    const rawAssets = assetsData?.data || [];

    // Client-side search filtering
    let assets = [...rawAssets];
    if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase().trim();
        assets = assets.filter((property) => {
            return (
                property.title?.toLowerCase().includes(query) ||
                property.city?.toLowerCase().includes(query) ||
                property.state?.toLowerCase().includes(query) ||
                property.location?.toLowerCase().includes(query) ||
                property.category?.toLowerCase().includes(query) ||
                property.description?.toLowerCase().includes(query)
            );
        });
    }

    // Client-side sorting
    assets.sort((a, b) => {
        const { value: sortField, order: sortOrder } = sortOpt;

        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (sortField === "expectedYield") {
            const yieldA = parseFloat(a.expectedYield || 0) +
                parseFloat(a.expectedAnnualRent || 0) +
                parseFloat(a.rentalGrowthRate || 0) +
                parseFloat(a.expectedAppreciationRate || 0) -
                parseFloat(a.operatingCostRate || 0);
            const yieldB = parseFloat(b.expectedYield || 0) +
                parseFloat(b.expectedAnnualRent || 0) +
                parseFloat(b.rentalGrowthRate || 0) +
                parseFloat(b.expectedAppreciationRate || 0) -
                parseFloat(b.operatingCostRate || 0);
            valA = yieldA;
            valB = yieldB;
        } else if (sortField === "fractionPrice") {
            const priceA = Number(a.fractionPrice) && Number(a.fractionPrice) !== Number(a.valuation)
                ? Number(a.fractionPrice)
                : (Number(a.valuation) / (Number(a.totalFractions) || 1));
            const priceB = Number(b.fractionPrice) && Number(b.fractionPrice) !== Number(b.valuation)
                ? Number(b.fractionPrice)
                : (Number(b.valuation) / (Number(b.totalFractions) || 1));
            valA = priceA;
            valB = priceB;
        } else if (sortField === "createdAt") {
            valA = new Date(a.createdAt || 0).getTime();
            valB = new Date(b.createdAt || 0).getTime();
        } else {
            valA = Number(valA) || 0;
            valB = Number(valB) || 0;
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    const hasActiveFilters = !!(riskFilter || debouncedSearch);

    const clearAllFilters = () => {
        setRiskFilter("");
        setSearchQuery("");
        setDebouncedSearch("");
        setSortIndex(0);
        setActiveCategory("All");
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen">

            <div className="max-w-6xl mx-auto mb-6">
                <InvestorBanners />
            </div>

            <div className="max-w-6xl mx-auto mb-5">
                <h1 className="text-2xl sm:text-3xl font-black text-[var(--header-text)] tracking-tight mb-1">
                    {t("Discover Assets")}
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] font-medium">
                    {saleTypeFilter === "FRACTIONAL"
                        ? `${t("Institutional-grade real estate. Invest fractionally from")} ${currency.symbol}10,000.`
                        : t("Acquire complete institutional assets as a single whole transaction.")}
                </p>
            </div>

            {/* Sale-type pill toggle */}
            <div className="max-w-6xl mx-auto mb-6">
                <div className="inline-flex bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-md p-1 gap-1 shadow-sm relative">
                    {(["FRACTIONAL", "WHOLE"] as const).map((type) => {
                        const isSelected = saleTypeFilter === type;
                        return (
                            <button
                                key={type}
                                onClick={() => setSaleTypeFilter(type)}
                                className={`relative px-6 py-2.5 rounded-md text-xs font-bold transition-colors duration-300 cursor-pointer border-0 bg-transparent z-10 ${isSelected
                                    ? "text-[var(--sidebar-active-text)]"
                                    : "text-[var(--color-text-muted)] hover:text-[var(--header-text)]"
                                    }`}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="activeSaleType"
                                        className="absolute inset-0 bg-[var(--sidebar-active-bg)] border border-[var(--sidebar-active-text)]/15 rounded-md z-[-1] shadow-sm"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                {type === "FRACTIONAL" ? t("Fractional Real Estate") : t("Whole Properties")}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Filter bar */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl mx-auto mb-6 bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-5 sm:p-6 shadow-sm backdrop-blur-md relative z-20"
            >
                {/* Category tabs */}
                <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                    {CATEGORIES.map((cat) => {
                        const isSelected = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`relative px-4 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 cursor-pointer border-0 bg-transparent ${isSelected
                                    ? "text-[var(--sidebar-active-text)]"
                                    : "text-[var(--color-text-muted)] hover:text-[var(--header-text)]"
                                    }`}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="activeCategoryBg"
                                        className="absolute inset-0 bg-[var(--sidebar-active-bg)] border border-[var(--sidebar-active-text)]/10 rounded-md z-[-1] shadow-sm"
                                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                    />
                                )}
                                {t(cat)}
                            </button>
                        );
                    })}
                </div>

                <div className="h-px bg-gradient-to-r from-[var(--sidebar-border)]/20 via-[var(--sidebar-border)]/60 to-[var(--sidebar-border)]/20 mb-5" />

                {/* Search + dropdowns */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <svg
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sidebar-active-text)] pointer-events-none"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t("Search properties...")}
                            className="w-full pl-10 pr-9 py-2 rounded-md text-xs bg-[var(--field-surface)] border border-[var(--sidebar-border)] text-[var(--header-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--sidebar-active-text)]/50 focus:ring-1 focus:ring-[var(--sidebar-active-text)]/15 transition-all font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--header-text)]"
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <FilterDropdown
                        options={riskOptions}
                        value={riskFilter}
                        onChange={setRiskFilter}
                        placeholder={t("Risk Rating")}
                    />

                    <FilterDropdown
                        options={sortOptions.map((o, i) => ({ label: o.label, value: String(i) }))}
                        value={String(sortIndex)}
                        onChange={(v) => setSortIndex(Number(v))}
                        placeholder={t("Sort By")}
                    />

                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold text-[var(--sidebar-active-text)] border border-[var(--sidebar-active-text)]/30 hover:bg-[var(--sidebar-active-text)]/10 cursor-pointer transition-all"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {t("Clear")}
                        </button>
                    )}

                    {!isLoading && (
                        <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                            {t(assets.length === 1 ? "{count} asset" : "{count} assets", { count: assets.length })}
                        </span>
                    )}
                </div>
            </motion.div>

            {/* Asset grid */}
            <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex items-center justify-center p-16"
                        >
                            <div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin" />
                        </motion.div>
                    ) : isError ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-center p-12 text-[var(--color-text-muted)] border border-dashed border-[var(--sidebar-border)] rounded-2xl"
                        >
                            {t("Error loading assets. Please try again.")}
                        </motion.div>
                    ) : assets.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-center p-16 text-[var(--color-text-muted)] border border-dashed border-[var(--sidebar-border)] rounded-2xl"
                        >
                            <svg className="w-10 h-10 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                            </svg>
                            <p className="font-semibold">{t("No assets found")}</p>
                            <p className="text-xs mt-1">{t("Try adjusting your filters")}</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`${activeCategory}-${saleTypeFilter}-${riskFilter}-${sortIndex}`}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                        >
                            {assets.map((property) => {
                                const propertyImage = property.images?.[0];
                                const imageUrl = propertyImage
                                    ? (propertyImage.startsWith("http") ? propertyImage : `${API_URL}/${propertyImage.replace(/^\//, "")}`)
                                    : "/assets/images/content/img_ext_0.jpeg";

                                const rawYield =
                                    parseFloat(property.expectedYield || 0) +
                                    parseFloat(property.expectedAnnualRent || 0) +
                                    parseFloat(property.rentalGrowthRate || 0) +
                                    parseFloat(property.expectedAppreciationRate || 0) -
                                    parseFloat(property.operatingCostRate || 0);
                                const formattedYield = rawYield.toFixed(1);

                                const total = property.totalFractions || 1;
                                const available = property.availableFractions ?? total;
                                const fundedPct = Math.max(0, Math.min(100, Math.round(((total - available) / total) * 100)));

                                const riskColor =
                                    property.riskRating === "LOW"
                                        ? "bg-[#00DAAF] text-[#00DAAF]"
                                        : property.riskRating === "HIGH"
                                            ? "bg-[#FF5C5C] text-[#FF5C5C]"
                                            : "bg-[#E8940C] text-[#E8940C]";

                                return (
                                    <motion.div
                                        key={property.id}
                                        variants={cardVariants}
                                        layout
                                        onClick={() => router.push(`/dashboard/investor/marketplace/${property.id}`)}
                                        className="bg-[var(--marketplace-card-bg)] border border-[var(--marketplace-card-border)] rounded-md overflow-hidden hover:border-[var(--sidebar-active-text)]/25 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md"
                                    >
                                        <div className="relative h-64 sm:h-72 overflow-hidden">
                                            <Image
                                                src={imageUrl}
                                                alt={property.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0" style={{ background: "var(--marketplace-card-overlay)" }} />

                                            <span className="absolute bottom-3 left-3 px-3.5 py-1.5 rounded-full text-[11px] font-bold capitalize bg-white text-[#111] shadow-md z-10 tracking-wide">
                                                {property.category?.replace(/_/g, " ").toLowerCase()}
                                            </span>

                                            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white border border-white/10 backdrop-blur-md shadow-sm z-10">
                                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor] ${riskColor}`} />
                                                {property.riskRating} {t("RISK")}
                                            </span>

                                            <button
                                                onClick={(e) => handleCardShare(e, property.id)}
                                                className="absolute top-3 right-3 edit-icon-btn z-30 pointer-events-auto p-2 rounded-full bg-black/50 text-white hover:bg-neutral-800 transition-all border border-white/10 backdrop-blur-md shadow-sm flex items-center justify-center cursor-pointer group"
                                                aria-label="Share property"
                                            >
                                                {copiedId === property.id ? (
                                                    <span className="text-[10px] font-bold px-1.5 text-[#00DAAF]">{t("Copied!")}</span>
                                                ) : (
                                                    <ShareIcon className="w-4 h-4 text-white group-hover:text-[#00DAAF] transition-colors" />
                                                )}
                                            </button>
                                        </div>

                                        <div className="p-5 sm:p-6">
                                            <h3 className="text-[22px] font-extrabold text-[var(--header-text)] mb-1 leading-snug tracking-tight">
                                                {property.title}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-[13px] mb-5 font-medium">
                                                <MapPinIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                                                {property.city && property.state
                                                    ? `${property.city}, ${property.state}`
                                                    : property.location}
                                            </div>

                                            <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-md p-4 mb-5 shadow-sm">
                                                <div className="grid grid-cols-3 divide-x divide-[var(--sidebar-border)]/65 text-center">
                                                    <div className="min-w-0 px-1">
                                                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] mb-1 truncate">{t("Valuation")}</p>
                                                        <p className="text-[13px] font-extrabold text-[var(--header-text)] break-all leading-tight">{formatPrice(property.valuation, true)}</p>
                                                    </div>
                                                    <div className="min-w-0 px-1">
                                                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] mb-1 truncate">
                                                            {property.saleType === 'WHOLE' ? t('Whole Price') : t('Per Fraction')}
                                                        </p>
                                                        <p className="text-[13px] font-extrabold text-[var(--header-text)] break-all leading-tight">
                                                            {formatPrice(
                                                                Number(property.fractionPrice) && Number(property.fractionPrice) !== Number(property.valuation)
                                                                    ? property.fractionPrice
                                                                    : (Number(property.valuation) / (Number(property.totalFractions) || 1)),
                                                                true
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="min-w-0 px-1">
                                                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] mb-1 truncate">{t("Potential Annual Return")}</p>
                                                        <p className="text-[13px] font-extrabold text-[var(--sidebar-active-text)] break-all leading-tight">{formattedYield}%</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-5">
                                                <div className="flex justify-between items-center mb-2 text-[12px] font-bold text-[var(--color-text-muted)]">
                                                    <span>{fundedPct}% {t("funded")}</span>
                                                    <span>{available?.toLocaleString()} {t("left")}</span>
                                                </div>
                                                <div className="w-full h-2 bg-[var(--sidebar-active-text)]/15 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full rounded-full bg-[var(--sidebar-active-text)]"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${fundedPct}%` }}
                                                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                                                    />
                                                </div>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/investor/marketplace/${property.id}`); }}
                                                className="w-full py-3.5 rounded-md border-[1.5px] border-[var(--sidebar-active-text)] bg-transparent text-sm font-extrabold uppercase tracking-wide cursor-pointer transition-colors duration-300 text-[var(--header-text)] hover:bg-[var(--sidebar-active-text)]/10"
                                            >
                                                {t("View Details")}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
