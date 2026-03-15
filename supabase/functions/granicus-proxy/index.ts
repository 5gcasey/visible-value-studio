import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const clipId = url.searchParams.get("clip_id");

  if (!clipId || !/^\d+$/.test(clipId)) {
    return new Response(JSON.stringify({ error: "Missing or invalid clip_id" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const granicusUrl = `https://lehi.granicus.com/player/clip/${clipId}?view_id=1&redirect=true`;

  try {
    const resp = await fetch(granicusUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!resp.ok) {
      return new Response(JSON.stringify({ error: `Granicus returned ${resp.status}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let html = await resp.text();

    // Inject a postMessage listener so the parent page can control playback speed
    const speedScript = `
<script>
window.addEventListener("message", function(e) {
  if (e.data && e.data.type === "setPlaybackRate") {
    var videos = document.querySelectorAll("video");
    videos.forEach(function(v) { v.playbackRate = e.data.rate; });
  }
});
</script>
`;
    // Insert before closing </body> or at end
    if (html.includes("</body>")) {
      html = html.replace("</body>", speedScript + "</body>");
    } else {
      html += speedScript;
    }

    // Build response headers — strip X-Frame-Options and CSP frame-ancestors
    const responseHeaders: Record<string, string> = {
      ...corsHeaders,
      "Content-Type": "text/html; charset=utf-8",
    };

    return new Response(html, { status: 200, headers: responseHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
