
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  description TEXT,
  tools TEXT[] NOT NULL DEFAULT '{}',
  project_date DATE,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  USING (is_published = true);

INSERT INTO public.projects (title, category, youtube_id, description, tools, project_date, sort_order) VALUES
('GT 650 Cinematic', 'Automotive', 'I-_GGPVjT7s', 'A cinematic automotive edit showcasing the Royal Enfield GT 650 through story-driven pacing, dynamic sound design and premium color grading.', ARRAY['Adobe Premiere Pro','After Effects','DaVinci Resolve'], '2025-01-01', 1),
('Skoda VRS', 'Automotive', '6wAmyr6jCsM', 'Performance-focused edit of the Skoda VRS blending motion graphics, speed ramps and cinematic color to deliver a luxury-sports feel.', ARRAY['Adobe Premiere Pro','After Effects','DaVinci Resolve'], '2025-02-01', 2);
