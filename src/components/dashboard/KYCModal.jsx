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
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-6"
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

                            <div className="flex items-center gap-1 text-[10px] uppercase tracking-[2px] text-[#FFFFFF66] font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <g clipPath="url(#clip0_99_1038)">
                                        <path d="M13.3337 8.66664C13.3337 12 11.0003 13.6666 8.22699 14.6333C8.08177 14.6825 7.92402 14.6802 7.78033 14.6266C5.00033 13.6666 2.66699 12 2.66699 8.66664V3.99997C2.66699 3.82316 2.73723 3.65359 2.86225 3.52857C2.98728 3.40355 3.15685 3.33331 3.33366 3.33331C4.66699 3.33331 6.33366 2.53331 7.49366 1.51997C7.6349 1.39931 7.81456 1.33301 8.00033 1.33301C8.18609 1.33301 8.36576 1.39931 8.50699 1.51997C9.67366 2.53997 11.3337 3.33331 12.667 3.33331C12.8438 3.33331 13.0134 3.40355 13.1384 3.52857C13.2634 3.65359 13.3337 3.82316 13.3337 3.99997V8.66664Z" stroke="#00DAAF" strokeOpacity="0.6" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </svg>

                                <span>KYC Verification</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-[#767676] hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <h2 className="text-lg sm:text-xl font-semibold text-white mb-1">Identity verification</h2>
                        <p className="text-xs text-[#767676] mb-5">Upload a government-issued ID to verify your identity.</p>


                        <div className="flex flex-wrap gap-1.5 mb-5">
                            {DOC_TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border ${activeTab === tab
                                        ? "bg-[#00FFCD]/10 text-[#00FFCD] border-[#00FFCD]/30"
                                        : "bg-transparent text-[#767676] border-white/10 hover:border-white/20"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>


                        <div
                            className="rounded-lg p-4 mb-3"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#00FFCD]/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-[#00FFCD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Document — Front</p>
                                        <p className="text-[10px] text-[#767676]">Clear photo of front side</p>
                                    </div>
                                </div>
                                {docUploaded ? (
                                    <span className="text-xs font-semibold text-[#00FFCD] bg-[#00FFCD]/10 px-2.5 py-1 rounded-md">DONE</span>
                                ) : (
                                    <button
                                        onClick={() => setDocUploaded(true)}
                                        className="text-xs text-[#00FFCD] bg-transparent border border-[#00FFCD]/30 px-3 py-1 rounded-md cursor-pointer hover:bg-[#00FFCD]/10 transition-colors"
                                    >
                                        Upload
                                    </button>
                                )}
                            </div>
                            {docUploaded && (
                                <p className="text-[10px] text-[#767676] mt-2 ml-11">PX_IMG_001 — Uploaded 2024</p>
                            )}
                        </div>


                        <div
                            className="rounded-lg p-4 mb-5"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-[#767676]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Selfie Verification</p>
                                        <p className="text-[10px] text-[#767676]">A live photo — hold next to your face</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelfieUploaded(true)}
                                    className={`text-xs px-3 py-1 rounded-md cursor-pointer transition-colors ${selfieUploaded
                                        ? "text-[#00FFCD] font-semibold bg-[#00FFCD]/10 border-0"
                                        : "text-[#00FFCD] bg-transparent border border-[#00FFCD]/30 hover:bg-[#00FFCD]/10"
                                        }`}
                                >
                                    {selfieUploaded ? "DONE" : "Capture"}
                                </button>
                            </div>
                        </div>


                        <div className="flex items-center gap-2 mb-5 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className=""><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <g clipPath="url(#clip0_99_1091)">
                                    <path d="M7.00033 12.8334C10.222 12.8334 12.8337 10.2217 12.8337 7.00008C12.8337 3.77842 10.222 1.16675 7.00033 1.16675C3.77866 1.16675 1.16699 3.77842 1.16699 7.00008C1.16699 10.2217 3.77866 12.8334 7.00033 12.8334Z" stroke="#ACFFEF" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 4.66675V7.00008" stroke="#ACFFEF" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 9.33325H7.00583" stroke="#ACFFEF" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_99_1091">
                                        <rect width="14" height="14" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg></span>
                            <p className="text-[10px] text-[#767676] leading-relaxed">
                                Your documents are encrypted and stored securely per UAE data
                                regulations.
                            </p>
                        </div>


                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onSubmit}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00FFCD] to-[#009976] text-black font-semibold text-sm cursor-pointer border-0 transition-shadow hover:shadow-[0_0_20px_rgba(0,255,205,0.3)]"
                        >
                            Submit KYC →
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
