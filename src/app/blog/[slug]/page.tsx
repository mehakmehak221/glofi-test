import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar/Navbar';
import GlofiCopyrightSection from '@/components/sections/GlofiCopyrightSection/GlofiCopyrightSection';
import BlogArticleContent from '@/components/blog/BlogArticleContent';
import { getAllBlogSlugs, getBlogPostBySlug, getMediumPosts } from '@/lib/mediumBlog';

type BlogArticlePageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        return { title: 'Article not found | GloFi Estates' };
    }

    return {
        title: `${post.title} | GloFi Estates Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.imageUrl ? [{ url: post.imageUrl }] : undefined,
        },
    };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const allPosts = await getMediumPosts();
    const relatedPosts = allPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

    return (
        <div className="landing-page w-full min-h-screen bg-[#f4f7f8]">
            <Navbar />
            <BlogArticleContent post={post} relatedPosts={relatedPosts} />
            <GlofiCopyrightSection />
        </div>
    );
}
