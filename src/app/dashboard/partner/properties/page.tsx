"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    MapPinIcon,
    PropertyIcon,
} from "@/components/VectorImages";
import NewListingForm from "@/components/dashboard/NewListingForm";
import KYCModal from "@/components/dashboard/KYCModal";
import { useGetMyListingsQuery, useDeleteAssetMutation, useSubmitAssetForReviewMutation } from "@/store/api/assetApi";
import { useGetKycStatusQuery } from "@/store/api/kycApi";
import { useGetKybStatusQuery } from "@/store/api/kybApi";
import KYBModal from "@/components/dashboard/KYBModal";

const formatValuation = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "N/A";
    if (num >= 1e7) return `₹${(num / 1e7).toFixed(1)} Cr`;
    if (num >= 1e5) return `₹${(num / 1e5).toFixed(1)} L`;
    if (num >= 1e3) return `₹${(num / 1e3).toFixed(1)} K`;
    return `₹${num.toLocaleString('en-IN')}`;
};

const EDITABLE_STATUSES = new Set(["DRAFT", "LIVE", "SUSPENDED", "REJECTED", "UNDER_REVIEW", "PENDING_REVIEW"]);

function StatusBadge({ status }: { status: string }) {
    const s = (status || "").toUpperCase();
    const isLive = s === "LIVE";
    const isSuspended = s === "SUSPENDED";
    const isRejected = s === "REJECTED";
    const isPending = s === "PENDING_REVIEW" || s === "UNDER_REVIEW";

    const cls = isLive
        ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        : isSuspended
        ? "text-red-400 bg-red-500/10 border-red-500/20"
        : isRejected
        ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
        : isPending
        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
        : "text-[var(--sidebar-active-text)] bg-[var(--sidebar-active-bg)] border-[var(--sidebar-active-text)]/20";

    const dot = isLive
        ? "bg-emerald-500 animate-pulse"
        : isSuspended
        ? "bg-red-400"
        : isRejected
        ? "bg-orange-400"
        : isPending
        ? "bg-amber-400 animate-pulse"
        : "bg-[var(--sidebar-active-text)] animate-pulse";

    return (
        <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.12em] font-montserrat uppercase rounded-full px-2.5 py-1 border whitespace-nowrap ${cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
            {status}
        </span>
    );
}

