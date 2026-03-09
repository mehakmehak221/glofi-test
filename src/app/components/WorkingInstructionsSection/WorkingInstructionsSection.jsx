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
        <section className="hiw-section-wrapper">
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col items-center text-center justify-center mb-16 md:mb-[60px]">
                    <div className="how-it-works-pill mb-6">
                        How It Works
                    </div>

                    <h2 className="how-it-works-title">
                        Get GloFi-Ready In Just 3 Steps
                    </h2>
                    
                </div>
               
                <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 w-full max-w-[1100px]">
                    {STEPS.map((step, index) => (
                        <div
                            key={index}
                            className="step-card-box"
                        >
                            <span className="step-number-bg">
                                {step.number}
                            </span>

                            <h3 className="step-title-text">
                                {step.title}
                            </h3>

                            <p className="step-desc-text">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
