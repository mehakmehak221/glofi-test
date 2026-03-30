'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlobalScaleGlobeImage } from '../../VectorImages';

export default function GlobalScaleSection() {
    return (
        <section id="company" className="bg-[#021411] w-full flex justify-center overflow-hidden border-t border-b border-[#00F4C4]/30">
            <div className="global-scale-section-wrapper w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative py-20 sm:py-24 lg:py-32 xl:py-40">
                {/* Text Content — left side */}
                <motion.div 
                    className="flex flex-col justify-center text-left w-full lg:max-w-xl xl:max-w-2xl z-10 relative"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="text-global-scale-label mb-4 sm:mb-6 text-[10px] sm:text-xs lg:text-sm tracking-[0.2em] font-Montserrat">
                        GLOBAL SCALE
                    </span>

                    <h2 className="text-global-scale-title mb-6 sm:mb-8 text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-Montserrat leading-tight">
                        A Smarter Way to<br />Own Real Estate
                    </h2>

                    <p className="text-global-scale-desc text-sm sm:text-base lg:text-lg max-w-lg leading-relaxed opacity-70">
                        Glofi Real Estate connects property owners and investors
                        through a structured digital marketplace designed for
                        transparency, efficiency, and long-term value creation.
                    </p>
                </motion.div>

                {/* Globe Image — right side */}
                <motion.div 
                    className="global-scale-globe-container absolute right-0 top-1/2 -translate-y-1/2 h-full w-[55%] sm:w-[50%] lg:w-[60%] hidden lg:flex items-center justify-end z-0 pointer-events-none"
                    initial={{ opacity: 0, x: 100, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    <GlobalScaleGlobeImage className="h-full w-auto object-contain object-right transform scale-110 origin-right translate-x-[15%]" />
                </motion.div>
            </div>
        </section>
    );
}
