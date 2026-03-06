'use client';

import React from 'react';
import { HomeIcon, LegalIcon, EarningPassiveIcon, LiquidityIcon } from '../../VectorImages';

export default function InvestmentSection() {
    return (
        <section className="bg-transparent flex flex-col items-center">
            {/* Using inline styles or classes for wrapping to ensure exact Figma properties apply correctly if the container inherits full width */}
            <div className="investment-section-wrapper flex flex-col items-center">

                {/* Top Button */}
                <div className="btn-inside-platform mb-[24px]">
                    <span className="text-inside-platform">Inside the Platform</span>
                </div>

                {/* Title */}
                <h2 className="text-investment-title">
                    Unleash the Potential of GloFi
                </h2>

                {/* Grid */}
                <div className="investment-grid">
                    {/* Row 1 */}
                    <div className="investment-grid-row">
                        {/* Box 1 */}
                        <div className="investment-box-1">
                            <div className="flex flex-col gap-[20px]">
                                <div className="box-icon-container">
                                    <HomeIcon className="w-full h-full" />
                                </div>
                                <h3 className="text-investment-box-title">
                                    Invest in Curated<br />Properties
                                </h3>
                            </div>
                            <p className="text-investment-box-desc">
                                Explore trending tokens, top-performing<br />
                                assets, and real-time market insights<br />
                                all in one place.
                            </p>
                        </div>

                        {/* Box 2 */}
                        <div className="investment-box-2">
                            <div className="flex flex-col gap-[20px]">
                                <div className="box-icon-container">
                                    <LegalIcon className="w-full h-full" />
                                </div>
                                <h3 className="text-investment-box-title">
                                    Legally Structured<br />Fractional Ownership
                                </h3>
                            </div>
                            <p className="text-investment-box-desc">
                                Own verified shares in high-value real estate<br />
                                with secure digital certification and<br />
                                transparent documentation.
                            </p>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="investment-grid-row">
                        {/* Box 3 */}
                        <div className="investment-box-3">
                            <div className="flex flex-col gap-[20px]">
                                <div className="box-icon-container">
                                    <EarningPassiveIcon className="w-full h-full" />
                                </div>
                                <h3 className="text-investment-box-title">
                                    Earn Passive<br />Rental Income
                                </h3>
                            </div>
                            <p className="text-investment-box-desc">
                                Receive proportional rental income<br />
                                directly based on your ownership<br />
                                share.
                            </p>
                        </div>

                        {/* Box 4 */}
                        <div className="investment-box-4">
                            <div className="flex flex-col gap-[20px]">
                                <div className="box-icon-container">
                                    <LiquidityIcon className="w-full h-full" />
                                </div>
                                <h3 className="text-investment-box-title">
                                    Liquidity &<br />Resale Options
                                </h3>
                            </div>
                            <p className="text-investment-box-desc">
                                List your ownership stake on the<br />
                                marketplace for seamless secondary<br />
                                transactions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
