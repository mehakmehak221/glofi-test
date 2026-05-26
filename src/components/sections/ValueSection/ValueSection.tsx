'use client';

import { motion } from 'framer-motion';
import {
    fadeIn,
    fadeUpSubtle,
    scaleIn,
    staggerContainer,
    useLandingMotion,
} from '@/lib/landingAnimations';

const STATS = [
    { value: '20', label: 'Premium Assets' },
    { value: '₹5k Cr +', label: 'Assets of Worth' },
    { value: '100k+', label: 'Registered Investors' },
] as const;

export default function ValueSection() {
    const { viewProps } = useLandingMotion();

    return (
        <section
            id="values"
            className="bg-[#004852] w-full flex justify-center overflow-hidden border-t border-b border-[#00F4C4]/30"
        >
            <div className="w-full bg-[#004852] py-10 sm:py-12 z-10">
                <motion.div
                    className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-around gap-8 md:gap-4"
                    {...viewProps}
                    variants={staggerContainer(0.18, 0.05)}
                >
                    <motion.div
                        className="flex flex-col items-center text-center"
                        variants={fadeUpSubtle}
                    >
                        <motion.div variants={scaleIn} whileHover={{ scale: 1.06 }}>
                            <span className="text-3xl sm:text-4xl md:text-5xl font-Montserrat font-bold text-white tracking-tight block">
                                {STATS[0].value}
                            </span>
                            <span className="text-sm sm:text-base text-white font-Montserrat mt-2 font-medium block">
                                {STATS[0].label}
                            </span>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="hidden md:block w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#00F4C4] shrink-0"
                        variants={fadeIn}
                        aria-hidden
                    />

                    <motion.div
                        className="flex flex-col items-center text-center"
                        variants={fadeUpSubtle}
                    >
                        <motion.div variants={scaleIn} whileHover={{ scale: 1.06 }}>
                            <span className="text-3xl sm:text-4xl md:text-5xl font-Montserrat font-bold text-white tracking-tight block">
                                {STATS[1].value}
                            </span>
                            <span className="text-sm sm:text-base text-white font-Montserrat mt-2 font-medium block">
                                {STATS[1].label}
                            </span>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="hidden md:block w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#00F4C4] shrink-0"
                        variants={fadeIn}
                        aria-hidden
                    />

                    <motion.div
                        className="flex flex-col items-center text-center"
                        variants={fadeUpSubtle}
                    >
                        <motion.div variants={scaleIn} whileHover={{ scale: 1.06 }}>
                            <span className="text-3xl sm:text-4xl md:text-5xl font-Montserrat font-bold text-white tracking-tight block">
                                {STATS[2].value}
                            </span>
                            <span className="text-sm sm:text-base text-white font-Montserrat mt-2 font-medium block">
                                {STATS[2].label}
                            </span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
