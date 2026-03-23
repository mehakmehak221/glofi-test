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
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num}`;
};

function PropertyCard({ property, index, onDelete, onSubmitForReview, onEdit }) {
    const propertyImage = property.images && property.images.length > 0 ? property.images[0] : null;
    const isDraft = property.status === 'DRAFT';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-4 lg:p-5 flex flex-col md:flex-row gap-5 items-center relative group hover:shadow-md transition-all"
        >
            <div className="w-full md:w-32 lg:w-40 h-24 lg:h-28 bg-[var(--color-bg-card)] rounded-xl flex-shrink-0 flex items-center justify-center border border-[var(--color-border-subtle)] overflow-hidden relative">
                {propertyImage ? (
                    <Image
                        src={propertyImage.startsWith('http') ? propertyImage : `/${propertyImage}`}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 160px, 160px"
                    />
                ) : (
                    <PropertyIcon className="w-8 h-8 text-[var(--sidebar-active-text)]/20" />
                )}
            </div>

            <div className="flex-1 w-full">
                <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] font-montserrat">{property.title}</h3>
                        <p className="text-xs text-[var(--color-text-muted)] font-montserrat mt-1 flex items-center gap-1">
                            <MapPinIcon className="w-3 h-3" />
                            {property.location}
                        </p>
                    </div>

                    {isDraft && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onSubmitForReview(property.id)}
                                className="px-3 py-1.5 rounded-lg bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] text-[10px] font-bold uppercase transition-all hover:bg-[var(--color-primary-300)]/20"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => onEdit(property.id)}
                                className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-surface-subtle)] text-[var(--color-text-muted)] text-[10px] font-bold uppercase transition-all hover:text-white"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(property.id)}
                                className="px-3 py-1.5 rounded-lg bg-red-500/5 text-red-500/70 text-[10px] font-bold uppercase transition-all hover:bg-red-500/10 hover:text-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-montserrat font-medium">Valuation</span>
                        <span className="text-sm font-semibold text-[var(--color-text-secondary)] font-montserrat">
                            {formatValuation(property.valuation)}
                        </span>
                    </div >
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-montserrat font-medium">Sold</span>
                        <span className="text-sm font-semibold text-[var(--color-text-secondary)] font-montserrat">
                            {property.soldFractions || 0}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-montserrat font-medium">Yield</span>
                        <span className="text-sm font-bold text-[var(--color-text-secondary)] font-montserrat">
                            {property.expectedYield}%
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-montserrat font-medium">Investors</span>
                        <span className="text-sm font-semibold text-[var(--color-text-secondary)] font-montserrat">
                            {property.investorCount || 0}
                        </span>
                    </div>
                </div >
            </div >

            <div className="absolute top-4 right-4 lg:top-5 lg:right-6">
                <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.1em] text-[var(--sidebar-active-text)] font-montserrat uppercase bg-[var(--sidebar-active-bg)] rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--sidebar-active-text)] animate-pulse" />
                    {property.status}
                </span>
            </div>
        </motion.div >
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

    const isKycRequired = error?.status === 403 && error?.data?.message?.includes('KYC');
    const isKybRequired = error?.status === 403 && error?.data?.message?.includes('KYB');
    const kycStatus = kycData?.status;
    const kybStatus = kybData?.status;
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
                        key="form"
                        editId={editId}
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
                                className="flex items-center gap-2 bg-[var(--sidebar-active-bg)] hover:opacity-80 text-[var(--sidebar-active-text)] px-4 py-2 rounded-lg text-sm font-medium font-montserrat transition-all"
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
                                <div className="text-center p-12 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl">
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
                                                <div className="flex items-center gap-2 px-4 py-2 bg-[#F79009]/10 border border-[#F79009]/20 rounded-xl text-[#F79009] text-sm font-bold animate-pulse">
                                                    <span className="w-2 h-2 rounded-full bg-[#F79009]" />
                                                    STATUS: UNDER REVIEW (KYC)
                                                </div>
                                            )}
                                            {(isKybRequired && kybStatus === 'UNDER_REVIEW') && (
                                                <div className="flex items-center gap-2 px-4 py-2 bg-[#F79009]/10 border border-[#F79009]/20 rounded-xl text-[#F79009] text-sm font-bold animate-pulse">
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
                                                className={`px-10 py-4 ${(isKycRequired && kycStatus === 'UNDER_REVIEW') || (isKybRequired && kybStatus === 'UNDER_REVIEW') ? 'bg-[#1A1F1C] text-[var(--color-text-muted)] border border-[var(--sidebar-border)]' : 'bg-[#00DAAF] text-black shadow-[0_0_20px_rgba(0,218,175,0.3)]'} rounded-full text-base font-bold hover:scale-[1.02] active:scale-[0.98] transition-all font-montserrat cursor-pointer`}
                                            >
                                                {isKycRequired
                                                    ? kycStatus === 'UNDER_REVIEW' ? "Refresh KYC Status" : "Verify Identity Now"
                                                    : kybStatus === 'UNDER_REVIEW' ? "Refresh KYB Status" : "Verify Business Now"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : data?.data?.length === 0 ? (
                                <div className="text-center p-12 text-[var(--color-text-muted)] border border-dashed border-[var(--color-border-subtle)] rounded-2xl">
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
