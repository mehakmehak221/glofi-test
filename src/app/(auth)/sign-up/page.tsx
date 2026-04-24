"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UserTypeToggle from "@/components/auth/UserTypeToggle";
import { ChevronLeftIcon, LoadingSpinner, ArrowRightIcon, EyeOpenIcon, EyeClosedIcon } from "@/components/VectorImages";
import { useRegisterMutation, useRegisterAgentMutation } from "@/store/api/authApi";
import { setCookie } from "@/utils/cookieUtils";

export default function SignUpPage() {
    const router = useRouter();
    const [userType, setUserType] = useState("Investor");
    const [form, setForm] = useState({ 
        name: "", 
        email: "", 
        password: "", 
        referredByCode: "",
        reraNumber: "",
        expiryDate: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [register, { isLoading: isInvestorRegistering }] = useRegisterMutation();
    const [registerAgent, { isLoading: isAgentRegistering }] = useRegisterAgentMutation();
    const isLoading = isInvestorRegistering || isAgentRegistering;

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((p) => ({ ...p, [k]: e.target.value }));
        setErrorMsg("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            let result;
            if (userType === "Agent") {
                result = await registerAgent({
                    fullName: form.name,
                    email: form.email,
                    password: form.password,
                    reraNumber: form.reraNumber,
                    expiryDate: form.expiryDate
                }).unwrap();
            } else {
                result = await register({
                    fullName: form.name,
                    email: form.email,
                    password: form.password,
                    role: userType.toUpperCase(),
                    referredByCode: form.referredByCode || undefined
                }).unwrap();
            }

            console.log('Register Result:', result);
            const token = result?.accessToken || result?.token || result?.data?.accessToken || result?.data?.token || result?.agent?.token;

            if (token) {
                setCookie("access_token", token);
                localStorage.setItem("access_token", token);
                localStorage.setItem("isLoggedIn", "true");
                setCookie("isLoggedIn", "true");
                console.log('Token stored in cookie and localStorage');
                localStorage.setItem("userType", result?.agent?.role || result?.role || userType.toUpperCase());
                router.push("/onboarding");
            } else {
                console.warn('No token found in register response');
                // If no token is found (e.g. Agent signup), redirect to sign-in
                router.push("/sign-in?message=Registration successful. Please sign in.");
            }
        } catch (err: any) {
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
                    className="premium-input w-full"
                />
                <input
                    type="email" value={form.email} onChange={set("email")} placeholder="Email address" required
                    className="premium-input w-full"
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={set("password")}
                        placeholder="Password"
                        required
                        minLength={8}
                        className="premium-input w-full pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                    >
                        {showPassword ? <EyeOpenIcon className="w-5 h-5" /> : <EyeClosedIcon className="w-5 h-5" />}
                    </button>
                </div>

                {userType === "Agent" ? (
                    <>
                        <input
                            type="text" value={form.reraNumber} onChange={set("reraNumber")} placeholder="RERA Number" required
                            className="premium-input w-full"
                        />
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-[var(--color-text-muted)]/50 tracking-widest uppercase font-montserrat ml-1">RERA Expiry Date</label>
                            <input
                                type="date" value={form.expiryDate} onChange={set("expiryDate")} required
                                className="premium-input w-full"
                            />
                        </div>
                    </>
                ) : (
                    <input
                        type="text" value={form.referredByCode} onChange={set("referredByCode")} placeholder="Referral Code (Optional)"
                        className="premium-input w-full"
                    />
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full mt-4"
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
