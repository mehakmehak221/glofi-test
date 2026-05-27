'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { HomeIcon, LegalIcon, EarningPassiveIcon, LiquidityIcon } from '../../VectorImages';

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

export default function InvestmentSection() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
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
                type: "spring",
                stiffness: 60,
                damping: 18,
                mass: 0.8
            },
        },
    };

    return (
        <section id="product" className="flex flex-col items-center w-full relative overflow-hidden">

            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: "url('/assets/images/backgrounds/benefitsbg.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />
            <div className="investment-section-wrapper w-full z-10 relative">
                <div className="w-full mx-auto flex flex-col items-center">

                    {/* Top Button */}
                    <motion.div
                        className="flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-6 sm:mb-8 border border-gray-100 shadow-sm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <FlameIcon />
                        <span className="text-[#1A1F1C] text-[11px] sm:text-xs font-bold tracking-wider uppercase">Investment Benefits</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-semibold text-center leading-tight tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Access Institutional-Grade Real Estate Investing
                    </motion.h2>

                    {/* Grid */}
                    <motion.div
                        className="investment-grid w-full mt-8 sm:mt-12 lg:mt-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* Row 1 */}
                        <div className="investment-grid-row grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Box 1 */}
                            <motion.div variants={itemVariants} className="investment-box-1 flex flex-col p-8 sm:p-10 rounded-2xl bg-[#081316]/40 backdrop-blur-md border border-[#143032] shadow-2xl">
                                <div className="flex flex-row items-center gap-4 sm:gap-5 mb-4 sm:mb-6">
                                    <div className="box-icon-container w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 text-white">
                                        <HomeIcon className="w-full h-full" />
                                    </div>
                                    <h3 className="text-white font-semibold text-lg sm:text-xl leading-snug">
                                        Curated Premium Assets
                                    </h3>
                                </div>
                                <p className="text-[#FFFFFF] text-sm sm:text-base leading-relaxed">
                                    Access handpicked high-growth real estate opportunities across prime global locations.
                                </p>
                            </motion.div>

                            {/* Box 2 */}
                            <motion.div variants={itemVariants} className="investment-box-2 flex flex-col p-8 sm:p-10 rounded-2xl bg-[#081316]/40 backdrop-blur-md border border-[#143032] shadow-2xl">
                                <div className="flex flex-row items-center gap-4 sm:gap-5 mb-4 sm:mb-6">
                                    <div className="box-icon-container w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 text-white">
                                        <LegalIcon className="w-full h-full" />
                                    </div>
                                    <h3 className="text-white font-semibold text-lg sm:text-xl leading-snug">
                                        Fractional Ownership
                                    </h3>
                                </div>
                                <p className="text-[#FFFFFF] text-sm sm:text-base leading-relaxed">
                                    Own premium real estate starting from lower investment amounts without buying the entire asset.
                                </p>
                            </motion.div>
                        </div>

                        {/* Row 2 */}
                        <div className="investment-grid-row grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8">
                            {/* Box 3 */}
                            <motion.div variants={itemVariants} className="investment-box-3 flex flex-col p-8 sm:p-10 rounded-2xl bg-[#081316]/40 backdrop-blur-md border border-[#143032] shadow-2xl">
                                <div className="flex flex-row items-center gap-4 sm:gap-5 mb-4 sm:mb-6">
                                    <div className="box-icon-container w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 text-white">
                                        <EarningPassiveIcon className="w-full h-full" />
                                    </div>
                                    <h3 className="text-white font-semibold text-lg sm:text-xl leading-snug">
                                        Passive Rental Income
                                    </h3>
                                </div>
                                <p className="text-[#FFFFFF] text-sm sm:text-base leading-relaxed">
                                    Receive proportional rental income directly based on your ownership share.
                                </p>
                            </motion.div>

                            {/* Box 4 */}
                            <motion.div variants={itemVariants} className="investment-box-4 flex flex-col p-8 sm:p-10 rounded-2xl bg-[#081316]/40 backdrop-blur-md border border-[#143032] shadow-2xl">
                                <div className="flex flex-row items-center gap-4 sm:gap-5 mb-4 sm:mb-6">
                                    <div className="box-icon-container w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 text-white">
                                        <LiquidityIcon className="w-full h-full" />
                                    </div>
                                    <h3 className="text-white font-semibold text-lg sm:text-xl leading-snug">
                                        Secure & Transparent
                                    </h3>
                                </div>
                                <p className="text-[#FFFFFF] text-sm sm:text-base leading-relaxed">
                                    KYC-verified investing with structured ownership, secure transactions, and transparent reporting.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
