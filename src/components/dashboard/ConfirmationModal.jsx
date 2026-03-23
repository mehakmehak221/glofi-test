"use client";

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

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M23.3337 15.1666C23.3337 21 19.2503 23.9166 14.397 25.6083C14.1428 25.6944 13.8668 25.6903 13.6153 25.5966C8.75033 23.9166 4.66699 21 4.66699 15.1666V6.99995C4.66699 6.69054 4.78991 6.39379 5.0087 6.175C5.22749 5.9562 5.52424 5.83329 5.83366 5.83329C8.16699 5.83329 11.0837 4.43329 13.1137 2.65995C13.3608 2.44879 13.6752 2.33276 14.0003 2.33276C14.3254 2.33276 14.6398 2.44879 14.887 2.65995C16.9287 4.44495 19.8337 5.83329 22.167 5.83329C22.4764 5.83329 22.7732 5.9562 22.992 6.175C23.2107 6.39379 23.3337 6.69054 23.3337 6.99995V15.1666Z" stroke="currentColor" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SmallShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M13.3337 8.66664C13.3337 12 11.0003 13.6666 8.22699 14.6333C8.08177 14.6825 7.92402 14.6802 7.78033 14.6266C5.00033 13.6666 2.66699 12 2.66699 8.66664V3.99997C2.66699 3.82316 2.73723 3.65359 2.86225 3.52857C2.98728 3.40355 3.15685 3.33331 3.33366 3.33331C4.66699 3.33331 6.33366 2.53331 7.49366 1.51997C7.6349 1.39931 7.81456 1.33301 8.00033 1.33301C8.18609 1.33301 8.36576 1.39931 8.50699 1.51997C9.67366 2.53997 11.3337 3.33331 12.667 3.33331C12.8438 3.33331 13.0134 3.40355 13.1384 3.52857C13.2634 3.65359 13.3337 3.82316 13.3337 3.99997V8.66664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function ConfirmationModal({ isOpen, onClose, type = "kyc", propertyName = "", quantity = 1 }) {
    if (!isOpen) return null;

    const isKYC = type === "kyc";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
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
                        {/* Header - KYC only */}
                        {isKYC && (
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-[var(--color-text-muted)] font-bold">
                                    <div className="text-[var(--sidebar-active-text)]">
                                        <SmallShieldIcon />
                                    </div>
                                    <span>KYC Verification</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-[var(--color-text-muted)] hover:text-[var(--header-text)] transition-colors bg-transparent border-0 cursor-pointer p-1"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Icon */}
                        <div className="flex justify-center mb-6 mt-2 text-[var(--sidebar-active-text)]">
                            {isKYC ? (
                                <motion.div
                                    className="w-20 h-20 rounded-full flex items-center justify-center bg-[var(--badge-bg)] shadow-[0_0_40px_0_var(--sidebar-active-bg)]"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                                >
                                    <ShieldIcon />
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="w-20 h-20 rounded-[2rem] flex items-center justify-center bg-[var(--badge-bg)] border border-[var(--sidebar-active-text)]/30"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                                >
                                    <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>
                            )}
                        </div>

                        {/* Title & Description */}
                        <div className="text-center px-2">
                            <h2 className="text-xl sm:text-2xl font-bold text-[var(--header-text)] mb-2">
                                {isKYC ? "KYC Submitted!" : "Investment Confirmed"}
                            </h2>
                            <p className="text-sm text-[var(--color-text-muted)] font-medium mb-6 leading-relaxed">
                                {isKYC
                                    ? "Verification takes 24-48 hours. You can now proceed with your investment."
                                    : `${quantity} fraction${quantity > 1 ? "s" : ""} of ${propertyName}`}
                            </p>

                            {/* Under Review Badge (KYC only) */}
                            {isKYC && (
                                <div className="flex justify-center mb-6">
                                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-[var(--color-text-muted)] border border-[var(--sidebar-border)] bg-[var(--background)] shadow-sm"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-[var(--color-status-warning)] animate-pulse" />
                                        Under Review
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* CTA Button */}
                        <div className={`${isKYC ? "" : "flex justify-center"}`}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className={`py-4 bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] font-bold text-sm cursor-pointer border-0 transition-all hover:opacity-90 shadow-[var(--shadow-glow-primary)] ${isKYC ? "w-full rounded-full" : "px-14 rounded-full"
                                    }`}
                            >
                                {isKYC ? "Continue to Payment  →" : "Done"}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
