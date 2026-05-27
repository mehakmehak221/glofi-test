'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ThreeDRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function ThreeDReveal({ children, className = "", delay = 0 }: ThreeDRevealProps) {
    return (
        <div className={`relative [perspective:1200px] ${className}`}>
            <motion.div
                initial={{ 
                    opacity: 0, 
                    y: 60, 
                    rotateX: 12, 
                    z: -60,
                    transformPerspective: 1200 
                }}
                whileInView={{ 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0, 
                    z: 0 
                }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                    type: "spring",
                    stiffness: 60,
                    damping: 18,
                    mass: 0.8,
                    delay
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-full h-full origin-center"
            >
                {children}
            </motion.div>
        </div>
    );
}
