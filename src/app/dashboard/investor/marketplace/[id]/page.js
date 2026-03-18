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

const DOCUMENTS = [
    {
        name: "Title Deed", icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11.6663 7.58343C11.6663 10.5001 9.62467 11.9584 7.19801 12.8043C7.07094 12.8473 6.9329 12.8453 6.80717 12.7984C4.37467 11.9584 2.33301 10.5001 2.33301 7.58343V3.5001C2.33301 3.34539 2.39447 3.19702 2.50386 3.08762C2.61326 2.97822 2.76163 2.91677 2.91634 2.91677C4.08301 2.91677 5.54134 2.21677 6.55634 1.3301C6.67992 1.22452 6.83713 1.1665 6.99967 1.1665C7.16222 1.1665 7.31943 1.22452 7.44301 1.3301C8.46384 2.2226 9.91634 2.91677 11.083 2.91677C11.2377 2.91677 11.3861 2.97822 11.4955 3.08762C11.6049 3.19702 11.6663 3.34539 11.6663 3.5001V7.58343Z" stroke="var(--color-primary-300)" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    },
    {
        name: "Valuation Report", icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11.6663 7.58343C11.6663 10.5001 9.62467 11.9584 7.19801 12.8043C7.07094 12.8473 6.9329 12.8453 6.80717 12.7984C4.37467 11.9584 2.33301 10.5001 2.33301 7.58343V3.5001C2.33301 3.34539 2.39447 3.19702 2.50386 3.08762C2.61326 2.97822 2.76163 2.91677 2.91634 2.91677C4.08301 2.91677 5.54134 2.21677 6.55634 1.3301C6.67992 1.22452 6.83713 1.1665 6.99967 1.1665C7.16222 1.1665 7.31943 1.22452 7.44301 1.3301C8.46384 2.2226 9.91634 2.91677 11.083 2.91677C11.2377 2.91677 11.3861 2.97822 11.4955 3.08762C11.6049 3.19702 11.6663 3.34539 11.6663 3.5001V7.58343Z" stroke="var(--color-primary-300)" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    },
    {
        name: "Legal Opinion", icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11.6663 7.58343C11.6663 10.5001 9.62467 11.9584 7.19801 12.8043C7.07094 12.8473 6.9329 12.8453 6.80717 12.7984C4.37467 11.9584 2.33301 10.5001 2.33301 7.58343V3.5001C2.33301 3.34539 2.39447 3.19702 2.50386 3.08762C2.61326 2.97822 2.76163 2.91677 2.91634 2.91677C4.08301 2.91677 5.54134 2.21677 6.55634 1.3301C6.67992 1.22452 6.83713 1.1665 6.99967 1.1665C7.16222 1.1665 7.31943 1.22452 7.44301 1.3301C8.46384 2.2226 9.91634 2.91677 11.083 2.91677C11.2377 2.91677 11.3861 2.97822 11.4955 3.08762C11.6049 3.19702 11.6663 3.34539 11.6663 3.5001V7.58343Z" stroke="var(--color-primary-300)" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    },
    {
        name: "Zoning Approval", icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11.6663 7.58343C11.6663 10.5001 9.62467 11.9584 7.19801 12.8043C7.07094 12.8473 6.9329 12.8453 6.80717 12.7984C4.37467 11.9584 2.33301 10.5001 2.33301 7.58343V3.5001C2.33301 3.34539 2.39447 3.19702 2.50386 3.08762C2.61326 2.97822 2.76163 2.91677 2.91634 2.91677C4.08301 2.91677 5.54134 2.21677 6.55634 1.3301C6.67992 1.22452 6.83713 1.1665 6.99967 1.1665C7.16222 1.1665 7.31943 1.22452 7.44301 1.3301C8.46384 2.2226 9.91634 2.91677 11.083 2.91677C11.2377 2.91677 11.3861 2.97822 11.4955 3.08762C11.6049 3.19702 11.6663 3.34539 11.6663 3.5001V7.58343Z" stroke="var(--color-primary-300)" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    },
];

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const property = PROPERTIES.find((p) => p.id === Number(params.id));

    const [investOpen, setInvestOpen] = useState(false);
    const [kycOpen, setKycOpen] = useState(false);
    const [confirmType, setConfirmType] = useState(null);
    const [investQuantity, setInvestQuantity] = useState(1);

    if (!property) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 bg-[var(--color-bg-dark)] min-h-screen flex items-center justify-center">
                <p className="text-white">Property not found</p>
            </div>
        );
    }

    const handleInvestNow = () => setInvestOpen(true);

    const handleVerifyPay = (qty) => {
        setInvestQuantity(qty);
        setInvestOpen(false);
        setKycOpen(true);
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
        <div className="p-4 sm:p-6 lg:p-8 bg-[var(--color-bg-dark)] min-h-screen">

            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-5"
            >
                <Link
                    href="/dashboard/investor/marketplace"
                    className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-white transition-colors no-underline"
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
                            src={property.image}
                            alt={property.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />


                        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-bg-dark)]/80 text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] backdrop-blur-sm">
                            {property.category}
                        </span>


                        <span className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-1 rounded-md text-[10px] font-normal uppercase tracking-wider ${property.riskTextColor} ${property.riskColor}`}>
                            {property.risk}
                        </span>


                        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">{property.name}</h1>
                            <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)] text-xs">
                                <MapPinIcon className="w-3.5 h-3.5" />
                                {property.location}
                            </div>
                        </div>
                    </div>


                    <p className="text-sm rounded-xl p-3 sm:p-4 text-[var(--color-text-muted)] leading-relaxed mb-6 bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)]">
                        {property.description}
                    </p>


                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <div
                            className="rounded-xl p-3 sm:p-4 bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)]"
                        >
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/50 mb-1">Valuation</p>
                            <p className="text-base sm:text-lg font-bold text-white">{property.valuation}</p>
                        </div>
                        <div
                            className="rounded-xl p-3 sm:p-4 bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)]"
                        >
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/50 mb-1">Yield</p>
                            <p className="text-base sm:text-lg font-bold text-[var(--color-primary-300)]">{property.yield}</p>
                        </div>
                        <div
                            className="rounded-xl p-3 sm:p-4 bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)]"
                        >
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/50 mb-1">Risk Level</p>
                            <p className={`text-base sm:text-lg font-bold ${property.riskTextColor}`}>{property.risk}</p>
                        </div>
                        <div
                            className="rounded-xl p-3 sm:p-4 bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)]"
                        >
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]/50 mb-1">Fractions</p>
                            <p className="text-base sm:text-lg font-bold text-white">{property.totalFractions?.toLocaleString()}</p>
                        </div>
                    </div>


                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">Documents</h3>
                        <div className="space-y-2">
                            {DOCUMENTS.map((doc) => (
                                <div
                                    key={doc.name}
                                    className="flex items-center justify-between rounded-xl px-4 py-3 bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)]"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-7 h-7 rounded-full bg-[var(--color-primary-300)]/10 flex items-center justify-center text-xs">
                                            {doc.icon}
                                        </span>
                                        <span className="text-sm text-[var(--color-text-secondary)]">{doc.name}</span>
                                    </div>
                                    <button className="flex items-center gap-1.5 text-xs text-[var(--color-primary-300)] bg-transparent border-0 cursor-pointer hover:underline">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        View
                                    </button>
                                </div>
                            ))}
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
                        className="rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24 bg-[var(--color-bg-dark-alt)] border border-[var(--color-primary-300)]/10"
                    >
                        <p className="text-[10px] uppercase tracking-[2px] text-[var(--color-text-muted)]/50 mb-1">Per Fraction</p>
                        <p className="text-2xl sm:text-3xl font-bold text-white mb-5">
                            ${property.perFractionNum?.toLocaleString()}
                        </p>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-subtle)]">
                                <span className="text-xs text-[var(--color-text-muted)]/50">Available</span>
                                <span className="text-sm text-[var(--color-text-secondary)] font-medium">{property.available}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-subtle)]">
                                <span className="text-xs text-[var(--color-text-muted)]/50">Yield</span>
                                <span className="text-sm text-[var(--color-primary-300)] font-medium">{property.yield} p.a.</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-xs text-[var(--color-text-muted)]/50">Broker</span>
                                <span className="text-sm text-[var(--color-text-secondary)] font-medium">{property.broker}</span>
                            </div>
                        </div>


                        <div className="mb-5">
                            <div className="w-full h-1.5 bg-[var(--color-bg-surface-subtle)] rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[var(--color-gradient-glofi)] rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${property.funded}%` }}
                                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-[10px] text-[var(--color-text-muted)]/50 mt-1">{property.funded}% funded</p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleInvestNow}
                            className="w-full py-3 rounded-xl bg-[var(--color-gradient-glofi)] text-black font-semibold text-sm cursor-pointer border-0 transition-shadow hover:shadow-[var(--shadow-glow-primary)]"
                        >
                            Invest Now
                        </motion.button>
                    </div>
                </motion.div>
            </div>


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
            {confirmType === "kyc" && (
                <ConfirmationModal
                    isOpen={true}
                    onClose={handleKycConfirmClose}
                    type="kyc"
                />
            )}
            {confirmType === "confirmed" && (
                <ConfirmationModal
                    isOpen={true}
                    onClose={handleFinalClose}
                    type="confirmed"
                    propertyName={property.name}
                    quantity={investQuantity}
                />
            )}
        </div>
    );
}
