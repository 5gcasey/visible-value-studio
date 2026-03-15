import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database, Tables } from "@/integrations/supabase/types";

type TableName = keyof Database["public"]["Tables"];

// Generic helpers
function useAdminQuery<T>(key: string[], tableName: TableName, options?: { orderBy?: string; ascending?: boolean; limit?: number; filters?: Record<string, any> }) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      let query = supabase.from(tableName).select("*") as any;
      if (options?.filters) {
        Object.entries(options.filters).forEach(([k, v]) => { query = query.eq(k, v); });
      }
      if (options?.orderBy) query = query.order(options.orderBy, { ascending: options.ascending ?? false });
      if (options?.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return data as T[];
    },
  });
}

export function useAdminMeetings() {
  return useAdminQuery<Tables<"meetings">>(["admin_meetings"], "meetings", { orderBy: "meeting_date" });
}

export function useAdminMeetingItems(meetingId: string | undefined) {
  return useQuery({
    queryKey: ["admin_meeting_items", meetingId],
    queryFn: async () => {
      if (!meetingId) return [];
      const { data, error } = await supabase.from("meeting_items").select("*").eq("meeting_id", meetingId).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!meetingId,
  });
}

export function useAdminOfficials() {
  return useAdminQuery<Tables<"officials">>(["admin_officials"], "officials", { orderBy: "name", ascending: true });
}

export function useAdminOfficialStatements(officialId: string | undefined) {
  return useQuery({
    queryKey: ["admin_official_statements", officialId],
    queryFn: async () => {
      if (!officialId) return [];
      const { data, error } = await supabase.from("official_statements").select("*").eq("official_id", officialId).order("statement_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!officialId,
  });
}

export function useAdminIssues() {
  return useAdminQuery<Tables<"issues">>(["admin_issues"], "issues", { orderBy: "created_at" });
}

export function useAdminDevelopers() {
  return useAdminQuery<Tables<"developers">>(["admin_developers"], "developers", { orderBy: "appearance_count" });
}

export function useAdminAlerts() {
  return useAdminQuery<Tables<"high_priority_flags">>(["admin_alerts"], "high_priority_flags", { orderBy: "flagged_at" });
}

export function useAdminSubscribers() {
  return useAdminQuery<Tables<"subscribers">>(["admin_subscribers"], "subscribers", { orderBy: "created_at" });
}

export function useAdminCommunityPosts() {
  return useAdminQuery<Tables<"community_posts">>(["admin_community_posts"], "community_posts", { orderBy: "created_at" });
}

export function useAdminGrama() {
  return useAdminQuery<Tables<"grama_requests">>(["admin_grama"], "grama_requests", { orderBy: "created_at" });
}

export function useAdminWeeklyReports() {
  return useAdminQuery<Tables<"weekly_reports">>(["admin_weekly_reports"], "weekly_reports", { orderBy: "week_ending" });
}

export function useAdminSystemLog() {
  return useAdminQuery<Tables<"system_log">>(["admin_system_log"], "system_log", { orderBy: "run_at", limit: 20 });
}

// Generic mutation hook
export function useTableMutation(
  tableName: TableName,
  invalidateKeys: string[][]
) {
  const qc = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => invalidateKeys.forEach((k) => qc.invalidateQueries({ queryKey: k }));

  const insert = useMutation({
    mutationFn: async (row: Record<string, any>) => {
      const { data, error } = await (supabase.from(tableName) as any).insert(row).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { invalidate(); toast({ title: "Created successfully" }); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: Record<string, any> & { id: string }) => {
      const { data, error } = await (supabase.from(tableName) as any).update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { invalidate(); toast({ title: "Updated successfully" }); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from(tableName) as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast({ title: "Deleted successfully" }); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return { insert, update, remove };
}
