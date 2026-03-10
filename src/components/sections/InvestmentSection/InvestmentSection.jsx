'use client';

import React from 'react';
import { HomeIcon, LegalIcon, EarningPassiveIcon, LiquidityIcon } from '../../VectorImages';

export default function InvestmentSection() {
    return (
        <section className="bg-transparent flex flex-col items-center w-full">
            <div className="investment-section-wrapper w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                <div className="w-full mx-auto flex flex-col items-center">

                    {/* Top Button */}
                    <div className="btn-inside-platform mb-6 sm:mb-8">
                        <span className="text-inside-platform text-xs sm:text-sm lg:text-base">Inside the Platform</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-investment-title text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center">
                        Unleash the Potential of GloFi
                    </h2>

                    {/* Grid */}
                    <div className="investment-grid w-full mt-8 sm:mt-12 lg:mt-16">
                        {/* Row 1 */}
                        <div className="investment-grid-row grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Box 1 */}
                            <div className="investment-box-1">
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
                            </div>

                            {/* Box 2 */}
                            <div className="investment-box-2">
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
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="investment-grid-row grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8">
                            {/* Box 3 */}
                            <div className="investment-box-3">
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
                            </div>

                            {/* Box 4 */}
                            <div className="investment-box-4">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
