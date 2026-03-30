"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { PhoneIcon, ProfileIcon, ArrowRightIcon, LoadingSpinner, CheckIcon, SparkleIcon, ChevronLeftIcon, BackArrowIcon } from "@/components/VectorImages";
import { useSetupProfileMutation } from "@/store/api/authApi";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(3);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [profile, setProfile] = useState({ fullName: "", dateOfBirth: "", nationality: "Indian", residentialAddress: "" });
    const [userRole, setUserRole] = useState("INVESTOR");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("userType");
        if (role) setUserRole(role.toUpperCase());
    }, []);
    const [errorMsg, setErrorMsg] = useState("");

    const [setupProfile, { isLoading: isSettingUp }] = useSetupProfileMutation();

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

    return (
        <main className="min-h-screen bg-[var(--color-bg-dark)] flex flex-col items-center justify-center p-6 font-sans selection:bg-[var(--color-primary-300)]/30 theme-purple">
            <div className="mb-12">
                <Image src="/assets/logo.jpeg" alt="Glofi Logo" width={144} height={48} className="h-12 w-auto" priority />
                 <span className="navbar__logo-text font-montserrat text-[10px] sm:text-xs font-normal text-[var(--color-text-secondary)] uppercase tracking-[1.5px] whitespace-nowrap pt-1">
                        Real Estate
                    </span>
            </div>


            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--color-bg-surface-subtle)] mb-12 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-300)]/60" />
                <span className="text-[12px] font-bold tracking-[0.15em] text-[var(--color-text-muted)] uppercase font-Montserrat">
                    {userRole === "PARTNER" ? "Partner Panel" : "Investor Setup"}
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


            {step === 3 && (
                <div className="w-full max-w-sm flex flex-col items-start animate-fade-in text-start">
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


            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-primary-300)]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </main>
    );
}
