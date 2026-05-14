'use client';

import Image from 'next/image';
import Link from 'next/link';
// import {
//     InstagramIcon,
//     XIcon,
//     FbIcon,
//     LinkedinIcon,
//     YouTubeIcon
// } from '../../VectorImages';

export default function GlofiCopyrightSection() {
    return (
        <section id="support" className="w-full bg-black border-t border-[#FFFFFF40]">
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 py-8 sm:py-12 lg:py-14">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6 w-full">
                    {/* Left: Logo + Divider + Copyright */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 flex-shrink-0">
                        <Link
                            href="/"
                            className="flex items-center flex-shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-300)]"
                            aria-label="GloFi Estate — Go to homepage"
                        >
                            <Image
                                src="/assets/images/branding/logo.png"
                                alt=""
                                width={128}
                                height={64}
                                className="h-10 sm:h-12 lg:h-14 xl:h-16 w-auto object-contain"
                                aria-hidden
                            />
                        </Link>

                        {/* Vertical Divider */}
                        <div className="w-px h-10 sm:h-12 bg-[var(--color-border-muted)] flex-shrink-0 hidden sm:block" />

                        {/* Copyright text */}
                        <span className="text-xs sm:text-sm lg:text-base text-[var(--color-text-muted)] whitespace-nowrap text-center sm:text-left mt-2 sm:mt-0">
                            Copyright © 2026 GloFi Real Estate
                        </span>
                    </div>

                    {/* Right: Links + Social Icons */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-6 lg:gap-8 flex-shrink-0">
                        {/* Nav Links */}
                        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-5 lg:gap-6">
                            <Link href="#terms" className="text-xs sm:text-sm lg:text-base text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 whitespace-nowrap">
                                Terms
                            </Link>
                            <Link href="/privacy-policy" className="text-xs sm:text-sm lg:text-base text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 whitespace-nowrap">
                                Privacy
                            </Link>
                            <Link href="#cookies" className="text-xs sm:text-sm lg:text-base text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 whitespace-nowrap">
                                Cookies
                            </Link>
                        </div>

                        {/* Social Icons — temporarily hidden
                        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-2 lg:gap-3">
                            <Link href="#instagram" className="opacity-60 hover:opacity-100 transition-opacity p-2 sm:p-1.5 rounded hover:bg-[var(--color-bg-surface-elevated)]">
                                <InstagramIcon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                            </Link>
                            <Link href="#x" className="opacity-60 hover:opacity-100 transition-opacity p-2 sm:p-1.5 rounded hover:bg-[var(--color-bg-surface-elevated)]">
                                <XIcon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                            </Link>
                            <Link href="#facebook" className="opacity-60 hover:opacity-100 transition-opacity p-2 sm:p-1.5 rounded hover:bg-[var(--color-bg-surface-elevated)]">
                                <FbIcon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                            </Link>
                            <Link href="#linkedin" className="opacity-60 hover:opacity-100 transition-opacity p-2 sm:p-1.5 rounded hover:bg-[var(--color-bg-surface-elevated)]">
                                <LinkedinIcon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                            </Link>
                            <Link href="#youtube" className="opacity-60 hover:opacity-100 transition-opacity p-2 sm:p-1.5 rounded hover:bg-[var(--color-bg-surface-elevated)]">
                                <YouTubeIcon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                            </Link>
                        </div>
                        */}
                    </div>
                </div>
            </div>
        </section>
    );
}
