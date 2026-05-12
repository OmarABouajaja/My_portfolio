-- ================================================================
-- Abouajaja_Omar/ (Nexus Engine) — Canonical Database Schema
-- Run this in the Supabase SQL Editor for a fresh deployment.
-- ================================================================

-- ─── 1. ENUMS ───
CREATE TYPE app_role AS ENUM ('admin', 'user');
CREATE TYPE chat_sender AS ENUM ('client', 'omar');
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- ─── 2. CORE TABLES ───

-- user_roles
CREATE TABLE public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    role app_role NOT NULL DEFAULT 'user'::app_role,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- site_metadata (single-row config)
CREATE TABLE public.site_metadata (
    id TEXT PRIMARY KEY DEFAULT 'config',
    active_projects_count INTEGER DEFAULT 0,
    last_build TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    system_status TEXT DEFAULT 'online',
    hiring_status BOOLEAN DEFAULT true,
    primary_theme_color TEXT DEFAULT '#22d3ee',
    resume_url TEXT,
    contact_email TEXT DEFAULT 'omar.abouajaja@gmail.com',
    enable_projects BOOLEAN DEFAULT true,
    enable_timeline BOOLEAN DEFAULT true,
    enable_tech_stack BOOLEAN DEFAULT true,
    enable_testimonials BOOLEAN DEFAULT true,
    enable_blog BOOLEAN DEFAULT true,
    enable_contact BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- projects
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_fr TEXT,
    title_es TEXT,
    title_ar TEXT,
    description_en TEXT NOT NULL,
    description_fr TEXT,
    description_es TEXT,
    description_ar TEXT,
    category TEXT NOT NULL,
    tech_stack TEXT[] DEFAULT '{}'::TEXT[],
    image_url TEXT,
    live_url TEXT,
    github_url TEXT,
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- timeline_events
CREATE TABLE public.timeline_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year INTEGER NOT NULL,
    title_en TEXT NOT NULL,
    title_fr TEXT,
    title_es TEXT,
    title_ar TEXT,
    description_en TEXT NOT NULL,
    description_fr TEXT,
    description_es TEXT,
    description_ar TEXT,
    icon TEXT DEFAULT 'circle',
    highlight BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- skills
CREATE TABLE public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    proficiency INTEGER DEFAULT 50,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- testimonials
CREATE TABLE public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_role TEXT,
    content_en TEXT NOT NULL,
    content_fr TEXT,
    content_es TEXT,
    content_ar TEXT,
    avatar_url TEXT,
    rating INTEGER DEFAULT 5,
    featured BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- blog_posts
CREATE TABLE public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_es TEXT,
    title_fr TEXT,
    title_ar TEXT,
    summary_en TEXT NOT NULL,
    summary_es TEXT,
    summary_fr TEXT,
    summary_ar TEXT,
    content_en TEXT NOT NULL,
    content_es TEXT,
    content_fr TEXT,
    content_ar TEXT,
    image_url TEXT,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- contact_submissions
CREATE TABLE public.contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- invoices
CREATE TABLE public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_address TEXT,
    items JSONB DEFAULT '[]'::JSONB,
    total NUMERIC(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'draft',
    issue_date DATE NOT NULL,
    due_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 3. EXTENSION TABLES ───

-- visitor_logs
CREATE TABLE public.visitor_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT,
    os TEXT,
    browser TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- services
CREATE TABLE public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_fr TEXT,
    title_es TEXT,
    title_ar TEXT,
    description_en TEXT NOT NULL,
    description_fr TEXT,
    description_es TEXT,
    description_ar TEXT,
    features_en TEXT[] DEFAULT '{}'::TEXT[],
    features_fr TEXT[],
    features_es TEXT[],
    features_ar TEXT[],
    icon TEXT DEFAULT 'Layers',
    price_tier TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- equipment
CREATE TABLE public.equipment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'hardware',
    description_en TEXT,
    description_fr TEXT,
    description_es TEXT,
    description_ar TEXT,
    image_url TEXT,
    link_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- social_links (dynamic contact channels)
CREATE TABLE public.social_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'link',
    display_order INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 4. CLIENT ECOSYSTEM TABLES ───

-- client_tokens
CREATE TABLE public.client_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- client_projects
CREATE TABLE public.client_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_token_id UUID REFERENCES public.client_tokens(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    progress INTEGER DEFAULT 0,
    milestones JSONB DEFAULT '[]'::JSONB,
    last_update TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- chat_messages
CREATE TABLE public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_token_id UUID REFERENCES public.client_tokens(id) ON DELETE CASCADE NOT NULL,
    sender chat_sender NOT NULL,
    text TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 5. FINANCE TABLES ───

-- transactions
CREATE TABLE public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    type transaction_type NOT NULL DEFAULT 'income',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- finance_settings
CREATE TABLE public.finance_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    monthly_goal NUMERIC(10,2) DEFAULT 5000,
    currency TEXT DEFAULT 'USD',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 6. ROW LEVEL SECURITY ───

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_settings ENABLE ROW LEVEL SECURITY;

-- ─── 7. HELPER FUNCTIONS ───

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_role(_role app_role, _user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.validate_client_token(p_token TEXT)
RETURNS TABLE(token_id UUID, client_name TEXT, client_email TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT ct.id, ct.client_name, ct.client_email
    FROM public.client_tokens ct
    WHERE ct.token = p_token AND ct.active = true
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 8. RLS POLICIES ───

-- user_roles
CREATE POLICY "Users can view their own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles USING (public.is_admin());

-- site_metadata (Public read, Admin write)
CREATE POLICY "Public read site_metadata" ON public.site_metadata FOR SELECT USING (true);
CREATE POLICY "Admin full access site_metadata" ON public.site_metadata USING (public.is_admin());

-- projects (Public read, Admin write)
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin full access projects" ON public.projects USING (public.is_admin());

-- timeline_events
CREATE POLICY "Public read timeline_events" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "Admin full access timeline_events" ON public.timeline_events USING (public.is_admin());

-- skills
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin full access skills" ON public.skills USING (public.is_admin());

-- testimonials
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admin full access testimonials" ON public.testimonials USING (public.is_admin());

-- blog_posts (Only published publicly)
CREATE POLICY "Public read published blog_posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admin full access blog_posts" ON public.blog_posts USING (public.is_admin());

-- contact_submissions (Public insert, Admin read/manage)
CREATE POLICY "Public insert contact_submissions" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access contact_submissions" ON public.contact_submissions USING (public.is_admin());

-- invoices
CREATE POLICY "Admin full access invoices" ON public.invoices USING (public.is_admin());

-- services
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admin full access services" ON public.services USING (public.is_admin());

-- equipment
CREATE POLICY "Public read equipment" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Admin full access equipment" ON public.equipment USING (public.is_admin());

-- social_links
CREATE POLICY "Public read social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admin full access social_links" ON public.social_links USING (public.is_admin());

-- client ecosystem (Admin only)
CREATE POLICY "Admin full access client_tokens" ON public.client_tokens USING (public.is_admin());
CREATE POLICY "Admin full access client_projects" ON public.client_projects USING (public.is_admin());
CREATE POLICY "Admin full access chat_messages" ON public.chat_messages USING (public.is_admin());

-- finance (Admin only)
CREATE POLICY "Admin full access transactions" ON public.transactions USING (public.is_admin());
CREATE POLICY "Admin full access finance_settings" ON public.finance_settings USING (public.is_admin());

-- visitor_logs (Public insert, Admin read)
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert visitor_logs" ON public.visitor_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access visitor_logs" ON public.visitor_logs USING (public.is_admin());

-- ─── 9. SEED DATA ───

INSERT INTO public.site_metadata (id, active_projects_count, system_status, hiring_status, primary_theme_color, contact_email)
VALUES ('config', 6, 'online', true, '#22d3ee', 'omar.abouajaja@gmail.com') ON CONFLICT (id) DO NOTHING;

INSERT INTO public.social_links (platform, label, url, icon, display_order) VALUES
  ('email', 'omar.abouajaja@gmail.com', 'mailto:omar.abouajaja@gmail.com', 'Mail', 1),
  ('github', '@omar-abouajaja', 'https://github.com/omar-abouajaja', 'Github', 2),
  ('linkedin', 'Omar Abouajaja', 'https://linkedin.com/in/omar-abouajaja', 'Linkedin', 3)
ON CONFLICT DO NOTHING;

INSERT INTO public.client_tokens (token, client_name, client_email)
VALUES ('CLI-1234', 'Demo Client', 'client@demo.local')
ON CONFLICT (token) DO NOTHING;

INSERT INTO public.finance_settings (id, monthly_goal, currency)
VALUES ('default', 5000, 'USD')
ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- Storage Bucket Configuration
-- Run after the main schema to create buckets for image uploads.
-- ================================================================

-- Project images (portfolio screenshots)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Blog post images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Equipment photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('equipment-images', 'equipment-images', true)
ON CONFLICT (id) DO NOTHING;

-- Client / Testimonial avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for storage

-- Public read for all buckets
CREATE POLICY "Public read project-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Public read blog-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Public read equipment-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'equipment-images');
CREATE POLICY "Public read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Admin write for all buckets
CREATE POLICY "Admin upload project-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-images' AND public.is_admin());
CREATE POLICY "Admin upload blog-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND public.is_admin());
CREATE POLICY "Admin upload equipment-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'equipment-images' AND public.is_admin());
CREATE POLICY "Admin upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND public.is_admin());

-- Admin delete for all buckets
CREATE POLICY "Admin delete project-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'project-images' AND public.is_admin());
CREATE POLICY "Admin delete blog-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-images' AND public.is_admin());
CREATE POLICY "Admin delete equipment-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'equipment-images' AND public.is_admin());
CREATE POLICY "Admin delete avatars" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND public.is_admin());
