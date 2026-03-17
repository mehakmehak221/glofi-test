"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, LoadingSpinner, LockIcon, BackArrowIcon, SellerIcon, DocumentIcon, DueDiligenceIcon, TrendingUpIcon, PropertyIcon, ClockIcon } from "@/components/VectorImages";


const PAYMENTS = [
    { id: 'upi', label: 'UPI', desc: 'Instant payment via UPI', fee: '0% fee', color: '#00FFCD' },
    { id: 'debit', label: 'Debit Card', desc: 'Visa, Mastercard accepted', fee: '1.5% fee', color: '#00FFCD' },
    { id: 'credit', label: 'Credit Card', desc: 'Visa, Mastercard, Amex', fee: '2.5% fee', color: '#00FFCD' },
    { id: 'escrow', label: 'Escrow', desc: 'Secure third-party escrow', fee: '0.5% fee', color: '#00FFCD' },
    { id: 'crypto', label: 'Crypto', desc: 'BTC, ETH, USDT, USDC', fee: 'Network fee', color: '#00FFCD' },
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

export default function PaymentModal({ isOpen, onClose, asset }) {
    const [step, setStep] = useState(1); 
    const [selectedMethod, setSelectedMethod] = useState(null);

    useEffect(() => {
        if (isOpen) setStep(1);
    }, [isOpen]);

    if (!isOpen || !asset) return null;

    const handleConfirmPayment = () => {
        setStep(3); 
        
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
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <div className="absolute inset-0" onClick={onClose} />
                    <motion.div
                        className="relative w-full max-w-md bg-[#0D1411] border border-[#FFFFFF0A] rounded-[32px] overflow-hidden"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                       
                        <div className="p-8">
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
                    <h2 className="text-lg font-semibold mb-1 font-Montserrat">Select Payment Method</h2>
                    <p className="text-md font-Montserrat text-[#FFFFFF4D]">{asset.name}</p>
                </div>
                <button onClick={onClose} className="text-[#767676] hover:text-white transition-colors">✕</button>
            </div>

            <div className="bg-[#FFFFFF05] rounded-md p-3 flex justify-between items-center mb-6 border border-white/5">
                <span className="text-lg text-[#767676]">Total Amount</span>
                <span className="text-lg font-bold">${asset.currentValue}</span>
            </div>

            <div className="space-y-3">
                {PAYMENTS.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => onSelect(method)}
                        className="w-full group flex items-center justify-between p-4 bg-[#FFFFFF05]  rounded-md hover:border-[#00FFCD33] transition-all text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#00FFCD10] flex items-center justify-center">
                                <PaymentIcon type={method.id} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white group-hover:text-[#00FFCD] transition-colors">{method.label}</h3>
                                <p className="text-sm text-[#FFFFFF40] font-Montserrat">{method.desc}</p>
                            </div>
                        </div>
                        <div className="flex flex-ro items-center gap-3">
                            <span className="text-[11px] text-[#00DAAF] font-medium font-Montserrat">{method.fee}</span>
                            <span className="text-[#444] group-hover:text-white transition-colors">→</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-[12px] text-[#444] mt-8 font-Montserrat">
               <LockIcon className="w-4 h-4 text-[#444]" /> 
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
            <button onClick={onBack} className="text-xs text-[#767676] hover:text-white transition-colors mb-6 flex items-center gap-2">
               <BackArrowIcon className="w-4 h-4 text-[#444]" />Back
            </button>
            <h2 className="text-xl font-bold mb-6">{method.label} Payment Details</h2>

            {method.id === 'upi' && (
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] text-[#767676] uppercase tracking-wider font-medium font-Montserrat mb-2 block">UPI ID</label>
                        <input 
                            type="text" 
                            defaultValue="ishant@upi" 
                            className="w-full bg-[#FFFFFF05] rounded-md py-3 px-4 text-sm focus:outline-none focus:border-[#00FFCD33] text-[#FFFFFF66]"
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center p-8 bg-[#FFFFFF05] rounded-3xl border border-white/5">
                        <div className="w-32 h-32 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                           <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.3333 10H13.3333C11.4924 10 10 11.4924 10 13.3333V23.3333C10 25.1743 11.4924 26.6667 13.3333 26.6667H23.3333C25.1743 26.6667 26.6667 25.1743 26.6667 23.3333V13.3333C26.6667 11.4924 25.1743 10 23.3333 10Z" stroke="white" strokeOpacity="0.1" strokeWidth="6.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M66.6673 10H56.6673C54.8264 10 53.334 11.4924 53.334 13.3333V23.3333C53.334 25.1743 54.8264 26.6667 56.6673 26.6667H66.6673C68.5083 26.6667 70.0007 25.1743 70.0007 23.3333V13.3333C70.0007 11.4924 68.5083 10 66.6673 10Z" stroke="white" strokeOpacity="0.1" strokeWidth="6.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M23.3333 53.3334H13.3333C11.4924 53.3334 10 54.8258 10 56.6667V66.6667C10 68.5077 11.4924 70 13.3333 70H23.3333C25.1743 70 26.6667 68.5077 26.6667 66.6667V56.6667C26.6667 54.8258 25.1743 53.3334 23.3333 53.3334Z" stroke="white" strokeOpacity="0.1" strokeWidth="6.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M70.0007 53.3334H60.0007C58.2325 53.3334 56.5368 54.0358 55.2866 55.286C54.0364 56.5362 53.334 58.2319 53.334 60V70" stroke="white" strokeOpacity="0.1" strokeWidth="6.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M70 70V70.0333" stroke="white" strokeOpacity="0.1" strokeWidth="6.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M40.0007 23.3334V33.3334C40.0007 35.1015 39.2983 36.7972 38.048 38.0474C36.7978 39.2977 35.1021 40 33.334 40H23.334" stroke="white" strokeOpacity="0.1" strokeWidth="6.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10 40H10.0333" stroke="white" strokeOpacity="0.1" strokeWidth="6.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M40 10H40.0333" stroke="white" strokeOpacity="0.1" strokeWidth="6.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M40 53.3334V53.3667" stroke="white" strokeOpacity="0.1" strokeWidth="6.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M53.334 40H56.6673" stroke="white" strokeOpacity="0.1" strokeWidth="6.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M70 40V40.0333" stroke="white" strokeOpacity="0.1" strokeWidth="6.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M40 70V66.6666" stroke="white" strokeOpacity="0.1" strokeWidth="6.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

                        </div>
                        <p className="text-[10px] font-Montserrat text-[#767676]">Scan QR code with your UPI app</p>
                    </div>
                </div>
            )}

            {(method.id === 'debit' || method.id === 'credit') && (
                <div className="space-y-5">
                    <div>
                        <label className="text-[10px] text-[#444] uppercase tracking-wider font-bold mb-2 block">Card Number</label>
                        <input type="text" placeholder="1234 5678 9012 3456" className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#00FFCD33]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-[#444] uppercase tracking-wider font-bold mb-2 block">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#00FFCD33]" />
                        </div>
                        <div>
                            <label className="text-[10px] text-[#444] uppercase tracking-wider font-bold mb-2 block">CVV</label>
                            <input type="text" placeholder="123" className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#00FFCD33]" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-[#444] uppercase tracking-wider font-bold mb-2 block">Cardholder Name</label>
                        <input type="text" placeholder="JOHN DOE" className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#00FFCD33]" />
                    </div>
                </div>
            )}

            {method.id === 'escrow' && (
                <div className="space-y-6">
                    <div className="bg-[#00FFCD10] border border-[#00FFCD1A] rounded-2xl p-5 flex gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#00DAAF33] flex items-center justify-center flex-shrink-0">
                            <span className="text-[#00DAAF]"><verifiedIcon className="w-5 h-5" /></span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1">GloFi Secure Escrow</h3>
                            <p className="text-[10px] text-[#767676]">Licensed & Regulated</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#767676] leading-relaxed">
                        Funds held in escrow until property verification, legal review, and seller approval complete.
                    </p>
                    <div>
                        <label className="text-[10px] text-[#444] uppercase tracking-wider font-bold mb-2 block">Escrow Provider</label>
                        <div className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white/40">Default Provider</div>
                    </div>
                </div>
            )}

            {method.id === 'crypto' && (
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] text-[#444] uppercase tracking-wider font-bold mb-3 block">Cryptocurrency</label>
                        <div className="grid grid-cols-4 gap-2 bg-black/20 p-1 rounded-2xl border border-white/5">
                            {cryptos.map(crypto => (
                                <button
                                    key={crypto}
                                    onClick={() => setSelectedCrypto(crypto)}
                                    className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all ${
                                        selectedCrypto === crypto 
                                        ? "bg-[#00FFCD10] text-[#00FFCD] border border-[#00FFCD33]" 
                                        : "text-[#767676] hover:text-white"
                                    }`}
                                >
                                    {crypto}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                        <div className="p-5 space-y-3">
                            <label className="text-[10px] text-[#444] uppercase tracking-wider font-bold block">Send to Wallet Address</label>
                            <div className="relative group">
                                <input 
                                    readOnly
                                    type="text" 
                                    value="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" 
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-[10px] font-mono text-white/80 focus:outline-none"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00FFCD] hover:text-[#00e6b8] transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                </button>
                            </div>
                            <p className="text-[10px] text-[#444]">Network fee: <span className="text-[#00FFCD]">~0.0002 {selectedCrypto}</span></p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 space-y-3 bg-[#FFFFFF05] p-5 rounded-md">
                <div className="flex justify-between text-sm">
                    <span className="font-Montserrat text-[#FFFFFF40]">Amount</span>
                    <span className="font-Montserrat text-[#FFFFFF40]">${asset.currentValue}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-white/5 pt-3">
                    <span className="text-[#FFFFFF99]">Total to Pay</span>
                    <span className="text-[#FFFFFF99]">${asset.currentValue}</span>
                </div>
                <button 
                    onClick={onConfirm}
                    className="w-full py-4 rounded-2xl bg-[#00FFCD] text-black text-sm font-bold hover:bg-[#00e6b8] transition-colors mt-4"
                >
                    Confirm Payment
                </button>
            </div>
        </>
    );
}

function StepProcessing() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#00FFCD10] flex items-center justify-center mb-6">
                <LoadingSpinner className="w-8 h-8 text-[#00FFCD]" />
            </div>
            <h2 className="text-xl font-bold mb-2">Processing Payment</h2>
            <p className="text-sm text-[#767676]">Verifying your payment details...</p>
            <div className="flex gap-1.5 mt-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FFCD] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FFCD] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FFCD] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}

function StepStatus() {
    return (
        <div className="flex flex-col items-center gap-8">
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#00DAAF10] flex items-center justify-center mb-6 mx-auto">
                   <ClockIcon className="w-8 h-8 text-[#00DAAF]" />
                </div>
                <h2 className="text-xl font-bold mb-2">Awaiting Approval</h2>
                <p className="text-xs text-[#767676] font-Montserrat">Payment received • Processing transaction</p>
            </div>

            <div className="w-full space-y-4">
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex justify-between items-center mb-6">
                    <div>
                        <p className="text-[10px] text-[#444] mb-1">Transaction ID</p>
                        <p className="text-xs font-mono text-white">TX-8902467</p>
                    </div>
                    <button className="text-[10px] text-[#00FFCD] font-bold">Copy</button>
                </div>

                <div className="space-y-3">
                    <StatusItem icon={<SellerIcon className="text-[#00DAAF]" />} label="Seller Approval" status="In progress..." active />
                    <StatusItem icon={<DocumentIcon className="text-[#00DAAF]" />} label="Document Verification" status="Pending" />
                    <StatusItem icon={<DueDiligenceIcon className="text-[#00DAAF]" />} label="Due Diligence" status="Pending" />
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#444] italic">
                <ClockIcon className="w-3.5 h-3.5" /> 
                <span>This process typically takes 24-48 hours. You'll receive email updates at each stage.</span>
            </div>
        </div>
    );
}

function StatusItem({ icon, label, status, active }) {
    return (
        <div className={`p-4 rounded-2xl border ${active ? 'bg-[#FFFFFF08] border-white/10' : 'border-transparent opacity-40'}`}>
            <div className="flex items-center gap-4">
                <div className="text-lg">{icon}</div>
                <div>
                    <h3 className="text-xs font-bold text-white">{label}</h3>
                    <p className="text-[10px] text-[#00FFCD]">{status}</p>
                </div>
            </div>
        </div>
    );
}

function StepEscrowStatus({ asset }) {
    return (
        <div className="flex flex-col items-center gap-8">
            <div className="text-center">
                <div className="w-16 h-16 rounded-3xl bg-[#00FFCD10] flex items-center justify-center mb-6 mx-auto">
                    <span className="text-3xl"><verifiedIcon className="w-5 h-5" /></span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Funds in Escrow</h2>
                <p className="text-xs text-[#767676]">Securely held until verification complete</p>
            </div>

            <div className="w-full space-y-4">
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex justify-between text-xs">
                        <span className="text-[#444]">Escrow ID</span>
                        <span className="text-white font-mono">ESC-MMOZMMIV</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-[#444]">Transaction ID</span>
                        <span className="text-white font-mono">TX-MMOZMMIV</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                        <span className="text-[#444]">Escrow Amount</span>
                        <span className="text-[#00FFCD] font-bold">${asset.currentValue}</span>
                    </div>
                </div>

                <div className="p-6 bg-black/20 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex justify-between items-center bg-[#FFFFFF05] p-3 rounded-xl border border-white/5">
                        <span className="text-xs font-bold text-[#767676]">Verification Progress</span>
                    </div>
                    <div className="space-y-4 pl-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[#767676]">Seller Approval</span>
                            <span className="text-[#00DAAF]">✓</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[#767676]">Document Upload</span>
                            <span className="text-[#00DAAF]">✓</span>
                        </div>
                        <div className="flex items-center justify-between opacity-50">
                            <span className="text-xs text-[#767676]">Legal Review</span>
                            <ClockIcon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex items-center justify-between opacity-50">
                            <span className="text-xs text-[#767676]">Due Diligence</span>
                            <ClockIcon className="w-3.5 h-3.5 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#00DAAF80] italic">
                <span className="text-[#00DAAF]"><verifiedIcon className="w-5 h-5" /></span>
                <span>Escrow funds will be released automatically once: property documents verified, legal due diligence complete, and seller approves transaction.</span>
            </div>

            <button className="w-full py-4 rounded-2xl bg-[#FFFFFF08] text-[#767676] text-sm font-bold border border-white/5 cursor-default">
                Pending Verification
            </button>
        </div>
    );
}

function StepSuccess({ asset, method, onClose }) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-md bg-[#00DAAF1A] flex items-center justify-center mb-6">
                <div className="w-8 h-8 flex items-center justify-center">
                    <CheckIcon className="w-10 h-10 text-[#00DAAFCC]" />
                </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Investment Complete!</h2>
            <p className="text-sm text-[#767676] mb-8 font-Montserrat">1 fraction of {asset.name}</p>

            <div className="w-full space-y-4 mb-8 bg-[#FFFFFF05] p-4 rounded-md">
                <div className="flex justify-between text-xs">
                    <span className="text-[#FFFFFF66]">Transaction ID</span>
                    <span className="text-white font-mono">TX-MMOZMMIV</span>
                </div>
                {method?.id === 'escrow' && (
                    <div className="flex justify-between text-xs">
                        <span className="text-[#FFFFFF66]">Escrow ID</span>
                        <span className="text-white font-mono">ESC-MMOZMMIV</span>
                    </div>
                )}
                <div className="flex justify-between text-xs">
                    <span className="text-[#FFFFFF66]">Payment Method</span>
                    <span className="text-white">{method?.label || 'Direct'}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-[#FFFFFF66]">Status</span>
                    <span className="text-[#00DAAFB2] bg-[#00DAAF14] px-2 py-1 rounded-full font-bold font-Montserrat">✓ COMPLETED</span>
                </div>
            </div>

            <div className="w-full p-6 bg-[#FFFFFF04] rounded-md space-y-6 text-left  mb-8">
                <h4 className="text-sm font-semibold text-[#767676]">Whats Next?</h4>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <span className="text-[#00DAAF]"><DocumentIcon className="w-5 h-5" /></span>
                        <p className="text-[10px] text-[#FFFFFF66]">Ownership certificates will be issued within 24 hours</p>
                    </div>
                    <div className="flex gap-4">
                        <span className="text-[#00DAAF]"><TrendingUpIcon className="w-5 h-5" /></span>
                        <p className="text-[10px] text-[#FFFFFF66]">Track your portfolio and earnings in the dashboard</p>
                    </div>
                    <div className="flex gap-4">
                        <span className="text-[#00DAAF]"><PropertyIcon className="w-5 h-5" /></span>
                        <p className="text-[10px] text-[#FFFFFF66]">Quarterly yield payments start next period</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 w-full">
                <button className="flex-1 py-3.5 rounded-2xl bg-[#FFFFFF08] text-white text-xs font-bold border border-white/10 flex items-center justify-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    Receipt
                </button>
                <button 
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-2xl bg-[#00FFCD] text-black text-xs font-bold hover:bg-[#00e6b8] transition-colors"
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
<path d="M14.166 1.66663H5.83268C4.91221 1.66663 4.16602 2.41282 4.16602 3.33329V16.6666C4.16602 17.5871 4.91221 18.3333 5.83268 18.3333H14.166C15.0865 18.3333 15.8327 17.5871 15.8327 16.6666V3.33329C15.8327 2.41282 15.0865 1.66663 14.166 1.66663Z" stroke="#00DAAF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10 15H10.0083" stroke="#00DAAF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>;

        case 'debit':
        case 'credit':
            return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.666 4.16663H3.33268C2.41221 4.16663 1.66602 4.91282 1.66602 5.83329V14.1666C1.66602 15.0871 2.41221 15.8333 3.33268 15.8333H16.666C17.5865 15.8333 18.3327 15.0871 18.3327 14.1666V5.83329C18.3327 4.91282 17.5865 4.16663 16.666 4.16663Z" stroke="#00DAAF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M1.66602 8.33337H18.3327" stroke="#00DAAF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
;
        case 'escrow':
            return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.666 4.16663H3.33268C2.41221 4.16663 1.66602 4.91282 1.66602 5.83329V14.1666C1.66602 15.0871 2.41221 15.8333 3.33268 15.8333H16.666C17.5865 15.8333 18.3327 15.0871 18.3327 14.1666V5.83329C18.3327 4.91282 17.5865 4.16663 16.666 4.16663Z" stroke="#00DAAF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M1.66602 8.33337H18.3327" stroke="#00DAAF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
;
        case 'crypto':
            return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.8333 5.83333V3.33333C15.8333 3.11232 15.7455 2.90036 15.5893 2.74408C15.433 2.5878 15.221 2.5 15 2.5H4.16667C3.72464 2.5 3.30072 2.67559 2.98816 2.98816C2.67559 3.30072 2.5 3.72464 2.5 4.16667C2.5 4.60869 2.67559 5.03262 2.98816 5.34518C3.30072 5.65774 3.72464 5.83333 4.16667 5.83333H16.6667C16.8877 5.83333 17.0996 5.92113 17.2559 6.07741C17.4122 6.23369 17.5 6.44565 17.5 6.66667V10M17.5 10H15C14.558 10 14.134 10.1756 13.8215 10.4882C13.5089 10.8007 13.3333 11.2246 13.3333 11.6667C13.3333 12.1087 13.5089 12.5326 13.8215 12.8452C14.134 13.1577 14.558 13.3333 15 13.3333H17.5C17.721 13.3333 17.933 13.2455 18.0893 13.0893C18.2455 12.933 18.3333 12.721 18.3333 12.5V10.8333C18.3333 10.6123 18.2455 10.4004 18.0893 10.2441C17.933 10.0878 17.721 10 17.5 10Z" stroke="#00DAAF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M2.5 4.16669V15.8334C2.5 16.2754 2.67559 16.6993 2.98816 17.0119C3.30072 17.3244 3.72464 17.5 4.16667 17.5H16.6667C16.8877 17.5 17.0996 17.4122 17.2559 17.2559C17.4122 17.0997 17.5 16.8877 17.5 16.6667V13.3334" stroke="#00DAAF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
;
        default:
            return null;
    }
}
