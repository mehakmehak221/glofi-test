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

const DOC_TABS = ["Passport", "Aadhaar", "PAN Card", "License"];

export default function KYCModal({ isOpen, onClose, onSubmit }) {
    const [activeTab, setActiveTab] = useState("Passport");
    const [docUploaded, setDocUploaded] = useState(true);
    const [selfieUploaded, setSelfieUploaded] = useState(false);

    if (!isOpen) return null;

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
                        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[2rem] p-5 sm:p-7 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] shadow-2xl"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex items-center justify-between mb-5">

                            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-[var(--color-text-muted)] font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <g clipPath="url(#clip0_99_1038)">
                                        <path d="M13.3337 8.66664C13.3337 12 11.0003 13.6666 8.22699 14.6333C8.08177 14.6825 7.92402 14.6802 7.78033 14.6266C5.00033 13.6666 2.66699 12 2.66699 8.66664V3.99997C2.66699 3.82316 2.73723 3.65359 2.86225 3.52857C2.98728 3.40355 3.15685 3.33331 3.33366 3.33331C4.66699 3.33331 6.33366 2.53331 7.49366 1.51997C7.6349 1.39931 7.81456 1.33301 8.00033 1.33301C8.18609 1.33301 8.36576 1.39931 8.50699 1.51997C9.67366 2.53997 11.3337 3.33331 12.667 3.33331C12.8438 3.33331 13.0134 3.40355 13.1384 3.52857C13.2634 3.65359 13.3337 3.82316 13.3337 3.99997V8.66664Z" stroke="var(--color-status-success)" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </svg>
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

                        <h2 className="text-xl sm:text-2xl font-bold text-[var(--header-text)] mb-1">Identity verification</h2>
                        <p className="text-sm text-[var(--color-text-muted)] font-medium mb-6">Upload a government-issued ID to verify your identity.</p>


                        <div className="flex flex-wrap gap-1.5 mb-5">
                            {DOC_TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${activeTab === tab
                                        ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border-[var(--sidebar-active-text)]/30"
                                        : "bg-transparent text-[var(--color-text-muted)] border-[var(--sidebar-border)] hover:border-[var(--color-text-muted)]"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>


                        <div
                            className="rounded-2xl p-4 mb-3 bg-[var(--background)] border border-[var(--sidebar-border)] shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[var(--badge-bg)] flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-[var(--sidebar-active-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--header-text)]">Document — Front</p>
                                        <p className="text-[10px] text-[var(--color-text-muted)] font-medium">Clear photo of front side</p>
                                    </div>
                                </div>
                                {docUploaded ? (
                                    <span className="text-xs font-bold text-[var(--sidebar-active-text)] bg-[var(--badge-bg)] px-3 py-1.5 rounded-xl">DONE</span>
                                ) : (
                                    <button
                                        onClick={() => setDocUploaded(true)}
                                        className="text-xs font-bold text-[var(--sidebar-active-text)] bg-transparent border border-[var(--sidebar-active-text)]/30 px-4 py-1.5 rounded-xl cursor-pointer hover:bg-[var(--sidebar-active-bg)] transition-colors"
                                    >
                                        Upload
                                    </button>
                                )}
                            </div>
                            {docUploaded && (
                                <p className="text-[10px] text-[var(--color-text-muted)] font-bold mt-2 ml-14">PX_IMG_001 — Uploaded 2024</p>
                            )}
                        </div>


                        <div
                            className="rounded-2xl p-4 mb-6 bg-[var(--background)] border border-[var(--sidebar-border)] shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--sidebar-border)] flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--header-text)]">Selfie Verification</p>
                                        <p className="text-[10px] text-[var(--color-text-muted)] font-medium">A live photo — hold next to your face</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelfieUploaded(true)}
                                    className={`text-xs px-4 py-1.5 rounded-xl cursor-pointer transition-colors font-bold ${selfieUploaded
                                        ? "text-[var(--sidebar-active-text)] bg-[var(--badge-bg)] border-0"
                                        : "text-[var(--sidebar-active-text)] bg-transparent border border-[var(--sidebar-active-text)]/30 hover:bg-[var(--sidebar-active-bg)]"
                                        }`}
                                >
                                    {selfieUploaded ? "DONE" : "Capture"}
                                </button>
                            </div>
                        </div>


                        <div className="flex items-start gap-3 mb-6 p-4 rounded-2xl bg-[var(--color-status-info-bg)] border border-[var(--color-status-info-border)]">
                            <span className="shrink-0 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14" fill="none">
                                <g clipPath="url(#clip0_99_1091)">
                                    <path d="M7.00033 12.8334C10.222 12.8334 12.8337 10.2217 12.8337 7.00008C12.8337 3.77842 10.222 1.16675 7.00033 1.16675C3.77866 1.16675 1.16699 3.77842 1.16699 7.00008C1.16699 10.2217 3.77866 12.8334 7.00033 12.8334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 4.66675V7.00008" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 9.33325H7.00583" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                            </svg></span>
                            <p className="text-[11px] text-[var(--color-status-info)] font-medium leading-relaxed">
                                Your documents are encrypted and stored securely per UAE data
                                regulations.
                            </p>
                        </div>


                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onSubmit}
                            className="w-full py-4 rounded-full bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] font-bold text-sm cursor-pointer border-0 transition-all hover:opacity-90 shadow-[var(--shadow-glow-primary)]"
                        >
                            Submit KYC →
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
