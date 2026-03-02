'use client';

import React from 'react';
import { GlobalScaleGlobeImage } from '../SvgIcons';

export default function GlobalScaleSection() {
    return (
        <section className="bg-[#000403] py-20 lg:py-32 w-full flex justify-center overflow-hidden">
            <div className="global-scale-section-wrapper">
                {/* Text Content — left side */}
                <div className="flex flex-col justify-center text-left w-full max-w-[500px] z-10 pl-6 lg:pl-[120px] pr-6 lg:pr-0 self-center">
                    <span className="text-global-scale-label mb-4">
                        GLOBAL SCALE
                    </span>

                    <h2 className="text-global-scale-title mb-5">
                        A Smarter Way to<br />Own Real Estate
                    </h2>

                    <p className="text-global-scale-desc">
                        Glofi Real Estate connects property owners and investors
                        through a structured digital marketplace designed for
                        transparency, efficiency, and long-term value creation.
                    </p>
                </div>

                {/* Globe Image — right side */}
                <div className="global-scale-globe-container">
                    <GlobalScaleGlobeImage className="w-full h-full" />
                </div>
            </div>
        </section>
    );
}
