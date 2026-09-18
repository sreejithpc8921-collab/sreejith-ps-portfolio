import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AdminProject } from "@/lib/admin/types";
import type { ProjectFormValues } from "@/lib/admin/validation";
import { extractYouTubeId } from "@/lib/admin/youtube";

const QUERY_KEY = ["admin", "projects"] as const;

export function useAdminProjects() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<AdminProject[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as AdminProject[];
    },
  });
}

function toRow(values: ProjectFormValues) {
  const youtubeId = extractYouTubeId(values.youtubeUrl);
  if (!youtubeId) {
    throw new Error("Couldn't find a valid YouTube video ID in that URL");
  }
  return {
    title: values.title.trim(),
    category: values.category,
    youtube_id: youtubeId,
    description: values.description?.trim() || null,
    tools: values.tools
      ? values.tools
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    project_date: values.project_date || null,
    is_published: values.is_published,
  };
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      // New projects go to the end of the list.
      const { data: existing, error: countError } = await supabase
        .from("projects")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
      if (countError) throw countError;
      const nextSortOrder = (existing?.[0]?.sort_order ?? -1) + 1;

      const { error } = await supabase
        .from("projects")
        .insert({ ...toRow(values), sort_order: nextSortOrder });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: ProjectFormValues }) => {
      const { error } = await supabase.from("projects").update(toRow(values)).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useTogglePublish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from("projects").update({ is_published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

/** Persists a full reordering — called after a drag-and-drop reorder. */
export function useReorderProjects() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          supabase.from("projects").update({ sort_order: index }).eq("id", id),
        ),
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
