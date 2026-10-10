import * as m from "@codeday/i18n/messages";
import type { Message } from "@codeday/topo/utils";

export interface BlogCategory {
  value: string;
  slug: string;
  label: () => Message;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { value: "Events", slug: "events", label: m.www_blog_category_events },
  {
    value: "Micro-Internships",
    slug: "micro-internships",
    label: m.www_blog_category_micro_internships,
  },
  {
    value: "Student projects",
    slug: "student-projects",
    label: m.www_blog_category_student_projects,
  },
  { value: "Volunteers", slug: "volunteers", label: m.www_blog_category_volunteers },
  {
    value: "Behind the scenes",
    slug: "behind-the-scenes",
    label: m.www_blog_category_behind_the_scenes,
  },
];

export function categorySlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findCategory(slugOrValue: string | null | undefined): BlogCategory | undefined {
  if (!slugOrValue) return undefined;
  return BLOG_CATEGORIES.find((c) => c.slug === slugOrValue || c.value === slugOrValue);
}

export function categoryLabel(value: string): string {
  return findCategory(value)?.label() ?? value;
}
