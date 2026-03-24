'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogoIconPng } from '../../VectorImages';

const NAV_LINKS = [
    { label: 'Company', href: '#company' },
    { label: 'Product', href: '#product' },
    { label: 'Support', href: '#support' },
    { label: 'Learn', href: '#learn' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="navbar fixed top-0 left-0 right-0 z-50 bg-black border-b border-[#A4A7AE]">
            <div className="navbar__inner flex items-center justify-between h-16 lg:h-20 px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-10 max-w-7xl mx-auto">
                <Link href="/" className="navbar__logo flex items-center gap-3 no-underline flex-shrink-0">
                    <img src="/GloFi.png" alt="GloFi Logo" className="h-8 sm:h-10 lg:h-[42px] xl:h-[48px] w-auto object-contain" />
                    <span className="navbar__logo-text font-montserrat text-[10px] sm:text-xs font-normal text-[var(--color-text-secondary)] uppercase tracking-[1.5px] whitespace-nowrap pt-1">
                        Real Estate
                    </span>
                </Link>

                <nav aria-label="Main navigation" className="hidden lg:block">
                    <ul className="navbar__nav flex items-center gap-4 lg:gap-6 xl:gap-8 list-none">
                        {NAV_LINKS.map((link) => (
                            <li key={link.label}>
                                <Link href={link.href} className="navbar__nav-link text-nav-link text-xs sm:text-sm lg:text-base text-[var(--color-text-secondary)] no-underline transition-colors hover:text-white whitespace-nowrap">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="navbar__actions text-nav-link">
                  
                    <Link href="/sign-in" className="btn-get-glofi text-get-glofi">
                        Get GloFi
                    </Link>

                    {/* ... (commented out) ... */}
                </div>

                <button
                    className="navbar__hamburger lg:hidden flex flex-col gap-1 bg-none border-none cursor-pointer p-2"
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((prev) => !prev)}
                >
                    <span className={`block w-5 h-0.5 bg-[var(--color-text-secondary)] rounded transition-all ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                    <span className={`block w-5 h-0.5 bg-[var(--color-text-secondary)] rounded transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-5 h-0.5 bg-[var(--color-text-secondary)] rounded transition-all ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </button>
            </div>
            
            <div
                className={`navbar__mobile-menu lg:hidden flex-col bg-[var(--color-bg-nav)] border-t border-[var(--color-border-dark)] p-4 sm:p-6 gap-2 ${mobileOpen ? 'flex' : 'hidden'}`}
                aria-hidden={!mobileOpen}
            >
                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="navbar__mobile-link text-nav-link block py-3 px-4 text-base text-[var(--color-text-secondary)] no-underline rounded transition-colors hover:text-white"
                        onClick={() => setMobileOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}

                <div className="navbar__mobile-actions flex flex-col sm:flex-row items-center gap-4 mt-4 pt-4 border-t border-white/10">
                    {/* <Link
                        href="/sign-in"
                        className="navbar__mobile-link text-nav-link block py-2 px-4 text-base text-[var(--color-text-secondary)] no-underline rounded transition-colors hover:text-white"
                        onClick={() => setMobileOpen(false)}
                    >
                        Sign In
                    </Link> */}
                    <Link href="/sign-in" className="btn-get-glofi text-get-glofi inline-flex items-center justify-center w-full sm:w-24 h-10 px-4 bg-[var(--color-gradient-glofi)] text-black rounded-full text-sm font-semibold no-underline transition-transform hover:translate-y-[-1px] hover:shadow-lg whitespace-nowrap">
                        Get GloFi
                    </Link>
                    {/* <button
                        className="navbar__lang text-language flex items-center gap-2 bg-transparent border-none cursor-pointer transition-colors hover:text-white whitespace-nowrap text-base text-[var(--color-text-secondary)] py-2 px-4"
                        aria-label="Change language"
                    >
                        <Image
                            src="/globe.svg"
                            alt="Globe"
                            width={14}
                            height={21}
                            className="navbar__lang-icon w-3.5 h-5 flex-shrink-0"
                        />
                        English
                    </button> */}
                </div>
            </div>
        </header>
    );
}
