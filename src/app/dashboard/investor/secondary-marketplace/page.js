"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUpIcon, SearchIcon, EyeOpenIcon, DownloadIcon, AboutIcon } from "@/components/VectorImages";
import PaymentModal from "@/components/dashboard/PaymentModal";
import { useGetSecondaryListingsQuery, useBuySecondaryListingMutation, useGetMySecondaryListingsQuery, useGetSecondaryListingByIdQuery } from "@/store/api/secondaryMarketApi";
import { API_URL } from "@/constants";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function SecondaryMarketplacePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("Marketplace");
    const [activeFilter, setActiveFilter] = useState("All Properties");
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [viewingAssetId, setViewingAssetId] = useState(null);

    const { data: marketplaceResponse, isLoading: isLoadingMarketplace } = useGetSecondaryListingsQuery();
    const { data: myListingsResponse, isLoading: isLoadingMyListings } = useGetMySecondaryListingsQuery();
    const [buySecondaryListing] = useBuySecondaryListingMutation();

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/assets/marketplace/Burj.png";
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_URL}/${imagePath.replace(/^\//, '')}`;
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
                price: `$${(parseFloat(item.askPrice || 0)).toLocaleString()}`,
                currentValue: `$${(parseFloat(item.askPrice || 0)).toLocaleString()}`,
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
                price: `$${(parseFloat(item.askPrice || 0)).toLocaleString()}`,
                currentValue: `$${(parseFloat(assetObj.fractionPrice || item.askPrice || 0)).toLocaleString()}`,
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
            value: `$${(displayAssets.reduce((acc, item) => acc + (item.pricePerFraction * item.fractions || 0), 0) / 1000).toFixed(1)}K`,
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
                            className="w-full bg-[var(--search-bg)] border border-[var(--sidebar-border)] rounded-xl py-3.5 pl-14 pr-6 text-sm font-bold text-[var(--header-text)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 focus:ring-4 focus:ring-[var(--sidebar-active-text)]/5 transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>


                <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-[var(--background)] border border-[var(--sidebar-border)] rounded-md p-6 relative overflow-hidden group hover:border-[var(--sidebar-active-text)]/30 hover:shadow-xl transition-all duration-500">
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


                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-2 p-1 bg-[var(--background)] rounded-xl border border-[var(--sidebar-border)] shadow-sm">
                        {["Marketplace", "My Listings"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 rounded-lg text-[12px] font-bold transition-all duration-300 border-0 cursor-pointer ${activeTab === tab
                                    ? "bg-[var(--color-primary-300)] text-black shadow-sm"
                                    : "text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:bg-[var(--sidebar-active-bg)]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-[var(--background)] rounded-xl border border-[var(--sidebar-border)] overflow-x-auto max-w-full no-scrollbar shadow-sm">
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
                        <div className="col-span-full flex flex-col items-center justify-center p-20 bg-[var(--background)] border border-dashed border-[var(--sidebar-border)] rounded-3xl text-center">
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
                    asset={selectedAsset}
                    onProcessPayment={async () => {
                        try {
                            const fractions = selectedAsset?.fractions ? parseFloat(selectedAsset.fractions) : 1;
                            console.log("Buying listing", selectedAsset.id, "with fractions", fractions);
                            const result = await buySecondaryListing({ id: selectedAsset.id, fractions }).unwrap();
                            console.log("Purchase result:", result);
                            return true;
                        } catch (err) {
                            console.error("Failed to buy fractions:", err);
                            const errorMessage = err?.data?.message || err?.message || JSON.stringify(err) || "Unknown error occurred";
                            alert("Failed to purchase: " + errorMessage);
                            return false;
                        }
                    }}
                />

                <DetailModal
                    id={viewingAssetId}
                    onClose={() => setViewingAssetId(null)}
                    onBuy={handleBuyFractions}
                />


                <section className="bg-[var(--background)] border border-[var(--sidebar-border)] rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-lg relative overflow-hidden">
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
            className="group bg-[var(--background)] border border-[var(--sidebar-border)] rounded-2xl overflow-hidden flex flex-col hover:border-[var(--sidebar-active-text)]/30 hover:shadow-xl transition-all duration-700 h-full shadow-md"
        >

            <div className="relative h-56 overflow-hidden">
                <Image
                    src={asset.image}
                    alt={asset.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
                <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 rounded-full bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] text-[10px] font-bold flex items-center gap-1.5 shadow-lg ring-1 ring-white/10 backdrop-blur-sm">
                        <TrendingUpIcon className="w-3.5 h-3.5" />
                        {asset.change}
                    </div>
                </div>
                <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2.5 p-1 bg-[var(--background)]/80 backdrop-blur-xl rounded-full pr-4 border border-white/10 shadow-lg ring-1 ring-black/5 hover:bg-[var(--background)] transition-colors duration-300">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary-300)] to-[var(--color-primary-500)] flex items-center justify-center text-[9px] font-bold text-black border border-white shadow-sm">
                            {asset.seller.charAt(0)}
                        </div>
                        <span className="text-[10px] font-bold text-[var(--header-text)] tracking-wider uppercase">{asset.seller}</span>
                    </div>
                </div>
                {isOwnListing && (
                    <div className="absolute top-4 left-4">
                        <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-lg ${asset.status === 'LISTED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                            asset.status === 'PENDING_APPROVAL' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                            }`}>
                            {asset.status.replace('_', ' ')}
                        </div>
                    </div>
                )}
            </div>


            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-6 text-[var(--header-text)] leading-tight group-hover:text-[var(--sidebar-active-text)] transition-colors duration-500 min-h-[2.5rem] line-clamp-2 uppercase tracking-tight">{asset.name}</h3>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-[var(--background)] border border-[var(--sidebar-border)] rounded-xl p-4 flex flex-col justify-between min-h-[80px] shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">Fractions</p>
                        <p className="text-base font-bold text-[var(--header-text)]">{asset.fractions}</p>
                    </div>
                    <div className="bg-[var(--background)] border border-[var(--sidebar-border)] rounded-xl p-4 flex flex-col justify-between min-h-[80px] shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">Price</p>
                        <p className="text-base font-bold text-[var(--header-text)]">{asset.price}</p>
                    </div>
                    <div className="col-span-2 bg-[var(--badge-bg)] border border-[var(--sidebar-active-text)]/20 rounded-xl p-5 flex flex-col justify-between min-h-[90px] shadow-inner">
                        <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold opacity-60">Current Marketplace Value</p>
                        <p className="text-xl font-bold text-[var(--sidebar-active-text)]">{asset.currentValue}</p>
                    </div>
                </div>

                <div className="mt-auto space-y-3">
                    {!isOwnListing && (
                        <button
                            onClick={onBuy}
                            className="w-full py-4 rounded-full bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] text-xs font-bold uppercase tracking-[0.2em] shadow-sm hover:opacity-90 hover:scale-[1.01] active:scale-95 transition-all duration-500 border-0 cursor-pointer"
                        >
                            Buy Fractions
                        </button>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onView}
                            className="flex items-center justify-center gap-2 py-3 rounded-full bg-[var(--background)] border border-[var(--sidebar-border)] text-[10px] font-bold text-[var(--header-text)] uppercase tracking-widest hover:bg-[var(--sidebar-active-bg)] hover:shadow-md transition-all border-0 cursor-pointer"
                        >
                            <EyeOpenIcon className="w-4 h-4 text-[var(--sidebar-active-text)]" />
                            <span>View</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 rounded-full bg-[var(--background)] border border-[var(--sidebar-border)] text-[10px] font-bold text-[var(--header-text)] uppercase tracking-widest hover:bg-[var(--sidebar-active-bg)] hover:shadow-md transition-all border-0 cursor-pointer">
                            <DownloadIcon className="w-4 h-4 text-[var(--sidebar-active-text)]" />
                            <span>Info</span>
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
                    className="bg-[var(--background)] border border-[var(--sidebar-border)] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative"
                >
                    {isLoading ? (
                        <div className="p-20 flex justify-center">
                            <div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin"></div>
                        </div>
                    ) : listing ? (
                        <div className="flex flex-col md:flex-row h-full text-[var(--sidebar-text)]">
                            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                                <Image
                                    src={listing.asset?.images?.[0] ? (listing.asset.images[0].startsWith('http') ? listing.asset.images[0] : `${API_URL}/${listing.asset.images[0].replace(/^\//, '')}`) : "/assets/marketplace/Burj.png"}
                                    alt={listing.asset?.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-1">
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
                                    <div className="bg-[var(--background)] p-4 rounded-2xl border border-[var(--sidebar-border)]">
                                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest mb-1">Price</p>
                                        <p className="text-lg font-bold text-[var(--header-text)]">${(parseFloat(listing.askPrice || 0)).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-[var(--background)] p-4 rounded-2xl border border-[var(--sidebar-border)]">
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
                                        onClick={() => onBuy({
                                            id: listing.id,
                                            name: listing.asset?.title,
                                            pricePerFraction: parseFloat(listing.askPrice || 0),
                                            fractions: listing.fractions,
                                            seller: listing.investor?.investorProfile?.fullName || "Anonymous",
                                            image: listing.asset?.images?.[0] ? (listing.asset.images[0].startsWith('http') ? listing.asset.images[0] : `${API_URL}/${listing.asset.images[0].replace(/^\//, '')}`) : "/assets/marketplace/Burj.png"
                                        })}
                                        className="w-full py-4 rounded-full bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:opacity-90 transition-all border-0 cursor-pointer"
                                    >
                                        Proceed to Purchase
                                    </button>
                                    <p className="text-[10px] text-center text-[var(--color-text-muted)] uppercase font-bold tracking-[0.2em]">Transaction secured by Glofy Escrow</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-red-500 font-bold mb-4">Listing not found</p>
                            <button onClick={onClose} className="px-6 py-2 rounded-full bg-[var(--background)] border border-[var(--sidebar-border)] text-xs font-bold text-[var(--header-text)] cursor-pointer">Close</button>
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
