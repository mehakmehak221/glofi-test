import Navbar from '@/components/sections/Navbar/Navbar';
import GlofiCopyrightSection from '@/components/sections/GlofiCopyrightSection/GlofiCopyrightSection';
import BlogPageContent from '@/components/blog/BlogPageContent';
import { getMediumPosts } from '@/lib/mediumBlog';

export const metadata = {
    title: 'Blog | GloFi Estates',
    description: 'Latest insights on real estate, PropTech, and fractional investing from GloFi Estates.',
};

export default async function BlogPage() {
    const posts = await getMediumPosts();

    return (
        <div className="landing-page w-full min-h-screen bg-[#f4f7f8]">
            <Navbar />
            <BlogPageContent posts={posts} />
            <GlofiCopyrightSection />
        </div>
    );
}
