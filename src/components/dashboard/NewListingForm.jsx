"use client";


import { useState } from "react";
import { motion } from "framer-motion";
import { BusinessPropertyIcon, UploadIcon } from "../VectorImages";


const CATEGORIES = ["Skyscraper", "Land", "Commercial", "Residential"];

const UploadArea = ({ label }) => (
    <div className="flex-1 min-w-[200px] aspect-[3/2] rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-nav)] flex flex-col items-center justify-center p-4 hover:border-[var(--color-primary-300)]/20 transition-colors cursor-pointer group">
        <div className="w-10 h-10 rounded-full  flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary-300)]/10 transition-colors">
        <UploadIcon/>

        </div>
        <span className="text-[11px] font-medium text-[var(--color-text-muted)] text-center uppercase tracking-wider font-montserrat">
            {label}
        </span>
    </div>
);

export default function NewListingForm({ onBack }) {
    const [activeCat, setActiveCat] = useState("Skyscraper");

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pb-12"
        >
          
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl lg:text-2xl font-semibold text-white font-montserrat tracking-tight">
                    Properties
                </h1>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 bg-[var(--color-primary-300)]/5 hover:bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] px-4 py-2 rounded-lg text-sm font-medium font-montserrat transition-all"
                >
                    Back to List
                </button>
            </div>


          
            <div className="bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] rounded-3xl p-6 lg:p-10">
               
                <div className="flex items-center justify-center gap-12 mb-10 border-b border-[var(--color-border-subtle)] pb-4">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCat(cat)}
                            className={`text-sm font-medium font-montserrat transition-colors relative pb-4 ${activeCat === cat ? "text-white" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                                }`}
                        >
                            {cat}
                            {activeCat === cat && (
                                <motion.div
                                    layoutId="activeCat"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-primary-300)]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--color-text-muted)]/50 tracking-widest uppercase font-montserrat">Title</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[var(--color-bg-nav)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--color-primary-300)]/20 transition-colors placeholder:text-[var(--color-text-muted)]/20 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--color-text-muted)]/50 tracking-widest uppercase font-montserrat">Location</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[var(--color-bg-nav)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--color-primary-300)]/20 transition-colors placeholder:text-[var(--color-text-muted)]/20 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--color-text-muted)]/50 tracking-widest uppercase font-montserrat">Valuation ($)</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[var(--color-bg-nav)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--color-primary-300)]/20 transition-colors placeholder:text-[var(--color-text-muted)]/20 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--color-text-muted)]/50 tracking-widest uppercase font-montserrat">Total Fractions</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[var(--color-bg-nav)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--color-primary-300)]/20 transition-colors placeholder:text-[var(--color-text-muted)]/20 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-1">
                        <label className="text-[10px] font-semibold text-[var(--color-text-muted)]/50 tracking-widest uppercase font-montserrat">Annual Yield (%)</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[var(--color-bg-nav)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--color-primary-300)]/20 transition-colors placeholder:text-[var(--color-text-muted)] font-montserrat md:max-w-[calc(50%-16px)]"
                        />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] font-semibold text-[var(--color-text-muted)] tracking-widest uppercase font-montserrat">Description</label>
                        <textarea
                            rows={5}
                            placeholder="..."
                            className="bg-[var(--color-bg-nav)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--color-primary-300)]/20 transition-colors placeholder:text-[var(--color-text-muted)] font-montserrat resize-none"
                        />
                    </div>
                </div>

               
                <div className="flex flex-wrap gap-4 mb-8">
                    <UploadArea label="Title Deed" />
                    <UploadArea label="Valuation Report" />
                    <UploadArea label="Legal Opinion" />
                    <UploadArea label="Property Images" />
                </div>

                
                <div className="bg-[var(--color-accent-orange)]/5 border border-[var(--color-accent-orange)]/10 rounded-xl p-4 mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full  flex items-center justify-center flex-shrink-0">
                    <BusinessPropertyIcon className="w-4 h-4 text-[var(--color-accent-orange)]" />
                    </div>
                    <p className="text-base text-[var(--color-accent-orange)]/50 font-montserrat font-medium ">
                     Business verification (KYB) required before listing properties. Company info, documents & bank setup.
                    </p>
                </div>

                
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="bg-[var(--color-primary-300)] text-black font-bold text-sm px-8 py-3.5 rounded-2xl hover:bg-[var(--color-primary-100)] transition-colors font-montserrat"
                >
                    Verify & Submit
                </motion.button>
            </div>
        </motion.div>
    );
}
