'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    cardLift,
    fadeUp,
    scaleIn,
    staggerContainer,
    useLandingMotion,
} from '@/lib/landingAnimations';

const PROPERTIES = [
    {
        src: '/assets/images/marketplace/property-1.png',
        alt: 'Premium commercial property with illuminated storefront',
    },
    {
        src: '/assets/images/marketplace/property-2.png',
        alt: 'Construction asset with highlighted fractional unit',
    },
    {
        src: '/assets/images/marketplace/property-3.png',
        alt: 'Land parcel with location highlights',
    },
    {
        src: '/assets/images/marketplace/property-4.png',
        alt: 'Residential tower with highlighted premium unit',
    },
] as const;

export default function PremiumPropertySection() {
    const { reduceMotion, viewProps } = useLandingMotion();

    const reveal3D = {
        hidden: { 
            opacity: 0, 
            y: 50,
            rotateX: 12,
            z: -40,
            transformPerspective: 1200
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            z: 0,
            transition: {
                type: "spring" as const,
                stiffness: 60,
                damping: 18,
                mass: 0.8
            }
        }
    };

    return (
        <section id="product" className="premium-section-wrapper relative overflow-hidden" aria-labelledby="premium-properties-heading">
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: "url('/assets/images/backgrounds/benefitsbg.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />
            <div className="premium-section__inner relative z-10">
                <motion.header className="premium-header-container" {...viewProps} variants={fadeUp}>
                    <h2 id="premium-properties-heading" className="premium-title">
                        Premium Properties. Structured Access.
                    </h2>
                    <p className="premium-subtitle">
                        Institutional-grade assets. Digitally simplified.
                    </p>
                </motion.header>

                <motion.div
                    className="premium-properties-grid"
                    {...viewProps}
                    variants={staggerContainer(0.1, 0.08)}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {PROPERTIES.map((property, index) => (
                        <motion.div
                            key={property.src}
                            variants={reveal3D}
                            whileHover={reduceMotion ? undefined : cardLift}
                        >
                            <Link href="/explore" className="premium-property-card group block">
                                <div className="premium-property-card__media">
                                    <Image
                                        src={property.src}
                                        alt={property.alt}
                                        fill
                                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 22vw"
                                        className="premium-property-card__image"
                                        priority={index === 0}
                                    />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
