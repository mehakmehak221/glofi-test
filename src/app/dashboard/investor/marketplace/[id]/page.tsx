"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinIcon } from "@/components/VectorImages";
import { PROPERTIES } from "@/data/propertyData";
import InvestModal from "@/components/dashboard/InvestModal";
import KYCModal from "@/components/dashboard/KYCModal";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import PaymentModal from "@/components/dashboard/PaymentModal";

import {
    useGetAssetByIdQuery,
    useGetAssetReturnsQuery,
    useGetAssetCashflowQuery,
    useGetAssetIrrCurveQuery,
    useGetAssetRentalScheduleQuery,
    useGetAssetProjectedValuationQuery
} from "@/store/api/assetApi";
import { useGetInvestmentsQuery } from "@/store/api/investmentApi";
import { useGetKycStatusQuery } from "@/store/api/kycApi";

import { API_URL } from "@/constants";

import { useCurrency } from "@/providers/CurrencyProvider";

export default function PropertyDetailPage() {
    const { formatPrice, currency } = useCurrency();
    const params = useParams();
    const router = useRouter();
    const assetId = params.id as string;

    const { data: property, isLoading, isError } = useGetAssetByIdQuery(assetId);
    const { data: returnsData } = useGetAssetReturnsQuery(assetId);
    const { data: cashflowData } = useGetAssetCashflowQuery(assetId);
    const { data: irrData } = useGetAssetIrrCurveQuery(assetId);
    const { data: rentalData } = useGetAssetRentalScheduleQuery(assetId);
    const { data: valuationData } = useGetAssetProjectedValuationQuery(assetId);

    const { data: kycData } = useGetKycStatusQuery();
    const { data: investmentsData, refetch: refetchInvestments } = useGetInvestmentsQuery();
    const [activeTab, setActiveTab] = useState("cashflow");
    const [mainTab, setMainTab] = useState("overview");
    const [investOpen, setInvestOpen] = useState(false);
    const [kycOpen, setKycOpen] = useState(false);
    const [confirmType, setConfirmType] = useState(null);
    const [investQuantity, setInvestQuantity] = useState(1);
    const [investStatus, setInvestStatus] = useState("");
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const investmentsArray = Array.isArray(investmentsData) ? investmentsData : (investmentsData?.data || []);
    const userInvestment = investmentsArray.find(inv => (inv.asset?.id === params.id) || (inv.assetId === params.id));

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin" />
            </div>
        );
    }

    if (isError || !property) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-[var(--header-text)]">Property not found or error loading details.</p>
                <Link href="/dashboard/investor/marketplace" className="text-[var(--color-primary-300)] hover:underline">Back to Marketplace</Link>
            </div>
        );
    }

    const propertyImage = property.images?.[0];
    const imageUrl = propertyImage
        ? (propertyImage.startsWith('http') ? propertyImage : `${API_URL}/${propertyImage.replace(/^\/+/, '')}`)
        : "/assets/images/content/img_ext_0.jpeg";

    const fundedPercentage = Math.round(((property.totalFractions - property.availableFractions) / property.totalFractions) * 100);

    const documents = [
        { name: "Ownership Proof / Backing Document", url: property.titleDeedUrl },
        { name: "Valuation Report", url: property.valuationReportUrl },
        { name: "Legal Opinion", url: property.legalOpinionUrl },
    ].filter(doc => doc.url);

    const handleInvestNow = () => setInvestOpen(true);

    const handleVerifyPay = async (qty) => {
        setInvestQuantity(qty);
        setInvestOpen(false);

        // Check KYC status
        const isApproved = kycData?.status === "APPROVED" || kycData?.status === "VERIFIED";

        if (!isApproved) {
            if (kycData?.status !== "UNDER_REVIEW") {
                setKycOpen(true);
            } else {
                showToast("Your KYC is currently under review. Please wait for approval before investing.", "warning");
            }
            return;
        }

        // If KYC is approved, open Payment Modal
        setPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        showToast("Investment successful! You can view it in your portfolio.");
        refetchInvestments();
        setInvestStatus("SUCCESS");
    };

    const handleKycSubmit = () => {
        setKycOpen(false);
        setConfirmType("kyc");
    };

    const handleKycConfirmClose = () => {
        setConfirmType(null);
    };

    const handleFinalClose = () => {
        setConfirmType(null);
        setInvestStatus("");
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen">
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-md shadow-lg font-montserrat text-sm font-semibold flex items-center gap-2 ${toast.type === "success"
                            ? "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border border-[var(--color-status-success)]/20"
                            : toast.type === "warning"
                                ? "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)] border border-[var(--color-status-warning)]/20"
                                : "bg-[var(--color-status-error-bg)] text-[var(--color-status-error)] border border-[var(--color-status-error)]/20"
                            }`}
                        style={{ backdropFilter: "blur(8px)" }}
                    >
                        {toast.type === "success" ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : toast.type === "warning" ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col lg:flex-row gap-6">

                <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Image Container with overlays */}
                    <div className="relative w-full h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden mb-5 border border-[var(--sidebar-border)]/50 shadow-sm">
                        <Image
                            src={imageUrl}
                            alt={property.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0" style={{ background: 'var(--marketplace-card-overlay)' }} />

                        {/* Back Button (Top-Left overlay) */}
                        <Link
                            href="/dashboard/investor/marketplace"
                            className="absolute top-3 left-3 sm:top-4 sm:left-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-black/45 hover:bg-black/60 text-white border border-white/10 backdrop-blur-md transition-all shadow-md group z-20 cursor-pointer"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>

                        {/* Category Tag (Bottom-Left overlay) */}
                        <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#FFFFFF] text-[#111111] border border-white/40 shadow-md z-10">
                            {property.category?.replace(/_/g, ' ')}
                        </span>

                        {/* Risk Rating Tag (Top-Right overlay) */}
                        <span className="absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white border border-white/10 backdrop-blur-md shadow-sm z-10">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor] ${
                                property.riskRating === 'LOW'
                                    ? 'bg-[#00DAAF] text-[#00DAAF]'
                                    : property.riskRating === 'HIGH'
                                        ? 'bg-[#FF5C5C] text-[#FF5C5C]'
                                        : 'bg-[#E8940C] text-[#E8940C]'
                            }`} />
                            {property.riskRating} RISK
                        </span>
                    </div >

                    {/* Name and Location Section */}
                    <div className="mb-5 px-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--header-text)] mb-1.5 tracking-tight">{property.title}</h1>
                        <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-xs font-semibold">
                            <MapPinIcon className="w-3.5 h-3.5 text-[var(--sidebar-active-text)]" />
                            {property.location}
                        </div>
                    </div>

                    {/* Valuation, Per Fraction, and Annual Return Stats Card */}
                    <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
                        <div className="grid grid-cols-3 divide-x divide-[var(--sidebar-border)]/65 text-center items-center">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-semibold">Valuation</p>
                                <p className="text-base font-bold text-[var(--header-text)]">{formatPrice(property.valuation, true)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-semibold">Per Fraction</p>
                                <p className="text-base font-bold text-[var(--header-text)]">{formatPrice(property.fractionPrice)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-semibold">Annual Return</p>
                                <p className="text-base font-bold text-[var(--sidebar-active-text)]">
                                    {(
                                        parseFloat(property.expectedYield || 0) +
                                        parseFloat(property.expectedAnnualRent || 0) +
                                        parseFloat(property.rentalGrowthRate || 0) +
                                        parseFloat(property.expectedAppreciationRate || 0) -
                                        parseFloat(property.operatingCostRate || 0)
                                    ).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Funding Progress Card */}
                    <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-[24px] p-5 sm:p-6 mb-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--color-text-muted)]">Funding Progress</span>
                            <span className="text-sm font-bold text-[var(--sidebar-active-text)]">{fundedPercentage}% funded</span>
                        </div>
                        <div className="w-full h-2.5 bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-full overflow-hidden mb-4">
                            <motion.div
                                className="h-full bg-[var(--sidebar-active-text)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${fundedPercentage}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-[13px] font-bold">
                            <span className="text-[var(--color-text-muted)]">{property.availableFractions?.toLocaleString()} fractions remaining</span>
                            <span className="text-[var(--sidebar-active-text)]">
                                {(
                                    parseFloat(property.expectedYield || 0) +
                                    parseFloat(property.expectedAnnualRent || 0) +
                                    parseFloat(property.rentalGrowthRate || 0) +
                                    parseFloat(property.expectedAppreciationRate || 0) -
                                    parseFloat(property.operatingCostRate || 0)
                                ).toFixed(1)}% p.a.
                            </span>
                        </div>
                    </div>

                    {/* Top Segmented Tab Control */}
                    <div className="flex bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-full p-1 mb-6 shadow-sm">
                        {[
                            { id: "overview", label: "Overview" },
                            { id: "projection", label: "Projection" },
                            { id: "financial", label: "Financial" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setMainTab(tab.id)}
                                className={`flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
                                    mainTab === tab.id
                                        ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border border-[var(--sidebar-active-text)]/20 shadow-sm"
                                        : "text-[var(--color-text-muted)] hover:text-[var(--header-text)]"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {mainTab === "overview" && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >

                                {/* Images Section */}
                                {property.images && property.images.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-[var(--header-text)] mb-4 px-1">Images</h3>
                                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1 snap-x snap-mandatory">
                                            {property.images.map((img, idx) => (
                                                <div key={idx} className="relative w-40 sm:w-48 h-32 sm:h-40 rounded-2xl overflow-hidden flex-shrink-0 border border-[var(--sidebar-border)] shadow-sm snap-start">
                                                    <Image
                                                        src={img.startsWith('http') ? img : `${API_URL}/${img.replace(/^\/+/, '')}`}
                                                        alt={`${property.title} image ${idx + 1}`}
                                                        fill
                                                        sizes="(max-width: 768px) 160px, 192px"
                                                        className="object-cover"
                                                    />
                                                    {idx === 0 && (
                                                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded-md backdrop-blur-md">
                                                            {idx + 1} / {property.images.length}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Description and Property Info */}
                                <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-[24px] p-5 sm:p-6 mb-6 shadow-sm">
                                    <h3 className="text-[15px] font-bold text-[var(--header-text)] mb-3">About this property</h3>
                                    <div className={`text-[13px] text-[var(--color-text-muted)] leading-relaxed font-montserrat tracking-tight ${!isDescExpanded ? "line-clamp-4" : ""}`}>
                                        {property.description}
                                    </div>
                                    {(property.description?.length || 0) > 250 && (
                                        <button 
                                            onClick={() => setIsDescExpanded(!isDescExpanded)}
                                            className="text-[var(--sidebar-active-text)] font-bold text-[13px] mt-2 hover:underline focus:outline-none"
                                        >
                                            {isDescExpanded ? "View less" : "View more"}
                                        </button>
                                    )}
                                    
                                    <div className="mt-6 border-t border-[var(--sidebar-border)]/60 pt-5 flex flex-wrap gap-x-8 gap-y-4">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 font-semibold block mb-0.5">Total Fractions</span>
                                            <span className="text-sm font-bold text-[var(--header-text)]">{property.totalFractions?.toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 font-semibold block mb-0.5">Available Fractions</span>
                                            <span className="text-sm font-bold text-[var(--header-text)]">{property.availableFractions?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Documents Card */}
                                {documents.length > 0 && (
                                    <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-[24px] p-4 sm:p-6 mb-6 shadow-sm">
                                        <h3 className="text-sm font-bold text-[var(--header-text)] mb-4">Documents</h3>
                                        <div className="space-y-3">
                                            {documents.map((doc) => {
                                                const isPdf = doc.url.toLowerCase().endsWith('.pdf');
                                                const fileType = isPdf ? 'PDF' : 'IMAGE';
                                                
                                                return (
                                                    <div
                                                        key={doc.name}
                                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl p-4 bg-[var(--card-surface)] border border-[var(--sidebar-border)] shadow-sm"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            {/* Left Document Icon/Thumbnail */}
                                                            <div className="w-12 h-12 rounded-xl bg-[var(--sidebar-active-bg)] flex items-center justify-center shrink-0 border border-[var(--sidebar-active-text)]/15">
                                                                {isPdf ? (
                                                                    <svg className="w-6 h-6 text-[var(--sidebar-active-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-6 h-6 text-[var(--sidebar-active-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-sm font-bold text-[var(--header-text)] truncate max-w-[200px] sm:max-w-[350px]">{doc.name}</h4>
                                                                <p className="text-[11px] text-[var(--color-text-muted)] font-medium mt-0.5">{fileType.toLowerCase()} document</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 self-end sm:self-auto">
                                                            {/* Document Type Badge */}
                                                            <span className="px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest bg-[var(--badge-bg)] text-[var(--sidebar-active-text)] border border-[var(--sidebar-active-text)]/20 shadow-sm">
                                                                {fileType}
                                                            </span>

                                                            {/* View Action Link */}
                                                            <a
                                                                href={doc.url.startsWith('http') ? doc.url : `${API_URL}/${doc.url}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-[var(--sidebar-active-text)] bg-[var(--sidebar-active-bg)] hover:bg-[var(--sidebar-active-bg)]/80 hover:underline transition-colors no-underline border border-[var(--sidebar-active-text)]/10"
                                                            >
                                                                VIEW
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {mainTab === "projection" && (
                            <motion.div
                                key="projection"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Projected Performance Card */}
                                <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-[24px] p-4 sm:p-6 mb-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-bold text-[var(--header-text)]">Projected Performance</h3>
                                    </div>

                                    <div className="flex gap-4 border-b border-[var(--sidebar-border)] mb-6 overflow-x-auto no-scrollbar">
                                        {[
                                            { id: "cashflow", label: "Cashflow" },
                                            { id: "rental", label: "Rental Schedule" },
                                            { id: "valuation", label: "Valuation" }
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative whitespace-nowrap cursor-pointer ${activeTab === tab.id
                                                    ? "text-[var(--sidebar-active-text)]"
                                                    : "text-[var(--color-text-muted)] hover:text-[var(--header-text)]"
                                                    }`}
                                            >
                                                {tab.label}
                                                {activeTab === tab.id && (
                                                    <motion.div
                                                        layoutId="activePerformanceTab"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--sidebar-active-text)]"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="min-h-[200px]">
                                        {activeTab === "cashflow" && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-3 text-[10px] uppercase font-bold text-[var(--color-text-muted)] pb-2 border-b border-[var(--sidebar-border)]">
                                                    <span>Year</span>
                                                    <span className="text-right">Gross Rent</span>
                                                    <span className="text-right">Net Cashflow</span>
                                                </div>
                                                {cashflowData?.data?.length > 0 ? (
                                                    cashflowData.data.map((item, index) => (
                                                        <div key={index} className="grid grid-cols-3 text-xs font-montserrat py-1">
                                                            <span className="text-[var(--color-text-muted)]">Year {item.year}</span>
                                                            <span className="text-right text-[var(--header-text)] font-semibold">{formatPrice(item.grossRent)}</span>
                                                            <span className="text-right text-[var(--color-status-success)] font-bold">{formatPrice(item.netCashflow)}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-10 text-center text-xs text-[var(--color-text-muted)] italic">
                                                        No projection data available
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === "rental" && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 text-[10px] uppercase font-bold text-[var(--color-text-muted)] pb-2 border-b border-[var(--sidebar-border)]">
                                                    <span>Period</span>
                                                    <span className="text-right">Estimated Rent</span>
                                                </div>
                                                {rentalData?.data?.length > 0 ? (
                                                    rentalData.data.map((item, index) => (
                                                        <div key={index} className="grid grid-cols-2 text-xs font-montserrat py-1">
                                                            <span className="text-[var(--color-text-muted)]">{item.period || `Year ${item.year}`}</span>
                                                            <span className="text-right text-[var(--header-text)] font-semibold">{formatPrice(item.amount || item.rent)}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-10 text-center text-xs text-[var(--color-text-muted)] italic">
                                                        No rental schedule data available
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === "valuation" && (
                                            <div className="space-y-6">
                                                <div className="space-y-4">
                                                    {valuationData?.data?.length > 0 ? (
                                                        valuationData.data.map((item, index) => (
                                                            <div key={index} className="space-y-1.5">
                                                                <div className="flex justify-between text-xs">
                                                                    <span className="text-[var(--color-text-muted)] font-medium">Year {item.year}</span>
                                                                    <span className="text-[var(--header-text)] font-bold">{formatPrice(item.valuation)}</span>
                                                                </div>
                                                                <div className="h-1.5 bg-[var(--sidebar-border)] rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${(item.valuation / valuationData.data[valuationData.data.length - 1].valuation) * 100}%` }}
                                                                        className="h-full bg-gradient-to-r from-[var(--sidebar-active-text)]/40 to-[var(--sidebar-active-text)]"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="py-10 text-center text-xs text-[var(--color-text-muted)] italic">
                                                            No valuation projections available
                                                        </div>
                                                    )}
                                                </div>
                                                {irrData?.data && (
                                                    <div className="p-4 rounded-2xl bg-[var(--card-surface)] border border-[var(--sidebar-border)] flex items-center justify-between shadow-sm">
                                                        <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)]">Projected IRR</span>
                                                        <span className="text-lg font-bold text-[var(--sidebar-active-text)]">{irrData.data.irr || irrData.data}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {mainTab === "financial" && (
                            <motion.div
                                key="financial"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Financial Details Card */}
                                <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-[24px] p-5 sm:p-6 mb-6 shadow-sm">
                                    <h3 className="text-sm font-bold text-[var(--header-text)] mb-4">Financial Structure</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-[var(--sidebar-border)]/45 text-sm">
                                            <span className="text-[var(--color-text-muted)] font-medium">Expected Yield</span>
                                            <span className="font-bold text-[var(--header-text)]">{property.expectedYield}% p.a.</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-[var(--sidebar-border)]/45 text-sm">
                                            <span className="text-[var(--color-text-muted)] font-medium">Expected Annual Rent</span>
                                            <span className="font-bold text-[var(--header-text)]">{property.expectedAnnualRent}% p.a.</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-[var(--sidebar-border)]/45 text-sm">
                                            <span className="text-[var(--color-text-muted)] font-medium">Rental Growth Rate</span>
                                            <span className="font-bold text-[var(--header-text)]">{property.rentalGrowthRate}% p.a.</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-[var(--sidebar-border)]/45 text-sm">
                                            <span className="text-[var(--color-text-muted)] font-medium">Expected Appreciation Rate</span>
                                            <span className="font-bold text-[var(--header-text)]">{property.expectedAppreciationRate}% p.a.</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-[var(--sidebar-border)]/45 text-sm">
                                            <span className="text-[var(--color-text-muted)] font-medium">Operating Cost Rate</span>
                                            <span className="font-bold text-red-500">-{property.operatingCostRate}% p.a.</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 text-sm font-bold">
                                            <span className="text-[var(--header-text)]">Calculated Return Rate</span>
                                            <span className="text-[var(--sidebar-active-text)]">
                                                {(
                                                    parseFloat(property.expectedYield || 0) +
                                                    parseFloat(property.expectedAnnualRent || 0) +
                                                    parseFloat(property.rentalGrowthRate || 0) +
                                                    parseFloat(property.expectedAppreciationRate || 0) -
                                                    parseFloat(property.operatingCostRate || 0)
                                                ).toFixed(1)}% p.a.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>


                <motion.div
                    className="w-full lg:w-80 xl:w-96 flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.15 }}
                >
                    <div
                        className="rounded-[24px] p-5 sm:p-6 lg:sticky lg:top-24 bg-[var(--card-surface)] border border-[var(--sidebar-border)] shadow-xl"
                    >
                        <p className="text-[10px] uppercase tracking-[2px] text-[var(--color-text-muted)]/60 mb-1 font-semibold ">Per Fraction</p>
                        <p className="text-md sm:text-3xl font-bold text-[var(--header-text)] mb-5">
                            {formatPrice(property.fractionPrice)}
                        </p>

                        <div className="space-y-3 mb-6">
                            <div className="w-full bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl p-5 flex flex-col items-center justify-center py-8 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#00DAAF] shadow-[0_0_10px_#00DAAF]"></div>
                                    <span className="text-[var(--header-text)] font-bold text-lg">Coming Soon</span>
                                </div>
                                <p className="text-[var(--color-text-muted)] text-xs">Fractional investment opens shortly</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div >


            <InvestModal
                isOpen={investOpen}
                onClose={() => setInvestOpen(false)}
                property={property}
                onVerifyPay={handleVerifyPay}
            />
            <PaymentModal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                flow="primary"
                asset={{
                    assetId: params.id as string,
                    name: property.title,
                    currentValue: formatPrice(property.fractionPrice * investQuantity),
                    fractions: investQuantity,
                }}
                onSuccess={handlePaymentSuccess}
            />
            <KYCModal
                isOpen={kycOpen}
                onClose={() => setKycOpen(false)}
                onSubmit={handleKycSubmit}
            />
            {
                confirmType === "kyc" && (
                    <ConfirmationModal
                        isOpen={true}
                        onClose={handleKycConfirmClose}
                        type="kyc"
                    />
                )
            }
        </div >
    );
}
