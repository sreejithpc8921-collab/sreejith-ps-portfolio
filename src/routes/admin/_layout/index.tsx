import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, FileText, UserRound, Eye, EyeOff } from "lucide-react";
import { useAdminProjects } from "@/hooks/use-admin-projects";
import { useAdminProfile } from "@/hooks/use-admin-profile";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/_layout/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { data: projects, isLoading: projectsLoading } = useAdminProjects();
  const { data: profile, isLoading: profileLoading } = useAdminProfile();

  const published = projects?.filter((p) => p.is_published).length ?? 0;
  const unpublished = projects ? projects.length - published : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {profileLoading ? "…" : `Welcome back, ${profile?.name || "there"}.`}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={FolderKanban}
          label="Total projects"
          value={projectsLoading ? undefined : projects?.length ?? 0}
        />
        <StatCard
          icon={Eye}
          label="Published"
          value={projectsLoading ? undefined : published}
        />
        <StatCard
          icon={EyeOff}
          label="Unpublished"
          value={projectsLoading ? undefined : unpublished}
        />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <QuickLink to="/admin/projects" icon={FolderKanban} title="Manage projects" text="Add, edit, reorder or publish your work." />
        <QuickLink to="/admin/resume" icon={FileText} title="Resume" text="Upload or replace your resume PDF." />
        <QuickLink to="/admin/profile" icon={UserRound} title="Profile" text="Update your bio, contact details and photo." />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FolderKanban;
  label: string;
  value: number | undefined;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-red/10 text-red">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          {value === undefined ? (
            <Skeleton className="mt-1 h-7 w-10" />
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  to,
  icon: Icon,
  title,
  text,
}: {
  to: string;
  icon: typeof FolderKanban;
  title: string;
  text: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-red/40 hover:bg-white/[0.04]"
    >
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-red/10 text-red">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </Link>
  );
}
