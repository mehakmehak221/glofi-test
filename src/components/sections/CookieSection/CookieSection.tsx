'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieSection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleConsent = (value: 'accepted' | 'rejected') => {
        localStorage.setItem('cookie_consent', value);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <section
            className="fixed bottom-0 left-0 right-0 z-(--z-nav) flex justify-center bg-transparent"
            aria-label="Cookie consent"
        >
            <div className="cookie-section-wrapper w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-3 sm:py-4 lg:py-5 bg-[var(--color-bg-dark)] border-t border-[var(--color-primary-300-alpha-30)] backdrop-blur-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 lg:gap-6 text-center sm:text-left">
                <span className="cookie-text text-xs sm:text-sm lg:text-base text-[#F5F5F5] flex-1">
                    We use cookies to enhance your experience, analyze site traffic, and for marketing purposes.{' '}
                    <Link
                        href="/privacy-policy#cookies"
                        className="cookie-link relative z-10 inline-flex text-[var(--color-primary-200)] no-underline font-medium hover:underline"
                        prefetch={false}
                    >
                        Learn more
                    </Link>
                </span>

                <div className="cookie-actions flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
                    <button
                        className="btn-cookie-reject h-8 sm:h-10 min-w-16 sm:min-w-20 px-3 sm:px-4 rounded border border-[var(--color-border-subtle)] bg-transparent flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 text-xs sm:text-sm text-[var(--color-text-muted)]"
                        onClick={() => handleConsent('rejected')}
                    >
                        <span className="text-cookie-reject">Reject</span>
                    </button>
                    <button
                        className="btn-cookie-accept h-8 sm:h-10 min-w-20 sm:min-w-24 px-3 sm:px-4 rounded border border-[var(--color-primary-200)] bg-transparent flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 text-xs sm:text-sm text-[var(--color-primary-200)]"
                        onClick={() => handleConsent('accepted')}
                    >
                        <span className="text-cookie-accept">Accept All</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
