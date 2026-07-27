"use client";

import { startTransition, Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { firebaseAuth, ensureFirebasePhoneAuthReady, isFirebasePhoneAuthEnabled } from "@/lib/firebase";
import UserTypeToggle from "@/components/auth/UserTypeToggle";
import RoleInsightCallout from "@/components/auth/RoleInsightCallout";
import { ChevronLeftIcon, LoadingSpinner, EyeOpenIcon, EyeClosedIcon } from "@/components/VectorImages";
import {
    useRegisterMutation,
    useRegisterAgentMutation,
    useSendRegistrationOtpMutation,
    useSendPhoneOtpMutation,
    useVerifyPhoneOtpMutation,
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

const SIGNUP_ROLES = ["Investor", "Developer", "Agent"] as const;
type SignupRole = (typeof SIGNUP_ROLES)[number];
type SignUpStep = "DETAILS" | "PHONE_OTP" | "OTP";

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

    // Email OTP state
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");

    // Phone OTP state
    const [phoneCode, setPhoneCode] = useState("");
    const [phoneCodeError, setPhoneCodeError] = useState("");
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
    const recaptchaAttemptRef = useRef(0);

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
        phone: "",
        password: "",
        confirmPassword: "",
        referredByCode: searchParams.get("ref") || "",
        reraNumber: "",
        expiryDate: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [reraError, setReraError] = useState("");
    const [expiryError, setExpiryError] = useState("");
    const [referralError, setReferralError] = useState("");

    const [sendRegistrationOtp, { isLoading: isSendingOtp }] = useSendRegistrationOtpMutation();
    const [sendPhoneOtp, { isLoading: isSendingPhoneOtp }] = useSendPhoneOtpMutation();
    const [verifyPhoneOtp, { isLoading: isVerifyingPhoneOtp }] = useVerifyPhoneOtpMutation();
    const [verifyRegistrationOtp, { isLoading: isVerifyingOtp }] = useVerifyRegistrationOtpMutation();
    const [register, { isLoading: isRegistering }] = useRegisterMutation();
    const [registerAgent, { isLoading: isAgentRegistering }] = useRegisterAgentMutation();
    const isLoading = isSendingOtp || isSendingPhoneOtp || isVerifyingPhoneOtp || isVerifyingOtp || isRegistering || isAgentRegistering;

    useEffect(() => {
        if (
            errorMsg ||
            nameError ||
            emailError ||
            phoneError ||
            passwordError ||
            confirmPasswordError ||
            reraError ||
            expiryError ||
            referralError ||
            otpError ||
            phoneCodeError
        ) {
            const firstError = document.querySelector('[role="alert"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [
        errorMsg,
        nameError,
        emailError,
        phoneError,
        passwordError,
        confirmPasswordError,
        reraError,
        expiryError,
        referralError,
        otpError,
        phoneCodeError,
    ]);

    const clearRecaptcha = () => {
        if (recaptchaVerifierRef.current) {
            try {
                recaptchaVerifierRef.current.clear();
            } catch (e) {
                console.error("Error clearing recaptcha verifier:", e);
            }
            recaptchaVerifierRef.current = null;
        }
        const mount = document.getElementById("recaptcha-mount");
        if (mount) {
            mount.innerHTML = "";
        }
    };

    const createRecaptchaVerifier = () => {
        if (!firebaseAuth) {
            throw new Error("Firebase Auth is not configured.");
        }

        clearRecaptcha();

        recaptchaAttemptRef.current += 1;
        const containerId = `recaptcha-container-${recaptchaAttemptRef.current}`;
        const mount = document.getElementById("recaptcha-mount");
        if (!mount) {
            throw new Error("reCAPTCHA mount point is missing.");
        }

        const container = document.createElement("div");
        container.id = containerId;
        mount.appendChild(container);

        const verifier = new RecaptchaVerifier(firebaseAuth, containerId, {
            size: "invisible",
            callback: () => { },
            "expired-callback": () => {
                clearRecaptcha();
            },
        });

        recaptchaVerifierRef.current = verifier;
        return verifier;
    };

    useEffect(() => {
        return () => { clearRecaptcha(); };
    }, []);


    const handleUserTypeChange = (next: string) => {
        const nextRole = SIGNUP_ROLES.includes(next as SignupRole) ? (next as SignupRole) : null;
        if (!nextRole || nextRole === userType) return;
        setUserType(nextRole);
        setForm({ name: "", email: "", phone: "", password: "", confirmPassword: "", referredByCode: searchParams.get("ref") || "", reraNumber: "", expiryDate: "" });
        setErrorMsg(""); setNameError(""); setEmailError(""); setPhoneError(""); setPasswordError("");
        setConfirmPasswordError(""); setReraError(""); setExpiryError(""); setReferralError("");
        setShowPassword(false); setShowConfirmPassword(false);
        setStep("DETAILS"); setOtp(""); setOtpError("");
        setPhoneCode(""); setPhoneCodeError(""); setConfirmationResult(null);
        setSuccessMsg(""); clearRecaptcha();
    };

    const clearFieldError = (k: keyof typeof form) => {
        setErrorMsg("");
        switch (k) {
            case "name": setNameError(""); break;
            case "email": setEmailError(""); break;
            case "phone": setPhoneError(""); break;
            case "password": setPasswordError(""); setConfirmPasswordError(""); break;
            case "confirmPassword": setConfirmPasswordError(""); break;
            case "reraNumber": setReraError(""); break;
            case "expiryDate": setExpiryError(""); break;
            case "referredByCode": setReferralError(""); break;
        }
    };

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (k === "name") value = value.replace(/[^a-zA-Z\u00C0-\u024F\u1E00-\u1EFF .'\\-\\s]/g, "");
        setForm((p) => ({ ...p, [k]: value }));
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
            localStorage.setItem("toastMessage", "Registration successful!");
            router.push("/onboarding");
        } else {
            router.push(`/sign-in?message=Registration successful. Please sign in.&role=${encodeURIComponent(userType)}`);
        }
    };


    const proceedToEmailOtpStep = (message?: string) => {
        setSuccessMsg(message ?? `We sent a 6-digit code to ${form.email.trim()}.`);
        setStep("OTP");
        clearRecaptcha();
    };

    const isRecoverableFirebasePhoneError = (err: unknown) => {
        const code = (err as { code?: string })?.code;

        return code === "auth/quota-exceeded";
    };

    const sendEmailOtp = async (transitionToOtpStep = true) => {
        const trimmedEmail = form.email.trim();
        const payload = {
            fullName: form.name.trim(),
            email: trimmedEmail,
            phone: form.phone.trim(),
            password: form.password,
            role: userType === "Developer" ? "PARTNER" : userType.toUpperCase(),
            ...(form.referredByCode.trim() ? { referralCode: form.referredByCode.trim() } : {}),
        };
        console.log("Sending registration OTP with payload:", payload);
        try {
            const result = await sendRegistrationOtp(payload).unwrap();
            console.log("sendRegistrationOtp success response:", result);
            setOtp("");
            setOtpError("");
            if (transitionToOtpStep) {
                setSuccessMsg(`We sent a 6-digit code to ${trimmedEmail}.`);
                setStep("OTP");
            }
        } catch (err) {
            console.error("sendRegistrationOtp failed error:", err);
            throw err;
        }
    };

    const initiatePhoneVerification = async () => {
        if (!firebaseAuth) return;

        // Clear any stale errors before starting phone verification
        setErrorMsg(""); setSuccessMsg(""); setPhoneCodeError("");

        await ensureFirebasePhoneAuthReady();

        const trimmedEmail = form.email.trim();
        console.log("Initiating phone verification for email:", trimmedEmail, "and phone:", form.phone.trim());


        const phoneData = await sendPhoneOtp({ email: trimmedEmail, phone: form.phone.trim() }).unwrap();
        console.log("Received phone number from backend:", phoneData);
        if (!phoneData.success) throw new Error("Could not retrieve phone number");

        console.log("Triggering Firebase SMS via signInWithPhoneNumber for:", phoneData.phone);
        try {
            const verifier = createRecaptchaVerifier();
            const result = await signInWithPhoneNumber(firebaseAuth, phoneData.phone, verifier);
            console.log("Firebase signInWithPhoneNumber success result:", result);
            setConfirmationResult(result);
            setPhoneCode("");
            setPhoneCodeError("");
            setSuccessMsg(`We sent a verification SMS to ${phoneData.phone}.`);
            setStep("PHONE_OTP");
        } catch (firebaseErr) {
            clearRecaptcha();
            console.error("Firebase signInWithPhoneNumber failed:", firebaseErr);
            throw firebaseErr;
        }
    };


    const verifyPhoneCode = async () => {
        if (!confirmationResult) throw new Error("No confirmation result — please resend.");

        const trimmedCode = phoneCode.trim();
        const credential = await confirmationResult.confirm(trimmedCode);
        const firebaseIdToken = await credential.user.getIdToken();

        await verifyPhoneOtp({ email: form.email.trim(), firebaseIdToken }).unwrap();
    };

    // ---------------------------------------------------------------------------
    // Resend email OTP handler (from OTP step)
    // ---------------------------------------------------------------------------
    const handleResendEmailOtp = async () => {
        setErrorMsg(""); setOtpError(""); setSuccessMsg("");
        try {
            await sendEmailOtp(true);
        } catch (err: unknown) {
            const apiErr = err as { status?: number; data?: { message?: string; retryAfterSeconds?: number } };
            if (apiErr?.status === 429) {
                setErrorMsg(formatResendCooldownMessage(apiErr.data?.retryAfterSeconds));
            } else {
                applySignUpApiErrors(apiErr, {
                    setNameError, setEmailError, setPhoneError, setPasswordError, setReraError,
                    setExpiryError, setReferralError, setConfirmPasswordError, setOtpError, setErrorMsg,
                });
            }
        }
    };

    // ---------------------------------------------------------------------------
    // Resend phone SMS handler (from PHONE_OTP step)
    // ---------------------------------------------------------------------------
    const handleResendPhoneSms = async () => {
        setErrorMsg(""); setPhoneCodeError(""); setSuccessMsg("");
        try {
            await initiatePhoneVerification();
        } catch (err: unknown) {
            const apiErr = err as { status?: number; data?: { message?: string } };
            setErrorMsg((apiErr?.data?.message) || "Failed to resend SMS. Please try again.");
        }
    };

    // ---------------------------------------------------------------------------
    // DETAILS form submit
    // ---------------------------------------------------------------------------
    const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg(""); setSuccessMsg("");
        setNameError(""); setEmailError(""); setPhoneError(""); setPasswordError(""); setConfirmPasswordError("");
        setReraError(""); setExpiryError(""); setReferralError(""); setOtpError("");

        const { nameError: n, emailError: em, phoneError: ph, passwordError: p, confirmPasswordError: cp, reraError: r, expiryError: ex, referralError: ref } =
            validateSignUpFields(form, userType);
        setNameError(n); setEmailError(em); setPhoneError(ph); setPasswordError(p); setConfirmPasswordError(cp);
        setReraError(r); setExpiryError(ex); setReferralError(ref);
        if (n || em || ph || p || cp || r || ex || ref) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }

        try {
            const canUseFirebasePhone = Boolean(isFirebasePhoneAuthEnabled && firebaseAuth);

            if (userType === "Agent") {
                const trimmedName = form.name.trim();
                const trimmedEmail = form.email.trim();
                const trimmedReraNumber = form.reraNumber.trim();
                const payload: Record<string, string> = { fullName: trimmedName, email: trimmedEmail, phone: form.phone.trim(), password: form.password };
                if (trimmedReraNumber) payload.reraNumber = trimmedReraNumber;
                if (form.expiryDate) payload.expiryDate = form.expiryDate;
                const result = await registerAgent(payload).unwrap();
                completeRegistration(result);
                return;
            }

            if (canUseFirebasePhone) {
                await sendEmailOtp(false);
                await initiatePhoneVerification();
            } else {
                await sendEmailOtp(true);
            }
        } catch (err: unknown) {
            console.error("handleDetailsSubmit caught error:", err);
            const apiErr = err as { status?: number; data?: { message?: string; retryAfterSeconds?: number } };
            const firebaseCode = (err as { code?: string })?.code;
            if (apiErr?.status === 429) {
                setErrorMsg(formatResendCooldownMessage(apiErr.data?.retryAfterSeconds));
            } else if (firebaseCode === "auth/unauthorized-domain") {
                setErrorMsg("Phone verification is not configured for this domain. Please contact support.");
            } else if (firebaseCode === "auth/quota-exceeded" || firebaseCode === "auth/operation-not-allowed") {
                setErrorMsg("SMS verification is temporarily unavailable. Please try again later.");
            } else if (firebaseCode === "auth/too-many-requests") {
                setErrorMsg("Too many attempts. This phone number has been temporarily blocked by Firebase due to too many request attempts. Please try again in a few minutes.");
            } else {
                const friendlyMsg = (apiErr?.data?.message) || (err instanceof Error ? err.message : "");
                applySignUpApiErrors(apiErr, {
                    setNameError, setEmailError, setPhoneError, setPasswordError, setReraError,
                    setExpiryError, setReferralError, setConfirmPasswordError, setOtpError, setErrorMsg,
                });
                if (!nameError && !emailError && !phoneError && !passwordError && !confirmPasswordError && !reraError && !expiryError && !referralError) {
                    setErrorMsg(friendlyMsg || "Failed to initiate phone verification. Please try again.");
                }
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePhoneOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg(""); setPhoneCodeError(""); setSuccessMsg("");

        const code = phoneCode.trim();
        if (code.length < 6) {
            setPhoneCodeError("Please enter the 6-digit SMS code.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        try {
            await verifyPhoneCode();
            proceedToEmailOtpStep(`Phone verified. Enter the verification code sent to ${form.email.trim()}.`);
        } catch (err: unknown) {
            const firebaseCode = (err as { code?: string })?.code;
            const apiErr = err as { status?: number; data?: { message?: string } };
            const msg = (apiErr?.data?.message) || (err instanceof Error ? err.message : "");

            // Firebase-specific code error handling
            if (
                firebaseCode === "auth/invalid-verification-code" ||
                firebaseCode === "auth/missing-verification-code" ||
                msg.toLowerCase().includes("invalid") ||
                msg.toLowerCase().includes("otp")
            ) {
                setPhoneCodeError("Wrong code. Please check the SMS and try again.");
            } else if (
                firebaseCode === "auth/code-expired" ||
                msg.toLowerCase().includes("expired")
            ) {
                setPhoneCodeError("This code has expired. Please request a new SMS.");
            } else if (firebaseCode === "auth/too-many-requests") {
                setErrorMsg("Too many attempts. Please wait a moment and try again.");
            } else {
                setErrorMsg(msg || "Phone verification failed. Please try again.");
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // ---------------------------------------------------------------------------
    // OTP (email) form submit
    // ---------------------------------------------------------------------------
    const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg(""); setOtpError(""); setSuccessMsg("");

        const normalizedOtp = normalizeOtpInput(otp);
        setOtp(normalizedOtp);

        if (!isValidOtp(normalizedOtp)) {
            setOtpError("Please enter the 6-digit code from your email.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        try {
            const result = await verifyRegistrationOtp({ email: form.email.trim(), otp: normalizedOtp }).unwrap();
            completeRegistration(result);
        } catch (err: unknown) {
            applySignUpApiErrors(err as { status?: number; data?: unknown; message?: string }, {
                setNameError, setEmailError, setPhoneError, setPasswordError, setReraError,
                setExpiryError, setReferralError, setConfirmPasswordError, setOtpError, setErrorMsg,
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
            {/* Invisible reCAPTCHA mount point */}
            <div id="recaptcha-mount" />

            <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-sm transition-colors mb-8 group"
            >
                <ChevronLeftIcon className="group-hover:-translate-x-0.5 transition-transform font-montserrat" />
                Back to home
            </Link>

            <div className="mb-8">
                <h2 className="text-neutral-900 font-bold text-3xl mb-2 font-montserrat">Welcome</h2>
                <p className="text-neutral-500 text-sm font-montserrat">
                    Already have an account?{" "}
                    <Link href={`/sign-in?role=${encodeURIComponent(userType)}`} className="text-[var(--color-primary-500)] font-semibold hover:text-[var(--color-primary-600)] transition-colors">
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
                            <p key={idx} className="leading-relaxed">{block}</p>
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

            {/* ---------------------------------------------------------------- */}
            {/* Step: PHONE_OTP — Firebase SMS verification                      */}
            {/* ---------------------------------------------------------------- */}
            {step === "PHONE_OTP" ? (
                <form
                    noValidate
                    onSubmit={handlePhoneOtpSubmit}
                    className="flex flex-col gap-4 font-montserrat rounded-2xl border border-neutral-200 bg-white shadow-sm p-5 sm:p-6"
                >
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-neutral-900">Phone Verification</p>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                            Enter the SMS code sent to your registered phone number.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="sign-up-phone-code" className="text-sm font-medium text-neutral-900 font-montserrat">
                            SMS Code
                        </label>
                        <input
                            id="sign-up-phone-code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={phoneCode}
                            onChange={(e) => {
                                setPhoneCode(normalizeOtpInput(e.target.value));
                                setPhoneCodeError("");
                                setErrorMsg("");
                            }}
                            placeholder="000000"
                            maxLength={6}
                            aria-invalid={Boolean(phoneCodeError)}
                            aria-describedby={phoneCodeError ? "sign-up-phone-code-error" : undefined}
                            className={`premium-input w-full text-center tracking-[0.4em] text-lg ${phoneCodeError ? "border-red-500/60 focus:border-red-400" : ""}`}
                        />
                        {phoneCodeError ? (
                            <p id="sign-up-phone-code-error" className={FIELD_ERROR_CLASSES} role="alert">
                                {phoneCodeError}
                            </p>
                        ) : null}
                    </div>
                    <button type="submit" disabled={isLoading} className="btn-primary w-full mt-1 justify-center font-bold">
                        {isLoading ? <LoadingSpinner /> : "Verify Phone"}
                    </button>
                    <button
                        type="button"
                        onClick={handleResendPhoneSms}
                        disabled={isLoading}
                        className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors text-center disabled:opacity-50"
                    >
                        Didn&apos;t receive an SMS? Resend
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setStep("DETAILS");
                            setPhoneCode(""); setPhoneCodeError(""); setSuccessMsg(""); setErrorMsg("");
                            clearRecaptcha();
                        }}
                        disabled={isLoading}
                        className="text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors text-center disabled:opacity-50"
                    >
                        Back to account details
                    </button>
                </form>

                /* ---------------------------------------------------------------- */
                /* Step: OTP — Email verification                                   */
                /* ---------------------------------------------------------------- */
            ) : step === "OTP" ? (
                <form
                    noValidate
                    onSubmit={handleOtpSubmit}
                    className="flex flex-col gap-4 font-montserrat rounded-2xl border border-neutral-200 bg-white shadow-sm p-5 sm:p-6"
                >
                    <p className="text-sm text-neutral-500 leading-relaxed">
                        Enter the verification code sent to{" "}
                        <span className="text-neutral-900 font-medium">{form.email.trim()}</span>
                    </p>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="sign-up-otp" className="text-sm font-medium text-neutral-900 font-montserrat">
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
                        onClick={handleResendEmailOtp}
                        disabled={isLoading}
                        className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors text-center disabled:opacity-50"
                    >
                        Didn&apos;t receive a code? Resend
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setStep("DETAILS");
                            setOtp(""); setOtpError(""); setSuccessMsg(""); setErrorMsg("");
                        }}
                        disabled={isLoading}
                        className="text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors text-center disabled:opacity-50"
                    >
                        Back to account details
                    </button>
                </form>

                /* ---------------------------------------------------------------- */
                /* Step: DETAILS — Account details form                             */
                /* ---------------------------------------------------------------- */
            ) : (
                <form
                    noValidate
                    onSubmit={handleDetailsSubmit}
                    className="flex flex-col gap-4 font-montserrat rounded-2xl border border-neutral-200 bg-white shadow-sm p-5 sm:p-6"
                >
                    <div className="flex flex-col gap-2">
                        <label htmlFor="sign-up-name" className="text-sm font-medium text-neutral-900 font-montserrat">
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
                            <p id="sign-up-name-error" className={FIELD_ERROR_CLASSES} role="alert">{nameError}</p>
                        ) : null}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="sign-up-email" className="text-sm font-medium text-neutral-900 font-montserrat">
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
                            <p id="sign-up-email-error" className={FIELD_ERROR_CLASSES} role="alert">{emailError}</p>
                        ) : null}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="sign-up-phone" className="text-sm font-medium text-neutral-900 font-montserrat">
                            Phone Number
                        </label>
                        <PhoneInput
                            id="sign-up-phone"
                            placeholder=" 1234567890"
                            defaultCountry="IN"
                            value={form.phone}
                            onChange={(val) => {
                                setForm((p) => ({ ...p, phone: val || "" }));
                                setPhoneError("");
                                setErrorMsg("");
                            }}
                            className={`premium-phone-container w-full ${phoneError ? "border-red-500/60 focus-within:border-red-400" : ""}`}
                        />
                        {phoneError ? (
                            <p id="sign-up-phone-error" className={FIELD_ERROR_CLASSES} role="alert">{phoneError}</p>
                        ) : null}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="sign-up-password" className="text-sm font-medium text-neutral-900 font-montserrat">
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
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] cursor-pointer transition-all duration-200 hover:scale-110 active:scale-90"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </button>
                        </div>
                        <ul
                            id="sign-up-password-requirements"
                            className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 space-y-1.5 text-xs text-neutral-500 list-none"
                            aria-label="Password requirements"
                            aria-live="polite"
                        >
                            {getSignUpPasswordCriteria(form.password).map(({ id, label, met }) => (
                                <li key={id} className={`flex items-start gap-2 ${met ? "text-emerald-400/95" : ""}`}>
                                    <span className="mt-0.5 w-3.5 shrink-0 text-center" aria-hidden>{met ? "✓" : "○"}</span>
                                    <span>{label}</span>
                                </li>
                            ))}
                        </ul>
                        {passwordError ? (
                            <p id="sign-up-password-error" className={FIELD_ERROR_CLASSES} role="alert">{passwordError}</p>
                        ) : null}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="sign-up-confirm-password" className="text-sm font-medium text-neutral-900 font-montserrat">
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
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] cursor-pointer transition-all duration-200 hover:scale-110 active:scale-90"
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            >
                                {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </button>
                        </div>
                        {confirmPasswordError ? (
                            <p id="sign-up-confirm-password-error" className={FIELD_ERROR_CLASSES} role="alert">{confirmPasswordError}</p>
                        ) : null}
                    </div>

                    {userType === "Agent" ? (
                        <>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="sign-up-rera" className="text-sm font-medium text-neutral-900 font-montserrat">
                                    RERA Number <span className="text-neutral-500 font-normal">(Optional)</span>
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
                                    <p id="sign-up-rera-error" className={FIELD_ERROR_CLASSES} role="alert">{reraError}</p>
                                ) : null}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="sign-up-rera-expiry" className="text-sm font-medium text-neutral-900 font-montserrat">
                                    RERA Expiry Date <span className="text-neutral-500 font-normal">(Optional)</span>
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
                                    <p id="sign-up-rera-expiry-error" className={FIELD_ERROR_CLASSES} role="alert">{expiryError}</p>
                                ) : null}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <label htmlFor="sign-up-referral" className="text-sm font-medium text-neutral-900 font-montserrat">
                                Referral Code <span className="text-neutral-500 font-normal">(Optional)</span>
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
                                <p id="sign-up-referral-error" className={FIELD_ERROR_CLASSES} role="alert">{referralError}</p>
                            ) : null}
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className="btn-primary w-full mt-1 justify-center font-bold">
                        {isLoading ? <LoadingSpinner /> : userType === "Agent" ? "Create Account" : "Continue"}
                    </button>
                </form>
            )}

            <p className="text-center text-xs text-neutral-500 mt-8 font-montserrat leading-relaxed px-1">
                By clicking Create Account you agree to GloFi Estates{" "}
                <Link href="/terms" className="text-neutral-600 hover:text-neutral-900 underline-offset-2 hover:underline">
                    Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-neutral-600 hover:text-neutral-900 underline-offset-2 hover:underline">
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
            <div className="rounded-lg bg-neutral-100 border border-neutral-200 h-10 w-40 animate-pulse" />
            <div className="rounded-lg bg-neutral-100 border border-neutral-200 h-24 w-full max-w-md animate-pulse" />
            <div className="rounded-lg bg-neutral-100 border border-neutral-200 h-56 w-full max-w-md animate-pulse" />
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
