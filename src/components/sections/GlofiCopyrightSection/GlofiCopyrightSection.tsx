'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    InstagramIcon,
    XIcon,
    FbIcon,
    LinkedinIcon,
    YouTubeIcon
} from '../../VectorImages';

export default function GlofiCopyrightSection() {
    const pathname = usePathname();
    const router = useRouter();

    const goHome = () => {
        if (pathname === '/') {
            window.location.assign('/');
            return;
        }
        router.push('/');
    };

    return (
        <section id="support" className="w-full bg-black ">
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 py-10 sm:py-14 lg:py-16">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24 w-full">
                    {/* Left: Logo + Slogan */}
                    <div className="flex flex-col items-start flex-shrink-0">
                        <Link
                            href="/"
                            className="flex items-center flex-shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-300)] cursor-pointer"
                            aria-label="GloFi Estate — Go to homepage"
                            onClick={(e) => {
                                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
                                    return;
                                }
                                e.preventDefault();
                                goHome();
                            }}
                        >
                            <Image
                                src="/assets/images/branding/logo.png"
                                alt="GloFi Estates Logo"
                                width={160}
                                height={80}
                                className="h-10 sm:h-12 w-auto object-contain"
                                aria-hidden
                            />
                        </Link>
                        <p className="mt-5 text-[#8F8F9F] font-montserrat text-sm sm:text-base font-normal tracking-wide leading-relaxed">
                            Own Premium Assets.
                            <br />
                            Fraction by Fraction.
                        </p>
                    </div>

                    {/* Right: Link Columns */}
                    <div className="flex flex-row flex-wrap gap-12 sm:gap-20 lg:gap-28 xl:gap-36">
                        {/* Column 1: Short links */}
                        <div className="flex flex-col gap-4 min-w-[140px]">
                            <h3 className="text-[#00F4C6] font-montserrat font-bold text-sm sm:text-base uppercase tracking-wider">
                                Short links
                            </h3>
                            <ul className="flex flex-col gap-3">
                                <li>
                                    <Link href="#company" className="text-[#8F8F9F] hover:text-white transition-colors duration-200 text-xs sm:text-sm lg:text-base font-medium">
                                        Company
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#product" className="text-[#8F8F9F] hover:text-white transition-colors duration-200 text-xs sm:text-sm lg:text-base font-medium">
                                        Product
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#support" className="text-[#8F8F9F] hover:text-white transition-colors duration-200 text-xs sm:text-sm lg:text-base font-medium">
                                        Support
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#learn" className="text-[#8F8F9F] hover:text-white transition-colors duration-200 text-xs sm:text-sm lg:text-base font-medium">
                                        Learn
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 2: Other pages */}
                        <div className="flex flex-col gap-4 min-w-[140px]">
                            <h3 className="text-[#00F4C6] font-montserrat font-bold text-sm sm:text-base uppercase tracking-wider">
                                Other pages
                            </h3>
                            <ul className="flex flex-col gap-3">
                                <li>
                                    <Link href="/privacy-policy" className="text-[#8F8F9F] hover:text-white transition-colors duration-200 text-xs sm:text-sm lg:text-base font-medium">
                                        Privacy policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#terms" className="text-[#8F8F9F] hover:text-white transition-colors duration-200 text-xs sm:text-sm lg:text-base font-medium">
                                        Terms & conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#cookies" className="text-[#8F8F9F] hover:text-white transition-colors duration-200 text-xs sm:text-sm lg:text-base font-medium">
                                        Cookies
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Horizontal Divider Line */}
                <div className="w-full h-px bg-white/10 my-8 sm:my-10" />

              
            </div>
        </section>
    );
}
