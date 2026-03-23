"use client";


import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BusinessPropertyIcon, UploadIcon } from "../VectorImages";
import KYBModal from "./KYBModal";


const CATEGORIES = ["Skyscraper", "Land", "Commercial", "Residential"];

const UploadArea = ({ label }) => (
    <div className="flex-1 min-w-[200px] aspect-[3/2] rounded-xl border border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] flex flex-col items-center justify-center p-4 hover:shadow-md transition-all cursor-pointer group">
        <div className="w-10 h-10 rounded-full  flex items-center justify-center mb-3 group-hover:bg-[var(--sidebar-active-bg)] transition-colors">
        <UploadIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-60 group-hover:text-[var(--sidebar-active-text)] group-hover:opacity-100" />
        </div>
        <span className="text-[11px] font-medium text-[var(--sidebar-text)] opacity-60 text-center uppercase tracking-wider font-montserrat">
            {label}
        </span>
    </div>
);

export default function NewListingForm({ onBack }) {
    const [activeCat, setActiveCat] = useState("Skyscraper");
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pb-12"
        >
          
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl lg:text-2xl font-semibold text-[var(--foreground)] font-montserrat tracking-tight">
                    Properties
                </h1>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 bg-[var(--sidebar-active-bg)] hover:opacity-80 text-[var(--sidebar-active-text)] px-4 py-2 rounded-lg text-sm font-medium font-montserrat transition-all"
                >
                    Back to List
                </button>
            </div>


          
            <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-3xl p-6 lg:p-10">
               
                <div className="flex items-center justify-center gap-12 mb-10 border-b border-[var(--sidebar-border)] pb-4">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCat(cat)}
                            className={`text-sm font-medium font-montserrat transition-colors relative pb-4 ${activeCat === cat ? "text-[var(--foreground)]" : "text-[var(--sidebar-text)] opacity-60 hover:opacity-100 hover:text-[var(--foreground)]"
                                }`}
                        >
                            {cat}
                            {activeCat === cat && (
                                <motion.div
                                    layoutId="activeCat"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--sidebar-active-text)]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Title</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Location</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Valuation ($)</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Total Fractions</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-1">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Annual Yield (%)</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat md:max-w-[calc(50%-16px)]"
                        />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Description</label>
                        <textarea
                            rows={5}
                            placeholder="..."
                            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat resize-none"
                        />
                    </div>
                </div>

               
                <div className="flex flex-wrap gap-4 mb-8">
                    <UploadArea label="Title Deed" />
                    <UploadArea label="Valuation Report" />
                    <UploadArea label="Legal Opinion" />
                    <UploadArea label="Property Images" />
                </div>

                
                <div className="bg-[#f5a623]/5 dark:bg-[var(--color-accent-orange)]/5 border border-[#f5a623]/20 dark:border-[var(--color-accent-orange)]/10 rounded-xl p-4 mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full  flex items-center justify-center flex-shrink-0">
                    <BusinessPropertyIcon className="w-4 h-4 text-[#f5a623] dark:text-[var(--color-accent-orange)]" />
                    </div>
                    <p className="text-base text-[#f5a623]/90 dark:text-[var(--color-accent-orange)]/50 font-montserrat font-medium ">
                     Business verification (KYB) required before listing properties. Company info, documents & bank setup.
                    </p>
                </div>

                
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[var(--sidebar-active-text)] text-white font-bold text-sm px-8 py-3.5 rounded-2xl hover:opacity-90 transition-opacity font-montserrat"
                >
                    Verify & Submit
                </motion.button>
            </div>
        </motion.div>
        
        <KYBModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
        />
        </>
    );
}
