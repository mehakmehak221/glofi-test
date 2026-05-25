"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BackArrowIcon } from "@/components/VectorImages";

const ROIS = {
  Conservative: 0.10,
  Moderate: 0.14,
  Aggressive: 0.18,
};

const ALLOCATIONS = {
  Conservative: {
    "Real Estate": 0.15,
    "Gold": 0.20,
    "Fixed Deposit": 0.30,
    "Mutual Funds": 0.30,
    "Stocks": 0.05,
  },
  Moderate: {
    "Real Estate": 0.25,
    "Gold": 0.10,
    "Fixed Deposit": 0.15,
    "Mutual Funds": 0.25,
    "Stocks": 0.25,
  },
  Aggressive: {
    "Real Estate": 0.20,
    "Gold": 0.05,
    "Fixed Deposit": 0.05,
    "Mutual Funds": 0.30,
    "Stocks": 0.40,
  },
  Custom: {
    "Real Estate": 0.20,
    "Gold": 0.20,
    "Fixed Deposit": 0.20,
    "Mutual Funds": 0.20,
    "Stocks": 0.20,
  }
};

const ASSET_COLORS = {
  "Real Estate": "#145E56",
  "Gold": "#D4AF37",
  "Fixed Deposit": "#455A64",
  "Mutual Funds": "#00609C",
  "Stocks": "#7986CB",
};

