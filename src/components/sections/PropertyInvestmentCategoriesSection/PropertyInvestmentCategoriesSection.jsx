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
        <section className="property-categories-section">
            {/* Header / Text Content */}
            <div className="flex flex-col items-center text-center max-w-[1276px] w-full mb-[48px]">
                <h2 className="text-property-title mb-[16px]">
                    Property Investment Categories
                </h2>
                <p className="text-property-subtitle">
                    Strategic sourcing. Verified supply. Structured transactions.
                </p>
            </div>

            {/* Grid Container */}
            <div className="property-grid-container flex flex-col gap-[24px]">
                {/* Row 1: Commercial (big) + Premium Residential */}
                <div className="flex flex-col lg:flex-row gap-[24px] w-full">
                    {/* Commercial Offices - wide card */}
                    <div className="flex flex-col flex-1 min-w-0">
                        <div className="w-full aspect-[754/286] overflow-hidden">
                            <HotelImage className="w-full h-full object-cover" />
                        </div>
                        <div className="property-outer-box-commercial">
                            <span className="text-property-category">Commercial Offices</span>
                        </div>
                    </div>

                    {/* Premium Residential */}
                    <div className="flex flex-col lg:w-[38%] flex-shrink-0">
                        <div className="w-full aspect-[477/286] overflow-hidden">
                            <FlatBuildingImage className="w-full h-full object-cover" />
                        </div>
                        <div className="property-outer-box-premium">
                            <span className="text-property-category">Premium Residential</span>
                        </div>
                    </div>
                </div>

                {/* Row 2: Retail + Industrial + Luxury */}
                <div className="flex flex-col lg:flex-row gap-[24px] w-full">
                    {/* Retail & Mixed-Use */}
                    <div className="flex flex-col flex-1 min-w-0">
                        <div className="w-full aspect-[477/267] overflow-hidden">
                            <RetailImage className="w-full h-full object-cover" />
                        </div>
                        <div className="property-outer-box-retail">
                            <span className="text-property-category">Retail &amp; Mixed-Use</span>
                        </div>
                    </div>

                    {/* Industrial & Logistics */}
                    <div className="flex flex-col flex-1 min-w-0">
                        <div className="w-full aspect-[477/268] overflow-hidden">
                            <IndustryImage className="w-full h-full object-cover" />
                        </div>
                        <div className="property-outer-box-industrial">
                            <span className="text-property-category">Industrial &amp; Logistics</span>
                        </div>
                    </div>

                    {/* Luxury Properties */}
                    <div className="flex flex-col lg:w-[22%] flex-shrink-0">
                        <div className="w-full aspect-[266/268] overflow-hidden">
                            <FarmHouseImage className="w-full h-full object-cover" />
                        </div>
                        <div className="property-outer-box-luxury">
                            <span className="text-property-category">Luxury Properties</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
