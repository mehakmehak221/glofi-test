'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

export default function HeroSection() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98],
            },
        },
    };

    const imageVariants: Variants = {
        hidden: { opacity: 0, scale: 1.1 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1.5,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section className="w-full flex justify-center bg-[var(--color-bg-dark)]">
            <div className="relative hero-section-wrapper flex flex-col items-center justify-center overflow-hidden w-full">
                <motion.div
                    className="absolute inset-0 z-0"
                    initial="hidden"
                    animate="visible"
                    variants={imageVariants}
                >
                    <Image
                        src="/assets/images/backgrounds/hero-bg.png"
                        alt="Dubai Skyline Night"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 hero-gradient-overlay bg-black/20" />
                </motion.div>

                <motion.div
                    className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex flex-col items-center justify-center text-center py-12 sm:py-16 lg:py-20 xl:py-28"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.h1 
                        className="flex flex-col items-center justify-center m-0 p-0"
                        variants={itemVariants}
                    >
                        <span className="text-hero-cyan font-Montserrat">
                            OWN ANY REAL ESTATE,
                        </span>
                        <span className="text-hero-white font-Montserrat">
                            FRACTION BY FRACTION..
                        </span>
                    </motion.h1>

                    <motion.div 
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-12 sm:mt-14 lg:mt-16 xl:mt-20 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
                        variants={itemVariants}
                    >
                        <Link
                            href=""
                            className="btn-explore w-full sm:w-auto"
                        >
                            <span className="text-btn-explore text-xs sm:text-sm md:text-base font-Montserrat">EXPLORE PROPERTIES</span>
                        </Link>

                        <Link
                            href="/sign-in"
                            className="btn-invest w-full sm:w-auto "
                        >
                            <span className="text-btn-invest text-xs sm:text-sm md:text-base font-Montserrat hover:text-white">START INVESTING</span>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section >
    );
}
