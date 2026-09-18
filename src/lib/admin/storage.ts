import { supabase } from "@/integrations/supabase/client";

const BUCKET = "portfolio-assets";

/**
 * Uploads a file to a fixed path inside the public "portfolio-assets" bucket,
 * overwriting whatever was there before (so "replace" is just "upload again").
 * Returns the public URL, cache-busted with a timestamp query param so the
 * browser/CDN doesn't keep serving a stale cached file after a replace.
 */
async function uploadToPath(file: File, path: string): Promise<string> {
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    cacheControl: "3600",
    contentType: file.type || undefined,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function uploadResume(file: File): Promise<string> {
  if (file.type !== "application/pdf") {
    throw new Error("Resume must be a PDF file");
  }
  return uploadToPath(file, "resume/resume.pdf");
}

export async function uploadProfileImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Profile image must be an image file");
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  return uploadToPath(file, `profile/avatar.${ext}`);
}
