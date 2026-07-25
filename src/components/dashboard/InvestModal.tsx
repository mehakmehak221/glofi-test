"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetKycStatusQuery } from "@/store/api/kycApi";

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, y: 20 },
} satisfies import("framer-motion").Variants;

export default function InvestModal({ isOpen, onClose, property, onVerifyPay, isLoading = false, purchaseMode = "fractional", initialQuantity }) {
    const [quantity, setQuantity] = useState(1);

    const isWholePurchase = property.saleType === 'WHOLE' || purchaseMode === 'whole';

    useEffect(() => {
        if (isOpen && property) {
            if (initialQuantity !== undefined) {
                setQuantity(initialQuantity);
            } else {
                setQuantity(isWholePurchase ? (property.availableFractions || property.totalFractions || 1) : 1);
            }
        }
    }, [isOpen, property, isWholePurchase, initialQuantity]);

    const { data: kycData } = useGetKycStatusQuery(undefined, { skip: !isOpen });
    if (!isOpen || !property) return null;

    const price = Number(property.fractionPrice) || 0;
    const subtotal = quantity * price;
    const fee = subtotal * 0.02;
    const total = subtotal + fee;

    const formatCurrency = (val) => {
        const num = Number(val) || 0;
        return "₹" + num.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const isKycApproved = kycData?.status === "APPROVED" || kycData?.status === "VERIFIED";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <div className="absolute inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        className="relative w-full max-w-sm rounded-md p-5 sm:p-7 bg-[var(--card-surface)] border border-[var(--sidebar-border)] shadow-2xl"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg sm:text-xl font-bold text-[var(--header-text)]">{property.title}</h2>
                            <button
                                onClick={onClose}
                                className="text-[var(--color-text-muted)] hover:text-[var(--header-text)] transition-colors bg-transparent border-0 cursor-pointer p-1"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>


                        <p className="text-[10px] uppercase tracking-[2px] text-[var(--color-text-muted)] font-bold mb-3">Fractions</p>


                        {isWholePurchase ? (
                            <div className="mb-6 bg-[var(--field-surface)] border border-[var(--sidebar-border)] rounded-md p-4 flex flex-col items-center gap-3">
                                <div className="text-center">
                                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-bold mb-1 block">Total fractions</span>
                                    <span className="text-3xl font-black text-[var(--header-text)]">{quantity}</span>
                                </div>
                                <div className="w-full bg-[var(--color-primary-300)]/15 border border-[var(--color-primary-300)]/20 rounded-md p-2.5 text-center text-xs text-[var(--sidebar-active-text)] font-semibold leading-normal">
                                    Whole asset purchase: You are acquiring 100% of this asset.
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between rounded-md p-1.5 mb-6 bg-[var(--field-surface)] border border-[var(--sidebar-border)]"
                            >
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-11 h-11 rounded-md bg-[var(--field-surface)] hover:bg-[var(--sidebar-active-bg)] text-[var(--header-text)] text-xl font-bold flex items-center justify-center cursor-pointer border border-[var(--sidebar-border)] transition-all shadow-sm"
                                >
                                    −
                                </motion.button>
                                <span className="text-2xl font-black text-[var(--header-text)] min-w-[60px] text-center">{quantity}</span>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-11 h-11 rounded-md bg-[var(--field-surface)] hover:bg-[var(--sidebar-active-bg)] text-[var(--header-text)] text-xl font-bold flex items-center justify-center cursor-pointer border border-[var(--sidebar-border)] transition-all shadow-sm"
                                >
                                    +
                                </motion.button>
                            </div>
                        )}


                        <div className="space-y-3 mb-6 bg-[var(--field-surface)] rounded-md p-4 border border-[var(--sidebar-border)]">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--color-text-muted)] font-medium">{quantity} × {formatCurrency(price)}</span>
                                <span className="text-[var(--header-text)] font-extrabold">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--color-text-muted)] font-medium">Fee (2%)</span>
                                <span className="text-[var(--header-text)] font-extrabold">{formatCurrency(fee)}</span>
                            </div>
                            <div className="h-px bg-[var(--background)] my-1" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-[var(--header-text)]">Total</span>
                                <span className="text-xl font-black text-[var(--header-text)]">{formatCurrency(total)}</span>
                            </div>
                        </div>


                        {!isKycApproved && (
                            <div
                                className={`rounded-md p-4 mb-6 flex items-start gap-3 border ${kycData?.status === "UNDER_REVIEW"
                                        ? "bg-[var(--color-status-warning-bg)] border-[var(--color-status-warning-border)] text-[var(--color-status-warning)]"
                                        : kycData?.status === "REJECTED"
                                            ? "bg-[var(--color-status-error-bg)] border-[var(--color-status-error-border)] text-[var(--color-status-error)]"
                                            : "bg-[var(--color-status-warning-bg)] border-[var(--color-status-warning-border)] text-[var(--color-status-warning)]"
                                    }`}
                            >
                                <span className="shrink-0 mt-0.5">
                                    {kycData?.status === "UNDER_REVIEW" ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 15" fill="none">
                                            <path d="M11.3337 8.00038C11.3337 11.3337 9.00033 13.0004 6.22699 13.967C6.08177 14.0163 5.92402 14.0139 5.78033 13.9604C3.00033 13.0004 0.666992 11.3337 0.666992 8.00038V3.33371C0.666992 3.1569 0.73723 2.98733 0.862254 2.86231C0.987279 2.73729 1.15685 2.66705 1.33366 2.66705C2.66699 2.66705 4.33366 1.86705 5.49366 0.853714C5.6349 0.733047 5.81456 0.666748 6.00033 0.666748C6.18609 0.666748 6.36576 0.733047 6.50699 0.853714C7.67366 1.87371 9.33366 2.66705 10.667 2.66705C10.8438 2.66705 11.0134 2.73729 11.1384 2.86231C11.2634 2.98733 11.3337 3.1569 11.3337 3.33371V8.00038Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </span>
                                <div className="flex flex-col gap-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider">
                                        Status: {kycData?.status?.replace("_", " ") || "Verification Required"}
                                    </p>
                                    <p className="text-xs font-medium leading-relaxed opacity-90">
                                        {kycData?.status === "UNDER_REVIEW"
                                            ? "Your identity verification is currently being processed. We'll notify you once it's approved."
                                            : kycData?.status === "REJECTED"
                                                ? `Your verification was rejected. Please check your details and re-submit. ${kycData?.rejectedNote ? `Reason: ${kycData.rejectedNote}` : ''}`
                                                : "KYC verification required before your first investment. Quick 3-step process."}
                                    </p>
                                </div>
                            </div>
                        )}


                        <motion.button
                            whileHover={!isLoading ? { scale: 1.02 } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                            onClick={() => !isLoading && onVerifyPay(quantity, total)}
                            disabled={isLoading}
                            className="w-full py-4 rounded-md bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] font-bold text-sm cursor-pointer border-0 transition-all hover:opacity-90 shadow-glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                "Continue to Payment"
                            )}
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
