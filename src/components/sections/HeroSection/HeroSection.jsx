'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="relative hero-section-wrapper flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.png"
                    alt="Dubai Skyline Night"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 hero-gradient-overlay" />
            </div>

            <div className="relative z-10 w-full px-6 flex flex-col items-center justify-center text-center">
                <h1 className="flex flex-col items-center justify-center m-0 p-0">
                    <span className="text-hero-cyan">
                        OWN PREMIUM REAL ESTATE,
                    </span>
                    <span className="text-hero-white mt-2">
                        FRACTION BY FRACTION..
                    </span>
                </h1>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full max-w-[900px]">
                    <Link
                        href="#explore"
                        className="btn-explore"
                    >
                        <span className="text-btn-explore">EXPLORE PROPERTIES</span>
                    </Link>

                    <Link
                        href="#invest"
                        className="btn-invest"
                    >
                        <span className="text-btn-invest">START INVESTING</span>
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ffd5]/40 to-transparent" />
        </section>
    );
}
