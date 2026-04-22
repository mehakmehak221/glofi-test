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
    <div className="p-4 sm:p-8 lg:p-12 bg-[var(--background)] min-h-screen">
      <div className="w-full">
        
        {/* Header Section */}
        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <BackArrowIcon className="w-5 h-5 text-[var(--foreground)] group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
              Calculate Returns
            </h1>
          </div>
        </div>

        {/* Potential Values Section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-8 bg-[var(--card-surface)] border border-white/5 rounded-[40px] shadow-2xl mb-16 backdrop-blur-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-[#00DAAF]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex flex-col gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
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

          <div className="flex flex-col gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-text-muted)]">
              Net Performance
            </span>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={Math.round(totalReturnPercent)}
                onChange={(e) => handlePercentChange(e.target.value)}
                className="bg-transparent border-none outline-none text-4xl font-black text-[var(--foreground)] w-24 tracking-tighter"
              />
              <span className="text-3xl font-black text-[var(--color-text-muted)]">%</span>
            </div>
          </div>
        </motion.div>

        {/* Investment Controls Section */}
        <div className="space-y-16 mb-20 bg-white/[0.01] p-10 rounded-[40px] border border-white/5 shadow-inner">
          
          {/* PREMIUM SLIDER UI */}
          <div className="space-y-10">
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-xl font-bold text-[var(--foreground)] tracking-tight">Investment Amount</label>
                <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-black opacity-40">Choose your capital</span>
              </div>
              <div className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-2xl shadow-[0_10px_30px_rgba(255,255,255,0.1)] border border-white/10">
                <span className="text-2xl font-black text-black">₹{investmentAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
            
            <div className="relative h-12 flex items-center group">
              {/* Background Track */}
              <div className="absolute w-full h-[6px] bg-white/[0.05] rounded-full overflow-hidden">
                {/* Tick marks for premium feel */}
                <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20">
                  {[...Array(11)].map((_, i) => (
                    <div key={i} className="w-[1px] h-full bg-white/50" />
                  ))}
                </div>
              </div>
              
              {/* Active Progress Fill */}
              <div 
                  className="absolute h-[6px] bg-gradient-to-r from-[#00DAAF]/40 via-[#00DAAF] to-[#00DAAF] rounded-full pointer-events-none transition-all duration-300 ease-out shadow-[0_0_20px_rgba(0,218,175,0.4)]" 
                  style={{ width: `${(investmentAmount / 1000000) * 100}%` }} 
              >
                {/* Animated beam effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-20 h-full -translate-x-full animate-[shimmer_2s_infinite]" style={{ animation: 'shimmer 2s infinite linear' }} />
              </div>

              {/* Range Input (Invisible, providing functionality) */}
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(parseInt(e.target.value))}
                className="absolute w-full h-[6px] opacity-0 cursor-pointer z-20 peer"
              />
              
              {/* Custom Thumb - Animated with Framer Motion logic would be better but CSS for now */}
              <div 
                className="absolute w-8 h-8 bg-white rounded-full border-4 border-[#00DAAF] shadow-[0_0_20px_rgba(0,0,0,0.5),0_0_0_4px_rgba(0,218,175,0.1)] pointer-events-none transition-all duration-300 ease-out z-10 flex items-center justify-center group-hover:scale-110 active:scale-95"
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

          {/* Duration Tabs Control */}
          <div className="space-y-8">
            <div className="flex flex-col gap-1">
              <label className="text-xl font-bold text-[var(--foreground)] tracking-tight">Investment Horizon</label>
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-black opacity-40">Time to maturity</span>
            </div>
            <div className="flex bg-black/40 p-1.5 rounded-[24px] border border-white/10 w-full max-w-2xl relative overflow-hidden group/tabs">
              {[2, 3, 4, 5].map((years) => (
                <button
                  key={years}
                  onClick={() => setSelectedDuration(years)}
                  className={`flex-1 py-4 rounded-[18px] text-sm font-black transition-all duration-500 relative z-10 ${
                    selectedDuration === years
                      ? "text-black shadow-xl"
                      : "text-[var(--color-text-muted)] hover:text-white"
                  }`}
                >
                  {years} Years
                  {selectedDuration === years && (
                    <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#00DAAF] rounded-[18px] -z-10"
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
           className="p-10 bg-[var(--card-surface)] border border-white/10 rounded-[40px] shadow-2xl backdrop-blur-xl relative overflow-hidden group"
        >
            <h2 className="text-2xl font-black text-center mb-12 tracking-tight uppercase">
                Optimized Asset Allocation
            </h2>

            <div className="flex justify-center mb-12">
                <div className="flex bg-black/40 p-1 rounded-full border border-white/5">
                    {["Conservative", "Moderate", "Aggressive", "Custom"].map((risk) => (
                        <button
                            key={risk}
                            onClick={() => {
                                setSelectedRisk(risk);
                                if (risk !== "Custom") setCustomCAGR(ROIS[risk as keyof typeof ROIS]);
                            }}
                            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                selectedRisk === risk
                                    ? "bg-white/10 text-white shadow-lg border border-white/10"
                                    : "text-white/40 hover:text-white"
                            }`}
                        >
                            {risk}
                        </button>
                    ))}
                </div>
            </div>

            {/* Donut Chart - Enlarged Canvas for Full Word Visibility */}
            <div className="relative flex justify-center items-center py-12 min-h-[500px]">
                <svg width="450" height="450" viewBox="0 0 450 450" className="transform -rotate-90 overflow-visible">
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
                                    {/* ASSET NAME TEXT - HIGH CONTRAST AND ADEQUATE SPACE */}
                                    {value > 0.1 && (
                                        <text
                                            x={nx}
                                            y={ny}
                                            fill="rgba(255,255,255,0.7)"
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
                    <div className="w-24 h-24 bg-[var(--background)] rounded-full flex flex-col items-center justify-center border border-white/10 shadow-inner">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">ROI</span>
                        <span className="text-2xl font-black text-white">{(currentRoI * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-4">
                {(Object.keys(ASSET_COLORS) as Array<keyof typeof ASSET_COLORS>).map((asset) => {
                    const Icon = ASSET_ICONS[asset];
                    return (
                        <div key={asset} className="flex flex-col items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-3xl transition-all hover:bg-white/5">
                            <div 
                                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5"
                                style={{ color: ASSET_COLORS[asset] }}
                            >
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-[9px] font-black text-white/80 uppercase tracking-widest text-center leading-tight">
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
