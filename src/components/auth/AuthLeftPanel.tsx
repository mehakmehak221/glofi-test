import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { createTranslator, getServerLocale } from "@/lib/i18n/server";

export default async function AuthLeftPanel() {
  const locale = await getServerLocale();
  const t = createTranslator(locale);

  return (
    <div className="auth-left-panel relative hidden min-h-0 overflow-hidden bg-[var(--color-bg-dark-alt)] lg:flex lg:h-full">

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
          <LanguageSwitcher />
        </div>

        <div>
          <h1 className="text-auth-gradient font-bold text-4xl xl:text-5xl leading-[1.1] tracking-tight mb-6 font-montserrat">
            {t("OWN ANY REAL ESTATE,")}
            <br />
            {t("Fraction by Fraction..")}
          </h1>
          <p className="text-[var(--color-text-secondary)] text-md leading-relaxed max-w-md font-medium font-montserrat">
            {t("Institutional-grade properties, digitally simplified. Invest, manage, and grow all in one platform.")}
          </p>
        </div>

        <div>

        </div>
      </div>
    </div>
  );
}
