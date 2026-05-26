'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/sections/Navbar/Navbar';
import GlofiCopyrightSection from '@/components/sections/GlofiCopyrightSection/GlofiCopyrightSection';

export default function PrivacyPolicyPage() {
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
            title: "1. Introduction",
            content: "At Bhai Finance, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, including GloFi and all related products."
        },
        {
            title: "2. Information We Collect",
            content: (
                <div className="space-y-6">
                    <p>We collect several types of information to provide and improve our services:</p>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-neutral-900 font-semibold mb-2">Personal Information</h3>
                            <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                                <li>Name, email address, and contact information</li>
                                <li>Identity verification documents (as required by law)</li>
                                <li>Financial information for transaction processing</li>
                                <li>Blockchain wallet addresses</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-neutral-900 font-semibold mb-2">Usage Information</h3>
                            <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                                <li>Device information and IP addresses</li>
                                <li>Browser type and operating system</li>
                                <li>Transaction history and activity logs</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "3. How We Use Your Information",
            content: (
                <div className="space-y-4">
                    <p>We use the collected information for the following purposes:</p>
                    <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                        <li>To provide, maintain, and improve our services</li>
                        <li>To process transactions and send related information</li>
                        <li>To comply with legal obligations and regulatory requirements</li>
                        <li>To detect, prevent, and address fraud and security issues</li>
                        <li>To communicate with you about updates, promotions, and services</li>
                        <li>To analyze usage patterns and optimize user experience</li>
                    </ul>
                </div>
            )
        },
        {
            title: "4. How We Share Your Information",
            content: (
                <div className="space-y-4">
                    <p>We do not sell your personal information. We may share your information with:</p>
                    <ul className="list-disc pl-5 space-y-3 text-neutral-600">
                        <li><strong className="text-neutral-900">Service Providers:</strong> Third-party vendors who assist in operating our services</li>
                        <li><strong className="text-neutral-900">Legal Authorities:</strong> When required by law or to protect our rights</li>
                        <li><strong className="text-neutral-900">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                        <li><strong className="text-neutral-900">Blockchain Networks:</strong> Transaction data is inherently public on blockchain networks</li>
                    </ul>
                </div>
            )
        },
        {
            title: "5. Data Security",
            content: (
                <div className="space-y-4">
                    <p>We implement industry-standard security measures to protect your personal information, including:</p>
                    <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                        <li>Encryption of sensitive data in transit and at rest</li>
                        <li>Multi-factor authentication options</li>
                        <li>Regular security audits and assessments</li>
                        <li>Restricted access to personal information</li>
                        <li>Secure data storage and backup procedures</li>
                    </ul>
                    <p className="pt-2">However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
                </div>
            )
        },
        {
            title: "6. Your Rights and Choices",
            content: (
                <div className="space-y-4">
                    <p>You have the following rights regarding your personal information:</p>
                    <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                        <li><strong className="text-neutral-900">Access:</strong> Request access to your personal information</li>
                        <li><strong className="text-neutral-900">Correction:</strong> Request correction of inaccurate information</li>
                        <li><strong className="text-neutral-900">Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                        <li><strong className="text-neutral-900">Opt-Out:</strong> Unsubscribe from marketing communications</li>
                        <li><strong className="text-neutral-900">Data Portability:</strong> Request a copy of your data in a portable format</li>
                    </ul>
                    <p className="pt-2">To exercise these rights, please contact us at Info@bhaifinance.com.</p>
                </div>
            )
        },
        {
            title: "7. Cookies and Tracking Technologies",
            anchorId: "cookies",
            content: "We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser preferences. However, disabling cookies may limit your ability to use certain features of our services."
        },
        {
            title: "8. Third-Party Links",
            content: "Our services may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information."
        },
        {
            title: "9. Children's Privacy",
            content: "Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately."
        },
        {
            title: "10. International Data Transfers",
            content: "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy."
        },
        {
            title: "11. Data Retention",
            content: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law or regulation."
        },
        {
            title: "12. Changes to This Privacy Policy",
            content: "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our website and updating the \"Last Updated\" date. Your continued use of our services after such changes constitutes acceptance of the updated policy."
        },
        {
            title: "13. Contact Us",
            content: (
                <div className="space-y-4">
                    <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
                    <div className="space-y-2 text-neutral-600">
                        <p>Email: <a href="mailto:Info@bhaifinance.com" className="text-[#00876D] hover:underline">Info@bhaifinance.com</a></p>
                        <p>Phone: +1 (716) 907-5786</p>
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
                        <h1 className="heading-display mb-4 text-neutral-900">Privacy Policy</h1>
                        <div className="text-body text-lg text-neutral-600 space-y-2">
                            <p>Last Updated: October 2025</p>
                            <p>GloFi is a flagship product of Bhai Finance. This privacy policy applies to all Bhai Finance products and services.</p>
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
                                <p className="text-body text-neutral-500">
                                    Bhai Finance is the parent company of GloFi and other innovative financial technology solutions.
                                </p>
                                <p className="text-body-sm italic text-neutral-400">
                                    © 2025 Bhai Finance. All rights reserved.
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
