"use client";

import { useState } from "react";
import Link from "next/link";
import UserTypeToggle from "@/components/auth/UserTypeToggle";
import { ChevronLeftIcon, EyeOpenIcon, EyeClosedIcon, LoadingSpinner, ArrowRightIcon } from "@/components/VectorImages";

export default function SignInPage() {
    const [userType, setUserType] = useState("Investor");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => setLoading(false), 1500);
    };

    return (
        <div className="flex flex-col">

            <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[#767676] hover:text-white text-sm transition-colors mb-8 group"
            >
                <ChevronLeftIcon className="group-hover:-translate-x-0.5 transition-transform font-montserrat" />
                Back to home
            </Link>


            <div className="mb-8">
                <h2 className="text-white font-bold text-3xl mb-1.5 font-montserrat">Welcome back</h2>
                <p className="text-[#FFFFFF4D] text-sm font-montserrat">Sign in to your dashboard</p>
            </div>

            <div className="mb-6">
                <UserTypeToggle value={userType} onChange={setUserType} />
            </div>


            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-montserrat">

                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        required
                        className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#FFFFFF33] bg-[#1a1a1a] border border-white/8 focus:outline-none focus:border-[#00FFCD]/60 focus:ring-2 focus:ring-[#00FFCD]/15 transition-all duration-200"
                    />
                </div>


                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-[#FFFFFF33] bg-[#1a1a1a] border border-white/8 focus:outline-none focus:border-[#00FFCD]/60 focus:ring-2 focus:ring-[#00FFCD]/15 transition-all duration-200"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FFFFFF33] hover:text-[#767676] transition-colors"
                    >
                        {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </button>
                </div>


                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#00F4C4] text-black font-bold text-sm hover:bg-[#00e0b8] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed font-montserrat"
                >
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            Sign In
                            <ArrowRightIcon />
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-[#767676] mt-8 font-montserrat">
                New here?{" "}
                <Link href="/sign-up" className="text-[#00DAAFB2] font-medium hover:text-[#00DAAFB2]/70 transition-colors font-montserrat">
                    Create account
                </Link>
            </p>
        </div>
    );
}
