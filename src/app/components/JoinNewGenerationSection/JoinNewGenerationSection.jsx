'use client';

import React from 'react';
import { TopRightArrowIcon } from '../SvgIcons';

export default function JoinNewGenerationSection() {
    return (
        <section className="w-full flex justify-center bg-[#000000]">
            <div className="join-new-gen-wrapper">
                <div className="join-new-gen-inner">
                    <div className="join-new-gen-glow" />

                    <h2 className="text-join-title z-10 relative">
                        Join the new generation<br />of real estate investors.
                    </h2>

                    <p className="text-join-subtitle z-10 relative">
                        START SMALL. OWN BIG
                    </p>

                    <button className="btn-get-started-now z-10 relative hover:scale-105 transition-transform">
                        <span className="text-get-started-now">Get started now</span>
                        <TopRightArrowIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
}
