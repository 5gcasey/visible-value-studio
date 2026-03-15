import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Video, AlertCircle, Gauge } from "lucide-react";

const CALENDAR = "https://lehi.granicus.com/ViewPublisher.php?view_id=1";
const isFallbackUrl = (url: string | null) =>
  !url || url === CALENDAR || url.includes("MediaPlayer.php") || url.includes("ViewPublisher");

const SPEEDS = [1, 1.25, 1.5, 1.75, 2] as const;
type Speed = (typeof SPEEDS)[number];

interface VideoPlayerModalProps {
  meeting: {
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const streamUrl = meeting?.video_stream_url ?? null;
  const useNativeVideo = !!streamUrl;

  // Reset state whenever a new meeting opens
  useEffect(() => {
    if (open) {
      setStatus("loading");
      setSpeed(1);
    }
  }, [open]);

  // Iframe fallback timeout (meetings without a direct MP4 stream)
  useEffect(() => {
    if (!open || useNativeVideo) return;
    timerRef.current = setTimeout(() => setStatus("blocked"), 12000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [open, meeting?.video_url, useNativeVideo]);

  // Speed control — sets playbackRate directly on the <video> element
  const handleSpeedChange = (newSpeed: Speed) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  if (!meeting) return null;

  const noLink = isFallbackUrl(meeting.video_url) && !useNativeVideo;
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
            {!noLink && (
              <Button size="sm" variant="ghost" asChild className="shrink-0">
                <a href={meeting.video_url ?? meeting.video_stream_url ?? "#"} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Open full screen
                </a>
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Video area */}
        <div className="flex-1 min-h-0 relative bg-black flex flex-col">

          {noLink ? (
            /* No link at all */
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
            /* Load failed */
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="text-sm text-muted-foreground max-w-md">Unable to load this video.</p>
              <Button size="sm" variant="default" asChild>
                <a href={meeting.video_url!} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Watch in new tab
                </a>
              </Button>
            </div>

          ) : (
            <>
              {/* Loading spinner — shown until video metadata arrives or iframe loads */}
              {status === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-white/70">Loading video…</p>
                  </div>
                </div>
              )}

              {/* Video / iframe — fills available space */}
              <div className="flex-1 min-h-0 relative">
                {useNativeVideo ? (
                  /*
                   * Native <video> with direct MP4 from archive-stream.granicus.com.
                   * Browsers load cross-origin media in no-cors mode — no CORS headers needed.
                   * playbackRate is a standard DOM property; speed buttons work instantly.
                   */
                  <video
                    ref={videoRef}
                    src={streamUrl}
                    controls
                    className="w-full h-full bg-black"
                    onLoadedMetadata={() => {
                      setStatus("loaded");
                      if (videoRef.current) videoRef.current.playbackRate = speed;
                    }}
                    onPlay={() => {
                      // Re-enforce speed on every play (some browsers reset it)
                      if (videoRef.current) videoRef.current.playbackRate = speed;
                    }}
                    onError={() => setStatus("blocked")}
                  />
                ) : (
                  /* Iframe fallback for meetings without a direct stream URL */
                  <iframe
                    ref={iframeRef}
                    src={meeting.video_url!}
                    title={`Video: ${meeting.title}`}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    allowFullScreen
                    onLoad={() => {
                      if (timerRef.current) clearTimeout(timerRef.current);
                      setStatus("loaded");
                    }}
                    onError={() => setStatus("blocked")}
                  />
                )}
              </div>

              {/* Speed control bar — only meaningful for native video */}
              {useNativeVideo && (
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
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
