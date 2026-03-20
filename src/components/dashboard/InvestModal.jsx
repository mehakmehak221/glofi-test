"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, y: 20 },
};

export default function InvestModal({ isOpen, onClose, property, onVerifyPay }) {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !property) return null;

    const price = property.perFractionNum;
    const subtotal = quantity * price;
    const fee = subtotal * 0.02;
    const total = subtotal + fee;

    const formatCurrency = (val) =>
        "$" + val.toLocaleString("en-US", { minimumFractionDigits: 0 });

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
                        className="relative w-full max-w-sm rounded-[2rem] p-5 sm:p-7 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] shadow-2xl"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                     
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg sm:text-xl font-bold text-[var(--header-text)]">{property.name}</h2>
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

                      
                        <div className="flex items-center justify-between rounded-2xl p-1.5 mb-6 bg-[var(--background)] border border-[var(--sidebar-border)]"
                        >
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-11 h-11 rounded-xl bg-[var(--sidebar-bg)] hover:bg-[var(--sidebar-active-bg)] text-[var(--header-text)] text-xl font-bold flex items-center justify-center cursor-pointer border border-[var(--sidebar-border)] transition-all shadow-sm"
                            >
                                −
                            </motion.button>
                            <span className="text-2xl font-black text-[var(--header-text)] min-w-[60px] text-center">{quantity}</span>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-11 h-11 rounded-xl bg-[var(--sidebar-bg)] hover:bg-[var(--sidebar-active-bg)] text-[var(--header-text)] text-xl font-bold flex items-center justify-center cursor-pointer border border-[var(--sidebar-border)] transition-all shadow-sm"
                            >
                                +
                            </motion.button>
                        </div>

                   
                        <div className="space-y-3 mb-6 bg-[var(--background)]/50 rounded-2xl p-4 border border-[var(--sidebar-border)]">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--color-text-muted)] font-medium">{quantity} × {formatCurrency(price)}</span>
                                <span className="text-[var(--header-text)] font-extrabold">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--color-text-muted)] font-medium">Fee (2%)</span>
                                <span className="text-[var(--header-text)] font-extrabold">{formatCurrency(fee)}</span>
                            </div>
                            <div className="h-px bg-[var(--sidebar-border)] my-1" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-[var(--header-text)]">Total</span>
                                <span className="text-xl font-black text-[var(--header-text)]">{formatCurrency(total)}</span>
                            </div>
                        </div>

                       
                        <div
                            className="rounded-2xl p-4 mb-6 flex items-start gap-3 bg-[var(--color-status-warning-bg)] border border-[var(--color-status-warning-border)]"
                        >
                            <span className="shrink-0 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 15" fill="none">
                                <path d="M11.3337 8.00038C11.3337 11.3337 9.00033 13.0004 6.22699 13.967C6.08177 14.0163 5.92402 14.0139 5.78033 13.9604C3.00033 13.0004 0.666992 11.3337 0.666992 8.00038V3.33371C0.666992 3.1569 0.73723 2.98733 0.862254 2.86231C0.987279 2.73729 1.15685 2.66705 1.33366 2.66705C2.66699 2.66705 4.33366 1.86705 5.49366 0.853714C5.6349 0.733047 5.81456 0.666748 6.00033 0.666748C6.18609 0.666748 6.36576 0.733047 6.50699 0.853714C7.67366 1.87371 9.33366 2.66705 10.667 2.66705C10.8438 2.66705 11.0134 2.73729 11.1384 2.86231C11.2634 2.98733 11.3337 3.1569 11.3337 3.33371V8.00038Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg></span>
                            <p className="text-xs text-[var(--color-status-warning)] font-medium leading-relaxed">
                                KYC verification required before your first investment. Quick 3-step process.
                            </p>
                        </div>

                        
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onVerifyPay(quantity, total)}
                            className="w-full py-4 rounded-full bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] font-bold text-sm cursor-pointer border-0 transition-all hover:opacity-90 shadow-[var(--shadow-glow-primary)]"
                        >
                            Verify & Pay
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
