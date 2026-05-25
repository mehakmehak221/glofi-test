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
        <section className="w-full flex flex-col items-center bg-white py-16 ">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              

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
                        <div className="h-12 sm:h-14 md:h-16 lg:h-[72px] min-w-[110px] sm:min-w-[125px] flex items-center justify-center [&>img]:h-full [&>img]:w-auto [&>svg]:h-full [&>svg]:w-auto">
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
