'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LANDING_EASE } from '@/lib/landingAnimations';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { useI18n } from '@/providers/LocaleProvider';

const NAV_LINKS = [
    { label: 'Company', href: '/#company' },
    { label: 'Product', href: '/#product' },
    { label: 'Blog', href: '/blog' },
    { label: 'Learn', href: '/#learn' },
];
export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useI18n();

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('/#')) {
            const targetId = href.split('#')[1];
            if (pathname === '/') {
                e.preventDefault();
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    window.history.pushState(null, '', href);
                }
            }
        }
    };

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const targetId = hash.replace('#', '');
            const element = document.getElementById(targetId);
            if (element) {
                const timeoutId = setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 300);
                return () => clearTimeout(timeoutId);
            }
        }
    }, [pathname]);

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
                                <Link
                                    href={link.href}
                                    className="navbar__nav-link"
                                    onClick={(e) => handleScroll(e, link.href)}
                                >
                                    {t(link.label)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="navbar__actions">
                    <LanguageSwitcher />
                    <Link href="/sign-in" className="btn-get-Glofi">
                        {t('Login')}
                    </Link>


                    <button
                        type="button"
                        className="navbar__hamburger"
                        aria-label={mobileOpen ? t('Close menu') : t('Open menu')}
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
                                    onClick={(e) => {
                                        setMobileOpen(false);
                                        handleScroll(e, link.href);
                                    }}
                                >
                                    {t(link.label)}
                                </Link>
                            </motion.div>
                        ))}
                        <div className="navbar__mobile-actions">
                            <LanguageSwitcher variant="mobile" className="w-full" />
                            <Link href="/sign-in" className="btn-get-Glofi w-full justify-center">
                                {t('Login')}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
