"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, LoadingSpinner, LockIcon, BackArrowIcon, SellerIcon, DocumentIcon, DueDiligenceIcon, TrendingUpIcon, PropertyIcon, ClockIcon, VerifiedIcon } from "@/components/VectorImages";


const PAYMENTS = [
    { id: 'upi', label: 'UPI', desc: 'Instant payment via UPI', fee: '0% fee', color: 'var(--color-primary-300)' },
    { id: 'debit', label: 'Debit Card', desc: 'Visa, Mastercard accepted', fee: '1.5% fee', color: 'var(--color-primary-300)' },
    { id: 'credit', label: 'Credit Card', desc: 'Visa, Mastercard, Amex', fee: '2.5% fee', color: 'var(--color-primary-300)' },
    { id: 'escrow', label: 'Escrow', desc: 'Secure third-party escrow', fee: '0.5% fee', color: 'var(--color-primary-300)' },
    { id: 'crypto', label: 'Crypto', desc: 'BTC, ETH, USDT, USDC', fee: 'Network fee', color: 'var(--color-primary-300)' },
];

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, y: 20 },
};

export default function PaymentModal({ isOpen, onClose, asset, onProcessPayment }) {
    const [step, setStep] = useState(1); 
    const [selectedMethod, setSelectedMethod] = useState(null);

    useEffect(() => {
        if (isOpen) setStep(1);
    }, [isOpen]);

    if (!isOpen || !asset) return null;

    const handleConfirmPayment = async () => {
        setStep(3); 

        if (onProcessPayment) {
            const success = await onProcessPayment();
            if (!success) {
                onClose();
                return;
            }
        }
        
        if (selectedMethod?.id === 'escrow') {
            setTimeout(() => setStep(6), 2000); 
            setTimeout(() => setStep(5), 6000); 
        } else {
            setTimeout(() => setStep(4), 2000); 
            setTimeout(() => setStep(5), 5000); 
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-bg-overlay)] backdrop-blur-sm"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <div className="absolute inset-0" onClick={onClose} />
                    <motion.div
                        className="relative w-[95%] sm:w-full max-w-[520px] max-h-[90vh] overflow-y-auto bg-[var(--background)] border border-[var(--sidebar-border)] rounded-[2rem] mx-auto custom-scrollbar shadow-2xl"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                       
                        <div className="p-5 sm:p-8">
                            {step === 1 && (
                                <StepSelection 
                                    asset={asset} 
                                    onSelect={(method) => { setSelectedMethod(method); setStep(2); }} 
                                    onClose={onClose} 
                                />
                            )}
                            {step === 2 && (
                                <StepDetails 
                                    asset={asset} 
                                    method={selectedMethod} 
                                    onBack={() => setStep(1)} 
                                    onConfirm={handleConfirmPayment} 
                                />
                            )}
                            {step === 3 && <StepProcessing />}
                            {step === 4 && <StepStatus onFinalize={() => setStep(5)} />}
                            {step === 5 && <StepSuccess asset={asset} method={selectedMethod} onClose={onClose} />}
                            {step === 6 && <StepEscrowStatus asset={asset} />}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function StepSelection({ asset, onSelect, onClose }) {
    return (
        <>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold mb-1 text-[var(--header-text)]">Select Payment Method</h2>
                    <p className="text-sm font-medium text-[var(--color-text-muted)]">{asset.name}</p>
                </div>
                <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--header-text)] transition-colors bg-transparent border-0 cursor-pointer p-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="bg-[var(--background)] rounded-2xl p-5 flex justify-between items-center mb-8 border border-[var(--sidebar-border)] shadow-sm">
                <span className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Total Amount</span>
                <span className="text-2xl font-black text-[var(--header-text)]">{asset.currentValue}</span>
            </div>

            <div className="space-y-4">
                {PAYMENTS.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => onSelect(method)}
                        className="w-full group flex items-center justify-between p-5 bg-[var(--background)] border border-[var(--sidebar-border)] rounded-2xl hover:border-[var(--sidebar-active-text)]/30 hover:shadow-lg transition-all text-left cursor-pointer"
                    >
                        <div className="flex items-center gap-4 flex-1 overflow-hidden pr-2">
                            <div className="w-12 h-12 rounded-xl bg-[var(--badge-bg)] flex-shrink-0 flex items-center justify-center text-[var(--sidebar-active-text)]">
                                <PaymentIcon type={method.id} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base font-bold text-[var(--header-text)] group-hover:text-[var(--sidebar-active-text)] transition-colors truncate">{method.label}</h3>
                                <p className="text-xs text-[var(--color-text-muted)] font-medium truncate">{method.desc}</p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-4 flex-shrink-0">
                            <span className="text-xs text-[var(--sidebar-active-text)] font-bold">{method.fee}</span>
                            <span className="text-[var(--color-text-muted)] group-hover:text-[var(--header-text)] transition-colors font-bold text-lg">→</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-[12px] text-[var(--color-text-muted)] mt-8 font-Montserrat">
               <LockIcon className="w-4 h-4 text-[var(--color-text-muted)]" /> 
               <span>All payments are secured with bank-level encryption. Your financial information is never stored.</span>
            </div>
        </>
    );
}

