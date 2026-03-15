import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, ScrollText, Clock, ChevronDown, ChevronUp, AlertCircle, ExternalLink } from "lucide-react";
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

const CALENDAR = "https://lehi.granicus.com/ViewPublisher.php?view_id=1";
const isFallback = (url: string | null) => !url || url === CALENDAR;

function AgendaItemCard({ item }: { item: MeetingItem }) {
  const [open, setOpen] = useState(false);
  const variant =
    item.priority === "high" ? "destructive" as const :
    item.priority === "medium" ? "secondary" as const : "outline" as const;

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm leading-snug">{item.item_title}</h4>
        {item.priority && (
          <Badge variant={variant} className="shrink-0 capitalize text-xs">
            {item.priority}
          </Badge>
        )}
      </div>
      {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
      {(item.financial_impact || item.what_is_issue || item.who_benefits || item.who_harmed) && (
        <>
          <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-xs text-primary hover:underline">
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {open ? "Less" : "More detail"}
          </button>
          {open && (
            <div className="space-y-2 pt-1 border-t text-xs text-muted-foreground">
              {item.what_is_issue && <div><span className="font-semibold text-foreground">Issue: </span>{item.what_is_issue}</div>}
              {item.financial_impact && <div><span className="font-semibold text-foreground">Financial impact: </span>{item.financial_impact}</div>}
              {item.who_benefits && <div><span className="font-semibold text-foreground">Who benefits: </span>{item.who_benefits}</div>}
              {item.who_harmed && <div><span className="font-semibold text-foreground">Concerns: </span>{item.who_harmed}</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function MeetingDetailModal({ meeting, open, onClose }: { meeting: Meeting | null; open: boolean; onClose: () => void }) {
  const [items, setItems] = useState<MeetingItem[]>([]);
  const [tab, setTab] = useState("summary");

  useEffect(() => {
    if (!meeting?.id || !open) return;
    supabase.from("meeting_items").select("*").eq("meeting_id", meeting.id)
      .order("sort_order").then(({ data }) => setItems(data ?? []));
  }, [meeting?.id, open]);

  useEffect(() => { if (open) setTab("summary"); }, [open, meeting?.id]);

  if (!meeting) return null;

  const summaryText = meeting.executive_summary || meeting.body;
  const hasTranscript = !!meeting.transcript_text;
  const dateStr = meeting.meeting_date
    ? new Date(meeting.meeting_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : null;

  const statusColor =
    meeting.status === "cancelled" ? "destructive" as const :
    meeting.status === "scheduled" ? "secondary" as const : "outline" as const;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <DialogTitle className="text-lg font-semibold leading-tight pr-8">
                {meeting.title}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {dateStr && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {dateStr}
                  </span>
                )}
                {meeting.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {meeting.location}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {meeting.meeting_type && <Badge variant="secondary" className="text-xs">{meeting.meeting_type}</Badge>}
              {meeting.status && <Badge variant={statusColor} className="text-xs capitalize">{meeting.status}</Badge>}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex flex-col flex-1 min-h-0">
          <TabsList className="px-6 pt-2 pb-0 border-b rounded-none bg-transparent justify-start h-auto gap-1 shrink-0">
            {[
              { value: "summary", label: "Executive Summary" },
              ...(items.length > 0 ? [{ value: "items", label: `Agenda Items (${items.length})` }] : []),
              ...(hasTranscript ? [{ value: "transcript", label: "Transcript" }] : []),
            ].map(t => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="summary" className="flex-1 overflow-y-auto px-6 py-4 mt-0">
            {meeting.status === "cancelled" ? (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Meeting Cancelled</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Check the{" "}
                    <a href={CALENDAR} target="_blank" rel="noopener noreferrer" className="underline">Lehi meeting calendar</a>
                    {" "}for updates.
                  </p>
                </div>
              </div>
            ) : summaryText ? (
              <div className="space-y-4">
                {meeting.executive_summary && (
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                    ✦ AI Executive Summary
                  </span>
                )}
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{summaryText}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
                <Clock className="h-8 w-8" />
                <p className="text-sm">Summary being generated — check back tonight.</p>
                {!isFallback(meeting.agenda_url) && (
                  <Button variant="link" size="sm" asChild className="text-xs">
                    <a href={meeting.agenda_url!} target="_blank" rel="noopener noreferrer">
                      View the official agenda instead →
                    </a>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {items.length > 0 && (
            <TabsContent value="items" className="flex-1 overflow-y-auto px-6 py-4 mt-0">
              <div className="space-y-3">
                {items.map(item => <AgendaItemCard key={item.id} item={item} />)}
              </div>
            </TabsContent>
          )}

          {hasTranscript && (
            <TabsContent value="transcript" className="flex-1 overflow-y-auto px-6 py-4 mt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Official transcript from Granicus closed captions</p>
                  {meeting.transcript_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={meeting.transcript_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        Full transcript
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
