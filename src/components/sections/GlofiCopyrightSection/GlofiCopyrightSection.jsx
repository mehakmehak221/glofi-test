'use client';

import React from 'react';
import Link from 'next/link';
import {
    InstagramIcon,
    XIcon,
    FbIcon,
    LinkedinIcon,
    YouTubeIcon
} from '../../VectorImages';

export default function GlofiCopyrightSection() {
    return (
        <section id="support" className="w-full bg-black border-t border-[#FFFFFF40]">
                <div className="w-full max-w-[1440px] mx-auto px-20 sm:px-24 lg:px-30 xl:px-36 2xl:px-40 py-6 sm:py-20 lg:py-22">

                {/* Desktop & Tablet: single row layout */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-6">

<div className="h-[0px]"/>
                    {/* Left: Logo + Divider + Copyright */}
                    <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
                        {/* Logo */}
                        <Link href="/" className="flex items-center flex-shrink-0">
                            <img
                                src="/GloFi.png"
                                alt="GloFi Logo"
                                className="h-11 sm:h-12 lg:h-14 xl:h-16 w-auto object-contain"
                            />
                        </Link>

                        {/* Vertical Divider */}
                        <div className="w-px h-10 sm:h-12 bg-[var(--color-border-muted)] flex-shrink-0 hidden sm:block" />

                        {/* Copyright text */}
                        <span className="text-xs sm:text-sm lg:text-base text-[var(--color-text-muted)] whitespace-nowrap hidden sm:block">
                            Copyright © 2026 GloFi Real Estate
                        </span>
                    </div>

                    {/* Center: Copyright on mobile */}
                    <span className="text-xs text-[var(--color-text-muted)] text-center sm:hidden">
                        Copyright © 2026 GloFi Real Estate
                    </span>

                    {/* Right: Links + Social Icons */}
                    <div className="flex items-center gap-5 sm:gap-6 lg:gap-8 flex-shrink-0">
                        {/* Nav Links */}
                        <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
                            <Link href="#terms" className="text-xs sm:text-sm lg:text-base text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 whitespace-nowrap">
                                Terms
                            </Link>
                            <Link href="#privacy" className="text-xs sm:text-sm lg:text-base text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 whitespace-nowrap">
                                Privacy
                            </Link>
                            <Link href="#cookies" className="text-xs sm:text-sm lg:text-base text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 whitespace-nowrap">
                                Cookies
                            </Link>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                            <Link href="#instagram" className="opacity-60 hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-[var(--color-bg-surface-elevated)]">
                                <InstagramIcon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                            </Link>
                            <Link href="#x" className="opacity-60 hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-[var(--color-bg-surface-elevated)]">
                                <XIcon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                            </Link>
                            <Link href="#facebook" className="opacity-60 hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-[var(--color-bg-surface-elevated)]">
                                <FbIcon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                            </Link>
                            <Link href="#linkedin" className="opacity-60 hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-[var(--color-bg-surface-elevated)]">
                                <LinkedinIcon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                            </Link>
                            <Link href="#youtube" className="opacity-60 hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-[var(--color-bg-surface-elevated)]">
                                <YouTubeIcon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                            </Link>
                        </div>
                    </div>
                </div>

        </div>
        </section>
    );
}
