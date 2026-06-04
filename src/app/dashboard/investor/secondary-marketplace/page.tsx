"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUpIcon, SearchIcon, EyeOpenIcon, DownloadIcon, AboutIcon } from "@/components/VectorImages";
import PaymentModal from "@/components/dashboard/PaymentModal";
import { useGetSecondaryListingsQuery, useGetMySecondaryListingsQuery, useGetSecondaryListingByIdQuery } from "@/store/api/secondaryMarketApi";
import { API_URL } from "@/constants";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
} as const;

export default function SecondaryMarketplacePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("Marketplace");
    const [activeFilter, setActiveFilter] = useState("All Properties");
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [viewingAssetId, setViewingAssetId] = useState(null);

    const { data: marketplaceResponse, isLoading: isLoadingMarketplace } = useGetSecondaryListingsQuery(undefined);
    const { data: myListingsResponse, isLoading: isLoadingMyListings } = useGetMySecondaryListingsQuery();
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
    const myListingsData = myListingsResponse?.data || [];

    const rawData = activeTab === "Marketplace" ? marketplaceData : myListingsData;
    const isLoading = activeTab === "Marketplace" ? isLoadingMarketplace : isLoadingMyListings;

    const displayAssets = rawData.map(mapListing).filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBuyFractions = (asset) => {
        setViewingAssetId(null);
        setSelectedAsset(asset);
        setIsPaymentModalOpen(true);
    };

    const handleViewDetail = (id) => {
        setViewingAssetId(id);
    };

    const filters = ["All Properties", "High ROI (15%+)", "Best Value"];


    const stats = [
        { label: "Total Listings", value: displayAssets.length.toString(), change: "Active listings", icon: TrendingUpIcon },
        {
            label: "Total Value",
            value: formatNumber(displayAssets.reduce((acc, item) => acc + (item.pricePerFraction * item.fractions || 0), 0)),
            change: "Market volume",
            icon: TrendingUpIcon
        },
        { label: "Active Sellers", value: new Set(displayAssets.map(item => item.sellerId)).size.toString(), change: "Verified investors", icon: TrendingUpIcon },
        { label: "Avg Yield", value: displayAssets.length > 0 ? "12.4%" : "0%", change: "Property average", icon: TrendingUpIcon },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-10 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)] font-sans transition-colors duration-300">
            <div className="max-w-[1400px] mx-auto">

                <header className="mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-[var(--header-text)] tracking-tight">Secondary Marketplace</h1>
                    <p className="text-sm sm:text-base text-[var(--color-text-muted)] mb-8 max-w-2xl leading-relaxed font-medium">Browse property fractions relisted by investors. All assets are available for immediate purchase and transfer.</p>

                    <div className="relative max-w-md w-full group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-[var(--color-text-muted)] group-focus-within:text-[var(--sidebar-active-text)] transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search properties by name..."
                            className="w-full bg-[var(--search-bg)] border border-[var(--sidebar-border)] rounded-md py-3.5 pl-14 pr-6 text-sm font-bold text-[var(--header-text)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 focus:ring-4 focus:ring-[var(--sidebar-active-text)]/5 transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>


                <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-[var(--marketplace-card-bg)] border border-[var(--sidebar-border)] rounded-md p-6 relative overflow-hidden group hover:border-[var(--sidebar-active-text)]/30 hover:shadow-xl transition-all duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] font-bold">{stat.label}</span>
                                <div className="w-10 h-10 rounded-xl bg-[var(--badge-bg)] flex items-center justify-center text-[var(--sidebar-active-text)] shadow-sm group-hover:scale-110 transition-transform">
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="text-2xl sm:text-3xl font-bold text-[var(--header-text)]">{stat.value}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className="text-xs text-[var(--sidebar-active-text)] font-bold">{stat.change}</span>
                            </div>
                        </div>
                    ))}
                </section>


                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 w-full">
                    <div className="flex items-center gap-2 p-1 bg-[var(--marketplace-card-bg)] rounded-xl border border-[var(--sidebar-border)] shadow-sm w-full md:w-auto overflow-x-auto no-scrollbar">
                        {["Marketplace", "My Listings"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 rounded-lg text-[12px] font-bold transition-all duration-300 border-0 cursor-pointer whitespace-nowrap ${activeTab === tab
                                    ? "bg-[var(--color-primary-300)] text-black shadow-sm"
                                    : "text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:bg-[var(--sidebar-active-bg)]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-[var(--marketplace-card-bg)] rounded-xl border border-[var(--sidebar-border)] overflow-x-auto max-w-full no-scrollbar shadow-sm">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all duration-300 border-0 cursor-pointer ${activeFilter === filter
                                    ? "bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] shadow-sm"
                                    : "text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:bg-[var(--sidebar-active-bg)]"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>


                <motion.div
                    key={activeTab}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-16"
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
                            <h3 className="text-xl font-bold text-[var(--header-text)] mb-2">No active listings</h3>
                            <p className="text-sm text-[var(--color-text-muted)] max-w-xs">There are no secondary market listings available at the moment. Check back later!</p>
                        </div>
                    ) : (
                        displayAssets.map((asset) => (
                            <MarketplaceCard
                                key={asset.id}
                                asset={asset}
                                onBuy={() => handleBuyFractions(asset)}
                                onView={() => handleViewDetail(asset.id)}
                                isOwnListing={activeTab === "My Listings"}
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


                <section className="bg-[var(--marketplace-card-bg)] border border-[var(--sidebar-border)] rounded-md p-8 sm:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--sidebar-active-text)]/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                    <div className="w-14 h-14 rounded-2xl bg-[var(--badge-bg)] border border-[var(--sidebar-active-text)]/20 flex items-center justify-center flex-shrink-0 shadow-md relative z-10">
                        <AboutIcon className="w-6 h-6 text-[var(--sidebar-active-text)]" />
                    </div>
                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-xl font-bold mb-3 text-[var(--header-text)] uppercase tracking-widest">About Secondary Marketplace</h2>
                        <p className="text-sm font-medium text-[var(--color-text-muted)] leading-relaxed max-w-5xl">
                            The Secondary Marketplace allows investors to buy property fractions that have been relisted by other investors. All properties shown here were previously purchased from the primary marketplace and are now available for immediate transfer. Prices may vary based on current market value and seller preferences.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

function MarketplaceCard({ asset, onBuy, onView, isOwnListing }) {
    return (
        <motion.div
            variants={itemVariants}
            className="group bg-[var(--marketplace-card-bg)] border border-[var(--marketplace-card-border)] rounded-md overflow-hidden flex flex-col transition-all duration-500 h-full shadow-[var(--marketplace-card-shadow)] hover:border-[var(--sidebar-active-text)]/25 hover:shadow-2xl hover:-translate-y-0.5"
        >
            {/* Image Section */}
            <div className="relative h-52 overflow-hidden">
                <Image
                    src={asset.image}
                    alt={asset.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0" style={{ background: 'var(--marketplace-card-overlay)' }} />

                {/* Yield badge — top right */}
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-[#B8FFF0] bg-[#041512] border border-[#00DAAF]/70 shadow-sm backdrop-blur-sm">
                        <TrendingUpIcon className="w-3 h-3" />
                        {asset.change}
                    </span>
                </div>

                {/* Status badge — top left (own listings only) */}
                {isOwnListing && (
                    <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm ${
                            asset.status === 'LISTED'
                                ? 'bg-[#041512] text-[#B8FFF0] border border-[#00DAAF]/70'
                                : asset.status === 'PENDING_APPROVAL'
                                    ? 'bg-[#1a1206] text-[#FFD699] border border-[#E8940C]/80'
                                    : 'bg-[#111] text-[#9CA3AF] border border-white/10'
                        }`}>
                            {asset.status.replace('_', ' ')}
                        </span>
                    </div>
                )}

                {/* Seller pill — bottom left */}
                <div className="absolute bottom-3 left-3">
                    <div className="flex items-center gap-2 pl-1 pr-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                        <div className="w-5 h-5 rounded-full bg-[var(--color-primary-200)] flex items-center justify-center text-[9px] font-bold text-black ring-1 ring-[var(--color-primary-300)]/40">
                            {asset.seller.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-semibold text-white/90 tracking-wide">{asset.seller}</span>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-5 flex flex-col flex-1 gap-4">

                {/* Property name */}
                <h3 className="text-[15px] font-bold text-[var(--marketplace-text-primary)] leading-snug line-clamp-1 group-hover:text-[var(--sidebar-active-text)] transition-colors duration-300">
                    {asset.name}
                </h3>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[var(--card-surface)] border border-[var(--marketplace-card-border)] rounded-md px-3 py-2.5">
                        <p className="text-[9px] text-[var(--marketplace-text-muted)] uppercase tracking-[0.15em] font-bold mb-1">Fractions</p>
                        <p className="text-sm font-bold text-[var(--marketplace-text-primary)]">{asset.fractions}</p>
                    </div>
                    <div className="bg-[var(--card-surface)] border border-[var(--marketplace-card-border)] rounded-md px-3 py-2.5">
                        <p className="text-[9px] text-[var(--marketplace-text-muted)] uppercase tracking-[0.15em] font-bold mb-1">Ask Price</p>
                        <p className="text-sm font-bold text-[var(--marketplace-text-primary)]">{asset.price}</p>
                    </div>
                </div>

                {/* Current Value — accent highlight */}
                <div className="flex items-center justify-between px-3 py-2.5 rounded-md bg-[var(--badge-bg)] border border-[var(--sidebar-active-text)]/10">
                    <span className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.15em] font-bold">Current Value</span>
                    <span className="text-sm font-bold text-[var(--color-primary-200)]">{asset.currentValue}</span>
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-2.5">
                    {!isOwnListing && (
                        <button
                            disabled
                            className="w-full py-2.5 rounded-md text-[11px] font-bold uppercase tracking-widest cursor-not-allowed border-0"
                            style={{
                                background: 'var(--marketplace-card-border)',
                                color: 'var(--marketplace-text-muted)',
                                opacity: 0.7
                            }}
                        >
                            Coming Soon
                        </button>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={onView}
                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[11px] font-semibold transition-all duration-200 cursor-pointer border-0 bg-[var(--btn-mint-bg)] text-[var(--btn-mint-text)] hover:opacity-90"
                        >
                            <EyeOpenIcon className="w-3.5 h-3.5" />
                            View
                        </button>
                        <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[11px] font-semibold transition-all duration-200 cursor-pointer border border-[var(--marketplace-card-border)] bg-transparent text-[var(--marketplace-text-secondary)] hover:text-[var(--marketplace-text-primary)] hover:border-[var(--sidebar-active-text)]/30">
                            <DownloadIcon className="w-3.5 h-3.5" />
                            Info
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function DetailModal({ id, onClose, onBuy }) {
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
                                    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-2">
                                        <XIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-[var(--card-surface)] p-4 rounded-2xl border border-[var(--sidebar-border)]">
                                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest mb-1">Price</p>
                                        <p className="text-lg font-bold text-[var(--header-text)]">₹{(parseFloat(listing.askPrice || 0)).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-[var(--card-surface)] p-4 rounded-2xl border border-[var(--sidebar-border)]">
                                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest mb-1">Fractions</p>
                                        <p className="text-lg font-bold text-[var(--header-text)]">{listing.fractions}</p>
                                    </div>
                                </div>

                                <div className="mb-8 p-4 bg-[var(--badge-bg)] rounded-2xl border border-[var(--sidebar-active-text)]/10">
                                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest mb-1">Seller Note</p>
                                    <p className="text-sm font-medium text-[var(--header-text)] italic leading-relaxed">"{listing.notes || "No additional notes provided by the seller."}"</p>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <button
                                        disabled
                                        className="w-full py-4 rounded-full bg-[var(--sidebar-border)] text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-[0.2em] shadow-lg opacity-80 cursor-not-allowed border-0"
                                    >
                                        Coming Soon
                                    </button>
                                    <p className="text-[10px] text-center text-[var(--color-text-muted)] uppercase font-bold tracking-[0.2em]">Transaction secured by Glofy Escrow</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-red-500 font-bold mb-4">Listing not found</p>
                            <button onClick={onClose} className="px-6 py-2 rounded-full bg-[var(--card-surface)] border border-[var(--sidebar-border)] text-xs font-bold text-[var(--header-text)] cursor-pointer">Close</button>
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
