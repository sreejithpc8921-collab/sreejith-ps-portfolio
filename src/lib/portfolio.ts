export type Project = {
  id: string;
  title: string;
  category: string[];
  youtube_id: string;
  description: string | null;
  tools: string[];
  project_date: string | null;
  sort_order: number;
};

export const CATEGORIES = [
 "All",
  "Automotive",
  "Commercial",
  "Talking Head",
  "Social Media",
  "Color Grading",
  "Motion Graphics",
] as const;

export const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
export const ytThumbFallback = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
