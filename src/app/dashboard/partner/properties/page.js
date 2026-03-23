"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    MapPinIcon,
    PropertyIcon,
} from "@/components/VectorImages";
import NewListingForm from "@/components/dashboard/NewListingForm";


const PROPERTIES = [
    {
        id: 1,
        name: "Burj Vista Tower",
        location: "Downtown Dubai, UAE",
        valuation: "$250.0M",
        sold: "6,760",
        yield: "12.5%",
        investors: "228",
        status: "LIVE",
        img: "/assets/img_burj.png",
    },
    {
        id: 2,
        name: "Marina Business Hub",
        location: "Dubai Marina, UAE",
        valuation: "$180.0M",
        sold: "2,400",
        yield: "9.8%",
        investors: "146",
        status: "LIVE",
        img: "/assets/img_marina.png",
    },
    {
        id: 3,
        name: "Palm Jumeirah Villa Estate",
        location: "Palm Jumeirah, Dubai",
        valuation: "$95.0M",
        sold: "3,800",
        yield: "15.2%",
        investors: "88",
        status: "LIVE",
        img: "/assets/img_palm.png",
    },
    {
        id: 4,
        name: "Dubai South Development Land",
        location: "Dubai South, UAE",
        valuation: "$45.0M",
        sold: "200",
        yield: "22%",
        investors: "89",
        status: "LIVE",
        img: "/assets/img_dubai.png",
    },
    {
        id: 5,
        name: "DIFC Innovation Tower",
        location: "DIFC, Dubai",
        valuation: "$320.0M",
        sold: "3,600",
        yield: "11.3%",
        investors: "109",
        status: "LIVE",
        img: "/assets/img_difc.png",
    },
    {
        id: 6,
        name: "Marina Walk Residences",
        location: "Dubai Marina, UAE",
        valuation: "$150.0M",
        sold: "3,400",
        yield: "10.7%",
        investors: "208",
        status: "LIVE",
        img: "/assets/img_walk.png",
    },
];

function PropertyCard({ property, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl p-4 lg:p-5 flex flex-col md:flex-row gap-5 items-center relative group hover:shadow-md transition-all"
        >
            <div className="w-full md:w-32 lg:w-40 h-24 lg:h-28 bg-black/5 dark:bg-white/5 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                {property.img ? (
                    <Image
                        src={property.img}
                        alt={property.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 160px, 160px"
                    />
                ) : (
                    <PropertyIcon className="w-8 h-8 text-[var(--sidebar-active-text)]/20" />
                )}
            </div>

            <div className="flex-1 w-full">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-[var(--foreground)] font-montserrat opacity-90">{property.name}</h3>
                    <p className="text-[11px] text-[var(--sidebar-text)] font-montserrat mt-1 flex items-center gap-1 opacity-60">
                        <MapPinIcon className="w-3 h-3" />
                        {property.location}
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--sidebar-text)] font-montserrat font-medium opacity-50">Valuation</span>
                        <span className="text-sm font-semibold text-[var(--foreground)] font-montserrat opacity-80">{property.valuation}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--sidebar-text)] font-montserrat font-medium opacity-50">Sold</span>
                        <span className="text-sm font-semibold text-[var(--foreground)] font-montserrat opacity-80">{property.sold}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--sidebar-text)] font-montserrat font-medium opacity-50">Yield</span>
                        <span className="text-sm font-bold text-[var(--sidebar-active-text)] font-montserrat">{property.yield}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--sidebar-text)] font-montserrat font-medium opacity-50">Investors</span>
                        <span className="text-sm font-semibold text-[var(--foreground)] font-montserrat opacity-80">{property.investors}</span>
                    </div>
                </div>
            </div>

            <div className="absolute top-4 right-4 lg:top-5 lg:right-6">
                <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.1em] text-[var(--sidebar-active-text)] font-montserrat uppercase bg-[var(--sidebar-active-bg)] rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--sidebar-active-text)] animate-pulse" />
                    {property.status}
                </span>
            </div>
        </motion.div >
    );
}

export default function PartnerPropertiesPage() {
    const [isAddingNew, setIsAddingNew] = useState(false);

    return (
        <div className="p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen font-montserrat">
            <AnimatePresence mode="wait">
                {isAddingNew ? (
                    <NewListingForm key="form" onBack={() => setIsAddingNew(false)} />
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <h1 className="text-xl lg:text-2xl font-semibold text-[var(--foreground)] font-montserrat">
                                    Properties
                                </h1>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsAddingNew(true)}
                                className="flex items-center gap-2 bg-[var(--sidebar-active-bg)] hover:opacity-80 text-[var(--sidebar-active-text)] px-4 py-2 rounded-lg text-sm font-medium font-montserrat transition-all"
                            >
                                <span className="text-lg leading-none">+</span>
                                New Listing
                            </motion.button>
                        </div>


                        <div className="flex flex-col gap-4 lg:gap-5">
                            {PROPERTIES.map((prop, i) => (
                                <PropertyCard key={prop.id} property={prop} index={i} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
