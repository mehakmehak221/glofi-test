'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { useGetAssetsQuery } from '@/store/api/assetApi';
import { API_URL } from '@/constants';

const PREMIUM_SECTION_BG =
    'radial-gradient(ellipse 90% 80% at 50% 55%, #155f63 0%, #0a2f32 38%, #02060a 100%)';

export default function PremiumPropertySection() {
    const { data: assetsData, isLoading } = useGetAssetsQuery({ limit: 5 });
    const assets = assetsData?.data || [];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    if (isLoading) {
        return (
            <section
                className="premium-section-wrapper w-full py-8 sm:py-10 lg:py-12 xl:py-14"
                style={{ background: PREMIUM_SECTION_BG }}
            >
                <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-56 sm:w-64 md:w-72 lg:w-80 xl:w-[320px] 2xl:w-[360px] h-48 sm:h-56 md:h-64 lg:h-72 bg-white/5 animate-pulse rounded-2xl flex-shrink-0" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const isFew = assets.length <= 2;
    const isSingle = assets.length === 1;
    const isDouble = assets.length === 2;

    const listWrapperClasses = isFew
        ? "premium-list-section !block !h-auto !overflow-visible"
        : "premium-list-section overflow-x-auto scrollbar-hide";

    const containerClasses = isFew
        ? `grid w-full gap-4 sm:gap-6 pb-4 ${isSingle ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`
        : "flex gap-3 sm:gap-4 lg:gap-6 pb-4";

    if (assets.length === 0) return null;

    return (
        <section
            className={`premium-section-wrapper w-full py-8 sm:py-10 lg:py-12 xl:py-14 ${isFew ? '!px-0' : ''}`}
            style={{ background: PREMIUM_SECTION_BG }}
        >
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">

                {/* Header — fades up on scroll */}
                <motion.div
                    className="premium-header-container mb-6 sm:mb-8 lg:mb-10 w-full text-left"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={itemVariants}
                >
                    <h2 className="premium-title text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-Montserrat">
                        Premium Properties. Structured Access.
                    </h2>
                    <p className="premium-subtitle text-sm sm:text-sm lg:text-lg mt-2 sm:mt-3 font-Montserrat">
                        Institutional-grade assets. Digitally simplified.
                    </p>
                </motion.div>

                {/* Cards — staggered slide-in on scroll */}
                <div className={listWrapperClasses}>
                    <motion.div 
                        className={containerClasses}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                    >
                        {assets.map((asset) => {
                            const propertyImage = asset.images?.[0];
                            const imageUrl = propertyImage
                                ? (propertyImage.startsWith('http') ? propertyImage : `${API_URL}/${propertyImage.replace(/^\//, '')}`)
                                : "/assets/images/content/img_ext_0.jpeg";

                            const cardClasses = isFew
                                ? "premium-card-exact group !w-full !max-w-none !h-auto"
                                : "premium-card-exact group flex-shrink-0 w-56 sm:w-64 md:w-72 lg:w-80 xl:w-[320px] 2xl:w-[360px]";

                            const innerClasses = isFew
                                ? `relative premium-card-exact__inner bg-[var(--color-bg-card)] w-full flex items-center justify-center rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.03] border border-white/5 ${
                                    isSingle ? 'h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[375px]' : 'h-48 sm:h-56 md:h-64 lg:h-72 xl:h-[375px]'
                                  }`
                                : "relative premium-card-exact__inner bg-[var(--color-bg-card)] w-full h-48 sm:h-56 md:h-64 lg:h-72 flex items-center justify-center rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.03] border border-white/5";

                            return (
                                <Link key={asset.id} href="/explore" className={isFew ? "w-full block" : ""}>
                                    <motion.div
                                        variants={itemVariants}
                                        className={cardClasses}
                                    >
                                        <div className={innerClasses}>

                                            <Image
                                                src={imageUrl}
                                                alt={asset.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                                <h3 className="text-white font-black text-lg sm:text-xl tracking-tight leading-tight">{asset.title}</h3>
                                                <p className="text-[var(--color-primary-300)] text-xs font-bold mt-1 uppercase tracking-widest">{asset.category.replace('_', ' ')}</p>
                                            </div>

                                            {/* Shimmer sweep on hover */}
                                            <span className="pointer-events-none absolute inset-0 rounded-2xl
                                                -translate-x-full group-hover:translate-x-full
                                                transition-transform duration-700 ease-in-out
                                                bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
