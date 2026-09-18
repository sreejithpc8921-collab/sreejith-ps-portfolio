import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FileText, Upload, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProfile, useUpdateProfileAsset } from "@/hooks/use-admin-profile";
import { uploadResume } from "@/lib/admin/storage";

export const Route = createFileRoute("/admin/_layout/resume")({
  component: ResumePage,
});

function ResumePage() {
  const { data: profile, isLoading } = useAdminProfile();
  const updateAsset = useUpdateProfileAsset();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadResume(file);
      await updateAsset.mutateAsync({ resume_url: url });
      toast.success("Resume uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Resume</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload a PDF resume. Uploading again replaces the existing file.
      </p>

      <div className="mt-8 max-w-lg rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red/10 text-red">
          <FileText className="h-6 w-6" />
        </span>

        {isLoading ? (
          <Skeleton className="mx-auto mt-4 h-5 w-40" />
        ) : profile?.resume_url ? (
          <>
            <p className="mt-4 text-sm text-muted-foreground">A resume is currently uploaded.</p>
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-red hover:underline"
            >
              <Download className="h-3.5 w-3.5" /> View current resume.pdf
            </a>
          </>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No resume uploaded yet.</p>
        )}

        <div className="mt-6">
          <Button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="bg-red text-white hover:bg-red/90 red-glow"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {profile?.resume_url ? "Replace resume" : "Upload resume"}
              </>
            )}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <p className="mt-2 text-xs text-muted-foreground">PDF only.</p>
        </div>
      </div>
    </div>
  );
}