function StepDetails({ asset, method, onBack, onConfirm }) {
    const [selectedCrypto, setSelectedCrypto] = useState('BTC');
    const cryptos = ['BTC', 'ETH', 'USDT', 'USDC'];

    return (
        <>
            <button onClick={onBack} className="text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--header-text)] transition-colors mb-6 flex items-center gap-2 bg-transparent border-0 cursor-pointer">
               <BackArrowIcon className="w-4 h-4" />Back
            </button>
            <h2 className="text-2xl font-bold mb-8 text-[var(--header-text)]">{method.label} Details</h2>

            {method.id === 'upi' && (
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold mb-2 block">UPI ID</label>
                        <input 
                            type="text" 
                            defaultValue="ishant@upi" 
                            className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-xl py-4 px-5 text-sm font-bold text-[var(--header-text)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30"
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center p-8 bg-[var(--background)] rounded-[2rem] border border-[var(--sidebar-border)] shadow-sm">
                        <div className="w-32 h-32 bg-[var(--background)] border border-[var(--sidebar-border)] rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                           {/* Simplified Placeholder for QR */}
                           <div className="w-24 h-24 text-[var(--header-text)]/10">
                               <svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm-3-3h2v2h-2v-2zm0 3h2v2h-2v-2zm3-10h2v2h-2V5zm-3 0h2v2h-2V5zm3 3h2v2h-2V8zm-3 0h2v2h-2V8z"/></svg>
                           </div>
                        </div>
                        <p className="text-xs font-bold text-[var(--color-text-muted)]">Scan QR code with your UPI app</p>
                    </div>
                </div>
            )}

            {(method.id === 'debit' || method.id === 'credit') && (
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold mb-2 block">Card Number</label>
                        <input type="text" placeholder="1234 5678 9012 3456" className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-xl py-4 px-5 text-sm font-bold text-[var(--header-text)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold mb-2 block">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-xl py-4 px-5 text-sm font-bold text-[var(--header-text)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30" />
                        </div>
                        <div>
                            <label className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold mb-2 block">CVV</label>
                            <input type="text" placeholder="123" className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-xl py-4 px-5 text-sm font-bold text-[var(--header-text)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold mb-2 block">Cardholder Name</label>
                        <input type="text" placeholder="JOHN DOE" className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-xl py-4 px-5 text-sm font-bold text-[var(--header-text)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30" />
                    </div>
                </div>
            )}

            {method.id === 'escrow' && (
                <div className="space-y-6">
                    <div className="bg-[var(--background)] rounded-2xl p-5 flex gap-4 border border-[var(--sidebar-border)] shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-[var(--badge-bg)] flex items-center justify-center flex-shrink-0">
                            <span className="text-[var(--sidebar-active-text)]"><VerifiedIcon className="w-6 h-6" /></span>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[var(--header-text)] mb-1">GloFi Secure Escrow</h3>
                            <p className="text-xs text-[var(--color-text-muted)] font-medium">Licensed & Regulated</p>
                        </div>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] font-medium leading-relaxed">
                        Funds held in escrow until property verification, legal review, and seller approval complete.
                    </p>
                    <div>
                        <label className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold mb-2 block">Escrow Provider</label>
                        <div className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-xl py-4 px-5 text-sm font-bold text-[var(--header-text)]">Default Provider</div>
                    </div>
                </div>
            )}

            {method.id === 'crypto' && (
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold mb-3 block">Cryptocurrency</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[var(--background)] p-1.5 rounded-2xl border border-[var(--sidebar-border)]">
                            {cryptos.map(crypto => (
                                <button
                                    key={crypto}
                                    onClick={() => setSelectedCrypto(crypto)}
                                    className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                                        selectedCrypto === crypto 
                                        ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border border-[var(--sidebar-active-text)]/30" 
                                        : "text-[var(--color-text-muted)] hover:text-[var(--header-text)]"
                                    }`}
                                >
                                    {crypto}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[var(--background)] rounded-2xl overflow-hidden border border-[var(--sidebar-border)] shadow-sm">
                        <div className="p-5 space-y-4">
                            <label className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold block">Send to Wallet Address</label>
                            <div className="relative group">
                                <input 
                                    readOnly
                                    type="text" 
                                    value="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" 
                                    className="w-full bg-[var(--background)] border border-[var(--sidebar-border)] rounded-xl py-4 pl-5 pr-12 text-[10px] font-mono font-bold text-[var(--header-text)] focus:outline-none truncate"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sidebar-active-text)] hover:opacity-80 transition-opacity bg-transparent border-0 cursor-pointer">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                </button>
                            </div>
                            <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Network fee: <span className="text-[var(--sidebar-active-text)]">~0.0002 {selectedCrypto}</span></p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 space-y-4 bg-[var(--background)] p-5 rounded-2xl border border-[var(--sidebar-border)]">
                <div className="flex justify-between text-sm">
                    <span className="font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Amount</span>
                    <span className="font-extrabold text-[var(--header-text)]">{asset.currentValue}</span>
                </div>
                <div className="flex justify-between text-base font-black border-t border-[var(--sidebar-border)] pt-4">
                    <span className="text-[var(--header-text)]">Total to Pay</span>
                    <span className="text-[var(--sidebar-active-text)]">{asset.currentValue}</span>
                </div>
            </div>

            <button 
                onClick={onConfirm}
                className="w-full py-4 mt-6 rounded-full bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] font-bold text-sm cursor-pointer border-0 transition-all hover:opacity-90 shadow-[var(--shadow-glow-primary)]"
            >
                Confirm Payment
            </button>
        </>
    );
}

function StepProcessing() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-[var(--badge-bg)] flex items-center justify-center mb-8 shadow-sm">
                <LoadingSpinner className="w-10 h-10 text-[var(--sidebar-active-text)]" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-[var(--header-text)]">Processing Payment</h2>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">Verifying your payment details...</p>
            <div className="flex gap-1.5 mt-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-300)] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-300)] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-300)] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}

function StepStatus() {
    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <div className="text-center w-full">
                <div className="w-20 h-20 rounded-[2rem] bg-[var(--color-status-warning-bg)] flex items-center justify-center mb-8 mx-auto shadow-sm">
                   <ClockIcon className="w-10 h-10 text-[var(--color-status-warning)]" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-[var(--header-text)]">Awaiting Approval</h2>
                <p className="text-sm font-medium text-[var(--color-text-muted)]">Payment received • Processing transaction</p>
            </div>

            <div className="w-full space-y-4">
                <div className="p-6 bg-[var(--background)] rounded-[2rem] flex justify-between items-center border border-[var(--sidebar-border)] shadow-sm">
                    <div className="space-y-2">
                        <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Transaction ID</p>
                        <p className="text-sm font-mono font-bold text-[var(--header-text)]">TX-MMOZWAGT</p>
                    </div>
                    <button className="text-xs font-bold text-[var(--sidebar-active-text)] flex items-center gap-2 hover:opacity-80 transition-opacity bg-[var(--sidebar-active-bg)] px-4 py-2 rounded-xl border-0 cursor-pointer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copy
                    </button>
                </div>

                <div className="p-6 bg-[var(--background)] rounded-[2rem] border border-[var(--sidebar-border)] flex items-center gap-5 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-[var(--color-status-warning-bg)] flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-status-warning)] animate-spin-slow">
                            <path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-[var(--header-text)]">Seller Approval</h3>
                        <p className="text-xs font-bold text-[var(--color-status-warning)]/80 uppercase tracking-widest">In progress...</p>
                    </div>
                </div>

                <div className="p-5 sm:p-6 bg-[var(--color-bg-surface-subtle)] rounded-md flex items-center gap-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--color-bg-surface-subtle)] flex items-center justify-center flex-shrink-0">
                        <DocumentIcon className="w-6 h-6 text-[var(--color-text-muted)]" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-[15px] sm:text-[16px] font-medium text-[var(--color-text-primary)]">Document Verification</h3>
                        <p className="text-[13px] sm:text-[14px] text-[var(--color-text-muted)]">Pending</p>
                    </div>
                </div>

                <div className="p-5 sm:p-6 bg-[var(--color-bg-surface-subtle)] rounded-2xl flex items-center gap-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-[var(--color-bg-surface-subtle)] flex items-center justify-center flex-shrink-0">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-muted)]/30">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-[15px] sm:text-[16px] font-medium text-[var(--color-text-secondary)]">Due Diligence</h3>
                        <p className="text-[13px] sm:text-[14px] text-[var(--color-text-secondary)]">Pending</p>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-[2rem] bg-[var(--color-status-info-bg)] border border-[var(--color-status-info-border)] w-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5 text-[var(--color-status-info)]">
                    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span className="text-[13px] font-medium text-[var(--color-status-info)]">This process typically takes 24-48 hours. You'll receive email updates at each stage.</span>
            </div>
        </div>
    );
}

function StatusItem({ icon, label, status, active }) {
    return null;
}

function StepEscrowStatus({ asset }) {
    return (
        <div className="flex flex-col items-center gap-8">
            <div className="text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-[var(--badge-bg)] flex items-center justify-center mb-6 mx-auto shadow-sm">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--sidebar-active-text)]">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-[var(--header-text)]">Funds in Escrow</h2>
                <p className="text-sm font-medium text-[var(--color-text-muted)]">Securely held until verification complete</p>
            </div>

            <div className="w-full space-y-4">
                <div className="p-6 bg-[var(--background)] rounded-[2rem] border border-[var(--sidebar-border)] shadow-sm space-y-4">
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-[var(--color-text-muted)] uppercase tracking-widest">Escrow ID</span>
                        <span className="text-[var(--header-text)] font-mono">ESC-MMOZZMIV</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-[var(--color-text-muted)] uppercase tracking-widest">Transaction ID</span>
                        <span className="text-[var(--header-text)] font-mono">TX-MMOZZMIV</span>
                    </div>
                    <div className="flex justify-between text-base font-black pt-4 border-t border-[var(--sidebar-border)]">
                        <span className="text-[var(--header-text)]">Escrow Amount</span>
                        <span className="text-[var(--sidebar-active-text)]">{asset.currentValue}</span>
                    </div>
                </div>

                <div className="p-6 bg-[var(--background)] rounded-[2rem] border border-[var(--sidebar-border)] shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-black text-[var(--header-text)] uppercase tracking-widest">Verification Progress</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--color-text-muted)]">Seller Approval</span>
                            <CheckIcon className="w-4 h-4 text-[var(--color-status-success)]" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--color-text-muted)]">Document Upload</span>
                            <CheckIcon className="w-4 h-4 text-[var(--color-status-success)]" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--color-text-muted)]">Legal Review</span>
                            <ClockIcon className="w-4 h-4 text-[var(--color-status-warning)] animate-pulse" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--color-text-muted)]">Due Diligence</span>
                            <ClockIcon className="w-4 h-4 text-[var(--color-status-warning)]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 text-[11px] sm:text-[13px] w-full px-1 sm:px-2 mt-1 sm:mt-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5 sm:w-5 sm:h-5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <div className="text-[var(--color-text-muted)] space-y-2.5 sm:space-y-3 w-full">
                    <p>Escrow funds will be released automatically once:</p>
                    <div className="space-y-1.5 sm:space-y-2 pl-2">
                        <p>Property documents verified</p>
                        <p>Legal due diligence complete</p>
                        <p>Seller approves transaction</p>
                    </div>
                </div>
            </div>

            <button className="w-full py-3.5 sm:py-4 mt-1 sm:mt-2 rounded-xl bg-[var(--color-bg-surface-subtle)] text-[var(--color-text-muted)] text-xs sm:text-sm font-medium cursor-not-allowed transition-colors hover:bg-[var(--color-bg-surface-elevated)]">
                Pending Verification
            </button>
        </div>
    );
}

function StepSuccess({ asset, method, onClose }) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-[2rem] bg-[var(--badge-bg)] flex items-center justify-center mb-8 shadow-sm">
                <div className="w-10 h-10 flex items-center justify-center text-[var(--sidebar-active-text)]">
                    <CheckIcon className="w-12 h-12" />
                </div>
            </div>
            <h2 className="text-3xl font-black mb-2 text-[var(--header-text)]">Investment Complete!</h2>
            <p className="text-base font-bold text-[var(--color-text-muted)] mb-10">1 fraction of {asset.name}</p>

            <div className="w-full space-y-4 mb-10 bg-[var(--background)] p-6 rounded-[2rem] border border-[var(--sidebar-border)] shadow-sm">
                <div className="flex justify-between text-xs font-bold">
                    <span className="text-[var(--color-text-muted)] uppercase tracking-widest">Transaction ID</span>
                    <span className="text-[var(--header-text)] font-mono">TX-MMOZMMIV</span>
                </div>
                {method?.id === 'escrow' && (
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-[var(--color-text-muted)] uppercase tracking-widest">Escrow ID</span>
                        <span className="text-[var(--header-text)] font-mono">ESC-MMOZMMIV</span>
                    </div>
                )}
                <div className="flex justify-between text-xs font-bold">
                    <span className="text-[var(--color-text-muted)] uppercase tracking-widest">Payment Method</span>
                    <span className="text-[var(--header-text)]">{method?.label || 'Direct'}</span>
                </div>
                <div className="flex justify-between text-xs font-black pt-4 border-t border-[var(--sidebar-border)]">
                    <span className="text-[var(--color-text-muted)] uppercase tracking-widest">Status</span>
                    <span className="text-[var(--color-status-success)] bg-[var(--color-status-success-bg)] px-4 py-1.5 rounded-full ring-1 ring-[var(--color-status-success-border)]">✓ COMPLETED</span>
                </div>
            </div>

            <div className="w-full p-8 bg-[var(--background)] rounded-[2.5rem] border border-[var(--sidebar-border)] shadow-sm space-y-8 text-left mb-12">
                <h4 className="text-sm font-black text-[var(--header-text)] uppercase tracking-widest">What's Next?</h4>
                <div className="space-y-6">
                    <div className="flex gap-5">
                        <span className="text-[var(--sidebar-active-text)] bg-[var(--badge-bg)] p-3 rounded-2xl shadow-sm"><DocumentIcon className="w-6 h-6" /></span>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-[var(--header-text)]">Ownership certificates</p>
                            <p className="text-[11px] font-medium text-[var(--color-text-muted)]">Will be issued within 24 hours</p>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <span className="text-[var(--sidebar-active-text)] bg-[var(--badge-bg)] p-3 rounded-2xl shadow-sm"><TrendingUpIcon className="w-6 h-6" /></span>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-[var(--header-text)]">Track portfolio</p>
                            <p className="text-[11px] font-medium text-[var(--color-text-muted)]">View real-time earnings in the dashboard</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button className="flex-1 py-4 rounded-full bg-[var(--background)] border border-[var(--sidebar-border)] text-[var(--header-text)] text-sm font-black flex items-center justify-center gap-2 hover:bg-[var(--sidebar-active-bg)] transition-all cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    Receipt
                </button>
                <button 
                    onClick={onClose}
                    className="flex-1 py-4 rounded-full bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] text-sm font-black hover:opacity-90 transition-all shadow-[var(--shadow-glow-primary)] border-0 cursor-pointer"
                >
                    View Portfolio
                </button>
            </div>
        </div>
    );
}

function PaymentIcon({ type }) {
    switch (type) {
        case 'upi':
            return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.166 1.66663H5.83268C4.91221 1.66663 4.16602 2.41282 4.16602 3.33329V16.6666C4.16602 17.5871 4.91221 18.3333 5.83268 18.3333H14.166C15.0865 18.3333 15.8327 17.5871 15.8327 16.6666V3.33329C15.8327 2.41282 15.0865 1.66663 14.166 1.66663Z" stroke="var(--color-primary-300)" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10 15H10.0083" stroke="var(--color-primary-300)" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>;

        case 'debit':
        case 'credit':
            return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.666 4.16663H3.33268C2.41221 4.16663 1.66602 4.91282 1.66602 5.83329V14.1666C1.66602 15.0871 2.41221 15.8333 3.33268 15.8333H16.666C17.5865 15.8333 18.3327 15.0871 18.3327 14.1666V5.83329C18.3327 4.91282 17.5865 4.16663 16.666 4.16663Z" stroke="var(--color-primary-300)" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M1.66602 8.33337H18.3327" stroke="var(--color-primary-300)" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
;
        case 'escrow':
            return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.666 4.16663H3.33268C2.41221 4.16663 1.66602 4.91282 1.66602 5.83329V14.1666C1.66602 15.0871 2.41221 15.8333 3.33268 15.8333H16.666C17.5865 15.8333 18.3327 15.0871 18.3327 14.1666V5.83329C18.3327 4.91282 17.5865 4.16663 16.666 4.16663Z" stroke="var(--color-primary-300)" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M1.66602 8.33337H18.3327" stroke="var(--color-primary-300)" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
;
        case 'crypto':
            return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.8333 5.83333V3.33333C15.8333 3.11232 15.7455 2.90036 15.5893 2.74408C15.433 2.5878 15.221 2.5 15 2.5H4.16667C3.72464 2.5 3.30072 2.67559 2.98816 2.98816C2.67559 3.30072 2.5 3.72464 2.5 4.16667C2.5 4.60869 2.67559 5.03262 2.98816 5.34518C3.30072 5.65774 3.72464 5.83333 4.16667 5.83333H16.6667C16.8877 5.83333 17.0996 5.92113 17.2559 6.07741C17.4122 6.23369 17.5 6.44565 17.5 6.66667V10M17.5 10H15C14.558 10 14.134 10.1756 13.8215 10.4882C13.5089 10.8007 13.3333 11.2246 13.3333 11.6667C13.3333 12.1087 13.5089 12.5326 13.8215 12.8452C14.134 13.1577 14.558 13.3333 15 13.3333H17.5C17.721 13.3333 17.933 13.2455 18.0893 13.0893C18.2455 12.933 18.3333 12.721 18.3333 12.5V10.8333C18.3333 10.6123 18.2455 10.4004 18.0893 10.2441C17.933 10.0878 17.721 10 17.5 10Z" stroke="var(--color-primary-300)" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M2.5 4.16669V15.8334C2.5 16.2754 2.67559 16.6993 2.98816 17.0119C3.30072 17.3244 3.72464 17.5 4.16667 17.5H16.6667C16.8877 17.5 17.0996 17.4122 17.2559 17.2559C17.4122 17.0997 17.5 16.8877 17.5 16.6667V13.3334" stroke="var(--color-primary-300)" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
;
        default:
            return null;
    }
}
