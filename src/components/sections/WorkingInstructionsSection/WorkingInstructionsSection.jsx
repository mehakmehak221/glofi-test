
'use client';

import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
    {
        number: '01',
        title: 'BROWSE CURATED PROPERTIES',
        description: 'Explore premium residential and commercial real estate opportunities.',
    },
    {
        number: '02',
        title: 'INVEST FRACTIONALLY',
        description: 'Purchase ownership shares at accessible investment levels.',
    },
    {
        number: '03',
        title: 'EARN & EXIT',
        description: 'Generate rental income and exit through the marketplace when ready.',
    },
];

export default function WorkingInstructionsSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    const headerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section className="w-full flex justify-center bg-[var(--color-bg-dark)]">
            <div className="hiw-section-wrapper w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-16 sm:py-20 lg:py-24 xl:py-32 2xl:py-40">
                <div className="flex flex-col items-center w-full">
                    <motion.div 
                        className="flex flex-col items-center text-center justify-center mb-12 sm:mb-16 lg:mb-20"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={headerVariants}
                    >
                        <div className="how-it-works-pill mb-6 px-2 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-primary-200)] rounded-full text-[var(--color-primary-200)] text-sm sm:text-base">
                            How It Works
                        </div>

                        <h2 className="how-it-works-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-Montserrat">
                            Get GloFi-Ready In Just 3 Steps
                        </h2>
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full max-w-6xl"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                    >
                        {STEPS.map((step, index) => (
                            <motion.div
                                key={index}
                                className="step-card-box bg-[var(--color-bg-dark)] border-2 border-[var(--color-primary-200)] p-6 sm:p-8 rounded-lg backdrop-blur-sm transition-transform hover:translate-y-[-2px] min-h-[280px] flex flex-col justify-between"
                                variants={cardVariants}
                            >
                                <span className="step-number-bg text-4xl sm:text-5xl lg:text-6xl font-bold bg-[var(--color-gradient-step)] bg-clip-text text-transparent mb-4">
                                    {step.number}
                                </span>

                                <h3 className="step-title-text text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-gray-50)] mb-3 uppercase tracking-wider">
                                    {step.title}
                                </h3>

                                <p className="step-desc-text text-sm sm:text-base text-[var(--color-gray-100)] leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
