'use client';

import React from 'react';
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
    return (
        <section className="premium-section-wrapper py-8 sm:py-12 lg:py-16 xl:py-20 2xl:py-24">
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                <div className="premium-header-container mb-6 sm:mb-8 lg:mb-10 w-full text-left">
                    <h2 className="premium-title text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                        Premium Properties. Structured Access.
                    </h2>
                    <p className="premium-subtitle text-xs sm:text-xs lg:text-sm mt-2 sm:mt-3">
                        Institutional-grade assets. Digitally simplified.
                    </p>
                </div>

                <div className="premium-list-section overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 sm:gap-4 lg:gap-6 pb-4">
                        {PROPERTIES.map((prop) => {
                        const IconComponent = prop.Component;
                        return (
                            <div
                                key={prop.id}
                                className="premium-card-exact group flex-shrink-0 w-56 sm:w-64 md:w-72 lg:w-80 xl:w-[320px] 2xl:w-[360px]"
                            >
                                <div className="premium-card-exact__inner bg-[#1A1A1A] w-full h-full flex items-center justify-center rounded-2xl overflow-hidden">
                                    <IconComponent className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            </div>
        </section>
    );
}
