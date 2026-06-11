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
    const [investOpen, setInvestOpen] = useState(false);
    const [kycOpen, setKycOpen] = useState(false);
    const [confirmType, setConfirmType] = useState(null);
    const [investQuantity, setInvestQuantity] = useState(1);
    const [investStatus, setInvestStatus] = useState("");
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

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

            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-5"
            >
                <Link
                    href="/dashboard/investor/marketplace"
                    className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--sidebar-active-text)] transition-colors no-underline"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </Link>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-6">

                <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >

                    <div className="relative w-full h-56 sm:h-72 lg:h-80 rounded-md overflow-hidden mb-5">
                        <Image
                            src={imageUrl}
                            alt={property.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0" style={{ background: 'var(--marketplace-card-overlay)' }} />


                        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-[#FFFFFF] text-[#111111] border border-white/40 shadow-sm">
                            {property.category?.replace('_', ' ')}
                        </span>


                        <span className="absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-black/50 text-white border border-white/10 backdrop-blur-md shadow-sm">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                property.riskRating === 'LOW'
                                    ? 'bg-[#00DAAF]'
                                    : property.riskRating === 'HIGH'
                                        ? 'bg-[#FF5C5C]'
                                        : 'bg-[#E8940C]'
                            }`} />
                            <span className="opacity-60">RISK</span>
                            <span className="opacity-30">·</span>
                            {property.riskRating}
                        </span>


                        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl bg-[var(--background)]/85 backdrop-blur-md border border-[var(--sidebar-border)]/50 shadow-sm max-w-xl">
                            <h1 className="text-xl sm:text-md font-bold text-[var(--header-text)] mb-1">{property.title}</h1>
                            <div className="flex items-center gap-1.5 text-[var(--sidebar-text)] text-xs font-semibold">
                                <MapPinIcon className="w-3.5 h-3.5" />
                                {property.location}
                            </div>
                        </div>
                    </div >


                    <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-md p-4 sm:p-6 mb-6">
                        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6 font-montserrat tracking-tight">
                            {property.description}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div
                                className="rounded-md p-3 sm:p-4 bg-[var(--card-surface)] border border-[var(--sidebar-border)] shadow-sm overflow-hidden"
                            >
                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 mb-1 font-semibold">Valuation</p>
                                <p className="text-base sm:text-lg font-bold text-[var(--header-text)]">{formatPrice(property.valuation, true)}</p>
                            </div>
                            <div
                                className="rounded-md p-3 sm:p-4 bg-[var(--card-surface)] border border-[var(--sidebar-border)] shadow-sm overflow-hidden"
                            >
                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 mb-1 font-semibold">Potential Annual Return</p>
                                <p className="text-base sm:text-lg font-bold text-[var(--sidebar-active-text)]">{
                                    (
                                        parseFloat(property.expectedYield || 0) +
                                        parseFloat(property.expectedAnnualRent || 0) +
                                        parseFloat(property.rentalGrowthRate || 0) +
                                        parseFloat(property.expectedAppreciationRate || 0) -
                                        parseFloat(property.operatingCostRate || 0)
                                    ).toFixed(2)
                                }%</p>
                            </div>
                            <div
                                className="rounded-md p-3 sm:p-4 bg-[var(--card-surface)] border border-[var(--sidebar-border)] shadow-sm overflow-hidden"
                            >
                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 mb-2 font-semibold">Risk Level</p>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${property.riskRating === 'LOW'
                                        ? 'text-[#B8FFF0] bg-[#041512] border-[#00DAAF]/60'
                                        : property.riskRating === 'HIGH'
                                            ? 'text-[#FFB4B4] bg-[#1a0808] border-[#FF5C5C]/60'
                                            : 'text-[#FFD699] bg-[#1a1206] border-[#E8940C]/70'
                                    }`}>
                                    <span className="opacity-60">RISK</span>
                                    <span className="opacity-30">·</span>
                                    {property.riskRating}
                                </span>
                            </div>
                            <div
                                className="rounded-md p-3 sm:p-4 bg-[var(--card-surface)]  border border-[var(--sidebar-border)] shadow-sm overflow-hidden"
                            >
                                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 mb-1 font-semibold">Fractions</p>
                                <p className="text-base sm:text-lg font-bold text-[var(--header-text)]">{property.totalFractions?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>


                    {documents.length > 0 && (
                        <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-md p-4 sm:p-6 mb-6">
                            <h3 className="text-sm font-bold text-[var(--header-text)] mb-4">Documents</h3>
                            <div className="space-y-3">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.name}
                                        className="flex items-center justify-between rounded-md px-4 py-3 bg-[var(--card-surface)] border border-[var(--sidebar-border)] shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-[var(--badge-bg)] flex items-center justify-center text-xs">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                    <path d="M11.6663 7.58343C11.6663 10.5001 9.62467 11.9584 7.19801 12.8043C7.07094 12.8473 6.9329 12.8453 6.80717 12.7984C4.37467 11.9584 2.33301 10.5001 2.33301 7.58343V3.5001C2.33301 3.34539 2.39447 3.19702 2.50386 3.08762C2.61326 2.97822 2.76163 2.91677 2.91634 2.91677C4.08301 2.91677 5.54134 2.21677 6.55634 1.3301C6.67992 1.22452 6.83713 1.1665 6.99967 1.1665C7.16222 1.1665 7.31943 1.22452 7.44301 1.3301C8.46384 2.2226 9.91634 2.91677 11.083 2.91677C11.2377 2.91677 11.3861 2.97822 11.4955 3.08762C11.6049 3.19702 11.6663 3.34539 11.6663 3.5001V7.58343Z" stroke="var(--sidebar-active-text)" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                            <span className="text-sm font-medium text-[var(--sidebar-text)]">{doc.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <a
                                                href={doc.url.startsWith('http') ? doc.url : `${API_URL}/${doc.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs font-bold text-[var(--sidebar-active-text)] bg-transparent border-0 cursor-pointer hover:underline no-underline"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-md p-4 sm:p-6 mb-6">
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
                                    className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${activeTab === tab.id
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
                                        <div className="p-4 rounded-md bg-[var(--card-surface)] border border-[var(--sidebar-border)] flex items-center justify-between">
                                            <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)]">Projected IRR</span>
                                            <span className="text-lg font-bold text-[var(--sidebar-active-text)]">{irrData.data.irr || irrData.data}%</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>


                <motion.div
                    className="w-full lg:w-80 xl:w-96 flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.15 }}
                >
                    <div
                        className="rounded-md p-5 sm:p-6 lg:sticky lg:top-24 bg-[var(--card-surface)] border border-[var(--sidebar-border)] shadow-xl"
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
