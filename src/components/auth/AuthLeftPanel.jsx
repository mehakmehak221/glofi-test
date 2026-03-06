"use client";

/**
 * AuthLeftPanel — The hero left panel shown on all auth/onboarding screens.
 * Matches the design: dark bg with city image overlay, hero text, bottom stats.
 */
import { LogoIcon } from "@/components/VectorImages";

export default function AuthLeftPanel() {
  return (
    <div className="auth-left-panel relative hidden lg:flex flex-col justify-between h-full overflow-hidden bg-[#050505] px-10 py-10">
      
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80')`,
        }}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050505]/80 via-[#050505]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-transparent to-[#050505]/40" />

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5">
          {/* Glofi icon mark */}
          <LogoIcon />
          <span className="text-white font-bold text-xl tracking-tight">
            Glo<span className="text-[#00FFCD]">Fi</span>
          </span>
          <span className="text-[#767676] text-xs font-medium tracking-widest uppercase ml-1">
            Real Estate
          </span>
        </div>
      </div>

      {/* Hero Text */}
      <div className="relative z-10">
        <h1 className="text-white font-bold text-4xl xl:text-5xl leading-tight tracking-tight mb-4">
          Own Premium{" "}
          <span className="text-[#00FFCD]">Real Estate,</span>
          <br />
          Fraction by Fraction
        </h1>
        <p className="text-[#a0a0a0] text-base leading-relaxed max-w-sm">
          Institutional-grade properties, digitally simplified. Invest, manage, and grow all in one platform.
        </p>
      </div>

      {/* Bottom Stats */}
      <div className="relative z-10 flex items-end justify-between">
        <div className="flex gap-8">
          {[
            { value: "$1.2B+", label: "AUM" },
            { value: "12.5K", label: "INVESTORS" },
            { value: "14.2%", label: "AVG YIELD" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-white font-bold text-2xl tracking-tight">{s.value}</p>
              <p className="text-[#767676] text-xs font-medium tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
