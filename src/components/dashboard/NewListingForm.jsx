"use client";


import { useState } from "react";
import { motion } from "framer-motion";
import { BusinessPropertyIcon, UploadIcon } from "../VectorImages";


const CATEGORIES = ["Skyscraper", "Land", "Commercial", "Residential"];

const UploadArea = ({ label }) => (
    <div className="flex-1 min-w-[200px] aspect-[3/2] rounded-xl border border-[#FFFFFF1A] bg-[#111111] flex flex-col items-center justify-center p-4 hover:border-[#00DAAF33] transition-colors cursor-pointer group">
        <div className="w-10 h-10 rounded-full  flex items-center justify-center mb-3 group-hover:bg-[#00DAAF0D] transition-colors">
        <UploadIcon/>

        </div>
        <span className="text-[11px] font-medium text-[#FFFFFF40] text-center uppercase tracking-wider font-montserrat">
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
                    className="flex items-center gap-2 bg-[#00DAAF0D] hover:bg-[#00DAAF1A] text-[#00DAAF] px-4 py-2 rounded-lg text-sm font-medium font-montserrat transition-all"
                >
                    Back to List
                </button>
            </div>


          
            <div className="bg-[#FFFFFF05] border border-[#FFFFFF0A] rounded-3xl p-6 lg:p-10">
               
                <div className="flex items-center justify-center gap-12 mb-10 border-b border-[#FFFFFF05] pb-4">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCat(cat)}
                            className={`text-sm font-medium font-montserrat transition-colors relative pb-4 ${activeCat === cat ? "text-white" : "text-[#FFFFFF22] hover:text-[#FFFFFF40]"
                                }`}
                        >
                            {cat}
                            {activeCat === cat && (
                                <motion.div
                                    layoutId="activeCat"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00DAAF]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[#FFFFFF40] tracking-widest uppercase font-montserrat">Title</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[#111111] border border-[#FFFFFF0A] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00DAAF33] transition-colors placeholder:text-[#FFFFFF10] font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[#FFFFFF40] tracking-widest uppercase font-montserrat">Location</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[#111111] border border-[#FFFFFF0A] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00DAAF33] transition-colors placeholder:text-[#FFFFFF10] font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[#FFFFFF40] tracking-widest uppercase font-montserrat">Valuation ($)</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[#111111] border border-[#FFFFFF0A] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00DAAF33] transition-colors placeholder:text-[#FFFFFF10] font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[#FFFFFF40] tracking-widest uppercase font-montserrat">Total Fractions</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[#111111] border border-[#FFFFFF0A] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00DAAF33] transition-colors placeholder:text-[#FFFFFF10] font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-1">
                        <label className="text-[10px] font-semibold text-[#FFFFFF40] tracking-widest uppercase font-montserrat">Annual Yield (%)</label>
                        <input
                            type="text"
                            placeholder="..."
                            className="bg-[#111111] border border-[#FFFFFF0A] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00DAAF33] transition-colors placeholder:text-[#FFFFFF10] font-montserrat md:max-w-[calc(50%-16px)]"
                        />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] font-semibold text-[#FFFFFF40] tracking-widest uppercase font-montserrat">Description</label>
                        <textarea
                            rows={5}
                            placeholder="..."
                            className="bg-[#111111] border border-[#FFFFFF0A] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00DAAF33] transition-colors placeholder:text-[#FFFFFF10] font-montserrat resize-none"
                        />
                    </div>
                </div>

               
                <div className="flex flex-wrap gap-4 mb-8">
                    <UploadArea label="Title Deed" />
                    <UploadArea label="Valuation Report" />
                    <UploadArea label="Legal Opinion" />
                    <UploadArea label="Property Images" />
                </div>

                
                <div className="bg-[#FE9A000A] border border-[#FE9A001A] rounded-xl p-4 mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full  flex items-center justify-center flex-shrink-0">
                    <BusinessPropertyIcon className="w-4 h-4 text-[#FE9A00]" />
                    </div>
                    <p className="text-base text-[#FFB90080] font-montserrat font-medium ">
                     Business verification (KYB) required before listing properties. Company info, documents & bank setup.
                    </p>
                </div>

                
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="bg-[#00DAAF] text-[#050505] font-bold text-sm px-8 py-3.5 rounded-2xl hover:bg-[#00c59e] transition-colors font-montserrat"
                >
                    Verify & Submit
                </motion.button>
            </div>
        </motion.div>
    );
}
