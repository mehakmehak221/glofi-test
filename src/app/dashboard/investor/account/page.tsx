"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/store/api/authApi";
import { useGetMyCertificatesQuery } from "@/store/api/certificatesApi";
import { useGetKycStatusQuery } from "@/store/api/kycApi";
import { useUploadFileMutation } from "@/store/api/fileApi";
import SupportTicketComposer from "@/components/dashboard/SupportTicketComposer";
import { useI18n } from "@/providers/LocaleProvider";
import { API_URL } from "@/constants";
import { Country } from "country-state-city";
import { Camera, AlertCircle, CheckCircle2 } from "lucide-react";

const TABS = ["Profile", "Wallet", "KYC", "Certificates", "Referrals", "Support"];

const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function AccountPage() {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState("Profile");
    const [copied, setCopied] = useState(false);

    const { data: profileData, isLoading: profileLoading } = useGetProfileQuery();
    const { data: certsResponse, isLoading: certsLoading } = useGetMyCertificatesQuery();
    const { data: kycData, isLoading: kycLoading } = useGetKycStatusQuery();

    const [updateProfile] = useUpdateProfileMutation();
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

    const [fullName, setFullName] = useState("");
    const [country, setCountry] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const avatarKeyRef = useRef("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (profileData) {
            const profile = profileData.partnerProfile || profileData.investorProfile || {};
            setFullName(profileData.fullName || profile.fullName || profileData.name || "");
            setCountry(profileData.country || profile.country || profile.nationality || profileData.nationality || "");
            const dbAvatar = profileData.avatarUrl || profile.avatarUrl || "";
            setAvatarUrl(dbAvatar);
            avatarKeyRef.current = dbAvatar;
        }
    }, [profileData]);

    const handleSaveChanges = async () => {
        setIsUpdating(true);
        setStatusMsg(null);
        try {
            await updateProfile({
                fullName,
                country,
                avatarUrl: avatarKeyRef.current,
                role: "INVESTOR",
            }).unwrap();
            setStatusMsg({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => setStatusMsg(null), 5000);
        } catch (err: any) {
            console.error("Failed to update profile:", err);
            setStatusMsg({
                type: "error",
                text: err?.data?.message || err?.message || "Failed to update profile. Please try again."
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const isLoading = profileLoading || (activeTab === "Certificates" && certsLoading) || (activeTab === "KYC" && kycLoading);
    const certificates = certsResponse?.data || [];

    const handleCopy = () => {
        const refLink = profileData?.referralCode ? `Glofi.com/ref/${profileData.referralCode}` : "";
        if (!refLink) return;
        navigator.clipboard.writeText(refLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-3 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)]">

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--header-text)] mb-4 sm:mb-6"
            >
                {t("Account")}
            </motion.h1>


            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-2 sm:gap-2.5 mb-5 sm:mb-8"
            >
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-md text-[11px] sm:text-[13px] font-medium transition-all duration-300 cursor-pointer border ${activeTab === tab
                            ? "bg-[var(--color-primary-300)] text-black border-[var(--color-primary-300)] shadow-glow-primary"
                            : "bg-[var(--background)] text-[var(--color-text-muted)] border-[var(--sidebar-border)] hover:border-[var(--sidebar-active-text)]/30 hover:text-[var(--header-text)]"
                            }`}
                    >
                        {t(tab)}
                    </button>
                ))}
            </motion.div>


            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {activeTab === "Profile" && (
                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-md p-4 sm:p-6 lg:p-8 max-w-[800px] shadow-sm">
                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-md h-8 w-8 border-b-2 border-[var(--color-primary-300)]"></div>
                                </div>
                            ) : (
                                <>
                                    {/* Profile Picture Section */}
                                    <div className="flex flex-col items-center mb-8">
                                        <div className="relative w-28 h-28 mb-3">
                                            <div className="w-full h-full rounded-full bg-[var(--field-surface)] border border-[var(--sidebar-border)] flex items-center justify-center overflow-hidden">
                                                {avatarUrl ? (
                                                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div
                                                        className="w-full h-full flex items-center justify-center font-bold text-2xl text-black"
                                                        style={{ background: "var(--color-gradient-Glofi)" }}
                                                    >
                                                        {fullName.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "?"}
                                                    </div>
                                                )}
                                            </div>
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-primary-300)]"></div>
                                                </div>
                                            )}
                                            <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#00DAAF] text-black flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-all">
                                                <Camera className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            try {
                                                                const response = await uploadFile({ file, folder: "avatars" }).unwrap();
                                                                if (response?.signedUrl) {
                                                                    setAvatarUrl(response.signedUrl);
                                                                    avatarKeyRef.current = response.key;
                                                                } else {
                                                                    const url = response.url || (response.key ? `https://aws-glofi-uploads.s3.ap-south-1.amazonaws.com/${response.key}` : "");
                                                                    if (url) {
                                                                        setAvatarUrl(url);
                                                                        avatarKeyRef.current = response.key || url;
                                                                    }
                                                                }
                                                            } catch (err: any) {
                                                                console.error("Photo upload failed:", err);
                                                                const msg = err?.data?.message || err?.message || "Upload failed. Please ensure the file is under 2MB and in JPG/PNG format.";
                                                                setStatusMsg({ type: "error", text: msg });
                                                            }
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] opacity-60">
                                            <AlertCircle className="w-3.5 h-3.5 text-[#00DAAF]" />
                                            <span>JPG, PNG — max 2 MB</span>
                                        </div>
                                    </div>

                                    {statusMsg && (
                                        <div className={`mb-6 p-4 rounded-md flex items-center gap-2 text-xs border ${statusMsg.type === "success"
                                            ? "bg-[var(--color-primary-300)]/10 border-[var(--color-primary-300)]/20 text-[var(--color-primary-300)]"
                                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                            }`}>
                                            {statusMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                            <span>{statusMsg.text}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6 mb-6 sm:mb-8">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] sm:text-[10px] uppercase tracking-[1.5px] text-[var(--color-text-muted)] font-semibold">
                                                {t("Full Name")}
                                            </label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full rounded-md px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-[var(--header-text)] bg-[var(--field-surface)] border border-[var(--sidebar-border)] transition-all hover:border-[var(--sidebar-active-text)]/30 focus:outline-none focus:border-[var(--sidebar-active-text)]/50"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] sm:text-[10px] uppercase tracking-[1.5px] text-[var(--color-text-muted)] font-semibold">
                                                {t("Email Address")}
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData?.email || ""}
                                                disabled
                                                className="w-full rounded-md px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-[var(--color-text-muted)]/60 bg-[var(--field-surface)] border border-[var(--sidebar-border)]/50 cursor-not-allowed opacity-70"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] sm:text-[10px] uppercase tracking-[1.5px] text-[var(--color-text-muted)] font-semibold">
                                                {t("Country")}
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                    className="w-full rounded-md px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-[var(--header-text)] bg-[var(--field-surface)] border border-[var(--sidebar-border)] transition-all hover:border-[var(--sidebar-active-text)]/30 focus:outline-none focus:border-[var(--sidebar-active-text)]/50 appearance-none cursor-pointer"
                                                >
                                                    <option value="">{t("Select Country")}</option>
                                                    {Country.getAllCountries().map((c) => (
                                                        <option key={c.isoCode} value={c.name}>
                                                            {c.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-text-muted)]">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSaveChanges}
                                        disabled={isUpdating}
                                        className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-md bg-[#00DAAF] text-black font-bold text-[11px] sm:text-[13px] tracking-wide cursor-pointer border-0 shadow-glow-primary transition-all disabled:opacity-50"
                                    >
                                        {isUpdating ? t("Saving...") : t("Save Changes")}
                                    </motion.button>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === "KYC" && (
                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-md p-4 sm:p-6 lg:p-8 max-w-[800px] shadow-sm">
                            {kycLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-md h-8 w-8 border-b-2 border-[var(--color-primary-300)]"></div>
                                </div>
                            ) : kycData?.status === "VERIFIED" || kycData?.status === "APPROVED" ? (
                                <>
                                    <div className="flex items-center gap-3 sm:gap-5 mb-5 sm:mb-8">
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-md bg-[var(--color-primary-300)]/10 flex items-center justify-center flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-7 sm:h-7 text-[var(--color-primary-300)]">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-base sm:text-xl font-bold text-[var(--header-text)] mb-0.5 sm:mb-1.5">{t("Verified")}</h2>
                                            <p className="text-[11px] sm:text-[13px] text-[var(--color-text-muted)] font-medium">{t("Identity verified successfully")}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-md p-3.5 sm:p-5 flex items-start gap-2.5 sm:gap-3.5 hover:border-[var(--sidebar-active-text)]/20 transition-colors">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary-300)] mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                            <div>
                                                <p className="text-[11px] sm:text-[13px] font-semibold text-[var(--header-text)] mb-0.5 sm:mb-1">{t("Document Upload")}</p>
                                                <p className="text-[10px] sm:text-[11px] text-[var(--color-text-muted)] font-medium">{t("Passport verified")}</p>
                                            </div>
                                        </div>
                                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-md p-3.5 sm:p-5 flex items-start gap-2.5 sm:gap-3.5 hover:border-[var(--sidebar-active-text)]/20 transition-colors">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary-300)] mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                            <div>
                                                <p className="text-[11px] sm:text-[13px] font-semibold text-[var(--header-text)] mb-0.5 sm:mb-1">{t("Selfie Check")}</p>
                                                <p className="text-[10px] sm:text-[11px] text-[var(--color-text-muted)] font-medium">{t("Liveness passed")}</p>
                                            </div>
                                        </div>
                                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-md p-3.5 sm:p-5 flex items-start gap-2.5 sm:gap-3.5 hover:border-[var(--color-primary-300)]/20 transition-colors">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary-300)] mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                            <div>
                                                <p className="text-[11px] sm:text-[13px] font-semibold text-[var(--header-text)] mb-0.5 sm:mb-1">{t("Address Proof")}</p>
                                                <p className="text-[10px] sm:text-[11px] text-[var(--color-text-muted)] font-medium">{t("Utility bill verified")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : kycData?.status === "UNDER_REVIEW" ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-[var(--color-status-warning-bg)] flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-status-warning)]">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-[var(--header-text)] mb-2">{t("Verification Under Review")}</h2>
                                    <p className="text-sm text-[var(--color-text-muted)] max-w-md">{t("Your identity verification is currently being processed. You will be notified once it is approved.")}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-[var(--color-status-error-bg)] flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-status-error)]">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-[var(--header-text)] mb-2">{t("Unverified")}</h2>
                                    <p className="text-sm text-[var(--color-text-muted)] max-w-md mb-6">{t("You need to complete your identity verification before you can start investing.")}</p>
                                    <button
                                        onClick={() => window.dispatchEvent(new CustomEvent('open-kyc-modal'))}
                                        className="px-6 py-2.5 rounded-lg bg-[var(--color-status-error)] text-white text-sm font-bold uppercase transition-all hover:opacity-90 border-0 cursor-pointer shadow-sm"
                                    >
                                        {t("Verify Now")}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Wallet" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 xl:max-w-[70rem]">
                            <div className="rounded-md p-4 sm:p-7 relative overflow-hidden bg-gradient-to-b from-[var(--background)] to-[var(--color-primary-500)] shadow-glow-primary">
                                <div className="absolute right-0 top-0 w-40 h-40 bg-[var(--background)]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <p className="text-[11px] sm:text-[14px] uppercase tracking-[1.5px] font-normal text-[var(--color-text-muted)] mb-1.5 sm:mb-2.5">INR BALANCE</p>
                                <p className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[var(--header-text)] mb-5 sm:mb-8">₹{profileData?.usdBalance || "0.00"}</p>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-[var(--card-surface)] text-[var(--header-text)] text-[10px] sm:text-[11px] font-normal tracking-wide rounded-full transition-colors cursor-pointer border border-[var(--sidebar-border)]">Deposit</button>
                                    <button className="px-3 py-1 bg-[var(--card-surface)] text-[var(--header-text)] text-[10px] sm:text-[11px] font-normal tracking-wide rounded-full border border-[var(--sidebar-border)] transition-colors cursor-pointer">Withdraw</button>
                                </div>
                            </div>

                            <div className="rounded-md p-4 sm:p-7 relative overflow-hidden bg-gradient-to-b from-[var(--background)] to-[var(--color-primary-700)] shadow-glow-primary">
                                <div className="absolute right-0 top-0 w-40 h-40 bg-[var(--background)]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <p className="text-[11px] sm:text-[14px] uppercase tracking-[1.5px] font-normal text-[var(--color-text-muted)] mb-1.5 sm:mb-2.5">AED BALANCE</p>
                                <p className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[var(--header-text)] mb-5 sm:mb-8">AED {profileData?.aedBalance || "0.00"}</p>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-[var(--card-surface)] text-[var(--header-text)] text-[10px] sm:text-[11px] font-normal tracking-wide rounded-full transition-colors cursor-pointer border border-[var(--sidebar-border)]">Deposit</button>
                                    <button className="px-3 py-1 bg-[var(--card-surface)] text-[var(--header-text)] text-[10px] sm:text-[11px] font-normal tracking-wide rounded-full border border-[var(--sidebar-border)] transition-colors cursor-pointer">Withdraw</button>
                                </div>
                            </div>

                            <div className="rounded-md p-4 sm:p-7 relative overflow-hidden bg-gradient-to-b from-[var(--background)] to-[var(--color-primary-300)] shadow-glow-primary">
                                <div className="absolute right-0 top-0 w-40 h-40 bg-[var(--background)]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <p className="text-[11px] sm:text-[14px] uppercase tracking-[1.5px] font-normal text-[var(--color-text-muted)] mb-1.5 sm:mb-2.5">CRYPTO</p>
                                <p className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[var(--header-text)] mb-5 sm:mb-8">{profileData?.cryptoBalance || "0.00"} ETH</p>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-[var(--color-bg-surface-subtle)] text-white text-[10px] sm:text-[11px] font-normal tracking-wide rounded-full transition-colors cursor-pointer border border-[var(--color-border-subtle)]">Deposit</button>
                                    <button className="px-3 py-1 bg-[var(--color-bg-surface-subtle)] text-white text-[10px] sm:text-[11px] font-normal tracking-wide rounded-full border border-[var(--color-border-subtle)] transition-colors cursor-pointer">Withdraw</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Certificates" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 xl:max-w-6xl">
                            {certsLoading ? (
                                <div className="col-span-1 md:col-span-2 flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-300)]"></div>
                                </div>
                            ) : certificates.length > 0 ? (
                                certificates.map((cert) => (
                                    <div key={cert.id} className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-[20px] p-3.5 sm:p-5 lg:p-6 hover:border-[var(--sidebar-active-text)]/20 transition-colors shadow-sm">
                                        <div className="flex justify-between items-center mb-3 sm:mb-5">
                                            <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] text-[var(--color-primary-300)] font-semibold tracking-wider uppercase">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3 sm:h-3 text-[var(--color-primary-300)]">
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                                </svg>
                                                {t("Blockchain Verified")}
                                            </div>
                                            <span className="text-[7px] sm:text-[9px] text-[var(--color-text-muted)] font-mono tracking-wider">{cert.certificateNo || cert.id}</span>
                                        </div>

                                        <div className="border border-[var(--sidebar-border)] rounded-md sm:rounded-2xl p-4 sm:p-6 mb-3 sm:mb-5 bg-[var(--field-surface)]">
                                            <div className="text-center">
                                                <p className="text-[8px] sm:text-[9px] text-[var(--color-text-muted)] uppercase tracking-[1.5px] sm:tracking-[2px] mb-1.5 sm:mb-2 font-semibold">{t("DIGITAL OWNERSHIP CERTIFICATE")}</p>
                                                <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-[var(--header-text)] mb-2 sm:mb-3">{cert.assetTitle || cert.asset?.title || cert.asset?.name || t("Property")}</h3>
                                                <p className="font-bold text-[var(--header-text)] flex items-center justify-center gap-1.5 sm:gap-2"><span className="text-2xl sm:text-3xl">{cert.fractionsOwned || cert.fractions || cert.investment?.fractions || 1}</span> <span className="text-[11px] sm:text-[13px] font-normal text-[var(--color-text-muted)]">{t("Fractions")}</span></p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                            {cert.network && (
                                                <div className="flex justify-between items-center text-[11px] sm:text-[13px]">
                                                    <span className="text-[var(--color-text-muted)]">{t("Network")}</span>
                                                    <span className="text-[var(--color-primary-300)] font-bold tracking-wide">{cert.network}</span>
                                                </div>
                                            )}
                                            {cert.issuedAt && (
                                                <div className="flex justify-between items-center text-[11px] sm:text-[13px]">
                                                    <span className="text-[var(--color-text-muted)]">{t("Issued At")}</span>
                                                    <span className="text-[var(--header-text)] font-mono">
                                                        {new Date(cert.issuedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>                                        <div className="flex items-center gap-2 sm:gap-3 w-full">
                                            <button
                                                onClick={() => cert.pdfUrl && window.open(cert.pdfUrl.startsWith('http') ? cert.pdfUrl : `${API_URL}/${cert.pdfUrl.replace(/^\//, '')}`, '_blank')}
                                                disabled={!cert.pdfUrl}
                                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-[var(--color-primary-300)]/10 hover:bg-[var(--color-primary-300)]/15 text-[var(--color-primary-300)] text-[9px] sm:text-[11px] font-bold tracking-widest uppercase rounded-full flex justify-center items-center gap-1.5 sm:gap-2 border-0 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                                                    <polyline points="7 11 12 16 17 11" />
                                                    <line x1="12" y1="4" x2="12" y2="16" />
                                                </svg>
                                                {t("Download Docs")}
                                            </button>
                                            <button
                                                onClick={() => cert.pdfUrl && window.open(cert.pdfUrl.startsWith('http') ? cert.pdfUrl : `${API_URL}/${cert.pdfUrl.replace(/^\//, '')}`, '_blank')}
                                                disabled={!cert.pdfUrl}
                                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-transparent hover:bg-[var(--sidebar-active-bg)] text-[var(--color-text-muted)] hover:text-[var(--header-text)] text-[9px] sm:text-[11px] font-bold tracking-widest uppercase rounded-full flex justify-center items-center gap-1.5 sm:gap-2 border border-[var(--sidebar-border)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                {t("View Docs")}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-1 md:col-span-2 bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                                    <svg className="w-12 h-12 text-[var(--color-text-muted)]/20 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                    <h3 className="text-lg font-bold text-[var(--header-text)] mb-1">{t("No certificates found")}</h3>
                                    <p className="text-sm text-[var(--color-text-muted)]">{t("Your digital ownership certificates will appear here once issued.")}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Referrals" && (
                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-10 max-w-[900px] shadow-sm">
                            <h2 className="text-base sm:text-[22px] font-bold text-[var(--header-text)] mb-1">{t("Invite & Earn")}</h2>
                            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mb-5 sm:mb-8 font-medium">{t("Earn ₹250 for every referred investor")}</p>

                            <div className="flex items-center bg-[var(--field-surface)] border border-[var(--sidebar-border)] rounded-full p-1 sm:p-1.5 mb-6 sm:mb-10 w-full max-w-[800px]">
                                <input
                                    readOnly
                                    value={profileData?.referralCode ? `Glofi.com/ref/${profileData.referralCode}` : t("Not available")}
                                    className="flex-1 min-w-0 bg-transparent border-0 text-[var(--color-text-muted)] text-[11px] sm:text-sm px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 focus:outline-none placeholder-[var(--color-text-muted)]/20 font-mono tracking-wide"
                                />
                                <button
                                    onClick={handleCopy}
                                    className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 rounded-md text-[10px] sm:text-xs font-bold tracking-wide hover:scale-105 transition-all flex items-center gap-1.5 sm:gap-2 shadow-glow-primary cursor-pointer border-0 ${copied ? 'bg-[var(--color-primary-700)] text-white' : 'bg-[var(--color-primary-300)] text-black'}`}
                                >
                                    {copied ? (
                                        <>
                                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            {t("Copied")}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                            {t("Copy")}
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">

                                <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl sm:rounded-[16px] p-4 sm:p-6 relative overflow-hidden group hover:border-[var(--sidebar-active-text)]/20 transition-colors cursor-default shadow-sm">
                                    <div className="absolute right-4 sm:right-5 top-4 sm:top-5 text-[var(--sidebar-active-text)] w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-[var(--sidebar-active-text)]/10 rounded-full group-hover:scale-110 transition-transform">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    </div>
                                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-2 sm:mb-4 tracking-[1.5px]">{t("REFERRALS")}</p>
                                    <p className="text-2xl sm:text-[32px] font-black text-[var(--header-text)]">{profileData?.referralsCount || 0}</p>
                                </div>

                                <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl sm:rounded-[16px] p-4 sm:p-6 relative overflow-hidden group hover:border-[var(--sidebar-active-text)]/20 transition-colors cursor-default shadow-sm">
                                    <div className="absolute right-4 sm:right-5 top-4 sm:top-5 text-[var(--sidebar-active-text)] w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-[var(--sidebar-active-text)]/10 rounded-full group-hover:scale-110 transition-transform">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-2 sm:mb-4 tracking-[1.5px]">{t("CONVERTED")}</p>
                                    <p className="text-2xl sm:text-[32px] font-black text-[var(--header-text)]">{profileData?.convertedCount || 0}</p>
                                </div>

                                <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl sm:rounded-[16px] p-4 sm:p-6 relative overflow-hidden group hover:border-[var(--sidebar-active-text)]/20 transition-colors cursor-default shadow-sm">
                                    <div className="absolute right-4 sm:right-5 top-4 sm:top-5 text-[var(--sidebar-active-text)] w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-[var(--sidebar-active-text)]/10 rounded-full group-hover:scale-110 transition-transform">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
                                    </div>
                                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-2 sm:mb-4 tracking-[1.5px]">{t("EARNED")}</p>
                                    <p className="text-2xl sm:text-[32px] font-black text-[var(--header-text)]">{profileData?.referralEarnings || 0}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Support" && (
                        <div className="max-w-[980px]">
                            <SupportTicketComposer
                                key={profileData?.email || "investor-support"}
                                title="Need Help?"
                                subtitle="Raise a support request from your investor account."
                                description="Use this form for account issues, investment help, payment questions, or technical problems."
                                defaultEmail={profileData?.email || ""}
                                compact
                            />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
