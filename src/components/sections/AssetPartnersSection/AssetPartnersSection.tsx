'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
    AumRealties, 
    RavLogo, 
    RscLogo, 
    ElequeLogo, 
    NestoriaLogo, 
    PartnerLogo 
} from '@/components/VectorImages';

export default function AssetPartnersSection() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    return (
        <section className="w-full flex flex-col items-center bg-black py-16 ">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="flex flex-col items-center text-center justify-center mb-10"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-4xl font-Montserrat font-bold text-white tracking-widest uppercase opacity-90">
                        Asset Partners
                    </h2>
                    <div className="w-20 h-1 bg-[#00F4C4] mt-4 rounded-full shadow-[0_0_10px_#00F4C4]" />
                </motion.div>

                <motion.div 
                    className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-12 gap-y-4 w-full"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={containerVariants}
                >
                   
                    <motion.div 
                        className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-105"
                        variants={itemVariants}
                    >
                        <div className="h-8 sm:h-10 md:h-12 lg:h-14 flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto">
                            <AumRealties />
                        </div>
                    </motion.div>

                    
                    <motion.div 
                        className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-105"
                        variants={itemVariants}
                    >
                        <div className="h-8 sm:h-10 md:h-12 lg:h-14 flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto">
                            <RavLogo />
                        </div>
                    </motion.div>

                   
                    <motion.div 
                        className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-105"
                        variants={itemVariants}
                    >
                        <div className="h-8 sm:h-10 md:h-12 lg:h-14 flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto">
                            <RscLogo />
                        </div>
                    </motion.div>

                  
                    <motion.div 
                        className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-105"
                        variants={itemVariants}
                    >
                        <div className="h-8 sm:h-10 md:h-12 lg:h-14 flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto">
                            <ElequeLogo />
                        </div>
                    </motion.div>

                   
                    <motion.div 
                        className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-105"
                        variants={itemVariants}
                    >
                        <div className="h-8 sm:h-10 md:h-12 lg:h-14 flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto">
                            <NestoriaLogo />
                        </div>
                    </motion.div>

                   
                    <motion.div 
                        className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-105"
                        variants={itemVariants}
                    >
                        <div className="h-8 sm:h-10 md:h-12 lg:h-14 flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto">
                            <PartnerLogo />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
