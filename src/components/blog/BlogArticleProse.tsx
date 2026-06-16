'use client';

import { useEffect, useRef, useState } from 'react';

const COLLAPSED_HEIGHT = 320;

type BlogArticleProseProps = {
    contentHtml: string;
};

export default function BlogArticleProse({ contentHtml }: BlogArticleProseProps) {
    const [expanded, setExpanded] = useState(false);
    const [canExpand, setCanExpand] = useState(false);
    const proseRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = proseRef.current;
        if (!el) return;
        setCanExpand(el.scrollHeight > COLLAPSED_HEIGHT);
    }, [contentHtml]);

    return (
        <div className="blog-article__prose-wrap">
            <div
                className={`blog-article__prose-inner ${expanded ? 'is-expanded' : 'is-collapsed'}`}
                style={expanded || !canExpand ? undefined : { maxHeight: COLLAPSED_HEIGHT }}
            >
                <div
                    ref={proseRef}
                    className="blog-article__prose"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
                {!expanded && canExpand ? (
                    <div className="blog-article__prose-fade" aria-hidden />
                ) : null}
            </div>

            {canExpand ? (
                <button
                    type="button"
                    className="blog-article__toggle"
                    onClick={() => setExpanded((value) => !value)}
                    aria-expanded={expanded}
                >
                    {expanded ? 'View less' : 'View more'}
                </button>
            ) : null}
        </div>
    );
}
