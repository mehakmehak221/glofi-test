'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { JoinNewGenBgGlow } from '../../VectorImages';
import {
    fadeUp,
    fadeUpSubtle,
    scaleIn,
    staggerContainer,
    useLandingMotion,
} from '@/lib/landingAnimations';

export default function JoinNewGenerationSection() {
    const { reduceMotion, viewProps } = useLandingMotion();

    return (
        <section id="learn" className="join-new-gen-section">
            <div className="join-new-gen-wrapper">
                <motion.div
                    className="join-new-gen-inner"
                    {...viewProps}
                    variants={staggerContainer(0.14, 0.08)}
                >
                    <motion.div
                        className="join-new-gen__glow-wrap"
                        aria-hidden
                        variants={scaleIn}
                        animate={
                            reduceMotion
                                ? undefined
                                : {
                                    opacity: [0.7, 1, 0.7],
                                    scale: [1, 1.04, 1],
                                    transition: {
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    },
                                }
                        }
                    >
                        <JoinNewGenBgGlow
                            className="join-new-gen__glow join-new-gen__glow--right"
                            filterId="filter0_join_cta_glow_right"
                            corner="right"
                        />
                    </motion.div>

                    <motion.div
                        className="join-new-gen__image-wrap"
                        variants={fadeUpSubtle}
                        aria-hidden="true"
                    >
                        <Image
                            src="/assets/images/backgrounds/footer.png"
                            alt="Building Real Estate Portfolio"
                            fill
                            style={{ objectFit: 'contain', objectPosition: 'right center' }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </motion.div>

                    <div className="join-new-gen__content">
                        <motion.h2 className="join-new-gen__title" variants={fadeUp}>
                            Start Building Real Estate
                            <br />
                            Portfolio
                        </motion.h2>

                        <motion.p className="join-new-gen__description" variants={fadeUpSubtle}>
                            Access curated investment opportunities and grow your wealth through modern
                            fractional real estate investing.
                        </motion.p>

                        <motion.div className="join-new-gen__cta-row" variants={fadeUpSubtle}>
                            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                <Link href="/sign-in" className="join-new-gen__btn-start">
                                    Start Investing
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.08, rotate: 4 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/explore"
                                    className="join-new-gen__btn-arrow"
                                    aria-label="Explore properties"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                                        <path
                                            d="M5 15L15 5M15 5H8M15 5V12"
                                            stroke="currentColor"
                                            strokeWidth="1.75"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
