"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BusinessPropertyIcon, UploadIcon, CheckIcon, DocumentIcon } from "../VectorImages";

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, y: 20 },
};

const KYB_DOCS = [
    { id: "reg", label: "Registration Certificate", subtext: "Certificate of incorporation or trade license", formats: "PDF, JPG — MAX 10 MB" },
    { id: "tax", label: "GST / Tax Certificate", subtext: "Tax registration proof (optional)", formats: "PDF, JPG — MAX 10 MB" },
    { id: "moa", label: "Memorandum of Association", subtext: "Articles of partnership deed (optional)", formats: "PDF — MAX 10 MB" },
    { id: "dir", label: "Director / Shareholder ID", subtext: "Government ID of authorized director", formats: "PDF, JPG — MAX 5 MB" },
];

export default function KYBModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1); 
    const [uploadedDocs, setUploadedDocs] = useState({});

    const handleUpload = (id) => {
        setUploadedDocs(prev => ({ ...prev, [id]: true }));
    };

    const handleSubmit = () => {
        setStep(2);
    };

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
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                    
                    <motion.div
                        className="relative w-full max-w-md bg-[#0A0F0D] rounded-[32px] p-6 lg:p-10 overflow-hidden shadow-2xl "
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-[#FFFFFF66] tracking-[0.2em] uppercase font-montserrat">
                                <BusinessPropertyIcon className="w-4 h-4 text-[#00F4C4]" />
                                <span>KYB Verification</span>
                            </div>
                            <button onClick={onClose} className="text-[#FFFFFF66] hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-1">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        {step === 1 ? (
                            <>
                                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 font-montserrat">Business verification</h2>
                                <p className="text-sm text-[#FFFFFF66] mb-8 font-montserrat">Upload documents to verify your business entity</p>

                                <div className="space-y-3 mb-8">
                                    {KYB_DOCS.map((doc) => (
                                        <div 
                                            key={doc.id}
                                            className="group relative flex items-center justify-between p-4 rounded-2xl bg-[#FFFFFF05] border border-white/5 hover:border-[#00F4C4]/20 transition-all cursor-pointer"
                                            onClick={() => handleUpload(doc.id)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${uploadedDocs[doc.id] ? "bg-[#00DAAF]/10" : "bg-white/5 group-hover:bg-white/10"}`}>
                                                    {uploadedDocs[doc.id] ? (
                                                        <CheckIcon className="w-5 h-5 text-[#00DAAF]" />
                                                    ) : (
                                                        <UploadIcon className="w-5 h-5 text-white/40" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-white font-montserrat">{doc.label}</span>
                                                    <span className="text-[10px] text-[#FFFFFF66] font-montserrat">{doc.subtext}</span>
                                                    <span className="text-[9px] text-[#FFFFFF33] font-montserrat mt-1 uppercase tracking-wider">{doc.formats}</span>
                                                </div>
                                            </div>
                                            {uploadedDocs[doc.id] && (
                                                <span className="text-[10px] font-bold text-[#00DAAF] bg-[#00DAAF]/10 px-2.5 py-1 rounded-lg">DONE</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 mb-8 p-3 rounded-2xl bg-[#FFFFFF05] border border-white/5">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                                       <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g>
                                                <path d="M6.99935 12.8337C10.221 12.8337 12.8327 10.222 12.8327 7.00033C12.8327 3.77866 10.221 1.16699 6.99935 1.16699C3.77769 1.16699 1.16602 3.77866 1.16602 7.00033C1.16602 10.222 3.77769 12.8337 6.99935 12.8337Z" stroke="#00DAAF" strokeOpacity="0.5" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M7 4.66699V7.00033" stroke="#00DAAF" strokeOpacity="0.5" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M7 9.33301H7.00583" stroke="#00DAAF" strokeOpacity="0.5" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                                            </g>
                                        </svg>
                                    </div>
                                    <p className="text-[10px] leading-relaxed text-[#FFFFFF66] font-montserrat">
                                        Documents verified per UAE DFSA and SECP guidelines. Review takes 2-5 business days.
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={handleSubmit}
                                    className="w-full py-4 rounded-2xl bg-[#00DAAF] text-black font-bold text-sm font-montserrat transition-all hover:opacity-90 shadow-[0_0_24px_rgba(0,218,175,0.2)]"
                                >
                                    Submit KYB 
                                </motion.button>
                            </>
                        ) : (
                            <div className="py-4 flex flex-col items-center text-center">
                                <div className="relative mb-10">
                                    <motion.div 
                                        className="absolute inset-0 rounded-full bg-[#00DAAF]/20"
                                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                    <div className="relative w-20 h-20 rounded-full bg-[#00DAAF]/10 flex items-center justify-center">
                                        <BusinessPropertyIcon className="w-10 h-10 text-[#00DAAF99]" />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-3 font-montserrat">KYB Submitted!</h2>
                                <p className="text-sm text-[#FFFFFF66] mb-10 px-4 font-montserrat leading-relaxed">
                                    Your business verification is under review (2-5 business days).<br />You can now proceed.
                                </p>

                                <div className="w-full space-y-3 mb-10">
                                    <div className="flex items-center justify-between px-6 py-4 rounded-3xl bg-[#FFFFFF05] border border-white/5">
                                        <span className="text-sm text-white/70 font-montserrat">Company KYB</span>
                                        <span className="text-xs font-semibold text-[#FFB648]">Under Review</span>
                                    </div>
                                    <div className="flex items-center justify-between px-6 py-4 rounded-3xl bg-[#FFFFFF05] border border-white/5 opacity-50">
                                        <span className="text-sm text-white/70 font-montserrat">Bank Verification</span>
                                        <span className="text-xs font-semibold text-[#FFFFFF66]">Pending</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={onClose}
                                    className="w-full py-4.5 rounded-2xl bg-[#00DAAF] text-black font-bold text-sm font-montserrat transition-all hover:opacity-90 shadow-[0_0_24px_rgba(0,218,175,0.2)] flex items-center justify-center gap-2"
                                >
                                    Continue 
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M10.5 5.25L14.25 9L10.5 12.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

