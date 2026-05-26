"use client";

import { startTransition, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import UserTypeToggle from "@/components/auth/UserTypeToggle";
import RoleInsightCallout from "@/components/auth/RoleInsightCallout";
import { ChevronLeftIcon, LoadingSpinner, EyeOpenIcon, EyeClosedIcon } from "@/components/VectorImages";
import {
    useRegisterMutation,
    useRegisterAgentMutation,
    useSendRegistrationOtpMutation,
    useVerifyRegistrationOtpMutation,
} from "@/store/api/authApi";
import { setCookie } from "@/utils/cookieUtils";
import {
    applySignUpApiErrors,
    FIELD_ERROR_CLASSES,
    formatResendCooldownMessage,
    getSignUpPasswordCriteria,
    isValidOtp,
    normalizeOtpInput,
    validateSignUpFields,
} from "@/utils/authFormErrors";

const SIGNUP_ROLES = ["Investor", "Partner", "Agent"] as const;
type SignupRole = (typeof SIGNUP_ROLES)[number];
type SignUpStep = "DETAILS" | "OTP";

function parseRoleQuery(raw: string | null): SignupRole | null {
    if (!raw) return null;
    const t = raw.trim();
    return SIGNUP_ROLES.find((r) => r.toLowerCase() === t.toLowerCase()) ?? null;
}

function SignUpPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get("role");
    const [userType, setUserType] = useState<SignupRole>(() => parseRoleQuery(roleParam) ?? "Investor");
    const [step, setStep] = useState<SignUpStep>("DETAILS");
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        const next = parseRoleQuery(roleParam);
        if (!next) return;
        startTransition(() => {
            setUserType((current) => (current === next ? current : next));
        });
    }, [roleParam]);
    const [form, setForm] = useState({ 
        name: "", 
        email: "", 
        password: "", 
        confirmPassword: "",
        referredByCode: "",
        reraNumber: "",
        expiryDate: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [reraError, setReraError] = useState("");
    const [expiryError, setExpiryError] = useState("");
    const [referralError, setReferralError] = useState("");

    const [sendRegistrationOtp, { isLoading: isSendingOtp }] = useSendRegistrationOtpMutation();
    const [verifyRegistrationOtp, { isLoading: isVerifyingOtp }] = useVerifyRegistrationOtpMutation();
    const [register, { isLoading: isRegistering }] = useRegisterMutation();
    const [registerAgent, { isLoading: isAgentRegistering }] = useRegisterAgentMutation();
    const isLoading = isSendingOtp || isVerifyingOtp || isRegistering || isAgentRegistering;

    const handleUserTypeChange = (next: string) => {
        const nextRole = SIGNUP_ROLES.includes(next as SignupRole) ? (next as SignupRole) : null;
        if (!nextRole || nextRole === userType) return;
        setUserType(nextRole);
        setForm({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            referredByCode: "",
            reraNumber: "",
            expiryDate: "",
        });
        setErrorMsg("");
        setNameError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
        setReraError("");
        setExpiryError("");
        setReferralError("");
        setShowPassword(false);
        setShowConfirmPassword(false);
        setStep("DETAILS");
        setOtp("");
        setOtpError("");
        setSuccessMsg("");
    };

    const clearFieldError = (k: keyof typeof form) => {
        setErrorMsg("");
        switch (k) {
            case "name":
                setNameError("");
                break;
            case "email":
                setEmailError("");
                break;
            case "password":
                setPasswordError("");
                setConfirmPasswordError("");
                break;
            case "confirmPassword":
                setConfirmPasswordError("");
                break;
            case "reraNumber":
                setReraError("");
                break;
            case "expiryDate":
                setExpiryError("");
                break;
            case "referredByCode":
                setReferralError("");
                break;
            default:
                break;
        }
    };

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((p) => ({ ...p, [k]: e.target.value }));
        clearFieldError(k);
    };

    const completeRegistration = (result: Record<string, unknown>) => {
        const token =
            (result?.accessToken as string | undefined) ||
            (result?.token as string | undefined) ||
            ((result?.data as Record<string, unknown> | undefined)?.accessToken as string | undefined) ||
            ((result?.data as Record<string, unknown> | undefined)?.token as string | undefined) ||
            ((result?.agent as Record<string, unknown> | undefined)?.token as string | undefined);

        if (token) {
            setCookie("access_token", token);
            localStorage.setItem("access_token", token);
            localStorage.setItem("isLoggedIn", "true");
            setCookie("isLoggedIn", "true");
            const role =
                ((result?.agent as Record<string, unknown> | undefined)?.role as string | undefined) ||
                (result?.role as string | undefined) ||
                userType.toUpperCase();
            localStorage.setItem("userType", role);
            router.push("/onboarding");
        } else {
            router.push(`/sign-in?message=Registration successful. Please sign in.&role=${encodeURIComponent(userType)}`);
        }
    };

    const sendOtpForRegistration = async () => {
        const trimmedEmail = form.email.trim();
        await sendRegistrationOtp({
            fullName: form.name.trim(),
            email: trimmedEmail,
            password: form.password,
            role: userType.toUpperCase(),
            ...(form.referredByCode.trim() ? { referralCode: form.referredByCode.trim() } : {}),
        }).unwrap();
        setOtp("");
        setOtpError("");
        setSuccessMsg(`We sent a 6-digit code to ${trimmedEmail}.`);
        setStep("OTP");
    };

    const handleResendOtp = async () => {
        setErrorMsg("");
        setOtpError("");
        setSuccessMsg("");
        try {
            await sendOtpForRegistration();
        } catch (err: unknown) {
            const apiErr = err as { status?: number; data?: { message?: string; retryAfterSeconds?: number } };
            if (apiErr?.status === 429) {
                setErrorMsg(formatResendCooldownMessage(apiErr.data?.retryAfterSeconds));
            } else {
                applySignUpApiErrors(apiErr, {
                    setNameError,
                    setEmailError,
                    setPasswordError,
                    setReraError,
                    setExpiryError,
                    setReferralError,
                    setConfirmPasswordError,
                    setOtpError,
                    setErrorMsg,
                });
            }
        }
    };

    const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        setNameError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
        setReraError("");
        setExpiryError("");
        setReferralError("");
        setOtpError("");

        const trimmedName = form.name.trim();
        const trimmedEmail = form.email.trim();
        const trimmedReraNumber = form.reraNumber.trim();

        const {
            nameError: nextNameErr,
            emailError: nextEmailErr,
            passwordError: nextPassErr,
            confirmPasswordError: nextConfirmErr,
            reraError: nextReraErr,
            expiryError: nextExpiryErr,
            referralError: nextReferralErr,
        } = validateSignUpFields(form, userType);
        setNameError(nextNameErr);
        setEmailError(nextEmailErr);
        setPasswordError(nextPassErr);
        setConfirmPasswordError(nextConfirmErr);
        setReraError(nextReraErr);
        setExpiryError(nextExpiryErr);
        setReferralError(nextReferralErr);
        if (nextNameErr || nextEmailErr || nextPassErr || nextConfirmErr || nextReraErr || nextExpiryErr || nextReferralErr) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        try {
            if (userType === "Agent") {
                const result = await registerAgent({
                    fullName: trimmedName,
                    email: trimmedEmail,
                    password: form.password,
                    reraNumber: trimmedReraNumber,
                    expiryDate: form.expiryDate,
                }).unwrap();
                completeRegistration(result);
                return;
            }

            await sendOtpForRegistration();
        } catch (err: unknown) {
            const apiErr = err as { status?: number; data?: { message?: string; retryAfterSeconds?: number } };
            if (apiErr?.status === 429) {
                setErrorMsg(formatResendCooldownMessage(apiErr.data?.retryAfterSeconds));
            } else {
                applySignUpApiErrors(apiErr, {
                    setNameError,
                    setEmailError,
                    setPasswordError,
                    setReraError,
                    setExpiryError,
                    setReferralError,
                    setConfirmPasswordError,
                    setOtpError,
                    setErrorMsg,
                });
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");
        setOtpError("");
        setSuccessMsg("");

        const normalizedOtp = normalizeOtpInput(otp);
        setOtp(normalizedOtp);

        if (!isValidOtp(normalizedOtp)) {
            setOtpError("Please enter the 6-digit code from your email.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const trimmedEmail = form.email.trim();

        try {
            await verifyRegistrationOtp({ email: trimmedEmail, otp: normalizedOtp }).unwrap();
            const result = await register({ email: trimmedEmail, otp: normalizedOtp }).unwrap();
            completeRegistration(result);
        } catch (err: unknown) {
            applySignUpApiErrors(err as { status?: number; data?: unknown; message?: string }, {
                setNameError,
                setEmailError,
                setPasswordError,
                setReraError,
                setExpiryError,
                setReferralError,
                setConfirmPasswordError,
                setOtpError,
                setErrorMsg,
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col"
        >
            <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-white text-sm transition-colors mb-8 group"
            >
                <ChevronLeftIcon className="group-hover:-translate-x-0.5 transition-transform font-montserrat" />
                Back to home
            </Link>

            <div className="mb-8">
                <h2 className="text-white font-bold text-3xl mb-2 font-montserrat">Welcome</h2>
                <p className="text-[var(--color-text-secondary)] text-sm font-montserrat">
                    Already have an account?{" "}
                    <Link href={`/sign-in?role=${encodeURIComponent(userType)}`} className="text-[var(--color-primary-300)] font-semibold hover:text-[var(--color-primary-100)] transition-colors">
                        Sign in
                    </Link>
                </p>
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium space-y-2"
                        role="alert"
                    >
                        {errorMsg.split(/\n\n+/).map((block, idx) => (
                            <p key={idx} className="leading-relaxed">
                                {block}
                            </p>
                        ))}
                    </motion.div>
                )}
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
                        role="status"
                    >
                        {successMsg}
                    </motion.div>
                )}
            </div>


            <motion.div className="mb-4 space-y-4">
                <UserTypeToggle value={userType} onChange={handleUserTypeChange} />
                <RoleInsightCallout role={userType} />
            </motion.div>

            {step === "OTP" ? (
                <form
                    noValidate
                    onSubmit={handleOtpSubmit}
                    className="flex flex-col gap-4 font-montserrat rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-subtle)]/60 p-5 sm:p-6"
                >
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                        Enter the verification code sent to{" "}
                        <span className="text-white font-medium">{form.email.trim()}</span>
                    </p>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="sign-up-otp" className="text-sm font-medium text-white font-montserrat">
                            Verification code
                        </label>
                        <input
                            id="sign-up-otp"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={otp}
                            onChange={(e) => {
                                setOtp(normalizeOtpInput(e.target.value));
                                setOtpError("");
                                setErrorMsg("");
                            }}
                            placeholder="000000"
                            maxLength={6}
                            aria-invalid={Boolean(otpError)}
                            aria-describedby={otpError ? "sign-up-otp-error" : undefined}
                            className={`premium-input w-full text-center tracking-[0.4em] text-lg ${otpError ? "border-red-500/60 focus:border-red-400" : ""}`}
                        />
                        {otpError ? (
                            <p id="sign-up-otp-error" className={FIELD_ERROR_CLASSES} role="alert">
                                {otpError}
                            </p>
                        ) : null}
                    </div>
                    <button type="submit" disabled={isLoading} className="btn-primary w-full mt-1 justify-center font-bold">
                        {isLoading ? <LoadingSpinner /> : "Verify & Create Account"}
                    </button>
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors text-center disabled:opacity-50"
                    >
                        Didn&apos;t receive a code? Resend
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setStep("DETAILS");
                            setOtp("");
                            setOtpError("");
                            setSuccessMsg("");
                            setErrorMsg("");
                        }}
                        disabled={isLoading}
                        className="text-sm text-[var(--color-primary-300)] hover:text-[var(--color-primary-100)] transition-colors text-center disabled:opacity-50"
                    >
                        Back to account details
                    </button>
                </form>
            ) : (
            <form
                noValidate
                onSubmit={handleDetailsSubmit}
                className="flex flex-col gap-4 font-montserrat rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-subtle)]/60 p-5 sm:p-6"
            >
                <div className="flex flex-col gap-2">
                    <label htmlFor="sign-up-name" className="text-sm font-medium text-white font-montserrat">
                        Full Name
                    </label>
                    <input
                        id="sign-up-name"
                        type="text"
                        value={form.name}
                        onChange={set("name")}
                        placeholder="John Doe"
                        autoComplete="name"
                        aria-invalid={Boolean(nameError)}
                        aria-describedby={nameError ? "sign-up-name-error" : undefined}
                        className={`premium-input w-full ${nameError ? "border-red-500/60 focus:border-red-400" : ""}`}
                    />
                    {nameError ? (
                        <p id="sign-up-name-error" className={FIELD_ERROR_CLASSES} role="alert">
                            {nameError}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="sign-up-email" className="text-sm font-medium text-white font-montserrat">
                        Email Address
                    </label>
                    <input
                        id="sign-up-email"
                        type="email"
                        inputMode="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="example@gmail.com"
                        autoComplete="email"
                        aria-invalid={Boolean(emailError)}
                        aria-describedby={emailError ? "sign-up-email-error" : undefined}
                        className={`premium-input w-full ${emailError ? "border-red-500/60 focus:border-red-400" : ""}`}
                    />
                    {emailError ? (
                        <p id="sign-up-email-error" className={FIELD_ERROR_CLASSES} role="alert">
                            {emailError}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="sign-up-password" className="text-sm font-medium text-white font-montserrat">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="sign-up-password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={set("password")}
                            autoComplete="new-password"
                            aria-invalid={Boolean(passwordError)}
                            aria-describedby={
                                [passwordError ? "sign-up-password-error" : null, "sign-up-password-requirements"]
                                    .filter(Boolean)
                                    .join(" ") || undefined
                            }
                            className={`premium-input w-full pr-12 ${passwordError ? "border-red-500/60 focus:border-red-400" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                        </button>
                    </div>
                    <ul
                        id="sign-up-password-requirements"
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 space-y-1.5 text-xs text-[var(--color-text-secondary)] list-none"
                        aria-label="Password requirements"
                        aria-live="polite"
                    >
                        {getSignUpPasswordCriteria(form.password).map(({ id, label, met }) => (
                            <li key={id} className={`flex items-start gap-2 ${met ? "text-emerald-400/95" : ""}`}>
                                <span className="mt-0.5 w-3.5 shrink-0 text-center" aria-hidden>
                                    {met ? "✓" : "○"}
                                </span>
                                <span>{label}</span>
                            </li>
                        ))}
                    </ul>
                    {passwordError ? (
                        <p id="sign-up-password-error" className={FIELD_ERROR_CLASSES} role="alert">
                            {passwordError}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="sign-up-confirm-password" className="text-sm font-medium text-white font-montserrat">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            id="sign-up-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={set("confirmPassword")}
                            autoComplete="new-password"
                            aria-invalid={Boolean(confirmPasswordError)}
                            aria-describedby={confirmPasswordError ? "sign-up-confirm-password-error" : undefined}
                            className={`premium-input w-full pr-12 ${confirmPasswordError ? "border-red-500/60 focus:border-red-400" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                            {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                        </button>
                    </div>
                    {confirmPasswordError ? (
                        <p id="sign-up-confirm-password-error" className={FIELD_ERROR_CLASSES} role="alert">
                            {confirmPasswordError}
                        </p>
                    ) : null}
                </div>

                {userType === "Agent" ? (
                    <>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="sign-up-rera" className="text-sm font-medium text-white font-montserrat">
                                RERA Number
                            </label>
                            <input
                                id="sign-up-rera"
                                type="text"
                                value={form.reraNumber}
                                onChange={set("reraNumber")}
                                placeholder="RERA-MH-2024-001234"
                                aria-invalid={Boolean(reraError)}
                                aria-describedby={reraError ? "sign-up-rera-error" : undefined}
                                className={`premium-input w-full ${reraError ? "border-red-500/60 focus:border-red-400" : ""}`}
                            />
                            {reraError ? (
                                <p id="sign-up-rera-error" className={FIELD_ERROR_CLASSES} role="alert">
                                    {reraError}
                                </p>
                            ) : null}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="sign-up-rera-expiry" className="text-sm font-medium text-white font-montserrat">
                                RERA Expiry Date
                            </label>
                            <input
                                id="sign-up-rera-expiry"
                                type="date"
                                value={form.expiryDate}
                                onChange={set("expiryDate")}
                                aria-invalid={Boolean(expiryError)}
                                aria-describedby={expiryError ? "sign-up-rera-expiry-error" : undefined}
                                className={`premium-input w-full ${expiryError ? "border-red-500/60 focus:border-red-400" : ""}`}
                            />
                            {expiryError ? (
                                <p id="sign-up-rera-expiry-error" className={FIELD_ERROR_CLASSES} role="alert">
                                    {expiryError}
                                </p>
                            ) : null}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col gap-2">
                        <label htmlFor="sign-up-referral" className="text-sm font-medium text-white font-montserrat">
                            Referral Code <span className="text-[var(--color-text-secondary)] font-normal">(Optional)</span>
                        </label>
                        <input
                            id="sign-up-referral"
                            type="text"
                            value={form.referredByCode}
                            onChange={set("referredByCode")}
                            placeholder="Enter code if you have one"
                            aria-invalid={Boolean(referralError)}
                            aria-describedby={referralError ? "sign-up-referral-error" : undefined}
                            className={`premium-input w-full ${referralError ? "border-red-500/60 focus:border-red-400" : ""}`}
                        />
                        {referralError ? (
                            <p id="sign-up-referral-error" className={FIELD_ERROR_CLASSES} role="alert">
                                {referralError}
                            </p>
                        ) : null}
                    </div>
                )}

                <button type="submit" disabled={isLoading} className="btn-primary w-full mt-1 justify-center font-bold">
                    {isLoading ? <LoadingSpinner /> : userType === "Agent" ? "Create Account" : "Continue"}
                </button>
            </form>
            )}

            <p className="text-center text-xs text-[var(--color-text-muted)] mt-8 font-montserrat leading-relaxed px-1">
                By clicking Create Account you agree to GloFi Estate&apos;s{" "}
                <Link href="/terms" className="text-[var(--color-text-secondary)] hover:text-white underline-offset-2 hover:underline">
                    Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-[var(--color-text-secondary)] hover:text-white underline-offset-2 hover:underline">
                    Privacy Policy
                </Link>
                .
            </p>
        </motion.div>
    );
}

function SignUpPageFallback() {
    return (
        <div className="flex flex-col gap-6 min-h-[40vh] justify-center font-montserrat" aria-hidden>
            <div className="rounded-lg bg-white/[0.06] border border-white/10 h-10 w-40 animate-pulse" />
            <div className="rounded-lg bg-white/[0.06] border border-white/10 h-24 w-full max-w-md animate-pulse" />
            <div className="rounded-lg bg-white/[0.06] border border-white/10 h-56 w-full max-w-md animate-pulse" />
        </div>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<SignUpPageFallback />}>
            <SignUpPageContent />
        </Suspense>
    );
}
