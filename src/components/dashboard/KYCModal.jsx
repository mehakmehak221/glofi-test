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
                        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-6"
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
                            <div className="flex items-center gap-1 text-[10px] uppercase tracking-[2px] text-[var(--color-text-muted)] font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M13.3337 8.66664C13.3337 12 11.0003 13.6666 8.22699 14.6333C8.08177 14.6825 7.92402 14.6802 7.78033 14.6266C5.00033 13.6666 2.66699 12 2.66699 8.66664V3.99997C2.66699 3.82316 2.73723 3.65359 2.86225 3.52857C2.98728 3.40355 3.15685 3.33331 3.33366 3.33331C4.66699 3.33331 6.33366 2.53331 7.49366 1.51997C7.6349 1.39931 7.81456 1.33301 8.00033 1.33301C8.18609 1.33301 8.36576 1.39931 8.50699 1.51997C9.67366 2.53997 11.3337 3.33331 12.667 3.33331C12.8438 3.33331 13.0134 3.40355 13.1384 3.52857C13.2634 3.65359 13.3337 3.82316 13.3337 3.99997V8.66664Z" stroke="var(--color-primary-300)" strokeOpacity="0.6" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>KYC Verification</span>
                            </div>
                            <button onClick={onClose} className="text-[var(--color-text-secondary)] hover:text-white bg-transparent border-0 cursor-pointer text-lg">✕</button>
                        </div>

                        {isStatusLoading ? (
                            <div className="flex items-center justify-center p-12">
                                <div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin" />
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
                                <h2 className="text-xl font-bold text-white mb-2">
                                    {isVerified ? "Verified" : isRejected ? "KYC Rejected" : "Under Review"}
                                </h2>
                                <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                                    {isVerified ? "Your identity has been successfully verified." : 
                                     isRejected ? (kycStatus?.rejectedNote || "Your submission was rejected. Please review and resubmit.") :
                                     "Your documents are currently being reviewed by our team."}
                                </p>
                                {isRejected && (
                                    <button
                                        onClick={() => {
                                            setIdDocKey("");
                                            setSelfieKey("");
                                            setAddressKey("");
                                        }}
                                        className="text-xs text-[var(--color-primary-300)] bg-transparent border border-[var(--color-primary-300-alpha-30)] px-4 py-2 rounded-lg cursor-pointer hover:bg-[var(--color-primary-300-alpha-10)] transition-colors"
                                    >
                                        Resubmit Documents
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <h2 className="text-lg sm:text-xl font-semibold text-white mb-1">Identity verification</h2>
                                <p className="text-xs text-[var(--color-text-secondary)] mb-5">Upload a government-issued ID and address proof.</p>

                                <div className="space-y-6">
                                    {/* Identity Section */}
                                    <div>
                                        <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">1. Select Identity Type</p>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {DOC_TABS.map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveTab(tab)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border ${activeTab === tab
                                                        ? "bg-[var(--color-primary-300-alpha-10)] text-[var(--color-primary-300)] border-[var(--color-primary-300-alpha-30)]"
                                                        : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-muted)]"
                                                        }`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>

                                        <label className="block rounded-lg p-4 cursor-pointer hover:bg-[var(--color-bg-surface-subtle)] transition-colors border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-subtle)]">
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'id')} />
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-300-alpha-10)] flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-[var(--color-primary-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">Upload {activeTab}</p>
                                                        <p className="text-[10px] text-[var(--color-text-secondary)]">{idDocKey ? "File selected" : "Click to upload"}</p>
                                                    </div>
                                                </div>
                                                {idDocKey && <span className="text-[10px] font-bold text-[var(--color-primary-300)]">DONE</span>}
                                            </div>
                                        </label>
                                    </div>

                                    {/* Address Section */}
                                    <div>
                                        <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">2. Select Address Proof</p>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {ADDRESS_TABS.map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setAddressTab(tab)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border ${addressTab === tab
                                                        ? "bg-[var(--color-primary-300-alpha-10)] text-[var(--color-primary-300)] border-[var(--color-primary-300-alpha-30)]"
                                                        : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-muted)]"
                                                        }`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>

                                        <label className="block rounded-lg p-4 cursor-pointer hover:bg-[var(--color-bg-surface-subtle)] transition-colors border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-subtle)]">
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'address')} />
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-300-alpha-10)] flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-[var(--color-primary-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">Upload {addressTab}</p>
                                                        <p className="text-[10px] text-[var(--color-text-secondary)]">{addressKey ? "File selected" : "Click to upload"}</p>
                                                    </div>
                                                </div>
                                                {addressKey && <span className="text-[10px] font-bold text-[var(--color-primary-300)]">DONE</span>}
                                            </div>
                                        </label>
                                    </div>

                                    {/* Selfie Section */}
                                    <div>
                                        <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">3. Selfie Verification</p>
                                        <label className="block rounded-lg p-4 cursor-pointer hover:bg-[var(--color-bg-surface-subtle)] transition-colors border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-subtle)]">
                                            <input type="file" className="hidden" accept="image/*" capture="user" onChange={(e) => handleFileUpload(e, 'selfie')} />
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-300-alpha-10)] flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-[var(--color-primary-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">Capture Selfie</p>
                                                        <p className="text-[10px] text-[var(--color-text-secondary)]">{selfieKey ? "Selfie captured" : "Click to open camera"}</p>
                                                    </div>
                                                </div>
                                                {selfieKey && <span className="text-[10px] font-bold text-[var(--color-primary-300)]">DONE</span>}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isSubmitting || isUploading}
                                        onClick={handleFormSubmit}
                                        className="w-full py-3 rounded-xl bg-[var(--color-gradient-glofi)] text-black font-semibold text-sm cursor-pointer border-0 transition-shadow hover:shadow-[0_0_20px_var(--color-primary-300-alpha-30)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting || isUploading ? "Processing..." : "Submit KYC →"}
                                    </motion.button>
                                    <p className="text-[10px] text-[var(--color-text-secondary)] text-center mt-3">
                                        Your documents are encrypted and stored securely per UAE data regulations.
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
