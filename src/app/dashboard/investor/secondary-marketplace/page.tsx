"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUpIcon, SearchIcon, AboutIcon } from "@/components/VectorImages";
import PaymentModal from "@/components/dashboard/PaymentModal";
import { useGetSecondaryListingsQuery, useGetSecondaryListingByIdQuery } from "@/store/api/secondaryMarketApi";
import { API_URL } from "@/constants";
import { useI18n } from "@/providers/LocaleProvider";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
} as const;

export default function SecondaryMarketplacePage() {
    const { t } = useI18n();
    const [activeFilter, setActiveFilter] = useState("All");
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [viewingAssetId, setViewingAssetId] = useState(null);

    const { data: marketplaceResponse, isLoading: isLoadingMarketplace } = useGetSecondaryListingsQuery(undefined);
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/assets/images/marketplace/Burj.png";
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_URL}/${imagePath.replace(/^\//, '')}`;
    };

    const formatNumber = (val) => {
        if (val == null) return "₹0";
        const num = parseFloat(val);
        if (isNaN(num)) return "₹0";
        if (num >= 1e7) return `₹${(num / 1e7).toFixed(1)} Cr`;
        if (num >= 1e5) return `₹${(num / 1e5).toFixed(1)} L`;
        if (num >= 1e3) return `₹${(num / 1e3).toFixed(1)} K`;
        return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    };

    const mapListing = (item) => {
        const isFlattened = !!item.assetTitle;

        if (isFlattened) {
            return {
                id: item.id,
                name: item.assetTitle || "Unknown Property",
                location: item.assetLocation || "N/A",
                image: getImageUrl(item.assetImages?.[0]),
                seller: "You",
                sellerId: item.ownerId || item.investorId || item.userId || "self",
                fractions: item.fractionsListed || 0,
                price: `₹${(parseFloat(item.askPrice || 0)).toLocaleString()}`,
                currentValue: `₹${(parseFloat(item.askPrice || 0)).toLocaleString()}`,
                status: item.status,
                change: "0%",
                pricePerFraction: parseFloat(item.askPrice || 0)
            };
        } else {
            const assetObj = item.asset || {};
            const investorProfile = item.investor?.investorProfile || {};
            const sellerName = investorProfile.fullName || "Anonymous";

            return {
                id: item.id,
                name: assetObj.title || "Unknown Property",
                location: assetObj.location || "N/A",
                image: getImageUrl(assetObj.images?.[0]),
                seller: sellerName,
                sellerId: item.investor?.id || item.investorId || item.id,
                fractions: item.fractions || 0,
                price: `₹${(parseFloat(item.askPrice || 0)).toLocaleString()}`,
                currentValue: `₹${(parseFloat(assetObj.fractionPrice || item.askPrice || 0)).toLocaleString()}`,
                status: item.status,
                change: `${assetObj.expectedYield || 0}%`,
                pricePerFraction: parseFloat(item.askPrice || 0)
            };
        }
    };

    const marketplaceData = Array.isArray(marketplaceResponse) ? marketplaceResponse : (marketplaceResponse?.data || []);
    const isLoading = isLoadingMarketplace;
    const allAssets = marketplaceData.map(mapListing);

    const displayAssets = useMemo(() => {
        if (activeFilter === "High ROI (15%+)") {
            return allAssets.filter((asset) => parseFloat(String(asset.change || "0")) >= 15);
        }
        if (activeFilter === "Best Value") {
            return [...allAssets].sort((a, b) => (a.pricePerFraction || 0) - (b.pricePerFraction || 0));
        }
        return allAssets;
    }, [allAssets, activeFilter]);

    const handleBuyFractions = (asset) => {
        setViewingAssetId(null);
        setSelectedAsset(asset);
        setIsPaymentModalOpen(true);
    };

    const handleViewDetail = (id) => {
        setViewingAssetId(id);
    };

    const filters = ["All", "High ROI (15%+)", "Best Value"];


    const stats = [
        { label: "Active Listings", value: displayAssets.length.toString(), change: "+3 This Week", icon: TrendingUpIcon },
        {
            label: "Market Volume",
            value: formatNumber(displayAssets.reduce((acc, item) => acc + (item.pricePerFraction * item.fractions || 0), 0)),
            change: "+8.5% Overall",
            icon: TrendingUpIcon
        },
        { label: "Average Returns", value: displayAssets.length > 0 ? "12.4%" : "0%", change: "High Performing", icon: TrendingUpIcon },
        { label: "Active Traders", value: new Set(displayAssets.map(item => item.sellerId)).size.toString(), change: "Verified Users", icon: TrendingUpIcon },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-10 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)] font-sans transition-colors duration-300">
            <div className="max-w-[1100px] mx-auto">

                <header className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-[var(--header-text)] tracking-tight">{t("Secondary Marketplace")}</h1>
                    <p className="text-sm sm:text-base text-[var(--color-text-muted)] mb-8 max-w-2xl leading-relaxed font-medium">{t("Browse property fractions relisted by investors. All assets are available for immediate purchase and transfer.")}</p>
                </header>


                <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-[var(--marketplace-card-bg)] border border-[var(--sidebar-border)] rounded-md p-4 sm:p-5 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] font-bold">{t(stat.label)}</span>
                                <div className="w-8 h-8 rounded-full bg-[var(--badge-bg)] flex items-center justify-center text-[var(--sidebar-active-text)]">
                                    <stat.icon className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-[var(--header-text)]">{stat.value}</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-full bg-[var(--search-bg)] border border-[var(--sidebar-border)]">
                                <span className="text-xs text-[var(--sidebar-text)] font-semibold">{t(stat.change)}</span>
                            </div>
                        </div>
                    ))}
                </section>


                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 overflow-x-auto max-w-full no-scrollbar">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-300 border border-[var(--sidebar-border)] cursor-pointer ${activeFilter === filter
                                    ? "bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] shadow-sm"
                                    : "bg-[var(--marketplace-card-bg)] text-[var(--marketplace-text-secondary)] hover:text-[var(--header-text)]"
                                    }`}
                            >
                                {t(filter)}
                            </button>
                        ))}
                    </div>
                </div>


                <motion.div
                    key={activeFilter}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mb-10"
                >
                    {isLoading ? (
                        <div className="col-span-full flex justify-center p-12">
                            <div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin"></div>
                        </div>
                    ) : displayAssets.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-20 bg-[var(--marketplace-card-bg)] border border-dashed border-[var(--sidebar-border)] rounded-3xl text-center">
                            <div className="w-20 h-20 rounded-full bg-[var(--badge-bg)] flex items-center justify-center mb-6">
                                <SearchIcon className="w-10 h-10 text-[var(--color-text-muted)]" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--header-text)] mb-2">{t("No active listings")}</h3>
                            <p className="text-sm text-[var(--color-text-muted)] max-w-xs">{t("There are no secondary market listings available at the moment. Check back later!")}</p>
                        </div>
                    ) : (
                        displayAssets.map((asset) => (
                            <MarketplaceCard
                                key={asset.id}
                                asset={asset}
                                onView={() => handleViewDetail(asset.id)}
                            />
                        ))
                    )}
                </motion.div>


                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    flow="secondary"
                    asset={
                        selectedAsset
                            ? {
                                listingId: selectedAsset.id,
                                name: selectedAsset.name,
                                currentValue:
                                    selectedAsset.pricePerFraction != null &&
                                        selectedAsset.fractions != null
                                        ? `₹${(
                                            selectedAsset.pricePerFraction *
                                            parseFloat(String(selectedAsset.fractions))
                                        ).toLocaleString("en-IN")}`
                                        : selectedAsset.price || selectedAsset.currentValue,
                                fractions: parseFloat(String(selectedAsset.fractions)) || 1,
                            }
                            : null
                    }
                />

                <DetailModal
                    id={viewingAssetId}
                    onClose={() => setViewingAssetId(null)}
                    onBuy={handleBuyFractions}
                />


                <section className="bg-[var(--marketplace-card-bg)] border border-[var(--sidebar-border)] rounded-md p-6 sm:p-8 flex flex-col md:flex-row items-start gap-5 shadow-lg relative overflow-hidden">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--badge-bg)] border border-[var(--sidebar-active-text)]/20 flex items-center justify-center flex-shrink-0">
                        <AboutIcon className="w-6 h-6 text-[var(--sidebar-active-text)]" />
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-bold text-[var(--header-text)] leading-tight">{t("About Secondary Marketplace")}</h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[var(--badge-bg)] text-[var(--sidebar-active-text)] border border-[var(--sidebar-active-text)]/30">{t("Live")}</span>
                        </div>
                        <p className="text-sm font-semibold text-[var(--sidebar-active-text)] mb-2">{t("Peer-to-Peer Property Fraction Trading")}</p>
                        <p className="text-sm font-medium text-[var(--color-text-muted)] leading-relaxed max-w-5xl">
                            {t("The Secondary Marketplace allows investors to buy property fractions that have been relisted by other investors. All properties shown here were previously purchased from the primary marketplace and are now available for immediate transfer. Prices may vary based on current market value and seller preferences.")}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

function MarketplaceCard({ asset, onView }) {
    const { t } = useI18n();
    return (
        <motion.div
            variants={itemVariants}
            className="group w-full sm:w-[92%] md:w-full mx-auto bg-[var(--marketplace-card-bg)] border border-[var(--marketplace-card-border)] rounded-md overflow-hidden flex flex-col transition-all duration-500 h-full shadow-[var(--marketplace-card-shadow)]"
        >
            <div className="relative h-64 sm:h-72 overflow-hidden">
                <Image
                    src={asset.image}
                    alt={asset.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0" style={{ background: 'var(--marketplace-card-overlay)' }} />

                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider text-[#D7FFF6] bg-gray-500  shadow-[0_4px_14px_rgba(0,218,175,0.25)]">
                        <TrendingUpIcon className="w-3 h-3" />
                        0.0% p.a.
                    </span>
                </div>

                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />
            </div>

            <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                <h3 className="text-[32px] font-bold text-[var(--marketplace-text-primary)] leading-tight line-clamp-1">{asset.name}</h3>
                <p className="text-sm text-[var(--marketplace-text-muted)]">Dholera</p>

                <div className="grid grid-cols-2 gap-0 border border-[var(--marketplace-card-border)] rounded-md overflow-hidden">
                    <div className="bg-[var(--card-surface)] px-3 py-2.5 border-r border-[var(--marketplace-card-border)]">
                        <p className="text-[9px] text-[var(--marketplace-text-muted)] uppercase tracking-[0.15em] font-bold mb-1">{t("Fractions")}</p>
                        <p className="text-2xl font-bold text-[var(--marketplace-text-primary)]">{asset.fractions} / {asset.fractions}</p>
                    </div>
                    <div className="bg-[var(--card-surface)] px-3 py-2.5">
                        <p className="text-[9px] text-[var(--marketplace-text-muted)] uppercase tracking-[0.15em] font-bold mb-1">{t("Ask Price")}</p>
                        <p className="text-2xl font-bold text-[var(--marketplace-text-primary)]">{asset.pricePerFraction ? `₹${asset.pricePerFraction.toFixed(2)}` : asset.price}</p>
                    </div>
                </div>

                <div className="mt-auto">
                    <button
                        onClick={onView}
                        className="w-full py-3 rounded-full text-sm font-bold uppercase tracking-wide border border-[var(--sidebar-active-text)] text-[var(--header-text)] bg-transparent hover:bg-[var(--sidebar-active-bg)] transition-colors cursor-pointer"
                    >
                        {t("View Details")}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function DetailModal({ id, onClose, onBuy }) {
    const { t } = useI18n();
    const { data: listingResponse, isLoading } = useGetSecondaryListingByIdQuery(id, { skip: !id });
    const listing = listingResponse?.data || listingResponse;

    if (!id) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
                >
                    {isLoading ? (
                        <div className="p-20 flex justify-center">
                            <div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin"></div>
                        </div>
                    ) : listing ? (
                        <div className="flex flex-col md:flex-row h-full overflow-y-auto text-[var(--sidebar-text)]">
                            <div className="w-full md:w-1/2 h-64 md:h-auto md:min-h-[400px] relative shrink-0">
                                <Image
                                    src={listing.asset?.images?.[0] ? (listing.asset.images[0].startsWith('http') ? listing.asset.images[0] : `${API_URL}/${listing.asset.images[0].replace(/^\//, '')}`) : "/assets/images/marketplace/Burj.png"}
                                    alt={listing.asset?.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6 md:p-8 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1 pr-4">
                                        <h2 className="text-2xl font-bold text-[var(--header-text)] mb-2 uppercase tracking-tight line-clamp-2">{listing.asset?.title}</h2>
                                        <p className="text-[var(--color-text-muted)] text-sm font-medium">{listing.asset?.location}</p>
                                    </div>
                                    <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full text-[var(--foreground)] opacity-60 hover:opacity-100 hover:bg-[var(--sidebar-border)] transition-all cursor-pointer border-0 bg-transparent shrink-0">
                                        <XIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-[var(--card-surface)] p-4 rounded-2xl border border-[var(--sidebar-border)]">
                                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest mb-1">{t("Price")}</p>
                                        <p className="text-lg font-bold text-[var(--header-text)]">₹{(parseFloat(listing.askPrice || 0)).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-[var(--card-surface)] p-4 rounded-2xl border border-[var(--sidebar-border)]">
                                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest mb-1">{t("Fractions")}</p>
                                        <p className="text-lg font-bold text-[var(--header-text)]">{listing.fractions}</p>
                                    </div>
                                </div>

                                <div className="mb-8 p-4 bg-[var(--badge-bg)] rounded-2xl border border-[var(--sidebar-active-text)]/10">
                                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest mb-1">{t("Seller Note")}</p>
                                    <p className="text-sm font-medium text-[var(--header-text)] italic leading-relaxed">&ldquo;{listing.notes || t("No additional notes provided by the seller.")}&rdquo;</p>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <button
                                        disabled
                                        className="w-full py-4 rounded-full bg-[var(--sidebar-border)] text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-[0.2em] shadow-lg opacity-80 cursor-not-allowed border-0"
                                    >
                                        {t("Coming Soon")}
                                    </button>
                                    <p className="text-[10px] text-center text-[var(--color-text-muted)] uppercase font-bold tracking-[0.2em]">{t("Transaction secured by Glofy Escrow")}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-red-500 font-bold mb-4">{t("Listing not found")}</p>
                            <button onClick={onClose} className="px-6 py-2 rounded-full bg-[var(--card-surface)] border border-[var(--sidebar-border)] text-xs font-bold text-[var(--header-text)] cursor-pointer">{t("Close")}</button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function XIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );
}
