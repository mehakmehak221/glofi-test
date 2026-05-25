import Link from 'next/link';
import { JoinNewGenBgGlow } from '../../VectorImages';

export default function JoinNewGenerationSection() {
    return (
        <section id="learn" className="join-new-gen-section">
            <div className="join-new-gen-wrapper">
                <div className="join-new-gen-inner">
                    <div className="join-new-gen__glow-wrap" aria-hidden>
                        
                        <JoinNewGenBgGlow
                            className="join-new-gen__glow join-new-gen__glow--right"
                            filterId="filter0_join_cta_glow_right"
                            corner="right"
                        />
                    </div>

                    <div className="join-new-gen__content">
                        <h2 className="join-new-gen__title">
                            Start Building Real Estate
                            <br />
                            Portfolio
                        </h2>

                        <p className="join-new-gen__description">
                            Access curated investment opportunities and grow your wealth through modern
                            fractional real estate investing.
                        </p>

                        <div className="join-new-gen__cta-row">
                            <Link href="/sign-in" className="join-new-gen__btn-start">
                                Start Investing
                            </Link>
                            <Link href="/explore" className="join-new-gen__btn-arrow" aria-label="Explore properties">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                                    <path
                                        d="M5 15L15 5M15 5H8M15 5V12"
                                        stroke="currentColor"
                                        strokeWidth="1.75"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
