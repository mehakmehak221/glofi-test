'use client';

import React from 'react';
import {
    HotelImage,
    FlatBuildingImage,
    RetailImage,
    IndustryImage,
    FarmHouseImage
} from '../SvgIcons';

export default function PropertyInvestmentCategoriesSection() {
    return (
        <section className="property-categories-section flex flex-col items-center justify-center">
            {/* Header / Text Content */}
            <div className="flex flex-col items-center text-center max-w-[1276px] w-full mb-[60px]">
                <h2 className="text-property-title mb-[20px]">
                    Property Investment Categories
                </h2>
                <p className="text-property-subtitle">
                    Strategic sourcing. Verified supply. Structured transactions.
                </p>
            </div>

            {/* Grid Container */}
            <div className="property-grid-container flex flex-col gap-[44px]">
                {/* Row 1 */}
                <div className="flex flex-col xl:flex-row gap-[44px] justify-center items-center">
                    {/* Commercial Offices */}
                    <div className="property-frame-commercial flex flex-col items-center">
                        <div className="w-full xl:w-[754px] aspect-[754/286] overflow-hidden">
                            <HotelImage className="w-full h-full object-cover" />
                        </div>
                        <div className="property-outer-box-commercial flex items-center justify-center xl:justify-start">
                            <span className="text-property-category">Commercial Offices</span>
                        </div>
                    </div>

                    {/* Premium Residential */}
                    <div className="property-frame-premium flex flex-col items-center">
                        <div className="w-full xl:w-[477px] aspect-[477/286] overflow-hidden">
                            <FlatBuildingImage className="w-full h-full object-cover" />
                        </div>
                        <div className="property-outer-box-premium flex items-center justify-center xl:justify-start">
                            <span className="text-property-category">Premium Residential</span>
                        </div>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="flex flex-col xl:flex-row gap-[44px] justify-center items-center">
                    {/* Retail & Mixed-Use */}
                    <div className="property-frame-retail flex flex-col items-center">
                        <div className="w-full xl:w-[477px] aspect-[477/267] overflow-hidden">
                            <RetailImage className="w-full h-full object-cover" />
                        </div>
                        <div className="property-outer-box-retail flex items-center justify-center xl:justify-start">
                            <span className="text-property-category">Retail & Mixed-Use</span>
                        </div>
                    </div>

                    {/* Industrial & Logistics */}
                    <div className="property-frame-industrial flex flex-col items-center">
                        <div className="w-full xl:w-[477px] aspect-[477/268] overflow-hidden">
                            <IndustryImage className="w-full h-full object-cover" />
                        </div>
                        <div className="property-outer-box-industrial flex items-center justify-center xl:justify-start">
                            <span className="text-property-category">Industrial & Logistics</span>
                        </div>
                    </div>

                    {/* Luxury Properties */}
                    <div className="property-frame-luxury flex flex-col items-center">
                        <div className="w-full xl:w-[266px] aspect-[266/268] overflow-hidden">
                            <FarmHouseImage className="w-full h-full object-cover" />
                        </div>
                        <div className="property-outer-box-luxury flex items-center justify-center xl:justify-start">
                            <span className="text-property-category">Luxury Properties</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
