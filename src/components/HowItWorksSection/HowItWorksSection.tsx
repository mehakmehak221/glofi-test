'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

const STEPS = {
    createAccount: {
        number: '01',
        title: 'Create Your Account',
        description:
            'Sign Up Securely, Complete KYC Verification And Set Up Your Investor Profile.',
        image: '/assets/images/how-it-works/step-01.png',
        imageAlt: 'Mobile app showing KYC verification screen',
        width: 1912,
        height: 1404,
    },
    explore: {
        number: '02',
        title: 'Explore Properties',
        description:
            'Discover Curated, High-Quality Properties Across Pan India With Detailed Insights And Analytics.',
        image: '/assets/images/how-it-works/step-02.png',
        imageAlt: 'Property listing card with investment details',
        width: 1632,
        height: 1492,
    },
    invest: {
        number: '03',
        title: 'Invest Fractionally',
        description:
            'Choose Your Investment Amount And Own A Fraction Of Premium Properties With Lower Entry Barriers.',
        image: '/assets/images/how-it-works/step-03.png',
        imageAlt: 'Investment amount selection screen',
        width: 1860,
        height: 1104,
    },
    track: {
        number: '04',
        title: 'Track Returns in Real-Time',
        description:
            'Monitor Your Portfolio Performance, Rental Income And Growth In Real Time Through An Intuitive Dashboard.',
        image: '/assets/images/how-it-works/step-04.png',
        imageAlt: 'Portfolio dashboard with charts and asset allocation',
        width: 1888,
        height: 1084,
    },
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: EASE },
    },
};

const gridVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.06 },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: EASE,
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

const mediaVariants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: EASE, delay: 0.08 },
    },
};

const copyVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: EASE, delay: 0.12 },
    },
};

function FlameIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_45_662)">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.25466 13.8359C8.9508 12.8064 9.01495 11.6945 8.4471 10.5002C8.28919 11.1409 8.00033 11.5298 7.5805 11.6669C7.97037 10.5535 7.64459 9.35058 6.60315 8.05818C6.58067 9.39299 6.2599 10.3653 5.64082 10.9752C4.78796 11.8146 4.798 12.7619 5.67089 13.8171C2.04735 11.8888 1.53614 9.30248 4.13718 6.05834C4.29851 6.84206 4.68944 7.32323 5.31004 7.50184C4.63358 4.63127 5.34531 2.18534 7.4452 0.164062C7.45811 4.64972 8.83364 5.04842 10.5728 7.05072C12.4505 9.45358 11.347 12.2265 8.25466 13.8359Z" fill="url(#paint0_linear_45_662)" />
            </g>
            <defs>
                <linearGradient id="paint0_linear_45_662" x1="11.1975" y1="3.91639" x2="3.19803" y2="11.9159" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EF3E3D" />
                    <stop offset="1" stopColor="#FFC828" />
                </linearGradient>
                <clipPath id="clip0_45_662">
                    <rect width="14" height="14" fill="white" />
                </clipPath>
            </defs>
        </svg>

    );
}

function StepNumber({
    value,
    variant = 'light',
}: {
    value: string;
    variant?: 'light' | 'dark';
}) {
    return (
        <span
            className={`how-it-works__step-num ${variant === 'dark' ? 'how-it-works__step-num--on-dark' : ''
                }`}
        >
            {value}
        </span>
    );
}

function StepCopy({
    number,
    title,
    description,
    variant = 'light',
}: {
    number: string;
    title: string;
    description: string;
    variant?: 'light' | 'dark';
}) {
    return (
        <motion.div
            className={`how-it-works__copy flex flex-col gap-4 md:gap-6 ${variant === 'dark' ? 'how-it-works__copy--on-dark' : ''
                }`}
            variants={copyVariants}
        >
            <StepNumber value={number} variant={variant} />
            <div className="flex flex-col gap-2 md:gap-3">
                <h3 className="how-it-works__step-title !mb-0">{title}</h3>
                <p className="how-it-works__step-desc leading-relaxed opacity-90">{description}</p>
            </div>
        </motion.div>
    );
}

type MediaFit = 'step-01' | 'step-02' | 'step-03' | 'step-04';

