import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Mail,
  Instagram,
  MessageCircle,
  Copy,
  Check,
  Download,
  ArrowUp,
  Play,
  Film,
  Palette,
  Music4,
  Sparkles,
  Clapperboard,
  Send,
  Wand2,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/portfolio/Navbar";
import { MagneticButton } from "@/components/portfolio/MagneticButton";
import { ParticleBg } from "@/components/portfolio/ParticleBg";
import { ProjectDialog } from "@/components/portfolio/ProjectDialog";
import { CATEGORIES, type Project, ytThumb, ytThumbFallback } from "@/lib/portfolio";
import heroPortrait from "@/assets/hero-portrait.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sreejith PS — Video Editor & Cinematic Colorist" },
      {
        name: "description",
        content:
          "Video editor crafting premium films through storytelling, sound design, motion graphics and professional color grading.",
      },
      {
        property: "og:title",
        content: "Sreejith PS — Video Editor",
      },
      {
        property: "og:description",
        content:
          "Premium cinematic automotive edits — storytelling, pacing, sound design & color grading.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Sreejith PS — Video Editor" },
      {
        name: "twitter:description",
        content:
          "Premium cinematic edits — storytelling, pacing, sound design & color grading.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const on = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Projects onOpen={setSelected} />
      <About />
      <Workflow />
      <Skills />
      <Resume />
      <Contact />
      <Footer />
      <ProjectDialog project={selected} onClose={() => setSelected(null)} />

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full bg-red text-white red-glow hover:brightness-110"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden hero-bg pt-32 md:pt-40 pb-20 md:pb-28">
      <div className="absolute inset-0 opacity-60">
        <ParticleBg />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-red/30 bg-red/10 px-3 py-1 text-xs font-medium text-red">
            <span className="h-1.5 w-1.5 rounded-full bg-red animate-pulse" />
            Available for new projects
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-balance">
            Sreejith <span className="text-red">PS</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-medium text-white/90">
             Video Editor
          </p>
          <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            I transform raw footage into engaging, polished videos through strong storytelling, precise pacing, sound design, motion graphics, and professional color grading.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticButton
              variant="primary"
              onClick={() =>
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span className="inline-flex items-center gap-2">
                View Projects <Play className="h-4 w-4" />
              </span>
            </MagneticButton>
            <MagneticButton
              variant="outline"
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Contact Me
            </MagneticButton>
            <MagneticButton variant="ghost" href="#resume">
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" /> Resume PDF
              </span>
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 shadow-elegant animate-float-slow">
            <div
              className="absolute inset-0 -z-10 blur-3xl opacity-60"
              style={{
                background:
                  "radial-gradient(60% 40% at 50% 0%, oklch(0.62 0.24 25 / 0.5), transparent)",
              }}
            />
            <img
              src={heroPortrait}
              alt="Portrait of Sreejith PS, video editor"
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80">
      
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- PROJECTS ---------------- */

type OEmbed = { title: string; thumbnail_url: string };

function useYouTubeTitle(id: string, fallback: string) {
  const q = useQuery({
    queryKey: ["oembed", id],
    queryFn: async (): Promise<OEmbed | null> => {
      try {
        const res = await fetch(
          `https://www.youtube.com/oembed?url=https://youtu.be/${id}&format=json`,
        );
        if (!res.ok) return null;
        return (await res.json()) as OEmbed;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 60,
  });
  return q.data?.title ?? fallback;
}

function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Project[];
    },
  });

 const filtered = useMemo(() => {
  // No filters selected = show all projects
  if (selectedCategories.length === 0) {
    return projects;
  }

  // Show projects matching ANY selected category
  return projects.filter((p) =>
  p.category.some((category) => selectedCategories.includes(category))
  );
}, [projects, selectedCategories]);

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Selected Works"
          title={
            <>
              Featured <span className="text-red">Projects</span>
            </>
          }
          subtitle="A curated selection of video editing projects across automotive, commercial, social media, and creative content."
        />

       <div className="mt-10 flex flex-wrap gap-2">
  {CATEGORIES.map((c) => {
    const isAll = c === "All";

    const active = isAll
      ? selectedCategories.length === 0
      : selectedCategories.includes(c);

    const handleClick = () => {
  if (isAll) {
    setSelectedCategories([]);
    return;
  }

  setSelectedCategories((current) =>
    current.includes(c) ? [] : [c]
  );
};

    return (
      <button
        key={c}
        onClick={handleClick}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
          active
            ? "bg-red text-white red-glow"
            : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-white hover:border-white/25"
        }`}
      >
        {c}
      </button>
    );
  })}
</div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
              />
            ))}

          {!isLoading && filtered.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-10">
              No projects in this category yet.
            </p>
          )}

          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) {
  const title = useYouTubeTitle(project.youtube_id, project.title);
  const [imgSrc, setImgSrc] = useState(ytThumb(project.youtube_id));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.button
      ref={ref}
      onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-card text-left transition-all hover:border-red/50 hover:-translate-y-1"
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        <img
          src={imgSrc}
          onError={() => setImgSrc(ytThumbFallback(project.youtube_id))}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-red red-glow">
            <Play className="h-6 w-6 text-white translate-x-0.5" fill="currentColor" />
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {project.category.map((category) => (
            <span
              key={category}
              className="text-xs font-medium uppercase tracking-wider text-red"
            >
              {category}
            </span>
          ))}
        </div>
        <h3 className="mt-3 text-xl font-semibold leading-tight">
          {title}
        </h3>
      </div>
    </motion.button>
  );
}

/* ---------------- ABOUT ---------------- */

const ABOUT_ITEMS = [
  { icon: Clapperboard, title: "Video Editing", text: "Story-driven edits with clean pacing, seamless cuts, and a strong visual flow." },
  { icon: Film, title: "Commercial Editing", text: "Punchy, brand-aligned edits with rhythm and clarity." },
  { icon: Palette, title: "Color Grading", text: "Professional color correction and creative grading to establish the right look, mood, and consistency." },
  { icon: Sparkles, title: "Motion Graphics", text: "Clean titles, transitions, animations, and visual effects that enhance the story without distracting from it." },
  { icon: Music4, title: "Sound Design", text: "Detailed sound effects, music, ambience, and audio transitions that give every edit more impact." },
  { icon: Wand2, title: "Cinematic Storytelling", text: "Pacing, tension and payoff — every frame with intent." },
];

function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="About"
          title={
            <>
              Cinematic edits, <span className="text-red">obsessive</span> detail
            </>
          }
          subtitle="I'm a video editor focused on turning raw footage into engaging visual stories. My work spans commercial videos, automotive content, talking-head edits, social media content, color grading, motion graphics, and cinematic storytelling. I focus on strong pacing, clean visuals, sound design, and attention to detail in every edit."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT_ITEMS.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-red/40 hover:bg-white/[0.04]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-red/10 text-red">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WORKFLOW ---------------- */

const STEPS = [
  { title: "Receive Footage", text: "Ingest, organize, back up, and review all raw material." },
  { title: "Story Planning", text: "Understand the brief, define the story, select key moments, and establish the pacing." },
  { title: "Editing", text: "Build the story from the footage — rough cut, refine, tighten, and polish." },
  { title: "Sound Design", text: "Add music, sound effects, ambience, and detailed audio transitions to enhance the edit." },
  { title: "Color Grading", text: "Correct exposure and color, then create a consistent visual look that fits the project." },
  { title: "Final Delivery", text: "Export the final video in the required format, resolution, and platform-ready versions." },
];

function Workflow() {
  return (
    <section id="workflow" className="relative py-24 md:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Process"
          title={
            <>
              My Editing <span className="text-red">Process</span>
            </>
          }
          subtitle="A repeatable pipeline that turns raw automotive footage into cinema-grade films."
        />

        <div className="relative mt-16">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2" />
          <div className="space-y-10 md:space-y-16">
            {STEPS.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className={`relative grid grid-cols-[auto_1fr] md:grid-cols-2 items-center gap-6 md:gap-10 ${
                    left ? "" : "md:[&>*:first-child]:col-start-2"
                  }`}
                >
                  <div
                    className={`hidden md:block ${left ? "text-right pr-10" : "col-start-2 pl-10"}`}
                  >
                    <StepCard n={i + 1} title={s.title} text={s.text} align={left ? "right" : "left"} />
                  </div>
                  <div className="relative md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-red text-white font-bold red-glow">
                      {i + 1}
                    </span>
                  </div>
                  <div className={`md:hidden pl-14 -mt-10`}>
                    <StepCard n={i + 1} title={s.title} text={s.text} align="left" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  n,
  title,
  text,
  align,
}: {
  n: number;
  title: string;
  text: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={`inline-block rounded-xl border border-white/10 bg-white/[0.03] p-5 max-w-md ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <div className="text-xs uppercase tracking-widest text-red">Step {String(n).padStart(2, "0")}</div>
      <h4 className="mt-1 text-xl font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

/* ---------------- SKILLS ---------------- */

const SKILLS = [
  { name: "Adobe Premiere Pro", level: 95 },
  { name: "After Effects", level: 88 },
  { name: "DaVinci Resolve", level: 90 },
  { name: "Photoshop", level: 80 },
  { name: "Motion Graphics", level: 85 },
  { name: "Sound Design", level: 82 },
  { name: "Color Grading", level: 92 },
  { name: "Speed Ramping", level: 90 },
  { name: "Cinematic Editing", level: 94 },
];

const SOFTWARE = [
  "Premiere Pro",
  "After Effects",
  "DaVinci Resolve",
  "Photoshop",
  "Audition",
  "Media Encoder",
  "Lightroom",
];

function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Toolkit"
          title={
            <>
              Skills & <span className="text-red">Software</span>
            </>
          }
          subtitle="The tools and techniques I use daily to craft premium automotive edits."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {SKILLS.map((s, i) => (
            <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 0.05} />
          ))}
        </div>

        <div className="relative mt-16 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] py-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex w-max animate-marquee gap-12 px-6">
            {[...SOFTWARE, ...SOFTWARE].map((n, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-red/10 text-red">
                  <Film className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium whitespace-nowrap">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.1, delay, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-red to-red-glow"
        />
      </div>
    </div>
  );
}

/* ---------------- RESUME ---------------- */

function Resume() {
  return (
    <section id="resume" className="relative py-24 md:py-32 border-t border-white/5">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-10 md:p-14 text-center">
          <div
            className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-40"
            style={{ background: "oklch(0.62 0.24 25 / 0.6)" }}
          />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Download My <span className="text-red">Resume</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Download the complete Resume PDF with case studies, credits and reel highlights.
          </p>
          <div className="mt-8 flex justify-center">
            <MagneticButton
              variant="primary"
              href="/Sreejith Resume.pdf"
              download
              target="_blank"
              rel="noreferrer"
            >
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" /> Download Resume
              </span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */

const EMAIL = "sreejithps799@gmail.com";
const INSTAGRAM = "https://www.instagram.com/gekko.cuts";
const WHATSAPP = "https://wa.me/qr/THJOGONJHZPCH1";

function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <section id="contact" className="relative py-24 md:py-32 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Get in touch"
          title={
            <>
              Let's build something <span className="text-red">cinematic</span>
            </>
          }
          subtitle="Available for video editing projects, brand content, social media videos, automotive films, and long-form content."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={copy}
            className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-6 text-left transition-all hover:border-red/50 hover:bg-white/[0.04]"
          >
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-red/10 text-red">
              <Mail className="h-5 w-5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </span>
              <span className="block truncate text-sm font-medium">{EMAIL}</span>
            </span>
            <span className="text-muted-foreground group-hover:text-red">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </span>
          </button>

          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-red/50 hover:bg-white/[0.04]"
          >
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-red/10 text-red">
              <Instagram className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                Instagram
              </span>
              <span className="block text-sm font-medium">@gekko.cuts</span>
            </span>
          </a>

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-red/50 hover:bg-white/[0.04]"
          >
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-red/10 text-red">
              <MessageCircle className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                WhatsApp
              </span>
              <span className="block text-sm font-medium">Message me</span>
            </span>
          </a>
        </div>

        <div className="mt-12 text-center">
          <MagneticButton
            variant="primary"
            href={`mailto:${EMAIL}?subject=Project%20Inquiry`}
          >
            <span className="inline-flex items-center gap-2">
              Start a conversation <Send className="h-4 w-4" />
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-red text-sm font-black text-white">
              S
            </span>
            <div>
              <div className="font-semibold">
                Sreejith PS<span className="text-red">.</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Video Editor
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:border-red hover:text-red"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:border-red hover:text-red"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:border-red hover:text-red"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sreejith PS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Shared ---------------- */

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-red" />
        <span className="text-xs uppercase tracking-[0.25em] text-red">{eyebrow}</span>
      </div>
      <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
