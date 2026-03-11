"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PhoneIcon, ProfileIcon, ArrowRightIcon, LoadingSpinner, CheckIcon, SparkleIcon, ChevronLeftIcon, BackArrowIcon } from "@/components/VectorImages";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [profile, setProfile] = useState({ name: "", dob: "", nationality: "United States", address: "" });
    const [loading, setLoading] = useState(false);

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

    return (
        <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-sans selection:bg-[#00FFCD]/30">


            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0d0d0d]  mb-12 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00DAAF99]" />
                <span className="text-[12px] font-bold tracking-[0.15em] text-[#a0a0a0] uppercase font-Montserrat">
                    Investor Setup
                </span>
            </div>


            <div className="flex items-center gap-3 mb-16 relative">

                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step >= 3
                        ? "bg-[#012620] text-[#00FFCD]"
                        : "bg-[#00FFCD]/10  text-[#00FFCD] shadow-[0_0_15px_rgba(0,255,205,0.1)]"
                        }`}>
                        {step >= 3 ? <CheckIcon className="w-5 h-5" /> : <PhoneIcon className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm font-semibold transition-colors ${step >= 3 ? "text-white" : "text-white"}`}>Verify Phone</span>
                </div>

                <div className={`w-12 h-[1px] mx-1 transition-colors duration-300 ${step >= 3 ? "bg-[#00FFCD]/40" : "bg-white/10"}`} />


                <div className={`flex items-center gap-3 transition-opacity duration-300 ${step === 3 ? "opacity-100" : "opacity-40"}`}>
                    <div className={`w-10 h-10 rounded-full  flex items-center justify-center transition-all duration-300 ${step === 3
                        ? "bg-[#00FFCD]/10 border-[#00FFCD]/20 text-[#00FFCD] shadow-[0_0_15px_rgba(0,255,205,0.1)]"
                        : "bg-[#1a1a1a] border-white/5 text-white"
                        }`}>
                        <ProfileIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-white">Profile Setup</span>
                </div>
            </div>


            {step === 1 && (
                <div className="w-full max-w-sm flex flex-col items-start text-start animate-fade-in">
                    <h1 className="text-white font-bold text-3xl tracking-tight mb-3">Verify your phone</h1>
                    <p className="text-[#a0a0a0] font-Montserrat text-md leading-relaxed mb-10 font-[#FFFFFF4D]">
                        We'll send a 6-digit code to confirm your number
                    </p>

                    <form onSubmit={handleNext} className="w-full space-y-6">
                        <div className="flex gap-2">
                            <div className="w-20 h-[60px] rounded-xl bg-[#111111] border border-white/5 flex items-center justify-center cursor-pointer hover:border-white/10 transition-colors">

                                <svg className="w-3 h-3 text-[#4c4c4c] ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <input
                                    type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" required
                                    className="w-full h-[60px] rounded-xl px-6 bg-[#111111] border border-white/5 text-white placeholder-[#4c4c4c] focus:outline-none focus:border-[#00FFCD]/40 transition-all font-medium text-base"
                                />
                            </div>
                        </div>
                        <button
                            type="submit" disabled={loading || !phone}
                            className="w-full h-[60px] rounded-xl bg-[#00FFCD] text-black font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#00e0b8] transition-all disabled:opacity-50 shadow-[0_8px_20px_rgba(0,255,205,0.15)]"
                        >
                            {loading ? <LoadingSpinner /> : <>Send Code <ArrowRightIcon /></>}
                        </button>
                    </form>
                </div>
            )}


            {step === 2 && (
                <div className="w-full max-w-sm flex flex-col items-start text-start animate-fade-in">
                    <h1 className="text-white font-bold text-3xl tracking-tight mb-3">Verify your phone</h1>
                    <p className="text-[#a0a0a0] font-Montserrat text-md leading-relaxed mb-10 font-[#FFFFFF4D]">
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
                                    className="w-full aspect-square text-center rounded-lg bg-[#111111] border border-white/5 text-white text-xl font-bold focus:outline-none focus:border-[#00FFCD]/40 focus:ring-4 focus:ring-[#00FFCD]/5 transition-all"
                                />
                            ))}
                        </div>

                        <button
                            type="submit" disabled={loading || otp.join("").length < 6}
                            className="w-full h-[60px] rounded-full bg-[#00FFCD] text-black font-bold text-base flex items-center justify-center gap-2 hover:bg-[#00e0b8] transition-all disabled:opacity-50 shadow-[0_8px_20px_rgba(0,255,205,0.15)]"
                        >
                            {loading ? <LoadingSpinner /> : <>Verify <CheckIcon stroke="black" /></>}
                        </button>

                        <p className="text-md text-[#767676] font-Montserrat text-center">
                            Didn't receive? <button type="button" className="text-[#00DAAF99] font-semibold hover:underline">Resend</button>
                        </p>
                    </form>
                </div>
            )}


            {step === 3 && (
                <div className="w-full max-w-sm flex flex-col items-start animate-fade-in text-start">
                    <h1 className="text-white font-bold text-3xl tracking-tight mb-3 font-Montserrat">Set up your profile</h1>
                    <p className="text-[#FFFFFF4D] text-md leading-relaxed mb-10 font-Montserrat">
                        Tell us a bit about yourself
                    </p>

                    <form onSubmit={() => router.push("/dashboard")} className="w-full space-y-5 text-left">
                        <input
                            type="text" placeholder="Full legal name" required
                            value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                            className="w-full h-[50px] rounded-lg px-6 bg-[#111111] border border-white/5 text-white placeholder-[#4c4c4c] focus:outline-none focus:border-[#00FFCD]/40 transition-all font-medium font-Montserrat"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#4c4c4c] tracking-widest uppercase font-Montserrat ml-1">Date of Birth</label>
                                <input
                                    type="date" required
                                    value={profile.dob} onChange={e => setProfile({ ...profile, dob: e.target.value })}
                                    className="w-full h-[50px] rounded-lg px-6 bg-[#111111] border border-white/5 text-[#a0a0a0] focus:outline-none focus:border-[#00FFCD]/40 transition-all font-medium custom-calendar-picker"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#4c4c4c] tracking-widest uppercase font-Montserrat ml-1">Nationality</label>
                                <div className="relative">
                                    <select
                                        className="w-full h-[50px] rounded-lg px-6 bg-[#111111] border border-white/5 text-[#a0a0a0] focus:outline-none focus:border-[#00FFCD]/40 appearance-none transition-all font-medium font-Montserrat"
                                        value={profile.nationality} onChange={e => setProfile({ ...profile, nationality: e.target.value })}
                                    >
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                    </select>
                                    <svg className="w-4 h-4 text-[#4c4c4c] absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <input
                            type="text" placeholder="Residential address" required
                            value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })}
                            className="w-full h-[50px] rounded-lg px-6 bg-[#111111] border border-white/5 text-white placeholder-[#4c4c4c] focus:outline-none focus:border-[#00FFCD]/40 transition-all font-medium font-Montserrat"
                        />

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button" onClick={handleBack}
                                className="w-[60px] h-[50px] rounded-lg bg-[#111111] border border-white/5 flex items-center justify-center text-[#767676] hover:text-white hover:border-white/10 transition-all font-Montserrat"
                            >
                                <BackArrowIcon className="w-5 h-5" />
                            </button>
                            <button
                                type="submit" disabled={loading}
                                className="flex-1 h-[50px] rounded-lg bg-[#00FFCD] text-black font-bold text-base flex items-center justify-center gap-2 hover:bg-[#00e0b8] transition-all shadow-[0_8px_20px_rgba(0,255,205,0.15)] font-Montserrat"
                            >
                                Complete Setup <SparkleIcon />
                            </button>
                        </div>
                    </form>
                </div>
            )}


            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00FFCD]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </main>
    );
}
