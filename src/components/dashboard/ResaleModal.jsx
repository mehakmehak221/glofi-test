"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, CheckIcon, ResaleIcon } from "@/components/VectorImages";

export default function ResaleModal({ isOpen, onClose, asset }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fractionsToSell: 25,
        pricePerFraction: 28760,
        minPurchase: 1,
        notes: "",
        agreed: false
    });

    if (!isOpen || !asset) return null;

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const totalOwned = asset.fractions || 100;
    const totalValue = asset.value ? parseFloat(asset.value.replace(/[^0-9.]/g, '')) * 1000 : 719000;
    const marketValuePerFraction = (totalValue / totalOwned).toLocaleString();

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-sm"
                />
                
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[var(--color-bg-dark-alt)] border border-[var(--color-border-muted)] rounded-[24px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                    >
                    <div className="p-4 sm:p-6 border-b border-[var(--color-border-subtle)] flex-shrink-0">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg sm:text-xl font-bold text-white font-Montserrat">List Property for Resale</h2>
                            <button onClick={onClose} className="p-2 hover:bg-[var(--color-bg-surface-subtle)] rounded-full transition-colors border-0 bg-[var(--color-bg-surface-subtle)]  cursor-pointer">
                                <CloseIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-[10px] sm:text-xs text-[var(--color-text-muted)]">Step {step} of 4</p>
                            <div className="flex-1 h-1 bg-[var(--color-bg-surface-subtle)] rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-[var(--color-primary-300)]"
                                    animate={{ width: `${(step / 4) * 100}%` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            </div>
                        </div>
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
                        </AnimatePresence>
                    </div>

                    
                    <div className="p-4 sm:p-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row gap-3 flex-shrink-0">
                        {step > 1 && (
                            <button 
                                onClick={prevStep}
                                className="w-full sm:flex-1 py-3 rounded-xl bg-[var(--color-bg-surface-subtle)] text-white font-semibold text-sm hover:bg-[var(--color-bg-surface-elevated)] transition-colors border-0 cursor-pointer"
                            >
                                Back
                            </button>
                        )}
                        <button 
                            disabled={step === 4 && !formData.agreed}
                            onClick={step === 4 ? onClose : nextStep}
                            className={`w-full sm:flex-1 py-3 rounded-xl font-semibold text-sm transition-all border-0 cursor-pointer ${
                                step === 4 && !formData.agreed 
                                    ? "bg-[var(--color-bg-surface-elevated)] text-[var(--color-text-muted)] cursor-not-allowed" 
                                    : "bg-gradient-to-r from-[var(--color-primary-300)] to-[var(--color-primary-500)] text-black hover:shadow-[0_0_20px_rgba(0,255,205,0.3)]"
                            }`}
                        >
                            {step === 4 ? "List on Marketplace" : "Continue"}
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
            <div className="bg-[var(--color-primary-300-alpha-10)] border border-[var(--color-border-subtle)] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="w-full sm:w-20 h-32 sm:h-20 rounded-lg overflow-hidden relative flex-shrink-0">
                    <Image src={asset.image} alt={asset.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-1">{asset.name}</h3>
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Downtown Dubai, UAE</p>
                    <div className="flex gap-4">
                        <div>
                            <p className="text-[9px] text-[var(--color-text-muted)] uppercase mb-0.5">Your Fractions</p>
                            <p className="text-xs font-bold text-white">{formData.fractionsToSell} / {totalOwned}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-[var(--color-text-muted)] uppercase mb-0.5">Current Value</p>
                            <p className="text-xs font-bold text-[var(--color-primary-300)]">{asset.value}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-sm text-white font-Montserrat">How many fractions do you want to sell?</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="text-[10px] uppercase text-[var(--color-text-muted)] mb-1.5 block">Fractions to Sell</label>
                        <input 
                            type="number"
                            value={formData.fractionsToSell}
                            onChange={(e) => setFormData({...formData, fractionsToSell: e.target.value})}
                            className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border-muted)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary-300)]/50 transition-colors"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] uppercase text-[var(--color-text-muted)] mb-1.5 block">You'll Keep</label>
                        <div className="w-full bg-[var(--color-bg-dark)]/50 border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 text-[var(--color-text-muted)]">
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
                            className="py-2 bg-[var(--color-bg-surface-subtle)] rounded-md text-[10px] text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-bg-surface-elevated)] transition-colors cursor-pointer"
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
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 sm:space-y-6"
        >
            <div className="bg-[var(--color-primary-300-alpha-10)] border border-[var(--color-border-subtle)] rounded-2xl p-4">
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-2">You're selling</p>
                <p className="text-sm font-bold text-white">{formData.fractionsToSell} fractions of {asset.name}</p>
            </div>

            <div className="space-y-4 sm:space-y-5">
                <div className="bg-[var(--color-primary-300-alpha-10)] border border-[var(--color-border-subtle)] rounded-2xl p-4 sm:p-5">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Current Market Value per Fraction</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">$28,760</p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-[var(--color-text-muted)]">Set your asking price per fraction</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] text-sm">$</div>
                        <input 
                            type="number"
                            value={formData.pricePerFraction}
                            onChange={(e) => setFormData({...formData, pricePerFraction: e.target.value})}
                            className="w-full bg-linear-to-r from-[var(--color-primary-300)]/10 to-[var(--color-primary-200)]/5 border border-[var(--color-primary-300)]/20 rounded-2xl pl-10 pr-4 py-3 sm:py-4 text-white font-medium focus:outline-none focus:border-[var(--color-primary-300)]/50 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    {["-5% (Quick Sale)", "Market Value", "+5% (Premium)"].map((label, idx) => (
                        <button 
                            key={label}
                            onClick={() => {
                                if (label === "Market Value") setFormData({...formData, pricePerFraction: 28760});
                              

                            }}
                            className={`py-2 sm:py-3 rounded-xl text-[10px] sm:text-xs font-medium transition-all cursor-pointer border ${
                                label === "Market Value" 
                                    ? "bg-[var(--color-primary-300)]/10 border-[var(--color-primary-300)]/40 text-[var(--color-primary-300)]" 
                                    : "bg-[var(--color-bg-surface-subtle)] border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface-elevated)]"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="bg-[var(--color-bg-dark)]/50 border border-[var(--color-border-subtle)] rounded-2xl p-4 sm:p-6">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Total Asking Price</p>
                    <p className="text-2xl sm:text-[32px] font-bold text-white leading-tight mb-1">$ {(formData.fractionsToSell * formData.pricePerFraction).toLocaleString()}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{formData.fractionsToSell} × ${parseFloat(formData.pricePerFraction).toLocaleString()}</p>
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
            <div className="bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] rounded-2xl p-4 flex justify-between items-center min-h-[72px]">
                <div>
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Selling</p>
                    <p className="text-sm sm:text-base font-bold text-white">{formData.fractionsToSell} fractions</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Price</p>
                    <p className="text-sm sm:text-base font-bold text-[var(--color-primary-300)]">$ {totalPrice}</p>
                </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Minimum purchase quantity</label>
                    <p className="text-[11px] text-[var(--color-text-muted)]">Set the minimum number of fractions a buyer must purchase</p>
                    <div className="relative mt-2 sm:mt-3">
                        <input 
                            type="number"
                            value={formData.minPurchase}
                            onChange={(e) => setFormData({...formData, minPurchase: e.target.value})}
                            className="w-full bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 sm:py-4 text-white font-medium focus:outline-none focus:border-[var(--color-primary-300)]/30 transition-colors"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm">fractions</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Additional notes (optional)</label>
                    <div className="relative mt-2 sm:mt-3">
                        <textarea 
                            placeholder="Any additional information for potential buyers..."
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value.slice(0, 500)})}
                            className="w-full bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-[var(--color-primary-300)]/30 h-28 sm:h-36 resize-none placeholder:text-[var(--color-text-muted)]"
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
            <div className="bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] rounded-2xl p-4 sm:p-6 space-y-4">
                <h4 className="text-sm font-bold text-white mb-2 sm:mb-4">Review Your Listing</h4>
                <div className="space-y-3 sm:space-y-4">
                    {items.map((item, i) => (
                        <div key={i} className={`flex justify-between items-center ${i !== items.length - 1 ? 'border-b border-[var(--color-border-subtle)] pb-3 sm:pb-4' : ''}`}>
                            <span className="text-[11px] sm:text-xs text-[var(--color-text-muted)]">{item.label}</span>
                            <span className={`text-[11px] sm:text-xs font-medium ${item.color || 'text-white'} ${item.bold ? 'font-bold' : ''}`}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] rounded-2xl p-4 sm:p-6 space-y-4">
                <h4 className="text-sm font-bold text-white mb-2 sm:mb-4">Terms & Conditions</h4>
                <div className="space-y-2 sm:space-y-3">
                    {terms.map((term, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-4 h-4 rounded-full bg-transparent border border-[var(--color-primary-300)] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckIcon className="w-2 h-2 text-[var(--color-primary-300)]" />
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-[var(--color-text-muted)] leading-relaxed font-normal">{term}</p>
                        </div>
                    ))}
                </div>

                <label className="flex items-center gap-3 cursor-pointer group mt-4 sm:mt-6 pt-2">
                    <div className={`w-5 h-5 rounded transition-all flex items-center justify-center flex-shrink-0 ${
                        formData.agreed ? 'bg-[var(--color-primary-300)]' : 'bg-[var(--color-bg-surface-elevated)]'
                    }`}>
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={formData.agreed} 
                            onChange={() => setFormData({...formData, agreed: !formData.agreed})}
                        />
                        {formData.agreed && <CheckIcon className="w-3 h-3 text-black" />}
                    </div>
                    <span className="text-[11px] sm:text-[12px] text-white font-medium">I agree to the terms and conditions</span>
                </label>
            </div>
        </motion.div>
    );
}
