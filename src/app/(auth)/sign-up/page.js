"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UserTypeToggle from "@/components/auth/UserTypeToggle";
import { ChevronLeftIcon, LoadingSpinner, ArrowRightIcon, EyeOpenIcon, EyeClosedIcon } from "@/components/VectorImages";
import { useRegisterMutation } from "@/store/api/authApi";
import { setCookie } from "@/utils/cookieUtils";

export default function SignUpPage() {
    const router = useRouter();
    const [userType, setUserType] = useState("Investor");
    const [form, setForm] = useState({ name: "", email: "", password: "", referredByCode: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [register, { isLoading }] = useRegisterMutation();

    const set = (k) => (e) => {
        setForm((p) => ({ ...p, [k]: e.target.value }));
        setErrorMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            const result = await register({
                fullName: form.name,
                email: form.email,
                password: form.password,
                role: userType.toUpperCase(),
                referredByCode: form.referredByCode || undefined
            }).unwrap();

            console.log('Register Result:', result);
            const token = result.accessToken || result.token;

            if (token) {
                setCookie("access_token", token);
                localStorage.setItem("access_token", token);
                console.log('Token stored in cookie and localStorage');
            } else {
                console.warn('No token found in register response');
            }

            localStorage.setItem("userType", result.role || userType.toUpperCase());
            localStorage.setItem("isLoggedIn", "true");
            setCookie("isLoggedIn", "true");

            router.push("/onboarding");
        } catch (err) {
            console.error("Failed to register:", err);
            setErrorMsg(err?.data?.message || err?.message || "Something went wrong. Please try again.");
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
                className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-white text-xs transition-colors mb-8 group"
            >
                <ChevronLeftIcon className="group-hover:-translate-x-0.5 transition-transform w-3.5 h-3.5" />
                Back to home
            </Link>

            <div className="mb-8">
                <h2 className="text-white font-semibold text-[32px] tracking-tight mb-2 font-montserrat">Create account</h2>
                <p className="text-[var(--color-text-secondary)] text-md font-montserrat">Join the next generation of property investors</p>
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


            <div className="mb-8">
                <UserTypeToggle value={userType} onChange={setUserType} />
            </div>


            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input
                    type="text" value={form.name} onChange={set("name")} placeholder="Full name" required
                    className="w-full rounded-md px-4 py-4 text-sm text-white placeholder-[var(--color-text-muted)] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] focus:outline-none focus:border-[var(--color-primary-100)]/60 transition-all font-medium font-montserrat"
                />
                <input
                    type="email" value={form.email} onChange={set("email")} placeholder="Email address" required
                    className="w-full rounded-md px-4 py-4 text-sm text-white placeholder-[var(--color-text-muted)] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] focus:outline-none focus:border-[var(--color-primary-100)]/60 transition-all font-medium font-montserrat"
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={set("password")}
                        placeholder="Password"
                        required
                        minLength={8}
                        className="w-full rounded-md px-4 py-4 text-sm text-white placeholder-[var(--color-text-muted)] bg-[var(--color-bg-card)] border border-[var(--color-border-muted)] focus:outline-none focus:border-[var(--color-primary-100)]/60 transition-all font-medium pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                    >
                        {showPassword ? <EyeOpenIcon className="w-5 h-5" /> : <EyeClosedIcon className="w-5 h-5" />}
                    </button>
                </div>

                <input
                    type="text" value={form.referredByCode} onChange={set("referredByCode")} placeholder="Referral Code (Optional)"
                    className="w-full rounded-md px-4 py-4 text-sm text-white placeholder-[var(--color-text-muted)] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] focus:outline-none focus:border-[var(--color-primary-100)]/60 transition-all font-medium font-montserrat"
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[var(--color-primary-100)] text-black font-bold text-sm hover:bg-[var(--color-primary-300)] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-montserrat"
                >
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            Create Account
                            <ArrowRightIcon className="w-4 h-4 ml-1" />
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-[var(--color-text-muted)] mt-10 font-montserrat">
                Have an account?{" "}
                <Link href="/sign-in" className="text-[var(--color-primary-300)] font-semibold hover:text-[var(--color-primary-100)] transition-colors">
                    Sign in
                </Link>
            </p>
        </motion.div>
    );
}