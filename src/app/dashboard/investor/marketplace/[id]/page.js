"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPinIcon } from "@/components/VectorImages";
import { PROPERTIES } from "@/data/propertyData";
import InvestModal from "@/components/dashboard/InvestModal";
import KYCModal from "@/components/dashboard/KYCModal";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";

import { useGetAssetByIdQuery } from "@/store/api/assetApi";
import { useCreateInvestmentMutation } from "@/store/api/investmentApi";
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
    const [createInvestment, { isLoading: isInvesting }] = useCreateInvestmentMutation();

    const [investOpen, setInvestOpen] = useState(false);
    const [kycOpen, setKycOpen] = useState(false);
    const [confirmType, setConfirmType] = useState(null);
    const [investQuantity, setInvestQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        ? (propertyImage.startsWith('http') ? propertyImage : `${API_URL}/${propertyImage.replace(/^\//, '')}`)
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
        if (kycData?.status !== "APPROVED") {
            if (kycData?.status !== "UNDER_REVIEW") {
                setKycOpen(true);
            } else {
                alert("Your KYC is currently under review. Please wait for approval before investing.");
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
            setConfirmType("confirmed");
        } catch (err) {
            console.error("Investment failed:", err);
            alert("Investment failed. Please try again.");
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
        setConfirmType("confirmed");
    };

    const handleFinalClose = () => {
        setConfirmType(null);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen">
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


                        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-[var(--sidebar-bg)]/80 text-[var(--color-text-muted)] border border-[var(--sidebar-border)] backdrop-blur-sm">
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


                    <p className="text-sm rounded-xl p-3 sm:p-4 text-[var(--color-text-muted)] leading-relaxed mb-6 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] font-montserrat tracking-tight shadow-sm">
                        {property.description}
                    </p>


                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <div
                            className="rounded-xl p-3 sm:p-4 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] shadow-sm"
                        >
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 mb-1 font-semibold">Valuation</p>
                            <p className="text-base sm:text-lg font-bold text-[var(--header-text)]">{formatValuation(property.valuation)}</p>
                        </div >
                        <div
                            className="rounded-xl p-3 sm:p-4 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] shadow-sm"
                        >
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 mb-1 font-semibold">Yield</p>
                            <p className="text-base sm:text-lg font-bold text-[var(--sidebar-active-text)]">{property.expectedYield}%</p>
                        </div >
                        <div
                            className="rounded-xl p-3 sm:p-4 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] shadow-sm"
                        >
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 mb-1 font-semibold">Risk Level</p>
                            <p className={`text-base sm:text-lg font-bold ${property.riskRating === 'LOW' ? 'text-[var(--color-status-success)]' :
                                property.riskRating === 'HIGH' ? 'text-[var(--color-status-error)]' :
                                    'text-[var(--color-status-warning)]'
                                }`}>{property.riskRating}</p>
                        </div >
                        <div
                            className="rounded-xl p-3 sm:p-4 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] shadow-sm"
                        >
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/60 mb-1 font-semibold">Fractions</p>
                            <p className="text-base sm:text-lg font-bold text-[var(--header-text)]">{property.totalFractions?.toLocaleString()}</p>
                        </div>
                    </div >


                    {documents.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-[var(--header-text)] mb-3">Documents</h3>
                            <div className="space-y-2">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.name}
                                        className="flex items-center justify-between rounded-xl px-4 py-3 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] shadow-sm"
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
                        className="rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] shadow-xl"
                    >
                        <p className="text-[10px] uppercase tracking-[2px] text-[var(--color-text-muted)]/60 mb-1 font-semibold">Per Fraction</p>
                        <p className="text-2xl sm:text-3xl font-bold text-[var(--header-text)] mb-5">
                            ${Number(property.fractionPrice)?.toLocaleString()}
                        </p>

                        <div className="space-y-3 mb-6">
                            <motion.button
                                onClick={handleInvestNow}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 rounded-full bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] font-bold text-sm cursor-pointer border-0 transition-all hover:opacity-90 shadow-[var(--shadow-glow-primary)]"
                            >
                                Invest Now
                            </motion.button>
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
                    />
                )
            }
        </div >
    );
}
