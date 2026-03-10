"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserTypeToggle from "@/components/auth/UserTypeToggle";
import { ChevronLeftIcon, CheckIcon, LoadingSpinner, ArrowRightIcon, EyeOpenIcon, EyeClosedIcon } from "@/components/VectorImages";

export default function SignUpPage() {
    const router = useRouter();
    const [userType, setUserType] = useState("Investor");
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push("/onboarding");
        }, 1200);
    };

    return (
        <div className="flex flex-col">

            <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[#767676] hover:text-white text-xs transition-colors mb-8 group"
            >
                <ChevronLeftIcon className="group-hover:-translate-x-0.5 transition-transform w-3.5 h-3.5" />
                Back to home
            </Link>

            <div className="mb-8">
                <h2 className="text-white font-semibold text-[32px] tracking-tight mb-2 font-montserrat">Create account</h2>
                <p className="text-[#767676] text-md font-montserrat">Join the next generation of property investors</p>
            </div>


            <div className="mb-8">
                <UserTypeToggle value={userType} onChange={setUserType} />
            </div>


            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input
                    type="text" value={form.name} onChange={set("name")} placeholder="Full name" required
                    className="w-full rounded-xl px-4 py-4 text-sm text-white placeholder-[#FFFFFF33] bg-[#1a1a1a] border border-white/8 focus:outline-none focus:border-[#00FFCD]/60 transition-all font-medium font-montserrat"
                />
                <input
                    type="email" value={form.email} onChange={set("email")} placeholder="Email address" required
                    className="w-full rounded-xl px-4 py-4 text-sm text-white placeholder-[#FFFFFF33] bg-[#1a1a1a] border border-white/8 focus:outline-none focus:border-[#00FFCD]/60 transition-all font-medium font-montserrat"
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={set("password")}
                        placeholder="Password"
                        required
                        minLength={8}
                        className="w-full rounded-xl px-4 py-4 text-sm text-white placeholder-[#FFFFFF33] bg-[#1a1a1a] border border-white/8 focus:outline-none focus:border-[#00FFCD]/60 transition-all font-medium pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FFFFFF33] hover:text-[#767676] transition-colors"
                    >
                        {showPassword ? <EyeOpenIcon className="w-5 h-5" /> : <EyeClosedIcon className="w-5 h-5" />}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#00FFCD] text-black font-bold text-sm hover:bg-[#00e0b8] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-montserrat"
                >
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            Create Account
                            <ArrowRightIcon className="w-4 h-4 ml-1" />
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-[#FFFFFF33] mt-10 font-montserrat">
                Have an account?{" "}
                <Link href="/sign-in" className="text-[#00DAAFB2] font-semibold hover:text-[#00FFCD]/70 transition-colors">
                    Sign in
                </Link>
            </p>
        </div>
    );
}