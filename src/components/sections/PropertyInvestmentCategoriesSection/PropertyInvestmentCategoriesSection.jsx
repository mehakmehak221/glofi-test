'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    HotelImage,
    FlatBuildingImage,
    RetailImage,
    IndustryImage
} from '../../VectorImages';

export default function PropertyInvestmentCategoriesSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
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
        <section className="property-categories-section w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-16 sm:py-20 lg:py-24 xl:py-32 2xl:py-40">
            <div className="w-full mx-auto flex flex-col items-start">
                {/* Header / Text Content */}
                <motion.div 
                    className="flex flex-col items-start text-left max-w-4xl w-full mb-8 sm:mb-12 lg:mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={itemVariants}
                >
                    <h2 className="text-property-title mb-4">
                        Property Investment Categories
                    </h2>
                    <p className="text-property-subtitle">
                        Strategic sourcing. Verified supply. Structured transactions.
                    </p>
                </motion.div>

                {/* Grid Container */}
                <motion.div 
                    className="property-grid-container flex flex-col gap-6 sm:gap-8 lg:gap-12 w-full"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    {/* Row 1: Commercial (wide) + Premium Residential (normal) */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 w-full">
                        {/* Commercial Offices - wide card */}
                        <motion.div variants={itemVariants} className="flex flex-col lg:col-span-3 min-w-0 group">
                            <div className="w-full h-48 sm:h-56 lg:h-72 rounded-t-2xl border border-[var(--color-border-subtle)] border-b-0 overflow-hidden bg-[var(--color-bg-surface-subtle)]">
                                <HotelImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <div className="property-outer-box-commercial">
                                <span className="text-property-category text-xs sm:text-sm lg:text-base">Commercial Offices</span>
                            </div>
                        </motion.div>

                        {/* Premium Residential */}
                        <motion.div variants={itemVariants} className="flex flex-col lg:col-span-2 min-w-0 group">
                            <div className="w-full h-48 sm:h-56 lg:h-72 rounded-t-2xl border border-[var(--color-border-subtle)] border-b-0 overflow-hidden bg-[var(--color-bg-surface-subtle)]">
                                <FlatBuildingImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <div className="property-outer-box-premium">
                                <span className="text-property-category text-xs sm:text-sm lg:text-base">Premium Residential</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Row 2: Retail + Industrial + Land Parcels */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full">
                        {/* Retail & Mixed-Use */}
                        <motion.div variants={itemVariants} className="flex flex-col min-w-0 group">
                            <div className="w-full h-48 sm:h-56 lg:h-64 rounded-t-2xl border border-[var(--color-border-subtle)] border-b-0 overflow-hidden bg-[var(--color-bg-surface-subtle)]">
                                <RetailImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <div className="property-outer-box-retail">
                                <span className="text-property-category text-xs sm:text-sm lg:text-base">Retail &amp; Mixed-Use</span>
                            </div>
                        </motion.div>

                        {/* Industrial & Logistics */}
                        <motion.div variants={itemVariants} className="flex flex-col min-w-0 group">
                            <div className="w-full h-48 sm:h-56 lg:h-64 rounded-t-2xl border border-[var(--color-border-subtle)] border-b-0 overflow-hidden bg-[var(--color-bg-surface-subtle)]">
                                <IndustryImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <div className="property-outer-box-industrial">
                                <span className="text-property-category text-xs sm:text-sm lg:text-base">Industrial &amp; Logistics</span>
                            </div>
                        </motion.div>

                        {/* Land Parcels */}
                        <motion.div variants={itemVariants} className="relative flex flex-col min-w-0 group">
                            <div className="relative w-full h-48 sm:h-56 lg:h-64 rounded-t-2xl border border-[var(--color-border-subtle)] border-b-0 overflow-hidden bg-[var(--color-bg-surface-subtle)]">
                                <Image
                                    src="/assets/farmhouseimage.jpg"
                                    alt="Land Parcels"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="property-outer-box-luxury">
                                <span className="text-property-category text-xs sm:text-sm lg:text-base">Land Parcels</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
