
'use client';

import React from 'react';

const STEPS = [
    {
        number: '01',
        title: 'BROWSE CURATED PROPERTIES',
        description: 'Explore premium residential and commercial real estate opportunities.',
    },
    {
        number: '02',
        title: 'INVEST FRACTIONALLY',
        description: 'Purchase ownership shares at accessible investment levels.',
    },
    {
        number: '03',
        title: 'EARN & EXIT',
        description: 'Generate rental income and exit through the marketplace when ready.',
    },
];

export default function WorkingInstructionsSection() {
    return (
        <section className="w-full flex justify-center bg-black">
            <div className="hiw-section-wrapper w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-16 sm:py-20 lg:py-24 xl:py-32 2xl:py-40">
                <div className="flex flex-col items-center w-full">
                    <div className="flex flex-col items-center text-center justify-center mb-12 sm:mb-16 lg:mb-20">
                        <div className="how-it-works-pill mb-6 px-5 py-2 bg-[#050505] border border-[#00F4C4] rounded-full text-[#00F4C4] text-sm sm:text-base">
                            How It Works
                        </div>

                        <h2 className="how-it-works-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white">
                            Get GloFi-Ready In Just 3 Steps
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full max-w-6xl">
                        {STEPS.map((step, index) => (
                            <div
                                key={index}
                                className="step-card-box bg-[#050505] border-2 border-[#00F4C4] p-6 sm:p-8 rounded-lg backdrop-blur-sm transition-transform hover:translate-y-[-2px] min-h-[280px] flex flex-col justify-between"
                            >
                                <span className="step-number-bg text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-[#001812] to-[#007E5F] bg-clip-text text-transparent mb-4">
                                    {step.number}
                                </span>

                                <h3 className="step-title-text text-lg sm:text-xl lg:text-2xl font-bold text-[#F5F5F5] mb-3 uppercase tracking-wider">
                                    {step.title}
                                </h3>

                                <p className="step-desc-text text-sm sm:text-base text-[#D5D7DA] leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
