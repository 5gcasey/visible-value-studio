import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, AlertCircle } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const PROXY_BASE = `${SUPABASE_URL}/functions/v1/granicus-proxy`;
const CALENDAR = "https://lehi.granicus.com/ViewPublisher.php?view_id=1";

// Extract PDF hash (lehi_XXXX.pdf) from a DocumentViewer URL
function extractPdfHash(url: string | null): string | null {
  if (!url) return null;
  return url.match(/file=(lehi_[a-f0-9]+\.pdf)/i)?.[1] ?? null;
}

// Extract clip_id from an AgendaViewer URL
function extractAgendaClipId(url: string | null): string | null {
  if (!url) return null;
  return url.match(/[?&]clip_id=(\d+)/i)?.[1] ?? null;
}

// Build proxy URL based on what kind of agenda URL we have
function buildProxyUrl(agendaPdfUrl: string | null): string | null {
  if (!agendaPdfUrl) return null;
  const pdfHash = extractPdfHash(agendaPdfUrl);
  if (pdfHash) return `${PROXY_BASE}?pdf_hash=${encodeURIComponent(pdfHash)}`;
  const clipId = extractAgendaClipId(agendaPdfUrl);
  if (clipId) return `${PROXY_BASE}?agenda_clip_id=${clipId}`;
  return null;
}

interface AgendaViewerModalProps {
  meeting: {
    id?: string;
    title: string;
    meeting_date: string | null;
    agenda_url: string | null;
    agenda_pdf_url?: string | null;
  } | null;
  open: boolean;
  onClose: () => void;
}

export function AgendaViewerModal({ meeting, open, onClose }: AgendaViewerModalProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "blocked">("loading");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const proxyUrl = buildProxyUrl(meeting?.agenda_pdf_url ?? null);
  const hasAgenda = !!proxyUrl;
  const isAgendaViewer = !!extractAgendaClipId(meeting?.agenda_pdf_url ?? null);

  useEffect(() => {
    if (open) setStatus("loading");
  }, [open, meeting?.id]);

  useEffect(() => {
    if (!open || !hasAgenda) return;
    timerRef.current = setTimeout(() => setStatus("blocked"), 20000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [open, proxyUrl, hasAgenda]);

  if (!meeting) return null;

  const dateStr = meeting.meeting_date
    ? new Date(meeting.meeting_date + "T00:00:00").toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : "";

  const externalLink = meeting.agenda_pdf_url ?? meeting.agenda_url;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-5xl w-full h-[92vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <DialogTitle className="text-base font-semibold leading-tight pr-8 truncate">
                Agenda — {meeting.title}{dateStr ? ` · ${dateStr}` : ""}
              </DialogTitle>
            </div>
            {externalLink && (
              <Button size="sm" variant="ghost" asChild className="shrink-0">
                <a href={externalLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  {isAgendaViewer ? "Open on Granicus" : "Open PDF"}
                </a>
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 relative">
          {!hasAgenda ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground max-w-md">
                The agenda for this meeting hasn't been linked yet — it will be updated automatically.
              </p>
              {meeting.agenda_url && (
                <Button size="sm" variant="outline" asChild>
                  <a href={meeting.agenda_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    View Agenda on Granicus
                  </a>
                </Button>
              )}
              <Button size="sm" variant="outline" asChild>
                <a href={CALENDAR} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Browse Meeting Archive
                </a>
              </Button>
            </div>
          ) : status === "blocked" ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="text-sm text-muted-foreground max-w-md">
                The agenda could not be loaded in-page.
              </p>
              {externalLink && (
                <Button size="sm" variant="default" asChild>
                  <a href={externalLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    {isAgendaViewer ? "Open Agenda on Granicus" : "Open PDF in New Tab"}
                  </a>
                </Button>
              )}
            </div>
          ) : (
            <>
              {status === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      {isAgendaViewer ? "Loading agenda…" : "Loading agenda PDF…"}
                    </p>
                  </div>
                </div>
              )}
              <iframe
                src={proxyUrl}
                title={`Agenda: ${meeting.title}`}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups"
                onLoad={() => {
                  if (timerRef.current) clearTimeout(timerRef.current);
                  setStatus("loaded");
                }}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