function PropertyCard({ property, index, onDelete, onSubmitForReview, onEdit }) {
    const propertyImage = property.images && property.images.length > 0 ? property.images[0] : null;
    const status = (property.status || "").toUpperCase();
    const isDraft = status === "DRAFT";
    const canEdit = EDITABLE_STATUSES.has(status);
    const isLive = status === "LIVE";

    const totalFractions = Number(property.totalFractions) || 0;
    const soldFractions = Number(property.soldFractions) || 0;
    const soldPct = totalFractions > 0 ? Math.min(100, (soldFractions / totalFractions) * 100) : 0;

    const annualReturn = (
        parseFloat(property.expectedYield || 0) +
        parseFloat(property.expectedAnnualRent || 0) +
        parseFloat(property.rentalGrowthRate || 0) +
        parseFloat(property.expectedAppreciationRate || 0) -
        parseFloat(property.operatingCostRate || 0)
    ).toFixed(2);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl overflow-hidden flex flex-col sm:flex-row group hover:shadow-lg hover:border-[var(--sidebar-active-text)]/20 transition-all duration-300"
        >
            {/* Image */}
            <div className="relative w-full sm:w-44 lg:w-52 flex-shrink-0 h-44 sm:h-auto min-h-[140px] bg-[var(--color-bg-card)]">
                {propertyImage ? (
                    <Image
                        src={propertyImage.startsWith('http') ? propertyImage : `/${propertyImage}`}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 208px"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--sidebar-active-bg)] to-[var(--card-surface)]">
                        <PropertyIcon className="w-12 h-12 text-[var(--sidebar-active-text)]/20" />
                    </div>
                )}
                {/* Category chip on image */}
                {property.category && (
                    <div className="absolute bottom-2 left-2">
                        <span className="text-[8px] font-bold uppercase tracking-wider bg-black/50 text-white backdrop-blur-sm px-2 py-0.5 rounded-full font-montserrat">
                            {property.category.replace(/_/g, ' ')}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 lg:p-5 flex flex-col gap-3 min-w-0">

                {/* Top row: title + actions */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-base font-bold text-[var(--color-text-primary)] font-montserrat truncate">{property.title}</h3>
                            <StatusBadge status={property.status} />
                        </div>
                        <p className="text-[11px] text-[var(--color-text-muted)] font-montserrat flex items-center gap-1">
                            <MapPinIcon className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{property.location}{property.city ? `, ${property.city}` : ''}{property.country ? `, ${property.country}` : ''}</span>
                        </p>
                    </div>

                    {/* Action buttons */}
                    {(canEdit || isDraft) && (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isDraft && (
                                <button
                                    type="button"
                                    onClick={() => onSubmitForReview(property.id)}
                                    title="Submit for Review"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] text-[10px] font-bold uppercase tracking-wide font-montserrat transition-all cursor-pointer hover:bg-[var(--sidebar-active-text)]/20 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    Submit
                                </button>
                            )}
                            {canEdit && (
                                <button
                                    type="button"
                                    onClick={() => onEdit(property.id)}
                                    title="Edit"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--sidebar-border)] bg-[var(--form-surface)] text-[var(--color-text-secondary)] text-[10px] font-bold uppercase tracking-wide font-montserrat transition-all cursor-pointer hover:border-[var(--sidebar-active-text)]/40 hover:text-[var(--foreground)] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    Edit
                                </button>
                            )}
                            {isDraft && (
                                <button
                                    type="button"
                                    onClick={() => onDelete(property.id)}
                                    title="Delete"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wide font-montserrat transition-all cursor-pointer hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Delete
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--sidebar-border)]" />

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] font-montserrat font-semibold">Valuation</span>
                        <span className="text-sm font-bold text-[var(--color-text-primary)] font-montserrat">{formatValuation(property.valuation)}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] font-montserrat font-semibold">Annual Return</span>
                        <span className="text-sm font-bold text-emerald-500 font-montserrat">{annualReturn}%</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] font-montserrat font-semibold">Fractions Sold</span>
                        <span className="text-sm font-bold text-[var(--color-text-primary)] font-montserrat">
                            {soldFractions}
                            {totalFractions > 0 && <span className="text-[10px] text-[var(--color-text-muted)] font-normal"> / {totalFractions}</span>}
                        </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] font-montserrat font-semibold">Investors</span>
                        <span className="text-sm font-bold text-[var(--color-text-primary)] font-montserrat">{property.investorCount || 0}</span>
                    </div>
                </div>

                {/* Fraction sold progress bar — only show when live */}
                {isLive && totalFractions > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] font-montserrat font-semibold">Sold Progress</span>
                            <span className="text-[9px] font-bold text-[var(--sidebar-active-text)] font-montserrat">{soldPct.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-[var(--sidebar-border)] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${soldPct}%` }}
                                transition={{ duration: 0.8, delay: index * 0.06 + 0.3, ease: "easeOut" }}
                                className="h-full bg-[var(--sidebar-active-text)] rounded-full"
                            />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default function PartnerPropertiesPage() {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showKycModal, setShowKycModal] = useState(false);
    const [showKybModal, setShowKybModal] = useState(false);
    const { data, isLoading, isError, error, refetch } = useGetMyListingsQuery();
    const { data: kycData, refetch: refetchKyc } = useGetKycStatusQuery();
    const { data: kybData, refetch: refetchKyb } = useGetKybStatusQuery();

    const err = error as { status?: number; data?: { message?: string } } | undefined;
    const kycStatus = kycData?.status;
    const kybStatus = kybData?.status;
    const isKycRequired = err?.status === 403 && (
        err?.data?.message?.includes('KYC') || 
        kycStatus === 'REJECTED' || 
        kycStatus === 'PENDING' || 
        !kycStatus || 
        (kycStatus !== 'APPROVED' && kycStatus !== 'VERIFIED')
    );
    const isKybRequired = err?.status === 403 && !isKycRequired && (
        err?.data?.message?.includes('KYB') || 
        kybStatus === 'REJECTED' || 
        kybStatus === 'PENDING' || 
        !kybStatus || 
        (kybStatus !== 'APPROVED' && kybStatus !== 'VERIFIED')
    );
    const [deleteAsset] = useDeleteAssetMutation();
    const [submitAssetForReview] = useSubmitAssetForReviewMutation();

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this listing?")) return;
        try {
            await deleteAsset(id).unwrap();
            refetch();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Delete failed");
        }
    };

    const handleSubmitForReview = async (id) => {
        try {
            await submitAssetForReview(id).unwrap();
            alert("Submitted for review!");
            refetch();
        } catch (err) {
            console.error("Submission failed:", err);
            alert("Submission failed");
        }
    };

    return (
        <div className="p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen font-montserrat">
            <AnimatePresence mode="wait">
                {isAddingNew || editId ? (
                    <NewListingForm
                        key={editId ? `edit-${editId}` : "new"}
                        editId={editId}
                        initialProperty={
                            editId ? data?.data?.find((p) => String(p.id) === String(editId)) ?? null : null
                        }
                        onBack={() => {
                            setIsAddingNew(false);
                            setEditId(null);
                            refetch();
                        }}
                    />
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <h1 className="text-xl lg:text-2xl font-semibold text-[var(--foreground)] font-montserrat">
                                    Properties
                                </h1>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsAddingNew(true)}
                                className="flex items-center gap-2 bg-[var(--sidebar-active-bg)] hover:bg-[var(--sidebar-active-text)]/20 hover:scale-[1.02] active:scale-[0.98] text-[var(--sidebar-active-text)] px-4 py-2 rounded-md text-sm font-medium font-montserrat transition-all cursor-pointer"
                            >
                                <span className="text-lg leading-none">+</span>
                                New Listing
                            </motion.button>
                        </div>


                        <div className="flex flex-col gap-4 lg:gap-5">
                            {isLoading ? (
                                <div className="flex items-center justify-center p-12">
                                    <div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin" />
                                </div>
                            ) : isError ? (
                                <div className="text-center p-12 bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md">
                                    <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500/60 flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                                        {isKycRequired ? "Identity Verification Required" : isKybRequired ? "Business Verification Required" : "Error Loading Properties"}
                                    </h3>
                                    <p className="text-sm text-[var(--color-text-muted)] mb-6 max-w-xs mx-auto">
                                        {isKycRequired
                                            ? kycStatus === 'UNDER_REVIEW'
                                                ? "Your identity verification is currently under review. This process typically takes 24-48 hours."
                                                : "You need to complete your identity verification before you can manage or list properties."
                                            : isKybRequired
                                                ? kybStatus === 'UNDER_REVIEW'
                                                    ? "Your business verification is currently under review. This process typically takes 2-5 business days."
                                                    : "You need to complete your business verification (KYB) before you can manage or list properties."
                                                : "We encountered an error while loading your properties. Please try again later."}
                                    </p>

                                    {(isKycRequired || isKybRequired) && (
                                        <div className="flex flex-col items-center gap-4">
                                            {(isKycRequired && kycStatus === 'UNDER_REVIEW') && (
                                                <div className="flex items-center gap-2 px-4 py-2 bg-[#F79009]/10 border border-[#F79009]/20 rounded-md text-[#F79009] text-sm font-bold animate-pulse">
                                                    <span className="w-2 h-2 rounded-full bg-[#F79009]" />
                                                    STATUS: UNDER REVIEW (KYC)
                                                </div>
                                            )}
                                            {(isKybRequired && kybStatus === 'UNDER_REVIEW') && (
                                                <div className="flex items-center gap-2 px-4 py-2 bg-[#F79009]/10 border border-[#F79009]/20 rounded-md text-[#F79009] text-sm font-bold animate-pulse">
                                                    <span className="w-2 h-2 rounded-full bg-[#F79009]" />
                                                    STATUS: UNDER REVIEW (KYB)
                                                </div>
                                            )}

                                            <button
                                                onClick={() => {
                                                    if (isKycRequired) {
                                                        if (kycStatus === 'UNDER_REVIEW') {
                                                            refetchKyc();
                                                            refetch();
                                                        } else {
                                                            setShowKycModal(true);
                                                        }
                                                    } else if (isKybRequired) {
                                                        if (kybStatus === 'UNDER_REVIEW') {
                                                            refetchKyb();
                                                            refetch();
                                                        } else {
                                                            setShowKybModal(true);
                                                        }
                                                    }
                                                }}
                                                className={`px-10 py-4 ${(isKycRequired && kycStatus === 'UNDER_REVIEW') || (isKybRequired && kybStatus === 'UNDER_REVIEW') ? 'bg-[#1A1F1C] text-[var(--color-text-muted)] border border-[var(--sidebar-border)]' : 'bg-[var(--color-primary-300)] text-black shadow-glow-primary'} rounded-md text-base font-bold hover:scale-[1.02] active:scale-[0.98] transition-all font-montserrat cursor-pointer`}
                                            >
                                                {isKycRequired
                                                    ? kycStatus === 'UNDER_REVIEW' ? "Refresh KYC Status" : "Verify Identity Now"
                                                    : kybStatus === 'UNDER_REVIEW' ? "Refresh KYB Status" : "Verify Business Now"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : data?.data?.length === 0 ? (
                                <div className="text-center p-12 text-[var(--color-text-muted)] border border-dashed border-[var(--color-border-subtle)] rounded-md">
                                    No properties found.
                                </div>
                            ) : (
                                data?.data?.map((prop, i) => (
                                    <PropertyCard
                                        key={prop.id}
                                        property={prop}
                                        index={i}
                                        onDelete={handleDelete}
                                        onSubmitForReview={handleSubmitForReview}
                                        onEdit={setEditId}
                                    />
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <KYCModal
                isOpen={showKycModal}
                onClose={() => setShowKycModal(false)}
                onSubmit={() => {
                    setShowKycModal(false);
                    refetch();
                }}
            />
            <KYBModal
                isOpen={showKybModal}
                onClose={() => setShowKybModal(false)}
                onSubmit={() => {
                    setShowKybModal(false);
                    refetch();
                }}
            />
        </div>
    );
}
