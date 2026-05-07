"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { PhoneIcon, ProfileIcon, ArrowRightIcon, LoadingSpinner, CheckIcon, SparkleIcon, ChevronLeftIcon, BackArrowIcon, UploadIcon, CalendarIcon } from "@/components/VectorImages";
import { useSetupProfileMutation } from "@/store/api/authApi";
import { useSetupAgentKycMutation } from "@/store/api/kycApi";
import { useUploadFileMutation } from "@/store/api/fileApi";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(3);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [profile, setProfile] = useState({ fullName: "", dateOfBirth: "", nationality: "Indian", residentialAddress: "" });
    const [rera, setRera] = useState({ 
        registrationNumber: "", 
        state: "", 
        expiryDate: "", 
        certificate: null as File | null,
        documentType: "PASSPORT",
        documentFile: null as File | null,
        selfieFile: null as File | null,
        addressProofFile: null as File | null
    });
    const [userRole, setUserRole] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("userType");
        if (role) {
            const upperRole = role.toUpperCase();
            setUserRole(upperRole);
            if (upperRole === "AGENT" && step === 3) {
                setStep(4);
            }
        } else {
            setUserRole("INVESTOR");
        }
    }, []);
    const [errorMsg, setErrorMsg] = useState("");

    const [setupProfile, { isLoading: isSettingUp }] = useSetupProfileMutation();
    const [setupAgentKyc, { isLoading: isSubmittingKyc }] = useSetupAgentKycMutation();
    const [uploadFile] = useUploadFileMutation();

    const otpRefs = useRef([]);


    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleNext = (e) => {
        e?.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(step + 1);
        }, 800);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        
        // For the time being, skip API for Agent role as requested
        if (userRole === "AGENT") {
            setStep(4); // Move to KYC
            return;
        }

        try {
            await setupProfile({
                fullName: profile.fullName,
                dateOfBirth: profile.dateOfBirth,
                nationality: profile.nationality,
                residentialAddress: profile.residentialAddress
            }).unwrap();
            router.push("/dashboard");
        } catch (err) {
            console.error("Failed to setup profile:", err);
            setErrorMsg(err?.data?.message || err?.message || "Failed to setup profile. Please try again.");
        }
    };
    const handleKycSubmit = (e) => {
        e.preventDefault();
        setStep(5); 
    };

    const handleReraSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        
        try {
            const uploadDocument = async (file: File, folder: string) => {
                const response = await uploadFile({ file, folder }).unwrap();
                return response.url; 
            };

            const [docUrl, selfieUrl, addrUrl, reraUrl] = await Promise.all([
                rera.documentFile ? uploadDocument(rera.documentFile, "kyc") : Promise.resolve(""),
                rera.selfieFile ? uploadDocument(rera.selfieFile, "kyc") : Promise.resolve(""),
                rera.addressProofFile ? uploadDocument(rera.addressProofFile, "kyc") : Promise.resolve(""),
                rera.certificate ? uploadDocument(rera.certificate, "rera") : Promise.resolve("")
            ]);

            await setupAgentKyc({
                documentType: rera.documentType,
                documentUrl: docUrl,
                selfieUrl: selfieUrl,
                addressProofUrl: addrUrl,
                reraDocumentUrl: reraUrl,
                reraNumber: rera.registrationNumber,
                expiryDate: rera.expiryDate
            }).unwrap();

            router.push("/dashboard");
        } catch (err: any) {
            console.error("Failed to submit KYC:", err);
            setErrorMsg(err?.data?.message || err?.message || "Failed to submit verification details. Please try again.");
        }
    };

    return (
        <main className="min-h-screen w-full bg-[var(--color-bg-dark)] flex flex-col items-center px-4 py-8 sm:py-20 font-sans selection:bg-[var(--color-primary-300)]/30 theme-purple overflow-x-hidden">
            <div className="mb-8 sm:mb-12 flex flex-col items-center text-center w-full max-w-full">
                <Image src="/assets/images/branding/logo.png" alt="Glofi Logo" width={144} height={48} className="h-10 sm:h-12 w-auto mb-2" priority />
                
            </div>


            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--color-bg-surface-subtle)] mb-10 sm:mb-16 shadow-sm max-w-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-300)]/60" />
                <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.15em] text-[var(--color-text-muted)] uppercase font-Montserrat whitespace-nowrap">
                    {userRole === "PARTNER" ? "Partner Panel" : userRole === "AGENT" ? "Agent Setup" : "Investor Setup"}
                </span>
            </div>


            {/* <div className="flex items-center gap-3 mb-16 relative">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step >= 3
                        ? "bg-[var(--color-primary-900)] text-[var(--color-primary-300)]"
                        : "bg-[var(--color-primary-300-alpha-10)] text-[var(--color-primary-300)] shadow-[0_0_15px_var(--color-primary-300-alpha-10)]"
                        }`}>
                        {step >= 3 ? <CheckIcon className="w-5 h-5" /> : <PhoneIcon className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm font-semibold transition-colors text-white`}>Verify Phone</span>
                </div>

                <div className={`w-12 h-[1px] mx-1 transition-colors duration-300 ${step >= 3 ? "bg-[var(--color-primary-300)]/40" : "bg-[var(--color-border-subtle)]"}`} />


                <div className={`flex items-center gap-3 transition-opacity duration-300 ${step === 3 ? "opacity-100" : "opacity-50"}`}>
                    <div className={`w-10 h-10 rounded-full  flex items-center justify-center transition-all duration-300 ${step === 3
                        ? "bg-[var(--color-primary-300-alpha-10)] border-[var(--color-primary-300)]/20 text-[var(--color-primary-300)] shadow-[0_0_15px_var(--color-primary-300-alpha-10)]"
                        : "bg-[var(--color-bg-surface-subtle)] border-[var(--color-border-subtle)] text-white"
                        }`}>
                        <ProfileIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-white">Profile Setup</span>
                </div>
            </div> */}


            {/* {step === 1 && (
                <div className="w-full max-w-sm flex flex-col items-start text-start animate-fade-in">
                    <h1 className="text-white font-bold text-3xl tracking-tight mb-3">Verify your phone</h1>
                    <p className="text-[var(--color-text-muted)] font-Montserrat text-md leading-relaxed mb-10">
                        We'll send a 6-digit code to confirm your number
                    </p>

                    <form onSubmit={handleNext} className="w-full space-y-6">
                        <div className="flex gap-2">
                            <div className="w-24 h-[60px] rounded-2xl bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] flex items-center justify-center gap-2 cursor-pointer hover:border-[var(--color-border-muted)] transition-colors px-3">

                                <span className="text-white font-medium">+1</span>
                                <svg className="w-3 h-3 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <input
                                    type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" required
                                    className="w-full h-[60px] rounded-2xl px-6 bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-300)]/40 transition-all font-medium text-base"
                                />
                            </div>
                        </div>
                        <button
                            type="submit" disabled={loading || !phone}
                            className="w-full h-[60px] rounded-full bg-[var(--color-primary-300)] text-black font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_8px_20px_var(--color-primary-300-alpha-15)]"
                        >
                            {loading ? <LoadingSpinner /> : <>Send Code <ArrowRightIcon /></>}
                        </button>
                    </form>
                </div>
            )} */}


            {/* {step === 2 && (
                <div className="w-full max-w-sm flex flex-col items-start text-start animate-fade-in">
                    <h1 className="text-white font-bold text-3xl tracking-tight mb-3">Verify your phone</h1>
                    <p className="text-white/40 font-Montserrat text-md leading-relaxed mb-10">
                        We'll send a 6-digit code to confirm your number
                    </p>

                    <form onSubmit={handleNext} className="w-full space-y-8">
                        <div className="flex justify-between gap-2.5">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={el => otpRefs.current[idx] = el}
                                    type="text" maxLength={1} value={digit}
                                    onChange={e => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={e => handleKeyDown(idx, e)}
                                    className="w-full aspect-square text-center rounded-lg bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] text-white text-xl font-bold focus:outline-none focus:border-[var(--color-primary-300-alpha-40)] focus:ring-4 focus:ring-[var(--color-primary-300-alpha-10)] transition-all"
                                />
                            ))}
                        </div>

                        <button
                            type="submit" disabled={loading || otp.join("").length < 6}
                            className="w-full h-[60px] rounded-full bg-[var(--color-primary-300)] text-black font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_8px_20px_var(--color-primary-300-alpha-15)]"
                        >
                            {loading ? <LoadingSpinner /> : <>Verify <CheckIcon stroke="black" /></>}
                        </button>

                        <p className="text-md text-white/30 font-Montserrat text-center">
                            Didn't receive? <button type="button" className="text-[var(--color-primary-300)]/60 font-semibold hover:underline">Resend</button>
                        </p>
                    </form>
                </div>
            )} */}


            {step === 3 && userRole !== "AGENT" && (
                <div className="w-full max-w-[500px] flex flex-col animate-fade-in p-6 sm:p-10 rounded-[24px] sm:rounded-[32px] border border-white/5 bg-[#0D0D0D] shadow-2xl relative">
                    <h1 className="text-white font-bold text-3xl tracking-tight mb-3 font-Montserrat">Set up your profile</h1>
                    <p className="text-[var(--color-text-muted)] text-md leading-relaxed mb-2 font-Montserrat">
                        Tell us a bit about yourself
                    </p>
                    {errorMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
                        >
                            {errorMsg}
                        </motion.div>
                    )}

                    <form onSubmit={handleProfileSubmit} className="w-full space-y-5 text-left">
                        <input
                            type="text" placeholder="Full legal name" required
                            value={profile.fullName} onChange={e => { setProfile({ ...profile, fullName: e.target.value }); setErrorMsg(""); }}
                            className="w-full h-[50px] rounded-lg px-6 bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-300)]/40 transition-all font-medium font-Montserrat"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[var(--color-text-muted)]/50 tracking-widest uppercase font-Montserrat ml-1">Date of Birth</label>
                                <input
                                    type="date" required
                                    value={profile.dateOfBirth} onChange={e => { setProfile({ ...profile, dateOfBirth: e.target.value }); setErrorMsg(""); }}
                                    className="w-full h-[50px] rounded-lg px-6 bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-300)]/40 transition-all font-medium custom-calendar-picker"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[var(--color-text-muted)]/50 tracking-widest uppercase font-Montserrat ml-1">Nationality</label>
                                <div className="relative">
                                    <select
                                        className="w-full h-[50px] rounded-lg px-6 bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-300)]/40 appearance-none transition-all font-medium font-Montserrat"
                                        value={profile.nationality} onChange={e => { setProfile({ ...profile, nationality: e.target.value }); setErrorMsg(""); }}
                                    >
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                        <option>Indian</option>
                                    </select>
                                    <svg className="w-4 h-4 text-[var(--color-text-muted)]/50 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <input
                            type="text" placeholder="Residential address" required
                            value={profile.residentialAddress} onChange={e => { setProfile({ ...profile, residentialAddress: e.target.value }); setErrorMsg(""); }}
                            className="w-full h-[50px] rounded-lg px-6 bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-300)]/40 transition-all font-medium font-Montserrat"
                        />

                        <div className="flex gap-4 pt-4">
                            {/* <button
                                type="button" onClick={handleBack}
                                className="w-[60px] h-[50px] rounded-2xl bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white hover:border-[var(--color-border-muted)] transition-all font-Montserrat"
                            >
                                <BackArrowIcon className="w-5 h-5" />
                            </button> */}
                            <button
                                type="submit" disabled={isSettingUp}
                                className="flex-1 h-[50px] rounded-full bg-[var(--color-primary-300)] text-black font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_8px_20px_var(--color-primary-300-alpha-15)] font-Montserrat"
                            >
                                {isSettingUp ? <LoadingSpinner /> : <>Complete Setup <SparkleIcon /></>}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {step === 4 && (
                <div className="w-full max-w-[560px] flex flex-col animate-fade-in p-6 sm:p-10 rounded-[24px] sm:rounded-[32px] border border-white/5 bg-[#0D0D0D] shadow-2xl relative">
                    <h1 className="text-white font-semibold text-2xl tracking-tight mb-8 font-Montserrat">Identity Verification</h1>
                    <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-8 font-Montserrat">
                        Please upload your documents to complete KYC. This is required for agent commission payouts.
                    </p>
                    
                    <form onSubmit={handleKycSubmit} className="w-full space-y-6">
                        <div className="space-y-2.5">
                            <label className="text-[11px] font-semibold text-white/50 tracking-wider uppercase font-Montserrat ml-1">Document Type</label>
                            <select
                                className="w-full h-[56px] rounded-xl px-5 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#00FFCC]/30 transition-all font-medium font-Montserrat appearance-none"
                                value={rera.documentType} onChange={e => setRera({ ...rera, documentType: e.target.value })}
                            >
                                <option value="PASSPORT" className="bg-[#0D0D0D]">Passport</option>
                                <option value="AADHAR" className="bg-[#0D0D0D]">Aadhar Card</option>
                                <option value="PAN" className="bg-[#0D0D0D]">PAN Card</option>
                                <option value="DRIVING_LICENSE" className="bg-[#0D0D0D]">Driving License</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2.5">
                                <label className="text-[11px] font-semibold text-white/50 tracking-wider uppercase font-Montserrat ml-1">Document Front/Full</label>
                                <div 
                                    className="relative w-full h-[100px] rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#00FFCC]/20 transition-all overflow-hidden"
                                    onClick={() => document.getElementById('docFile')?.click()}
                                >
                                    <input 
                                        type="file" id="docFile" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={e => setRera({ ...rera, documentFile: e.target.files?.[0] || null })}
                                    />
                                    {rera.documentFile ? (
                                        <span className="text-[11px] text-[#00FFCC] font-medium truncate px-2 w-full text-center">{rera.documentFile.name}</span>
                                    ) : (
                                        <>
                                            <UploadIcon className="w-5 h-5 text-white/30" />
                                            <span className="text-[10px] text-white/30">Upload ID</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[11px] font-semibold text-white/50 tracking-wider uppercase font-Montserrat ml-1">Selfie Verification</label>
                                <div 
                                    className="relative w-full h-[100px] rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#00FFCC]/20 transition-all overflow-hidden"
                                    onClick={() => document.getElementById('selfieFile')?.click()}
                                >
                                    <input 
                                        type="file" id="selfieFile" className="hidden" accept=".jpg,.jpeg,.png"
                                        onChange={e => setRera({ ...rera, selfieFile: e.target.files?.[0] || null })}
                                    />
                                    {rera.selfieFile ? (
                                        <span className="text-[11px] text-[#00FFCC] font-medium truncate px-2 w-full text-center">{rera.selfieFile.name}</span>
                                    ) : (
                                        <>
                                            <UploadIcon className="w-5 h-5 text-white/30" />
                                            <span className="text-[10px] text-white/30">Upload Selfie</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[11px] font-semibold text-white/50 tracking-wider uppercase font-Montserrat ml-1">Address Proof</label>
                            <div 
                                className="relative w-full h-[100px] rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#00FFCC]/20 transition-all overflow-hidden"
                                onClick={() => document.getElementById('addressFile')?.click()}
                            >
                                <input 
                                    type="file" id="addressFile" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={e => setRera({ ...rera, addressProofFile: e.target.files?.[0] || null })}
                                />
                                {rera.addressProofFile ? (
                                    <span className="text-[11px] text-[#00FFCC] font-medium truncate px-2 w-full text-center">{rera.addressProofFile.name}</span>
                                ) : (
                                    <>
                                        <UploadIcon className="w-5 h-5 text-white/30" />
                                        <span className="text-[11px] text-white/30">Upload Proof of Address</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[60px] rounded-2xl bg-[#00FFCC] text-black font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_8px_20px_rgba(0,255,204,0.2)] font-Montserrat"
                        >
                            Next: RERA Details <ArrowRightIcon />
                        </button>
                    </form>
                </div>
            )}

            {step === 5 && (
                <div className="w-full max-w-[560px] flex flex-col animate-fade-in p-6 sm:p-10 rounded-[24px] sm:rounded-[32px] border border-white/5 bg-[#0D0D0D] shadow-2xl relative">
                    <h1 className="text-white font-semibold text-2xl tracking-tight mb-8 font-Montserrat">RERA Registration Details</h1>
                    
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#00FFCC]/5 border border-[#00FFCC]/10 mb-8 w-full">
                        <div className="w-6 h-6 rounded-full border border-[#00FFCC]/40 flex items-center justify-center text-[12px] text-[#00FFCC] shrink-0 font-bold">!</div>
                        <p className="text-[13px] text-white/70 leading-relaxed font-Montserrat">
                            Your RERA registration will be verified against the official registry. Ensure the details match exactly.
                        </p>
                    </div>

                    <form onSubmit={handleReraSubmit} className="w-full space-y-7">
                        <div className="space-y-2.5">
                            <label className="text-[11px] font-semibold text-white/50 tracking-wider uppercase font-Montserrat ml-1">RERA Registration Number</label>
                            <input
                                type="text" placeholder="RERA-MH-2024-001234" required
                                value={rera.registrationNumber} onChange={e => setRera({ ...rera, registrationNumber: e.target.value })}
                                className="w-full h-[56px] rounded-xl px-5 bg-white/[0.03] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#00FFCC]/30 transition-all font-medium font-Montserrat"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[11px] font-semibold text-white/50 tracking-wider uppercase font-Montserrat ml-1">State</label>
                            <input
                                type="text" placeholder="Select state" required
                                value={rera.state} onChange={e => setRera({ ...rera, state: e.target.value })}
                                className="w-full h-[56px] rounded-xl px-5 bg-white/[0.03] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#00FFCC]/30 transition-all font-medium font-Montserrat"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[11px] font-semibold text-white/50 tracking-wider uppercase font-Montserrat ml-1">RERA License Expiry Date</label>
                            <div className="relative">
                                <input
                                    type="date" required
                                    value={rera.expiryDate} onChange={e => setRera({ ...rera, expiryDate: e.target.value })}
                                    className="w-full h-[56px] rounded-xl px-5 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#00FFCC]/30 transition-all font-medium custom-calendar-picker"
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[11px] font-semibold text-white/50 tracking-wider uppercase font-Montserrat ml-1">Upload RERA Certificate</label>
                            <div 
                                className="w-full h-[140px] rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#00FFCC]/20 hover:bg-white/[0.04] transition-all group overflow-hidden"
                                onClick={() => document.getElementById('reraFile')?.click()}
                            >
                                <input 
                                    type="file" id="reraFile" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={e => setRera({ ...rera, certificate: e.target.files?.[0] || null })}
                                />
                                {rera.certificate ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <CheckIcon className="w-8 h-8 text-[#00FFCC]" />
                                        <span className="text-[12px] font-medium text-[#00FFCC] truncate px-4 w-full text-center">{rera.certificate.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <UploadIcon className="w-6 h-6 text-white/40" />
                                        </div>
                                        <span className="text-[12px] font-medium text-white/40">Click to upload (PDF, JPG, PNG)</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button
                                type="button" onClick={() => setStep(4)}
                                className="flex-1 h-[56px] rounded-2xl border border-white/10 text-white font-semibold text-[15px] hover:bg-white/5 transition-all font-Montserrat"
                            >
                                Back
                            </button>
                            <button
                                type="submit" disabled={isSubmittingKyc}
                                className="flex-[2] h-[56px] rounded-2xl bg-[#00FFCC] text-black font-bold text-[15px] flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_4px_24px_rgba(0,255,204,0.3)] font-Montserrat"
                            >
                                {isSubmittingKyc ? <LoadingSpinner color="black" /> : "Submit for Verification"}
                            </button>
                        </div>
                    </form>
                </div>
            )}


            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-primary-300)]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </main>
    );
}
