'use client';

import React, { useState } from 'react';

export default function CookieSection() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <section className="fixed bottom-0 w-full z-50 flex justify-center bg-transparent pointer-events-none">
            <div className="cookie-section-wrapper pointer-events-auto w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-3 sm:py-4 lg:py-5 bg-[rgba(20,20,20,0.95)] border-t border-[rgba(0,244,196,0.3)] backdrop-blur-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 lg:gap-6 text-center sm:text-left">
                <span className="cookie-text text-xs sm:text-sm lg:text-base text-[#F5F5F5] flex-1">
                    We use cookies to enhance your experience, analyze site traffic, and for marketing purposes.
                    <a href="#learn-more" className="cookie-link text-[#00F4C4] no-underline font-medium ml-1">Learn more</a>
                </span>

                <div className="cookie-actions flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
                    <button
                        className="btn-cookie-reject h-8 sm:h-10 min-w-16 sm:min-w-20 px-3 sm:px-4 rounded border border-[rgba(255,255,255,0.3)] bg-transparent flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 text-xs sm:text-sm text-[#AAAAAA]"
                        onClick={() => setIsVisible(false)}
                    >
                        <span className="text-cookie-reject">Reject</span>
                    </button>
                    <button
                        className="btn-cookie-accept h-8 sm:h-10 min-w-20 sm:min-w-24 px-3 sm:px-4 rounded border border-[#00F4C4] bg-transparent flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 text-xs sm:text-sm text-[#00F4C4]"
                        onClick={() => setIsVisible(false)}
                    >
                        <span className="text-cookie-accept">Accept All</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
