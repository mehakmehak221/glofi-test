'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const NAV_LINKS = [
    { label: 'Explore', href: '/explore' },
    // Root-relative hashes so in-app routes (e.g. /explore) still navigate to homepage sections
    { label: 'Company', href: '/#company' },
    { label: 'Product', href: '/#product' },
    { label: 'Support', href: '/#support' },
    { label: 'Learn', href: '/#learn' },
];

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
        <header className="navbar fixed top-0 left-0 right-0 z-(--z-nav) bg-black border-b border-[#A4A7AE]">
            <div className="navbar__inner flex items-center justify-between h-16 lg:h-20 px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-10 max-w-7xl mx-auto">
                <Link
                    href="/"
                    className="navbar__logo flex items-center gap-3 no-underline flex-shrink-0 cursor-pointer"
                    onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
                            return;
                        }
                        e.preventDefault();
                        goHome();
                    }}
                >
                    <Image src="/assets/images/branding/logo.png" alt="Glofi Logo" width={144} height={48} className="h-8 sm:h-10 lg:h-[42px] xl:h-[48px] w-auto object-contain" priority />
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
                  
                    <Link href="/sign-in" className="btn-get-Glofi text-get-Glofi">
                        Get Glofi
                    </Link>

                  
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
                    <Link href="/sign-in" className="btn-get-Glofi text-get-Glofi inline-flex items-center justify-center w-full sm:w-24 h-10 px-4 bg-[var(--color-gradient-Glofi)] text-black rounded-full text-sm font-semibold no-underline transition-transform hover:translate-y-[-1px] hover:shadow-lg whitespace-nowrap">
                        Get Glofi
                    </Link>
                </div>
            </div>
        </header>
    );
}
