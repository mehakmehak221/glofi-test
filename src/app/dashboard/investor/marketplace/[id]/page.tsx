"use client";

import { useRef, useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinIcon, ShareIcon } from "@/components/VectorImages";
import { PROPERTIES } from "@/data/propertyData";
import InvestModal from "@/components/dashboard/InvestModal";
import KYCModal from "@/components/dashboard/KYCModal";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import PaymentModal from "@/components/dashboard/PaymentModal";
import PropertyShareModal from "@/components/dashboard/investor/PropertyShareModal";

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
import { useGetUserCouponsQuery, useValidateCouponMutation } from "@/store/api/rewardsApi";

import { API_URL } from "@/constants";

import { useCurrency } from "@/providers/CurrencyProvider";
import { useI18n } from "@/providers/LocaleProvider";

export default function PropertyDetailPage() {
    const { formatPrice, currency } = useCurrency();
    const { t } = useI18n();
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const assetId = params.id as string;

    const [isLoggedIn] = useState(() => typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true");
    const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);

    const { data: property, isLoading, isError } = useGetAssetByIdQuery(assetId);
    const { data: returnsData } = useGetAssetReturnsQuery(assetId, { skip: !isLoggedIn });
    const { data: cashflowData } = useGetAssetCashflowQuery(assetId, { skip: !isLoggedIn });
    const { data: irrData } = useGetAssetIrrCurveQuery(assetId, { skip: !isLoggedIn });
    const { data: rentalData } = useGetAssetRentalScheduleQuery(assetId, { skip: !isLoggedIn });
    const { data: valuationData } = useGetAssetProjectedValuationQuery(assetId, { skip: !isLoggedIn });

    const { data: kycData } = useGetKycStatusQuery(undefined, { skip: !isLoggedIn });
    const { data: investmentsData, refetch: refetchInvestments } = useGetInvestmentsQuery(undefined, { skip: !isLoggedIn });
    const { data: activeCoupons = [], isLoading: couponsLoading, isError: couponsError } = useGetUserCouponsQuery(undefined, { skip: !isLoggedIn });
    const [activeTab, setActiveTab] = useState("cashflow");
    const [mainTab, setMainTab] = useState("overview");
    const [investOpen, setInvestOpen] = useState(false);
    const [kycOpen, setKycOpen] = useState(false);
    const [confirmType, setConfirmType] = useState(null);
    const [investQuantity, setInvestQuantity] = useState(1);
    const [investStatus, setInvestStatus] = useState("");
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [pendingInvestment, setPendingInvestment] = useState<{ quantity: number; total: number; discount: number } | null>(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const couponSectionRef = useRef<HTMLDivElement | null>(null);
    const [validateCoupon, { isLoading: validatingCoupon }] = useValidateCouponMutation();
    const sharedCouponCode = searchParams.get("coupon")?.trim() || "";
    const sharedCouponCampaign = searchParams.get("campaign")?.trim() || "";
    const [couponCode, setCouponCode] = useState(() => sharedCouponCode);
    const [couponInvestmentAmount, setCouponInvestmentAmount] = useState("");
    const [couponValidationState, setCouponValidationState] = useState<{
        isValid?: boolean;
        discountAmount?: number;
        message?: string;
        coupon?: { code?: string; type?: string; value?: number };
    } | null>(null);
    const [couponValidationError, setCouponValidationError] = useState("");

    const purchaseMode: "fractional" | "whole" = property?.saleType === 'WHOLE' ? "whole" : "fractional";
    const selectedInvestQuantity = property?.saleType === 'WHOLE' ? (property.totalFractions || 1) : investQuantity;

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
            return `${window.location.origin}/property?id=${assetId}`;
        }
        return `https://www.glofiestates.com/property?id=${assetId}`;
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
    const selectedInvestmentSubtotal = fractionPrice * selectedInvestQuantity;
    const couponValidatedAmount = Number(couponInvestmentAmount);
    const couponDiscountCandidate = Number(couponValidationState?.discountAmount || 0);
    const couponMatchesSelection =
        Boolean(couponValidationState?.isValid) &&
        Number.isFinite(couponDiscountCandidate) &&
        Number.isFinite(couponValidatedAmount) &&
        Math.abs(couponValidatedAmount - selectedInvestmentSubtotal) < 0.01;
    const appliedCouponDiscount = couponMatchesSelection ? Math.min(couponDiscountCandidate, selectedInvestmentSubtotal) : 0;
    const discountedInvestmentSubtotal = Math.max(0, selectedInvestmentSubtotal - appliedCouponDiscount);
    const discountedInvestmentFee = discountedInvestmentSubtotal * 0.02;
    const discountedInvestmentTotal = discountedInvestmentSubtotal + discountedInvestmentFee;
    const imageUrl = propertyImage
        ? (propertyImage.startsWith('http') ? propertyImage : `${API_URL}/${propertyImage.replace(/^\/+/, '')}`)
        : "/assets/images/content/img_ext_0.jpeg";

    const fundedPercentage = Math.round(((property.totalFractions - property.availableFractions) / property.totalFractions) * 100);

    const documents = [
        { name: t("Ownership Proof / Backing Document"), url: property.titleDeedUrl },
        { name: t("Valuation Report"), url: property.valuationReportUrl },
        { name: t("Legal Opinion"), url: property.legalOpinionUrl },
    ].filter(doc => doc.url);

    const handleInvestNow = () => {
        if (!isLoggedIn) {
            showToast("Coming soon!");
            return;
        }
        setInvestOpen(true);
    };

    const handleVerifyPay = async (qty: number, total: number, discount: number = 0) => {
        setInvestQuantity(qty);
        setInvestOpen(false);
        setPendingInvestment({ quantity: qty, total, discount });
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

    const handleValidateCoupon = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCouponValidationError("");
        setCouponValidationState(null);

        const code = couponCode.trim();
        const amount = Number(couponInvestmentAmount);

        if (!code) {
            setCouponValidationError("Please enter a coupon code first.");
            return;
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            setCouponValidationError("Please enter a valid investment amount.");
            return;
        }

        try {
            const result = await validateCoupon({
                code,
                investmentAmount: amount,
                assetId,
            }).unwrap();

            setCouponValidationState(result);
            showToast(result.isValid ? "Coupon validated successfully." : "Coupon is invalid.", result.isValid ? "success" : "warning");
        } catch (err: any) {
            const message = err?.data?.message || err?.message || "Coupon validation failed.";
            setCouponValidationError(message);
        }
    };

    const handleCopyCouponCode = async () => {
        const code = couponCode.trim() || sharedCouponCode;
        if (!code) return;

        try {
            await navigator.clipboard.writeText(code);
            showToast("Coupon code copied.");
        } catch {
            showToast("Copy failed. Manually select the code.", "warning");
        }
    };

    const scrollToCouponSection = () => {
        couponSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const formatCouponValue = (coupon: { type?: string; value?: number | string; maximumDiscount?: number | string | null }) => {
        const value = Number(coupon.value || 0);
        const maxDiscount = Number(coupon.maximumDiscount || 0);
        if (coupon.type === "PERCENTAGE") {
            return `${value}% off${maxDiscount > 0 ? ` up to ${formatPrice(maxDiscount)}` : ""}`;
        }
        return `${formatPrice(value)} off`;
    };

    const handleApplyCoupon = async (code: string) => {
        setCouponCode(code);
        setCouponValidationError("");
        setCouponValidationState(null);
        if (!couponInvestmentAmount) {
            setCouponInvestmentAmount(String(fractionPrice * selectedInvestQuantity));
        }
        scrollToCouponSection();
        showToast(`Coupon ${code} applied to the form.`);
    };

    return (
        <div className="bg-[var(--background)] min-h-screen overflow-x-hidden max-w-[100vw] px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-8 max-w-screen-2xl mx-auto">
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[9999] px-4 sm:px-5 py-3 rounded-full shadow-2xl font-montserrat text-xs sm:text-sm font-semibold flex items-center gap-2 bg-neutral-900 border border-neutral-700 text-white whitespace-normal text-center max-w-[calc(100vw-1.5rem)]`}
                    >
                        {toast.type === "success" ? (
                            <svg className="w-5 h-5 text-[#00DAAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ) : toast.type === "warning" ? (
                            <svg className="w-5 h-5 text-[#FE9A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        ) : (
                            <svg className="w-5 h-5 text-[#FF5C5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col xl:flex-row gap-6">

                <motion.div
                    className="flex-1 min-w-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative w-full aspect-[16/11] sm:aspect-[16/10] xl:aspect-[16/7] xl:h-[450px] rounded-2xl overflow-hidden mb-5 border border-[var(--sidebar-border)]/50 shadow-sm">
                        <Image
                            src={imageUrl}
                            alt={property.title}
                            fill
                            sizes="(max-width: 1279px) 100vw, 68vw"
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
                    <div className="mb-5 px-1 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--header-text)] mb-1.5 tracking-tight break-words leading-tight">
                                {property.title}
                            </h1>
                            <div className="flex items-start gap-1.5 text-[var(--color-text-muted)] text-xs font-semibold break-words">
                                <MapPinIcon className="w-3.5 h-3.5 text-[var(--sidebar-active-text)]" />
                                <span className="min-w-0 break-words">{property.location}</span>
                            </div>
                        </div>
                        {/* Share Button & Modal */}
                        <div className="w-full sm:w-auto">
                            <button
                                onClick={() => setIsShareDropdownOpen(true)}
                                className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] text-sm font-semibold text-[var(--header-text)] hover:bg-[var(--card-surface)] transition-all cursor-pointer shadow-sm"
                            >
                                <ShareIcon className="w-4 h-4 text-[var(--sidebar-active-text)]" />
                                Share
                            </button>
                            <PropertyShareModal
                                isOpen={isShareDropdownOpen}
                                onClose={() => setIsShareDropdownOpen(false)}
                                propertyTitle={property.title || "GloFi Property"}
                                propertyId={assetId}
                                showToast={showToast}
                            />
                        </div>
                    </div>

                    {/* Valuation, Per Fraction, and Annual Return Stats Card */}
                    <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-0 sm:divide-x sm:divide-[var(--sidebar-border)]/65 text-left sm:text-center items-stretch">
                            <div className="min-w-0 rounded-xl sm:rounded-none p-3 sm:p-0">
                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-semibold">{t("Valuation")}</p>
                                <div className="relative group inline-block w-full">
                                    <p className="text-sm sm:text-base font-bold text-[var(--header-text)] break-words leading-tight px-1 cursor-default">{formatPrice(property.valuation, true)}</p>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 hidden group-hover:block pointer-events-none">
                                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] text-[var(--header-text)] text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                                            ₹{Number(property.valuation).toLocaleString('en-IN')}
                                        </div>
                                        <div className="w-2 h-2 bg-[var(--card-surface)] border-r border-b border-[var(--sidebar-border)] rotate-45 mx-auto -mt-1" />
                                    </div>
                                </div>
                            </div>
                            <div className="min-w-0 rounded-xl sm:rounded-none p-3 sm:p-0">
                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-semibold">{property.saleType === 'WHOLE' ? t('Whole Price') : t('Per Fraction')}</p>
                                <div className="relative group inline-block w-full">
                                    <p className="text-sm sm:text-base font-bold text-[var(--header-text)] break-words leading-tight px-1 cursor-default">
                                        {formatPrice(fractionPrice, true)}
                                    </p>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 hidden group-hover:block pointer-events-none">
                                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] text-[var(--header-text)] text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                                            {formatPrice(fractionPrice)}
                                        </div>
                                        <div className="w-2 h-2 bg-[var(--card-surface)] border-r border-b border-[var(--sidebar-border)] rotate-45 mx-auto -mt-1" />
                                    </div>
                                </div>
                            </div>
                            <div className="min-w-0 rounded-xl sm:rounded-none p-3 sm:p-0">
                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-semibold">{t("Potential Annual Return")}</p>
                                <p className="text-sm sm:text-base font-bold text-[var(--sidebar-active-text)] break-words leading-tight">
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
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                            <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--color-text-muted)]">{t("Funding Progress")}</span>
                            <span className="text-sm font-bold text-[var(--sidebar-active-text)]">{t("{percent}% funded", { percent: fundedPercentage })}</span>
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
                            <span className="text-[var(--color-text-muted)]">{t("{count} fractions remaining", { count: property.availableFractions?.toLocaleString() })}</span>
                            <span className="text-[var(--sidebar-active-text)]">
                                {(
                                    parseFloat(property.expectedYield || 0) +
                                    parseFloat(property.expectedAnnualRent || 0) +
                                    parseFloat(property.rentalGrowthRate || 0) +
                                    parseFloat(property.expectedAppreciationRate || 0) -
                                    parseFloat(property.operatingCostRate || 0)
                                ).toFixed(1)}% {t("p.a.")}
                            </span>
                        </div>
                    </div>

                    {/* Top Segmented Tab Control */}
                    <div className="flex bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-full p-1 mb-6 shadow-sm overflow-hidden">
                        {[
                            { id: "overview", label: t("Overview") },
                            { id: "projection", label: t("Projection") },
                            { id: "financial", label: t("Financial") }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setMainTab(tab.id)}
                                className={`flex-1 py-2.5 rounded-full text-[11px] sm:text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap px-2 ${mainTab === tab.id
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
                                        <h3 className="text-sm font-bold text-[var(--header-text)] mb-4 px-1">{t("Images")}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-1">
                                            {property.images.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--sidebar-border)] shadow-sm cursor-pointer hover:scale-[1.01] transition-transform duration-200 min-w-0"
                                                    onClick={() => setLightboxIndex(idx)}
                                                >
                                                    <Image
                                                        src={img.startsWith('http') ? img : `${API_URL}/${img.replace(/^\/+/, '')}`}
                                                        alt={`${property.title} image ${idx + 1}`}
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                                    <h3 className="text-[15px] font-bold text-[var(--header-text)] mb-3">{t("About this property")}</h3>
                                    <div className={`text-[13px] text-[var(--color-text-muted)] leading-relaxed font-montserrat tracking-tight ${!isDescExpanded ? "line-clamp-4" : ""}`}>
                                        {property.description}
                                    </div>
                                    {(property.description?.length || 0) > 250 && (
                                        <button
                                            onClick={() => setIsDescExpanded(!isDescExpanded)}
                                            className="text-[var(--sidebar-active-text)] font-bold text-[13px] mt-2 hover:underline focus:outline-none"
                                        >
                                            {isDescExpanded ? t("View less") : t("View more")}
                                        </button>
                                    )}

                                    <div className="mt-6 border-t border-[var(--sidebar-border)]/60 pt-5 flex flex-wrap gap-x-8 gap-y-4">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 font-semibold block mb-0.5">{t("Total Fractions")}</span>
                                            <span className="text-sm font-bold text-[var(--header-text)]">{property.totalFractions?.toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 font-semibold block mb-0.5">{t("Available Fractions")}</span>
                                            <span className="text-sm font-bold text-[var(--header-text)]">{property.availableFractions?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {documents.length > 0 && (
                                    <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-[24px] p-4 sm:p-6 mb-6 shadow-sm">
                                        <h3 className="text-sm font-bold text-[var(--header-text)] mb-4">{t("Documents")}</h3>
                                        <div className="space-y-3">
                                            {documents.map((doc) => {
                                                const isPdf = doc.url.toLowerCase().endsWith('.pdf');
                                                const fileType = isPdf ? 'PDF' : 'IMAGE';

                                                return (
                                                    <div
                                                        key={doc.name}
                                                        className="flex flex-col gap-4 rounded-2xl p-4 bg-[var(--card-surface)] border border-[var(--sidebar-border)] shadow-sm md:flex-row md:items-center md:justify-between"
                                                    >
                                                        <div className="flex min-w-0 flex-1 items-center gap-4">
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
                                                            <div className="min-w-0 flex-1">
                                                                <h4 className="text-sm font-bold text-[var(--header-text)] truncate max-w-full md:max-w-[260px] lg:max-w-[350px]">{doc.name}</h4>
                                                                <p className="text-[11px] text-[var(--color-text-muted)] font-medium mt-0.5">{t(fileType.toLowerCase() + " document")}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:justify-end md:shrink-0">
                                                            <span className="px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest bg-[var(--badge-bg)] text-[var(--sidebar-active-text)] border border-[var(--sidebar-active-text)]/20 shadow-sm whitespace-nowrap">
                                                                {t(fileType)}
                                                            </span>


                                                            <a
                                                                href={doc.url.startsWith('http') ? doc.url : `${API_URL}/${doc.url}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-[var(--sidebar-active-text)] bg-[var(--sidebar-active-bg)] hover:bg-[var(--sidebar-active-bg)]/80 hover:underline transition-colors no-underline border border-[var(--sidebar-active-text)]/10 whitespace-nowrap"
                                                            >
                                                                {t("VIEW")}
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
                                                                        <rect x="-50" y="-12" width="100" height="20" rx="10" fill="var(--card-surface)" />
                                                                        <text x="0" y="3" textAnchor="middle" fontSize="7" fill="var(--header-text)" fontWeight="700">{formatPrice(fractionPrice)}</text>
                                                                    </g>
                                                                )}
                                                                {hoveredPoint === 'projected' && (
                                                                    <g transform={`translate(230,${Math.max(pY - 22, 16)})`}>
                                                                        <rect x="-50" y="-12" width="100" height="20" rx="10" fill="var(--card-surface)" />
                                                                        <text x="0" y="3" textAnchor="middle" fontSize="7" fill="var(--header-text)" fontWeight="700">{formatPrice(projectedVal)}</text>
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
                                                                                    <rect x="-50" y="-12" width="100" height="20" rx="10" fill="var(--card-surface)" />
                                                                                    <text x="0" y="3" textAnchor="middle" fontSize="7" fill="var(--header-text)" fontWeight="700">{formatPrice(payoutPerQuarter)}</text>
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
                                                                                    <rect x="-50" y="-12" width="100" height="20" rx="10" fill="var(--card-surface)" />
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
                        className="rounded-[24px] p-5 sm:p-6 bg-[var(--card-surface)] border border-[var(--sidebar-border)] shadow-xl"
                    >
                        <p className="text-[10px] uppercase tracking-[2px] text-[var(--color-text-muted)]/60 mb-1 font-semibold ">{property.saleType === 'WHOLE' ? t('Whole Price') : t('Per Fraction')}</p>
                        <p className="text-md sm:text-3xl font-bold text-[var(--header-text)] mb-5">
                            {formatPrice(fractionPrice, true)}
                        </p>

                        {sharedCouponCode ? (
                            <div className="mb-5 rounded-2xl border border-[var(--color-primary-300)]/20 bg-[linear-gradient(135deg,rgba(0,218,175,0.14),rgba(0,0,0,0.06))] p-4">
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full border border-[var(--color-primary-300)]/25 bg-[var(--background)] px-3 py-1 text-xs font-black tracking-[0.14em] text-[var(--header-text)]">
                                        {sharedCouponCode}
                                    </span>
                                    {sharedCouponCampaign ? (
                                        <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                                            {sharedCouponCampaign}
                                        </span>
                                    ) : null}
                                    <button
                                        type="button"
                                        onClick={handleCopyCouponCode}
                                        className="rounded-full border border-[var(--sidebar-border)] bg-[var(--background)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--header-text)]"
                                    >
                                        Copy code
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        <div className="space-y-4 mb-6">
                            {/* Only show the fraction calculator if there are multiple fractions to select (i.e. not a whole asset purchase type or available fractions <= 1) */}
                            {property.saleType !== 'WHOLE' && (property.totalFractions || 1) > 1 && (
                                <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm sm:text-base font-bold text-[var(--header-text)]">{t("Select Fractions")}</h3>
                                    </div>
                                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium mb-4">
                                        {t("Available: {count} fractions", { count: property.availableFractions?.toLocaleString() || "20,000" })}
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

                                    <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 mb-4">
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
                                        <span className="text-xs font-semibold text-[var(--color-text-muted)]">{t("Fractions selected")}</span>
                                        <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-[var(--color-primary-300)]/15 text-[var(--sidebar-active-text)] border border-[var(--color-primary-300)]/20 shadow-sm">
                                            {investQuantity}
                                        </span>
                                    </div>
                                </div>
                            )}


                            <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
                                <h3 className="text-sm sm:text-base font-bold text-[var(--header-text)] mb-4">{t("Investment Summary")}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-[var(--color-text-muted)] font-medium">{property.saleType === 'WHOLE' ? t('Whole Price') : t('Price per fraction')}</span>
                                        <span className="text-[var(--header-text)] font-semibold">
                                            {formatPrice(fractionPrice)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-[var(--color-text-muted)] font-medium">{t("Fractions")}</span>
                                        <span className="text-[var(--header-text)] font-semibold">× {investQuantity}</span>
                                    </div>
                                    <div className="h-px bg-[var(--sidebar-border)]/50 my-1" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-[var(--header-text)]">{t("Total Investment")}</span>
                                        <span className="text-base font-black text-[var(--sidebar-active-text)]">
                                            {formatPrice(fractionPrice * investQuantity, true)}
                                        </span>
                                    </div>
                                </div>
                             </div>

                            <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 shadow-sm">

                                {couponsLoading ? (
                                    <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] px-4 py-3 text-xs text-[var(--color-text-muted)]">
                                        {t("Loading active coupons...")}
                                    </div>
                                ) : couponsError ? (
                                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                                        {t("Failed to load active coupons.")}
                                    </div>
                                ) : activeCoupons.length === 0 ? (
                                    <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] px-4 py-3 text-xs text-[var(--color-text-muted)]">
                                        {t("No active coupons available right now.")}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {activeCoupons.map((coupon) => (
                                            <div key={coupon.id} className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="rounded-full border border-[var(--color-primary-300)]/20 bg-[var(--color-primary-300)]/10 px-3 py-1 text-[10px] font-black tracking-[0.16em] text-[var(--sidebar-active-text)]">
                                                                {coupon.code}
                                                            </span>
                                                            <span className="rounded-full border border-[var(--sidebar-border)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                                                                {coupon.type}
                                                            </span>
                                                        </div>
                                                        <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                                                            {formatCouponValue(coupon)}
                                                        </p>
                                                        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                                                            {t("Min investment {amount}", { amount: formatPrice(Number(coupon.minimumInvestment || 0)) })} · {t("Expires")} {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("en-IN") : "—"}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApplyCoupon(coupon.code)}
                                                            className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-primary-300)] px-4 text-xs font-bold uppercase tracking-wider text-black"
                                                        >
                                                            {t("Apply")}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                await navigator.clipboard.writeText(coupon.code);
                                                                showToast(`Copied ${coupon.code}`);
                                                             }}
                                                            className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]"
                                                        >
                                                            {t("Copy")}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div ref={couponSectionRef} className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <h3 className="text-sm sm:text-base font-bold text-[var(--header-text)]">{t("Validate Coupon")}</h3>
                                    {couponValidationState ? (
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${couponValidationState.isValid ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/10" : "border-red-500/20 text-red-400 bg-red-500/10"}`}>
                                            {couponValidationState.isValid ? t("Valid") : t("Invalid")}
                                        </span>
                                    ) : null}
                                </div>

                                <form onSubmit={handleValidateCoupon} className="space-y-3">
                                    <input
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder={t("Coupon code")}
                                        className="w-full h-11 rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-primary-300)]"
                                    />
                                    <input
                                        value={couponInvestmentAmount}
                                        onChange={(e) => setCouponInvestmentAmount(e.target.value)}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder={t("Investment amount")}
                                        className="w-full h-11 rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-primary-300)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <input
                                        value={assetId}
                                        readOnly
                                        className="w-full h-11 rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm text-[var(--color-text-muted)] outline-none opacity-80"
                                        aria-label="Asset ID"
                                    />
                                    {couponValidationError ? (
                                        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                                            {couponValidationError}
                                        </div>
                                    ) : null}
                                    {couponValidationState ? (
                                        <div className="rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 py-3 text-xs text-[var(--foreground)]">
                                            <p className="font-semibold">
                                                {couponValidationState.isValid ? t("Coupon valid") : t("Coupon invalid")}
                                            </p>
                                            <p className="mt-1 text-[var(--color-text-muted)]">
                                                {couponValidationState.coupon?.code
                                                    ? `${couponValidationState.coupon.code} · ${couponValidationState.coupon.type}`
                                                    : couponValidationState.message || t("Validation completed.")}
                                            </p>
                                            {typeof couponValidationState.discountAmount === "number" ? (
                                                <p className="mt-2 font-bold">
                                                    {t("Discount:")} {formatPrice(couponValidationState.discountAmount)}
                                                </p>
                                            ) : null}
                                        </div>
                                    ) : null}
                                    <button
                                        type="submit"
                                        disabled={validatingCoupon}
                                        className="w-full h-11 rounded-xl bg-[var(--color-primary-300)] text-black font-bold text-xs uppercase tracking-wider border-0 disabled:opacity-50"
                                    >
                                        {validatingCoupon ? t("Validating...") : t("Validate Coupon")}
                                    </button>
                                </form>
                            </div>

                            <div className="bg-[var(--color-primary-300)]/10 border border-[var(--color-primary-300)]/20 rounded-xl p-3 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 text-[var(--sidebar-active-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="text-xs font-bold text-[var(--sidebar-active-text)] text-center">
                                    {t("Estimated Returns ({rate}% p.a.)", { rate: annualReturnPercent.toFixed(1) })}
                                </span>
                            </div>



                            <div className="relative">
                                <button
                                    onClick={handleInvestNow}
                                    className="w-full py-4 rounded-xl bg-[var(--color-primary-300)] text-black font-bold text-sm border-0 transition-all cursor-pointer select-none hover:opacity-90 shadow-glow-primary"
                                >
                                    {t("Invest Now")}
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
                initialQuantity={selectedInvestQuantity}
                discountAmount={appliedCouponDiscount}
                couponCode={couponMatchesSelection ? couponCode.trim() || sharedCouponCode : ""}
                onVerifyPay={handleVerifyPay}
            />
            <PaymentModal
                isOpen={paymentModalOpen}
                onClose={() => {
                    setPaymentModalOpen(false);
                    setPendingInvestment(null);
                }}
                flow="primary"
                asset={{
                    assetId: params.id as string,
                    name: property.title,
                    currentValue: formatPrice(pendingInvestment?.total ?? discountedInvestmentTotal),
                    fractions: pendingInvestment?.quantity ?? selectedInvestQuantity,
                    couponCode: couponMatchesSelection ? couponCode.trim() || sharedCouponCode : undefined,
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
            {/* Lightbox Overlay */}
            {lightboxIndex !== null && property?.images && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={() => setLightboxIndex(null)}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/10 rounded-full text-white text-sm font-semibold font-montserrat">
                        {lightboxIndex + 1} / {property.images.length}
                    </div>

                    {/* Prev */}
                    {lightboxIndex > 0 && (
                        <button
                            className="absolute left-3 sm:left-6 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="relative w-[92vw] max-w-3xl h-[62vh] sm:h-[70vh] rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={property.images[lightboxIndex].startsWith('http')
                                ? property.images[lightboxIndex]
                                : `${API_URL}/${property.images[lightboxIndex].replace(/^[/\\]+/, '')}`}
                            alt={`${property.title} image ${lightboxIndex + 1}`}
                            fill
                            sizes="90vw"
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Next */}
                    {lightboxIndex < property.images.length - 1 && (
                        <button
                            className="absolute right-3 sm:right-6 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Thumbnail strip */}
                    <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 px-3 sm:px-4 overflow-x-auto max-w-[calc(100vw-1rem)] sm:max-w-[90vw]">
                        {property.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                                className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${idx === lightboxIndex ? 'border-[#00DAAF] scale-110' : 'border-white/20 opacity-60 hover:opacity-100'}`}
                            >
                                <Image
                                    src={img.startsWith('http') ? img : `${API_URL}/${img.replace(new RegExp('^[\\\\/]+'), '')}`}
                                    alt={`thumb ${idx + 1}`}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div >
    );
}
