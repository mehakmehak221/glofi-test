"use client";

import { useState, useEffect } from "react";
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
import { useI18n } from "@/providers/LocaleProvider";
import {
    useForgotPasswordMutation,
    useVerifyForgotPasswordOtpMutation,
    useResetPasswordMutation
} from "@/store/api/authApi";
import {
    passwordMeetsSignUpStrength,
    getSignUpPasswordCriteria,
    EMAIL_PATTERN,
    EMAIL_FORMAT_ERROR,
    FIELD_ERROR_CLASSES,
    collectApiErrorLines,
    coerceFirstStringMessage,
    isMachineEmailValidationMessage
} from "@/utils/authFormErrors";

type Step = "EMAIL" | "OTP" | "RESET" | "SUCCESS";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { t } = useI18n();
    const [step, setStep] = useState<Step>("EMAIL");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Field-specific validation error states
    const [emailError, setEmailError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
    const [verifyOtp, { isLoading: isVerifyLoading }] = useVerifyForgotPasswordOtpMutation();
    const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();

    useEffect(() => {
        if (errorMsg || emailError || otpError || passwordError || confirmPasswordError) {
            const firstError = document.querySelector('[role="alert"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [errorMsg, emailError, otpError, passwordError, confirmPasswordError]);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setEmailError("");

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setEmailError("Please enter your email address.");
            return;
        }
        if (!EMAIL_PATTERN.test(trimmedEmail)) {
            setEmailError(EMAIL_FORMAT_ERROR);
            return;
        }

        try {
            await forgotPassword({ email: trimmedEmail }).unwrap();
            setSuccessMsg("OTP sent successfully to your email.");
            setStep("OTP");
        } catch (err: any) {
            setSuccessMsg("");
            const errorBody = err?.data;
            const message = errorBody?.message ?? errorBody?.error ?? err?.message;
            const validationLines = collectApiErrorLines(errorBody, message);
            const flatMessage = validationLines.join("\n\n") || coerceFirstStringMessage(errorBody) || (typeof message === "string" ? message : "");

            if (isMachineEmailValidationMessage(flatMessage)) {
                setEmailError(EMAIL_FORMAT_ERROR);
            } else {
                setErrorMsg(flatMessage || "Failed to send OTP. Please try again.");
            }
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setOtpError("");

        const trimmedOtp = otp.trim();
        if (!trimmedOtp) {
            setOtpError("Please enter the 6-digit OTP code.");
            return;
        }
        if (!/^\d{6}$/.test(trimmedOtp)) {
            setOtpError("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            await verifyOtp({ email: email.trim(), otp: trimmedOtp }).unwrap();
            setStep("RESET");
            setSuccessMsg("");
        } catch (err: any) {
            setSuccessMsg("");
            const errorBody = err?.data;
            const message = errorBody?.message ?? errorBody?.error ?? err?.message;
            const validationLines = collectApiErrorLines(errorBody, message);
            const flatMessage = validationLines.join("\n\n") || coerceFirstStringMessage(errorBody) || (typeof message === "string" ? message : "");

            if (flatMessage.toLowerCase().includes("otp") || flatMessage.toLowerCase().includes("code") || flatMessage.toLowerCase().includes("invalid")) {
                setOtpError(flatMessage || "Invalid OTP. Please try again.");
            } else {
                setErrorMsg(flatMessage || "Invalid OTP. Please try again.");
            }
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setPasswordError("");
        setConfirmPasswordError("");
        setSuccessMsg("");

        let hasError = false;

        if (!password) {
            setPasswordError("Please enter a password.");
            hasError = true;
        } else if (!passwordMeetsSignUpStrength(password)) {
            setPasswordError("Password must meet all requirements below.");
            hasError = true;
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Please confirm your password.");
            hasError = true;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            hasError = true;
        }

        if (hasError) return;

        try {
            await resetPassword({ email: email.trim(), otp: otp.trim(), newPassword: password }).unwrap();
            setStep("SUCCESS");
        } catch (err: any) {
            setSuccessMsg("");
            const errorBody = err?.data;
            const message = errorBody?.message ?? errorBody?.error ?? err?.message;
            const validationLines = collectApiErrorLines(errorBody, message);
            const flatMessage = validationLines.join("\n\n") || coerceFirstStringMessage(errorBody) || (typeof message === "string" ? message : "");

            if (flatMessage.toLowerCase().includes("password")) {
                setPasswordError(flatMessage || "Failed to reset password. Please try again.");
            } else {
                setErrorMsg(flatMessage || "Failed to reset password. Please try again.");
            }
        }
    };

    const isLoading = isForgotLoading || isVerifyLoading || isResetLoading;

    return (
        <div className="flex flex-col">
            {step === "EMAIL" || step === "SUCCESS" ? (
                <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-sm transition-colors mb-8 group"
                >
                    <ChevronLeftIcon className="group-hover:-translate-x-0.5 transition-transform font-montserrat" />
                    {t("Back to Sign In")}
                </Link>
            ) : (
                <button
                    onClick={() => {
                        setErrorMsg("");
                        setSuccessMsg("");
                        setEmailError("");
                        setOtpError("");
                        setPasswordError("");
                        setConfirmPasswordError("");
                        if (step === "OTP") setStep("EMAIL");
                        if (step === "RESET") setStep("OTP");
                    }}
                    className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-sm transition-colors mb-8 group bg-transparent border-none cursor-pointer p-0"
                >
                    <ChevronLeftIcon className="group-hover:-translate-x-0.5 transition-transform font-montserrat" />
                    {t("Back")}
                </button>
            )}

            <div className="mb-8">
                <h2 className="text-neutral-900 font-bold text-3xl mb-1.5 font-montserrat">
                    {step === "EMAIL" && t("Forgot Password")}
                    {step === "OTP" && t("Verify OTP")}
                    {step === "RESET" && t("Reset Password")}
                    {step === "SUCCESS" && t("Password Reset")}
                </h2>
                <p className="text-neutral-500 text-sm font-montserrat">
                    {step === "EMAIL" && t("Enter your email to receive a password reset code")}
                    {step === "OTP" && t("Enter the 6-digit code sent to {email}", { email })}
                    {step === "RESET" && t("Create a new secure password for your account")}
                    {step === "SUCCESS" && t("Your password has been reset successfully")}
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
                        <div className="relative flex flex-col gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); setEmailError(""); }}
                                placeholder={t("Email address")}
                                required
                                aria-invalid={Boolean(emailError)}
                                aria-describedby={emailError ? "forgot-email-error" : undefined}
                                className={`premium-input w-full ${emailError ? "border-red-500/60 focus:border-red-400" : ""}`}
                            />
                            {emailError ? (
                                <p id="forgot-email-error" className={FIELD_ERROR_CLASSES} role="alert">
                                    {emailError}
                                </p>
                            ) : null}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full mt-2"
                        >
                            {isLoading ? <LoadingSpinner /> : <>{t("Send Reset Code")} <ArrowRightIcon /></>}
                        </button>
                    </form>
                )}

                {step === "OTP" && (
                    <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                        <div className="relative flex flex-col gap-2">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                                    setOtp(val);
                                    setErrorMsg("");
                                    setOtpError("");
                                }}
                                placeholder={t("6-digit OTP")}
                                required
                                maxLength={6}
                                aria-invalid={Boolean(otpError)}
                                aria-describedby={otpError ? "forgot-otp-error" : undefined}
                                className={`premium-input w-full text-center tracking-[0.5em] text-xl ${otpError ? "border-red-500/60 focus:border-red-400" : ""}`}
                            />
                            {otpError ? (
                                <p id="forgot-otp-error" className={FIELD_ERROR_CLASSES} role="alert">
                                    {otpError}
                                </p>
                            ) : null}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full mt-2"
                        >
                            {isLoading ? <LoadingSpinner /> : <>{t("Verify OTP")} <ArrowRightIcon /></>}
                        </button>
                        <button
                            type="button"
                            onClick={handleEmailSubmit}
                            disabled={isLoading}
                            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors text-center"
                        >
                            {t("Didn't receive a code? Resend")}
                        </button>
                    </form>
                )}

                {step === "RESET" && (
                    <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
                        <div className="relative flex flex-col gap-2">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); setPasswordError(""); }}
                                    placeholder={t("New Password")}
                                    required
                                    aria-invalid={Boolean(passwordError)}
                                    aria-describedby={passwordError ? "forgot-password-error" : undefined}
                                    className={`premium-input w-full pr-12 ${passwordError ? "border-red-500/60 focus:border-red-400" : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] cursor-pointer transition-all duration-200 hover:scale-110 active:scale-90"
                                >
                                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                                </button>
                            </div>
                            {passwordError ? (
                                <p id="forgot-password-error" className={FIELD_ERROR_CLASSES} role="alert">
                                    {passwordError}
                                </p>
                            ) : null}
                        </div>
                        <ul
                            id="reset-password-requirements"
                            className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 space-y-1.5 text-xs text-neutral-500 list-none"
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
                        <div className="relative flex flex-col gap-2">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(""); setConfirmPasswordError(""); }}
                                placeholder={t("Confirm New Password")}
                                required
                                aria-invalid={Boolean(confirmPasswordError)}
                                aria-describedby={confirmPasswordError ? "forgot-confirm-password-error" : undefined}
                                className={`premium-input w-full ${confirmPasswordError ? "border-red-500/60 focus:border-red-400" : ""}`}
                            />
                            {confirmPasswordError ? (
                                <p id="forgot-confirm-password-error" className={FIELD_ERROR_CLASSES} role="alert">
                                    {confirmPasswordError}
                                </p>
                            ) : null}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full mt-2"
                        >
                            {isLoading ? <LoadingSpinner /> : <>{t("Reset Password")} <ArrowRightIcon /></>}
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
                            {t("Go to Sign In")} <ArrowRightIcon />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
