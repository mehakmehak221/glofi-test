'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LANDING_EASE } from '@/lib/landingAnimations';

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
        <motion.header
            className="navbar"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: LANDING_EASE }}
        >
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

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="navbar__mobile-menu is-open !flex flex-col"
                        aria-hidden={false}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: LANDING_EASE }}
                    >
                        {NAV_LINKS.map((link, index) => (
                            <motion.div
                                key={link.label}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * index, duration: 0.3 }}
                            >
                                <Link
                                    href={link.href}
                                    className="navbar__mobile-link"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}

                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
