'use client';

import { motion } from 'framer-motion';
import {
    AumRealties,
    RavLogo,
    RscLogo,
    ElequeLogo,
    NestoriaLogo,
    PartnerLogo,
} from '@/components/VectorImages';
import {
    fadeUp,
    fadeUpSubtle,
    scaleIn,
    staggerContainer,
    useLandingMotion,
} from '@/lib/landingAnimations';

const PARTNERS = [
    { id: 'aum', Logo: AumRealties },
    { id: 'rav', Logo: RavLogo },
    { id: 'rsc', Logo: RscLogo },
    { id: 'eleque', Logo: ElequeLogo },
    { id: 'nestoria', Logo: NestoriaLogo },
    { id: 'partner', Logo: PartnerLogo },
] as const;

export default function AssetPartnersSection() {
    const { reduceMotion, viewProps } = useLandingMotion();

    return (
        <section className="asset-partners-section w-full flex flex-col items-center bg-[#F6F9F8] py-20 sm:py-24 lg:py-32">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    className="text-center text-[#111111] font-semibold tracking-[-0.045em] text-[clamp(1.5rem,2.7vw,2.35rem)] leading-tight mb-8 sm:mb-10"
                    {...viewProps}
                    variants={fadeUp}
                >
                    Asset Partners &amp; Supporters
                </motion.h2>

                <motion.div
                    className="asset-partners-grid"
                    {...viewProps}
                    variants={staggerContainer(0.1, 0.06)}
                >
                    {PARTNERS.map(({ id, Logo }) => (
                        <motion.div
                            key={id}
                            className="asset-partner-item"
                            variants={scaleIn}
                            whileHover={
                                reduceMotion
                                    ? undefined
                                    : { scale: 1.05, y: -3, filter: 'grayscale(0)' }
                            }
                        >
                            <div className="asset-partner-logo-box">
                                <Logo />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
