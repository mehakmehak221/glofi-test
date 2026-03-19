'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TopRightArrowIcon, JoinNewGenBgGlow } from '../../VectorImages';

export default function JoinNewGenerationSection() {
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
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
        <section id="learn" className="w-full flex justify-center py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-32 bg-black">
            <div className="join-new-gen-wrapper w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                <motion.div 
                    className="join-new-gen-inner w-full p-6 sm:p-8 lg:p-12 xl:p-16 relative overflow-hidden"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <JoinNewGenBgGlow className="absolute bottom-0 left-0 w-full h-full opacity-60 pointer-events-none" />

                    <motion.h2 
                        className="text-join-title z-10 relative text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center mb-3 sm:mb-4"
                        variants={itemVariants}
                    >
                        Join the new generation<br />of real estate investors.
                    </motion.h2>

                    <motion.p 
                        className="text-join-subtitle z-10 relative text-xs sm:text-sm lg:text-base text-center mb-4 sm:mb-6 lg:mb-8"
                        variants={itemVariants}
                    >
                        START SMALL. OWN BIG
                    </motion.p>

                    <motion.div className="flex justify-center" variants={itemVariants}>
                        <Link href="/sign-in" className="btn-get-started-now z-10 relative hover:scale-105 transition-transform flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full bg-[#00F4C4] text-black font-semibold text-xs sm:text-xs lg:text-sm no-underline">
                            <span className="text-get-started-now">Get started now</span>
                            <TopRightArrowIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
