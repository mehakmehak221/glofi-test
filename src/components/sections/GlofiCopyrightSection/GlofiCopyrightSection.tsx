'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    fadeUpSubtle,
    staggerContainer,
    useLandingMotion,
} from '@/lib/landingAnimations';
import { useI18n } from '@/providers/LocaleProvider';

const NAV_LINKS = [
    { label: 'Company', href: '/#company' },
    { label: 'Product', href: '/#product' },
    { label: 'Learn', href: '/#learn' },
];

const LEGAL_LINKS = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Condition', href: '/terms' },
    { label: 'Cookie Notice', href: '#cookies' },
    { label: 'Copyright Policy', href: '/privacy-policy' },
    { label: 'Data Policy', href: '/privacy-policy' },
];

export default function GlofiCopyrightSection() {
    const pathname = usePathname();
    const { viewProps } = useLandingMotion();
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

    return (
        <footer id="support" className="site-footer">
            <motion.div
                className="site-footer__inner"
                {...viewProps}
                variants={staggerContainer(0.08, 0.04)}
            >
                <motion.div variants={fadeUpSubtle}>
                    <Link href="/" className="site-footer__logo" aria-label="GloFi Estates — Home">
                        <Image
                            src="/assets/images/branding/light-logo.png"
                            alt="GloFi Estates"
                            width={220}
                            height={80}
                            className="site-footer__logo-img"
                        />
                    </Link>
                </motion.div>

                <motion.div className="site-footer__app-buttons" variants={fadeUpSubtle}>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                        <Link
                            href="https://apps.apple.com/in/app/glofi-estate/id6764258977"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero-app-btn site-footer__app-btn"
                        >
                            <svg width="24" height="29" viewBox="0 0 24 29" fill="none" className="shrink-0" aria-hidden>
                                <path
                                    d="M20.0454 15.316C20.06 14.2121 20.3603 13.1297 20.9185 12.1696C21.4766 11.2095 22.2745 10.4028 23.2378 9.82464C22.6258 8.97138 21.8185 8.26918 20.8799 7.77381C19.9414 7.27845 18.8975 7.00356 17.8311 6.97099C15.5563 6.73786 13.3509 8.29993 12.1917 8.29993C11.0101 8.29993 9.22531 6.99413 7.30339 7.03273C6.06025 7.07194 4.84871 7.42487 3.78682 8.05713C2.72493 8.68939 1.8489 9.57942 1.24408 10.6405C-1.37578 15.069 0.578406 21.5773 3.08806 25.157C4.3437 26.9099 5.81117 28.8678 7.73135 28.7984C9.61036 28.7223 10.3121 27.6286 12.5802 27.6286C14.8273 27.6286 15.4857 28.7984 17.4448 28.7543C19.4611 28.7223 20.7314 26.9936 21.943 25.2242C22.8452 23.9752 23.5394 22.5948 24 21.1342C22.8286 20.6505 21.829 19.8408 21.1257 18.8062C20.4225 17.7715 20.0468 16.5577 20.0454 15.316Z"
                                    fill="white"
                                />
                                <path
                                    d="M16.3452 4.61656C17.4446 3.32811 17.9862 1.67203 17.8551 0C16.1755 0.172223 14.6241 0.955915 13.5099 2.19493C12.9651 2.80022 12.5479 3.50439 12.282 4.26721C12.0162 5.03002 11.9069 5.83651 11.9605 6.64056C12.8006 6.649 13.6317 6.47124 14.3912 6.12064C15.1507 5.77005 15.8188 5.25578 16.3452 4.61656Z"
                                    fill="white"
                                />
                            </svg>
                            <span className="hero-app-btn__text">
                                <span className="hero-app-btn__label">{t('Download on the')}</span>
                                <span className="hero-app-btn__store">{t('App Store')}</span>
                            </span>
                        </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                        <Link
                            href="https://play.google.com/store/apps/details?id=app.glofiestates.com&pcampaignid=web_share"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero-app-btn site-footer__app-btn"
                        >
                            <svg width="26" height="29" viewBox="0 0 26 29" fill="none" className="shrink-0" aria-hidden>
                                <path d="M11.7657 13.7543L0.107422 26.4074C0.108517 26.4096 0.108517 26.413 0.109612 26.4152C0.46767 27.7892 1.69405 28.8003 3.15037 28.8003C3.7329 28.8003 4.2793 28.6391 4.74795 28.3569L4.78518 28.3345L17.9074 20.5915L11.7657 13.7543Z" fill="#EA4335" />
                                <path d="M23.559 11.5994L23.5481 11.5916L17.8826 8.23348L11.5 14.0416L17.9056 20.5898L23.5404 17.2653C24.5281 16.7189 25.1993 15.654 25.1993 14.4268C25.1993 13.2063 24.5379 12.147 23.559 11.5994Z" fill="#FBBC04" />
                                <path d="M0.107308 2.39209C0.0372293 2.65635 0 2.93405 0 3.2207V25.5797C0 25.8664 0.0372293 26.1441 0.108403 26.4072L12.1663 14.0777L0.107308 2.39209Z" fill="#4285F4" />
                                <path d="M11.8522 14.4001L17.8855 8.23148L4.77861 0.460464C4.30229 0.168211 3.74604 0.000250816 3.15147 0.000250816C1.69514 0.000250816 0.466575 1.01362 0.108516 2.38866C0.108516 2.38978 0.107422 2.3909 0.107422 2.39202L11.8522 14.4001Z" fill="#34A853" />
                            </svg>
                            <span className="hero-app-btn__text">
                                <span className="hero-app-btn__label site-footer__play-label">{t('Get it on')}</span>
                                <span className="hero-app-btn__store">{t('Google Play')}</span>
                            </span>
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.p className="site-footer__powered-by" variants={fadeUpSubtle}>
                    {t('Powered By Maxtron')}
                </motion.p>

                <motion.nav className="site-footer__nav" aria-label="Footer navigation" variants={fadeUpSubtle}>
                    {NAV_LINKS.map((link) => (
                        <motion.span key={link.label} whileHover={{ y: -2 }} className="inline-block">
                            <Link href={link.href} className="site-footer__nav-link">
                                {t(link.label)}
                            </Link>
                        </motion.span>
                    ))}
                </motion.nav>

                <motion.nav className="site-footer__legal" aria-label="Legal" variants={fadeUpSubtle}>
                    {LEGAL_LINKS.map((link, index) => (
                        <span key={link.label} className="site-footer__legal-item">
                            {index > 0 && <span className="site-footer__legal-sep" aria-hidden>|</span>}
                            <Link href={link.href} className="site-footer__legal-link">
                                {t(link.label)}
                            </Link>
                        </span>
                    ))}
                </motion.nav>

                <motion.p className="site-footer__copyright" variants={fadeUpSubtle}>
                    {t('Copyright © 2026 GloFi Estates')}
                </motion.p>
            </motion.div>
        </footer>
    );
}
