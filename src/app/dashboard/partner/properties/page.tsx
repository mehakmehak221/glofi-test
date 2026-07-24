"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    MapPinIcon,
    PropertyIcon,
    ShareIcon,
    CopyIcon,
    ChartLineIcon,
    DollarIcon,
    LinkIcon,
    UserGroupIcon,
    SparkleIcon,
} from "@/components/VectorImages";
import NewListingForm from "@/components/dashboard/NewListingForm";
import KYCModal from "@/components/dashboard/KYCModal";
import { useGetMyListingsQuery, useDeleteAssetMutation, useSubmitAssetForReviewMutation } from "@/store/api/assetApi";
import { useGetKycStatusQuery } from "@/store/api/kycApi";
import { useGetKybStatusQuery } from "@/store/api/kybApi";
import KYBModal from "@/components/dashboard/KYBModal";
import ShareAssetModal from "@/components/dashboard/asset-share/ShareAssetModal";
import {
    useGenerateAssetShareLinkMutation,
    useGetSharedAssetsQuery,
    useGetPartnerAssetShareReportQuery,
} from "@/store/api/partnerApi";
import { copyToClipboard } from "@/utils/assetShare";

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

function PropertyCard({ property, index, onDelete, onSubmitForReview, onEdit, onShare, onInspect }) {
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
            className="overflow-hidden rounded-3xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-300 hover:border-[var(--sidebar-active-text)]/20 hover:shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
        >
            <div className="lg:flex">
                <div className="relative h-36 w-full flex-shrink-0 bg-[var(--color-bg-card)] sm:h-40 lg:h-auto lg:min-h-[220px] lg:w-[260px]">
                    {propertyImage ? (
                        <Image
                            src={propertyImage.startsWith("http") ? propertyImage : `/${propertyImage}`}
                            alt={property.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 260px"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--sidebar-active-bg)] to-[var(--card-surface)]">
                            <PropertyIcon className="w-12 h-12 text-[var(--sidebar-active-text)]/20" />
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                    <div className="absolute left-4 top-4">
                        <span className="inline-flex items-center rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                            {property.status || "LIVE"}
                        </span>
                    </div>

                    {property.category && (
                        <div className="absolute bottom-4 left-4">
                            <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black shadow-sm">
                                {property.category.replace(/_/g, " ")}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 p-3 sm:p-4 lg:p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-base font-bold text-[var(--foreground)] font-montserrat sm:text-lg">
                                    {property.title}
                                </h3>
                                <StatusBadge status={property.status} />
                            </div>
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--sidebar-text)] opacity-65 sm:mt-2 sm:text-sm">
                                <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">
                                    {property.location}
                                    {property.city ? `, ${property.city}` : ""}
                                    {property.country ? `, ${property.country}` : ""}
                                </span>
                            </p>
                        </div>

                        <div className="hidden shrink-0 items-center gap-2 md:flex">
                            <span className="rounded-full border border-[var(--sidebar-border)] bg-[var(--background)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-text)] opacity-60">
                                Valuation
                            </span>
                            <span className="text-sm font-bold text-[var(--foreground)]">
                                {formatValuation(property.valuation)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-2.5 sm:grid-cols-4">
                        <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)] p-2.5 sm:p-3">
                            <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-55">Valuation</span>
                            <span className="mt-1.5 block text-sm font-bold text-[var(--foreground)] sm:mt-2">{formatValuation(property.valuation)}</span>
                        </div>
                        <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)] p-2.5 sm:p-3">
                            <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-55">Return</span>
                            <span className="mt-1.5 block text-sm font-bold text-emerald-500 sm:mt-2">{annualReturn}%</span>
                        </div>
                        <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)] p-2.5 sm:p-3">
                            <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-55">Fractions</span>
                            <span className="mt-1.5 block text-sm font-bold text-[var(--foreground)] sm:mt-2">
                                {soldFractions}
                                {totalFractions > 0 && (
                                    <span className="text-[10px] font-normal text-[var(--sidebar-text)] opacity-60"> / {totalFractions}</span>
                                )}
                            </span>
                        </div>
                        <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)] p-2.5 sm:p-3">
                            <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-55">Investors</span>
                            <span className="mt-1.5 block text-sm font-bold text-[var(--foreground)] sm:mt-2">{property.investorCount || 0}</span>
                        </div>
                    </div>

                    {isLive && totalFractions > 0 && (
                        <div className="mt-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-55">Sold Progress</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-active-text)]">{soldPct.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-[var(--sidebar-border)]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${soldPct}%` }}
                                    transition={{ duration: 0.8, delay: index * 0.06 + 0.3, ease: "easeOut" }}
                                    className="h-full rounded-full bg-[var(--sidebar-active-text)]"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-3 flex flex-col gap-2.5 sm:mt-4 sm:flex-row sm:gap-3">
                        <button
                            type="button"
                            onClick={() => onShare(property)}
                            className="inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl bg-[var(--color-primary-300)] px-4 text-sm font-bold leading-none text-black transition hover:brightness-95 hover:scale-[1.01] active:scale-[0.99] sm:h-11 sm:flex-1"
                        >
                            <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-black/8">
                                <ShareIcon className="h-4 w-4 flex-shrink-0" />
                            </span>
                            <span className="leading-none sm:hidden">{isDraft ? "Generate" : "Share"}</span>
                            <span className="hidden leading-none sm:inline">{isDraft ? "Generate Share" : "Share Asset"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onInspect(property.id)}
                            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm font-bold leading-none text-[var(--foreground)] transition hover:border-[var(--sidebar-active-text)]/35 hover:bg-[var(--sidebar-active-bg)]/20 sm:h-11 sm:flex-1"
                        >
                            Inspect Report
                        </button>
                    </div>

                    {(canEdit || isDraft) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {isDraft && (
                                <button
                                    type="button"
                                    onClick={() => onSubmitForReview(property.id)}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--sidebar-border)] bg-[var(--background)] px-3 text-[10px] font-bold uppercase tracking-wide text-[var(--sidebar-text)] transition hover:border-[var(--sidebar-active-text)]/30 hover:text-[var(--foreground)]"
                                >
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    Submit
                                </button>
                            )}
                            {canEdit && (
                                <button
                                    type="button"
                                    onClick={() => onEdit(property.id)}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--sidebar-border)] bg-[var(--background)] px-3 text-[10px] font-bold uppercase tracking-wide text-[var(--sidebar-text)] transition hover:border-[var(--sidebar-active-text)]/30 hover:text-[var(--foreground)]"
                                >
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                            )}
                            {isDraft && (
                                <button
                                    type="button"
                                    onClick={() => onDelete(property.id)}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-red-500/10 bg-red-500/5 px-3 text-[10px] font-bold uppercase tracking-wide text-red-400 transition hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-300"
                                >
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function PartnerPropertiesPage() {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showKycModal, setShowKycModal] = useState(false);
    const [showKybModal, setShowKybModal] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedShareAsset, setSelectedShareAsset] = useState<any | null>(null);
    const [selectedShareUrl, setSelectedShareUrl] = useState<string | null>(null);
    const [selectedReportAssetId, setSelectedReportAssetId] = useState<string | null>(null);
    const [copiedShareId, setCopiedShareId] = useState<string | null>(null);
    const { data, isLoading, isError, error, refetch } = useGetMyListingsQuery();
    const { data: kycData, refetch: refetchKyc } = useGetKycStatusQuery();
    const { data: kybData, refetch: refetchKyb } = useGetKybStatusQuery();
    const { data: sharedAssetsData, isLoading: sharedLoading } = useGetSharedAssetsQuery();
    const [generateShareLink, { isLoading: isGeneratingShare }] = useGenerateAssetShareLinkMutation();

    const err = error as { status?: number; data?: { message?: string } } | undefined;
    const kycStatus = kycData?.status;
    const kybStatus = kybData?.status;
    const sharedAssets = useMemo(() => sharedAssetsData || [], [sharedAssetsData]);
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

    const selectedShareReportAssetId = selectedReportAssetId ?? sharedAssets[0]?.assetId ?? null;

    const {
        data: shareReport,
        isLoading: reportLoading,
        isError: reportIsError,
        error: reportError,
    } = useGetPartnerAssetShareReportQuery(selectedShareReportAssetId || "", {
        skip: !selectedShareReportAssetId,
    });

    const report404 = Boolean(reportIsError && (reportError as { status?: number } | undefined)?.status === 404);

    const shareSummary = useMemo(() => {
        const totals = sharedAssets.reduce(
            (acc, item) => {
                const stats = item.stats;
                acc.shares += 1;
                acc.clicks += stats?.totalClicks || 0;
                acc.registrations += stats?.registeredUsersCount || 0;
                acc.investments += stats?.investmentsCount || 0;
                acc.volume += stats?.totalInvestmentAmount || 0;
                return acc;
            },
            { shares: 0, clicks: 0, registrations: 0, investments: 0, volume: 0 }
        );

        return [
            { label: "Shares", value: totals.shares, icon: ShareIcon },
            { label: "Clicks", value: totals.clicks, icon: LinkIcon },
            { label: "Registrations", value: totals.registrations, icon: UserGroupIcon },
            { label: "Volume", value: `AED ${totals.volume.toLocaleString()}`, icon: DollarIcon },
        ];
    }, [sharedAssets]);

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

    const handleShare = (asset: any) => {
        const existing = sharedAssets.find((item) => String(item.assetId) === String(asset.id));
        setSelectedShareAsset(asset);
        setSelectedShareUrl(existing?.shareUrl ?? null);
        setShareModalOpen(true);
    };

    const handleInspectReport = (assetId: string | number) => {
        setSelectedReportAssetId(String(assetId));
    };

    const handleGenerateShareLink = async (customCode?: string) => {
        if (!selectedShareAsset?.id) return;
        const response = await generateShareLink({
            assetId: selectedShareAsset.id,
            body: customCode ? { customCode } : undefined,
        }).unwrap();
        setSelectedShareUrl(response.shareUrl);
    };

    const handleCopySharedLink = async (item: any) => {
        if (!item.shareUrl) return;
        await copyToClipboard(item.shareUrl);
        setCopiedShareId(item.id);
        window.setTimeout(() => setCopiedShareId((current) => (current === item.id ? null : current)), 1400);
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
                                        onShare={handleShare}
                                        onInspect={handleInspectReport}
                                    />
                                ))
                            )}
                        </div>

                        <div
                            className="mt-8 w-full"
                            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
                        >
                            <section className="w-full rounded-3xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-6">
                                <div className="mb-6 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-text)] opacity-60">Share Activity</p>
                                        <h2 className="mt-2 text-xl font-bold text-[var(--foreground)] font-montserrat">Shared properties</h2>
                                    </div>
                                    <SparkleIcon className="h-5 w-5 text-[var(--sidebar-text)] opacity-50" />
                                </div>

                                {sharedLoading ? (
                                    <div className="flex items-center gap-3 text-sm text-[var(--sidebar-text)] opacity-60">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)]" />
                                        Loading shared properties...
                                    </div>
                                ) : sharedAssets.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-[var(--sidebar-border)] bg-[var(--background)]/60 p-5 text-sm text-[var(--sidebar-text)] opacity-60">
                                        No share links yet. Use the Share button on any property to generate your first link.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {sharedAssets.map((item) => (
                                            <div
                                                key={item.id}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => setSelectedReportAssetId(item.assetId)}
                                                className={`w-full cursor-pointer rounded-2xl border p-3 text-left transition ${
                                                    String(selectedShareReportAssetId) === String(item.assetId)
                                                        ? "border-[var(--color-primary-300)]/30 bg-[var(--color-primary-300)]/8"
                                                        : "border-[var(--sidebar-border)] bg-[var(--background)]/70 hover:border-[var(--color-primary-300)]/20"
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-bold text-[var(--foreground)] font-montserrat">
                                                            {item.asset?.title || "Untitled asset"}
                                                        </p>
                                                        <p className="mt-1 text-[11px] text-[var(--sidebar-text)] opacity-60">
                                                            {item.code} • {new Date(item.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex shrink-0 flex-col items-end gap-1">
                                                        <span className="rounded-full bg-[var(--sidebar-active-bg)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--sidebar-active-text)]">
                                                            {item.stats?.totalClicks || 0} clicks
                                                        </span>
                                                        <span className="rounded-full bg-[var(--sidebar-active-bg)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--sidebar-active-text)]">
                                                            {item.stats?.investmentsCount || 0} invests
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                                                    <div className="min-w-0 flex-1 rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--sidebar-text)] opacity-70">
                                                        <span className="block truncate" title={item.shareUrl}>{item.shareUrl}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleCopySharedLink(item);
                                                        }}
                                                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[var(--sidebar-border)] px-4 text-xs font-bold uppercase tracking-wider text-[var(--foreground)] sm:w-auto"
                                                    >
                                                        <CopyIcon className="h-4 w-4" />
                                                        {copiedShareId === item.id ? "Copied" : "Copy"}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section className="w-full rounded-3xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-6">
                                <div className="flex items-center justify-between gap-3 mb-5">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-text)] opacity-60">Performance</p>
                                        <h2 className="mt-2 text-xl font-bold text-[var(--foreground)] font-montserrat">Share report</h2>
                                    </div>
                                    <ChartLineIcon className="h-5 w-5 text-[var(--sidebar-text)] opacity-50" />
                                </div>

                                <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)]/75 p-4 mb-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-60">Selected Asset</p>
                                    <div className="mt-2 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-[var(--foreground)] font-montserrat">
                                                {shareReport?.asset?.title || sharedAssets.find((item) => String(item.assetId) === String(selectedShareReportAssetId))?.asset?.title || "Asset report"}
                                            </p>
                                            <p className="mt-1 text-xs text-[var(--sidebar-text)] opacity-60">
                                                {shareReport?.asset?.location || sharedAssets.find((item) => String(item.assetId) === String(selectedShareReportAssetId))?.asset?.location || "No location"}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-[var(--sidebar-active-bg)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-active-text)]">
                                            {shareReport?.links?.length || 0} links
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {shareSummary.map((item) => (
                                        <div key={item.label} className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-60">{item.label}</p>
                                                <item.icon className="h-4 w-4 text-[var(--sidebar-text)] opacity-50" />
                                            </div>
                                            <p className="mt-4 text-2xl font-bold text-[var(--foreground)] font-montserrat">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-60">Conversion Rate</p>
                                    <p className="mt-3 text-2xl font-bold text-[var(--color-primary-300)] font-montserrat">
                                        {shareReport?.summary.conversionRate || 0}%
                                    </p>
                                </div>

                                <div className="mt-4 space-y-3 max-h-[460px] overflow-auto pr-1">
                                    {!selectedShareReportAssetId ? (
                                        <div className="rounded-2xl border border-dashed border-[var(--sidebar-border)] bg-[var(--background)]/60 p-5 text-sm text-[var(--sidebar-text)] opacity-60">
                                            Select a shared property to inspect its report.
                                        </div>
                                    ) : reportLoading ? (
                                        <div className="flex items-center gap-3 text-sm text-[var(--sidebar-text)] opacity-60">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)]" />
                                            Loading report...
                                        </div>
                                    ) : report404 ? (
                                        <div className="rounded-2xl border border-dashed border-[var(--sidebar-border)] bg-[var(--background)]/60 p-5 text-sm text-[var(--sidebar-text)] opacity-60">
                                            No share links yet. Click Share to get started.
                                        </div>
                                    ) : (
                                        (shareReport?.links || []).map((link) => (
                                            <div key={link.id} className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <p className="truncate text-sm font-bold text-[var(--foreground)] font-montserrat">{link.code}</p>
                                                            <span className="rounded-full bg-[var(--sidebar-active-bg)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--sidebar-active-text)]">
                                                                {link.stats.totalClicks} clicks
                                                            </span>
                                                        </div>
                                                        <p className="mt-1 truncate text-xs text-[var(--sidebar-text)] opacity-60" title={link.shareUrl}>
                                                            {link.shareUrl}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            copyToClipboard(link.shareUrl);
                                                        }}
                                                        className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-[var(--sidebar-border)] bg-[var(--background)] px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground)] transition hover:border-[var(--sidebar-active-text)]/30"
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <ShareAssetModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                assetTitle={selectedShareAsset?.title || "Selected asset"}
                assetValuation={String(selectedShareAsset?.valuation || 0)}
                shareUrl={selectedShareUrl}
                isGenerating={isGeneratingShare}
                onGenerate={handleGenerateShareLink}
            />
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
