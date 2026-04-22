'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/sections/Navbar/Navbar';
import GlofiCopyrightSection from '@/components/sections/GlofiCopyrightSection/GlofiCopyrightSection';

export default function PrivacyPolicyPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const sections = [
        {
            title: "1. Information We Collect",
            content: "We collect information you provide directly to us when you create an account, participate in any interactive features of our services, fill out a form, request customer support, or otherwise communicate with us."
        },
        {
            title: "2. How We Use Your Information",
            content: "We use the information we collect to provide, maintain, and improve our services, including to process transactions, send technical notices, updates, security alerts, and support and administrative messages."
        },
        {
            title: "3. Sharing of Information",
            content: "We may share information about you as follows: with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf; in response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process."
        },
        {
            title: "4. Security",
            content: "We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction."
        },
        {
            title: "5. Your Choices",
            content: "You may update, correct, or delete information about you at any time by logging into your online account or emailing us at support@glofi.com. Please note that we may retain certain information as required by law or for legitimate business purposes."
        },
        {
            title: "6. Cookies",
            content: "Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies."
        },
        {
            title: "7. Contact Us",
            content: "If you have any questions about this Privacy Policy, please contact us at support@glofi.com."
        }
    ];

    return (
        <main className="min-h-screen bg-[#030403] text-white selection:bg-[#00F4C4] selection:text-black">
            <Navbar />
            
           
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00F4C4]/20 to-transparent blur-[120px]" />
                </div>

                <div className="container-main relative z-10">
                    <motion.div 
                        {...fadeIn}
                        className="text-center max-w-3xl mx-auto"
                    >
                       
                        <h1 className="heading-display mb-4">Privacy Policy</h1>
                        <p className="text-body text-lg">
                            Last Updated: April 22, 2026. 
                           
                        </p>
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
                        className="glass p-8 md:p-12 rounded-3xl"
                    >
                        <div className="space-y-12">
                            {sections.map((section, index) => (
                                <div key={index} className="space-y-4">
                                    <h2 className="heading-md text-[#00F4C4]">{section.title}</h2>
                                    <p className="text-body leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 pt-16 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <p className="text-body-sm italic">
                                © 2026 GloFi Real Estate. All rights reserved.
                            </p>
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
