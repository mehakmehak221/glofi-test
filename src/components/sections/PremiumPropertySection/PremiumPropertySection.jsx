'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    BanglowImage,
    SkyCraperImage,
    RetailImage,
    FlatBuildingImage,
    RealEstateImage
} from '../../VectorImages';

const PROPERTIES = [
    { id: 1, Component: BanglowImage },
    { id: 2, Component: SkyCraperImage },
    { id: 3, Component: RetailImage },
    { id: 4, Component: RealEstateImage },
    { id: 5, Component: FlatBuildingImage },
];

export default function PremiumPropertySection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
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
        <section className="premium-section-wrapper py-8 sm:py-12 lg:py-16 xl:py-20 2xl:py-24">
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">

                {/* Header — fades up on scroll */}
                <motion.div
                    className="premium-header-container mb-6 sm:mb-8 lg:mb-10 w-full text-left"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={itemVariants}
                >
                    <h2 className="premium-title text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-Montserrat">
                        Premium Properties. Structured Access.
                    </h2>
                    <p className="premium-subtitle text-sm sm:text-sm lg:text-lg mt-2 sm:mt-3 font-Montserrat">
                        Institutional-grade assets. Digitally simplified.
                    </p>
                </motion.div>

                {/* Cards — staggered slide-in on scroll */}
                <div className="premium-list-section overflow-x-auto scrollbar-hide">
                    <motion.div 
                        className="flex gap-3 sm:gap-4 lg:gap-6 pb-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                    >
                        {PROPERTIES.map((prop, index) => {
                            const IconComponent = prop.Component;
                            return (
                                <motion.div
                                    key={prop.id}
                                    variants={itemVariants}
                                    className="premium-card-exact group flex-shrink-0 w-56 sm:w-64 md:w-72 lg:w-80 xl:w-[320px] 2xl:w-[360px]"
                                >
                                    <div className="relative premium-card-exact__inner bg-[var(--color-bg-card)] w-full h-full flex items-center justify-center rounded-2xl overflow-hidden
                                        transition-all duration-500
                                        group-hover:shadow-[0_0_32px_4px_var(--color-primary-300-alpha-30)]
                                        group-hover:scale-[1.03]">

                                        <IconComponent className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                                        {/* Shimmer sweep on hover */}
                                        <span className="pointer-events-none absolute inset-0 rounded-2xl
                                            -translate-x-full group-hover:translate-x-full
                                            transition-transform duration-700 ease-in-out
                                            bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
