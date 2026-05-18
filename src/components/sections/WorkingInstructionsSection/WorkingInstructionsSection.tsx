
'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

const STEPS = [
    {
        number: '01',
        title: 'BROWSE CURATED PROPERTIES',
        description: 'Explore premium residential and commercial real estate opportunities.',
    },
    {
        number: '02',
        title: 'INVEST FRACTIONALLY OR WHOLE',
        description: 'Purchase ownership shares at accessible investment levels.',
    },
    {
        number: '03',
        title: 'EARN & EXIT',
        description: 'Generate rental income and exit through the marketplace when ready.',
    },
];

export default function WorkingInstructionsSection() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants: Variants = {
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

    const headerVariants: Variants = {
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
        <section className="w-full flex flex-col items-center bg-[var(--color-bg-dark)]">
            <div className="hiw-section-wrapper w-full mx-auto">
                <div className="flex flex-col items-center w-full">
                    <motion.div 
                        className="flex flex-col items-center text-center justify-center mb-10 sm:mb-12 lg:mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={headerVariants}
                    >
                        <div className="how-it-works-pill mb-6 px-4 py-1.5 bg-[#030A08] border border-[#00F4C4] rounded-full text-[#00F4C4] text-sm sm:text-base font-Montserrat font-medium">
                            How It Works
                        </div>

                        <h2 className="how-it-works-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-Montserrat font-bold">
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
                                className="bg-black/70 border border-[#00F4C4]/30 shadow-[0_0_25px_rgba(0,244,196,0.12)] p-6 sm:p-8 rounded-[18px] backdrop-blur-md transition-all duration-500 hover:translate-y-[-4px] hover:border-[#00F4C4]/60 hover:shadow-[0_0_35px_rgba(0,244,196,0.22)] min-h-[280px] flex flex-col justify-between"
                                variants={cardVariants}
                            >
                                <span className="text-4xl sm:text-5xl lg:text-6xl font-Montserrat font-bold text-[#00F4C4] mb-4">
                                    {step.number}
                                </span>

                                <h3 className="text-lg sm:text-xl font-Montserrat font-bold text-white mb-3 uppercase tracking-wide">
                                    {step.title}
                                </h3>

                                <p className="text-sm sm:text-base text-[#8F8F9F] font-Montserrat leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Stats Bar Section */}
            <div className="w-full bg-[#030706] py-10 sm:py-12 z-10">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-around gap-8 md:gap-4">
                    {/* Stat 1 */}
                    <div className="flex flex-col items-center text-center">
                        <span className="text-4xl sm:text-5xl font-Montserrat font-bold text-white tracking-tight">11</span>
                        <span className="text-sm sm:text-base text-[#8F8F9F] font-Montserrat mt-2 font-medium">Premium Assets</span>
                    </div>

                    {/* Separator Dot 1 */}
                    <div className="hidden md:block w-2.5 h-2.5 rounded-full bg-[#00F4C4] shadow-[0_0_12px_#00F4C4]" />

                    {/* Stat 2 */}
                    <div className="flex flex-col items-center text-center">
                        <span className="text-4xl sm:text-5xl font-Montserrat font-bold text-white tracking-tight">₹28.5k Cr +</span>
                        <span className="text-sm sm:text-base text-[#8F8F9F] font-Montserrat mt-2 font-medium">Assets of Worth</span>
                    </div>

                    {/* Separator Dot 2 */}
                    <div className="hidden md:block w-2.5 h-2.5 rounded-full bg-[#00F4C4] shadow-[0_0_12px_#00F4C4]" />

                    {/* Stat 3 */}
                    <div className="flex flex-col items-center text-center">
                        <span className="text-4xl sm:text-5xl font-Montserrat font-bold text-white tracking-tight">850+</span>
                        <span className="text-sm sm:text-base text-[#8F8F9F] font-Montserrat mt-2 font-medium">Investors Across India</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
