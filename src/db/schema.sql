-- ==============================================================================
-- Med AI — Supabase PostgreSQL Database Schema & Row Level Security (RLS)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  preferred_language VARCHAR(5) NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Emergency Contacts Table
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Incidents Table
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  input_type VARCHAR(20) NOT NULL CHECK (input_type IN ('text', 'image', 'multimodal')),
  input_text TEXT,
  image_url TEXT,
  incident_type TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'moderate', 'high', 'emergency')),
  confidence NUMERIC(3, 2) NOT NULL DEFAULT 0.85,
  escalation_required BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Guidance Table
CREATE TABLE IF NOT EXISTS public.guidance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  language VARCHAR(5) NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'hi')),
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  avoid_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  escalation_conditions TEXT,
  warning TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Alert Logs Table
CREATE TABLE IF NOT EXISTS public.alert_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.emergency_contacts(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'failed', 'simulated')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  error_message TEXT
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- Enforce user isolation so users can ONLY access their own records.
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can select and update only their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Emergency Contacts: Users can manage only their own contacts
CREATE POLICY "Users can view own contacts" ON public.emergency_contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contacts" ON public.emergency_contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts" ON public.emergency_contacts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts" ON public.emergency_contacts
  FOR DELETE USING (auth.uid() = user_id);

-- Incidents: Users can view and create their own incidents
CREATE POLICY "Users can view own incidents" ON public.incidents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own incidents" ON public.incidents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Guidance: Users can view guidance for their own incidents
CREATE POLICY "Users can view guidance for their own incidents" ON public.guidance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.incidents
      WHERE incidents.id = guidance.incident_id AND incidents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert guidance for their own incidents" ON public.guidance
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.incidents
      WHERE incidents.id = guidance.incident_id AND incidents.user_id = auth.uid()
    )
  );

-- Alert Logs: Users can view alert logs for their own incidents
CREATE POLICY "Users can view alert logs for their own incidents" ON public.alert_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.incidents
      WHERE incidents.id = alert_logs.incident_id AND incidents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create alert logs for their own incidents" ON public.alert_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.incidents
      WHERE incidents.id = alert_logs.incident_id AND incidents.user_id = auth.uid()
    )
  );
