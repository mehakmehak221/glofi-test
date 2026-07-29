import Image from 'next/image';

type BlogPostPlaceholderProps = {
    className?: string;
    compact?: boolean;
};

export default function BlogPostPlaceholder({ className = '', compact = false }: BlogPostPlaceholderProps) {
    return (
        <div
            className={`blog-post-placeholder ${compact ? 'blog-post-placeholder--compact' : ''} ${className}`.trim()}
            aria-hidden
        >
            <Image
                src="/assets/images/branding/logo.png"
                alt=""
                width={compact ? 80 : 160}
                height={compact ? 28 : 56}
                className="blog-post-placeholder__logo"
            />
        </div>
    );
}
