'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { HomeIcon, LegalIcon, EarningPassiveIcon, LiquidityIcon } from '../../VectorImages';

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
        hidden: { opacity: 0, y: 30 },
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
        <section id="product" className="flex flex-col items-center w-full relative overflow-hidden">
            
            <div 
                className="absolute inset-0 z-0 pointer-events-none opacity-40 lg:opacity-60"
                style={{
                    backgroundImage: "url('/assets/images/backgrounds/potential-bg.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />
            <div className="investment-section-wrapper w-full z-10 relative">
                <div className="w-full mx-auto flex flex-col items-center">

                    {/* Top Button */}
                    <motion.div 
                        className="btn-inside-platform mb-6 sm:mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-inside-platform text-xs sm:text-sm lg:text-base px-4 py-2 text-[#ACFFEF]">Inside the Platform</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h2 
                        className="text-investment-title text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Unleash the Potential of Glofi
                    </motion.h2>

                    {/* Grid */}
                    <motion.div 
                        className="investment-grid w-full mt-8 sm:mt-12 lg:mt-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                    >
                        {/* Row 1 */}
                        <div className="investment-grid-row grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Box 1 */}
                            <motion.div variants={itemVariants} className="investment-box-1 p-6 sm:p-8 rounded-2xl bg-transparent border border-[var(--color-primary-200)]">
                                <div className="flex flex-col gap-4 sm:gap-6">
                                    <div className="box-icon-container w-12 h-12 sm:w-14 sm:h-14">
                                        <HomeIcon className="w-full h-full" />
                                    </div>
                                    <h3 className="text-investment-box-title text-base sm:text-lg lg:text-xl xl:text-2xl">
                                        Invest in Curated<br />Properties
                                    </h3>
                                </div>
                                <p className="text-investment-box-desc text-xs sm:text-sm lg:text-base mt-4">
                                    Explore trending tokens, top-performing<br />
                                    assets, and real-time market insights<br />
                                    all in one place.
                                </p>
                            </motion.div>

                            {/* Box 2 */}
                            <motion.div variants={itemVariants} className="investment-box-2 p-6 sm:p-8 rounded-2xl bg-transparent border border-[var(--color-primary-200)]">
                                <div className="flex flex-col gap-4 sm:gap-6">
                                    <div className="box-icon-container w-12 h-12 sm:w-14 sm:h-14">
                                        <LegalIcon className="w-full h-full" />
                                    </div>
                                    <h3 className="text-investment-box-title text-base sm:text-lg lg:text-xl xl:text-2xl">
                                        Legally Structured<br />Fractional Ownership
                                    </h3>
                                </div>
                                <p className="text-investment-box-desc text-xs sm:text-sm lg:text-base mt-4">
                                    Own verified shares in high-value real estate<br />
                                    with secure digital certification and<br />
                                    transparent documentation.
                                </p>
                            </motion.div>
                        </div>

                        {/* Row 2 */}
                        <div className="investment-grid-row grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8">
                            {/* Box 3 */}
                            <motion.div variants={itemVariants} className="investment-box-3 p-6 sm:p-8 rounded-2xl bg-transparent border border-[var(--color-primary-200)]">
                                <div className="flex flex-col gap-4 sm:gap-6">
                                    <div className="box-icon-container w-12 h-12 sm:w-14 sm:h-14">
                                        <EarningPassiveIcon className="w-full h-full" />
                                    </div>
                                    <h3 className="text-investment-box-title text-base sm:text-lg lg:text-xl xl:text-2xl">
                                        Earn Passive<br />Rental Income
                                    </h3>
                                </div>
                                <p className="text-investment-box-desc text-xs sm:text-sm lg:text-base mt-4">
                                    Receive proportional rental income<br />
                                    directly based on your ownership<br />
                                    share.
                                </p>
                            </motion.div>

                            {/* Box 4 */}
                            <motion.div variants={itemVariants} className="investment-box-4 p-6 sm:p-8 rounded-2xl bg-transparent border border-[var(--color-primary-200)]">
                                <div className="flex flex-col gap-4 sm:gap-6">
                                    <div className="box-icon-container w-12 h-12 sm:w-14 sm:h-14">
                                        <LiquidityIcon className="w-full h-full" />
                                    </div>
                                    <h3 className="text-investment-box-title text-base sm:text-lg lg:text-xl xl:text-2xl">
                                        Liquidity &<br />Resale Options
                                    </h3>
                                </div>
                                <p className="text-investment-box-desc text-xs sm:text-sm lg:text-base mt-4">
                                    List your ownership stake on the<br />
                                    marketplace for seamless secondary<br />
                                    transactions.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
