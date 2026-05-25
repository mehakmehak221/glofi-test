'use client';

import { useState } from 'react';
import Image from 'next/image';

const FEATURES = [
    {
        title: 'Curated Properties',
        description:
            'Explore Professionally vetted real estate opportunities across premium global markets.',
    },
    {
        title: 'Fractional Ownership',
        description: 'Own shares in high-value properties without purchasing the entire asset.',
    },
    {
        title: 'Portfolio Tracking',
        description: 'Monitor returns, growth and asset allocation in real-time.',
    },
];

function FlameIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
                d="M7 1C7 1 4.5 3.5 4.5 6.25C4.5 7.35 5.15 8.25 6 8.75V10.5C6 11.05 6.45 11.5 7 11.5C7.55 11.5 8 11.05 8 10.5V8.75C8.85 8.25 9.5 7.35 9.5 6.25C9.5 3.5 7 1 7 1Z"
                fill="#E85D2C"
            />
            <path
                d="M7 12.25C6.45 12.25 6 12.7 6 13.25H8C8 12.7 7.55 12.25 7 12.25Z"
                fill="#E85D2C"
            />
        </svg>
    );
}

export default function WorkingInstructionsSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="about-platform-section w-full bg-white">
            <div className="about-platform-section__inner">
                <div className="about-platform-section__visual">
                    <Image
                        src="/assets/images/backgrounds/works.png"
                        alt="GloFi platform dashboard showing portfolio growth and dividends"
                        width={640}
                        height={560}
                        className="about-platform-section__image"
                        sizes="(max-width: 1023px) 100vw, 50vw"
                        priority={false}
                    />
                </div>

                <div className="about-platform-section__content">
                    <span className="about-platform-badge">
                        <FlameIcon />
                        ABOUT US
                    </span>

                    <h2 className="about-platform-heading">
                        All Your Real Estate Investments In One Platform
                    </h2>

                    <div className="about-platform-features">
                        <div className="about-platform-features__rail" aria-hidden>
                            {FEATURES.map((_, index) => (
                                <span
                                    key={index}
                                    className={`about-platform-features__rail-segment ${
                                        index === activeIndex ? 'is-active' : ''
                                    }`}
                                />
                            ))}
                        </div>

                        <ul className="about-platform-features__list">
                            {FEATURES.map((feature, index) => {
                                const isActive = index === activeIndex;

                                return (
                                    <li key={feature.title}>
                                        <button
                                            type="button"
                                            onClick={() => setActiveIndex(index)}
                                            className={`about-platform-feature ${
                                                isActive ? 'is-active' : ''
                                            }`}
                                            aria-expanded={isActive}
                                        >
                                            <h3 className="about-platform-feature__title">
                                                {feature.title}
                                            </h3>
                                            <p className="about-platform-feature__description">
                                                {feature.description}
                                            </p>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
