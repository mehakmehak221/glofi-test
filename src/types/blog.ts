export interface BlogPost {
  slug: string;
  id: string;
  title: string;
  link: string;
  pubDate: string;
  isoDate: string;
  excerpt: string;
  imageUrl: string | null;
  author: string;
  contentHtml: string;
  readingTime: string;
}
