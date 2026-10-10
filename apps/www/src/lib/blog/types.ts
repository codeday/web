export interface BlogImage {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface BlogAuthor {
  username: string;
  name: string;
  title: string | null;
  bio: string | null;
  picture: string | null;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  titleHighlight: string | null;
  category: string;
  tags: string[];
  featured: boolean;
  publishDate: string;
  previewText: string;
  previewImage: BlogImage | null;
  readingMinutes: number;
  author: BlogAuthor;
}

export interface RichTextMark {
  type: string;
}

export interface RichTextNode {
  nodeType: string;
  value?: string;
  marks?: RichTextMark[];
  data?: Record<string, any>;
  content?: RichTextNode[];
}

export interface PullQuoteAttribution {
  name: string;
  role: string | null;
  organization: string | null;
}
