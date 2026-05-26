'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    fadeUp,
    fadeUpSubtle,
    slideFromLeft,
    slideFromRight,
    staggerContainer,
    useLandingMotion,
} from '@/lib/landingAnimations';

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
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_45_630)">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.25466 13.8359C8.9508 12.8064 9.01495 11.6945 8.4471 10.5002C8.28919 11.1409 8.00033 11.5298 7.5805 11.6669C7.97037 10.5535 7.64459 9.35058 6.60315 8.05818C6.58067 9.39299 6.2599 10.3653 5.64082 10.9752C4.78796 11.8146 4.798 12.7619 5.67089 13.8171C2.04735 11.8888 1.53614 9.30248 4.13718 6.05834C4.29851 6.84206 4.68944 7.32323 5.31004 7.50184C4.63358 4.63127 5.34531 2.18534 7.4452 0.164062C7.45811 4.64972 8.83364 5.04842 10.5728 7.05072C12.4505 9.45358 11.347 12.2265 8.25466 13.8359Z"
                    fill="url(#paint0_linear_45_630)"
                />
            </g>
            <defs>
                <linearGradient
                    id="paint0_linear_45_630"
                    x1="11.1975"
                    y1="3.91639"
                    x2="3.19803"
                    y2="11.9159"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#EF3E3D" />
                    <stop offset="1" stopColor="#FFC828" />
                </linearGradient>
                <clipPath id="clip0_45_630">
                    <rect width="14" height="14" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

export default function WorkingInstructionsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const { viewProps } = useLandingMotion();

    return (
        <section id="company" className="about-platform-section w-full bg-white">
            <div className="about-platform-section__inner">
                <motion.div
                    className="about-platform-section__visual"
                    {...viewProps}
                    variants={slideFromLeft}
                >
                    <Image
                        src="/assets/images/backgrounds/works.png"
                        alt="GloFi platform dashboard showing portfolio growth and dividends"
                        width={640}
                        height={560}
                        className="about-platform-section__image"
                        sizes="(max-width: 1023px) 100vw, 50vw"
                    />
                </motion.div>

                <motion.div
                    className="about-platform-section__content"
                    {...viewProps}
                    variants={slideFromRight}
                >
                    <motion.span className="about-platform-badge" variants={fadeUpSubtle}>
                        <FlameIcon />
                        ABOUT US
                    </motion.span>

                    <motion.h2 className="about-platform-heading" variants={fadeUp}>
                        All Your Real Estate Investments In One Platform
                    </motion.h2>

                    <motion.div
                        className="about-platform-features"
                        variants={staggerContainer(0.08, 0.1)}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                    >
                        <div className="about-platform-features__rail" aria-hidden>
                            {FEATURES.map((_, index) => (
                                <motion.span
                                    key={index}
                                    className={`about-platform-features__rail-segment ${
                                        index === activeIndex ? 'is-active' : ''
                                    }`}
                                    layout
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            ))}
                        </div>

                        <ul className="about-platform-features__list">
                            {FEATURES.map((feature, index) => {
                                const isActive = index === activeIndex;

                                return (
                                    <motion.li key={feature.title} variants={fadeUpSubtle}>
                                        <motion.button
                                            type="button"
                                            onClick={() => setActiveIndex(index)}
                                            className={`about-platform-feature ${
                                                isActive ? 'is-active' : ''
                                            }`}
                                            aria-expanded={isActive}
                                            whileHover={{ scale: 1.015, x: 4 }}
                                            whileTap={{ scale: 0.99 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                                        >
                                            <h3 className="about-platform-feature__title">
                                                {feature.title}
                                            </h3>
                                            <p className="about-platform-feature__description">
                                                {feature.description}
                                            </p>
                                        </motion.button>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
