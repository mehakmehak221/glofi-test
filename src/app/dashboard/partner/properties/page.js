"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    MapPinIcon,
    PropertyIcon,
} from "@/components/VectorImages";
import NewListingForm from "@/components/dashboard/NewListingForm";
import { useGetMyListingsQuery, useDeleteAssetMutation, useSubmitAssetForReviewMutation } from "@/store/api/assetApi";

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
            className="bg-[var(--color-bg-nav)] rounded-2xl p-4 lg:p-5 flex flex-col md:flex-row gap-5 items-center relative group hover:border-[var(--color-primary-300)]/10 border border-transparent transition-all"
        >
            <div className="w-full md:w-32 lg:w-40 h-24 lg:h-28 bg-[var(--color-bg-card)] rounded-xl flex-shrink-0 flex items-center justify-center border border-[var(--color-border-subtle)] overflow-hidden relative">
                {propertyImage ? (
                    <Image
                        src={propertyImage.startsWith('http') ? propertyImage : `/${propertyImage}`}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 160px, 160px"
                    />
                ) : (
                    <PropertyIcon className="w-8 h-8 text-[var(--color-primary-300)]/20" />
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
                    </div>
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
                </div>
            </div>

            <div className="absolute top-4 right-4 lg:top-5 lg:right-6">
                <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.1em] text-[var(--color-primary-300)]/60 font-montserrat uppercase bg-[var(--color-primary-300)]/5 rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-300)] animate-pulse" />
                    {property.status}
                </span>
            </div>
        </motion.div >
    );
}

export default function PartnerPropertiesPage() {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editId, setEditId] = useState(null);
    const { data, isLoading, isError, refetch } = useGetMyListingsQuery();
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
                                <h1 className="text-xl lg:text-2xl font-semibold text-white font-montserrat">
                                    Listed Properties
                                </h1>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsAddingNew(true)}
                                className="flex items-center gap-2 bg-[var(--color-primary-300)]/10 hover:bg-[var(--color-primary-300)]/20 text-[var(--color-primary-300)]/80 px-4 py-2 rounded-lg text-sm font-medium font-montserrat transition-all"
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
                                <div className="text-center p-12 text-[var(--color-text-muted)]">
                                    Error loading properties. Please try again later.
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
        </div>
    );
}
