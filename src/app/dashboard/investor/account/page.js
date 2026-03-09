"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = ["Profile", "KYC", "Wallet", "Certificates", "Referrals"];

const PROFILE_FIELDS = [
    { label: "Full Name", value: "Ishan", type: "text" },
    { label: "Email", value: "demo@glofi.estate", type: "email" },
    { label: "Phone", value: "+971 50 123 4567", type: "tel" },
    { label: "Country", value: "United Arab Emirates", type: "text" },
];

const tabContentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState("Profile");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("glofi.estate/ref/DEMO-2026");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-3 sm:p-6 lg:p-8 bg-[#0A0F0D] min-h-screen">

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6"
            >
                Account
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
                        className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-[13px] font-medium transition-all duration-300 cursor-pointer border ${activeTab === tab
                            ? "bg-[#00FFCD] text-[#0A0F0D] border-[#00FFCD] shadow-[0_0_20px_rgba(0,255,205,0.2)]"
                            : "bg-[#FFFFFF05] text-[#767676] border-white/[0.04] hover:border-white/20 hover:text-white"
                            }`}
                    >
                        {tab}
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
                        <div className="bg-[#0D1411] border border-white/[0.04] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-[800px]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6 mb-6 sm:mb-8">
                                {PROFILE_FIELDS.map((field) => (
                                    <div key={field.label} className="flex flex-col gap-1.5">
                                        <label className="text-[9px] sm:text-[10px] uppercase tracking-[1.5px] text-[#767676] font-semibold">
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            defaultValue={field.value}
                                            className="w-full rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-white bg-[#FFFFFF08] border border-white/[0.06] transition-all hover:border-white/10 focus:outline-none focus:border-[#00FFCD]/50"
                                        />
                                    </div>
                                ))}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#00FFCD] text-black font-semibold text-[11px] sm:text-[13px] tracking-wide cursor-pointer border-0 shadow-[0_0_15px_rgba(0,255,205,0.2)]"
                            >
                                Save Changes
                            </motion.button>
                        </div>
                    )}

                    {activeTab === "KYC" && (
                        <div className="bg-[#0D1411] border border-white/[0.04] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-[800px]">
                            <div className="flex items-center gap-3 sm:gap-5 mb-5 sm:mb-8">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#00DAAF1A] flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00DAAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-7 sm:h-7">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-xl font-bold text-white mb-0.5 sm:mb-1.5">Verified</h2>
                                    <p className="text-[11px] sm:text-[13px] text-[#767676] font-medium">Identity verified successfully</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                                <div className="bg-[#FFFFFF08] border border-white/[0.06] rounded-lg sm:rounded-xl p-3.5 sm:p-5 flex items-start gap-2.5 sm:gap-3.5 hover:border-[#00DAAF]/20 transition-colors">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#00DAAF] mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    <div>
                                        <p className="text-[11px] sm:text-[13px] font-semibold text-white mb-0.5 sm:mb-1">Document Upload</p>
                                        <p className="text-[10px] sm:text-[11px] text-[#767676] font-medium">Passport verified</p>
                                    </div>
                                </div>
                                <div className="bg-[#FFFFFF08] border border-white/[0.06] rounded-lg sm:rounded-xl p-3.5 sm:p-5 flex items-start gap-2.5 sm:gap-3.5 hover:border-[#00DAAF]/20 transition-colors">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#00DAAF] mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    <div>
                                        <p className="text-[11px] sm:text-[13px] font-semibold text-white mb-0.5 sm:mb-1">Selfie Check</p>
                                        <p className="text-[10px] sm:text-[11px] text-[#767676] font-medium">Liveness passed</p>
                                    </div>
                                </div>
                                <div className="bg-[#FFFFFF08] border border-white/[0.06] rounded-lg sm:rounded-xl p-3.5 sm:p-5 flex items-start gap-2.5 sm:gap-3.5 hover:border-[#00DAAF]/20 transition-colors">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#00DAAF] mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    <div>
                                        <p className="text-[11px] sm:text-[13px] font-semibold text-white mb-0.5 sm:mb-1">Address Proof</p>
                                        <p className="text-[10px] sm:text-[11px] text-[#767676] font-medium">Utility bill verified</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Wallet" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 xl:max-w-[70rem]">

                            <div className="rounded-[16px] sm:rounded-[24px] p-4 sm:p-7 relative overflow-hidden shadow-[0_4px_30px_rgba(0,218,175,0.15)]" style={{ background: 'linear-gradient(180deg, #007E5F 0%, #00DAAF 100%)' }}>
                                <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <p className="text-[11px] sm:text-[14px] uppercase tracking-[1.5px] font-normal text-white/60 mb-1.5 sm:mb-2.5">USD BALANCE</p>
                                <p className="text-[22px] sm:text-[28px] lg:text-[32px] font-black text-[#0A0F0D] mb-5 sm:mb-8">$24,500</p>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-[#6C6C6C6E] text-white text-[10px] sm:text-[11px] font-normal tracking-wide rounded-full transition-colors cursor-pointer border border-white/5">Deposit</button>
                                    <button className="px-3 py-1 bg-[#6C6C6C6E] text-white text-[10px] sm:text-[11px] font-normal tracking-wide rounded-full border border-white/10 transition-colors cursor-pointer">Withdraw</button>
                                </div>
                            </div>

                            <div className="rounded-[16px] sm:rounded-[24px] p-4 sm:p-7 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #001812 0%, #007E5F 100%)' }}>
                                <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <p className="text-[11px] sm:text-[14px] uppercase tracking-[1.5px] font-normal text-white/60 mb-1.5 sm:mb-2.5">AED BALANCE</p>
                                <p className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-white mb-5 sm:mb-8">AED 89,975</p>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-[#6C6C6C6E] text-white text-[10px] sm:text-[11px] font-normal tracking-wide rounded-full transition-colors cursor-pointer border border-white/5">Deposit</button>
                                    <button className="px-3 py-1 bg-[#6C6C6C6E] text-white text-[10px] sm:text-[11px] font-normal tracking-wide rounded-full border border-white/10 transition-colors cursor-pointer">Withdraw</button>
                                </div>
                            </div>

                            <div className="rounded-[16px] sm:rounded-[24px] p-4 sm:p-7 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D1411 0%, #00DAAF 100%)' }}>
                                <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <p className="text-[11px] sm:text-[14px] uppercase tracking-[1.5px] font-normal text-white/60 mb-1.5 sm:mb-2.5">CRYPTO</p>
                                <p className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-white mb-5 sm:mb-8">0.85 ETH</p>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-[#6C6C6C6E] text-white text-[10px] sm:text-[11px] font-normal tracking-wide rounded-full transition-colors cursor-pointer border border-white/5">Deposit</button>
                                    <button className="px-3 py-1 bg-[#6C6C6C6E] text-white text-[10px] sm:text-[11px] font-normal tracking-wide rounded-full border border-white/10 transition-colors cursor-pointer">Withdraw</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Certificates" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 xl:max-w-6xl">

                            {[
                                { name: "Burj Vista Tower", fractions: 25, certId: "CERT-BVT-001-2025" },
                                { name: "Palm Jumeirah Villa Estate", fractions: 10, certId: "CERT-PJV-002-2025" },
                                { name: "Marina Walk Residences", fractions: 15, certId: "CERT-MWR-006-2025" }
                            ].map((cert, i) => (
                                <div key={i} className="bg-[#0D1411] border border-[#00DAAF]/10 rounded-xl sm:rounded-[20px] p-3.5 sm:p-5 lg:p-6 hover:border-[#00FFCD]/20 transition-colors">
                                    <div className="flex justify-between items-center mb-3 sm:mb-5">
                                        <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] text-[#00DAAF] font-semibold tracking-wider uppercase">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00DAAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3 sm:h-3">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            </svg>
                                            Blockchain Verified
                                        </div>
                                        <span className="text-[7px] sm:text-[9px] text-[#767676] font-mono tracking-wider">{cert.certId}</span>
                                    </div>

                                    <div className="border border-white/[0.06] rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-3 sm:mb-5">
                                        <div className="text-center">
                                            <p className="text-[8px] sm:text-[9px] text-[#767676] uppercase tracking-[1.5px] sm:tracking-[2px] mb-1.5 sm:mb-2 font-semibold">DIGITAL OWNERSHIP CERTIFICATE</p>
                                            <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3">{cert.name}</h3>
                                            <p className="font-bold text-white flex items-center justify-center gap-1.5 sm:gap-2"><span className="text-2xl sm:text-3xl">{cert.fractions}</span> <span className="text-[11px] sm:text-[13px] font-normal text-[#767676]">Fractions</span></p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                        <div className="flex justify-between items-center text-[11px] sm:text-[13px]">
                                            <span className="text-[#767676]">Network</span>
                                            <span className="text-[#00DAAF] font-bold tracking-wide">BNB Chain</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] sm:text-[13px]">
                                            <span className="text-[#767676]">IPFS Hash</span>
                                            <span className="text-white font-mono flex items-center gap-1.5 sm:gap-2">
                                                Qm...x4Kp
                                                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#767676] cursor-pointer hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 sm:gap-3 w-full">
                                        <button className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-[#00FFCD]/10 hover:bg-[#00FFCD]/15 text-[#00DAAF] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase rounded-full flex justify-center items-center gap-1.5 sm:gap-2 border-0 transition-colors cursor-pointer">
                                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                            PDF
                                        </button>
                                        <button className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-transparent hover:bg-white/5 text-[#767676] hover:text-[#A0A0A0] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase rounded-full flex justify-center items-center gap-1.5 sm:gap-2 border border-white/[0.08] transition-colors cursor-pointer">
                                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                            NFT
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "Referrals" && (
                        <div className="bg-[#0D1411] border border-white/[0.04] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-10 max-w-[900px]">
                            <h2 className="text-base sm:text-[22px] font-bold text-white mb-1">Invite & Earn</h2>
                            <p className="text-xs sm:text-sm text-[#767676] mb-5 sm:mb-8 font-medium">Earn $250 for every referred investor</p>

                            <div className="flex items-center bg-[#FFFFFF08] border border-white/[0.06] rounded-full p-1 sm:p-1.5 mb-6 sm:mb-10 w-full max-w-[800px]">
                                <input
                                    readOnly
                                    value="glofi.estate/ref/DEMO-2026"
                                    className="flex-1 min-w-0 bg-transparent border-0 text-[#767676] text-[11px] sm:text-sm px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 focus:outline-none placeholder-[#767676] font-mono tracking-wide"
                                />
                                <button
                                    onClick={handleCopy}
                                    className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide hover:scale-105 transition-all flex items-center gap-1.5 sm:gap-2 shadow-[0_0_15px_rgba(0,255,205,0.2)] cursor-pointer border-0 ${copied ? 'bg-[#009976] text-white' : 'bg-[#00FFCD] text-black'}`}
                                >
                                    {copied ? (
                                        <>
                                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">

                                <div className="bg-[#FFFFFF08] border border-white/[0.04] rounded-xl sm:rounded-[16px] p-4 sm:p-6 relative overflow-hidden group hover:border-[#00FFCD]/20 transition-colors cursor-default">
                                    <div className="absolute right-4 sm:right-5 top-4 sm:top-5 text-[#00DAAF] w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-[#00DAAF1A] rounded-full group-hover:scale-110 transition-transform">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    </div>
                                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-[#767676] mb-2 sm:mb-4 tracking-[1.5px]">REFERRALS</p>
                                    <p className="text-2xl sm:text-[32px] font-black text-white">12</p>
                                </div>

                                <div className="bg-[#FFFFFF08] border border-white/[0.04] rounded-xl sm:rounded-[16px] p-4 sm:p-6 relative overflow-hidden group hover:border-[#00FFCD]/20 transition-colors cursor-default">
                                    <div className="absolute right-4 sm:right-5 top-4 sm:top-5 text-[#00DAAF] w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-[#00DAAF1A] rounded-full group-hover:scale-110 transition-transform">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-[#767676] mb-2 sm:mb-4 tracking-[1.5px]">CONVERTED</p>
                                    <p className="text-2xl sm:text-[32px] font-black text-white">8</p>
                                </div>

                                <div className="bg-[#FFFFFF08] border border-white/[0.04] rounded-xl sm:rounded-[16px] p-4 sm:p-6 relative overflow-hidden group hover:border-[#00FFCD]/20 transition-colors cursor-default">
                                    <div className="absolute right-4 sm:right-5 top-4 sm:top-5 text-[#00DAAF] w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-[#00DAAF1A] rounded-full group-hover:scale-110 transition-transform">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
                                    </div>
                                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-[#767676] mb-2 sm:mb-4 tracking-[1.5px]">EARNED</p>
                                    <p className="text-2xl sm:text-[32px] font-black text-white">$2,000</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
