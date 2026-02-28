'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
    { label: 'Company', href: '#company' },
    { label: 'Product', href: '#product' },
    { label: 'Support', href: '#support' },
    { label: 'Learn', href: '#learn' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="navbar">
            {/* Desktop bar */}
            <div className="navbar__inner">
                {/* Logo / Brand */}
                <Link href="/" className="navbar__logo">
                    <span className="navbar__logo-text text-real-estate">Real Estate</span>
                </Link>

                {/* Center nav links */}
                <nav aria-label="Main navigation">
                    <ul className="navbar__nav">
                        {NAV_LINKS.map((link) => (
                            <li key={link.label}>
                                <Link href={link.href} className="navbar__nav-link text-nav-link">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Right-hand actions */}
                <div className="navbar__actions">
                    <Link href="#get-glofi" className="btn-get-glofi text-get-glofi">
                        Get GloFi
                    </Link>

                    <button className="navbar__lang text-language" aria-label="Change language">
                        <Image
                            src="/globe.svg"
                            alt="Globe"
                            width={14}
                            height={21}
                            className="navbar__lang-icon"
                        />
                        English
                    </button>
                </div>

                {/* Hamburger (≤ 900 px) */}
                <button
                    className="navbar__hamburger"
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((prev) => !prev)}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            {/* Mobile drawer */}
            <div
                className={`navbar__mobile-menu${mobileOpen ? ' is-open' : ''}`}
                aria-hidden={!mobileOpen}
            >
                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="navbar__mobile-link text-nav-link"
                        onClick={() => setMobileOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}

                <div className="navbar__mobile-actions">
                    <Link href="#get-glofi" className="btn-get-glofi text-get-glofi">
                        Get GloFi
                    </Link>
                    <button
                        className="navbar__lang text-language"
                        aria-label="Change language"
                    >
                        <Image
                            src="/globe.svg"
                            alt="Globe"
                            width={14}
                            height={21}
                            className="navbar__lang-icon"
                        />
                        English
                    </button>
                </div>
            </div>
        </header>
    );
}
