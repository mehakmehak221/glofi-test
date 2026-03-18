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
                        className="relative w-full max-w-sm rounded-2xl p-5 sm:p-6"
                        style={{
                            background: 'var(--color-bg-dark-alt)',
                            border: '1px solid var(--color-primary-300-alpha-30)',
                        }}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                     
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base sm:text-lg font-bold text-white">{property.name}</h2>
                            <button
                                onClick={onClose}
                                className="text-[var(--color-text-secondary)] hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        
                        <p className="text-[10px] uppercase tracking-[2px] text-[var(--color-text-secondary)] mb-3">Fractions</p>

                      
                        <div className="flex items-center justify-between rounded-xl p-1 mb-5"
                            style={{ background: 'var(--color-bg-surface-subtle)', border: '1px solid var(--color-border-subtle)' }}
                        >
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-lg bg-[var(--color-bg-surface-subtle)] hover:bg-[var(--color-bg-surface-elevated)] text-white text-lg font-medium flex items-center justify-center cursor-pointer border-0 transition-colors"
                            >
                                −
                            </motion.button>
                            <span className="text-xl font-bold text-white min-w-[60px] text-center">{quantity}</span>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 rounded-lg bg-[var(--color-bg-surface-subtle)] hover:bg-[var(--color-bg-surface-elevated)] text-white text-lg font-medium flex items-center justify-center cursor-pointer border-0 transition-colors"
                            >
                                +
                            </motion.button>
                        </div>

                   
                        <div className="space-y-2.5 mb-5">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--color-text-secondary)]">{quantity} × {formatCurrency(price)}</span>
                                <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--color-text-secondary)]">Fee (2%)</span>
                                <span className="text-white font-medium">{formatCurrency(fee)}</span>
                            </div>
                            <div className="h-px bg-[var(--color-border-subtle)] my-1" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-white">Total</span>
                                <span className="text-lg font-bold text-white">{formatCurrency(total)}</span>
                            </div>
                        </div>

                       
                        <div
                            className="rounded-xl p-3 mb-5 flex items-center gap-2.5 bg-[var(--color-status-warning-bg)] border border-[var(--color-status-warning-bg)]/20"
                            
                        >
                            <span className=""><svg xmlns="http://www.w3.org/2000/svg" width="12" height="15" viewBox="0 0 12 15" fill="none">
  <path d="M11.3337 8.00038C11.3337 11.3337 9.00033 13.0004 6.22699 13.967C6.08177 14.0163 5.92402 14.0139 5.78033 13.9604C3.00033 13.0004 0.666992 11.3337 0.666992 8.00038V3.33371C0.666992 3.1569 0.73723 2.98733 0.862254 2.86231C0.987279 2.73729 1.15685 2.66705 1.33366 2.66705C2.66699 2.66705 4.33366 1.86705 5.49366 0.853714C5.6349 0.733047 5.81456 0.666748 6.00033 0.666748C6.18609 0.666748 6.36576 0.733047 6.50699 0.853714C7.67366 1.87371 9.33366 2.66705 10.667 2.66705C10.8438 2.66705 11.0134 2.73729 11.1384 2.86231C11.2634 2.98733 11.3337 3.1569 11.3337 3.33371V8.00038Z" stroke="var(--color-status-warning)" strokeOpacity="0.6" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
</svg></span>
                            <p className="text-[12px] text-[var(--color-status-warning)]/80 leading-relaxed">
                                KYC verification required before your first investment. Quick 3-step process.
                            </p>
                        </div>

                        
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onVerifyPay(quantity, total)}
                            className="w-full py-3 rounded-xl bg-[var(--color-gradient-glofi)] text-black font-semibold text-sm cursor-pointer border-0 transition-shadow hover:shadow-[0_0_20px_var(--color-primary-300-alpha-30)]"
                        >
                            Verify & Pay
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
