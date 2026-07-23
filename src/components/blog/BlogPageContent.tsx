'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/blog';
import { BlogGrid } from '@/components/blog/BlogCard';
import BlogPostPlaceholder from '@/components/blog/BlogPostPlaceholder';
import {
    fadeUp,
    fadeUpSubtle,
    LANDING_EASE,
    staggerContainer,
    useLandingMotion,
} from '@/lib/landingAnimations';

const BLOG_SOURCE_PROFILE = 'https://medium.com/@laxmi_83890';

type BlogPageContentProps = {
    posts: BlogPost[];
};

function BlogPostMedia({ post, className = '' }: { post: BlogPost; className?: string }) {
    if (post.imageUrl) {
        return (
            <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`blog-archive__image ${className}`.trim()}
            />
        );
    }

    return <BlogPostPlaceholder className={className} />;
}

function FeaturedPost({ post }: { post: BlogPost }) {
    return (
        <motion.article className="blog-archive__featured" variants={fadeUpSubtle}>
            <Link href={`/blog/${post.slug}`} className="blog-archive__featured-link">
                <div className="blog-archive__featured-media">
                    <BlogPostMedia post={post} />
                    <div className="blog-archive__featured-overlay" aria-hidden />
                    <span className="blog-archive__featured-badge">Featured</span>
                </div>
                <div className="blog-archive__featured-body">
                    <div className="blog-archive__featured-meta">
                        {post.pubDate ? (
                            <time className="blog-archive__date">{post.pubDate}</time>
                        ) : null}
                        <span className="blog-archive__reading-time">{post.readingTime}</span>
                    </div>
                    <h2 className="blog-archive__featured-title">{post.title}</h2>
                    <p className="blog-archive__featured-excerpt">{post.excerpt}</p>
                    <span className="blog-archive__read-btn">
                        Read full article
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                            <path
                                d="M4 14L14 4M14 4H7M14 4V11"
                                stroke="currentColor"
                                strokeWidth="1.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </div>
            </Link>
        </motion.article>
    );
}

export default function BlogPageContent({ posts }: BlogPageContentProps) {
    const { viewProps } = useLandingMotion();
    const [featured, ...rest] = posts;

    return (
        <main className="blog-archive">
            <section className="blog-archive__hero">
                <div className="blog-archive__hero-bg" aria-hidden />
                <div className="blog-archive__hero-glow" aria-hidden />
                <div className="blog-archive__hero-inner">
                    <motion.nav
                        className="blog-archive__breadcrumb"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: LANDING_EASE }}
                        aria-label="Breadcrumb"
                    >
                        <Link href="/">Home</Link>
                        <span aria-hidden>/</span>
                        <span>Blog</span>
                    </motion.nav>

                    <motion.div
                        className="blog-archive__hero-content"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: LANDING_EASE, delay: 0.08 }}
                    >
                        <p className="blog-archive__eyebrow">GloFi Insights</p>
                        <h1 className="blog-archive__title">
                            Ideas shaping the future of real estate
                        </h1>
                        <p className="blog-archive__subtitle">
                            Deep dives on PropTech, fractional investing, and building wealth through
                            institutional-grade assets.
                        </p>
                        <div className="blog-archive__hero-meta">
                            <span className="blog-archive__pill">
                                {posts.length} {posts.length === 1 ? 'article' : 'articles'}
                            </span>
                       
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="blog-archive__content">
                <div className="blog-archive__content-inner">
                    {posts.length === 0 ? (
                        <div className="blog-archive__empty">
                            <p>No articles published yet.</p>
                            <a href={BLOG_SOURCE_PROFILE} target="_blank" rel="noopener noreferrer">
                                Follow our blog
                            </a>
                        </div>
                    ) : (
                        <motion.div {...viewProps} variants={staggerContainer(0.1, 0.06)}>
                            {featured ? <FeaturedPost post={featured} /> : null}

                            <motion.div className="blog-archive__grid-wrap" variants={fadeUp}>
                                <div className="blog-archive__list-header">
                                    <h2 className="blog-archive__list-title">All articles</h2>
                                    <span className="blog-archive__list-count">
                                        {posts.length} {posts.length === 1 ? 'story' : 'stories'}
                                    </span>
                                </div>
                                <BlogGrid posts={rest.length > 0 ? rest : posts} />
                            </motion.div>
                        </motion.div>
                    )}

                    <motion.aside className="blog-archive__cta" {...viewProps} variants={fadeUp}>
                        <div className="blog-archive__cta-glow" aria-hidden />
                        <div className="blog-archive__cta-content">
                            <p className="blog-archive__cta-label">Stay in the loop</p>
                            <h2 className="blog-archive__cta-title">Get every new post</h2>
                          
                            <a
                                href={BLOG_SOURCE_PROFILE}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="blog-archive__cta-btn"
                            >
                                Follow GloFi Blog
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                                    <path
                                        d="M4 14L14 4M14 4H7M14 4V11"
                                        stroke="currentColor"
                                        strokeWidth="1.75"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                        </div>
                    </motion.aside>
                </div>
            </section>
        </main>
    );
}
