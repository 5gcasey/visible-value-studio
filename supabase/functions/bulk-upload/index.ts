import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VALID_TABLES = [
  "meetings",
  "meeting_items",
  "officials",
  "official_statements",
  "issues",
  "high_priority_flags",
  "community_posts",
  "developers",
  "grama_requests",
  "legal_activity",
  "utility_updates",
  "weekly_reports",
  "subscribers",
  "city_config",
  "system_log",
] as const;

type ValidTable = (typeof VALID_TABLES)[number];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Simple API key auth via custom header
    const apiKey = req.headers.get("x-api-key");
    const expectedKey = Deno.env.get("BULK_UPLOAD_API_KEY");
    
    if (!expectedKey || apiKey !== expectedKey) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing x-api-key header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await req.json();
    const { table, rows, upsert } = body as {
      table: string;
      rows: Record<string, unknown>[];
      upsert?: boolean;
    };

    // Validate table name
    if (!table || !VALID_TABLES.includes(table as ValidTable)) {
      return new Response(
        JSON.stringify({
          error: `Invalid table. Must be one of: ${VALID_TABLES.join(", ")}`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate rows
    if (!Array.isArray(rows) || rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "rows must be a non-empty array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert or upsert
    let query;
    if (upsert) {
      query = supabase.from(table).upsert(rows, { onConflict: "id" });
    } else {
      query = supabase.from(table).insert(rows);
    }

    const { data, error } = await query.select();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message, details: error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        table,
        inserted: data?.length ?? rows.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
