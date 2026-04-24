"use client";

import { motion } from "framer-motion";
import { useGetAgentMeQuery } from "@/store/api/agentApi";
import { 
    ProfileIcon, 
    VerifiedIcon, 
    PendingIcon, 
    DocumentIcon, 
    LeadsIcon,
    LoadingSpinner
} from "@/components/VectorImages";

const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
};

const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export default function AgentProfilePage() {
    const { data: agentData, isLoading } = useGetAgentMeQuery();

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
        email = "", 
        referralCode = "", 
        referralLink = "" 
    } = agentData || {};

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
                <p className="text-sm text-white/40 mt-1 font-montserrat">Manage your professional account and credentials</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1 space-y-8"
                >
                    <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FFCC]/5 blur-3xl -mr-16 -mt-16 group-hover:bg-[#00FFCC]/10 transition-all duration-700" />
                        
                        <div className="relative inline-block mb-6">
                            <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto overflow-hidden">
                                {profile?.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt={profile.fullName || "Agent"} className="w-full h-full object-cover" />
                                ) : (
                                    <ProfileIcon className="w-10 h-10 text-white/20" />
                                )}
                            </div>
                            {status?.isVerified && (
                                <div className="absolute -bottom-2 -right-2 bg-[#00FFCC] text-black p-1.5 rounded-lg shadow-lg">
                                    <VerifiedIcon className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        <h2 className="text-xl font-bold text-white mb-1 font-montserrat">{profile?.fullName || "Agent Name"}</h2>
                        <p className="text-xs text-white/40 font-montserrat mb-6 uppercase tracking-widest font-bold">Registered Agent</p>
                        
                        <div className="space-y-3 pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-white/30 font-montserrat">Email</span>
                                <span className="text-white/80 font-medium font-montserrat">{email}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-white/30 font-montserrat">Member Since</span>
                                <span className="text-white/80 font-medium font-montserrat">{formatDate(agentData?.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                
                    <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#00FFCC]/10 flex items-center justify-center text-[#00FFCC]">
                                <LeadsIcon className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-white font-montserrat">Referral Settings</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block mb-2">Referral Code</label>
                                <div className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                                    <span className="text-sm font-bold text-white font-mono">{referralCode || "N/A"}</span>
                                    <button onClick={() => referralCode && navigator.clipboard.writeText(referralCode)} className="text-[10px] font-bold text-[#00FFCC] uppercase cursor-pointer bg-transparent border-0">Copy</button>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block mb-2">Sign-up Link</label>
                                <div className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                                    <span className="text-xs text-white/40 truncate font-mono mr-4">{referralLink || "N/A"}</span>
                                    <button onClick={() => referralLink && navigator.clipboard.writeText(referralLink)} className="text-[10px] font-bold text-[#00FFCC] uppercase cursor-pointer bg-transparent border-0">Copy</button>
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
                    <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#00FFCC]/10 flex items-center justify-center text-[#00FFCC]">
                                    <DocumentIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white font-montserrat">Professional Credentials</h3>
                                    <p className="text-xs text-white/30 font-montserrat">Validated real estate licensing information</p>
                                </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                status?.isVerified ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                            }`}>
                                {status?.isVerified ? 'ACTIVE' : 'PENDING APPROVAL'}
                            </div>
                        </div>
                        
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest font-montserrat">RERA Registration</p>
                                <p className="text-base font-bold text-white font-montserrat">{profile?.reraNumber || "Not Provided"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest font-montserrat">License Expiry</p>
                                <p className={`text-base font-bold font-montserrat ${status?.isReraExpired ? 'text-red-500' : 'text-white'}`}>
                                    {formatDate(profile?.expiryDate)}
                                    {status?.isReraExpired && <span className="ml-2 text-[10px] text-red-500/60 uppercase">(Expired)</span>}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest font-montserrat">Commission Rate</p>
                                <p className="text-base font-bold text-[#00FFCC] font-montserrat">
                                    {profile?.commissionPercent || 1}% 
                                    {profile?.isEarlyAgent && <span className="ml-2 text-[10px] bg-[#00FFCC]/10 px-2 py-0.5 rounded text-[#00FFCC] font-bold">EARLY AGENT</span>}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest font-montserrat">Total Earnings</p>
                                <p className="text-base font-bold text-white font-montserrat">{formatCurrency(profile?.totalEarnings || 0)}</p>
                            </div>
                        </div>

                        {kyc?.status === "REJECTED" && (
                            <div className="m-8 mt-0 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-4 items-start">
                                <div className="text-red-500 mt-1">
                                    <PendingIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Action Required: KYC Rejected</p>
                                    <p className="text-[11px] text-red-500/70 leading-relaxed font-montserrat">{kyc.rejectedNote || "Your document submission was rejected. Please re-upload your identity proof."}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Documentation Status */}
                    <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-base font-bold text-white font-montserrat mb-8">Documentation Status</h3>
                        
                        <div className="space-y-4">
                            {[
                                { label: "Identity Proof", type: kyc?.documentType, status: kyc?.documentStatus, url: kyc?.documentUrl },
                                { label: "Address Proof", type: kyc?.addressProofType || "Utility Bill", status: kyc?.addressProofStatus, url: kyc?.addressProofUrl },
                                { label: "Selfie Verification", type: "Facial Match", status: kyc?.selfieStatus, url: kyc?.selfieUrl },
                                { label: "RERA Certificate", type: "Professional License", status: status?.isVerified ? "APPROVED" : "UNDER_REVIEW", url: profile?.reraDocumentUrl }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                                            <DocumentIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white font-montserrat">{item.label}</p>
                                            <p className="text-[10px] text-white/30 font-montserrat uppercase tracking-widest">{item.type?.replace('_', ' ') || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className={`text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                                            item.status === 'APPROVED' || item.status === 'VERIFIED' ? 'bg-green-500/10 text-green-500' :
                                            item.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                            {item.status?.replace('_', ' ') || "PENDING"}
                                        </div>
                                        <a 
                                            href={item.url?.startsWith('http') ? item.url : item.url ? `https://api.glofiestate.com/files/${item.url}` : "#"} 
                                            target={item.url ? "_blank" : undefined}
                                            rel="noopener noreferrer"
                                            className={`text-[10px] font-bold text-[#00FFCC] uppercase tracking-wider hover:opacity-70 transition-all no-underline ${!item.url ? 'opacity-20 pointer-events-none' : ''}`}
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
        </div>
    );
}
