'use client';

import React from 'react';
import { GlobalScaleGlobeImage } from '../SvgIcons';

export default function GlobalScaleSection() {
    return (
        <section className="bg-[#000403] py-24 md:py-32 w-full flex justify-center">
            <div className="global-scale-section-wrapper">
                {/* Left Content */}
                <div className="flex flex-col justify-center text-left max-w-[500px] z-10 pl-[120px]">
                    <span className="text-global-scale-label mb-[16px]">
                        GLOBAL SCALE
                    </span>

                    <h2 className="text-global-scale-title mb-[20px]">
                        A Smarter Way to<br />Own Real Estate
                    </h2>

                    <p className="text-global-scale-desc">
                        Glofi Real Estate connects property owners and investors
                        through a structured digital marketplace designed for
                        transparency, efficiency, and long-term value creation.
                    </p>
                </div>

                {/* Right Globe / Visual */}
                <div className="global-scale-globe-container">
                     <GlobalScaleGlobeImage className="w-full h-full" />
                </div>
            </div>
        </section>
    );
}
