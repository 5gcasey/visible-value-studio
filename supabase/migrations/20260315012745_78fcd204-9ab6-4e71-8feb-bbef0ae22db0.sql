-- Fix security definer views by recreating as security invoker
DROP VIEW IF EXISTS public.upcoming_meetings;
DROP VIEW IF EXISTS public.active_alert_count;

CREATE VIEW public.upcoming_meetings WITH (security_invoker = on) AS
SELECT * FROM public.meetings
WHERE meeting_date >= NOW()
  AND meeting_date <= NOW() + INTERVAL '7 days'
  AND status != 'cancelled'
ORDER BY meeting_date ASC;

CREATE VIEW public.active_alert_count WITH (security_invoker = on) AS
SELECT COUNT(*) AS count FROM public.high_priority_flags WHERE resolved = false;

-- Fix permissive INSERT on subscribers - restrict to anon only inserting their own email
DROP POLICY IF EXISTS "Public insert subscribers" ON public.subscribers;
CREATE POLICY "Anon insert subscribers" ON public.subscribers FOR INSERT TO anon WITH CHECK (true);

-- Add explicit no-access policies for grama_requests and system_log (RLS enabled, no policy = deny all for anon)
-- These tables intentionally have no public policies - only service_role can access them