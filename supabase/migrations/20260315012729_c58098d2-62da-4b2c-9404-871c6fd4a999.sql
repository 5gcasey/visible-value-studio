CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.city_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_name text NOT NULL,
  city_state text NOT NULL,
  city_state_abbr text NOT NULL,
  display_name text NOT NULL,
  tagline text,
  primary_color text DEFAULT '#1a2744',
  accent_color text DEFAULT '#f59e0b',
  logo_url text,
  city_website text,
  population integer,
  county text,
  timezone text DEFAULT 'America/Denver',
  subdomain text,
  state_domain text,
  state_display_name text,
  full_url text,
  custom_domain text,
  email_from text,
  alert_spending_threshold integer DEFAULT 500000,
  repeat_applicant_threshold integer DEFAULT 3,
  always_flag_developers text[],
  slack_channel_id text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.city_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read city_config" ON public.city_config FOR SELECT USING (true);

CREATE TABLE public.officials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  role text,
  title text NOT NULL,
  department text,
  photo_url text,
  bio text,
  social_links jsonb DEFAULT '{}',
  contact_email text,
  status text DEFAULT 'active',
  first_observed date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read officials" ON public.officials FOR SELECT USING (true);
CREATE INDEX idx_officials_slug ON public.officials(slug);
CREATE INDEX idx_officials_role ON public.officials(role);
CREATE INDEX idx_officials_status ON public.officials(status);

CREATE TABLE public.official_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  official_id uuid REFERENCES public.officials(id) ON DELETE CASCADE,
  statement_date date,
  platform text,
  content text NOT NULL,
  url text,
  tags text[],
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.official_statements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read statements" ON public.official_statements FOR SELECT USING (true);
CREATE INDEX idx_statements_official ON public.official_statements(official_id);
CREATE INDEX idx_statements_date ON public.official_statements(statement_date DESC);

CREATE TABLE public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  meeting_date timestamptz,
  location text,
  meeting_type text,
  status text DEFAULT 'scheduled',
  agenda_url text,
  minutes_url text,
  packet_url text,
  body text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read meetings" ON public.meetings FOR SELECT USING (true);
CREATE INDEX idx_meetings_date ON public.meetings(meeting_date DESC);
CREATE INDEX idx_meetings_type ON public.meetings(meeting_type);
CREATE INDEX idx_meetings_status ON public.meetings(status);

CREATE TABLE public.meeting_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid REFERENCES public.meetings(id) ON DELETE CASCADE,
  item_title text NOT NULL,
  description text,
  what_is_issue text,
  legally_current text,
  financial_impact text,
  who_benefits text,
  who_harmed text,
  priority text DEFAULT 'medium',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.meeting_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read meeting_items" ON public.meeting_items FOR SELECT USING (true);
CREATE INDEX idx_items_meeting ON public.meeting_items(meeting_id);

CREATE TABLE public.issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  what_is_issue text,
  legally_current text,
  financial_impact text,
  who_benefits text,
  who_harmed text,
  priority text DEFAULT 'medium',
  category text,
  status text DEFAULT 'open',
  source_url text,
  related_meeting_ids uuid[],
  related_official_ids uuid[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read issues" ON public.issues FOR SELECT USING (true);
CREATE INDEX idx_issues_priority ON public.issues(priority);
CREATE INDEX idx_issues_status ON public.issues(status);
CREATE INDEX idx_issues_category ON public.issues(category);
CREATE INDEX idx_issues_created ON public.issues(created_at DESC);

CREATE TABLE public.developers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name text NOT NULL,
  project_name text,
  location text,
  application_type text,
  status text DEFAULT 'active',
  appearance_count integer DEFAULT 1,
  source_url text,
  meeting_ids uuid[],
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read developers" ON public.developers FOR SELECT USING (true);
CREATE INDEX idx_developers_name ON public.developers(applicant_name);
CREATE INDEX idx_developers_appearances ON public.developers(appearance_count DESC);
CREATE INDEX idx_developers_status ON public.developers(status);

CREATE TABLE public.utility_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utility text NOT NULL,
  title text NOT NULL,
  summary text,
  financial_impact text,
  priority text DEFAULT 'medium',
  source_url text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.utility_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read utility_updates" ON public.utility_updates FOR SELECT USING (true);
CREATE INDEX idx_utility_created ON public.utility_updates(created_at DESC);

CREATE TABLE public.legal_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attorney text NOT NULL,
  matter_type text,
  description text,
  date_occurred date,
  source_url text,
  priority text DEFAULT 'low',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.legal_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read legal_activity" ON public.legal_activity FOR SELECT USING (true);
CREATE INDEX idx_legal_attorney ON public.legal_activity(attorney);
CREATE INDEX idx_legal_date ON public.legal_activity(date_occurred DESC);

CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name text NOT NULL,
  theme text,
  summary text NOT NULL,
  source_url text,
  city_response text DEFAULT 'no',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read community_posts" ON public.community_posts FOR SELECT USING (true);
CREATE INDEX idx_community_group ON public.community_posts(group_name);
CREATE INDEX idx_community_response ON public.community_posts(city_response);
CREATE INDEX idx_community_created ON public.community_posts(created_at DESC);

CREATE TABLE public.weekly_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_ending date NOT NULL UNIQUE,
  published_at timestamptz DEFAULT now(),
  headline text NOT NULL,
  full_content text,
  sections jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read weekly_reports" ON public.weekly_reports FOR SELECT USING (true);
CREATE INDEX idx_reports_week ON public.weekly_reports(week_ending DESC);

CREATE TABLE public.grama_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  recipient text,
  request_text text,
  filed_date date,
  due_date date,
  status text DEFAULT 'drafted',
  response_text text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.grama_requests ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_grama_status ON public.grama_requests(status);

CREATE TABLE public.high_priority_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  summary text NOT NULL,
  why_it_matters text,
  source_url text,
  flagged_at timestamptz DEFAULT now(),
  resolved boolean DEFAULT false,
  resolved_at timestamptz
);
ALTER TABLE public.high_priority_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read flags" ON public.high_priority_flags FOR SELECT USING (true);
CREATE INDEX idx_flags_resolved ON public.high_priority_flags(resolved);
CREATE INDEX idx_flags_date ON public.high_priority_flags(flagged_at DESC);

CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text,
  first_name text,
  subscribed_email boolean DEFAULT true,
  subscribed_sms boolean DEFAULT false,
  tier text DEFAULT 'free',
  confirmed boolean DEFAULT false,
  confirm_token text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE INDEX idx_subscribers_email ON public.subscribers(email);
CREATE INDEX idx_subscribers_tier ON public.subscribers(tier);

CREATE TABLE public.system_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name text NOT NULL,
  run_at timestamptz DEFAULT now(),
  status text NOT NULL,
  records_added integer DEFAULT 0,
  message text,
  details jsonb DEFAULT '{}'
);
ALTER TABLE public.system_log ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_syslog_task ON public.system_log(task_name);
CREATE INDEX idx_syslog_run ON public.system_log(run_at DESC);

CREATE VIEW public.upcoming_meetings AS
SELECT * FROM public.meetings
WHERE meeting_date >= NOW()
  AND meeting_date <= NOW() + INTERVAL '7 days'
  AND status != 'cancelled'
ORDER BY meeting_date ASC;

CREATE VIEW public.active_alert_count AS
SELECT COUNT(*) AS count FROM public.high_priority_flags WHERE resolved = false;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON public.developers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_weekly_reports_updated_at BEFORE UPDATE ON public.weekly_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_grama_requests_updated_at BEFORE UPDATE ON public.grama_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();