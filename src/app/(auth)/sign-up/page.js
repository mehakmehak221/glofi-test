"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserTypeToggle from "@/components/auth/UserTypeToggle";
import { ChevronLeftIcon, CheckIcon, LoadingSpinner, ArrowRightIcon } from "@/components/VectorImages";

export default function SignUpPage() {
    const router = useRouter();
    const [userType, setUserType] = useState("Investor");
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!agreed) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push("/onboarding");
        }, 1200);
    };

    return (
        <div className="flex flex-col">
            {/* Back */}
            <Link
                href="/sign-in"
                className="inline-flex items-center gap-1.5 text-[#767676] hover:text-white text-sm transition-colors mb-8 group"
            >
                <ChevronLeftIcon className="group-hover:-translate-x-0.5 transition-transform" />
                Back to sign in
            </Link>

          
            <div className="mb-8">
                <h2 className="text-white font-bold text-3xl tracking-tight mb-1.5">Create account</h2>
                <p className="text-[#767676] text-sm">Start your investment journey with GloFi</p>
            </div>

            {/* Toggle */}
            <div className="mb-6">
                <UserTypeToggle value={userType} onChange={setUserType} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text" value={form.name} onChange={set("name")} placeholder="Full name" required
                    className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#4c4c4c] bg-[#1a1a1a] border border-white/8 focus:outline-none focus:border-[#00FFCD]/60 focus:ring-2 focus:ring-[#00FFCD]/15 transition-all"
                />
                <input
                    type="email" value={form.email} onChange={set("email")} placeholder="Email address" required
                    className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#4c4c4c] bg-[#1a1a1a] border border-white/8 focus:outline-none focus:border-[#00FFCD]/60 focus:ring-2 focus:ring-[#00FFCD]/15 transition-all"
                />
                <input
                    type="password" value={form.password} onChange={set("password")} placeholder="Password (min. 8 characters)" required minLength={8}
                    className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#4c4c4c] bg-[#1a1a1a] border border-white/8 focus:outline-none focus:border-[#00FFCD]/60 focus:ring-2 focus:ring-[#00FFCD]/15 transition-all"
                />

               
                {form.password && (
                    <div className="flex gap-1.5 -mt-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${form.password.length >= i * 3
                                    ? i <= 1 ? "bg-red-500" : i <= 2 ? "bg-yellow-500" : i <= 3 ? "bg-blue-400" : "bg-[#00FFCD]"
                                    : "bg-white/8"
                                    }`}
                            />
                        ))}
                    </div>
                )}

                
                <label className="flex items-start gap-3 cursor-pointer mt-1">
                    <div
                        onClick={() => setAgreed(!agreed)}
                        className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center border shrink-0 transition-all duration-150 ${agreed ? "bg-[#00FFCD] border-[#00FFCD]" : "bg-transparent border-white/20"
                            }`}
                    >
                        {agreed && <CheckIcon stroke="black" />}
                    </div>
                    <span className="text-xs text-[#767676] leading-relaxed">
                        I agree to the{" "}
                        <Link href="#" className="text-[#00FFCD] hover:underline">Terms of Service</Link>{" "}
                        and{" "}
                        <Link href="#" className="text-[#00FFCD] hover:underline">Privacy Policy</Link>
                    </span>
                </label>

               
                <button
                    type="submit"
                    disabled={loading || !agreed}
                    className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#00FFCD] text-black font-bold text-sm hover:bg-[#00e0b8] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            Create Account
                            <ArrowRightIcon />
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-[#767676] mt-8">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-[#00FFCD] font-semibold hover:text-[#00FFCD]/70 transition-colors">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
