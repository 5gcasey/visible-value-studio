import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Video, AlertCircle } from "lucide-react";

const CALENDAR = "https://lehi.granicus.com/ViewPublisher.php?view_id=1";
const isFallback = (url: string | null) => !url || url === CALENDAR;

interface VideoPlayerModalProps {
  meeting: { title: string; meeting_date: string | null; video_url: string | null } | null;
  open: boolean;
  onClose: () => void;
}

export function VideoPlayerModal({ meeting, open, onClose }: VideoPlayerModalProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "blocked">("loading");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    setStatus("loading");
    timerRef.current = setTimeout(() => setStatus("blocked"), 12000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [open, meeting?.video_url]);

  if (!meeting) return null;

  const noLink = isFallback(meeting.video_url);
  const dateStr = meeting.meeting_date
    ? new Date(meeting.meeting_date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-6xl w-[90vw] h-[90vh] flex flex-col p-0 gap-0">
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
                <a href={meeting.video_url!} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Open in Granicus
                </a>
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 relative bg-black">
          {noLink ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <Video className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground max-w-md">
                The recording for this meeting hasn't been linked yet — it will be updated automatically within a day of the meeting.
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
              <p className="text-sm text-muted-foreground max-w-md">
                Granicus is preventing the video from loading inside this page.
              </p>
              <Button size="sm" variant="default" asChild>
                <a href={meeting.video_url!} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Watch on Granicus
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
              <iframe
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
