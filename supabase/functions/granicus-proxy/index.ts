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
  const pdfHash = url.searchParams.get("pdf_hash");
  const agendaClipId = url.searchParams.get("agenda_clip_id");

  let granicusUrl: string | null = null;
  let injectSpeedScript = false;

  if (clipId && /^\d+$/.test(clipId)) {
    // Video player mode
    granicusUrl = `https://lehi.granicus.com/player/clip/${clipId}?view_id=1&redirect=true`;
    injectSpeedScript = true;
  } else if (pdfHash && /^lehi_[a-f0-9]+\.pdf$/i.test(pdfHash)) {
    // PDF document viewer mode
    granicusUrl = `https://lehi.granicus.com/DocumentViewer.php?file=${pdfHash}`;
  } else if (agendaClipId && /^\d+$/.test(agendaClipId)) {
    // Agenda viewer mode
    granicusUrl = `https://lehi.granicus.com/AgendaViewer.php?view_id=1&clip_id=${agendaClipId}`;
  } else {
    return new Response(JSON.stringify({ error: "Missing or invalid parameters. Provide clip_id, pdf_hash, or agenda_clip_id." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

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

    const contentType = resp.headers.get("content-type") || "text/html";
    const isPdf = contentType.includes("application/pdf");
    const isHtml = contentType.includes("text/html");

    // For PDFs or other binary content, pass through as-is with correct content type
    if (isPdf || (!isHtml && !injectSpeedScript)) {
      const body = await resp.arrayBuffer();
      return new Response(body, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": contentType,
        },
      });
    }

    let html = await resp.text();

    if (injectSpeedScript) {
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
      if (html.includes("</body>")) {
        html = html.replace("</body>", speedScript + "</body>");
      } else {
        html += speedScript;
      }
    }

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
