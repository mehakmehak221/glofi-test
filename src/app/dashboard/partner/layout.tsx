"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetKycStatusQuery } from "@/store/api/kycApi";
import { useGetKybStatusQuery } from "@/store/api/kybApi";
import PartnerSidebar from "@/components/dashboard/PartnerSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileTopbar from "@/components/dashboard/MobileTopbar";
import KYCModal from "@/components/dashboard/KYCModal";
import KYBModal from "@/components/dashboard/KYBModal";
import { useI18n } from "@/providers/LocaleProvider";

export default function DashboardLayout({ children }) {
    const { data: kycData, refetch: refetchKyc } = useGetKycStatusQuery();
    const { data: kybData, refetch: refetchKyb } = useGetKybStatusQuery();
    const [showKycModal, setShowKycModal] = useState(false);
    const [showKybModal, setShowKybModal] = useState(false);
    const { t } = useI18n();

    return (
        <div className="flex h-screen bg-[var(--background)] theme-purple overflow-hidden">

            <PartnerSidebar />
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
                                                ? t("Your identity verification is currently being processed. This typically takes 24-48 hours.")
                                                : t("You need to complete your identity verification before you can manage or list properties.")}
                                        </p>
                                    </div>
                                </div>
                                {kycData.status !== "UNDER_REVIEW" && (
                                    <button
                                        onClick={() => setShowKycModal(true)}
                                        className="px-4 py-2 rounded-lg bg-white text-black text-[10px] font-bold uppercase transition-all hover:bg-white/90 whitespace-nowrap border-0 cursor-pointer shadow-sm"
                                    >
                                        {t("Verify Identity")}
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {kybData && kybData.status !== "APPROVED" && kybData.status !== "VERIFIED" && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`mx-4 lg:mx-8 mt-4 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${kybData.status === "UNDER_REVIEW"
                                    ? "bg-[var(--color-status-warning-bg)] border-[var(--color-status-warning-border)] text-[var(--color-status-warning)]"
                                    : "bg-[var(--color-status-error-bg)] border-[var(--color-status-error-border)] text-[var(--color-status-error)]"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-current/10 shrink-0">
                                        {kybData.status === "UNDER_REVIEW" ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M9 8h1" /><path d="M9 12h1" /><path d="M9 16h1" /><path d="M14 8h1" /><path d="M14 12h1" /><path d="M14 16h1" /><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" /></svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider mb-0.5">{t("Business Verification: {status}", { status: kybData.status.replace("_", " ") })}</p>
                                        <p className="text-[11px] opacity-80 leading-relaxed max-w-2xl">
                                            {kybData.status === "UNDER_REVIEW"
                                                ? t("Your business verification (KYB) is currently being processed. This typically takes 2-5 business days.")
                                                : t("You need to complete your business verification (KYB) before you can manage or list properties.")}
                                        </p>
                                    </div>
                                </div>
                                {kybData.status !== "UNDER_REVIEW" && (
                                    <button
                                        onClick={() => setShowKybModal(true)}
                                        className="px-4 py-2 rounded-lg bg-white text-black text-[10px] font-bold uppercase transition-all hover:bg-white/90 whitespace-nowrap border-0 cursor-pointer shadow-sm"
                                    >
                                        {t("Verify Business")}
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
                }}
            />
            <KYBModal
                isOpen={showKybModal}
                onClose={() => setShowKybModal(false)}
                onSubmit={() => {
                    setShowKybModal(false);
                    refetchKyb();
                }}
            />
        </div>
    );
}
