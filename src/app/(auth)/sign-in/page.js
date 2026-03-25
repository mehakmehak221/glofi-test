"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

    const handleSubmit = async (e) => {
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
            const token = result.accessToken || result.token || result.data?.accessToken || result.data?.token;

            if (token) {
                setCookie("access_token", token);
                localStorage.setItem("access_token", token);
            }

            localStorage.setItem("userType", result.role || result.user?.role || userType.toUpperCase());
            localStorage.setItem("isLoggedIn", "true");
            setCookie("isLoggedIn", "true");

            router.push("/dashboard");
        } catch (err) {
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
                setErrorMsg("Access denied. Please check your account type (Investor/Partner).");
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
                        className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
                    >
                        {errorMsg}
                    </motion.div>
                )}
            </div>

            <div className="mb-6">
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
                        className="w-full rounded-md px-4 py-3.5 text-sm text-white placeholder-[var(--color-text-muted)] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] focus:outline-none focus:border-[var(--color-primary-100)]/60 focus:ring-2 focus:ring-[var(--color-primary-100)]/15 transition-all duration-200"
                    />
                </div>


                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                        placeholder="Password"
                        required
                        className="w-full rounded-md px-4 py-3.5 pr-12 text-sm text-white placeholder-white/20 bg-[var(--color-bg-card)] border border-white/5 focus:outline-none focus:border-[var(--color-primary-100)]/60 focus:ring-2 focus:ring-[var(--color-primary-100)]/15 transition-all duration-200"
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
                    className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[var(--color-primary-200)] text-black font-bold text-sm hover:bg-[var(--color-primary-300)] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed font-montserrat"
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
