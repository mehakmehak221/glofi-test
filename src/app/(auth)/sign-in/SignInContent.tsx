"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import UserTypeToggle from "@/components/auth/UserTypeToggle";
import RoleInsightCallout from "@/components/auth/RoleInsightCallout";
import { ChevronLeftIcon, EyeOpenIcon, EyeClosedIcon, LoadingSpinner } from "@/components/VectorImages";
import { useLoginMutation } from "@/store/api/authApi";
import { setCookie } from "@/utils/cookieUtils";
import { applySignInApiErrors, FIELD_ERROR_CLASSES, validateSignInFields } from "@/utils/authFormErrors";
import { useI18n } from "@/providers/LocaleProvider";

const SIGNIN_ROLES = ["Investor", "Developer", "Agent"] as const;
type SigninRole = (typeof SIGNIN_ROLES)[number];

function parseRoleQuery(raw: string | null): SigninRole | null {
    if (!raw) return null;
    const t = raw.trim();
    return SIGNIN_ROLES.find((r) => r.toLowerCase() === t.toLowerCase()) ?? null;
}

function SignInPageContent() {
    const router = useRouter();
    const { t } = useI18n();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get("role");
    const [userType, setUserType] = useState<string>(() => parseRoleQuery(roleParam) ?? "Investor");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        const next = parseRoleQuery(roleParam);
        if (next) {
            setTimeout(() => {
                setUserType(next);
            }, 0);
        }
    }, [roleParam]);

    useEffect(() => {
        if (errorMsg || emailError || passwordError) {
            const firstError = document.querySelector('[role="alert"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [errorMsg, emailError, passwordError]);

    const handleUserTypeChange = (next: string) => {
        if (next === userType) return;
        setUserType(next);
        setEmail("");
        setPassword("");
        setEmailError("");
        setPasswordError("");
        setErrorMsg("");
        setShowPassword(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");
        const { emailError: nextEmailErr, passwordError: nextPassErr } = validateSignInFields(email, password);
        setEmailError(nextEmailErr);
        setPasswordError(nextPassErr);
        if (nextEmailErr || nextPassErr) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        try {
            const trimmedEmail = email.trim();
            const payload = {
                email: trimmedEmail,
                password,
                role: userType === "Developer" ? "PARTNER" : userType.toUpperCase(),
            };

            console.log('Login Request Payload:', JSON.stringify(payload, null, 2));

            const result = await login(payload).unwrap();

            console.log('Login Result:', result);

            // Cover all possible response shapes from the API
            const token =
                result?.accessToken ||
                result?.token ||
                result?.access_token ||
                result?.data?.accessToken ||
                result?.data?.token ||
                result?.data?.access_token;

            // Always store credentials before navigating
            if (token) {
                setCookie("access_token", token);
                localStorage.setItem("access_token", token);
            }

            const userRole = result?.role || result?.user?.role || result?.data?.role || userType.toUpperCase();
            localStorage.setItem("userType", userRole);
            localStorage.setItem("isLoggedIn", "true");
            setCookie("isLoggedIn", "true");

            localStorage.setItem("toastMessage", "Login successful!");

            // Use window.location.href to do a full page navigation so the proxy
            // picks up the freshly set cookie on the new request
            window.location.href = "/dashboard";
        } catch (err: any) {
            const errorBody = err?.data;
            const message = errorBody?.message ?? errorBody?.error ?? err?.message;
            console.error(
                "Login Error Details:",
                JSON.stringify(
                    {
                        status: err?.status || "Unknown Status",
                        data: errorBody || "No Data",
                        message: message || "No Message",
                    },
                    null,
                    2
                )
            );
            applySignInApiErrors(err, undefined, {
                setEmailError,
                setPasswordError,
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
                className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-sm transition-colors mb-8 group"
            >
                <ChevronLeftIcon className="group-hover:-translate-x-0.5 transition-transform font-montserrat" />
                {t("Back to home")}
            </Link>


            <div className="mb-8">
                <h2 className="text-neutral-900 font-bold text-3xl mb-2 font-montserrat">{t("Welcome")}</h2>
                <p className="text-neutral-500 text-sm font-montserrat">
                    {t("Don't have an account?")}{" "}
                    <Link
                        href={`/sign-up?role=${encodeURIComponent(userType)}`}
                        className="text-[var(--color-primary-500)] font-semibold hover:text-[var(--color-primary-600)] transition-colors"
                    >
                        {t("Create Account")}
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
            </div>

            <div className="mb-4 space-y-4">
                <Suspense fallback={<div className="h-10 w-full animate-pulse bg-white/5 rounded-lg" />}>
                    <SearchParamsHandler setErrorMsg={setErrorMsg} />
                </Suspense>
                <UserTypeToggle value={userType} onChange={handleUserTypeChange} />
                <RoleInsightCallout role={userType} />
            </div>

            <form
                noValidate
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 font-montserrat rounded-2xl border border-neutral-200 bg-white shadow-sm p-5 sm:p-6"
            >
                <div className="flex flex-col gap-2">
                    <label htmlFor="sign-in-email" className="text-sm font-medium text-neutral-900 font-montserrat">
                        {t("Email Address")}
                    </label>
                    <input
                        id="sign-in-email"
                        type="email"
                        inputMode="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrorMsg("");
                            setEmailError("");
                        }}
                        placeholder="example@gmail.com"
                        autoComplete="email"
                        aria-invalid={Boolean(emailError)}
                        aria-describedby={emailError ? "sign-in-email-error" : undefined}
                        className={`premium-input w-full ${emailError ? "border-red-500/60 focus:border-red-400" : ""}`}
                    />
                    {emailError ? (
                        <p id="sign-in-email-error" className={FIELD_ERROR_CLASSES} role="alert">
                            {emailError}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="sign-in-password" className="text-sm font-medium text-neutral-900 font-montserrat">
                        {t("Password")}
                    </label>
                    <div className="relative">
                        <input
                            id="sign-in-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrorMsg("");
                                setPasswordError("");
                            }}
                            autoComplete="current-password"
                            aria-invalid={Boolean(passwordError)}
                            aria-describedby={passwordError ? "sign-in-password-error" : undefined}
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
                    {passwordError ? (
                        <p id="sign-in-password-error" className={FIELD_ERROR_CLASSES} role="alert">
                            {passwordError}
                        </p>
                    ) : null}
                </div>

                <div className="flex justify-end -mt-1">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-[var(--color-primary-500)] font-semibold hover:text-[var(--color-primary-600)] transition-colors"
                    >
                        {t("Forgot Password?")}
                    </Link>
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full mt-1 justify-center font-bold">
                    {isLoading ? <LoadingSpinner /> : t("Login")}
                </button>
            </form>

            <p className="text-center text-xs text-neutral-500 mt-8 font-montserrat leading-relaxed px-1">
                {t("By clicking Login you agree to GloFi Estates")}{" "}
                <Link href="/terms" className="text-neutral-600 hover:text-neutral-900 underline-offset-2 hover:underline">
                    {t("Terms & Conditions")}
                </Link>{" "}
                {t("and")}{" "}
                <Link href="/privacy-policy" className="text-neutral-600 hover:text-neutral-900 underline-offset-2 hover:underline">
                    {t("Privacy Policy")}
                </Link>
                .
            </p>
        </motion.div>
    );
}
function SearchParamsHandler({ setErrorMsg }: { setErrorMsg: (msg: string) => void }) {
    const searchParams = useSearchParams();
    const message = searchParams.get("message");
    const [displayed, setDisplayed] = useState(false);

    useEffect(() => {
        if (message && !displayed) {
            // We use a success-styled box even if we call it errorMsg state for simplicity, 
            // or we could add a successMsg state.
            // But let's just show it in a green box if possible.
            setTimeout(() => {
                setDisplayed(true);
            }, 0);
        }
    }, [message, displayed]);

    if (!message) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium"
        >
            {message}
        </motion.div>
    );
}

function SignInPageFallback() {
    return (
        <div className="flex flex-col gap-6 min-h-[40vh] justify-center font-montserrat" aria-hidden>
            <div className="rounded-lg bg-neutral-100 border border-neutral-200 h-10 w-40 animate-pulse" />
            <div className="rounded-lg bg-neutral-100 border border-neutral-200 h-24 w-full max-w-md animate-pulse" />
            <div className="rounded-lg bg-neutral-100 border border-neutral-200 h-56 w-full max-w-md animate-pulse" />
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={<SignInPageFallback />}>
            <SignInPageContent />
        </Suspense>
    );
}