"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import UserTypeToggle from "@/components/auth/UserTypeToggle";
import { ChevronLeftIcon, EyeOpenIcon, EyeClosedIcon, LoadingSpinner, ArrowRightIcon } from "@/components/VectorImages";
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
                <h2 className="text-white font-bold text-3xl mb-1.5 font-montserrat">Welcome back</h2>
                <p className="text-[var(--color-text-secondary)] text-sm font-montserrat">Sign in to your dashboard</p>
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

            <div className="mb-6">
                <Suspense fallback={<div className="h-10 w-full animate-pulse bg-white/5 rounded-lg" />}>
                    <SearchParamsHandler setErrorMsg={setErrorMsg} />
                </Suspense>
                <UserTypeToggle value={userType} onChange={setUserType} />
            </div>


            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-montserrat">

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


                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                        placeholder="Password"
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


                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full mt-2"
                >
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            Sign In
                            <ArrowRightIcon />
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-[var(--color-text-secondary)] mt-8 font-montserrat">
                New here?{" "}
                <Link href="/sign-up" className="text-[var(--color-primary-300)] font-medium hover:text-[var(--color-primary-100)] transition-colors font-montserrat">
                    Create account
                </Link>
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
