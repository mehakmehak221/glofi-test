'use client';

import React from 'react';
import {
    HotelImage,
    FlatBuildingImage,
    RetailImage,
    IndustryImage,
    FarmHouseImage
} from '../../VectorImages';

export default function PropertyInvestmentCategoriesSection() {
    return (
        <section className="property-categories-section w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-16 sm:py-20 lg:py-24 xl:py-32 2xl:py-40">
            <div className="w-full mx-auto flex flex-col items-center">
                {/* Header / Text Content */}
                <div className="flex flex-col items-center text-center max-w-4xl w-full mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-property-title mb-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                        Property Investment Categories
                    </h2>
                    <p className="text-property-subtitle text-xs sm:text-sm lg:text-base">
                        Strategic sourcing. Verified supply. Structured transactions.
                    </p>
                </div>

                {/* Grid Container */}
                <div className="property-grid-container flex flex-col gap-6 sm:gap-8 lg:gap-12 w-full">
                    {/* Row 1: Commercial (big) + Premium Residential */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 w-full">
                        {/* Commercial Offices - wide card */}
                        <div className="flex flex-col xl:col-span-1 min-w-0">
                            <div className="w-full h-48 sm:h-56 lg:h-64 rounded-2xl border border-[var(--color-border-subtle)] overflow-hidden bg-[var(--color-bg-surface-subtle)]">
                                <HotelImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <div className="property-outer-box-commercial mt-3 sm:mt-4">
                                <span className="text-property-category text-xs sm:text-sm lg:text-base">Commercial Offices</span>
                            </div>
                        </div>

                        {/* Premium Residential */}
                        <div className="flex flex-col xl:col-span-1 min-w-0">
                            <div className="w-full h-48 sm:h-56 lg:h-64 rounded-2xl border border-[var(--color-border-subtle)] overflow-hidden bg-[var(--color-bg-surface-subtle)]">
                                <FlatBuildingImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <div className="property-outer-box-premium mt-3 sm:mt-4">
                                <span className="text-property-category text-xs sm:text-sm lg:text-base">Premium Residential</span>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Retail + Industrial + Luxury */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full">
                        {/* Retail & Mixed-Use */}
                        <div className="flex flex-col min-w-0">
                            <div className="w-full h-48 sm:h-56 lg:h-64 rounded-2xl border border-[var(--color-border-subtle)] overflow-hidden bg-[var(--color-bg-surface-subtle)]">
                                <RetailImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <div className="property-outer-box-retail mt-3 sm:mt-4">
                                <span className="text-property-category text-xs sm:text-sm lg:text-base">Retail &amp; Mixed-Use</span>
                            </div>
                        </div>

                        {/* Industrial & Logistics */}
                        <div className="flex flex-col min-w-0">
                            <div className="w-full h-48 sm:h-56 lg:h-64 rounded-2xl border border-[var(--color-border-subtle)] overflow-hidden bg-[var(--color-bg-surface-subtle)]">
                                <IndustryImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <div className="property-outer-box-industrial mt-3 sm:mt-4">
                                <span className="text-property-category text-xs sm:text-sm lg:text-base">Industrial &amp; Logistics</span>
                            </div>
                        </div>

                        {/* Luxury Properties */}
                        <div className="flex flex-col xl:col-span-1">
                            <div className="w-full h-48 sm:h-56 lg:h-64 rounded-2xl border border-[var(--color-border-subtle)] overflow-hidden bg-[var(--color-bg-surface-subtle)]">
                                <FarmHouseImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <div className="property-outer-box-luxury mt-3 sm:mt-4">
                                <span className="text-property-category text-xs sm:text-sm lg:text-base">Luxury Properties</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
