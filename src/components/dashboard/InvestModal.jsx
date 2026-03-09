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
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        className="relative w-full max-w-sm rounded-2xl p-5 sm:p-6"
                        style={{
                            background: 'linear-gradient(180deg, #0D1411 0%, #0A0F0D 100%)',
                            border: '1px solid rgba(0, 218, 175, 0.15)',
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
                                className="text-[#767676] hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        
                        <p className="text-[10px] uppercase tracking-[2px] text-[#767676] mb-3">Fractions</p>

                      
                        <div className="flex items-center justify-between rounded-xl p-1 mb-5"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white text-lg font-medium flex items-center justify-center cursor-pointer border-0 transition-colors"
                            >
                                −
                            </motion.button>
                            <span className="text-xl font-bold text-white min-w-[60px] text-center">{quantity}</span>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white text-lg font-medium flex items-center justify-center cursor-pointer border-0 transition-colors"
                            >
                                +
                            </motion.button>
                        </div>

                   
                        <div className="space-y-2.5 mb-5">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#767676]">{quantity} × {formatCurrency(price)}</span>
                                <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#767676]">Fee (2%)</span>
                                <span className="text-white font-medium">{formatCurrency(fee)}</span>
                            </div>
                            <div className="h-px bg-white/[0.08] my-1" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-white">Total</span>
                                <span className="text-lg font-bold text-white">{formatCurrency(total)}</span>
                            </div>
                        </div>

                       
                        <div
                            className="rounded-xl p-3 mb-5 flex items-center gap-2.5 bg-[#FE9A000A] border border-[#FE9A001A]"
                            
                        >
                            <span className=""><svg xmlns="http://www.w3.org/2000/svg" width="12" height="15" viewBox="0 0 12 15" fill="none">
  <path d="M11.3337 8.00038C11.3337 11.3337 9.00033 13.0004 6.22699 13.967C6.08177 14.0163 5.92402 14.0139 5.78033 13.9604C3.00033 13.0004 0.666992 11.3337 0.666992 8.00038V3.33371C0.666992 3.1569 0.73723 2.98733 0.862254 2.86231C0.987279 2.73729 1.15685 2.66705 1.33366 2.66705C2.66699 2.66705 4.33366 1.86705 5.49366 0.853714C5.6349 0.733047 5.81456 0.666748 6.00033 0.666748C6.18609 0.666748 6.36576 0.733047 6.50699 0.853714C7.67366 1.87371 9.33366 2.66705 10.667 2.66705C10.8438 2.66705 11.0134 2.73729 11.1384 2.86231C11.2634 2.98733 11.3337 3.1569 11.3337 3.33371V8.00038Z" stroke="#FFB900" strokeOpacity="0.6" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
</svg></span>
                            <p className="text-[12px] text-[#FFB90080] leading-relaxed">
                                KYC verification required before your first investment. Quick 3-step process.
                            </p>
                        </div>

                        
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onVerifyPay(quantity, total)}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00FFCD] to-[#009976] text-black font-semibold text-sm cursor-pointer border-0 transition-shadow hover:shadow-[0_0_20px_rgba(0,255,205,0.3)]"
                        >
                            Verify & Pay
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
