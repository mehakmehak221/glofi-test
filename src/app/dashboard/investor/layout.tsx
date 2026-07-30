"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileTopbar from "@/components/dashboard/MobileTopbar";
import KYCModal from "@/components/dashboard/KYCModal";
import { useGetKycStatusQuery } from "@/store/api/kycApi";
import { useI18n } from "@/providers/LocaleProvider";

export default function DashboardLayout({ children }) {
    const { data: kycData, refetch: refetchKyc } = useGetKycStatusQuery();
    const [showKycModal, setShowKycModal] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const { t } = useI18n();

    useEffect(() => {
        const handleOpenKyc = () => setShowKycModal(true);
        window.addEventListener("open-kyc-modal", handleOpenKyc);
        return () => {
            window.removeEventListener("open-kyc-modal", handleOpenKyc);
        };
    }, []);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    return (
        <div className="flex h-screen bg-[var(--background)] theme-purple overflow-hidden">
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-full shadow-2xl font-montserrat text-sm font-semibold flex items-center gap-2 bg-neutral-900 border border-neutral-700 text-white whitespace-nowrap`}
                    >
                        {toast.type === "success" ? (
                            <svg className="w-5 h-5 text-[#00DAAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg className="w-5 h-5 text-[#FF5C5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <Sidebar />


            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                <MobileTopbar />


                <DashboardHeader />


                <main className="flex-1 overflow-y-auto bg-[var(--background)]">
                    <AnimatePresence>
                        {kycData && kycData.status !== "APPROVED" && kycData.status !== "VERIFIED" && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`mx-4 lg:mx-8 mt-6 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${kycData.status === "UNDER_REVIEW"
                                    ? "bg-[var(--color-status-warning-bg)] border-[var(--color-status-warning-border)] text-[var(--color-status-warning)]"
                                    : "bg-[var(--color-status-error-bg)] border-[var(--color-status-error-border)] text-[var(--color-status-error)]"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-current/10 shrink-0">
                                        {kycData.status === "UNDER_REVIEW" ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider mb-0.5">{t("Identity Verification: {status}", { status: kycData.status.replace("_", " ") })}</p>
                                        <p className="text-[11px] opacity-80 leading-relaxed max-w-2xl">
                                            {kycData.status === "UNDER_REVIEW"
                                                ? t("Your identity verification is currently being processed. You can't make investments until approved.")
                                                : t("You need to complete your identity verification before you can start investing.")}
                                        </p>
                                    </div>
                                </div>
                                {kycData.status !== "UNDER_REVIEW" && (
                                    <button
                                        onClick={() => setShowKycModal(true)}
                                        className={`px-5 py-2.5 rounded-lg text-white text-[11px] font-bold uppercase transition-all hover:opacity-90 whitespace-nowrap border-0 cursor-pointer shadow-sm ${kycData.status === "UNDER_REVIEW"
                                            ? "bg-[var(--color-status-warning)]"
                                            : "bg-[var(--color-status-error)]"
                                            }`}
                                    >
                                        {t("Verify Now")}
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {children}
                </main>
            </div>

            <KYCModal
                isOpen={showKycModal}
                onClose={() => setShowKycModal(false)}
                onSubmit={() => {
                    setShowKycModal(false);
                    refetchKyc();
                    showToast(t("KYC submitted successfully!"), "success");
                }}
            />
        </div>
    );
}
