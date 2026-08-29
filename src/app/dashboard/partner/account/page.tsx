"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/store/api/authApi";
import { useUploadFileMutation } from "@/store/api/fileApi";
import SupportTicketComposer from "@/components/dashboard/SupportTicketComposer";
import { Country } from "country-state-city";
import { Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/providers/LocaleProvider";

const TABS = ["Profile", "Support"];

const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function PartnerAccountPage() {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState("Profile");
    const { data: profileData, isLoading: profileLoading } = useGetProfileQuery();

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
                role: "PARTNER",
            }).unwrap();
            setStatusMsg({ type: "success", text: t("Profile updated successfully!") });
            setTimeout(() => setStatusMsg(null), 5000);
        } catch (err: any) {
            console.error("Failed to update profile:", err);
            setStatusMsg({
                type: "error",
                text: err?.data?.message || err?.message || t("Failed to update profile. Please try again.")
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const isLoading = profileLoading;

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
                            : "bg-[var(--card-surface)] text-[var(--color-text-muted)] border-[var(--sidebar-border)] hover:border-[var(--sidebar-active-text)]/30 hover:text-[var(--header-text)]"
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
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-300)]"></div>
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
                                            <span>{t("JPG, PNG — max 2 MB")}</span>
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


                    {activeTab === "Support" && (
                        <div className="max-w-[980px]">
                            <SupportTicketComposer
                                key={profileData?.email || "partner-support"}
                                title="Partner Support"
                                subtitle="Raise a request directly from your partner account."
                                description="Use this form for KYB issues, property publishing help, payment queries, or technical problems."
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
