'use client';

import React, { useState } from 'react';

export default function CookieSection() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <section className="fixed bottom-0 w-full z-50 flex justify-center bg-transparent pointer-events-none">
            {/* Using pointer-events-auto on the wrapper so you can click the banner, but click through the transparent edges if any */}
            <div className="cookie-section-wrapper pointer-events-auto">
                {/* Left Text */}
                <span className="cookie-text">
                    We use cookies to enhance your experience, analyze site traffic, and for marketing purposes.
                    <a href="#learn-more" className="cookie-link">Learn more</a>
                </span>

                {/* Right Actions */}
                <div className="cookie-actions">
                    <button
                        className="btn-cookie-reject"
                        onClick={() => setIsVisible(false)}
                    >
                        <span className="text-cookie-reject">Reject</span>
                    </button>
                    <button
                        className="btn-cookie-accept"
                        onClick={() => setIsVisible(false)}
                    >
                        <span className="text-cookie-accept">Accept All</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
