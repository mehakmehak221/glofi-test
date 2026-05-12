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


export default function SignInPage() {
    const router = useRouter();
    const [userType, setUserType] = useState("Investor");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [login, { isLoading }] = useLoginMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            const trimmedEmail = email.trim();
            const payload = {
                email: trimmedEmail,
                password,
                role: userType.toUpperCase(),
            };

            console.log('Login Request Payload:', JSON.stringify(payload, null, 2));

            const result = await login(payload).unwrap();

            console.log('Login Result:', result);
            const token = result?.accessToken || result?.token || result?.data?.accessToken || result?.data?.token;

            if (token) {
                setCookie("access_token", token);
                localStorage.setItem("access_token", token);
            }

            localStorage.setItem("userType", result?.role || result?.user?.role || userType.toUpperCase());
            localStorage.setItem("isLoggedIn", "true");
            setCookie("isLoggedIn", "true");

            router.push("/dashboard");
        } catch (err: any) {
            const status = err?.status;
            const errorBody = err?.data;
            const message = errorBody?.message || errorBody?.error || err?.message;

            console.error("Login Error Details:", JSON.stringify({
                status: status || 'Unknown Status',
                data: errorBody || 'No Data',
                message: message || 'No Message'
            }, null, 2));

            if (status === 401) {
                setErrorMsg("Incorrect email or password. Please try again.");
            } else if (status === 403) {
                setErrorMsg("Access denied. Please check your account type (Investor/Partner/Agent).");
            } else if (status === 400) {
                setErrorMsg(message || "Invalid login request. Please check your credentials.");
            } else if (status === 404) {
                setErrorMsg("Account not found. Please check your email or sign up.");
            } else if (status === 'FETCH_ERROR') {
                setErrorMsg("Connecting to server failed. Please check your internet connection.");
            } else {
                setErrorMsg(message || "An unexpected error occurred. Please try again later.");
            }
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
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="text-[var(--color-primary-300)] font-semibold hover:text-[var(--color-primary-100)] transition-colors">
                        Sign up
                    </Link>
                </p>
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
                    >
                        {errorMsg}
                    </motion.div>
                )}
            </div>

            <div className="mb-4 space-y-4">
                <Suspense fallback={<div className="h-10 w-full animate-pulse bg-white/5 rounded-lg" />}>
                    <SearchParamsHandler setErrorMsg={setErrorMsg} />
                </Suspense>
                <UserTypeToggle value={userType} onChange={setUserType} />
                <RoleInsightCallout role={userType} />
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 font-montserrat rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-subtle)]/60 p-5 sm:p-6"
            >
                <div className="flex flex-col gap-2">
                    <label htmlFor="sign-in-email" className="text-sm font-medium text-white font-montserrat">
                        Email Address
                    </label>
                    <input
                        id="sign-in-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrorMsg("");
                        }}
                        placeholder="example@gmail.com"
                        required
                        autoComplete="email"
                        className="premium-input w-full"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="sign-in-password" className="text-sm font-medium text-white font-montserrat">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="sign-in-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrorMsg("");
                            }}
                            required
                            autoComplete="current-password"
                            className="premium-input w-full pr-12"
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
                </div>

                <div className="flex justify-end -mt-1">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-[var(--color-primary-300)] font-semibold hover:text-[var(--color-primary-100)] transition-colors"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full mt-1 justify-center font-bold">
                    {isLoading ? <LoadingSpinner /> : "Login"}
                </button>
            </form>

            <p className="text-center text-xs text-[var(--color-text-muted)] mt-8 font-montserrat leading-relaxed px-1">
                By clicking Login you agree to GloFi Estate&apos;s{" "}
                <Link href="/#terms" className="text-[var(--color-text-secondary)] hover:text-white underline-offset-2 hover:underline">
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
function SearchParamsHandler({ setErrorMsg }: { setErrorMsg: (msg: string) => void }) {
    const searchParams = useSearchParams();
    const message = searchParams.get("message");
    const [displayed, setDisplayed] = useState(false);

    useEffect(() => {
        if (message && !displayed) {
            // We use a success-styled box even if we call it errorMsg state for simplicity, 
            // or we could add a successMsg state.
            // But let's just show it in a green box if possible.
            setDisplayed(true);
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
