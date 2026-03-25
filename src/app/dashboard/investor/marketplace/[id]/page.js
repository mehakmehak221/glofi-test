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

import { useGetAssetByIdQuery } from "@/store/api/assetApi";
import { useCreateInvestmentMutation, useGetInvestmentsQuery } from "@/store/api/investmentApi";
import { useGetKycStatusQuery } from "@/store/api/kycApi";

import { API_URL } from "@/constants";

const formatValuation = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "N/A";
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toLocaleString()}`;
};

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: property, isLoading, isError } = useGetAssetByIdQuery(params.id);
    const { data: kycData } = useGetKycStatusQuery();
    const { data: investmentsData, refetch: refetchInvestments } = useGetInvestmentsQuery();
    const [createInvestment, { isLoading: isInvesting }] = useCreateInvestmentMutation();

    const [investOpen, setInvestOpen] = useState(false);
    const [kycOpen, setKycOpen] = useState(false);
    const [confirmType, setConfirmType] = useState(null);
    const [investQuantity, setInvestQuantity] = useState(1);
    const [investStatus, setInvestStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        : "/assets/img_ext_0.jpeg";

    const fundedPercentage = Math.round(((property.totalFractions - property.availableFractions) / property.totalFractions) * 100);

    const documents = [
        { name: "Title Deed", url: property.titleDeedUrl },
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

        // If KYC is already approved, proceed to investment
        try {
            setIsSubmitting(true);
            const result = await createInvestment({
                assetId: params.id,
                fractions: qty,
                paymentMethod: "UPI",
                currency: "USD",
            }).unwrap();

            console.log("Investment successful:", result);
            showToast("Investment successful! You can view it in your portfolio.");
            refetchInvestments();
            setInvestStatus(result?.data?.status || result?.status || "PENDING");
            setConfirmType("confirmed");
        } catch (err) {
            console.error("Investment failed:", err);
            showToast(err?.data?.message || "Investment failed. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
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
                        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-lg font-montserrat text-sm font-semibold flex items-center gap-2 ${toast.type === "success"
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

                    <div className="relative w-full h-56 sm:h-72 lg:h-80 rounded-2xl overflow-hidden mb-5">
                        <Image
                            src={imageUrl}
                            alt={property.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0" style={{ background: 'var(--marketplace-card-overlay)' }} />


                        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-[var(--background)]/80 text-[var(--color-text-muted)] border border-[var(--sidebar-border)] backdrop-blur-sm">
                            {property.category?.replace('_', ' ')}
                        </span>


                        <span className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-1 rounded-md text-[10px] font-normal uppercase tracking-wider ${property.riskRating === 'LOW' ? 'text-[var(--color-status-success)] bg-[var(--color-status-success-bg)]' :
                            property.riskRating === 'HIGH' ? 'text-[var(--color-status-error)] bg-[var(--color-status-error-bg)]' :
                                'text-[var(--color-status-warning)] bg-[var(--color-status-warning-bg)]'
                            }`}>
                            {property.riskRating}
                        </span>


                        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                            <h1 className="text-xl sm:text-2xl font-bold text-[var(--header-text)] mb-1">{property.title}</h1>
                            <div className="flex items-center gap-1.5 text-[var(--sidebar-text)] text-xs font-semibold">
                                <MapPinIcon className="w-3.5 h-3.5" />
                                {property.location}
                            </div>
                        </div>
                    </div >


                    <p className="text-sm rounded-xl p-3 sm:p-4 text-[var(--color-text-muted)] leading-relaxed mb-6 bg-[var(--background)] border border-[var(--sidebar-border)] font-montserrat tracking-tight shadow-sm">
                        {property.description}
                    </p>


                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <div
                            className="rounded-xl p-3 sm:p-4 bg-[var(--background)] border border-[var(--sidebar-border)] shadow-sm overflow-hidden"
                        >
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 mb-1 font-semibold truncate">Valuation</p>
                            <p className="text-base sm:text-lg font-bold text-[var(--header-text)] truncate">{formatValuation(property.valuation)}</p>
                        </div >
                        <div
                            className="rounded-xl p-3 sm:p-4 bg-[var(--background)] border border-[var(--sidebar-border)] shadow-sm overflow-hidden"
                        >
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 mb-1 font-semibold truncate">Yield</p>
                            <p className="text-base sm:text-lg font-bold text-[var(--sidebar-active-text)] truncate">{Number(property.expectedYield).toFixed(2)}%</p>
                        </div >
                        <div
                            className="rounded-xl p-3 sm:p-4 bg-[var(--background)] border border-[var(--sidebar-border)] shadow-sm overflow-hidden"
                        >
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 mb-1 font-semibold truncate">Risk Level</p>
                            <p className={`text-base sm:text-lg font-bold truncate ${property.riskRating === 'LOW' ? 'text-[var(--color-status-success)]' :
                                property.riskRating === 'HIGH' ? 'text-[var(--color-status-error)]' :
                                    'text-[var(--color-status-warning)]'
                                }`}>{property.riskRating}</p>
                        </div >
                        <div
                            className="rounded-xl p-3 sm:p-4 bg-[var(--background)] border border-[var(--sidebar-border)] shadow-sm overflow-hidden"
                        >
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 mb-1 font-semibold truncate">Fractions</p>
                            <p className="text-base sm:text-lg font-bold text-[var(--header-text)] truncate">{property.totalFractions?.toLocaleString()}</p>
                        </div>
                    </div >


                    {documents.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-[var(--header-text)] mb-3">Documents</h3>
                            <div className="space-y-2">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.name}
                                        className="flex items-center justify-between rounded-xl px-4 py-3 bg-[var(--background)] border border-[var(--sidebar-border)] shadow-sm"
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
                </motion.div>


                <motion.div
                    className="w-full lg:w-80 xl:w-96 flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.15 }}
                >
                    <div
                        className="rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24 bg-[var(--background)] border border-[var(--sidebar-border)] shadow-xl"
                    >
                        <p className="text-[10px] uppercase tracking-[2px] text-[var(--color-text-muted)]/60 mb-1 font-semibold">Per Fraction</p>
                        <p className="text-2xl sm:text-3xl font-bold text-[var(--header-text)] mb-5">
                            ${Number(property.fractionPrice)?.toLocaleString()}
                        </p>

                        <div className="space-y-3 mb-6">
                            {userInvestment ? (
                                <div className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 ${userInvestment.status === 'PENDING' ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-[var(--sidebar-active-text)]/30 bg-[var(--sidebar-active-bg)]'
                                    }`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${userInvestment.status === 'PENDING' ? 'bg-yellow-500/20' : 'bg-[var(--sidebar-active-text)]/20'
                                        }`}>
                                        {userInvestment.status === 'PENDING' ? (
                                            <svg className="w-5 h-5 text-yellow-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-[var(--sidebar-active-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <h4 className={`font-bold text-sm uppercase tracking-wider ${userInvestment.status === 'PENDING' ? 'text-yellow-500' : 'text-[var(--sidebar-active-text)]'
                                        }`}>Investment {userInvestment.status || "Processing"}</h4>
                                    <p className="text-xs text-[var(--color-text-muted)] text-center max-w-[200px] leading-relaxed">
                                        You have {userInvestment.status === 'PENDING' ? 'a pending investment' : 'successfully invested'} in <span className="font-bold text-[var(--sidebar-text)]">{userInvestment.fractions} fraction{userInvestment.fractions > 1 ? "s" : ""}</span> of this property.
                                    </p>
                                    <Link href="/dashboard/investor/portfolio" className="mt-2 text-xs font-bold text-[var(--header-text)] underline hover:text-[var(--sidebar-active-text)] transition-colors">
                                        View in Portfolio
                                    </Link>
                                </div>
                            ) : (
                                <motion.button
                                    onClick={handleInvestNow}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isSubmitting || isInvesting}
                                    className="w-full py-4 rounded-full bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] font-bold text-sm cursor-pointer border-0 transition-all hover:opacity-90 shadow-[var(--shadow-glow-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting || isInvesting ? "Processing..." : "Invest Now"}
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div >


            <InvestModal
                isOpen={investOpen}
                onClose={() => setInvestOpen(false)}
                property={property}
                onVerifyPay={handleVerifyPay}
                isLoading={isSubmitting || isInvesting}
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
            {
                confirmType === "confirmed" && (
                    <ConfirmationModal
                        isOpen={true}
                        onClose={handleFinalClose}
                        type="confirmed"
                        propertyName={property.title}
                        quantity={investQuantity}
                        status={investStatus}
                    />
                )
            }
        </div >
    );
}
