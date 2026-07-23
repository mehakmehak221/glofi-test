import Parser, { type Item } from 'rss-parser';
import sanitizeHtml from 'sanitize-html';
import { unstable_cache } from 'next/cache';
import { BlogPost } from '@/types/blog';

const MEDIUM_FEED_URL = 'https://medium.com/feed/@laxmi_83890';
const REVALIDATE_SECONDS = 3600;

type MediumFeedItem = {
    'content:encoded'?: string;
    content?: string;
    creator?: string;
    author?: string;
};

const parser = new Parser<Record<string, unknown>, MediumFeedItem>();

function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function isValidBlogImage(url: string): boolean {
    try {
        const parsed = new URL(url);
        if (parsed.pathname.includes('/_/stat')) return false;
        if (parsed.hostname === 'medium.com') return false;
        return (
            parsed.hostname === 'cdn-images-1.medium.com' ||
            parsed.hostname === 'miro.medium.com' ||
            parsed.hostname.endsWith('.medium.com')
        );
    } catch {
        return false;
    }
}

function extractImageFromContent(content: string): string | null {
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match: RegExpExecArray | null = imgRegex.exec(content);

    while (match) {
        const url = match[1];
        if (isValidBlogImage(url)) return url;
        match = imgRegex.exec(content);
    }

    return null;
}

function extractExcerpt(content: string, maxLength = 140): string {
    const text = stripHtml(content);
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trimEnd()}…`;
}

function extractSlug(link: string): string {
    return link.split('/').pop()?.split('?')[0] ?? link;
}

function formatPubDate(pubDate?: string): string {
    if (!pubDate) return '';
    const date = new Date(pubDate);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function getReadingTime(content: string): string {
    const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
}

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getMediumImageId(url: string): string | null {
    const match = url.match(/\/([^/]+)$/);
    return match?.[1]?.split('?')[0] ?? null;
}

function removeCoverImageFromHtml(html: string, coverImageUrl: string | null): string {
    if (!coverImageUrl) return html;

    const coverId = getMediumImageId(coverImageUrl);
    if (!coverId) return html;

    const coverPattern = escapeRegex(coverId);
    let cleaned = html.replace(
        new RegExp(
            `<figure>\\s*<img[^>]+src=["'][^"']*${coverPattern}[^"']*["'][^>]*>\\s*(?:<figcaption>[\\s\\S]*?</figcaption>\\s*)?</figure>`,
            'gi'
        ),
        ''
    );

    cleaned = cleaned.replace(
        new RegExp(`<img[^>]+src=["'][^"']*${coverPattern}[^"']*["'][^>]*>`, 'gi'),
        ''
    );

    return cleaned;
}

function prepareArticleHtml(rawHtml: string, coverImageUrl: string | null): string {
    const withoutTracking = rawHtml.replace(
        /<img[^>]+src=["'][^"']*\/_\/stat[^"']*["'][^>]*>/gi,
        ''
    );

    const withoutCoverDuplicate = removeCoverImageFromHtml(withoutTracking, coverImageUrl);

    return sanitizeHtml(withoutCoverDuplicate, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            'img',
            'h1',
            'h2',
            'h3',
            'figure',
            'figcaption',
        ]),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
            a: ['href', 'name', 'target', 'rel'],
        },
        allowedSchemes: ['http', 'https', 'mailto'],
        transformTags: {
            a: sanitizeHtml.simpleTransform('a', {
                target: '_blank',
                rel: 'noopener noreferrer',
            }),
        },
    });
}

function mapFeedItem(
    item: MediumFeedItem & Item,
    feedTitle?: string
): BlogPost {
    const rawContent = item['content:encoded'] ?? item.content ?? item.contentSnippet ?? '';
    const link = item.link ?? item.guid ?? '';
    const slug = extractSlug(link);
    const isoDate = item.isoDate ?? item.pubDate ?? '';
    const imageUrl = extractImageFromContent(rawContent);

    return {
        slug,
        id: slug,
        title: item.title ?? 'Untitled',
        link,
        pubDate: formatPubDate(isoDate),
        isoDate,
        excerpt: extractExcerpt(rawContent || (item.contentSnippet ?? '')),
        imageUrl,
        author: item.creator ?? item.author ?? feedTitle ?? 'GloFi Estates',
        contentHtml: prepareArticleHtml(rawContent, imageUrl),
        readingTime: getReadingTime(rawContent),
    };
}

async function fetchAllMediumPosts(): Promise<BlogPost[]> {
    try {
        const feed = await parser.parseURL(MEDIUM_FEED_URL);
        return (feed.items ?? []).map((item) => mapFeedItem(item, feed.title));
    } catch {
        return [];
    }
}

const getCachedMediumPosts = unstable_cache(
    fetchAllMediumPosts,
    ['medium-blog-posts-v4'],
    { revalidate: REVALIDATE_SECONDS }
);

export async function getMediumPosts(limit?: number): Promise<BlogPost[]> {
    const posts = await getCachedMediumPosts();
    return limit ? posts.slice(0, limit) : posts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await getCachedMediumPosts();
    return posts.find((post) => post.slug === slug || post.id === slug) ?? null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
    const posts = await getCachedMediumPosts();
    return posts.map((post) => post.slug);
}
