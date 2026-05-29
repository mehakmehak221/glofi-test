import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmitKycMutation, useGetKycStatusQuery, useSetupAgentKycMutation } from "@/store/api/kycApi";
import { useUploadFileMutation } from "@/store/api/fileApi";
import { useGetProfileQuery } from "@/store/api/authApi";

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, y: 20 },
} as const;

const DOC_TABS = ["Passport", "Aadhaar", "PAN Card", "License"];

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
    const [step, setStep] = useState(1);
    const [activeTab, setActiveTab] = useState("Passport");
    const [isReverifying, setIsReverifying] = useState(false);
    
    const [idDocKey, setIdDocKey] = useState("");
    const [selfieKey, setSelfieKey] = useState("");
    const [addressKey, setAddressKey] = useState("");

    // Agent specific fields
    const [reraNumber, setReraNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [reraDocKey, setReraDocKey] = useState("");

    const { data: profileData } = useGetProfileQuery(undefined, { skip: !isOpen });
    const { data: kycStatus, isLoading: isStatusLoading, refetch: refetchStatus } = useGetKycStatusQuery(undefined, { skip: !isOpen, refetchOnMountOrArgChange: true });
    
    const [submitKyc, { isLoading: isSubmittingInvestor }] = useSubmitKycMutation();
    const [setupAgentKyc, { isLoading: isSubmittingAgent }] = useSetupAgentKycMutation();
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

    const isAgent = profileData?.role === "AGENT";
    const isSubmitting = isSubmittingInvestor || isSubmittingAgent;

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            refetchStatus();
            setIsReverifying(false);
        }
    }, [isOpen, refetchStatus]);

    if (!isOpen) return null;

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const folder = type === 'rera' ? 'rera' : 'kyc';
            const result = await uploadFile({ file, folder }).unwrap();
            
            if (type === 'id') setIdDocKey(result.url || result.key);
            else if (type === 'selfie') setSelfieKey(result.url || result.key);
            else if (type === 'address') setAddressKey(result.url || result.key);
            else if (type === 'rera') setReraDocKey(result.url || result.key);
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    const handleFormSubmit = async () => {
        if (!idDocKey || !selfieKey || !addressKey) {
            alert("Please upload all required identity documents.");
            return;
        }

        if (isAgent && (!reraNumber || !expiryDate || !reraDocKey)) {
            alert("Please provide all RERA details.");
            return;
        }

        try {
            if (isAgent) {
                await setupAgentKyc({
                    documentType: TYPE_MAP[activeTab],
                    documentUrl: idDocKey,
                    selfieUrl: selfieKey,
                    addressProofUrl: addressKey,
                    reraDocumentUrl: reraDocKey,
                    reraNumber,
                    expiryDate
                }).unwrap();
            } else {
                await submitKyc({
                    documentType: TYPE_MAP[activeTab],
                    documentUrl: idDocKey,
                    selfieUrl: selfieKey,
                    addressProofType: "UTILITY_BILL", // Default for investor
                    addressProofUrl: addressKey
                }).unwrap();
            }
            if (onSubmit) onSubmit();
        } catch (err) {
            console.error('Submission failed:', err);
            alert(err?.data?.message || "Verification submission failed. Please check your data.");
        }
    };

    const isPending = kycStatus?.status === "UNDER_REVIEW";
    const isVerified = kycStatus?.status === "VERIFIED" || kycStatus?.status === "APPROVED";
    const isRejected = kycStatus?.status === "REJECTED";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        className="bg-[var(--form-surface)] w-full max-w-xl p-8 rounded-2xl shadow-2xl relative border border-[var(--foreground)]/10 max-h-[90vh] overflow-y-auto theme-purple"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[1.5px] text-[#00FFCC] font-bold font-montserrat">
                                <div className="w-2 h-2 rounded-full bg-[#00FFCC] animate-pulse" />
                                <span>{isAgent ? "Agent Verification" : "KYC Verification"}</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors bg-transparent border-0 cursor-pointer p-1"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {isStatusLoading ? (
                            <div className="flex items-center justify-center p-12">
                                <div className="w-10 h-10 border-2 border-[#00FFCC]/20 border-t-[#00FFCC] rounded-full animate-spin" />
                            </div>
                        ) : (isPending || isVerified || (isRejected && !isReverifying && !idDocKey && !selfieKey && !addressKey)) ? (
                            <div className="text-center py-8">
                                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 ${
                                    isVerified ? 'bg-green-500/10 text-green-500' : 
                                    isRejected ? 'bg-red-500/10 text-red-500' :
                                    'bg-yellow-500/10 text-yellow-500'}`}>
                                    {isVerified ? (
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : isRejected ? (
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2 font-montserrat">
                                    {isVerified ? "Verified" : isRejected ? "Verification Rejected" : "In Review"}
                                </h2>
                                <p className="text-sm text-[var(--foreground)]/50 mb-8 font-montserrat px-4 leading-relaxed">
                                    {isVerified ? "Your identity and credentials have been successfully verified." : 
                                     isRejected ? (kycStatus?.rejectedNote || "Your submission was rejected. Please review your documents and try again.") :
                                     "Our compliance team is reviewing your documents. This typically takes 24-48 hours."}
                                </p>
                                {isRejected ? (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={onClose}
                                            className="flex-1 h-14 rounded-xl border border-[var(--foreground)]/10 text-[var(--foreground)] font-bold text-sm hover:bg-[var(--foreground)]/5 transition-all cursor-pointer bg-transparent"
                                        >
                                            Return to Dashboard
                                        </button>
                                        <button
                                            onClick={() => setIsReverifying(true)}
                                            className="flex-[2] h-14 rounded-xl bg-[#00FFCC] text-black font-bold text-sm cursor-pointer border-0 transition-all hover:opacity-90 font-montserrat"
                                        >
                                            Resubmit Documents
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={onClose}
                                        className="w-full h-14 rounded-xl bg-[#00FFCC] text-black font-bold text-sm cursor-pointer border-0 transition-all hover:opacity-90"
                                    >
                                        Return to Dashboard
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2 font-montserrat">
                                    {step === 1 ? "Identity Verification" : "RERA Details"}
                                </h2>
                                <p className="text-sm text-[var(--foreground)]/50 mb-8 font-montserrat">
                                    {step === 1 ? "Upload your government-issued documents for verification." : "Provide your real estate licensing information."}
                                </p>

                                <div className="space-y-6">
                                    {step === 1 ? (
                                        <>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {DOC_TABS.map((tab) => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setActiveTab(tab)}
                                                        className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer border uppercase tracking-wider ${activeTab === tab
                                                            ? "bg-[#00FFCC]/10 text-[#00FFCC] border-[#00FFCC]/30"
                                                            : "bg-[var(--foreground)]/[0.03] text-[var(--foreground)]/40 border-transparent hover:border-[var(--foreground)]/10"
                                                            }`}
                                                    >
                                                        {tab}
                                                    </button>
                                                ))}
                                            </div>

                                            <label className={`block rounded-xl p-5 cursor-pointer transition-all border-2 border-dashed ${idDocKey ? 'bg-[#00FFCC]/5 border-[#00FFCC]/30' : 'bg-[var(--foreground)]/[0.02] border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20'}`}>
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'id')} />
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${idDocKey ? 'bg-[#00FFCC]/10 text-[#00FFCC]' : 'bg-[var(--foreground)]/5 text-[var(--foreground)]/20'}`}>
                                                            {idDocKey ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-[var(--foreground)] mb-0.5 font-montserrat">Document — Front</p>
                                                            <p className="text-[11px] text-[var(--foreground)]/40 font-montserrat">Clear photo of front side</p>
                                                        </div>
                                                    </div>
                                                    {idDocKey && <span className="text-[10px] font-bold text-[#00FFCC] bg-[#00FFCC]/10 px-3 py-1 rounded-full">UPLOADED</span>}
                                                </div>
                                            </label>

                                            <label className={`block rounded-xl p-5 cursor-pointer transition-all border-2 border-dashed ${addressKey ? 'bg-[#00FFCC]/5 border-[#00FFCC]/30' : 'bg-[var(--foreground)]/[0.02] border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20'}`}>
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'address')} />
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${addressKey ? 'bg-[#00FFCC]/10 text-[#00FFCC]' : 'bg-[var(--foreground)]/5 text-[var(--foreground)]/20'}`}>
                                                            {addressKey ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-[var(--foreground)] mb-0.5 font-montserrat">Address Proof</p>
                                                            <p className="text-[11px] text-[var(--foreground)]/40 font-montserrat">Utility Bill or Bank Statement</p>
                                                        </div>
                                                    </div>
                                                    {addressKey && <span className="text-[10px] font-bold text-[#00FFCC] bg-[#00FFCC]/10 px-3 py-1 rounded-full">UPLOADED</span>}
                                                </div>
                                            </label>

                                            <label className={`block rounded-xl p-5 cursor-pointer transition-all border-2 border-dashed ${selfieKey ? 'bg-[#00FFCC]/5 border-[#00FFCC]/30' : 'bg-[var(--foreground)]/[0.02] border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20'}`}>
                                                <input type="file" className="hidden" accept="image/*" capture="user" onChange={(e) => handleFileUpload(e, 'selfie')} />
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${selfieKey ? 'bg-[#00FFCC]/10 text-[#00FFCC]' : 'bg-[var(--foreground)]/5 text-[var(--foreground)]/20'}`}>
                                                            {selfieKey ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-[var(--foreground)] mb-0.5 font-montserrat">Selfie Verification</p>
                                                            <p className="text-[11px] text-[var(--foreground)]/40 font-montserrat">Hold your ID next to your face</p>
                                                        </div>
                                                    </div>
                                                    {selfieKey && <span className="text-[10px] font-bold text-[#00FFCC] bg-[#00FFCC]/10 px-3 py-1 rounded-full">UPLOADED</span>}
                                                </div>
                                            </label>

                                            <button
                                                onClick={() => isAgent ? setStep(2) : handleFormSubmit()}
                                                disabled={!idDocKey || !selfieKey || !addressKey || isUploading}
                                                className="w-full h-14 rounded-xl bg-[#00FFCC] text-black font-bold text-sm cursor-pointer border-0 transition-all hover:opacity-90 disabled:opacity-50 mt-4"
                                            >
                                                {isAgent ? "Next: RERA Details" : (isSubmitting ? "Submitting..." : "Complete Verification")}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[11px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest ml-1">RERA Number</label>
                                                    <input
                                                        type="text" placeholder="RERA-MH-2024-001234"
                                                        value={reraNumber} onChange={e => setReraNumber(e.target.value)}
                                                        className="w-full h-14 rounded-xl px-5 bg-[var(--foreground)]/[0.03] border border-[var(--foreground)]/10 text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:border-[#00FFCC]/30 transition-all font-medium"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[11px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest ml-1">License Expiry Date</label>
                                                    <input
                                                        type="date"
                                                        value={expiryDate} onChange={e => setExpiryDate(e.target.value)}
                                                        className="w-full h-14 rounded-xl px-5 bg-[var(--foreground)]/[0.03] border border-[var(--foreground)]/10 text-[var(--foreground)] focus:outline-none focus:border-[#00FFCC]/30 transition-all font-medium"
                                                    />
                                                </div>

                                                <label className={`block rounded-xl p-5 cursor-pointer transition-all border-2 border-dashed ${reraDocKey ? 'bg-[#00FFCC]/5 border-[#00FFCC]/30' : 'bg-[var(--foreground)]/[0.02] border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20'}`}>
                                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'rera')} />
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${reraDocKey ? 'bg-[#00FFCC]/10 text-[#00FFCC]' : 'bg-[var(--foreground)]/5 text-[var(--foreground)]/20'}`}>
                                                                {reraDocKey ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-[var(--foreground)] mb-0.5 font-montserrat">RERA Certificate</p>
                                                                <p className="text-[11px] text-[var(--foreground)]/40 font-montserrat">Upload PDF or JPEG</p>
                                                            </div>
                                                        </div>
                                                        {reraDocKey && <span className="text-[10px] font-bold text-[#00FFCC] bg-[#00FFCC]/10 px-3 py-1 rounded-full">UPLOADED</span>}
                                                    </div>
                                                </label>
                                            </div>

                                            <div className="flex gap-4 mt-6">
                                                <button
                                                    onClick={() => setStep(1)}
                                                    className="flex-1 h-14 rounded-xl border border-[var(--foreground)]/10 text-[var(--foreground)] font-bold text-sm hover:bg-[var(--foreground)]/5 transition-all"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={handleFormSubmit}
                                                    disabled={!reraNumber || !expiryDate || !reraDocKey || isSubmitting || isUploading}
                                                    className="flex-[2] h-14 rounded-xl bg-[#00FFCC] text-black font-bold text-sm cursor-pointer border-0 transition-all hover:opacity-90 disabled:opacity-50"
                                                >
                                                    {isSubmitting ? "Submitting..." : "Complete Verification"}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
