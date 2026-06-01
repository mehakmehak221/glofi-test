"use client";

import { motion } from "framer-motion";
import { useGetAgentMeQuery, useGetAgentReferralLinkQuery, useGetAgentDashboardQuery } from "@/store/api/agentApi";
import {
    ProfileIcon,
    VerifiedIcon,
    PendingIcon,
    DocumentIcon,
    LeadsIcon,
    LoadingSpinner
} from "@/components/VectorImages";

import { useCurrency } from "@/providers/CurrencyProvider";
import { API_URL } from "@/constants";
import { useState } from "react";
import KYCModal from "@/components/dashboard/KYCModal";

const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getDocumentUrl = (url: string | null | undefined) => {
    if (!url) return "#";

    if (url.startsWith("http://") || url.startsWith("https://")) {
        if (url.includes("aws-glofi-uploads.s3")) {
            return url;
        }
        const match = url.match(/\/(kyc|rera|kyb)\/(.+)$/);
        if (match) {
            return `https://aws-glofi-uploads.s3.ap-south-1.amazonaws.com/${match[1]}/${match[2]}`;
        }
        return url;
    }

    const cleanPath = url.replace(/^\//, "");


    if (
        cleanPath.startsWith("kyc/") ||
        cleanPath.startsWith("rera/") ||
        cleanPath.startsWith("kyb/")
    ) {
        return `https://aws-glofi-uploads.s3.ap-south-1.amazonaws.com/${cleanPath}`;
    }

    return `${API_URL}/${cleanPath}`;
};

export default function AgentProfilePage() {
    const { data: agentData, isLoading: isAgentLoading, refetch: refetchAgentMe } = useGetAgentMeQuery();
    const { data: referralData, isLoading: isReferralLoading } = useGetAgentReferralLinkQuery();
    const { formatPrice } = useCurrency();
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [showKycModal, setShowKycModal] = useState(false);

    const triggerFeedback = (type: 'code' | 'link') => {
        if (type === 'code') {
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        } else {
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        }
    };

    const handleCopy = (text: string, type: 'code' | 'link') => {
        if (!text) return;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    triggerFeedback(type);
                })
                .catch((err) => {
                    console.error("Failed to copy with navigator.clipboard: ", err);
                    fallbackCopy(text, type);
                });
        } else {
            fallbackCopy(text, type);
        }
    };

    const fallbackCopy = (text: string, type: 'code' | 'link') => {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "absolute";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.select();
            textArea.setSelectionRange(0, 99999);
            const successful = document.execCommand("copy");
            document.body.removeChild(textArea);
            if (successful) {
                triggerFeedback(type);
            } else {
                console.error("Fallback execCommand copy was unsuccessful");
            }
        } catch (err) {
            console.error("Fallback copy failed: ", err);
        }
    };

    const isLoading = isAgentLoading;

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen flex items-center justify-center">
                <div className="text-[var(--foreground)] opacity-50 font-montserrat animate-pulse flex items-center gap-3">
                    <LoadingSpinner />
                    Loading profile...
                </div>
            </div>
        );
    }

    if (!agentData) return null;

    const {
        profile = {} as any,
        userStatus = {} as any,
        status = {} as any,
        kyc = {} as any,
        email = ""
    } = agentData || {};

    const referralCode = referralData?.referralCode || agentData?.referralCode || "";
    const referralLink = referralData?.referralLink || agentData?.referralLink || "";

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen space-y-8 pb-20">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-3xl font-bold text-[var(--foreground)] font-montserrat tracking-tight">
                    Agent Profile
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1 font-montserrat">Manage your professional account and credentials</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1 space-y-8"
                >
                    <div className="bg-[var(--card-surface)] border border-[var(--dashboard-border)] rounded-2xl p-8 text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FFCC]/5 blur-3xl -mr-16 -mt-16 group-hover:bg-[#00FFCC]/10 transition-all duration-700" />

                        <div className="relative inline-block mb-6">
                            <div className="w-24 h-24 rounded-2xl bg-[var(--field-surface)] border border-[var(--dashboard-border)] flex items-center justify-center mx-auto overflow-hidden">
                                {profile?.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt={profile.fullName || "Agent"} className="w-full h-full object-cover" />
                                ) : (
                                    <ProfileIcon className="w-10 h-10 text-[var(--color-text-muted)]" />
                                )}
                            </div>
                            {status?.isVerified && (
                                <div className="absolute -bottom-2 -right-2 bg-[#00FFCC] text-black p-1.5 rounded-lg shadow-lg">
                                    <VerifiedIcon className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        <h2 className="text-xl font-bold text-[var(--foreground)] mb-1 font-montserrat">{profile?.fullName || "Agent Name"}</h2>
                        <p className="text-xs text-[var(--color-text-muted)] font-montserrat mb-6 uppercase tracking-widest font-bold">Registered Agent</p>

                        <div className="space-y-3 pt-6 border-t border-[var(--dashboard-border)]">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-[var(--color-text-muted)] font-montserrat">Email</span>
                                <span className="text-[var(--foreground)] font-medium font-montserrat">{email}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-[var(--color-text-muted)] font-montserrat">Member Since</span>
                                <span className="text-[var(--foreground)] font-medium font-montserrat">{formatDate(agentData?.createdAt)}</span>
                            </div>
                        </div>
                    </div>


                    <div className="bg-[var(--card-surface)] border border-[var(--dashboard-border)] rounded-2xl p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#00FFCC]/10 flex items-center justify-center text-[#00FFCC]">
                                <LeadsIcon className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-[var(--foreground)] font-montserrat">Referral Settings</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-2">Referral Code</label>
                                <div className="bg-[var(--field-surface)] border border-[var(--dashboard-border)] rounded-xl px-4 py-3 flex items-center justify-between gap-4 hover:border-[#00FFCC]/30 transition-colors">
                                    <span className="text-sm font-bold text-[var(--foreground)] font-mono truncate">{referralCode || "N/A"}</span>
                                    <button
                                        onClick={() => handleCopy(referralCode, 'code')}
                                        className="text-[10px] font-bold uppercase cursor-pointer bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] hover:bg-[#00FFCC] hover:text-black px-3 py-1.5 rounded-lg border-0 transition-all flex-shrink-0 min-w-[70px] text-center shadow-sm"
                                    >
                                        {copiedCode ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-2">Sign-up Link</label>
                                <div className="bg-[var(--field-surface)] border border-[var(--dashboard-border)] rounded-xl px-4 py-3 flex items-center justify-between gap-4 hover:border-[#00FFCC]/30 transition-colors">
                                    <span className="text-sm font-bold text-[var(--foreground)] font-mono truncate">{referralLink || "N/A"}</span>
                                    <button
                                        onClick={() => handleCopy(referralLink, 'link')}
                                        className="text-[10px] font-bold uppercase cursor-pointer bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] hover:bg-[#00FFCC] hover:text-black px-3 py-1.5 rounded-lg border-0 transition-all flex-shrink-0 min-w-[70px] text-center shadow-sm"
                                    >
                                        {copiedLink ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-8"
                >
                    {/* Professional Credentials */}
                    <div className="bg-[var(--card-surface)] border border-[var(--dashboard-border)] rounded-2xl overflow-hidden">
                        <div className="p-8 border-b border-[var(--dashboard-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#00FFCC]/10 flex items-center justify-center text-[#00FFCC] flex-shrink-0">
                                    <DocumentIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-[var(--foreground)] font-montserrat">Professional Credentials</h3>
                                    <p className="text-xs text-[var(--color-text-muted)] font-montserrat">Validated real estate licensing information</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 self-start sm:self-center">
                                <div className={`inline-flex items-center justify-center text-center whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${(status?.isActive === false || userStatus?.isActive === false)
                                    ? 'bg-[var(--color-status-error-bg)] border-[var(--color-status-error-border)] text-[var(--color-status-error)]'
                                    : status?.isVerified
                                        ? 'bg-[var(--color-status-success-bg)] border-[var(--color-status-success-border)] text-[var(--color-status-success)]'
                                        : 'bg-[var(--color-status-warning-bg)] border-[var(--color-status-warning-border)] text-[var(--color-status-warning)]'
                                    }`}>
                                    {(status?.isActive === false || userStatus?.isActive === false) ? 'INACTIVE' : status?.isVerified ? 'ACTIVE' : 'PENDING APPROVAL'}
                                </div>
                                {!status?.isVerified && (
                                    <button
                                        onClick={() => setShowKycModal(true)}
                                        className="px-4 py-1.5 rounded-full bg-[#00FFCC] hover:bg-[#00FFCC]/90 text-black text-[10px] font-bold uppercase transition-all whitespace-nowrap border-0 cursor-pointer shadow-sm ml-2 font-montserrat"
                                    >
                                        Update Details
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest font-montserrat">RERA Registration</p>
                                <p className="text-base font-bold text-[var(--foreground)] font-montserrat">{profile?.reraNumber || "Not Provided"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest font-montserrat">License Expiry</p>
                                <p className={`text-base font-bold font-montserrat ${status?.isReraExpired ? 'text-[var(--color-status-error)]' : 'text-[var(--foreground)]'}`}>
                                    {formatDate(profile?.expiryDate)}
                                    {status?.isReraExpired && <span className="ml-2 text-[10px] text-[var(--color-status-error)]/60 uppercase">(Expired)</span>}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest font-montserrat">Commission Rate</p>
                                <p className="text-base font-bold text-[#00FFCC] font-montserrat">
                                    {profile?.commissionPercent || 1}%
                                    {profile?.isEarlyAgent && <span className="ml-2 text-[10px] bg-[#00FFCC]/10 px-2 py-0.5 rounded text-[#00FFCC] font-bold">EARLY AGENT</span>}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest font-montserrat">Total Earnings</p>
                                <p className="text-base font-bold text-[var(--foreground)] font-montserrat">{formatPrice(profile?.totalEarnings || 0)}</p>
                            </div>
                        </div>

                        {kyc?.status === "REJECTED" && (
                            <div className="m-8 mt-0 p-4 rounded-xl bg-[var(--color-status-error-bg)] border border-[var(--color-status-error-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex gap-4 items-start">
                                    <div className="text-[var(--color-status-error)] mt-1 flex-shrink-0">
                                        <PendingIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[var(--color-status-error)] uppercase tracking-wider mb-1">Action Required: KYC Rejected</p>
                                        <p className="text-[11px] text-[var(--color-status-error)]/70 leading-relaxed font-montserrat">
                                            <span className="font-semibold block mb-0.5 text-[var(--color-status-error)]">Reason for Rejection:</span>
                                            {kyc.rejectedNote && kyc.rejectedNote.toLowerCase() !== "na" ? kyc.rejectedNote : "Your document submission was rejected. Please re-upload your identity proof."}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowKycModal(true)}
                                    className="px-4 py-2 rounded-lg bg-[var(--color-status-error)] hover:bg-[var(--color-status-error)]/90 text-white text-[10px] font-bold uppercase transition-all whitespace-nowrap border-0 cursor-pointer shadow-sm self-stretch sm:self-auto text-center"
                                >
                                    Resubmit KYC
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Documentation Status */}
                    <div className="bg-[var(--card-surface)] border border-[var(--dashboard-border)] rounded-2xl p-8">
                        <h3 className="text-base font-bold text-[var(--foreground)] font-montserrat mb-8">Documentation Status</h3>

                        <div className="space-y-4">
                            {[
                                { label: "Identity Proof", type: kyc?.documentType, status: kyc?.documentStatus, url: kyc?.documentUrl },
                                { label: "Address Proof", type: kyc?.addressProofType || "Utility Bill", status: kyc?.addressProofStatus, url: kyc?.addressProofUrl },
                                { label: "Selfie Verification", type: "Facial Match", status: kyc?.selfieStatus, url: kyc?.selfieUrl },
                                { label: "RERA Certificate", type: "Professional License", status: status?.isVerified ? "APPROVED" : "UNDER_REVIEW", url: profile?.reraDocumentUrl }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-[var(--field-surface)] border border-[var(--dashboard-border)] hover:bg-[var(--badge-bg)] gap-4 transition-all hover:border-[#00FFCC]/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--badge-bg)] flex items-center justify-center text-[var(--color-text-muted)] flex-shrink-0">
                                            <DocumentIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[var(--foreground)] font-montserrat m-0 mb-0.5 leading-snug">{item.label}</p>
                                            <p className="text-[10px] text-[var(--color-text-muted)] font-montserrat uppercase tracking-widest m-0 leading-none">{item.type?.replace('_', ' ') || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0">
                                        <div className={`inline-flex items-center justify-center text-center text-[9px] font-bold px-2.5 py-1.5 rounded-md uppercase tracking-wider whitespace-nowrap w-[110px] ${item.status === 'APPROVED' || item.status === 'VERIFIED' || item.status === 'ACTIVE'
                                            ? 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success)]' :
                                            item.status === 'REJECTED'
                                                ? 'bg-[var(--color-status-error-bg)] text-[var(--color-status-error)]' :
                                                'bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)]'
                                            }`}>
                                            {item.status?.replace('_', ' ') || "PENDING"}
                                        </div>
                                        <a
                                            href={getDocumentUrl(item.url)}
                                            target={item.url ? "_blank" : undefined}
                                            rel="noopener noreferrer"
                                            className={`text-[10px] font-bold text-[#00FFCC] uppercase tracking-wider hover:text-black hover:bg-[#00FFCC] transition-all no-underline px-4 py-1.5 rounded-lg bg-[#00FFCC]/5 border border-[#00FFCC]/20 text-center min-w-[70px] ${!item.url ? 'opacity-20 pointer-events-none' : ''}`}
                                        >
                                            View
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            <KYCModal
                isOpen={showKycModal}
                onClose={() => setShowKycModal(false)}
                onSubmit={() => {
                    setShowKycModal(false);
                    refetchAgentMe();
                }}
            />
        </div>
    );
}
