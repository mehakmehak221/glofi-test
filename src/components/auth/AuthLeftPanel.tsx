import Image from "next/image";

export default function AuthLeftPanel() {
  return (
    <div className="auth-left-panel relative hidden min-h-0 overflow-hidden bg-[var(--color-bg-dark-alt)] lg:flex lg:h-full">

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
            <Image src="/assets/images/branding/logo.png" alt="Glofi Logo" width={135} height={45} className="h-9 w-auto translate-y-[2px]" priority />

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

        </div>
      </div>
    </div>
  );
}
