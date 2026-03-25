"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, XIcon, DocumentIcon } from "@/components/VectorImages";
import {
    useGetSecondaryPendingApprovalsQuery,
    useApproveSecondaryListingMutation,
    useRejectSecondaryListingMutation
} from "@/store/api/secondaryMarketApi";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function SecondaryApprovalsPage() {
    const { data: listingsResponse, isLoading } = useGetSecondaryPendingApprovalsQuery();
    const [approveListing] = useApproveSecondaryListingMutation();
    const [rejectListing] = useRejectSecondaryListingMutation();

    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    const listings = Array.isArray(listingsResponse) ? listingsResponse : (listingsResponse?.data || []);

    const handleApprove = async (id) => {
        if (!confirm("Are you sure you want to approve this listing?")) return;
        try {
            await approveListing(id).unwrap();
        } catch (err) {
            console.error("Approve failed:", err);
            alert("Approval failed: " + (err.data?.message || err.message));
        }
    };

    const handleReject = async (id) => {
        if (!rejectReason.trim()) {
            alert("Please provide a reason for rejection.");
            return;
        }
        try {
            await rejectListing({ id, reason: rejectReason }).unwrap();
            setRejectingId(null);
            setRejectReason("");
        } catch (err) {
            console.error("Reject failed:", err);
            alert("Rejection failed: " + (err.data?.message || err.message));
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-10 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)] font-sans transition-colors duration-300">
            <div className="max-w-[1400px] mx-auto">
                <header className="mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-[var(--header-text)] tracking-tight">Pending Resale Approvals</h1>
                    <p className="text-sm sm:text-base text-[var(--color-text-muted)] mb-8 max-w-2xl leading-relaxed font-medium">Review and approve property fractions listed by investors for the secondary marketplace.</p>
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
                                const asset = item.asset || {};
                                const seller = item.seller || {};
                                const propertyImage = asset.images?.[0];
                                const imageUrl = propertyImage?.startsWith('http') ? propertyImage : (propertyImage ? `/${propertyImage}` : "/assets/marketplace/Burj.png");

                                return (
                                    <motion.div
                                        variants={itemVariants}
                                        key={item.id}
                                        className="bg-[var(--background)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 lg:p-6 transition-all duration-300 relative group"
                                    >
                                        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-5 lg:gap-8">
                                            <div className="w-full sm:w-[280px] lg:w-[240px] h-48 sm:h-[160px] lg:h-[135px] rounded-xl overflow-hidden flex-shrink-0 relative">
                                                <Image
                                                    src={imageUrl}
                                                    alt={asset.title || "Property image"}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, 280px"
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 w-full flex flex-col justify-center">
                                                <div className="flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-4 mb-5 lg:mb-4">
                                                    <div className="flex-1 w-full flex flex-col gap-4 sm:gap-2">
                                                        <div className="flex flex-row items-center justify-between sm:justify-start gap-4">
                                                            <h3 className="text-lg sm:text-xl font-bold text-[var(--header-text)]">{asset.title || "Unknown Property"}</h3>
                                                            <div className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)] border-[var(--color-status-warning-border)]">
                                                                PENDING REVIEW
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 w-full mt-2">
                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Seller</p>
                                                                <p className="text-xs sm:text-sm font-bold text-[var(--header-text)]">{item.investor?.investorProfile?.fullName || "Anonymous"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Fractions listed</p>
                                                                <p className="text-xs sm:text-sm font-bold text-[var(--header-text)]">{item.fractions || item.fractionsListed || 0}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">Ask Price</p>
                                                                <p className="text-xs sm:text-sm font-bold text-[var(--header-text)]">${(parseFloat(item.askPrice || 0)).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {rejectingId === item.id ? (
                                                    <div className="mt-4 flex flex-col gap-3">
                                                        <textarea
                                                            placeholder="Reason for rejection..."
                                                            className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-xl py-3 px-4 text-sm font-medium text-[var(--header-text)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 min-h-[80px]"
                                                            value={rejectReason}
                                                            onChange={(e) => setRejectReason(e.target.value)}
                                                        />
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => handleReject(item.id)}
                                                                className="px-4 py-2 rounded-lg bg-red-500 text-white text-[11px] font-bold border-0 cursor-pointer hover:bg-red-600 transition-all shadow-sm"
                                                            >
                                                                Confirm Reject
                                                            </button>
                                                            <button
                                                                onClick={() => { setRejectingId(null); setRejectReason(""); }}
                                                                className="px-4 py-2 rounded-lg bg-[var(--background)] text-[var(--color-text-muted)] text-[11px] font-bold border border-[var(--sidebar-border)] cursor-pointer hover:text-[var(--header-text)] transition-all"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <motion.button
                                                            onClick={() => handleApprove(item.id)}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] text-[11px] font-bold shadow-sm hover:opacity-90 transition-all border-0 cursor-pointer"
                                                        >
                                                            <CheckIcon className="w-4 h-4" />
                                                            Approve
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => setRejectingId(item.id)}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--background)] text-red-500 border border-red-500/20 text-[11px] font-bold hover:bg-red-500/10 transition-all cursor-pointer"
                                                        >
                                                            <XIcon className="w-4 h-4" />
                                                            Reject
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <motion.div
                                variants={itemVariants}
                                className="bg-[var(--background)] border border-[var(--sidebar-border)] rounded-md p-12 flex flex-col items-center justify-center text-center"
                            >
                                <DocumentIcon className="w-12 h-12 text-[var(--color-text-muted)]/20 mb-4" />
                                <h3 className="text-lg font-bold text-[var(--header-text)] mb-1">No pending approvals</h3>
                                <p className="text-sm text-[var(--color-text-muted)]">There are currently no listings waiting for review.</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
