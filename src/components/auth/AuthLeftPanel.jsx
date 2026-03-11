"use client";


export default function AuthLeftPanel() {
  return (
    <div className="auth-left-panel relative hidden lg:flex h-full overflow-hidden bg-[#050505]">
     
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/left-bg.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505]/80 via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-transparent to-[#050505]/40" />
      </div>
      
      
      <div className="relative z-10 flex flex-col justify-between w-full h-full px-16 xl:px-24 py-16 xl:py-20">
        
        <div>
          <div className="flex items-baseline gap-3">
            <img src="/assets/logo.png" alt="GloFi Logo" className="h-7 w-auto translate-y-[2px]" />
            <span className="text-[#FFFFFF40] text-[11px] font-medium tracking-[0.25em] uppercase font-montserrat">
              Real Estate
            </span>
          </div>
        </div>

        <div>
          <h1 className="font-bold text-4xl xl:text-5xl leading-[1.1] tracking-tight mb-6 font-montserrat">
            <span className="text-auth-gradient">Own</span>{" "}
            <span className="text-auth-gradient">Premium</span><br />
            <span className="text-auth-gradient">Real Estate,<br />
            Fraction by Fraction</span>
          </h1>
          <p className="text-[#FFFFFF66] text-lg leading-relaxed max-w-md font-medium font-montserrat">
            Institutional-grade properties, digitally simplified. Invest, manage, and grow all in one platform.
          </p>
        </div>

        <div>
          <div className="flex gap-16">
            {[
              { value: "$1.2B+", label: "AUM" },
              { value: "12.5K", label: "INVESTORS" },
              { value: "14.2%", label: "AVG YIELD" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[#FFFFFFE5] font-bold text-xl tracking-tight leading-none mb-2">{s.value}</p>
                <p className="text-[#FFFFFF40] text-[10px] font-bold tracking-[0.1em]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
