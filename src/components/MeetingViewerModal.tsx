import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar, MapPin, Video, FileText, ExternalLink,
  AlertCircle, Clock, ChevronDown, ChevronUp, ScrollText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Meeting {
  id: string;
  title: string;
  meeting_date: string | null;
  meeting_type: string | null;
  location: string | null;
  status: string | null;
  body: string | null;
  executive_summary: string | null;
  transcript_text: string | null;
  transcript_url: string | null;
  agenda_url: string | null;
  video_url: string | null;
  minutes_url: string | null;
}

interface MeetingItem {
  id: string;
  item_title: string;
  description: string | null;
  financial_impact: string | null;
  what_is_issue: string | null;
  who_benefits: string | null;
  who_harmed: string | null;
  priority: string | null;
  sort_order: number | null;
}

interface MeetingViewerModalProps {
  meeting: Meeting | null;
  open: boolean;
  onClose: () => void;
}

const GRANICUS_CALENDAR = "https://lehi.granicus.com/ViewPublisher.php?view_id=1";

function isDirectLink(url: string | null): boolean {
  return !!url && url !== GRANICUS_CALENDAR;
}

function EmbedFrame({ url, title }: { url: string; title: string }) {
  const [blocked, setBlocked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBlocked(false);
    setLoaded(false);
    const timer = setTimeout(() => {
      if (!loaded) setBlocked(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [url]);

  if (blocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
        <AlertCircle className="h-10 w-10" />
        <p className="text-sm text-center">
          This content can't be previewed here due to Granicus security settings.
        </p>
        <Button size="sm" variant="outline" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Open in Granicus
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
          <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
        </div>
      )}
      <iframe
        src={url}
        title={title}
        className="h-full w-full border-0 rounded-lg"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        onError={() => setBlocked(true)}
      />
    </div>
  );
}

function AgendaItemCard({ item }: { item: MeetingItem }) {
  const [expanded, setExpanded] = useState(false);
  const priorityColor =
    item.priority === "high" ? "destructive" :
    item.priority === "medium" ? "secondary" : "outline";

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm leading-snug">{item.item_title}</h4>
        {item.priority && (
          <Badge variant={priorityColor} className="shrink-0 capitalize text-xs">
            {item.priority}
          </Badge>
        )}
      </div>
      {item.description && (
        <p className="text-sm text-muted-foreground">{item.description}</p>
      )}
      {(item.financial_impact || item.what_is_issue || item.who_benefits || item.who_harmed) && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? "Less detail" : "More detail"}
          </button>
          {expanded && (
            <div className="space-y-2 pt-1 border-t text-xs text-muted-foreground">
              {item.what_is_issue && (
                <div><span className="font-semibold text-foreground">Issue: </span>{item.what_is_issue}</div>
              )}
              {item.financial_impact && (
                <div><span className="font-semibold text-foreground">Financial impact: </span>{item.financial_impact}</div>
              )}
              {item.who_benefits && (
                <div><span className="font-semibold text-foreground">Who benefits: </span>{item.who_benefits}</div>
              )}
              {item.who_harmed && (
                <div><span className="font-semibold text-foreground">Concerns: </span>{item.who_harmed}</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function MeetingViewerModal({ meeting, open, onClose }: MeetingViewerModalProps) {
  const [items, setItems] = useState<MeetingItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    if (!meeting?.id || !open) return;
    setLoadingItems(true);
    supabase
      .from("meeting_items")
      .select("*")
      .eq("meeting_id", meeting.id)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setItems(data ?? []);
        setLoadingItems(false);
      });
  }, [meeting?.id, open]);

  useEffect(() => {
    if (open) setActiveTab("summary");
  }, [open, meeting?.id]);

  if (!meeting) return null;

  const hasDirectVideo = isDirectLink(meeting.video_url);
  const hasDirectAgenda = isDirectLink(meeting.agenda_url);
  const hasMinutes = !!meeting.minutes_url;
  const hasTranscript = !!meeting.transcript_text;
  const hasTranscriptLink = !!meeting.transcript_url;

  const summaryText = meeting.executive_summary || meeting.body;

  const statusColor =
    meeting.status === "cancelled" ? "destructive" :
    meeting.status === "scheduled" ? "secondary" : "outline";

  const formattedDate = meeting.meeting_date
    ? new Date(meeting.meeting_date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <DialogTitle className="text-lg font-semibold leading-tight pr-8">
                {meeting.title}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {formattedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formattedDate}
                  </span>
                )}
                {meeting.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {meeting.location}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {meeting.meeting_type && (
                <Badge variant="secondary" className="text-xs">{meeting.meeting_type}</Badge>
              )}
              {meeting.status && (
                <Badge variant={statusColor} className="text-xs capitalize">
                  {meeting.status}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-3">
            {hasDirectVideo && (
              <Button size="sm" variant="default" asChild>
                <a href={meeting.video_url!} target="_blank" rel="noopener noreferrer">
                  <Video className="h-3.5 w-3.5 mr-1.5" />
                  Watch Recording
                </a>
              </Button>
            )}
            {hasDirectAgenda && (
              <Button size="sm" variant="outline" asChild>
                <a href={meeting.agenda_url!} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  View Agenda
                </a>
              </Button>
            )}
            {hasMinutes && (
              <Button size="sm" variant="outline" asChild>
                <a href={meeting.minutes_url!} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  View Minutes
                </a>
              </Button>
            )}
            {hasTranscriptLink && (
              <Button size="sm" variant="outline" asChild>
                <a href={meeting.transcript_url!} target="_blank" rel="noopener noreferrer">
                  <ScrollText className="h-3.5 w-3.5 mr-1.5" />
                  Full Transcript
                </a>
              </Button>
            )}
            {!hasDirectVideo && !hasDirectAgenda && (
              <Button size="sm" variant="outline" asChild>
                <a href={GRANICUS_CALENDAR} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Lehi Meeting Archive
                </a>
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
          <TabsList className="px-6 pt-2 pb-0 border-b rounded-none bg-transparent justify-start h-auto gap-1 shrink-0">
            <TabsTrigger
              value="summary"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
            >
              Executive Summary
            </TabsTrigger>
            {items.length > 0 && (
              <TabsTrigger
                value="items"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
              >
                Agenda Items ({items.length})
              </TabsTrigger>
            )}
            {hasTranscript && (
              <TabsTrigger
                value="transcript"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
              >
                <ScrollText className="h-3.5 w-3.5 mr-1.5" />
                Transcript
              </TabsTrigger>
            )}
            {hasDirectVideo && (
              <TabsTrigger
                value="video"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
              >
                <Video className="h-3.5 w-3.5 mr-1.5" />
                Video
              </TabsTrigger>
            )}
            {hasDirectAgenda && (
              <TabsTrigger
                value="agenda"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Agenda
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="summary" className="flex-1 overflow-y-auto px-6 py-4 mt-0">
            {meeting.status === "cancelled" ? (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Meeting Cancelled</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This meeting was cancelled. Check the{" "}
                    <a href={GRANICUS_CALENDAR} target="_blank" rel="noopener noreferrer" className="underline">
                      Lehi meeting calendar
                    </a>{" "}
                    for rescheduled information.
                  </p>
                </div>
              </div>
            ) : summaryText ? (
              <div className="space-y-4">
                {meeting.executive_summary && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary rounded-full px-2 py-0.5">
                      ✦ AI Executive Summary
                    </span>
                    <span>Generated from news coverage and meeting records</span>
                  </div>
                )}
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {summaryText}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
                <Clock className="h-8 w-8" />
                <p className="text-sm">Summary being generated — check back tonight.</p>
                {hasDirectAgenda && (
                  <Button variant="link" asChild className="text-xs">
                    <a href={meeting.agenda_url!} target="_blank" rel="noopener noreferrer">
                      View the official agenda in the meantime →
                    </a>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {items.length > 0 && (
            <TabsContent value="items" className="flex-1 overflow-y-auto px-6 py-4 mt-0">
              {loadingItems ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-pulse text-sm text-muted-foreground">Loading items…</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <AgendaItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {hasTranscript && (
            <TabsContent value="transcript" className="flex-1 overflow-y-auto px-6 py-4 mt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Official transcript from Lehi City / Granicus closed captions
                  </p>
                  {hasTranscriptLink && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={meeting.transcript_url!} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        Open full transcript
                      </a>
                    </Button>
                  )}
                </div>
                <div className="bg-muted/30 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                  <p className="text-xs font-mono leading-relaxed whitespace-pre-wrap text-foreground">
                    {meeting.transcript_text}
                  </p>
                </div>
              </div>
            </TabsContent>
          )}

          {hasDirectVideo && (
            <TabsContent value="video" className="flex-1 min-h-0 px-6 py-4 mt-0">
              <div className="h-full min-h-[400px]">
                <EmbedFrame url={meeting.video_url!} title={`Video: ${meeting.title}`} />
              </div>
            </TabsContent>
          )}

          {hasDirectAgenda && (
            <TabsContent value="agenda" className="flex-1 min-h-0 px-6 py-4 mt-0">
              <div className="h-full min-h-[400px]">
                <EmbedFrame url={meeting.agenda_url!} title={`Agenda: ${meeting.title}`} />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
