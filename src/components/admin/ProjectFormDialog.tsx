import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CATEGORIES } from "@/lib/portfolio";
import { extractYouTubeId, ytThumb } from "@/lib/admin/youtube";
import { projectSchema, type ProjectFormValues } from "@/lib/admin/validation";
import type { AdminProject } from "@/lib/admin/types";
import { useCreateProject, useUpdateProject } from "@/hooks/use-admin-projects";

const PROJECT_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: AdminProject | null; // null = create mode
};

const EMPTY_VALUES: ProjectFormValues = {
  title: "",
  category: [PROJECT_CATEGORIES[0]],
  youtubeUrl: "",
  description: "",
  tools: "",
  project_date: "",
  is_published: true,
};

export function ProjectFormDialog({ open, onOpenChange, project }: Props) {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const isEdit = !!project;
  const saving = createProject.isPending || updateProject.isPending;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    if (project) {
      form.reset({
        title: project.title,
        category: project.category,
        youtubeUrl: project.youtube_id,
        description: project.description ?? "",
        tools: project.tools?.join(", ") ?? "",
        project_date: project.project_date ?? "",
        is_published: project.is_published,
      });
    } else {
      form.reset(EMPTY_VALUES);
    }
  }, [open, project, form]);

  const youtubeUrl = form.watch("youtubeUrl");
  const previewId = useMemo(() => extractYouTubeId(youtubeUrl || ""), [youtubeUrl]);

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      if (isEdit && project) {
        await updateProject.mutateAsync({ id: project.id, values });
        toast.success("Project updated");
      } else {
        await createProject.mutateAsync(values);
        toast.success("Project added");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit project" : "Add project"}</DialogTitle>
          <DialogDescription>
            Paste a YouTube URL — the video ID and thumbnail are picked up automatically.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
  control={form.control}
  name="category"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Categories</FormLabel>

      <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 p-3">
        {PROJECT_CATEGORIES.map((category) => {
          const checked = field.value.includes(category);

          return (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-white/5"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  if (e.target.checked) {
                    field.onChange([...field.value, category]);
                  } else {
                    field.onChange(
                      field.value.filter((item) => item !== category)
                    );
                  }
                }}
                className="h-4 w-4 accent-red-500"
              />

              <span className="text-sm">{category}</span>
            </label>
          );
        })}
      </div>

      <FormMessage />
    </FormItem>
  )}
/>
            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {previewId && (
              <div className="overflow-hidden rounded-lg border border-white/10 bg-black">
                <img
                  src={ytThumb(previewId)}
                  alt="Video thumbnail preview"
                  className="aspect-video w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${previewId}/hqdefault.jpg`;
                  }}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="GT 650 Cinematic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="What this edit is about…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tools"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tools (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Premiere Pro, After Effects" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-3">
                  <div>
                    <FormLabel>Published</FormLabel>
                    <p className="text-xs text-muted-foreground">Visible on the public site</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-red text-white hover:bg-red/90">
                {saving ? "Saving…" : isEdit ? "Save changes" : "Add project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
