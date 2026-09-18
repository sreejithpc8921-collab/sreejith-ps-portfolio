import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useAdminProjects } from "@/hooks/use-admin-projects";
import { ProjectList } from "@/components/admin/ProjectList";
import { ProjectFormDialog } from "@/components/admin/ProjectFormDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminProject } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/_layout/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects, isLoading, isError } = useAdminProjects();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null);

  const openCreate = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const openEdit = (project: AdminProject) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag to reorder. Toggle to publish or unpublish.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-red text-white hover:bg-red/90 red-glow">
          <Plus className="h-4 w-4" />
          Add project
        </Button>
      </div>

      <div className="mt-8">
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        )}

        {isError && (
          <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            Couldn't load projects. Try refreshing the page.
          </p>
        )}

        {!isLoading && !isError && <ProjectList projects={projects ?? []} onEdit={openEdit} />}
      </div>

      <ProjectFormDialog open={dialogOpen} onOpenChange={setDialogOpen} project={editingProject} />
    </div>
  );
}
