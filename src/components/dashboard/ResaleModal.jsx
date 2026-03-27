"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, CheckIcon, ResaleIcon } from "@/components/VectorImages";
import { useSellInvestmentMutation } from "@/store/api/investmentApi";

export default function ResaleModal({ isOpen, onClose, asset }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fractionsToSell: 0,
        pricePerFraction: 0,
        minPurchase: 1,
        notes: "",
        agreed: false
    });
    const [sellError, setSellError] = useState(null);
    const [successData, setSuccessData] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [sellInvestment, { isLoading: isSelling }] = useSellInvestmentMutation();

  
    useEffect(() => {
        if (asset && isOpen) {
            const numericValue = asset.value?.includes("K") 
                ? parseFloat(asset.value.replace(/[^0-9.]/g, "")) * 1000 
                : parseFloat(asset.value.replace(/[^0-9.]/g, ""));
            
            const perFraction = asset.fractions > 0 ? (numericValue / asset.fractions) : 0;
            
            setFormData({
                fractionsToSell: asset.fractions || 0,
                pricePerFraction: Math.round(perFraction),
                minPurchase: 1,
                notes: "",
                agreed: false
            });
            setStep(1);
            setSellError(null);
            setSuccessData(null);
        }
    }, [asset, isOpen]);

    if (!isOpen || !asset) return null;

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 5));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const totalOwned = asset.fractions || 0;
    const totalValueNumeric = asset.value?.includes("K") 
        ? parseFloat(asset.value.replace(/[^0-9.]/g, "")) * 1000 
        : parseFloat(asset.value.replace(/[^0-9.]/g, ""));
    const marketValuePerFraction = totalOwned > 0 ? (totalValueNumeric / totalOwned) : 0;

    const handleSubmit = async () => {
        setSellError(null);
        try {
            const result = await sellInvestment({
                id: asset.id,
                fractions: Number(formData.fractionsToSell),
                askPrice: Number(formData.pricePerFraction),
                priceType: "MARKET_VALUE",
                minimumPurchase: Number(formData.minPurchase),
                notes: formData.notes,
                termsAgreed: formData.agreed,
            }).unwrap();
            
            setSuccessData(result);
            showToast(result.message || "Fractions submitted for resale successfully!");
            setStep(5);
        } catch (err) {
            setSellError(err?.data?.message || "Failed to create listing. Please try again.");
            showToast(err?.data?.message || "Failed to create listing.", "error");
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-sm"
                />
                
                {/* Toast Notification */}
                <AnimatePresence>
                    {toast.show && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[70] px-6 py-3 rounded-full shadow-lg font-montserrat text-sm font-semibold flex items-center gap-2 ${
                                toast.type === "success" 
                                    ? "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border border-[var(--color-status-success)]/20" 
                                    : "bg-[var(--color-status-error-bg)] text-[var(--color-status-error)] border border-[var(--color-status-error)]/20"
                            }`}
                            style={{ backdropFilter: "blur(8px)" }}
                        >
                            {toast.type === "success" ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                            {toast.message}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md mx-auto rounded-md overflow-hidden bg-[var(--background)] border border-[var(--sidebar-border)] shadow-2xl"
                >
                    <div className="p-4 sm:p-6 border-b border-[var(--sidebar-border)] flex-shrink-0">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg sm:text-xl font-bold text-[var(--header-text)] font-Montserrat">
                                {step === 5 ? "Submission Successful" : "List Property for Resale"}
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-[var(--sidebar-active-bg)] rounded-full transition-colors border-0 bg-[var(--background)] cursor-pointer group">
                                <CloseIcon className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--header-text)]" />
                            </button>
                        </div>
                        {step < 5 && (
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] sm:text-xs text-[var(--color-text-muted)]">Step {step} of 4</p>
                                <div className="flex-1 h-1 bg-[var(--background)] rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-[var(--sidebar-active-text)]"
                                        animate={{ width: `${(step / 4) * 100}%` }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <StepOne 
                                    key="step1" 
                                    asset={asset} 
                                    formData={formData} 
                                    setFormData={setFormData} 
                                    totalOwned={totalOwned} 
                                />
                            )}
                            {step === 2 && (
                                <StepTwo 
                                    key="step2" 
                                    asset={asset} 
                                    formData={formData} 
                                    setFormData={setFormData}
                                    marketValue={marketValuePerFraction}
                                />
                            )}
                            {step === 3 && (
                                <StepThree 
                                    key="step3" 
                                    formData={formData} 
                                    setFormData={setFormData}
                                    totalPrice={(formData.fractionsToSell * formData.pricePerFraction).toLocaleString()}
                                />
                            )}
                            {step === 4 && (
                                <StepFour 
                                    key="step4" 
                                    asset={asset} 
                                    formData={formData} 
                                    setFormData={setFormData} 
                                />
                            )}
                            {step === 5 && (
                                <StepFive 
                                    key="step5" 
                                    successData={successData} 
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {sellError && step < 5 && (
                        <div className="px-4 sm:px-6 pb-2">
                            <p className="text-xs text-red-500">{sellError}</p>
                        </div>
                    )}
                    
                    <div className="p-4 sm:p-6 border-t border-[var(--sidebar-border)] flex flex-col sm:flex-row gap-3 flex-shrink-0 transition-colors duration-300">
                        {step > 1 && step < 5 && (
                            <button 
                                onClick={prevStep}
                                className="w-full sm:flex-1 py-3 rounded-lg bg-[var(--background)] text-[var(--header-text)] font-semibold text-sm hover:bg-[var(--sidebar-active-bg)] transition-colors border-0 cursor-pointer"
                            >
                                Back
                            </button>
                        )}
                        <button 
                            disabled={(step === 4 && !formData.agreed) || isSelling}
                            onClick={step === 5 ? onClose : step === 4 ? handleSubmit : nextStep}
                            className={`w-full sm:flex-1 py-3 rounded-md font-semibold text-sm transition-all border-0 cursor-pointer ${
                                ((step === 4 && !formData.agreed) || isSelling) && step !== 5
                                    ? "bg-[var(--background)] text-[var(--color-text-muted)] cursor-not-allowed" 
                                    : "bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] hover:shadow-glow-primary hover:opacity-90"
                            }`}
                        >
                            {isSelling ? "Submitting..." : step === 5 ? "Return to Portfolio" : step === 4 ? "List on Marketplace" : "Continue"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function StepOne({ asset, formData, setFormData, totalOwned }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 sm:space-y-6"
        >
            <div className="bg-[var(--badge-bg)] border border-[var(--sidebar-border)] rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 transition-colors">
                <div className="w-full sm:w-20 h-32 sm:h-20 rounded-lg overflow-hidden relative flex-shrink-0">
                    <Image src={asset.image} alt={asset.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-bold text-[var(--header-text)] mb-1">{asset.name}</h3>
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-2">{asset.location}</p>
                    <div className="flex gap-4">
                        <div>
                            <p className="text-[9px] text-[var(--color-text-muted)] uppercase mb-0.5">Your Fractions</p>
                            <p className="text-xs font-bold text-[var(--header-text)]">{formData.fractionsToSell} / {totalOwned}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-[var(--color-text-muted)] uppercase mb-0.5">Current Value</p>
                            <p className="text-xs font-bold text-[var(--sidebar-active-text)]">{asset.value}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-sm text-[var(--header-text)] font-Montserrat">How many fractions do you want to sell?</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="text-[10px] uppercase text-[var(--color-text-muted)] mb-1.5 block">Fractions to Sell</label>
                        <input 
                            type="number"
                            value={formData.fractionsToSell}
                            onChange={(e) => setFormData({...formData, fractionsToSell: Number(e.target.value)})}
                            className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-lg px-4 py-3 text-[var(--header-text)] focus:outline-none focus:border-[var(--sidebar-active-text)]/50 transition-colors"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] uppercase text-[var(--color-text-muted)] mb-1.5 block">You'll Keep</label>
                        <div className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-lg px-4 py-3 text-[var(--color-text-muted)] opacity-50">
                            {totalOwned - formData.fractionsToSell}
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Half (50%)", "Most (75%)", "All (100%)"].map((label, idx) => (
                        <button 
                            key={label}
                            onClick={() => {
                                const mult = [0.5, 0.75, 1][idx];
                                setFormData({...formData, fractionsToSell: Math.floor(totalOwned * mult)});
                            }}
                            className="py-3 rounded-md font-semibold text-sm transition-all border border-[var(--sidebar-border)] bg-[var(--background)] text-[var(--color-text-muted)] cursor-pointer hover:border-[var(--color-text-muted)]/50 hover:bg-[var(--sidebar-active-bg)] transition-colors cursor-pointer"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function StepTwo({ asset, formData, setFormData, marketValue }) {
    const marketValueNum = typeof marketValue === 'number' ? marketValue : parseFloat(marketValue.replace(/[^0-9.]/g, ''));

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 sm:space-y-6"
        >
            <div className="bg-[var(--background)] border border-[var(--sidebar-border)] rounded-2xl p-6 shadow-sm">
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] font-black mb-2">Liquidating Assets</p>
                <p className="text-base font-black text-[var(--header-text)] uppercase">{formData.fractionsToSell} fractions of {asset.name}</p>
            </div>

            <div className="space-y-6">
                <div className="bg-[var(--badge-bg)] border border-[var(--sidebar-active-text)]/20 rounded-2xl p-6 shadow-inner">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] font-black mb-2">Current Market Value / Fraction</p>
                    <p className="text-3xl font-black text-[var(--sidebar-active-text)] font-Montserrat">$ {Math.round(marketValueNum).toLocaleString()}</p>
                </div>

                <div className="space-y-3">
                    <label className="text-[11px] font-black text-[var(--header-text)] uppercase tracking-widest">Set Your Asking Price</label>
                    <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--sidebar-active-text)] font-black text-lg">$</div>
                        <input 
                            type="number"
                            value={formData.pricePerFraction}
                            onChange={(e) => setFormData({...formData, pricePerFraction: Number(e.target.value)})}
                            className="w-full rounded-md bg-black/5 dark:bg-white/5 border border-[var(--sidebar-border)] p-4 focus:outline-none focus:border-[var(--color-primary-300)]/50 text-[var(--header-text)] font-montserrat text-lg font-bold transition-all focus:border-[var(--sidebar-active-text)]/40 focus:ring-4 focus:ring-[var(--sidebar-active-text)]/5 shadow-md"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {["-5% (Quick Sale)", "Market Value", "+5% (Premium)"].map((label) => {
                        const factor = label === "-5% (Quick Sale)" ? 0.95 : label === "+5% (Premium)" ? 1.05 : 1.0;
                        const targetPrice = Math.round(marketValueNum * factor);
                        const isSelected = Math.round(formData.pricePerFraction) === targetPrice;
                        
                        return (
                            <button 
                                key={label}
                                onClick={() => {
                                    setFormData({...formData, pricePerFraction: targetPrice});
                                }}
                                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border ${
                                    isSelected 
                                        ? "bg-[var(--badge-bg)] border-[var(--sidebar-active-text)]/30 text-[var(--sidebar-active-text)] shadow-sm" 
                                        : "bg-[var(--background)] border border-[var(--sidebar-border)] text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:shadow-md"
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[var(--background)] border border-[var(--sidebar-border)] rounded-[2rem] p-8 shadow-inner relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--sidebar-active-text)]/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[var(--sidebar-active-text)]/10 transition-colors" />
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] font-black mb-3">Total Listing Value</p>
                    <p className="text-[36px] font-black text-[var(--header-text)] leading-none tracking-tight mb-2">$ {(formData.fractionsToSell * formData.pricePerFraction).toLocaleString()}</p>
                    <p className="text-[11px] text-[var(--sidebar-active-text)] font-bold uppercase tracking-widest">{formData.fractionsToSell} Assets × $ {parseFloat(formData.pricePerFraction).toLocaleString()}</p>
                </div>
            </div>
        </motion.div>
    );
}

function StepThree({ formData, setFormData, totalPrice }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 sm:space-y-6"
        >
            <div className="bg-[var(--badge-bg)] border border-[var(--sidebar-border)] rounded-lg p-4 flex justify-between items-center min-h-[72px] transition-colors">
                <div>
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Selling</p>
                    <p className="text-sm sm:text-base font-bold text-[var(--header-text)]">{formData.fractionsToSell} fractions</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Price</p>
                    <p className="text-sm sm:text-base font-bold text-[var(--sidebar-active-text)]">$ {totalPrice}</p>
                </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--header-text)]">Minimum purchase quantity</label>
                    <p className="text-[11px] text-[var(--color-text-muted)]">Set the minimum number of fractions a buyer must purchase</p>
                    <div className="relative mt-2 sm:mt-3">
                        <input 
                            type="number"
                            value={formData.minPurchase}
                            onChange={(e) => setFormData({...formData, minPurchase: Number(e.target.value)})}
                            className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-lg px-4 py-3 sm:py-4 text-[var(--header-text)] font-medium focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm">fractions</div>
                    </div>
                </div>
 
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--header-text)]">Additional notes (optional)</label>
                    <div className="relative mt-2 sm:mt-3">
                        <textarea 
                            placeholder="Any additional information for potential buyers..."
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value.slice(0, 500)})}
                            className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-lg px-4 py-3 sm:py-4 text-[var(--header-text)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 h-28 sm:h-36 resize-none placeholder:text-[var(--color-text-muted)]"
                        />
                        <div className="text-[10px] text-[var(--color-text-muted)] mt-2">{formData.notes.length}/500 characters</div>
                    </div>
                </div>
            </div>

        </motion.div>
    );
}

function StepFour({ asset, formData, setFormData }) {
    const items = [
        { label: "Property", value: asset.name },
        { label: "Fractions for Sale", value: `${formData.fractionsToSell} of ${asset.fractions || 100}` },
        { label: "Price per Fraction", value: `$${parseFloat(formData.pricePerFraction).toLocaleString()}`, color: "text-[var(--color-primary-300)]" },
        { label: "Total Asking Price", value: `$${(formData.fractionsToSell * formData.pricePerFraction).toLocaleString()}`, color: "text-[var(--color-primary-300)]", bold: true },
        { label: "Minimum Purchase", value: `${formData.minPurchase} fraction` },
    ];

    const terms = [
        "Your listing will be visible on the Secondary Marketplace immediately",
        "You can cancel this listing anytime before a buyer commits",
        "Platform fee of 2.5% applies on successful transactions",
        "Funds will be transferred within 2-3 business days of sale completion",
        "You remain the owner until the sale is finalized"
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 sm:space-y-6"
        >
            <div className="bg-[var(--badge-bg)] border border-[var(--sidebar-border)] rounded-lg p-4 sm:p-6 space-y-4 transition-colors">
                <h4 className="text-sm font-bold text-[var(--header-text)] mb-2 sm:mb-4">Review Your Listing</h4>
                <div className="space-y-3 sm:space-y-4">
                    {items.map((item, i) => (
                        <div key={i} className={`flex justify-between items-center ${i !== items.length - 1 ? 'border-b border-[var(--sidebar-border)] pb-3 sm:pb-4' : ''}`}>
                            <span className="text-[11px] sm:text-xs text-[var(--color-text-muted)]">{item.label}</span>
                            <span className={`text-[11px] sm:text-xs font-medium ${item.color || 'text-[var(--header-text)]'} ${item.bold ? 'font-bold' : ''}`}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-[var(--badge-bg)] border border-[var(--sidebar-border)] rounded-lg p-4 sm:p-6 space-y-4 transition-colors">
                <h4 className="text-sm font-bold text-[var(--header-text)] mb-2 sm:mb-4">Terms & Conditions</h4>
                <div className="space-y-2 sm:space-y-3">
                    {terms.map((term, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-4 h-4 rounded-full bg-transparent border border-[var(--sidebar-active-text)]/40 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                <CheckIcon className="w-2 h-2 text-[var(--sidebar-active-text)]" />
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-[var(--color-text-muted)] leading-relaxed font-normal">{term}</p>
                        </div>
                    ))}
                </div>
 
                <label className="flex items-center gap-3 cursor-pointer group mt-4 sm:mt-6 pt-2">
                    <div className={`w-5 h-5 rounded transition-all flex items-center justify-center flex-shrink-0 ${
                        formData.agreed ? 'bg-[var(--sidebar-active-text)]' : 'bg-[var(--background)] border border-[var(--sidebar-border)] group-hover:border-[var(--sidebar-active-text)]/50'
                    }`}>
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={formData.agreed} 
                            onChange={() => setFormData({...formData, agreed: !formData.agreed})}
                        />
                        {formData.agreed && <CheckIcon className="w-3 h-3 text-black" />}
                    </div>
                    <span className="text-[11px] sm:text-[12px] text-[var(--header-text)] font-medium">I agree to the terms and conditions</span>
                </label>
            </div>

        </motion.div>
    );
}

function StepFive({ successData }) {
    if (!successData) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 sm:py-12 text-center"
        >
            <div className="w-20 h-20 rounded-full bg-[var(--color-status-success-bg)] border border-[var(--color-status-success)]/20 flex items-center justify-center mb-6 shadow-glow-success">
                <svg className="w-10 h-10 text-[var(--color-status-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={3} 
                        d="M5 13l4 4L19 7" 
                    />
                </svg>
            </div>
            
            <h3 className="text-xl font-black text-[var(--header-text)] uppercase tracking-tight mb-2">Listing Submitted!</h3>
            <p className="text-sm text-[var(--color-text-muted)] max-w-[300px] leading-relaxed mb-8">
                {successData.message || "Your fractions have been successfully submitted for resale."}
            </p>
            
            <div className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-[var(--sidebar-border)] pb-3">
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">Listing Status</span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)] border border-[var(--color-status-warning)]/20">
                        {successData.status?.replace('_', ' ') || "PENDING APPROVAL"}
                    </span>
                </div>
                {successData.sellListingId && (
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">Reference ID</span>
                        <span className="text-[10px] font-mono text-[var(--header-text)]">
                            #{successData.sellListingId.slice(0, 8)}...
                        </span>
                    </div>
                )}
            </div>
            
            <p className="mt-8 text-[10px] text-[var(--color-text-muted)] italic">
                Our team will review your listing shortly. You'll be notified once it's live.
            </p>
        </motion.div>
    );
}
