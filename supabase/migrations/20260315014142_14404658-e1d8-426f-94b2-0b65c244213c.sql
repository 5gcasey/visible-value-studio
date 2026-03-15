
-- Allow authenticated users full CRUD on all admin-managed tables
-- Meetings
CREATE POLICY "Auth users can insert meetings" ON public.meetings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update meetings" ON public.meetings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete meetings" ON public.meetings FOR DELETE TO authenticated USING (true);

-- Meeting Items
CREATE POLICY "Auth users can insert meeting_items" ON public.meeting_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update meeting_items" ON public.meeting_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete meeting_items" ON public.meeting_items FOR DELETE TO authenticated USING (true);

-- Officials
CREATE POLICY "Auth users can insert officials" ON public.officials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update officials" ON public.officials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete officials" ON public.officials FOR DELETE TO authenticated USING (true);

-- Official Statements
CREATE POLICY "Auth users can insert official_statements" ON public.official_statements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update official_statements" ON public.official_statements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete official_statements" ON public.official_statements FOR DELETE TO authenticated USING (true);

-- Issues
CREATE POLICY "Auth users can insert issues" ON public.issues FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update issues" ON public.issues FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete issues" ON public.issues FOR DELETE TO authenticated USING (true);

-- Developers
CREATE POLICY "Auth users can insert developers" ON public.developers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update developers" ON public.developers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete developers" ON public.developers FOR DELETE TO authenticated USING (true);

-- High Priority Flags
CREATE POLICY "Auth users can insert high_priority_flags" ON public.high_priority_flags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update high_priority_flags" ON public.high_priority_flags FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete high_priority_flags" ON public.high_priority_flags FOR DELETE TO authenticated USING (true);

-- Subscribers (full CRUD for admin)
CREATE POLICY "Auth users can select subscribers" ON public.subscribers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can update subscribers" ON public.subscribers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete subscribers" ON public.subscribers FOR DELETE TO authenticated USING (true);

-- Community Posts
CREATE POLICY "Auth users can insert community_posts" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update community_posts" ON public.community_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete community_posts" ON public.community_posts FOR DELETE TO authenticated USING (true);

-- Weekly Reports
CREATE POLICY "Auth users can insert weekly_reports" ON public.weekly_reports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update weekly_reports" ON public.weekly_reports FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete weekly_reports" ON public.weekly_reports FOR DELETE TO authenticated USING (true);

-- GRAMA Requests
ALTER TABLE public.grama_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read grama_requests" ON public.grama_requests FOR SELECT USING (true);
CREATE POLICY "Auth users can insert grama_requests" ON public.grama_requests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update grama_requests" ON public.grama_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete grama_requests" ON public.grama_requests FOR DELETE TO authenticated USING (true);

-- System Log
ALTER TABLE public.system_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can read system_log" ON public.system_log FOR SELECT TO authenticated USING (true);

-- City Config (allow update for admin)
CREATE POLICY "Auth users can update city_config" ON public.city_config FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
