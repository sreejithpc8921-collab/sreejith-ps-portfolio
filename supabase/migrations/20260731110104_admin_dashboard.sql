-- ============================================================================
-- Admin dashboard schema
-- Adds:
--   1. Write policies so authenticated (logged-in) users can manage projects
--      (the "projects" table already existed with a public read-only policy)
--   2. A singleton "profile" table for name/hero/about/contact/social links
--   3. A public storage bucket ("portfolio-assets") for the resume PDF and
--      profile image, with public read + authenticated write policies
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PROJECTS — allow authenticated (admin) users to manage all rows
-- ----------------------------------------------------------------------------
-- The table already has GRANT SELECT/INSERT/UPDATE/DELETE for `authenticated`
-- (see the original migration), but RLS was only opened up for public SELECT
-- of published rows. Without an authenticated policy, the admin dashboard
-- would be blocked from reading drafts or writing at all.

CREATE POLICY "Authenticated can view all projects"
  ON public.projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- 2. PROFILE — singleton table (exactly one row) for site content
-- ----------------------------------------------------------------------------
CREATE TABLE public.profile (
  id BOOLEAN NOT NULL DEFAULT true PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  role_title TEXT NOT NULL DEFAULT '',
  hero_text TEXT NOT NULL DEFAULT '',
  about_text TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  instagram_url TEXT,
  whatsapp_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Enforces a single row: the only allowed primary key value is `true`.
  CONSTRAINT profile_singleton CHECK (id = true)
);

GRANT SELECT ON public.profile TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profile TO authenticated;
GRANT ALL ON public.profile TO service_role;

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view profile"
  ON public.profile FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert profile"
  ON public.profile FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update profile"
  ON public.profile FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Keep updated_at current on every write.
CREATE OR REPLACE FUNCTION public.set_profile_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profile_set_updated_at
  BEFORE UPDATE ON public.profile
  FOR EACH ROW
  EXECUTE FUNCTION public.set_profile_updated_at();

-- Seed the single row so the dashboard always has something to load/edit.
INSERT INTO public.profile (id, name, role_title, hero_text, about_text, email, instagram_url, whatsapp_url)
VALUES (
  true,
  'Sreejith PS',
  'Automotive Video Editor',
  'I create cinematic automotive films that transform ordinary footage into premium visual experiences through storytelling, pacing, sound design and professional color grading.',
  'I''m a video editor focused on the automotive space — building cinematic films that make cars feel alive. My work spans commercial edits, color grading, motion graphics and long-form storytelling.',
  'sreejithps799@gmail.com',
  'https://www.instagram.com/gekko.cuts',
  'https://wa.me/qr/THJOGONJHZPCH1'
)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. STORAGE — public bucket for resume + profile image uploads
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view portfolio assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated can upload portfolio assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated can update portfolio assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-assets')
  WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated can delete portfolio assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-assets');
