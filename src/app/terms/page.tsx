'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/sections/Navbar/Navbar';
import GlofiCopyrightSection from '@/components/sections/GlofiCopyrightSection/GlofiCopyrightSection';

export default function TermsAndConditionsPage() {
    const router = useRouter();

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const sections: {
        title: string;
        content: React.ReactNode;
        anchorId?: string;
    }[] = [
            {
                title: "1. Acceptance of Terms",
                content: "By accessing and using GloFi Estates, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service."
            },
            {
                title: "2. Description of Service",
                content: "GloFi provides fractional ownership and real estate investment services. We reserve the right to modify, suspend or discontinue the service with or without notice at any time and without any liability to you."
            },
            {
                title: "3. User Registration",
                content: "To use certain features of the service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate."
            },
            {
                title: "4. User Conduct",
                content: (
                    <div className="space-y-4">
                        <p>You agree to use our services only for lawful purposes. You are prohibited from:</p>
                        <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                            <li>Violating any local, state, national, or international law</li>
                            <li>Interfering with the security-related features of the service</li>
                            <li>Transmitting unauthorized commercial communications</li>
                            <li>Attempting to bypass any measures we may use to prevent or restrict access to the service</li>
                        </ul>
                    </div>
                )
            },
            {
                title: "5. Intellectual Property",
                content: "All content, features, and functionality of the service are owned by GloFi Estates and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws."
            },
            {
                title: "6. Limitation of Liability",
                content: "In no event shall GloFi Estates, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service."
            },
            {
                title: "7. Governing Law",
                content: "These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which GloFi Estates is registered, without regard to its conflict of law provisions."
            },
            {
                title: "8. Changes to Terms",
                content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms."
            },
            {
                title: "9. Contact Information",
                content: (
                    <div className="space-y-4">
                        <p>If you have any questions about these Terms, please contact us at:</p>
                        <div className="space-y-2 text-neutral-600">
                            <p>Email: <a href="mailto:girish@glofiestates.com" className="text-[#00876D] hover:underline">girish@glofiestates.com</a></p>
                            <p>Phone: 95999 70225</p>
                        </div>
                    </div>
                )
            }
        ];

    return (
        <main className="min-h-screen bg-white text-neutral-900 selection:bg-[#00F4C4] selection:text-black">
            <Navbar />

            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00F4C4]/10 to-transparent blur-[120px]" />
                </div>

                <div className="container-main relative z-10">
                    <div className="mb-8">
                        <button
                            onClick={() => {
                                router.back();
                                setTimeout(() => window.scrollTo(0, 0), 100);
                            }}
                            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer bg-transparent border-none font-montserrat text-sm p-0"
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                            Go Back
                        </button>
                    </div>
                    <motion.div
                        {...fadeIn}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="heading-display mb-4 text-neutral-900">Terms & Conditions</h1>
                        <div className="text-body text-lg text-neutral-600 space-y-2">
                            <p>Last Updated: October 2025</p>
                            <p>These terms apply to all GloFi Estates products and services.</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="pb-32">
                <div className="container-main max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="bg-neutral-50 border border-neutral-200/60 shadow-lg shadow-neutral-100 p-8 md:p-12 rounded-3xl"
                    >
                        <div className="space-y-12">
                            {sections.map((section, index) => (
                                <div
                                    key={index}
                                    id={section.anchorId}
                                    className={[
                                        "space-y-4",
                                        section.anchorId ? "scroll-mt-28 md:scroll-mt-32" : "",
                                    ].join(" ")}
                                >
                                    <h2 className="heading-md text-[#00876D]">{section.title}</h2>
                                    <div className="text-body leading-relaxed text-neutral-600">
                                        {section.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 pt-16 border-t border-neutral-200 flex flex-col items-center gap-8">
                            <div className="text-center space-y-4">

                                <p className="text-body-sm italic text-neutral-400">
                                    © 2025 GloFi Estates. All rights reserved.
                                </p>
                            </div>
                            <Link href="/" className="btn-primary">
                                Back to Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <GlofiCopyrightSection />
        </main>
    );
}
