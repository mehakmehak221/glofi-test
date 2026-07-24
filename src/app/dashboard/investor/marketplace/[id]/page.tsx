"use client";

import { useState, useEffect } from "react";
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

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
        }
    }, []);

    const { data: property, isLoading, isError } = useGetAssetByIdQuery(assetId);
    const { data: returnsData } = useGetAssetReturnsQuery(assetId);
    const { data: cashflowData } = useGetAssetCashflowQuery(assetId);
    const { data: irrData } = useGetAssetIrrCurveQuery(assetId);
    const { data: rentalData } = useGetAssetRentalScheduleQuery(assetId);
    const { data: valuationData } = useGetAssetProjectedValuationQuery(assetId);

    const { data: kycData } = useGetKycStatusQuery(undefined, { skip: !isLoggedIn });
    const { data: investmentsData, refetch: refetchInvestments } = useGetInvestmentsQuery(undefined, { skip: !isLoggedIn });
    const [activeTab, setActiveTab] = useState("cashflow");
    const [mainTab, setMainTab] = useState("overview");
    const [investOpen, setInvestOpen] = useState(false);
    const [kycOpen, setKycOpen] = useState(false);
    const [confirmType, setConfirmType] = useState(null);
    const [investQuantity, setInvestQuantity] = useState(1);
    const [investStatus, setInvestStatus] = useState("");
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    const [purchaseMode, setPurchaseMode] = useState<"fractional" | "whole">("fractional");

    useEffect(() => {
        if (property) {
            if (property.saleType === 'WHOLE') {
                setPurchaseMode("whole");
                setInvestQuantity(property.totalFractions || 1);
            } else {
                setPurchaseMode("fractional");
                setInvestQuantity(1);
            }
        }
    }, [property]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isShareDropdownOpen && !(event.target as Element).closest('.share-container')) {
                setIsShareDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isShareDropdownOpen]);

    const getShareUrl = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/assets/${assetId}`;
        }
        return `https://www.glofiestates.com/assets/${assetId}`;
    };

    const handleCopyLink = () => {
        const url = getShareUrl();
        navigator.clipboard.writeText(url);
        showToast("Link copied to clipboard!");
        setIsShareDropdownOpen(false);
    };

    const handleShareWhatsApp = () => {
        const url = getShareUrl();
        const text = `Check out this premium property on Glofi Estates: ${property?.title || ""}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, "_blank");
        setIsShareDropdownOpen(false);
    };

    const handleShareEmail = () => {
        const url = getShareUrl();
        const subject = `Premium Property Opportunity: ${property?.title || ""}`;
        const body = `Hi,\n\nI found this interesting property on Glofi Estates and thought you might like to see it:\n\n${property?.title || ""}\nLocation: ${property?.location || ""}\nValuation: ₹${Number(property?.valuation || 0).toLocaleString('en-IN')}\n\nView details here: ${url}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_self");
        setIsShareDropdownOpen(false);
    };

    const handleShareTwitter = () => {
        const url = getShareUrl();
        const text = `Check out this premium property on Glofi Estates: ${property?.title || ""}`;
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
        setIsShareDropdownOpen(false);
    };

    const handleShareLinkedIn = () => {
        const url = getShareUrl();
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
        setIsShareDropdownOpen(false);
    };

    const [hoveredPoint, setHoveredPoint] = useState<"current" | "projected" | null>(null);
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const [hoveredCashflowPoint, setHoveredCashflowPoint] = useState<number | null>(null);

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
                <Link
                    href={isLoggedIn ? "/dashboard/investor/marketplace" : "/"}
                    className="text-[var(--color-primary-300)] hover:underline"
                >
                    {isLoggedIn ? "Back to Marketplace" : "Back to Home"}
                </Link>
            </div>
        );
    }

    const propertyImage = property.images?.[0];

    const fractionPrice = Number(property.fractionPrice) && Number(property.fractionPrice) !== Number(property.valuation)
        ? Number(property.fractionPrice)
        : (Number(property.valuation) / (Number(property.totalFractions) || 1));
    const annualReturnPercent = (
        parseFloat(property.expectedYield || 0) +
        parseFloat(property.expectedAnnualRent || 0) +
        parseFloat(property.rentalGrowthRate || 0) +
        parseFloat(property.expectedAppreciationRate || 0) -
        parseFloat(property.operatingCostRate || 0)
    );
    const projectedVal = fractionPrice * (1 + annualReturnPercent / 100);
    const totalReturnAmount = fractionPrice * (annualReturnPercent / 100);
    const payoutPerQuarter = totalReturnAmount / 4;
    const imageUrl = propertyImage
        ? (propertyImage.startsWith('http') ? propertyImage : `${API_URL}/${propertyImage.replace(/^\/+/, '')}`)
        : "/assets/images/content/img_ext_0.jpeg";

    const fundedPercentage = Math.round(((property.totalFractions - property.availableFractions) / property.totalFractions) * 100);

    const documents = [
        { name: "Ownership Proof / Backing Document", url: property.titleDeedUrl },
        { name: "Valuation Report", url: property.valuationReportUrl },
        { name: "Legal Opinion", url: property.legalOpinionUrl },
    ].filter(doc => doc.url);

    const handleInvestNow = () => {
        if (!isLoggedIn) {
            router.push(`/sign-up?redirect=${encodeURIComponent(`/assets/${assetId}`)}`);
            return;
        }
        setInvestOpen(true);
    };

    const handleVerifyPay = async (qty) => {
        setInvestQuantity(qty);
        setInvestOpen(false);
        showToast("Coming soon!");
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
        <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen overflow-x-hidden max-w-[100vw]">
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
                    className="flex-1 min-w-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative w-full h-80 sm:h-96 lg:h-[450px] rounded-2xl overflow-hidden mb-5 border border-[var(--sidebar-border)]/50 shadow-sm">
                        <Image
                            src={imageUrl}
                            alt={property.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0" style={{ background: 'var(--marketplace-card-overlay)' }} />


                        {isLoggedIn ? (
                            <Link
                                href="/dashboard/investor/marketplace"
                                className="absolute top-3 left-3 sm:top-4 sm:left-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-black/45 hover:bg-black/60 text-white border border-white/10 backdrop-blur-md transition-all shadow-md group z-20 cursor-pointer"
                            >
                                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                        ) : (
                            <button
                                onClick={() => router.back()}
                                className="absolute top-3 left-3 sm:top-4 sm:left-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-black/45 hover:bg-black/60 text-white border border-white/10 backdrop-blur-md transition-all shadow-md group z-20 cursor-pointer"
                            >
                                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}


                        <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#FFFFFF] text-[#111111] border border-white/40 shadow-md z-10">
                            {property.category?.replace(/_/g, ' ')}
                        </span>


                        <span className="absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white border border-white/10 backdrop-blur-md shadow-sm z-10">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor] ${property.riskRating === 'LOW'
                                ? 'bg-[#00DAAF] text-[#00DAAF]'
                                : property.riskRating === 'HIGH'
                                    ? 'bg-[#FF5C5C] text-[#FF5C5C]'
                                    : 'bg-[#E8940C] text-[#E8940C]'
                                }`} />
                            {property.riskRating} RISK
                        </span>
                    </div >

                    {/* Name and Location Section */}
                    <div className="mb-5 px-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--header-text)] mb-1.5 tracking-tight">{property.title}</h1>
                            <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-xs font-semibold">
                                <MapPinIcon className="w-3.5 h-3.5 text-[var(--sidebar-active-text)]" />
                                {property.location}
                            </div>
                        </div>
                        {/* Share Button & Dropdown */}
                        <div className="relative share-container">
                            <button
                                onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] text-sm font-semibold text-[var(--header-text)] hover:bg-[var(--card-surface)] transition-all cursor-pointer shadow-sm"
                            >
                                <svg className="w-4 h-4 text-[var(--sidebar-active-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.57-2.286M8.684 13.258l4.57 2.286M2 12a10 10 0 0110-10c5.523 0 10 4.477 10 10s-4.477 10-10 10a10 10 0 01-10-10z" />
                                    <circle cx="18" cy="5" r="3" />
                                    <circle cx="6" cy="12" r="3" />
                                    <circle cx="18" cy="19" r="3" />
                                </svg>
                                Share
                            </button>
                            <AnimatePresence>
                                {isShareDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] shadow-xl z-50 overflow-hidden font-montserrat"
                                    >
                                        <div className="p-1.5 flex flex-col gap-1">
                                            <button
                                                onClick={handleShareWhatsApp}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--header-text)] hover:bg-[var(--card-surface)] transition-all text-left cursor-pointer"
                                            >
                                                <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.069.993 11.999.993c-5.444 0-9.87 4.373-9.874 9.8.001 2.02.531 3.993 1.539 5.733l-.999 3.65 3.748-.98a9.8 9.8 0 004.144.958zm10.748-7.397c-.296-.148-1.747-.862-2.019-.962-.272-.099-.47-.148-.668.148-.198.297-.766.962-.939 1.16-.173.199-.347.223-.643.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.174.2-.298.3-.496.099-.198.05-.371-.025-.521-.075-.148-.668-1.609-.916-2.203-.242-.582-.487-.504-.668-.513l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.747-.713 1.995-1.402.248-.689.248-1.28.173-1.402-.075-.125-.272-.198-.57-.347z"/>
                                                </svg>
                                                WhatsApp
                                            </button>
                                            <button
                                                onClick={handleCopyLink}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--header-text)] hover:bg-[var(--card-surface)] transition-all text-left cursor-pointer"
                                            >
                                                <svg className="w-4 h-4 text-[var(--sidebar-active-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                </svg>
                                                Copy Link
                                            </button>
                                            <button
                                                onClick={handleShareEmail}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--header-text)] hover:bg-[var(--card-surface)] transition-all text-left cursor-pointer"
                                            >
                                                <svg className="w-4 h-4 text-[#D44638]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                Email
                                            </button>
                                            <button
                                                onClick={handleShareTwitter}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--header-text)] hover:bg-[var(--card-surface)] transition-all text-left cursor-pointer"
                                            >
                                                <svg className="w-4 h-4 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                                </svg>
                                                Twitter / X
                                            </button>
                                            <button
                                                onClick={handleShareLinkedIn}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--header-text)] hover:bg-[var(--card-surface)] transition-all text-left cursor-pointer"
                                            >
                                                <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                </svg>
                                                LinkedIn
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Valuation, Per Fraction, and Annual Return Stats Card */}
                    <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
                        <div className="grid grid-cols-3 divide-x divide-[var(--sidebar-border)]/65 text-center items-center">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-semibold">Valuation</p>
                                <div className="relative group inline-block w-full">
                                    <p className="text-base font-bold text-[var(--header-text)] truncate px-1 cursor-default">{formatPrice(property.valuation, true)}</p>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 hidden group-hover:block pointer-events-none">
                                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] text-[var(--header-text)] text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                                            ₹{Number(property.valuation).toLocaleString('en-IN')}
                                        </div>
                                        <div className="w-2 h-2 bg-[var(--card-surface)] border-r border-b border-[var(--sidebar-border)] rotate-45 mx-auto -mt-1" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-semibold">Per Fraction</p>
                                <div className="relative group inline-block w-full">
                                    <p className="text-base font-bold text-[var(--header-text)] truncate px-1 cursor-default">
                                        ₹{Number(fractionPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 hidden group-hover:block pointer-events-none">
                                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] text-[var(--header-text)] text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                                            ₹{Number(fractionPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className="w-2 h-2 bg-[var(--card-surface)] border-r border-b border-[var(--sidebar-border)] rotate-45 mx-auto -mt-1" />
                                    </div>
                                </div>
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
                                className={`flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all cursor-pointer ${mainTab === tab.id
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
                                className="space-y-6"
                            >

                                <div>
                                    <h3 className="text-[15px] font-bold text-[var(--header-text)] mb-3 px-1">Project Valuations</h3>
                                    <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-[24px] p-4 sm:p-5 shadow-sm">
                                        {(() => {
                                            const CH = 140;
                                            const yMin = Math.round(fractionPrice - Math.max(projectedVal - fractionPrice, 100) * 0.2);
                                            const yMax = Math.round(projectedVal + Math.max(projectedVal - fractionPrice, 100) * 0.3);
                                            const range = Math.max(1, yMax - yMin);
                                            const step = range / 4;
                                            const yLabels = [yMax, Math.round(yMax - step), Math.round(yMax - step * 2), Math.round(yMax - step * 3), yMin];
                                            const getY = (val: number) => CH - ((val - yMin) / range) * CH;
                                            const cY = getY(fractionPrice);
                                            const pY = getY(projectedVal);
                                            const pathD = `M 70,${cY} C 140,${cY} 160,${pY} 230,${pY}`;
                                            const areaD = `${pathD} L 230,${CH} L 70,${CH} Z`;
                                            return (
                                                <>
                                                    <div className="flex gap-3">
                                                        {/* Y labels */}
                                                        <div className="flex flex-col justify-between" style={{ minWidth: '56px' }}>
                                                            {yLabels.map((v, i) => (
                                                                <span key={i} className="text-[10px] text-right block text-[var(--color-text-muted)] font-semibold leading-none font-montserrat">{formatPrice(v)}</span>
                                                            ))}
                                                        </div>
                                                        {/* Chart */}
                                                        <div className="flex-1">
                                                            <svg className="w-full" viewBox={`0 0 300 ${CH}`}>
                                                                <defs>
                                                                    <linearGradient id="valGradient" x1="0" y1="0" x2="0" y2="1">
                                                                        <stop offset="0%" stopColor="#00DAAF" stopOpacity="0.15" />
                                                                        <stop offset="100%" stopColor="#00DAAF" stopOpacity="0" />
                                                                    </linearGradient>
                                                                </defs>
                                                                {[0, 35, 70, 105, 140].map((y, i) => (
                                                                    <line key={i} x1="0" y1={y} x2="300" y2={y} stroke="var(--sidebar-border)" strokeWidth="0.6" strokeOpacity="0.8" />
                                                                ))}
                                                                <path d={areaD} fill="url(#valGradient)" />
                                                                <path d={pathD} fill="none" stroke="#00DAAF" strokeWidth="2.5" strokeLinecap="round" />
                                                                <circle cx={70} cy={cY} r={8} fill="#00DAAF" fillOpacity={hoveredPoint === 'current' ? 0.2 : 0} className="transition-all duration-200" />
                                                                <circle cx={70} cy={cY} r={4.5} fill="#00DAAF" stroke="#FFF" strokeWidth={1.5} className="cursor-pointer" onMouseEnter={() => setHoveredPoint('current')} onMouseLeave={() => setHoveredPoint(null)} />
                                                                <circle cx={230} cy={pY} r={8} fill="#00DAAF" fillOpacity={hoveredPoint === 'projected' ? 0.2 : 0} className="transition-all duration-200" />
                                                                <circle cx={230} cy={pY} r={4.5} fill="#00DAAF" stroke="#FFF" strokeWidth={1.5} className="cursor-pointer" onMouseEnter={() => setHoveredPoint('projected')} onMouseLeave={() => setHoveredPoint(null)} />
                                                                {hoveredPoint === 'current' && (
                                                                    <g transform={`translate(70,${Math.max(cY - 22, 16)})`}>
                                                                        <rect x="-40" y="-12" width="80" height="20" rx="5" fill="var(--card-surface)" stroke="var(--sidebar-border)" strokeWidth="1" />
                                                                        <text x="0" y="3" textAnchor="middle" fontSize="9" fill="var(--header-text)" fontWeight="700">{formatPrice(fractionPrice)}</text>
                                                                    </g>
                                                                )}
                                                                {hoveredPoint === 'projected' && (
                                                                    <g transform={`translate(230,${Math.max(pY - 22, 16)})`}>
                                                                        <rect x="-40" y="-12" width="80" height="20" rx="5" fill="var(--card-surface)" stroke="var(--sidebar-border)" strokeWidth="1" />
                                                                        <text x="0" y="3" textAnchor="middle" fontSize="9" fill="var(--header-text)" fontWeight="700">{formatPrice(projectedVal)}</text>
                                                                    </g>
                                                                )}
                                                            </svg>
                                                            <div className="flex justify-between mt-2">
                                                                <span className="text-[10px] font-bold text-[var(--color-text-muted)] ml-[18%]">Current</span>
                                                                <span className="text-[10px] font-bold text-[var(--color-text-muted)] mr-[10%]">Projected</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium mt-3">Tap a point for value</p>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>


                                <div>
                                    <h3 className="text-[15px] font-bold text-[var(--header-text)] mb-3 px-1">Project Returns</h3>
                                    <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl overflow-hidden shadow-sm">
                                        <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--sidebar-border)]/50">
                                            <span className="text-sm font-medium text-[var(--color-text-muted)]">Total Return %</span>
                                            <span className="text-sm font-bold text-[var(--header-text)]">{annualReturnPercent.toFixed(2)}%</span>
                                        </div>
                                        <div className="flex justify-between items-center px-5 py-4">
                                            <span className="text-sm font-medium text-[var(--color-text-muted)]">Total Return Amount</span>
                                            <span className="text-sm font-bold text-[var(--header-text)]">{formatPrice(totalReturnAmount)}</span>
                                        </div>
                                    </div>
                                </div>


                                <div>
                                    <h3 className="text-[15px] font-bold text-[var(--header-text)] mb-3 px-1">Return Schedule</h3>
                                    <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-[24px] p-4 sm:p-5 shadow-sm">
                                        {(() => {
                                            const CH = 140;
                                            const hi = payoutPerQuarter * 1.25;
                                            const lo = payoutPerQuarter * 0.75;
                                            const rng = Math.max(1, hi - lo);
                                            const s = rng / 4;
                                            const yLabels = [hi, hi - s, hi - s * 2, hi - s * 3, lo];
                                            const barCenters = [37, 112, 188, 263];
                                            const BW = 44;
                                            return (
                                                <>
                                                    <div className="flex gap-3">
                                                        <div className="flex flex-col justify-between" style={{ minWidth: '56px' }}>
                                                            {yLabels.map((v, i) => (
                                                                <span key={i} className="text-[10px] text-right block text-[var(--color-text-muted)] font-semibold leading-none font-montserrat">{formatPrice(v)}</span>
                                                            ))}
                                                        </div>
                                                        <div className="flex-1">
                                                            <svg className="w-full" viewBox={`0 0 300 ${CH}`}>
                                                                {[0, 35, 70, 105, 140].map((y, i) => (
                                                                    <line key={i} x1="0" y1={y} x2="300" y2={y} stroke="var(--sidebar-border)" strokeWidth="0.6" strokeOpacity="0.8" />
                                                                ))}
                                                                {barCenters.map((cx, idx) => {
                                                                    const isHov = hoveredBar === idx;
                                                                    return (
                                                                        <g key={idx} onMouseEnter={() => setHoveredBar(idx)} onMouseLeave={() => setHoveredBar(null)} className="cursor-pointer">
                                                                            <rect x={cx - 30} y="0" width="60" height={CH} fill="transparent" />
                                                                            <rect x={cx - BW / 2} y={10} width={BW} height={CH - 10} rx="12" fill="#00DAAF" opacity={hoveredBar === null || isHov ? 1 : 0.7} className="transition-all duration-200" />
                                                                            {isHov && (
                                                                                <g transform={`translate(${cx},4)`}>
                                                                                    <rect x="-40" y="-12" width="80" height="20" rx="5" fill="var(--card-surface)" stroke="var(--sidebar-border)" strokeWidth="1" />
                                                                                    <text x="0" y="3" textAnchor="middle" fontSize="9" fill="var(--header-text)" fontWeight="700">{formatPrice(payoutPerQuarter)}</text>
                                                                                </g>
                                                                            )}
                                                                        </g>
                                                                    );
                                                                })}
                                                            </svg>
                                                            <div className="flex mt-2">
                                                                {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
                                                                    <span key={i} className="text-[10px] font-bold text-[var(--color-text-muted)] font-montserrat text-center" style={{ width: '25%' }}>{q}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium mt-3">Tap a bar for payout</p>
                                                </>
                                            );
                                        })()}
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
                                className="space-y-6"
                            >

                                <div>
                                    <h3 className="text-[15px] font-bold text-[var(--header-text)] mb-3 px-1">Cashflow</h3>
                                    <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-[24px] p-4 sm:p-5 shadow-sm">
                                        {(() => {
                                            const CH = 140;
                                            const rawCashflow = cashflowData?.data || [];
                                            const hasReal = Array.isArray(rawCashflow) && rawCashflow.length > 0 && rawCashflow.some((item: any) => (item.amount || item.netCashflow || 0) > 0);
                                            let pts: { label: string; value: number }[] = hasReal
                                                ? rawCashflow.map((item: any, i: number) => ({ label: item.period || `P${i + 1}`, value: Number(item.amount || item.netCashflow || 0) }))
                                                : [{ label: 'P1', value: 0 }];
                                            const maxV = Math.max(1, ...pts.map(p => p.value));
                                            const minV = Math.min(0, ...pts.map(p => p.value));
                                            const range = Math.max(1, maxV - minV);
                                            const step = range / 4;
                                            const yLabels = [maxV, maxV - step, maxV - step * 2, maxV - step * 3, minV].map(v => formatPrice(v));
                                            const getY = (v: number) => CH - ((v - minV) / range) * CH;
                                            const n = pts.length;
                                            const coords = pts.map((p, i) => ({ ...p, x: n === 1 ? 150 : 20 + (i * 260) / (n - 1), y: getY(p.value) }));
                                            const linePath = coords.length > 1 ? coords.reduce((a, p, i) => a + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y} `, '') : '';
                                            const areaPath = coords.length > 1 ? `${linePath} L ${coords[coords.length - 1].x} ${CH} L ${coords[0].x} ${CH} Z` : '';
                                            return (
                                                <>
                                                    <div className="flex gap-3">
                                                        <div className="flex flex-col justify-between" style={{ minWidth: '56px' }}>
                                                            {yLabels.map((lbl, i) => (
                                                                <span key={i} className="text-[10px] text-right block text-[var(--color-text-muted)] font-semibold leading-none font-montserrat">{lbl}</span>
                                                            ))}
                                                        </div>
                                                        <div className="flex-1">
                                                            <svg className="w-full" viewBox={`0 0 300 ${CH}`}>
                                                                <defs>
                                                                    <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                                                                        <stop offset="0%" stopColor="#00DAAF" stopOpacity="0.15" />
                                                                        <stop offset="100%" stopColor="#00DAAF" stopOpacity="0" />
                                                                    </linearGradient>
                                                                </defs>
                                                                {[0, 35, 70, 105, 140].map((y, i) => (
                                                                    <line key={i} x1="0" y1={y} x2="300" y2={y} stroke="var(--sidebar-border)" strokeWidth="0.6" strokeOpacity="0.8" />
                                                                ))}
                                                                {hasReal && coords.length > 1 && (
                                                                    <>
                                                                        <path d={areaPath} fill="url(#cashGradient)" />
                                                                        <path d={linePath} fill="none" stroke="#00DAAF" strokeWidth="2.5" strokeLinecap="round" />
                                                                    </>
                                                                )}
                                                                {coords.map((p, idx) => {
                                                                    const isHov = hoveredCashflowPoint === idx;
                                                                    return (
                                                                        <g key={idx} onMouseEnter={() => setHoveredCashflowPoint(idx)} onMouseLeave={() => setHoveredCashflowPoint(null)} className="cursor-pointer">
                                                                            <circle cx={p.x} cy={p.y} r={10} fill="#00DAAF" fillOpacity={isHov ? 0.2 : 0} className="transition-all duration-200" />
                                                                            <circle cx={p.x} cy={p.y} r={4.5} fill="#00DAAF" stroke="#FFF" strokeWidth={1.5} />
                                                                            {isHov && (
                                                                                <g transform={`translate(${p.x},${Math.max(p.y - 22, 16)})`}>
                                                                                    <rect x="-40" y="-12" width="80" height="20" rx="5" fill="var(--card-surface)" stroke="var(--sidebar-border)" strokeWidth="1" />
                                                                                    <text x="0" y="3" textAnchor="middle" fontSize="9" fill="var(--header-text)" fontWeight="700">{formatPrice(p.value)}</text>
                                                                                </g>
                                                                            )}
                                                                        </g>
                                                                    );
                                                                })}
                                                            </svg>
                                                            <div className="flex mt-2" style={{ justifyContent: n === 1 ? 'center' : 'space-between' }}>
                                                                {coords.map((p, i) => (
                                                                    <span key={i} className="text-[10px] font-bold text-[var(--color-text-muted)] font-montserrat text-center" style={{ width: n > 1 ? `${100 / n}%` : 'auto' }}>{p.label}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium mt-3">Tap a point for value</p>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div >


                <motion.div
                    className="w-full lg:w-80 xl:w-96 flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.15 }}
                >
                    <div
                        className="rounded-[24px] p-5 sm:p-6 lg:sticky  bg-[var(--card-surface)] border border-[var(--sidebar-border)] shadow-xl"
                    >
                        <p className="text-[10px] uppercase tracking-[2px] text-[var(--color-text-muted)]/60 mb-1 font-semibold ">Per Fraction</p>
                        <p className="text-md sm:text-3xl font-bold text-[var(--header-text)] mb-5">
                            ₹{Number(fractionPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>

                        <div className="space-y-4 mb-6">
                            {/* Only show the fraction calculator if there are multiple fractions to select (i.e. not a whole asset purchase type or available fractions <= 1) */}
                            {property.saleType !== 'WHOLE' && (property.totalFractions || 1) > 1 && (
                                <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm sm:text-base font-bold text-[var(--header-text)]">Select Fractions</h3>
                                    </div>
                                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium mb-4">
                                        Available: {property.availableFractions?.toLocaleString() || "20,000"} fractions
                                    </p>

                                    <div className="relative mb-5 flex items-center">
                                        <input
                                            type="range"
                                            min="1"
                                            max={Math.min(property.availableFractions || 20000, 100)}
                                            value={investQuantity}
                                            onChange={(e) => setInvestQuantity(Number(e.target.value))}
                                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary-300)] focus:outline-none"
                                            style={{
                                                background: `linear-gradient(to right, var(--color-primary-300) 0%, var(--color-primary-300) ${((investQuantity - 1) / (Math.min(property.availableFractions || 20000, 100) - 1)) * 100
                                                    }%, var(--sidebar-border) ${((investQuantity - 1) / (Math.min(property.availableFractions || 20000, 100) - 1)) * 100
                                                    }%, var(--sidebar-border) 100%)`
                                            }}
                                        />
                                    </div>

                                    <div className="flex gap-2 justify-between mb-4">
                                        {[1, 2, 5, 10, 25, 50].map((num) => {
                                            const isSelected = investQuantity === num;
                                            return (
                                                <button
                                                    key={num}
                                                    onClick={() => setInvestQuantity(num)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${isSelected
                                                        ? "bg-[var(--color-primary-300)] text-black border border-[var(--color-primary-300)] shadow-sm font-extrabold"
                                                        : "bg-[var(--card-surface)] text-[var(--header-text)] border border-[var(--sidebar-border)] hover:bg-[var(--sidebar-active-bg)]"
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-between items-center border-t border-[var(--sidebar-border)]/65 pt-3 mt-3">
                                        <span className="text-xs font-semibold text-[var(--color-text-muted)]">Fractions selected</span>
                                        <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-[var(--color-primary-300)]/15 text-[var(--sidebar-active-text)] border border-[var(--color-primary-300)]/20 shadow-sm">
                                            {investQuantity}
                                        </span>
                                    </div>
                                </div>
                            )}


                            <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
                                <h3 className="text-sm sm:text-base font-bold text-[var(--header-text)] mb-4">Investment Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-[var(--color-text-muted)] font-medium">Price per fraction</span>
                                        <span className="text-[var(--header-text)] font-semibold">
                                            ₹{Number(fractionPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-[var(--color-text-muted)] font-medium">Fractions</span>
                                        <span className="text-[var(--header-text)] font-semibold">× {investQuantity}</span>
                                    </div>
                                    <div className="h-px bg-[var(--sidebar-border)]/50 my-1" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-[var(--header-text)]">Total Investment</span>
                                        <span className="text-base font-black text-[var(--sidebar-active-text)]">
                                            ₹{Number(fractionPrice * investQuantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[var(--color-primary-300)]/10 border border-[var(--color-primary-300)]/20 rounded-xl p-3 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 text-[var(--sidebar-active-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="text-xs font-bold text-[var(--sidebar-active-text)]">
                                    Estimated Returns ({annualReturnPercent.toFixed(1)}% p.a.)
                                </span>
                            </div>



                            <div className="relative">
                                <button
                                    onClick={handleInvestNow}
                                    className="w-full py-4 rounded-xl bg-[var(--color-primary-300)] text-black font-bold text-sm border-0 transition-all cursor-pointer select-none hover:opacity-90 shadow-glow-primary"
                                >
                                    Invest Now
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div >


            <InvestModal
                isOpen={investOpen}
                onClose={() => setInvestOpen(false)}
                property={property}
                purchaseMode={purchaseMode}
                initialQuantity={investQuantity}
                onVerifyPay={handleVerifyPay}
            />
            <PaymentModal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                flow="primary"
                asset={{
                    assetId: params.id as string,
                    name: property.title,
                    currentValue: formatPrice(fractionPrice * investQuantity),
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
