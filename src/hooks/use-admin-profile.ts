import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/admin/types";
import type { ProfileFormValues } from "@/lib/admin/validation";

const QUERY_KEY = ["admin", "profile"] as const;

export function useAdminProfile() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase.from("profile").select("*").eq("id", true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const { error } = await supabase
        .from("profile")
        .update({
          name: values.name.trim(),
          role_title: values.role_title.trim(),
          hero_text: values.hero_text.trim(),
          about_text: values.about_text.trim(),
          email: values.email.trim(),
          phone: values.phone?.trim() || null,
          instagram_url: values.instagram_url?.trim() || null,
          whatsapp_url: values.whatsapp_url?.trim() || null,
          linkedin_url: values.linkedin_url?.trim() || null,
          youtube_url: values.youtube_url?.trim() || null,
        })
        .eq("id", true);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

/** Used by the resume/profile-image uploaders to save just the new file URL. */
export function useUpdateProfileAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Pick<Partial<Profile>, "avatar_url" | "resume_url">) => {
      const { error } = await supabase.from("profile").update(patch).eq("id", true);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
