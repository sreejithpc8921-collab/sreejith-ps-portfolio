import type { Project } from "@/lib/portfolio";
import type { Tables } from "@/integrations/supabase/types";

// The public site only ever fetches published projects and never needs
// `is_published`. The admin dashboard needs to see and toggle it too.
export type AdminProject = Project & { is_published: boolean };

export type Profile = Tables<"profile">;
