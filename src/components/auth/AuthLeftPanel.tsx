import Image from "next/image";

export default function AuthLeftPanel() {
  return (
    <div className="auth-left-panel relative hidden lg:flex h-full overflow-hidden bg-[var(--color-bg-dark-alt)]">
     
      <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/assets/images/backgrounds/left-bg.png')`,
            }}
          />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-dark-alt)]/80 via-[var(--color-bg-dark-alt)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-dark-alt)]/95 via-transparent to-[var(--color-bg-dark-alt)]/40" />
      </div>
      
      
      <div className="relative z-10 flex flex-col justify-between w-full h-full px-16 xl:px-24 py-16 xl:py-20">
        
        <div>
          <div className="flex items-baseline gap-3">
            <Image src="/assets/images/branding/logo.png" alt="Glofi Logo" width={112} height={28} className="h-7 w-auto translate-y-[2px]" priority />
           
          </div>
        </div>

        <div>
          <h1 className="text-auth-gradient font-bold text-4xl xl:text-5xl leading-[1.1] tracking-tight mb-6 font-montserrat">
            OWN ANY REAL ESTATE,
            Fraction by Fraction..
          </h1>
          <p className="text-[var(--color-text-secondary)] text-md leading-relaxed max-w-md font-medium font-montserrat">
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
                <p className="text-white font-bold text-xl tracking-tight leading-none mb-2">{s.value}</p>
                <p className="text-[var(--color-text-muted)] text-[10px] font-bold tracking-[0.1em]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
