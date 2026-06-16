import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/mediumBlog';
import BlogPostPlaceholder from '@/components/blog/BlogPostPlaceholder';

type BlogCardProps = {
    post: BlogPost;
    className?: string;
};

export default function BlogCard({ post, className = '' }: BlogCardProps) {
    return (
        <article className={`blog-card group ${className}`.trim()}>
            <Link href={`/blog/${post.slug}`} className="blog-card__link">
                <div className="blog-card__media">
                    {post.imageUrl ? (
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="blog-card__image"
                        />
                    ) : (
                        <BlogPostPlaceholder />
                    )}
                </div>
                <div className="blog-card__body">
                    {post.pubDate ? (
                        <time className="blog-card__date">{post.pubDate}</time>
                    ) : null}
                    <h3 className="blog-card__title">{post.title}</h3>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <span className="blog-card__cta">
                        Read article
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                            <path
                                d="M4 12L12 4M12 4H6M12 4V10"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </div>
            </Link>
        </article>
    );
}

type BlogGridProps = {
    posts: BlogPost[];
    className?: string;
};

export function BlogGrid({ posts, className = '' }: BlogGridProps) {
    if (posts.length === 0) {
        return (
            <p className="blog-section__empty">
                No articles yet. Check back soon.
            </p>
        );
    }

    return (
        <div className={`blog-grid ${className}`.trim()}>
            {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
            ))}
        </div>
    );
}
