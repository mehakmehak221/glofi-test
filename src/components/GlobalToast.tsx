"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function GlobalToast() {
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const pathname = usePathname();

    useEffect(() => {
        const msg = localStorage.getItem("toastMessage");
        const type = localStorage.getItem("toastType") || "success";
        
        if (msg) {
            setToast({ show: true, message: msg, type });
            localStorage.removeItem("toastMessage");
            localStorage.removeItem("toastType");
            
            setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, 3000);
        }
    }, [pathname]);

    return (
        <AnimatePresence>
            {toast.show && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className={`fixed top-4 right-4 sm:right-8 z-[9999] px-6 py-3 rounded-full shadow-lg font-montserrat text-sm font-semibold flex items-center gap-2 ${toast.type === "success"
                        ? "bg-emerald-500/90 text-white"
                        : toast.type === "error"
                            ? "bg-red-500/90 text-white"
                            : "bg-yellow-500/90 text-white"
                        }`}
                    style={{ backdropFilter: "blur(8px)" }}
                >
                    {toast.type === "success" ? (
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                    {toast.message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
