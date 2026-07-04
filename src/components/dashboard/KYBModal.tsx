"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useUploadFileMutation } from "@/store/api/assetApi";
import { useSubmitKybMutation, useGetKybStatusQuery } from "@/store/api/kybApi";
import { LoadingSpinner, UploadIcon, BusinessPropertyIcon } from "../VectorImages";

const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, y: 20 },
};

/* ── decorative shield illustration shown when REJECTED ── */
const RejectedIllustration = () => (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="48" cy="48" r="48" fill="#FEE2E2" fillOpacity="0.6" />
        <path
            d="M48 18L26 28V46C26 58.6 35.52 70.36 48 74C60.48 70.36 70 58.6 70 46V28L48 18Z"
            fill="#FECACA"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinejoin="round"
        />
        <circle cx="48" cy="48" r="12" fill="white" />
        <path d="M44 44L52 52M52 44L44 52" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

/* ── decorative shield for VERIFIED ── */
const VerifiedIllustration = () => (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="48" cy="48" r="48" fill="#D1FAE5" fillOpacity="0.6" />
        <path
            d="M48 18L26 28V46C26 58.6 35.52 70.36 48 74C60.48 70.36 70 58.6 70 46V28L48 18Z"
            fill="#A7F3D0"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinejoin="round"
        />
        <circle cx="48" cy="48" r="12" fill="white" />
        <path d="M43 48L46.5 51.5L53 44" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ── upload item row ── */
const KybUploadItem = ({ label, description, onUpload, value, isUploading }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="rounded-xl p-4 mb-3 transition-all border border-[var(--sidebar-border)] bg-[var(--field-surface)] hover:border-[var(--color-primary-300)]/20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${
                            value ? "bg-[var(--color-primary-300)]/10" : "bg-[var(--color-bg-nav)] hover:bg-[var(--color-primary-300)]/5"
                        }`}
                    >
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                        />
                        {isUploading ? (
                            <LoadingSpinner className="w-5 h-5 text-[var(--color-primary-300)]" />
                        ) : value ? (
                            <div className="w-5 h-5 rounded-full bg-[var(--color-primary-300)] flex items-center justify-center text-black text-[10px] font-bold">✓</div>
                        ) : (
                            <UploadIcon className="w-5 h-5 text-[var(--color-text-muted)]" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[var(--header-text)]">{label}</p>
                        <p className="text-[10px] text-[var(--color-text-muted)]">{description}</p>
                    </div>
                </div>
                {value && (
                    <span className="text-[10px] font-semibold text-[var(--color-primary-300)] bg-[var(--color-primary-300)]/10 px-2 py-1 rounded-md">UPLOADED</span>
                )}
            </div>
        </div>
    );
};

export default function KYBModal({ isOpen, onClose, onSubmit }: any) {
    const [formData, setFormData] = useState({
        registrationCertificateKey: "",
        gstTaxCertificateKey: "",
        memorandumKey: "",
        directorIdKey: "",
    });

    const [isReverifying, setIsReverifying] = useState(false);
    const [uploadField, setUploadField] = useState<string | null>(null);
    const [uploadFile] = useUploadFileMutation();
    const [submitKyb, { isLoading: isSubmitting }] = useSubmitKybMutation();
    const { data: kybStatus, isLoading: isLoadingStatus } = useGetKybStatusQuery(undefined, { skip: !isOpen });

    const status = kybStatus?.status;

    const handleFileUpload = async (file: File, field: string) => {
        setUploadField(field);
        try {
            const result: any = await uploadFile({ file, folder: "kyb" }).unwrap();
            setFormData((prev) => ({ ...prev, [field]: result.key || result.url }));
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Upload failed. Please try again.");
        } finally {
            setUploadField(null);
        }
    };

    const handleSubmit = async () => {
        if (!formData.registrationCertificateKey) {
            alert("Please upload registration certificate.");
            return;
        }
        try {
            const payload = {
                ...formData,
                companyName: "Glofi Properties LLC",
                registrationNo: "REG-12345",
            };
            await submitKyb(payload).unwrap();
            alert("KYB submitted successfully!");
            if (onSubmit) onSubmit();
            else onClose();
        } catch (err: any) {
            console.error("KYB submission failed:", err);
            alert(err?.data?.message || "KYB submission failed");
        }
    };

    if (!isOpen) return null;

    const isRejected = status === "REJECTED";
    const isVerified = status === "VERIFIED";
    const isUnderReview = status === "UNDER_REVIEW";

    const subtitle =
        isUnderReview ? "Your verification is currently being processed" :
        isVerified    ? "Your business has been verified successfully" :
        isRejected    ? "Verification was not successful" :
        "Upload documents to verify your business entity";

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
                    {/* backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

                    <motion.div
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 lg:p-8 shadow-2xl"
                        style={{
                            background: "var(--card-surface)",
                            border: "1px solid var(--color-primary-300-alpha-30)",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.1)",
                        }}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* ── header ── */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[2px] text-[var(--color-primary-300)] font-bold font-montserrat">
                                <BusinessPropertyIcon className="w-4 h-4" />
                                <span>KYB Verification</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:bg-[var(--color-bg-nav)] transition-all bg-transparent border-0 cursor-pointer"
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        {/* ── title row ── */}
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--header-text)] mb-1 font-montserrat">
                                    Business verification
                                </h2>
                                <p className="text-sm text-[var(--color-text-muted)] font-montserrat">{subtitle}</p>
                            </div>
                            {/* decorative illustration */}
                            {!isLoadingStatus && (isRejected || isVerified) && (
                                <div className="flex-shrink-0 ml-4">
                                    {isRejected ? <RejectedIllustration /> : <VerifiedIllustration />}
                                </div>
                            )}
                        </div>

                        {/* ── body ── */}
                        {isLoadingStatus ? (
                            <div className="flex items-center justify-center p-12">
                                <LoadingSpinner className="w-8 h-8 text-[var(--color-primary-300)]" />
                            </div>
                        ) : status && !["PENDING", "NOT_SUBMITTED"].includes(status) && !isReverifying ? (
                            <div className="space-y-5">
                                {/* status card */}
                                <div
                                    className={`p-5 rounded-2xl border ${
                                        isVerified
                                            ? "bg-emerald-50 border-emerald-200"
                                            : isRejected
                                            ? "bg-red-50 border-red-200"
                                            : "bg-amber-50 border-amber-200"
                                    }`}
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        {/* status circle icon */}
                                        <div
                                            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                isVerified
                                                    ? "bg-emerald-100 text-emerald-600"
                                                    : isRejected
                                                    ? "bg-red-100 text-red-500"
                                                    : "bg-amber-100 text-amber-600"
                                            }`}
                                        >
                                            {isVerified ? (
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <path d="M3.75 9L7.5 12.75L14.25 5.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ) : isRejected ? (
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M9 5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <circle cx="9" cy="12.5" r="0.75" fill="currentColor" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p
                                                className={`text-base font-bold uppercase tracking-wider font-montserrat ${
                                                    isVerified ? "text-emerald-700" : isRejected ? "text-red-700" : "text-amber-700"
                                                }`}
                                            >
                                                {status.replace("_", " ")}
                                            </p>
                                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Status updated recently</p>
                                        </div>
                                    </div>

                                    {/* rejection note */}
                                    {isRejected && kybStatus?.rejectedNote && (
                                        <div className="mt-2 p-4 rounded-xl bg-white border border-red-200">
                                            <p className="text-[10px] uppercase font-bold text-red-500 mb-1.5 tracking-widest font-montserrat">
                                                Rejection Note
                                            </p>
                                            <p className="text-sm text-red-600/90 leading-relaxed font-montserrat">
                                                {kybStatus.rejectedNote}
                                            </p>
                                        </div>
                                    )}

                                    {/* under review message */}
                                    {isUnderReview && (
                                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-2">
                                            Our compliance team is currently reviewing your application. This typically takes 2–5 business days. You will be notified once the review is complete.
                                        </p>
                                    )}
                                </div>

                                {/* action buttons */}
                                {isRejected ? (
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={onClose}
                                            className="flex-1 h-14 rounded-2xl border border-[var(--sidebar-border)] text-[var(--color-text-muted)] hover:text-[var(--header-text)] font-bold text-sm transition-all hover:bg-[var(--color-bg-nav)] bg-transparent cursor-pointer flex items-center justify-center gap-2 font-montserrat"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            Close Window
                                        </button>
                                        <button
                                            onClick={() => setIsReverifying(true)}
                                            className="flex-[2] h-14 rounded-2xl bg-[var(--color-primary-300)] text-black font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 font-montserrat shadow-sm"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M2.5 8C2.5 5.015 4.93 2.5 8 2.5C9.644 2.5 11.118 3.21 12.142 4.34M13.5 8C13.5 10.985 11.07 13.5 8 13.5C6.356 13.5 4.882 12.79 3.858 11.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M10.5 4L12.5 4.5L12 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M5.5 12L3.5 11.5L4 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Resubmit Documents
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={onClose}
                                        className="w-full h-14 rounded-2xl bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] font-bold text-sm transition-all hover:bg-[var(--color-primary-300)]/20 cursor-pointer font-montserrat"
                                    >
                                        Close Window
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* ── upload form ── */}
                                <div className="flex flex-col gap-1">
                                    <KybUploadItem
                                        label="Registration Certificate"
                                        description="Certificate of incorporation or trade license (PDF, JPG — MAX 10 MB)"
                                        onUpload={(file: File) => handleFileUpload(file, "registrationCertificateKey")}
                                        value={formData.registrationCertificateKey}
                                        isUploading={uploadField === "registrationCertificateKey"}
                                    />
                                    <KybUploadItem
                                        label="GST / Tax Certificate"
                                        description="Tax registration proof (optional) (PDF, JPG — MAX 10 MB)"
                                        onUpload={(file: File) => handleFileUpload(file, "gstTaxCertificateKey")}
                                        value={formData.gstTaxCertificateKey}
                                        isUploading={uploadField === "gstTaxCertificateKey"}
                                    />
                                    <KybUploadItem
                                        label="Memorandum of Association"
                                        description="Articles or partnership deed (optional) (PDF — MAX 10 MB)"
                                        onUpload={(file: File) => handleFileUpload(file, "memorandumKey")}
                                        value={formData.memorandumKey}
                                        isUploading={uploadField === "memorandumKey"}
                                    />
                                    <KybUploadItem
                                        label="Director / Shareholder ID"
                                        description="Government ID of authorized director (PDF, JPG — MAX 5 MB)"
                                        onUpload={(file: File) => handleFileUpload(file, "directorIdKey")}
                                        value={formData.directorIdKey}
                                        isUploading={uploadField === "directorIdKey"}
                                    />
                                </div>

                                <div className="bg-[var(--color-primary-300)]/5 border border-[var(--color-primary-300)]/10 rounded-xl p-4 my-6 flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M7.00033 12.8334C10.222 12.8334 12.8337 10.2217 12.8337 7.00008C12.8337 3.77842 10.222 1.16675 7.00033 1.16675C3.77866 1.16675 1.16699 3.77842 1.16699 7.00008C1.16699 10.2217 3.77866 12.8334 7.00033 12.8334Z" stroke="var(--color-primary-300)" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M7 4.66675V7.00008" stroke="var(--color-primary-300)" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M7 9.33325H7.00583" stroke="var(--color-primary-300)" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed font-montserrat">
                                        Documents verified per UAE DFSA and RERA guidelines. Review takes 2–5 business days.
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isSubmitting}
                                    onClick={handleSubmit}
                                    className="w-full h-14 rounded-2xl bg-[var(--color-primary-300)] text-black font-bold text-sm cursor-pointer border-0 transition-all hover:opacity-90 flex items-center justify-center gap-2 font-montserrat shadow-sm"
                                >
                                    {isSubmitting ? <LoadingSpinner color="black" /> : (
                                        <>
                                            Submit KYB
                                            <span className="text-lg">→</span>
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
