import { useState } from "react";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { AdminProject } from "@/lib/admin/types";
import { ytThumb, ytThumbFallback } from "@/lib/portfolio";
import { useDeleteProject, useReorderProjects, useTogglePublish } from "@/hooks/use-admin-projects";

type Props = {
  projects: AdminProject[];
  onEdit: (project: AdminProject) => void;
};

export function ProjectList({ projects, onEdit }: Props) {
  const [order, setOrder] = useState<AdminProject[]>(projects);
  const [dragId, setDragId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProject | null>(null);

  const togglePublish = useTogglePublish();
  const deleteProject = useDeleteProject();
  const reorder = useReorderProjects();

  // Keep local order in sync whenever the server data changes (e.g. after
  // a create/edit/delete elsewhere), but don't fight an in-progress drag.
  if (
    dragId === null &&
    (order.length !== projects.length || order.some((p, i) => p.id !== projects[i]?.id))
  ) {
    setOrder(projects);
  }

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      return;
    }
    const next = [...order];
    const fromIndex = next.findIndex((p) => p.id === dragId);
    const toIndex = next.findIndex((p) => p.id === targetId);
    if (fromIndex === -1 || toIndex === -1) {
      setDragId(null);
      return;
    }
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrder(next);
    setDragId(null);
    reorder.mutate(
      next.map((p) => p.id),
      { onError: () => toast.error("Couldn't save the new order") },
    );
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject.mutateAsync(deleteTarget.id);
      toast.success("Project deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (order.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/10 py-16 text-center text-sm text-muted-foreground">
        No projects yet. Click "Add project" to create your first one.
      </p>
    );
  }

  return (
    <>
      <ul className="space-y-2">
        {order.map((project) => (
          <li
            key={project.id}
            draggable
            onDragStart={() => setDragId(project.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(project.id)}
            className={`flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-colors ${
              dragId === project.id ? "opacity-50" : "hover:border-white/25"
            }`}
          >
            <span className="cursor-grab text-muted-foreground active:cursor-grabbing" aria-label="Drag to reorder">
              <GripVertical className="h-4 w-4" />
            </span>

            <div className="h-14 w-24 shrink-0 overflow-hidden rounded-md bg-black">
              <img
                src={ytThumb(project.youtube_id)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ytThumbFallback(project.youtube_id);
                }}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{project.title}</p>
              <p className="text-xs text-red">{project.category}</p>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={project.is_published}
                onCheckedChange={(checked) =>
                  togglePublish.mutate(
                    { id: project.id, is_published: checked },
                    { onError: () => toast.error("Couldn't update publish status") },
                  )
                }
                aria-label="Toggle published"
              />
              <Button variant="ghost" size="icon" onClick={() => onEdit(project)} aria-label="Edit project">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteTarget(project)}
                aria-label="Delete project"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the project from your portfolio. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
