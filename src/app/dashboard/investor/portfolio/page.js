"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUpIcon, DollarIcon, TopArrow, Asset, ResaleIcon, DocumentIcon, DownloadIcon } from "@/components/VectorImages";
import ResaleModal from "@/components/dashboard/ResaleModal";
import { useGetInvestmentsQuery, useGetPortfolioQuery } from "@/store/api/investmentApi";
import { useGetKycStatusQuery } from "@/store/api/kycApi";
import { useGetMyCertificatesQuery } from "@/store/api/certificatesApi";
import { useGetMySecondaryListingsQuery, useDeleteSecondaryListingMutation } from "@/store/api/secondaryMarketApi";

import { API_URL } from "@/constants";


const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function PortfolioPage() {
    const [selectedAsset, setSelectedAsset] = useState(null);
    const { data: investmentsData, isLoading: invLoading } = useGetInvestmentsQuery();
    const { data: portfolioData, isLoading: portLoading } = useGetPortfolioQuery();
    const { data: kycData, isLoading: kycLoading } = useGetKycStatusQuery();
    const { data: certsData, isLoading: certsLoading } = useGetMyCertificatesQuery();
    const { data: listingsResponse, isLoading: listingsLoading } = useGetMySecondaryListingsQuery();
    const [deleteListing] = useDeleteSecondaryListingMutation();
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const isLoading = invLoading || portLoading || kycLoading || certsLoading || listingsLoading;

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-10 bg-[var(--background)] min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin" />
            </div>
        );
    }

    const investmentsArray = Array.isArray(investmentsData) ? investmentsData : (investmentsData?.data || []);
    const certsArray = Array.isArray(certsData) ? certsData : (certsData?.data || []);
    const assetsList = portfolioData?.investments || investmentsArray;
    const secondaryListings = listingsResponse?.data || [];

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const handleDeleteListing = async (id) => {
        if (!confirm("Are you sure you want to delete this listing?")) return;
        try {
            await deleteListing(id).unwrap();
            showToast("Listing deleted successfully!");
        } catch (err) {
            console.error("Delete failed:", err);
            showToast(err.data?.message || err.message || "Failed to delete listing", "error");
        }
    };

    const formatNumber = (val) => {
        if (val == null) return "$0";
        const num = parseFloat(val);
        if (isNaN(num)) return "$0";
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2).replace(/\.00$/, '')}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2).replace(/\.00$/, '')}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(2).replace(/\.00$/, '')}K`;
        return `$${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    };

    const stats = [
        { label: "Invested", value: formatNumber(portfolioData?.totalInvested), change: "+$0 this month", icon: DollarIcon },
        { label: "Current Value", value: formatNumber(portfolioData?.currentValue), change: "+0% overall", icon: TrendingUpIcon },
        { label: "ROI", value: `${portfolioData?.roi || 0}%`, change: "+0% this quarter", icon: TopArrow },
        { label: "Assets Owned", value: portfolioData?.assetsOwned || assetsList.length || 0, change: "Verified assets", icon: Asset },
    ];

    const assets = assetsList.map(inv => {
        const asset = inv.asset || {};
        const propertyImage = inv.images?.[0] || asset.images?.[0];
        const imageUrl = propertyImage
            ? (propertyImage.startsWith('http') ? propertyImage : `${API_URL}/${propertyImage.replace(/^\//, '')}`)
            : "/assets/img_ext_0.jpeg";


        const certificate = certsArray?.find(c =>
            c.investmentId === inv.id ||
            c.assetId === asset.id ||
            c.investment === inv.id ||
            c.asset === asset.id
        );
        const certUrl = certificate?.pdfUrl || certificate?.fileUrl || certificate?.url || inv.certificateUrl || asset.certificateUrl;
        const fullCertUrl = certUrl ? (certUrl.startsWith('http') ? certUrl : `${API_URL}/${certUrl.replace(/^\//, '')}`) : null;

        return {
            id: inv.id || asset.id,
            name: inv.assetTitle || asset.title || "Unknown Asset",
            image: imageUrl,
            fractions: inv.fractionsOwned || inv.fractions || 0,
            invested: formatNumber(inv.totalPaid || inv.amount || 0),
            value: formatNumber(inv.currentValue || inv.amount || 0),
            roi: `+${Number(inv.roi || 0).toFixed(2)}%`,
            isResale: inv.status === "RESALE",
            status: inv.status,
            totalFractions: inv.totalFractions || asset.totalFractions || 100,
            certificateUrl: fullCertUrl
        };
    });

    const otherAssets = assets.filter(a => !a.isResale);

    return (
        <div className="p-4 sm:p-6 lg:p-10 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)] font-sans transition-colors duration-300">
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg font-montserrat text-sm font-semibold flex items-center gap-2 ${toast.type === "success"
                            ? "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border border-[var(--color-status-success)]/20"
                            : "bg-[var(--color-status-error-bg)] text-[var(--color-status-error)] border border-[var(--color-status-error)]/20"
                            }`}
                        style={{ backdropFilter: "blur(8px)" }}
                    >
                        {toast.type === "success" ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>


            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-[32px] font-bold text-[var(--header-text)] mb-8 transition-colors"
            >
                Portfolio
            </motion.h1>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            >
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        variants={itemVariants}
                        className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-md p-6 hover:border-[var(--sidebar-active-text)]/30 transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.1em] font-bold">{stat.label}</span>
                            <div className="w-10 h-10 rounded-md bg-[var(--badge-bg)] border border-[var(--sidebar-active-text)]/10 flex items-center justify-center text-[var(--sidebar-active-text)] group-hover:scale-110 transition-transform">
                                <stat.icon className="w-5 h-5 text-[var(--sidebar-active-text)]" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--header-text)] mb-2 tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">{stat.value}</p>
                        {stat.change && (
                            <p className="text-[11px] text-[var(--sidebar-active-text)] flex items-center gap-1.5 font-medium">
                                <TrendingUpIcon className="w-3.5 h-3.5" />
                                {stat.change}
                            </p>
                        )}
                    </motion.div>
                ))}
            </motion.div>


            <div className="flex flex-col gap-12">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-xl font-bold text-[var(--header-text)]">Your Active Resale Listings</h2>
                        {secondaryListings.length > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] text-[10px] font-bold uppercase tracking-wider">
                                {secondaryListings.length} {secondaryListings.length === 1 ? 'Active' : 'Active'}
                            </span>
                        )}
                    </div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-5"
                    >
                        {secondaryListings.length > 0 ? (
                            secondaryListings.map((listing) => (
                                <SecondaryListingCard
                                    key={listing.id}
                                    item={listing}
                                    onDelete={handleDeleteListing}
                                />
                            ))
                        ) : (
                            <motion.div
                                variants={itemVariants}
                                className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-12 flex flex-col items-center justify-center text-center"
                            >
                                <ResaleIcon className="w-12 h-12 text-[var(--color-text-muted)]/20 mb-4" />
                                <h3 className="text-lg font-bold text-[var(--header-text)] mb-1">No active listings</h3>
                                <p className="text-sm text-[var(--color-text-muted)]">You don't have any properties currently listed for resale</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-[var(--header-text)] mb-6">Your Other Properties</h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-5"
                    >
                        {otherAssets.length > 0 ? (
                            otherAssets.map((asset) => (
                                <AssetCard
                                    key={asset.id}
                                    asset={asset}
                                    onResale={() => setSelectedAsset(asset)}
                                />
                            ))
                        ) : (
                            <motion.div
                                variants={itemVariants}
                                className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-12 flex flex-col items-center justify-center text-center"
                            >
                                <Asset className="w-12 h-12 text-[var(--color-text-muted)]/20 mb-4" />
                                <h3 className="text-lg font-bold text-[var(--header-text)] mb-1">No properties listed</h3>
                                <p className="text-sm text-[var(--color-text-muted)]">Find your dream investment property in the marketplace</p>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => window.location.href = '/dashboard/investor/marketplace'}
                                    className="mt-6 px-6 py-2.5 rounded-xl bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                                >
                                    Browse Marketplace
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>

            <ResaleModal
                isOpen={!!selectedAsset}
                onClose={() => setSelectedAsset(null)}
                asset={selectedAsset}
            />
        </div>
    );
}

function SecondaryListingCard({ item, onDelete }) {
    const title = item.assetTitle || item.asset?.title || item.asset?.name || "Property Listing";
    const location = item.assetLocation || item.asset?.location || "N/A";
    const propertyImage = item.assetImages?.[0] || item.asset?.images?.[0];
    const imageUrl = propertyImage?.startsWith('http') ? propertyImage : (propertyImage ? `${API_URL}/${propertyImage.replace(/^\//, '')}` : "/assets/marketplace/Burj.png");

    return (
        <motion.div
            variants={itemVariants}
            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-[var(--sidebar-active-text)]/20 transition-all duration-300 relative group"
        >
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-8">
                <div className="w-full sm:w-[280px] lg:w-[240px] h-48 sm:h-[160px] lg:h-[135px] rounded-xl overflow-hidden flex-shrink-0 relative">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, 280px"
                        className="object-cover"
                    />
                </div>

                <div className="flex-1 w-full flex flex-col justify-center">
                    <div className="flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-4 mb-5 lg:mb-4">
                        <div className="flex-1 w-full flex flex-col gap-4 sm:gap-2">
                            <div className="flex flex-row items-center justify-between sm:justify-start gap-4">
                                <h3 className="text-lg sm:text-xl font-bold text-[var(--header-text)]">{title}</h3>
                                {item.status && (
                                    <div className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${item.status === "PENDING" || item.status === "PENDING_APPROVAL" ? "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)] border-[var(--color-status-warning-border)]" :
                                        item.status === "APPROVED" || item.status === "LISTED" ? "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border border-[var(--color-status-success-border)]" :
                                            "bg-[var(--color-status-error-bg)] text-[var(--color-status-error)] border border-[var(--color-status-error-border)]"
                                        }`}>
                                        {item.status?.replace('_', ' ')}
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:block">
                                {location}
                            </p>

                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 w-full mt-2">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Fractions Listed</p>
                                    <p className="text-xs sm:text-sm font-bold text-[var(--header-text)]">{item.fractionsListed || item.fractions}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Price Per Fraction</p>
                                    <p className="text-xs sm:text-sm font-bold text-[var(--header-text)]">${Number(item.askPrice || item.pricePerFraction || 0).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Total Expected</p>
                                    <p className="text-xs sm:text-sm font-bold text-[var(--sidebar-active-text)]">
                                        ${((item.fractionsListed || item.fractions || 0) * (item.askPrice || item.pricePerFraction || 0)).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <motion.button
                            onClick={() => onDelete(item.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg bg-red-500/10 text-red-500 text-[11px] font-bold hover:bg-red-500/20 transition-all border border-red-500/20 cursor-pointer"
                        >
                            Delete Listing
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function AssetCard({ asset, onResale }) {
    const totalFractions = asset.totalFractions || 100;

    const handleOpenCertificate = () => {
        if (asset.certificateUrl) {
            window.open(asset.certificateUrl, '_blank');
        } else {
            alert("Certificate not available yet.");
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            className={`bg-[var(--sidebar-bg)] border ${asset.isResale ? 'border-[var(--sidebar-active-text)]/10' : 'border-[var(--sidebar-border)]'} rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-[var(--sidebar-active-text)]/20 transition-all duration-300 relative group`}
        >
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-8">

                <div className="w-full sm:w-[280px] lg:w-[240px] h-48 sm:h-[160px] lg:h-[135px] rounded-xl overflow-hidden flex-shrink-0 relative">
                    <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 280px"
                        className="object-cover"
                    />
                    {asset.isResale && (
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] text-[9px] font-bold uppercase tracking-wider">
                            On Sale
                        </div>
                    )}
                </div>

                <div className="flex-1 w-full flex flex-col justify-center">
                    <div className="flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-4 mb-5 lg:mb-4">
                        <div className="flex-1 w-full flex flex-col gap-4 sm:gap-2">
                            <div className="flex flex-row items-center justify-between sm:justify-start gap-4">
                                <h3 className="text-lg sm:text-xl font-bold text-[var(--header-text)]">{asset.name}</h3>
                                {asset.status && asset.status !== "COMPLETED" && !asset.isResale && (
                                    <div className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${asset.status === "PENDING" || asset.status === "UNDER_REVIEW"
                                        ? "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)] border-[var(--color-status-warning-border)]"
                                        : "bg-[var(--color-status-info-bg)] text-[var(--color-status-info)] border-[var(--color-status-info-border)]"
                                        }`}>
                                        {asset.status.replace("_", " ")}
                                    </div>
                                )}
                                {asset.isResale && (
                                    <div className="px-3 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--sidebar-active-text)]/20 flex items-center shrink-0 shadow-sm">
                                        <span className="text-[9px] text-[var(--sidebar-active-text)] font-bold uppercase tracking-wider">{asset.fractions} Listed</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 w-full">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Fractions</p>
                                    <p className="text-xs sm:text-sm font-bold text-[var(--header-text)]">{asset.fractions}/{totalFractions}</p>
                                </div>
                                <div className="block">
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Invested</p>
                                    <p className="text-xs sm:text-sm font-bold text-[var(--header-text)]">{asset.invested}</p>
                                </div>
                                <div className="block">
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Value</p>
                                    <p className="text-xs sm:text-sm font-bold text-[var(--sidebar-active-text)]">{asset.value}</p>
                                </div>
                                <div className="block">
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">ROI</p>
                                    <p className="text-xs sm:text-sm font-bold text-[var(--sidebar-active-text)]">{asset.roi}</p>
                                </div>
                            </div>
                        </div>

                        {asset.isResale && (
                            <div className="hidden sm:flex px-3 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--sidebar-active-text)]/20 items-center shrink-0 self-start lg:self-center">
                                <span className="text-[10px] text-[var(--sidebar-active-text)] font-bold uppercase tracking-wider">{asset.fractions} Listed for Resale</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <motion.button
                            onClick={handleOpenCertificate}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg bg-[var(--background)] text-[var(--sidebar-active-text)] text-[11px] font-bold border border-[var(--sidebar-border)] hover:border-[var(--sidebar-active-text)]/30 transition-all cursor-pointer group/btn"
                        >
                            <DocumentIcon className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                            Certificate
                        </motion.button>
                        <motion.button
                            onClick={handleOpenCertificate}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg bg-[var(--background)] text-[var(--color-text-muted)] text-[11px] font-bold hover:text-[var(--header-text)] transition-all border border-[var(--sidebar-border)] cursor-pointer group/btn"
                        >
                            <DownloadIcon className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                            Download
                        </motion.button>
                        {!asset.isResale && (
                            <motion.button
                                onClick={onResale}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] text-[11px] font-bold border-0 cursor-pointer hover:opacity-90 transition-all"
                            >
                                <ResaleIcon className="w-4 h-4" />
                                Resell
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
