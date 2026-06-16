import { getMediumPosts } from '@/lib/mediumBlog';
import BlogSectionClient from './BlogSectionClient';

export default async function BlogSection() {
    const posts = await getMediumPosts(3);
    return <BlogSectionClient posts={posts} />;
}
