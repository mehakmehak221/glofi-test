import Image from "next/image";
import Link from "next/link";

import { createTranslator, getServerLocale } from "@/lib/i18n/server";

export default async function AuthLeftPanel() {
  const locale = await getServerLocale();
  const t = createTranslator(locale);

  return (
    <div className="auth-left-panel relative hidden min-h-0 bg-[var(--color-bg-dark-alt)] lg:flex lg:h-full" style={{overflow: 'hidden'}}>

      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/assets/images/backgrounds/left-bg.png')`,
          }}
        />
        <div className="absolute inset-0" />
        <div className="absolute inset-0" />
      </div>


      <div className="relative z-10 flex flex-col justify-between w-full h-full px-16 xl:px-24 py-16 xl:py-20">

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <Link href="/">
              <Image src="/assets/images/branding/logo.png" alt="Glofi Logo" width={135} height={45} className="h-9 w-auto translate-y-[2px] cursor-pointer" priority />
            </Link>

          </div>

        </div>

        <div className="min-w-0">
          <h1 className="auth-panel-heading text-auth-gradient font-bold leading-[1.25] tracking-tight mb-6 font-montserrat">
            {t("OWN ANY REAL ESTATE,")}{" "}{t("Fraction by Fraction..")}
          </h1>
          <p className="auth-panel-desc text-[var(--color-text-secondary)] leading-relaxed font-medium font-montserrat">
            {t("Institutional-grade properties, digitally simplified. Invest, manage, and grow all in one platform.")}
          </p>
        </div>

        <div>

        </div>
      </div>
    </div>
  );
}
