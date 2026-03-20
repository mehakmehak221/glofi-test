'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="w-full flex justify-center bg-[var(--color-bg-dark)]">
            <div className="relative hero-section-wrapper flex flex-col items-center justify-center overflow-hidden w-full">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-bg.png"
                        alt="Dubai Skyline Night"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 hero-gradient-overlay bg-black/20" />
                </div>

                <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex flex-col items-center justify-center text-center py-12 sm:py-16 lg:py-20 xl:py-28">
                    <h1 className="flex flex-col items-center justify-center m-0 p-0">
                        <span className="text-hero-cyan font-Montserrat">
                            OWN ANY REAL ESTATE,
                        </span>
                        <span className="text-hero-white font-Montserrat">
                            FRACTION BY FRACTION..
                        </span>
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-12 sm:mt-14 lg:mt-16 xl:mt-20 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
                        <Link
                            href="#explore"
                            className="btn-explore w-full sm:w-auto"
                        >
                            <span className="text-btn-explore text-xs sm:text-sm md:text-base font-Montserrat">EXPLORE PROPERTIES</span>
                        </Link>

                        <Link
                            href="#invest"
                            className="btn-invest w-full sm:w-auto "
                        >
                            <span className="text-btn-invest text-xs sm:text-sm md:text-base font-Montserrat hover:text-white">START INVESTING</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section >
    );
}
