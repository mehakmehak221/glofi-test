'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/blog';
import { BlogGrid } from '@/components/blog/BlogCard';
import {
    fadeUp,
    fadeUpSubtle,
    staggerContainer,
    useLandingMotion,
} from '@/lib/landingAnimations';
import { useI18n } from '@/providers/LocaleProvider';

type BlogSectionClientProps = {
    posts: BlogPost[];
};

export default function BlogSectionClient({ posts }: BlogSectionClientProps) {
    const { viewProps } = useLandingMotion();
    const { t } = useI18n();

    return (
        <section id="blog" className="blog-section" aria-labelledby="blog-section-heading">
            <div className="blog-section__inner">
                <motion.header
                    className="blog-section__header"
                    {...viewProps}
                    variants={fadeUp}
                >
                    <p className="blog-section__eyebrow">{t('Insights & Updates')}</p>
                    <h2 id="blog-section-heading" className="blog-section__title">
                        {t('From Our Blog')}
                    </h2>
                    <p className="blog-section__subtitle">
                        {t('Latest articles on real estate, PropTech, and fractional investing from GloFi Estates.')}
                    </p>
                </motion.header>

                <motion.div {...viewProps} variants={staggerContainer(0.12, 0.08)}>
                    <motion.div variants={fadeUpSubtle}>
                        <BlogGrid posts={posts} />
                    </motion.div>

                    {posts.length > 0 ? (
                        <motion.div className="blog-section__footer" variants={fadeUpSubtle}>
                            <Link href="/blog" className="blog-section__view-all">
                                {t('View all articles')}
                            </Link>
                        </motion.div>
                    ) : null}
                </motion.div>
            </div>
        </section>
    );
}
