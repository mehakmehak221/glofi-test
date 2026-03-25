"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ResaleIcon, EyeOpenIcon } from "@/components/VectorImages";
import { useGetMySecondaryListingsQuery, useDeleteSecondaryListingMutation } from "@/store/api/secondaryMarketApi";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function MySecondaryListingsPage() {
    const { data: listingsResponse, isLoading } = useGetMySecondaryListingsQuery();
    const [deleteListing] = useDeleteSecondaryListingMutation();
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const listings = listingsResponse?.data || [];

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this listing?")) return;
        try {
            await deleteListing(id).unwrap();
            showToast("Listing deleted successfully!");
        } catch (err) {
            console.error("Delete failed:", err);
            showToast(err.data?.message || err.message || "Failed to delete listing", "error");
        }
    };

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

            <div className="max-w-[1400px] mx-auto">
                <header className="mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-[var(--header-text)] tracking-tight">My Secondary Listings</h1>
                    <p className="text-sm sm:text-base text-[var(--color-text-muted)] mb-8 max-w-2xl leading-relaxed font-medium">Manage the property fractions you have listed for resale.</p>
                </header>

                <div className="flex flex-col gap-12">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-5"
                    >
                        {isLoading ? (
                            <div className="flex justify-center p-12">
                                <div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin"></div>
                            </div>
                        ) : listings.length > 0 ? (
                            listings.map((item) => {
                                const title = item.assetTitle || item.asset?.title || item.asset?.name || "Property Listing";
                                const location = item.assetLocation || item.asset?.location || "N/A";
                                const propertyImage = item.assetImages?.[0] || item.asset?.images?.[0];
                                const imageUrl = propertyImage?.startsWith('http') ? propertyImage : (propertyImage ? `/${propertyImage}` : "/assets/marketplace/Burj.png");

                                return (
                                    <motion.div
                                        variants={itemVariants}
                                        key={item.id}
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
                                                                    item.status === "APPROVED" || item.status === "LISTED" ? "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success-border)]" :
                                                                        "bg-[var(--color-status-error-bg)] text-[var(--color-status-error)] border-[var(--color-status-error-border)]"
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
                                                        onClick={() => handleDelete(item.id)}
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
                            })
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
            </div>
        </div>
    );
}
