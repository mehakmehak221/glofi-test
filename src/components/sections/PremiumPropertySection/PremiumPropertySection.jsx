'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

const PROPERTIES = [
    { id: 1, src: '/assets/images/BanglowImage.png', alt: 'Banglow' },
    { id: 2, src: '/assets/images/SkyCraperImage.png', alt: 'Sky Craper' },
    { id: 3, src: '/assets/images/RetailImage.png', alt: 'Retail' },
    { id: 4, src: '/assets/images/RealEstateImage.png', alt: 'Real Estate' },
    { id: 5, src: '/assets/images/FlatBuildingImage.png', alt: 'Flat Building' },
];

export default function PremiumPropertySection() {
    const headerRef = useRef(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('anim-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        if (headerRef.current) observer.observe(headerRef.current);
        cardRefs.current.forEach((card) => { if (card) observer.observe(card); });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="premium-section-wrapper py-8 sm:py-12 lg:py-16 xl:py-20 2xl:py-24">
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">

                {/* Header — fades up on scroll */}
                <div
                    ref={headerRef}
                    className="premium-header-container anim-fade-up mb-6 sm:mb-8 lg:mb-10 w-full text-left"
                >
                    <h2 className="premium-title text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-Montserrat">
                        Premium Properties. Structured Access.
                    </h2>
                    <p className="premium-subtitle text-sm sm:text-sm lg:text-lg mt-2 sm:mt-3 font-Montserrat">
                        Institutional-grade assets. Digitally simplified.
                    </p>
                </div>

                {/* Cards — staggered slide-in on scroll */}
                <div className="premium-list-section overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 sm:gap-4 lg:gap-6 pb-4">
                        {PROPERTIES.map((prop, index) => {
                            return (
                                <div
                                    key={prop.id}
                                    ref={(el) => (cardRefs.current[index] = el)}
                                    className="premium-card-exact group flex-shrink-0 w-56 sm:w-64 md:w-72 lg:w-80 xl:w-[320px] 2xl:w-[360px] anim-fade-up"
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative premium-card-exact__inner bg-[var(--color-bg-card)] w-full h-full flex items-center justify-center rounded-2xl overflow-hidden
                                        transition-all duration-500
                                        group-hover:shadow-[0_0_32px_4px_var(--color-primary-300-alpha-30)]
                                        group-hover:scale-[1.03]">

                                        <Image
                                            src={prop.src}
                                            alt={prop.alt}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />

                                        {/* Shimmer sweep on hover */}
                                        <span className="pointer-events-none absolute inset-0 rounded-2xl
                                            -translate-x-full group-hover:translate-x-full
                                            transition-transform duration-700 ease-in-out
                                            bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
