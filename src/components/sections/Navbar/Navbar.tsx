'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const NAV_LINKS = [
    { label: 'Company', href: '/#company' },
    { label: 'Product', href: '/#product' },
    { label: 'Support', href: '/#support' },
    { label: 'Learn', href: '/#learn' },
];

function NavbarGlobeIcon() {
    return (
        <svg
            className="navbar__lang-icon"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden
        >
            <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.25" />
            <path
                d="M1.75 9H16.25M9 1.75C7.2 4.25 7.2 13.75 9 16.25M9 1.75C10.8 4.25 10.8 13.75 9 16.25"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const goHome = () => {
        if (pathname === '/') {
            window.location.assign('/');
            return;
        }
        router.push('/');
    };

    return (
        <header className="navbar">
            <div className="navbar__inner">
                <Link
                    href="/"
                    className="navbar__logo"
                    onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
                            return;
                        }
                        e.preventDefault();
                        goHome();
                    }}
                >
                    <Image
                        src="/assets/images/branding/light-logo.png"
                        alt="GloFi Estates"
                        width={144}
                        height={48}
                        className="navbar__logo-img"
                        priority
                    />
                </Link>

                <nav aria-label="Main navigation" className="navbar__nav">
                    <ul className="navbar__nav-list">
                        {NAV_LINKS.map((link) => (
                            <li key={link.label}>
                                <Link href={link.href} className="navbar__nav-link">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="navbar__actions">
                    <Link href="/sign-in" className="btn-get-Glofi">
                    Login
                    </Link>

                  
                    <button
                        type="button"
                        className="navbar__hamburger"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen((prev) => !prev)}
                    >
                        <span className={mobileOpen ? 'is-open' : ''} />
                        <span className={mobileOpen ? 'is-open' : ''} />
                        <span className={mobileOpen ? 'is-open' : ''} />
                    </button>
                </div>
            </div>

            <div
                className={`navbar__mobile-menu ${mobileOpen ? 'is-open' : ''}`}
                aria-hidden={!mobileOpen}
            >
                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="navbar__mobile-link"
                        onClick={() => setMobileOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}

                <div className="navbar__mobile-actions">
                    <Link
                        href="/sign-in"
                        className="btn-get-Glofi"
                        onClick={() => setMobileOpen(false)}
                    >
                         Login
                    </Link>
                   
                </div>
            </div>
        </header>
    );
}
