'use client';

import Link from 'next/link';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';

export default function AppDownloadSection() {
    const APP_LINK = "https://apps.apple.com/in/app/glofi-estate/id6764258977"; 

    return (
        <section className="w-full bg-black py-12 sm:py-16 lg:py-20 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    
                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                          
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-Montserrat font-bold text-white mb-6 leading-tight tracking-tight">
                                INVEST ON THE GO. <br />
                                <span className="text-hero-cyan">DOWNLOAD GLOFI APP.</span>
                            </h2>
                            <p className="text-[var(--color-text-secondary)] text-sm sm:text-base lg:text-lg mb-10 max-w-lg leading-relaxed">
                                Take control of your portfolio from anywhere. Experience seamless investing with our high-performance mobile application.
                            </p>
                          
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                
                                <Link 
                                    href="https://apps.apple.com/in/app/glofi-estate/id6764258977" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-transform hover:scale-105 active:scale-95"
                                >
                                    <div className="bg-black border border-white/20 rounded-[14px] px-5 py-2.5 flex items-center gap-3.5 h-[64px] min-w-[190px] shadow-lg">
                                        <svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                                            <path d="M20.0454 15.316C20.06 14.2121 20.3603 13.1297 20.9185 12.1696C21.4766 11.2095 22.2745 10.4028 23.2378 9.82464C22.6258 8.97138 21.8185 8.26918 20.8799 7.77381C19.9414 7.27845 18.8975 7.00356 17.8311 6.97099C15.5563 6.73786 13.3509 8.29993 12.1917 8.29993C11.0101 8.29993 9.22531 6.99413 7.30339 7.03273C6.06025 7.07194 4.84871 7.42487 3.78682 8.05713C2.72493 8.68939 1.8489 9.57942 1.24408 10.6405C-1.37578 15.069 0.578406 21.5773 3.08806 25.157C4.3437 26.9099 5.81117 28.8678 7.73135 28.7984C9.61036 28.7223 10.3121 27.6286 12.5802 27.6286C14.8273 27.6286 15.4857 28.7984 17.4448 28.7543C19.4611 28.7223 20.7314 26.9936 21.943 25.2242C22.8452 23.9752 23.5394 22.5948 24 21.1342C22.8286 20.6505 21.829 19.8408 21.1257 18.8062C20.4225 17.7715 20.0468 16.5577 20.0454 15.316Z" fill="white"/>
                                            <path d="M16.3452 4.61656C17.4446 3.32811 17.9862 1.67203 17.8551 0C16.1755 0.172223 14.6241 0.955915 13.5099 2.19493C12.9651 2.80022 12.5479 3.50439 12.282 4.26721C12.0162 5.03002 11.9069 5.83651 11.9605 6.64056C12.8006 6.649 13.6317 6.47124 14.3912 6.12064C15.1507 5.77005 15.8188 5.25578 16.3452 4.61656Z" fill="white"/>
                                        </svg>
                                        <div className="text-left flex flex-col justify-center">
                                            <span className="text-[10px] tracking-wide text-white/90 font-Montserrat font-normal leading-tight">Download on the</span>
                                            <span className="text-xl font-semibold leading-tight text-white font-Montserrat mt-0.5">App Store</span>
                                        </div>
                                    </div>
                                </Link>

                                
                                <Link 
                                    href="https://play.google.com/store/apps/details?id=app.glofiestates.com&pcampaignid=web_share" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-transform hover:scale-105 active:scale-95"
                                >
                                    <div className="bg-black border border-white/20 rounded-[14px] px-5 py-2.5 flex items-center gap-3.5 h-[64px] min-w-[190px] shadow-lg">
                                        <svg width="26" height="29" viewBox="0 0 26 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                                            <path d="M11.7657 13.7543L0.107422 26.4074C0.108517 26.4096 0.108517 26.413 0.109612 26.4152C0.46767 27.7892 1.69405 28.8003 3.15037 28.8003C3.7329 28.8003 4.2793 28.6391 4.74795 28.3569L4.78518 28.3345L17.9074 20.5915L11.7657 13.7543Z" fill="#EA4335"/>
                                            <path d="M23.559 11.5994L23.5481 11.5916L17.8826 8.23348L11.5 14.0416L17.9056 20.5898L23.5404 17.2653C24.5281 16.7189 25.1993 15.654 25.1993 14.4268C25.1993 13.2063 24.5379 12.147 23.559 11.5994Z" fill="#FBBC04"/>
                                            <path d="M0.107308 2.39209C0.0372293 2.65635 0 2.93405 0 3.2207V25.5797C0 25.8664 0.0372293 26.1441 0.108403 26.4072L12.1663 14.0777L0.107308 2.39209Z" fill="#4285F4"/>
                                            <path d="M11.8522 14.4001L17.8855 8.23148L4.77861 0.460464C4.30229 0.168211 3.74604 0.000250816 3.15147 0.000250816C1.69514 0.000250816 0.466575 1.01362 0.108516 2.38866C0.108516 2.38978 0.107422 2.3909 0.107422 2.39202L11.8522 14.4001Z" fill="#34A853"/>
                                        </svg>
                                        <div className="text-left flex flex-col justify-center">
                                            <span className="text-[10px] tracking-[0.08em] text-white/90 font-Montserrat font-normal leading-tight uppercase">GET IT ON</span>
                                            <span className="text-xl font-semibold leading-tight text-white font-Montserrat mt-0.5">Google Play</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                 
                    <motion.div 
                        className="flex-shrink-0 relative group"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {/* Interactive Glow Background */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-hero-cyan/50 to-blue-500/50 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                        
                        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center">
                            {/* QR Code Container */}
                            <div className="relative p-6 bg-white rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_35px_rgba(0,255,205,0.2)] transition-all duration-500 flex items-center justify-center">
                                <QRCode 
                                    value={APP_LINK}
                                    size={180}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    viewBox={`0 0 256 256`}
                                    fgColor="#000000"
                                    bgColor="#FFFFFF"
                                />
                                
                                {/* Scanning Line Animation */}
                                <div className="absolute top-6 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-hero-cyan to-transparent animate-scan pointer-events-none" />
                                
                                {/* Corner Accents */}
                                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-hero-cyan/30 rounded-tl-lg" />
                                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-hero-cyan/30 rounded-tr-lg" />
                                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-hero-cyan/30 rounded-bl-lg" />
                                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-hero-cyan/30 rounded-br-lg" />
                            </div>
                            
                            {/* Call to Action */}
                            <div className="mt-8 flex flex-col items-center gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-2 h-2 rounded-full bg-hero-cyan" />
                                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-hero-cyan animate-ping opacity-75" />
                                    </div>
                                    <span className="text-white font-Montserrat font-bold text-xs sm:text-sm tracking-[0.25em] uppercase">
                                        Scan to Download
                                    </span>
                                </div>
                                <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <span className="text-[var(--color-text-secondary)] font-Montserrat text-[10px] sm:text-xs font-medium">
                                    AVAILABLE ON iOS & ANDROID
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
