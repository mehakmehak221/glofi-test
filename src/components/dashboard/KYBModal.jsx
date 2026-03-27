"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadFileMutation } from "@/store/api/assetApi";
import { useSubmitKybMutation, useGetKybStatusQuery } from "@/store/api/kybApi";
import { LoadingSpinner, UploadIcon, BusinessPropertyIcon } from "../VectorImages";

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, y: 20 },
};

const KybUploadItem = ({ label, description, onUpload, value, isUploading }) => {
    const fileInputRef = useRef(null);

    return (
        <div
            className="rounded-xl p-4 mb-3 transition-all border border-[var(--sidebar-border)] bg-[var(--field-surface)] hover:border-[var(--color-primary-300)]/20"
        >
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
                            onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
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
                        <p className="text-sm font-medium text-white">{label}</p>
                        <p className="text-[10px] text-[var(--color-text-secondary)]">{description}</p>
                    </div>
                </div>
                {value && (
                    <span className="text-[10px] font-semibold text-[var(--color-primary-300)] bg-[var(--color-primary-300)]/10 px-2 py-1 rounded-md">UPLOADED</span>
                )}
            </div>
        </div>
    );
};

export default function KYBModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        registrationCertificateKey: "",
        gstTaxCertificateKey: "",
        memorandumKey: "",
        directorIdKey: "",
    });

    const [uploadField, setUploadField] = useState(null);
    const [uploadFile] = useUploadFileMutation();
    const [submitKyb, { isLoading: isSubmitting }] = useSubmitKybMutation();
    const { data: kybStatus, isLoading: isLoadingStatus } = useGetKybStatusQuery(undefined, { skip: !isOpen });

    const status = kybStatus?.status;

    const handleFileUpload = async (file, field) => {
        setUploadField(field);
        try {
            const result = await uploadFile({ file, folder: 'kyb' }).unwrap();
            setFormData(prev => ({ ...prev, [field]: result.key || result.url }));
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed. Please try again.');
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
                companyName: "GloFi Properties LLC", 
                registrationNo: "REG-12345", 
            };
            await submitKyb(payload).unwrap();
            alert("KYB submitted successfully!");
            if (onSubmit) onSubmit();
            else onClose();
        } catch (err) {
            console.error('KYB submission failed:', err);
            alert(err?.data?.message || "KYB submission failed");
        }
    };

    if (!isOpen) return null;

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
                    <div className="absolute inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 lg:p-8"
                        style={{
                            background: 'var(--card-surface)',
                            border: '1px solid var(--color-primary-300-alpha-30)',
                        }}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[2px] text-[var(--color-primary-300)] font-bold">
                                <BusinessPropertyIcon className="w-4 h-4" />
                                <span>KYB Verification</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-[var(--color-text-secondary)] hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <h2 className="text-xl lg:text-2xl font-bold text-white mb-2 font-montserrat">Business verification</h2>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-8 font-montserrat">
                            {status === 'UNDER_REVIEW' ? 'Your verification is currently being processed' : 
                             status === 'VERIFIED' ? 'Your business has been verified' : 
                             status === 'REJECTED' ? 'Verification was not successful' : 
                             'Upload documents to verify your business entity'}
                        </p>

                        {isLoadingStatus ? (
                            <div className="flex items-center justify-center p-12">
                                <LoadingSpinner className="w-8 h-8 text-[var(--color-primary-300)]" />
                            </div>
                        ) : status && !['PENDING', 'NOT_SUBMITTED'].includes(status) ? (
                            <div className="space-y-6">
                                <div className={`p-6 rounded-2xl border ${
                                    status === 'VERIFIED' ? 'bg-green-500/5 border-green-500/20' :
                                    status === 'REJECTED' ? 'bg-red-500/5 border-red-500/20' :
                                    'bg-[var(--color-primary-300)]/5 border-[var(--color-primary-300)]/20'
                                }`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                            status === 'VERIFIED' ? 'bg-green-500/20 text-green-500' :
                                            status === 'REJECTED' ? 'bg-red-500/20 text-red-500' :
                                            'bg-[var(--color-primary-300)]/20 text-[var(--color-primary-300)]'
                                        }`}>
                                            {status === 'VERIFIED' ? '✓' : status === 'REJECTED' ? '✕' : '...'}
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-white uppercase tracking-wider">{status.replace('_', ' ')}</p>
                                            <p className="text-xs text-[var(--color-text-secondary)]">Status updated recently</p>
                                        </div>
                                    </div>
                                    
                                    {status === 'REJECTED' && kybStatus.rejectedNote && (
                                        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/10">
                                            <p className="text-[10px] uppercase font-bold text-red-500 mb-1 tracking-widest">Rejection Note</p>
                                            <p className="text-sm text-red-100/80 leading-relaxed">{kybStatus.rejectedNote}</p>
                                        </div>
                                    )}

                                    {status === 'UNDER_REVIEW' && (
                                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                                            Our compliance team is currently reviewing your application. This typicaly takes 2-5 business days. You will be notified once the review is complete.
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] font-bold text-sm transition-all hover:bg-[var(--color-primary-300)]/20"
                                >
                                    Close Window
                                </button>
                            </div>
                        ) : (
                            <>
                            <div className="flex flex-col gap-1">
                            <KybUploadItem 
                                label="Registration Certificate"
                                description="Certificate of incorporation or trade license (PDF, JPG — MAX 10 MB)"
                                onUpload={(file) => handleFileUpload(file, 'registrationCertificateKey')}
                                value={formData.registrationCertificateKey}
                                isUploading={uploadField === 'registrationCertificateKey'}
                            />
                            <KybUploadItem 
                                label="GST / Tax Certificate"
                                description="Tax registration proof (optional) (PDF, JPG — MAX 10 MB)"
                                onUpload={(file) => handleFileUpload(file, 'gstTaxCertificateKey')}
                                value={formData.gstTaxCertificateKey}
                                isUploading={uploadField === 'gstTaxCertificateKey'}
                            />
                            <KybUploadItem 
                                label="Memorandum of Association"
                                description="Articles or partnership deed (optional) (PDF — MAX 10 MB)"
                                onUpload={(file) => handleFileUpload(file, 'memorandumKey')}
                                value={formData.memorandumKey}
                                isUploading={uploadField === 'memorandumKey'}
                            />
                            <KybUploadItem 
                                label="Director / Shareholder ID"
                                description="Government ID of authorized director (PDF, JPG — MAX 5 MB)"
                                onUpload={(file) => handleFileUpload(file, 'directorIdKey')}
                                value={formData.directorIdKey}
                                isUploading={uploadField === 'directorIdKey'}
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
                                Documents verified per UAE DFSA and RERA guidelines. Review takes 2-5 business days.
                            </p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className="w-full py-4 rounded-2xl bg-[var(--color-primary-300)] text-black font-bold text-sm cursor-pointer border-0 transition-all hover:bg-[var(--color-primary-100)] flex items-center justify-center gap-2"
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
