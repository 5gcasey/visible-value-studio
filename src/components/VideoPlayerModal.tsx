import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Video, AlertCircle, Gauge } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const PROXY_BASE = `${SUPABASE_URL}/functions/v1/granicus-proxy`;
const CALENDAR = "https://lehi.granicus.com/ViewPublisher.php?view_id=1";

const SPEEDS = [1, 1.25, 1.5, 1.75, 2] as const;
type Speed = (typeof SPEEDS)[number];

function extractClipId(videoUrl: string | null): string | null {
  if (!videoUrl) return null;
  return videoUrl.match(/\/player\/clip\/(\d+)/)?.[1] ?? null;
}

interface VideoPlayerModalProps {
  meeting: {
    id?: string;
    title: string;
    meeting_date: string | null;
    video_url: string | null;
    video_stream_url?: string | null;
  } | null;
  open: boolean;
  onClose: () => void;
}

export function VideoPlayerModal({ meeting, open, onClose }: VideoPlayerModalProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "blocked">("loading");
  const [speed, setSpeed] = useState<Speed>(1);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clipId = extractClipId(meeting?.video_url ?? null);
  const proxyUrl = clipId ? `${PROXY_BASE}?clip_id=${clipId}` : null;
  const hasVideo = !!proxyUrl;

  // Reset on open
  useEffect(() => {
    if (open) {
      setStatus("loading");
      setSpeed(1);
    }
  }, [open]);

  // Timeout for proxy iframe
  useEffect(() => {
    if (!open || !hasVideo) return;
    timerRef.current = setTimeout(() => setStatus("blocked"), 15000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [open, proxyUrl, hasVideo]);

  const handleSpeedChange = (newSpeed: Speed) => {
    setSpeed(newSpeed);
    iframeRef.current?.contentWindow?.postMessage(
      { type: "setPlaybackRate", rate: newSpeed },
      "*"
    );
  };

  if (!meeting) return null;

  const dateStr = meeting.meeting_date
    ? new Date(meeting.meeting_date + "T00:00:00").toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : "";

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-6xl w-[90vw] h-[90vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <Video className="h-4 w-4 text-primary shrink-0" />
              <DialogTitle className="text-base font-semibold leading-tight pr-8 truncate">
                {meeting.title}{dateStr ? ` · ${dateStr}` : ""}
              </DialogTitle>
            </div>
            {meeting.video_url && (
              <Button size="sm" variant="ghost" asChild className="shrink-0">
                <a href={meeting.video_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Open full screen
                </a>
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Video area */}
        <div className="flex-1 min-h-0 relative bg-black flex flex-col">
          {!hasVideo ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <Video className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground max-w-md">
                The recording for this meeting hasn't been linked yet — check back within a day of the meeting.
              </p>
              <Button size="sm" variant="outline" asChild>
                <a href={CALENDAR} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Browse all Lehi recordings
                </a>
              </Button>
            </div>
          ) : status === "blocked" ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="text-sm text-muted-foreground max-w-md">Video could not be loaded in-page.</p>
              <Button size="sm" variant="default" asChild>
                <a href={meeting.video_url!} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Watch in new tab
                </a>
              </Button>
            </div>
          ) : (
            <>
              {status === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-white/70">Loading video…</p>
                  </div>
                </div>
              )}

              <div className="flex-1 min-h-0 relative">
                <iframe
                  ref={iframeRef}
                  src={proxyUrl}
                  title={`Video: ${meeting.title}`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  onLoad={() => {
                    if (timerRef.current) clearTimeout(timerRef.current);
                    setStatus("loaded");
                  }}
                />
              </div>

              {/* Speed control bar */}
              <div className="shrink-0 bg-black border-t border-white/10 px-4 py-2 flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-white/40 mr-1 shrink-0" />
                <span className="text-xs text-white/40 mr-2 shrink-0">Speed</span>
                {SPEEDS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`text-xs px-2.5 py-1 rounded transition-colors font-mono ${
                      speed === s
                        ? "bg-white text-black font-semibold"
                        : "text-white/55 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {s === 1 ? "1×" : `${s}×`}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
