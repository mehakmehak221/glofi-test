'use client';

import React from 'react';
import { GlobalScaleGlobeImage } from '../../VectorImages';

export default function GlobalScaleSection() {
    return (
        <section className="bg-[#021411] w-full flex justify-center overflow-hidden">
            <div className="global-scale-section-wrapper w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative">
                {/* Text Content — left side */}
                <div className="flex flex-col justify-center text-left w-full lg:max-w-2xl xl:max-w-3xl z-10 relative">
                    <span className="text-global-scale-label mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base">
                        GLOBAL SCALE
                    </span>

                    <h2 className="text-global-scale-title mb-4 sm:mb-5 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                        A Smarter Way to<br />Own Real Estate
                    </h2>

                    <p className="text-global-scale-desc text-xs sm:text-sm lg:text-base max-w-lg">
                        Glofi Real Estate connects property owners and investors
                        through a structured digital marketplace designed for
                        transparency, efficiency, and long-term value creation.
                    </p>
                </div>

                {/* Globe Image — right side */}
                <div className="global-scale-globe-container absolute right-0 top-0 h-full w-auto opacity-20 lg:opacity-40 xl:opacity-60 hidden xl:block">
                    <GlobalScaleGlobeImage className="w-full h-full object-contain" />
                </div>
            </div>
        </section>
    );
}
