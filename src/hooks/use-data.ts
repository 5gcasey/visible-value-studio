import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCityConfig() {
  return useQuery({
    queryKey: ["city_config"],
    queryFn: async () => {
      const { data, error } = await supabase.from("city_config").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });
}

export function useOfficials() {
  return useQuery({
    queryKey: ["officials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("officials").select("*").eq("status", "active").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useOfficial(slug: string | undefined) {
  return useQuery({
    queryKey: ["official", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase.from("officials").select("*").eq("slug", slug).single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useOfficialStatements(officialId: string | undefined) {
  return useQuery({
    queryKey: ["official_statements", officialId],
    queryFn: async () => {
      if (!officialId) return [];
      const { data, error } = await supabase.from("official_statements").select("*").eq("official_id", officialId).order("statement_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!officialId,
  });
}

export function useMeetings() {
  return useQuery({
    queryKey: ["meetings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("meetings").select("*").order("meeting_date", { ascending: false }).limit(25);
      if (error) throw error;
      return data;
    },
  });
}

export function useMeetingItems(meetingId: string | undefined) {
  return useQuery({
    queryKey: ["meeting_items", meetingId],
    queryFn: async () => {
      if (!meetingId) return [];
      const { data, error } = await supabase.from("meeting_items").select("*").eq("meeting_id", meetingId).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!meetingId,
  });
}

export function useIssues() {
  return useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const { data, error } = await supabase.from("issues").select("*").order("created_at", { ascending: false }).limit(25);
      if (error) throw error;
      return data;
    },
  });
}

export function useDevelopers() {
  return useQuery({
    queryKey: ["developers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("developers").select("*").order("appearance_count", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useWeeklyReports() {
  return useQuery({
    queryKey: ["weekly_reports"],
    queryFn: async () => {
      const { data, error } = await supabase.from("weekly_reports").select("*").order("week_ending", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useWeeklyReport(id: string | undefined) {
  return useQuery({
    queryKey: ["weekly_report", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("weekly_reports").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCommunityPosts() {
  return useQuery({
    queryKey: ["community_posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("community_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useHighPriorityFlags() {
  return useQuery({
    queryKey: ["high_priority_flags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("high_priority_flags").select("*").eq("resolved", false).order("flagged_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