function StepMedia({
    src,
    alt,
    width,
    height,
    fit,
}: {
    src: string;
    alt: string;
    width: number;
    height: number;
    fit: MediaFit;
}) {
    return (
        <motion.div
            className={`how-it-works__media how-it-works__media--${fit}`}
            variants={mediaVariants}
        >
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="how-it-works__media-img"
                sizes={
                    fit === 'step-01' || fit === 'step-04'
                        ? '(max-width: 899px) 100vw, 55vw'
                        : '(max-width: 899px) 100vw, 42vw'
                }
            />
        </motion.div>
    );
}

type StepCardProps = {
    className: string;
    children: ReactNode;
    reduceMotion: boolean;
};

function StepCard({ className, children, reduceMotion }: StepCardProps) {
    return (
        <motion.article
            className={className}
            variants={cardVariants}
            whileHover={
                reduceMotion
                    ? undefined
                    : { y: -4, transition: { duration: 0.22, ease: 'easeOut' } }
            }
        >
            {children}
        </motion.article>
    );
}

export default function HowItWorksSection() {
    const reduceMotion = useReducedMotion();
    const { createAccount, explore, invest, track } = STEPS;

    const viewport = { once: true, margin: '-60px' as const };
    const motionProps = reduceMotion
        ? { initial: 'visible' as const, animate: 'visible' as const }
        : { initial: 'hidden' as const, whileInView: 'visible' as const, viewport };

    return (
        <section className="how-it-works" aria-labelledby="how-it-works-heading">
            <div className="how-it-works__inner">
                <motion.header
                    className="how-it-works__header"
                    {...motionProps}
                    variants={headerVariants}
                >
                    <span className="how-it-works__badge">
                        <FlameIcon />
                        SERVICES
                    </span>
                    <h2 id="how-it-works-heading" className="how-it-works__title">
                        How It Works
                    </h2>
                </motion.header>

                <motion.div className="how-it-works__grid" {...motionProps} variants={gridVariants}>
                    <StepCard
                        className="how-it-works__card how-it-works__card--row how-it-works__card--row-media-start"
                        reduceMotion={!!reduceMotion}
                    >
                        <StepMedia
                            src={createAccount.image}
                            alt={createAccount.imageAlt}
                            width={createAccount.width}
                            height={createAccount.height}
                            fit="step-01"
                        />
                        <div className="how-it-works__card-body">
                            <StepCopy
                                number={createAccount.number}
                                title={createAccount.title}
                                description={createAccount.description}
                            />
                        </div>
                    </StepCard>

                    <div className="how-it-works__pair">
                        <StepCard
                            className="how-it-works__card how-it-works__card--col how-it-works__card--step-02"
                            reduceMotion={!!reduceMotion}
                        >
                            <div className="how-it-works__card-body">
                                <StepCopy
                                    number={explore.number}
                                    title={explore.title}
                                    description={explore.description}
                                />
                            </div>
                            <StepMedia
                                src={explore.image}
                                alt={explore.imageAlt}
                                width={explore.width}
                                height={explore.height}
                                fit="step-02"
                            />
                        </StepCard>

                        <StepCard
                            className="how-it-works__card how-it-works__card--col how-it-works__card--dark"
                            reduceMotion={!!reduceMotion}
                        >
                            <div className="how-it-works__card-body">
                                <StepCopy
                                    number={invest.number}
                                    title={invest.title}
                                    description={invest.description}
                                    variant="dark"
                                />
                            </div>
                            <StepMedia
                                src={invest.image}
                                alt={invest.imageAlt}
                                width={invest.width}
                                height={invest.height}
                                fit="step-03"
                            />
                        </StepCard>
                    </div>

                    <StepCard
                        className="how-it-works__card how-it-works__card--row how-it-works__card--row-media-end"
                        reduceMotion={!!reduceMotion}
                    >
                        <div className="how-it-works__card-body">
                            <StepCopy
                                number={track.number}
                                title={track.title}
                                description={track.description}
                            />
                        </div>
                        <StepMedia
                            src={track.image}
                            alt={track.imageAlt}
                            width={track.width}
                            height={track.height}
                            fit="step-04"
                        />
                    </StepCard>
                </motion.div>
            </div>
        </section>
    );
}
