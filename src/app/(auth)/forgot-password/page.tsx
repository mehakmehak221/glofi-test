"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeftIcon, 
    LoadingSpinner, 
    ArrowRightIcon, 
    EyeOpenIcon, 
    EyeClosedIcon,
    CheckIcon
} from "@/components/VectorImages";
import { 
    useForgotPasswordMutation, 
    useVerifyForgotPasswordOtpMutation, 
    useResetPasswordMutation 
} from "@/store/api/authApi";
import { 
    passwordMeetsSignUpStrength, 
    getSignUpPasswordCriteria 
} from "@/utils/authFormErrors";

type Step = "EMAIL" | "OTP" | "RESET" | "SUCCESS";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("EMAIL");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
    const [verifyOtp, { isLoading: isVerifyLoading }] = useVerifyForgotPasswordOtpMutation();
    const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            await forgotPassword({ email }).unwrap();
            setSuccessMsg("OTP sent successfully to your email.");
            setStep("OTP");
        } catch (err: any) {
            setSuccessMsg("");
            setErrorMsg(err?.data?.message || "Failed to send OTP. Please try again.");
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            await verifyOtp({ email, otp }).unwrap();
            setStep("RESET");
            setSuccessMsg("");
        } catch (err: any) {
            setSuccessMsg("");
            setErrorMsg(err?.data?.message || "Invalid OTP. Please try again.");
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        
        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        if (!passwordMeetsSignUpStrength(password)) {
            setErrorMsg("Password must meet all requirements below.");
            return;
        }

        try {
            await resetPassword({ email, otp, newPassword: password }).unwrap();
            setStep("SUCCESS");
        } catch (err: any) {
            setSuccessMsg("");
            setErrorMsg(err?.data?.message || "Failed to reset password. Please try again.");
        }
    };

    const isLoading = isForgotLoading || isVerifyLoading || isResetLoading;

    return (
        <div className="flex flex-col">
            {step === "EMAIL" || step === "SUCCESS" ? (
                <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-white text-sm transition-colors mb-8 group"
                >
                    <ChevronLeftIcon className="group-hover:-translate-x-0.5 transition-transform font-montserrat" />
                    Back to Sign In
                </Link>
            ) : (
                <button
                    onClick={() => {
                        if (step === "OTP") setStep("EMAIL");
                        if (step === "RESET") setStep("OTP");
                    }}
                    className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-white text-sm transition-colors mb-8 group bg-transparent border-none cursor-pointer p-0"
                >
                    <ChevronLeftIcon className="group-hover:-translate-x-0.5 transition-transform font-montserrat" />
                    Back
                </button>
            )}

            <div className="mb-8">
                <h2 className="text-white font-bold text-3xl mb-1.5 font-montserrat">
                    {step === "EMAIL" && "Forgot Password"}
                    {step === "OTP" && "Verify OTP"}
                    {step === "RESET" && "Reset Password"}
                    {step === "SUCCESS" && "Password Reset"}
                </h2>
                <p className="text-[var(--color-text-secondary)] text-sm font-montserrat">
                    {step === "EMAIL" && "Enter your email to receive a password reset code"}
                    {step === "OTP" && `Enter the 6-digit code sent to ${email}`}
                    {step === "RESET" && "Create a new secure password for your account"}
                    {step === "SUCCESS" && "Your password has been reset successfully"}
                </p>

                <AnimatePresence mode="wait">
                    {errorMsg ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
                            role="alert"
                        >
                            {errorMsg}
                        </motion.div>
                    ) : successMsg ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium"
                            role="status"
                        >
                            {successMsg}
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>

            <div className="font-montserrat">
                {step === "EMAIL" && (
                    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                                placeholder="Email address"
                                required
                                className="premium-input w-full"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full mt-2"
                        >
                            {isLoading ? <LoadingSpinner /> : <>Send Reset Code <ArrowRightIcon /></>}
                        </button>
                    </form>
                )}

                {step === "OTP" && (
                    <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => { setOtp(e.target.value); setErrorMsg(""); }}
                                placeholder="6-digit OTP"
                                required
                                maxLength={6}
                                className="premium-input w-full text-center tracking-[0.5em] text-xl"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full mt-2"
                        >
                            {isLoading ? <LoadingSpinner /> : <>Verify OTP <ArrowRightIcon /></>}
                        </button>
                        <button 
                            type="button"
                            onClick={handleEmailSubmit}
                            disabled={isLoading}
                            className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors text-center"
                        >
                            Didn't receive a code? Resend
                        </button>
                    </form>
                )}

                {step === "RESET" && (
                    <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                                placeholder="New Password"
                                required
                                className="premium-input w-full pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                            >
                                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </button>
                        </div>
                        <ul
                            id="reset-password-requirements"
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 space-y-1.5 text-xs text-[var(--color-text-secondary)] list-none"
                            aria-label="Password requirements"
                            aria-live="polite"
                        >
                            {getSignUpPasswordCriteria(password).map(({ id, label, met }) => (
                                <li key={id} className={`flex items-start gap-2 ${met ? "text-emerald-400/95" : ""}`}>
                                    <span className="mt-0.5 w-3.5 shrink-0 text-center" aria-hidden>
                                        {met ? "✓" : "○"}
                                    </span>
                                    <span>{label}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(""); }}
                                placeholder="Confirm New Password"
                                required
                                className="premium-input w-full"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full mt-2"
                        >
                            {isLoading ? <LoadingSpinner /> : <>Reset Password <ArrowRightIcon /></>}
                        </button>
                    </form>
                )}

                {step === "SUCCESS" && (
                    <div className="flex flex-col items-center gap-6 mt-4">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                            <CheckIcon className="w-8 h-8" />
                        </div>
                        <button
                            onClick={() => router.push("/sign-in")}
                            className="btn-primary w-full"
                        >
                            Go to Sign In <ArrowRightIcon />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
