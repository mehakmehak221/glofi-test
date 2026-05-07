'use client';

import Link from 'next/link';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';

export default function AppDownloadSection() {
    const APP_LINK = "https://apps.apple.com/in/app/glofi-estate/id6764258977"; 

    return (
        <section className="w-full bg-black py-16 sm:py-24 border-t border-white/10">
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
                                    <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 flex items-center gap-3 backdrop-blur-sm">
                                        <svg className="w-8 h-8 text-white" viewBox="0 0 384 512" fill="currentColor">
                                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="text-[10px] uppercase tracking-wider text-gray-400">Download on the</div>
                                            <div className="text-lg font-semibold leading-none">App Store</div>
                                        </div>
                                    </div>
                                </Link>

                                
                                <Link 
                                    href="https://play.google.com/store/apps/details?id=app.glofiestates.com&pcampaignid=web_share" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-transform hover:scale-105 active:scale-95"
                                >
                                    <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 flex items-center gap-3 backdrop-blur-sm">
                                        <svg className="w-8 h-8 text-white" viewBox="0 0 512 512" fill="currentColor">
                                            <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="text-[10px] uppercase tracking-wider text-gray-400">Get it on</div>
                                            <div className="text-lg font-semibold leading-none">Google Play</div>
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
