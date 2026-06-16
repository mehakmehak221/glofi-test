'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/lib/mediumBlog';
import { BlogGrid } from '@/components/blog/BlogCard';
import BlogPostPlaceholder from '@/components/blog/BlogPostPlaceholder';
import BlogArticleProse from '@/components/blog/BlogArticleProse';
import { fadeUp, fadeUpSubtle, LANDING_EASE, useLandingMotion } from '@/lib/landingAnimations';

type BlogArticleContentProps = {
    post: BlogPost;
    relatedPosts: BlogPost[];
};

export default function BlogArticleContent({ post, relatedPosts }: BlogArticleContentProps) {
    const { viewProps } = useLandingMotion();

    return (
        <main className="blog-article">
            <section className="blog-article__hero">
                <div className="blog-article__hero-bg" aria-hidden />
                <div className="blog-article__hero-inner">
                    <motion.nav
                        className="blog-article__breadcrumb"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: LANDING_EASE }}
                        aria-label="Breadcrumb"
                    >
                        <Link href="/">Home</Link>
                        <span aria-hidden>/</span>
                        <Link href="/blog">Blog</Link>
                        <span aria-hidden>/</span>
                        <span className="blog-article__breadcrumb-current">Article</span>
                    </motion.nav>

                    <motion.div
                        className="blog-article__hero-content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: LANDING_EASE, delay: 0.06 }}
                    >
                        <div className="blog-article__meta-row">
                            <span className="blog-article__category">GloFi Insights</span>
                            {post.pubDate ? (
                                <time className="blog-article__date">{post.pubDate}</time>
                            ) : null}
                            <span className="blog-article__reading-time">{post.readingTime}</span>
                        </div>
                        <h1 className="blog-article__title">{post.title}</h1>
                        <p className="blog-article__author">By {post.author}</p>
                    </motion.div>
                </div>
            </section>

            <section className="blog-article__body-wrap">
                <div className="blog-article__layout">
                    <motion.article
                        className="blog-article__main"
                        {...viewProps}
                        variants={fadeUpSubtle}
                    >
                        {post.imageUrl ? (
                            <div className="blog-article__cover">
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="blog-article__cover-image"
                                    loading="eager"
                                />
                            </div>
                        ) : (
                            <div className="blog-article__cover blog-article__cover--placeholder">
                                <BlogPostPlaceholder />
                            </div>
                        )}

                        <BlogArticleProse contentHtml={post.contentHtml} />

                        <div className="blog-article__actions">
                            <a
                                href={post.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="blog-article__medium-btn"
                            >
                                Read post
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                                    <path
                                        d="M4 12L12 4M12 4H6M12 4V10"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                            <Link href="/blog" className="blog-article__back-btn">
                                Back to all articles
                            </Link>
                        </div>
                    </motion.article>

                    <motion.aside
                        className="blog-article__sidebar"
                        {...viewProps}
                        variants={fadeUp}
                    >
                        <div className="blog-article__sidebar-card">
                            <p className="blog-article__sidebar-label">About this article</p>
                            <p className="blog-article__sidebar-text">{post.excerpt}</p>
                            <div className="blog-article__sidebar-stats">
                                <div>
                                    <span className="blog-article__sidebar-stat-value">{post.readingTime}</span>
                                    <span className="blog-article__sidebar-stat-label">Reading time</span>
                                </div>
                                {post.pubDate ? (
                                    <div>
                                        <span className="blog-article__sidebar-stat-value">{post.pubDate}</span>
                                        <span className="blog-article__sidebar-stat-label">Published</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="blog-article__sidebar-card blog-article__sidebar-card--accent">
                            <p className="blog-article__sidebar-label">Start investing</p>
                            <p className="blog-article__sidebar-text">
                                Explore fractional real estate opportunities on GloFi Estates.
                            </p>
                            <Link href="/sign-in" className="blog-article__sidebar-cta">
                                Get started
                            </Link>
                        </div>
                    </motion.aside>
                </div>

                {relatedPosts.length > 0 ? (
                    <motion.section
                        className="blog-article__related"
                        {...viewProps}
                        variants={fadeUp}
                    >
                        <div className="blog-archive__list-header">
                            <h2 className="blog-archive__list-title">Related articles</h2>
                        </div>
                        <BlogGrid posts={relatedPosts} />
                    </motion.section>
                ) : null}
            </section>
        </main>
    );
}
