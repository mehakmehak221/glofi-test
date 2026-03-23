import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmitKycMutation, useGetKycStatusQuery } from "@/store/api/kycApi";
import { useUploadFileMutation } from "@/store/api/assetApi";

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
const ADDRESS_TABS = ["Utility Bill", "Bank Statement", "Rental Agreement"];

const TYPE_MAP = {
    "Passport": "PASSPORT",
    "Aadhaar": "AADHAAR",
    "PAN Card": "PAN_CARD",
    "License": "DRIVING_LICENSE",
    "Utility Bill": "UTILITY_BILL",
    "Bank Statement": "BANK_STATEMENT",
    "Rental Agreement": "RENTAL_AGREEMENT"
};

export default function KYCModal({ isOpen, onClose, onSubmit }) {
    const [activeTab, setActiveTab] = useState("Passport");
    const [addressTab, setAddressTab] = useState("Utility Bill");
    
    const [idDocKey, setIdDocKey] = useState("");
    const [selfieKey, setSelfieKey] = useState("");
    const [addressKey, setAddressKey] = useState("");

    const { data: kycStatus, isLoading: isStatusLoading } = useGetKycStatusQuery(undefined, { skip: !isOpen });
    const [submitKyc, { isLoading: isSubmitting }] = useSubmitKycMutation();
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

    if (!isOpen) return null;

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const result = await uploadFile({ file, folder: 'kyc' }).unwrap();
            if (type === 'id') setIdDocKey(result.key);
            else if (type === 'selfie') setSelfieKey(result.key);
            else if (type === 'address') setAddressKey(result.key);
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    const handleFormSubmit = async () => {
        if (!idDocKey || !selfieKey || !addressKey) {
            alert("Please upload all required documents.");
            return;
        }

        try {
            await submitKyc({
                documentType: TYPE_MAP[activeTab],
                documentUrl: idDocKey,
                selfieUrl: selfieKey,
                addressProofType: TYPE_MAP[addressTab],
                addressProofUrl: addressKey
            }).unwrap();
            if (onSubmit) onSubmit();
        } catch (err) {
            console.error('Submission failed:', err);
        }
    };

    const isPending = kycStatus?.status === "UNDER_REVIEW";
    const isVerified = kycStatus?.status === "VERIFIED";
    const isRejected = kycStatus?.status === "REJECTED";

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
                        className="bg-[var(--sidebar-bg)] w-full max-w-lg p-10 rounded-[2rem] shadow-2xl relative border border-[var(--sidebar-border)] max-h-[90vh] overflow-y-auto"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[1.5px] text-[var(--color-text-muted)] font-bold font-montserrat opacity-80">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--sidebar-active-text)]">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>KYC Verification</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-[var(--color-text-muted)] hover:text-[var(--foreground)] transition-colors bg-transparent border-0 cursor-pointer p-1"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {isStatusLoading ? (
                            <div className="flex items-center justify-center p-12">
                                <div className="w-8 h-8 border-2 border-[var(--sidebar-active-text)]/20 border-t-[var(--sidebar-active-text)] rounded-full animate-spin" />
                            </div>
                        ) : (isPending || isVerified || (isRejected && !idDocKey && !selfieKey && !addressKey)) ? (
                            <div className="text-center py-8">
                                <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 ${
                                    isVerified ? 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success)]' : 
                                    isRejected ? 'bg-[var(--color-status-error-bg)] text-[var(--color-status-error)]' :
                                    'bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)]'}`}>
                                    {isVerified ? (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : isRejected ? (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
                                    {isVerified ? "Verified" : isRejected ? "KYC Rejected" : "KYC Submitted!"}
                                </h2>
                                <p className="text-sm text-[var(--color-text-muted)] mb-6">
                                    {isVerified ? "Your identity has been successfully verified." : 
                                     isRejected ? (kycStatus?.rejectedNote || "Your submission was rejected. Please review and resubmit.") :
                                     "Verification takes 24-48 hours. You can now proceed with your investment."}
                                </p>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-full bg-[#00DAAF] text-black font-bold text-sm cursor-pointer border-0 transition-all hover:shadow-[0_0_20px_rgba(0,218,175,0.3)] shadow-[var(--shadow-glow-primary)]"
                                >
                                    Continue
                                </button>
                            </div>
                           
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2 font-montserrat">Identity verification</h2>
                                <p className="text-sm text-[var(--color-text-muted)] font-medium mb-8 font-montserrat">Upload a government-issued ID to verify your identity</p>

                                <div className="space-y-6">
                                    {/* Identity Section */}
                                    <div>
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {DOC_TABS.map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveTab(tab)}
                                                    className={`px-6 py-2.5 rounded-[1.25rem] text-xs font-bold transition-all duration-200 cursor-pointer border ${activeTab === tab
                                                        ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border-[var(--sidebar-active-text)]/30"
                                                        : "bg-black/5 dark:bg-white/5 text-[var(--color-text-muted)] border-transparent hover:border-[var(--color-text-muted)]/30 opacity-60"
                                                        }`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>

                                        <label className={`block rounded-[1.5rem] p-5 cursor-pointer transition-all border ${idDocKey ? 'bg-[var(--sidebar-active-bg)] border-[var(--sidebar-active-text)]/20' : 'bg-black/5 dark:bg-white/5 border-[var(--sidebar-border)]'} mb-4`}>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'id')} />
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${idDocKey ? 'bg-[var(--sidebar-active-text)]/10 text-[var(--sidebar-active-text)]' : 'bg-black/10 dark:bg-white/10 text-[var(--color-text-muted)]'}`}>
                                                        {idDocKey ? (
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-bold text-[var(--foreground)] mb-0.5 font-montserrat">Document — Front</p>
                                                        <p className="text-[12px] text-[var(--color-text-muted)] font-medium font-montserrat">Clear photo of front side</p>
                                                        <p className="text-[10px] text-[var(--color-text-muted)] opacity-60 font-medium font-montserrat mt-1 uppercase">JPG, PNG, PDF — MAX 5 MB</p>
                                                    </div>
                                                </div>
                                                {idDocKey && <span className="text-[10px] font-bold text-[var(--sidebar-active-text)] bg-[var(--sidebar-active-text)]/10 px-3.5 py-1.5 rounded-xl border border-[var(--sidebar-active-text)]/20">DONE</span>}
                                            </div>
                                        </label>
                                    </div>

                                    {/* Address Section */}
                                    <div>
                                        <label className={`block rounded-[1.5rem] p-5 cursor-pointer transition-all border ${addressKey ? 'bg-[var(--sidebar-active-bg)] border-[var(--sidebar-active-text)]/20' : 'bg-black/5 dark:bg-white/5 border-[var(--sidebar-border)]'} mb-4`}>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'address')} />
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${addressKey ? 'bg-[var(--sidebar-active-text)]/10 text-[var(--sidebar-active-text)]' : 'bg-black/10 dark:bg-white/10 text-[var(--color-text-muted)]'}`}>
                                                        {addressKey ? (
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-bold text-[var(--foreground)] mb-0.5 font-montserrat">Address Proof</p>
                                                        <p className="text-[12px] text-[var(--color-text-muted)] font-medium font-montserrat">Utility Bill or Bank Statement</p>
                                                        <p className="text-[10px] text-[var(--color-text-muted)] opacity-60 font-medium font-montserrat mt-1 uppercase">JPG, PNG, PDF — MAX 5 MB</p>
                                                    </div>
                                                </div>
                                                {addressKey && <span className="text-[10px] font-bold text-[var(--sidebar-active-text)] bg-[var(--sidebar-active-text)]/10 px-3.5 py-1.5 rounded-xl border border-[var(--sidebar-active-text)]/20">DONE</span>}
                                            </div>
                                        </label>
                                    </div>

                                    {/* Selfie Section */}
                                    <div>
                                        <label className={`block rounded-[1.5rem] p-5 cursor-pointer transition-all border ${selfieKey ? 'bg-[var(--sidebar-active-bg)] border-[var(--sidebar-active-text)]/20' : 'bg-black/5 dark:bg-white/5 border-[var(--sidebar-border)]'} mb-8`}>
                                            <input type="file" className="hidden" accept="image/*" capture="user" onChange={(e) => handleFileUpload(e, 'selfie')} />
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${selfieKey ? 'bg-[var(--sidebar-active-text)]/10 text-[var(--sidebar-active-text)]' : 'bg-black/10 dark:bg-white/10 text-[var(--color-text-muted)]'}`}>
                                                        {selfieKey ? (
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-bold text-[var(--foreground)] mb-0.5 font-montserrat">Selfie Verification</p>
                                                        <p className="text-[12px] text-[var(--color-text-muted)] font-medium font-montserrat">Selfie holding your ID next to your face</p>
                                                        <p className="text-[10px] text-[var(--color-text-muted)] opacity-60 font-medium font-montserrat mt-1 uppercase">JPG, PNG — MAX 5 MB</p>
                                                    </div>
                                                </div>
                                                {selfieKey && <span className="text-[10px] font-bold text-[var(--sidebar-active-text)] bg-[var(--sidebar-active-text)]/10 px-3.5 py-1.5 rounded-xl border border-[var(--sidebar-active-text)]/20">DONE</span>}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                 <div className="flex items-start gap-4 p-5 rounded-[1.25rem] bg-black/5 dark:bg-white/5 border border-[var(--sidebar-border)] mb-8">
                                    <div className="shrink-0 mt-0.5 text-[var(--color-text-muted)]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                        </svg>
                                    </div>
                                    <p className="text-[12px] text-[var(--color-text-muted)] font-medium leading-relaxed font-montserrat">
                                        Your documents are encrypted and stored securely per UAE AML regulations.
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={handleFormSubmit}
                                    disabled={isSubmitting || isUploading}
                                    className="w-full py-4.5 rounded-2xl bg-[#11BA96] text-black font-bold text-base cursor-pointer border-0 transition-all hover:opacity-90 shadow-lg shadow-[#11BA96]/20 disabled:opacity-50 disabled:cursor-not-allowed font-montserrat flex items-center justify-center gap-2"
                                >
                                    {isSubmitting || isUploading ? "Processing..." : (
                                        <>
                                            Submit KYC
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </>
                                    )}
                                </motion.button>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
