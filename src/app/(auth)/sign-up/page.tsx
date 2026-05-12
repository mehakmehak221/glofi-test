"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UserTypeToggle from "@/components/auth/UserTypeToggle";
import RoleInsightCallout from "@/components/auth/RoleInsightCallout";
import { ChevronLeftIcon, LoadingSpinner, EyeOpenIcon, EyeClosedIcon } from "@/components/VectorImages";
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
                className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-white text-sm transition-colors mb-8 group"
            >
                <ChevronLeftIcon className="group-hover:-translate-x-0.5 transition-transform font-montserrat" />
                Back to home
            </Link>

            <div className="mb-8">
                <h2 className="text-white font-bold text-3xl mb-2 font-montserrat">Welcome</h2>
                <p className="text-[var(--color-text-secondary)] text-sm font-montserrat">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-[var(--color-primary-300)] font-semibold hover:text-[var(--color-primary-100)] transition-colors">
                        Sign in
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
                <UserTypeToggle value={userType} onChange={setUserType} />
                <RoleInsightCallout role={userType} />
            </div>

            <form
                onSubmit={handleSubmit}
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
                        required
                        autoComplete="name"
                        className="premium-input w-full"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="sign-up-email" className="text-sm font-medium text-white font-montserrat">
                        Email Address
                    </label>
                    <input
                        id="sign-up-email"
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="example@gmail.com"
                        required
                        autoComplete="email"
                        className="premium-input w-full"
                    />
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
                            required
                            minLength={8}
                            autoComplete="new-password"
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
                                placeholder="Enter your RERA registration number"
                                required
                                className="premium-input w-full"
                            />
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
                                required
                                className="premium-input w-full"
                            />
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
                            className="premium-input w-full"
                        />
                    </div>
                )}

                <button type="submit" disabled={isLoading} className="btn-primary w-full mt-1 justify-center font-bold">
                    {isLoading ? <LoadingSpinner /> : "Create Account"}
                </button>
            </form>

            <p className="text-center text-xs text-[var(--color-text-muted)] mt-8 font-montserrat leading-relaxed px-1">
                By clicking Create Account you agree to GloFi Estate&apos;s{" "}
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
