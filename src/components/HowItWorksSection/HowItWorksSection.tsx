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

function StepNumber({
    value,
    variant = 'light',
}: {
    value: string;
    variant?: 'light' | 'dark';
}) {
    return (
        <span
            className={`how-it-works__step-num ${
                variant === 'dark' ? 'how-it-works__step-num--on-dark' : ''
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
            className={`how-it-works__copy ${
                variant === 'dark' ? 'how-it-works__copy--on-dark' : ''
            }`}
            variants={copyVariants}
        >
            <StepNumber value={number} variant={variant} />
            <h3 className="how-it-works__step-title">{title}</h3>
            <p className="how-it-works__step-desc">{description}</p>
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
                            className="how-it-works__card how-it-works__card--col"
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
