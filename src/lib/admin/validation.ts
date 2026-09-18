import { z } from "zod";
import { CATEGORIES } from "@/lib/portfolio";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

// CATEGORIES includes "All", which is a filter-only option, not a real category.
const PROJECT_CATEGORIES = CATEGORIES.filter((c) => c !== "All") as [string, ...string[]];

export const projectSchema = z.object({
  title: z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(120, "Title is too long"),
  category: z
  .array(z.enum(PROJECT_CATEGORIES))
  .min(1, "Choose at least one category"),
  
  youtubeUrl: z
    .string()
    .trim()
    .min(1, "Paste a YouTube URL or video ID"),
 description: z.string().trim().max(1000, "Description is too long").optional().or(z.literal("")),
  tools: z.string().trim().optional().or(z.literal("")),
  project_date: z.string().optional().or(z.literal("")),
  is_published: z.boolean(),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  role_title: z.string().trim().min(1, "Role / headline is required").max(150),
  hero_text: z.string().trim().min(1, "Hero text is required").max(500),
  about_text: z.string().trim().min(1, "About text is required").max(2000),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  instagram_url: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  whatsapp_url: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  linkedin_url: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  youtube_url: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;
