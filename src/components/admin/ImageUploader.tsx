import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  value: string | null | undefined;
  onUploaded: (url: string) => void | Promise<void>;
  uploadFn: (file: File) => Promise<string>;
  label?: string;
  shape?: "circle" | "square";
};

export function ImageUploader({ value, onUploaded, uploadFn, label = "Upload image", shape = "circle" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value ?? null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    try {
      const url = await uploadFn(file);
      await onUploaded(url);
      setPreview(url);
      toast.success("Image uploaded");
    } catch (err) {
      setPreview(value ?? null);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className={`relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden border border-white/10 bg-white/[0.03] ${
          shape === "circle" ? "rounded-full" : "rounded-lg"
        }`}
      >
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus className="h-6 w-6 text-muted-foreground" />
        )}
        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-black/60">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
      </div>
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : label}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <p className="mt-1 text-xs text-muted-foreground">PNG or JPG, up to a few MB.</p>
      </div>
    </div>
  );
}
