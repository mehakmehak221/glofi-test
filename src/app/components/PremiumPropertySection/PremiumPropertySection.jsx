'use client';

import React from 'react';
import {
    BanglowImage,
    SkyCraperImage,
    RetailImage,
    FlatBuildingImage,
    RealEstateImage
} from '../SvgIcons';

const PROPERTIES = [
    { id: 1, Component: BanglowImage },
    { id: 2, Component: SkyCraperImage },
    { id: 3, Component: RetailImage },
    { id: 4, Component: RealEstateImage },
    { id: 5, Component: FlatBuildingImage },
];

export default function PremiumPropertySection() {
    return (
        <section className="premium-section-wrapper">
            <div className="mb-10">
                <h2 className="premium-title">
                    Premium Properties. Structured Access.
                </h2>
                <p className="premium-subtitle">
                    Institutional-grade assets. Digitally simplified.
                </p>
            </div>

            <div className="premium-list-section">
                {PROPERTIES.map((prop) => {
                    const IconComponent = prop.Component;
                    return (
                        <div
                            key={prop.id}
                            className="premium-card-exact group flex-shrink-0"
                        >
                            <div className="premium-card-exact__inner bg-[#1A1A1A] w-full h-full flex items-center justify-center">
                                <IconComponent className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
