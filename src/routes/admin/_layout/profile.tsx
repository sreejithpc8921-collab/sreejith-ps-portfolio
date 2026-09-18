import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { profileSchema, type ProfileFormValues } from "@/lib/admin/validation";
import { useAdminProfile, useUpdateProfile, useUpdateProfileAsset } from "@/hooks/use-admin-profile";
import { uploadProfileImage } from "@/lib/admin/storage";

export const Route = createFileRoute("/admin/_layout/profile")({
  component: ProfilePage,
});

const EMPTY_VALUES: ProfileFormValues = {
  name: "",
  role_title: "",
  hero_text: "",
  about_text: "",
  email: "",
  phone: "",
  instagram_url: "",
  whatsapp_url: "",
  linkedin_url: "",
  youtube_url: "",
};

function ProfilePage() {
  const { data: profile, isLoading } = useAdminProfile();
  const updateProfile = useUpdateProfile();
  const updateAsset = useUpdateProfileAsset();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!profile) return;
    form.reset({
      name: profile.name ?? "",
      role_title: profile.role_title ?? "",
      hero_text: profile.hero_text ?? "",
      about_text: profile.about_text ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      instagram_url: profile.instagram_url ?? "",
      whatsapp_url: profile.whatsapp_url ?? "",
      linkedin_url: profile.linkedin_url ?? "",
      youtube_url: profile.youtube_url ?? "",
    });
  }, [profile, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile.mutateAsync(values);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Controls the name, hero text, about section and contact links shown on the public site.
      </p>

      <div className="mt-8 max-w-2xl space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground">Profile image</h2>
          <div className="mt-3">
            <ImageUploader
              value={profile?.avatar_url}
              uploadFn={uploadProfileImage}
              onUploaded={(url) => updateAsset.mutateAsync({ avatar_url: url })}
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role / headline</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hero_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero text</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="about_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="instagram_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://wa.me/…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedin_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="youtube_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube channel URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/@…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-red text-white hover:bg-red/90 red-glow"
            >
              {form.formState.isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
