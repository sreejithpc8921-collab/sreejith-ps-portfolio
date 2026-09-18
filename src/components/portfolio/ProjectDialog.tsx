import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink, Share2, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/portfolio";

type Props = { project: Project | null; onClose: () => void };

export function ProjectDialog({ project, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = project ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  const share = async () => {
    if (!project) return;
    const url = `https://youtu.be/${project.youtube_id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: project.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 240 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-red transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${project.youtube_id}?autoplay=1&rel=0`}
                title={project.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-red/40 bg-red/10 px-3 py-1 text-xs font-medium text-red">
                  {project.category}
                </span>
                {project.project_date && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(project.project_date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
                {project.title}
              </h3>
              {project.description && (
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              )}
              {project.tools?.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground">
                    Tools Used
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://youtu.be/${project.youtube_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-red px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
                >
                  Watch on YouTube <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={share}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/5"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Link copied
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" /> Share
                    </>
                  )}
                </button>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      `https://youtu.be/${project.youtube_id}`,
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1600);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm hover:bg-white/5"
                >
                  <Copy className="h-4 w-4" /> Copy link
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
