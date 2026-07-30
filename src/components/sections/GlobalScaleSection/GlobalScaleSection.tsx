'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useI18n } from '@/providers/LocaleProvider';

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

export default function GlobalScaleSection() {
    const { t } = useI18n();
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 40,
            rotateX: 12,
            z: -40,
            transformPerspective: 1200
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            z: 0,
            transition: {
                type: "spring" as const,
                stiffness: 60,
                damping: 18,
                mass: 0.8
            }
        }
    };

    return (
        <section id="global-scale" className="relative bg-white w-full pt-16 pb-8 sm:pt-20 sm:pb-12 lg:py-40 overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    {/* Left Content */}
                    <div className="flex flex-col items-start max-w-xl w-full lg:w-[45%] z-20">
                        <motion.div variants={itemVariants} className="flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-6 sm:mb-8 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] w-max">
                            <FlameIcon />
                            <span className="text-[#1A1F1C] text-[11px] sm:text-xs font-bold tracking-wider uppercase">{t('Global Access')}</span>
                        </motion.div>

                        <motion.h2 variants={itemVariants} className="text-[#1A1F1C] text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-tight tracking-tight mb-6">
                            {t('A Smarter Way to Own')}<br className="hidden sm:block" /> {t('Real Estate')}
                        </motion.h2>

                        <motion.p variants={itemVariants} className="text-[#4A5568] text-lg sm:text-xl leading-relaxed">
                            {t('Glofi simplifies premium real estate investing through structured fractional ownership, transparent transactions, and curated global opportunities.')}
                        </motion.p>
                    </div>


                    {/* Mobile/Tablet Image Container - Stays in the normal flow inside motion.div, hidden on desktop */}
                    <motion.div
                        className="lg:hidden w-full z-10 mt-6 flex justify-center"
                        initial={{ opacity: 0, y: 50, rotateX: 12, z: -40, transformPerspective: 1200 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
                        transition={{ type: "spring", stiffness: 60, damping: 18, mass: 0.8 }}
                        style={{ transformStyle: "preserve-3d" }}
                        viewport={{ once: true }}
                    >
                        <div className="relative w-[95%] sm:w-[85%] md:w-[75%] h-[240px] sm:h-[320px] md:h-[380px] max-w-[450px] sm:max-w-[550px]">
                            <Image
                                src="/assets/images/backgrounds/globe.png"
                                alt="Global Access Globe"
                                fill
                                className="object-contain object-bottom"
                                sizes="100vw"
                                priority
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Desktop Image Container - Absolutely positioned at the bottom right corner of the section to sit perfectly flush with the bottom border */}
            <motion.div
                className="hidden lg:block lg:absolute lg:right-0 lg:bottom-0 lg:w-[50%] xl:w-[55%] lg:max-w-[750px] xl:max-w-[850px] z-10 pointer-events-none"
                initial={{ opacity: 0, y: 80, rotateX: 15, z: -60, transformPerspective: 1200 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
                transition={{ type: "spring", stiffness: 50, damping: 18, mass: 0.8 }}
                style={{ transformStyle: "preserve-3d" }}
                viewport={{ once: true, margin: "-120px" }}
            >
                <div className="relative w-full aspect-square">
                    <Image
                        src="/assets/images/backgrounds/globe2.png"
                        alt="Global Access Globe"
                        fill
                        className="object-contain object-right-bottom"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        priority
                    />
                </div>
            </motion.div>
        </section>
    );
}