const ASSET_ICONS = {
    "Real Estate": (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    ),
    "Gold": (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    "Fixed Deposit": (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
    ),
    "Mutual Funds": (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 6l3 12h12l3-12" />
            <path d="M12 3v18" />
        </svg>
    ),
    "Stocks": (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <line x1="12" y1="20" x2="12" y2="10" />
            <line x1="18" y1="20" x2="18" y2="4" />
            <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
    )
};

export default function ReturnsCalculatorPage() {
  const router = useRouter();
  const [investmentAmount, setInvestmentAmount] = useState(360000);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [selectedRisk, setSelectedRisk] = useState("Moderate");
  const [customCAGR, setCustomCAGR] = useState(0.14);

  const currentRoI = useMemo(() => {
    if (selectedRisk === "Custom") return customCAGR;
    return ROIS[selectedRisk as keyof typeof ROIS] || 0.14;
  }, [selectedRisk, customCAGR]);

  const potentialAmount = useMemo(() => {
    return investmentAmount * Math.pow(1 + currentRoI, selectedDuration);
  }, [investmentAmount, currentRoI, selectedDuration]);

  const totalReturnPercent = useMemo(() => {
    return (Math.pow(1 + currentRoI, selectedDuration) - 1) * 100;
  }, [currentRoI, selectedDuration]);

  const allocation = useMemo(() => {
    return ALLOCATIONS[selectedRisk as keyof typeof ALLOCATIONS] || ALLOCATIONS.Moderate;
  }, [selectedRisk]);

  const handleAmountChange = (val: string) => {
    const amount = parseFloat(val) || 0;
    if (amount > 0 && investmentAmount > 0) {
      setSelectedRisk("Custom");
      const cagr = Math.pow(amount / investmentAmount, 1 / selectedDuration) - 1;
      setCustomCAGR(cagr);
    }
  };

  const handlePercentChange = (val: string) => {
    const percent = parseFloat(val) || 0;
    setSelectedRisk("Custom");
    const cagr = Math.pow(1 + percent / 100, 1 / selectedDuration) - 1;
    setCustomCAGR(cagr);
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12 bg-[var(--background)] min-h-screen font-Montserrat transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
       
        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-[var(--dashboard-border)] bg-[var(--card-surface)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all cursor-pointer group shadow-premium"
          >
            <BackArrowIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
              Calculate Returns
            </h1>
          </div>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-8 bg-[var(--card-surface)] border border-[var(--dashboard-border)] rounded-[40px] shadow-2xl mb-16 backdrop-blur-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-[#00DAAF]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex flex-col gap-4 p-6 bg-[var(--foreground)]/5 border border-[var(--dashboard-border)] rounded-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-text-muted)]">
              Estimated Total Amount
            </span>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-[#00DAAF]">₹</span>
              <input
                type="number"
                value={Math.round(potentialAmount)}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="bg-transparent border-none outline-none text-4xl font-black text-[#00DAAF] w-full tracking-tighter"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 bg-[var(--foreground)]/5 border border-[var(--dashboard-border)] rounded-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-text-muted)]">
              Net Performance
            </span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={Math.round(totalReturnPercent)}
                onChange={(e) => handlePercentChange(e.target.value)}
                className="bg-transparent border-none outline-none text-4xl font-black text-[var(--foreground)] tracking-tighter"
                style={{ width: `${Math.max(1, String(Math.round(totalReturnPercent)).length) + 0.5}ch` }}
              />
              <span className="text-3xl font-black text-[var(--color-text-muted)]">%</span>
            </div>
          </div>
        </motion.div>

        
        <div className="space-y-16 mb-20 bg-[var(--foreground)]/[0.02] p-10 rounded-[40px] border border-[var(--dashboard-border)] shadow-inner">
          
      
          <div className="space-y-10">
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-xl font-bold text-[var(--foreground)] tracking-tight">Investment Amount</label>
                <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-black opacity-40">Choose your capital</span>
              </div>
              <div className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-2xl shadow-xl border border-[var(--dashboard-border)] transition-colors">
                <span className="text-2xl font-black">₹{investmentAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
            
            <div className="relative h-12 flex items-center group">
            
              <div className="absolute w-full h-[6px] bg-[var(--foreground)]/10 rounded-full overflow-hidden">

                <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20">
                  {[...Array(11)].map((_, i) => (
                    <div key={i} className="w-[1px] h-full bg-[var(--foreground)]" />
                  ))}
                </div>
              </div>
              
              <div 
                  className="absolute h-[6px] bg-gradient-to-r from-[#00DAAF]/40 via-[#00DAAF] to-[#00DAAF] rounded-full pointer-events-none transition-all duration-300 ease-out shadow-[0_0_20px_rgba(0,218,175,0.4)]" 
                  style={{ width: `${(investmentAmount / 1000000) * 100}%` }} 
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-20 h-full -translate-x-full animate-[shimmer_2s_infinite]" style={{ animation: 'shimmer 2s infinite linear' }} />
              </div>

         
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(parseInt(e.target.value))}
                className="absolute w-full h-[6px] opacity-0 cursor-pointer z-20 peer"
              />
              
      
              <div 
                className="absolute w-8 h-8 bg-white rounded-full border-4 border-[#00DAAF] shadow-xl pointer-events-none transition-all duration-300 ease-out z-10 flex items-center justify-center group-hover:scale-110 active:scale-95"
                style={{ 
                    left: `calc(${(investmentAmount / 1000000) * 100}% - 16px)`,
                    transition: 'left 0.3s ease-out, transform 0.2s ease'
                }}
              >
                 <div className="w-1 h-3 bg-[#00DAAF]/30 rounded-full mx-[1px]" />
                 <div className="w-1 h-3 bg-[#00DAAF]/30 rounded-full mx-[1px]" />
              </div>
            </div>

            <style jsx>{`
              @keyframes shimmer {
                100% { transform: translateX(500%); }
              }
            `}</style>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col gap-1">
              <label className="text-xl font-bold text-[var(--foreground)] tracking-tight">Investment Horizon</label>
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-black opacity-40">Time to maturity</span>
            </div>
            <div className="flex bg-[var(--foreground)]/5 p-1.5 rounded-[24px] border border-[var(--dashboard-border)] w-full max-w-2xl relative overflow-hidden group/tabs">
              {[2, 3, 4, 5].map((years) => (
                <button
                  key={years}
                  onClick={() => setSelectedDuration(years)}
                  className={`flex-1 py-4 rounded-[18px] text-sm font-black transition-all duration-500 relative z-10 ${
                    selectedDuration === years
                      ? "text-[var(--background)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {years} Years
                  {selectedDuration === years && (
                    <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#00DAAF] rounded-[18px] -z-10 shadow-[0_4px_12px_rgba(0,218,175,0.4)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Visualization */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           className="p-10 bg-[var(--card-surface)] border border-[var(--dashboard-border)] rounded-[40px] shadow-2xl backdrop-blur-xl relative overflow-hidden group"
        >
            <h2 className="text-2xl font-black text-center mb-12 tracking-tight uppercase text-[var(--foreground)]">
                Optimized Asset Allocation
            </h2>

            <div className="flex justify-start sm:justify-center mb-12 w-full overflow-hidden">
                <div className="flex bg-[var(--foreground)]/5 p-1 rounded-full border border-[var(--dashboard-border)] max-w-full overflow-x-auto no-scrollbar flex-nowrap">
                    {["Conservative", "Moderate", "Aggressive", "Custom"].map((risk) => (
                        <button
                            key={risk}
                            onClick={() => {
                                setSelectedRisk(risk);
                                if (risk !== "Custom") setCustomCAGR(ROIS[risk as keyof typeof ROIS] || 0.14);
                            }}
                            className={`px-6 py-2.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                selectedRisk === risk
                                    ? "bg-[var(--foreground)] text-[var(--background)] shadow-lg border border-[var(--dashboard-border)]"
                                    : "text-[var(--color-text-muted)] hover:text-[var(--foreground)]"
                            }`}
                        >
                            {risk}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative flex justify-center items-center py-6 sm:py-12 min-h-[300px] sm:min-h-[500px]">
                <svg viewBox="0 0 450 450" className="w-full max-w-[450px] aspect-square transform -rotate-90 overflow-visible">
                    {(() => {
                        let currentAngle = 0;
                        const center = 225;
                        const radius = 105;
                        const labelRadius = 105;
                        const nameRadius = 170;

                        return Object.entries(allocation).map(([key, value]) => {
                            if (value === 0) return null;
                            const strokeDasharray = `${value * 100} 100`;
                            const strokeDashoffset = -currentAngle;
                          
                            const angle = (currentAngle + (value * 100) / 2) * (Math.PI / 50);
                            currentAngle += value * 100;

                            const lx = center + labelRadius * Math.cos(angle);
                            const ly = center + labelRadius * Math.sin(angle);
                            const nx = center + nameRadius * Math.cos(angle);
                            const ny = center + nameRadius * Math.sin(angle);

                            return (
                                <g key={key}>
                                    <motion.circle
                                        cx={center}
                                        cy={center}
                                        r={radius}
                                        fill="transparent"
                                        stroke={ASSET_COLORS[key as keyof typeof ASSET_COLORS] || "#666"}
                                        strokeWidth="50"
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset={strokeDashoffset}
                                        pathLength="100"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 1 }}
                                        strokeLinecap="round"
                                    />
                                    {value > 0.05 && (
                                        <text
                                            x={lx}
                                            y={ly}
                                            fill="white"
                                            fontSize="12"
                                            fontWeight="900"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            transform={`rotate(90, ${lx}, ${ly})`}
                                            className="pointer-events-none"
                                        >
                                            {Math.round(value * 100)}%
                                        </text>
                                    )}
                                    {/* ASSET NAME TEXT - THEME AWARE */}
                                    {value > 0.1 && (
                                        <text
                                            x={nx}
                                            y={ny}
                                            fill="var(--color-text-muted)"
                                            fontSize="10"
                                            fontWeight="900"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            transform={`rotate(90, ${nx}, ${ny})`}
                                            className="pointer-events-none uppercase tracking-widest whitespace-nowrap"
                                        >
                                            {key}
                                        </text>
                                    )}
                                </g>
                            );
                        });
                    })()}
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-24 bg-[var(--background)] rounded-full flex flex-col items-center justify-center border border-[var(--dashboard-border)] shadow-inner transition-colors duration-500">
                        <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">ROI</span>
                        <span className="text-2xl font-black text-[var(--foreground)]">{(currentRoI * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-4">
                {(Object.keys(ASSET_COLORS) as Array<keyof typeof ASSET_COLORS>).map((asset) => {
                    const Icon = ASSET_ICONS[asset];
                    return (
                        <div key={asset} className="flex flex-col items-center gap-3 p-4 bg-[var(--foreground)]/5 border border-[var(--dashboard-border)] rounded-3xl transition-all hover:bg-[var(--foreground)]/10">
                            <div 
                                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--background)] border border-[var(--dashboard-border)]"
                                style={{ color: ASSET_COLORS[asset] }}
                            >
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-[9px] font-black text-[var(--foreground)] uppercase tracking-widest text-center leading-tight opacity-80">
                                {asset}
                            </span>
                        </div>
                    )
                })}
            </div>
        </motion.div>
      </div>
    </div>
  );
}
