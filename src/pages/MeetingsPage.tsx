import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { cityConfig, mockMeetings, mockMeetingItems } from "@/lib/mock-data";
import { ChevronDown, ChevronUp, ExternalLink, Search } from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const meetingTypes = ["All Types", "city_council", "planning_commission", "rda", "board_of_adjustment", "special", "public_hearing"];
const statusOptions = ["All", "scheduled", "completed", "cancelled"];

export default function MeetingsPage() {
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockMeetings.filter((m) => {
    if (typeFilter !== "All Types" && m.meeting_type !== typeFilter) return false;
    if (statusFilter !== "All" && m.status !== statusFilter) return false;
    if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase()) && !m.body?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <SiteLayout>
      <section className="bg-primary py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-primary-foreground">Public Meetings & Notices</h1>
          <p className="mt-2 text-primary-foreground/70">{cityConfig.city_name}, {cityConfig.city_state}</p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-40 border-b bg-background py-4">
        <div className="container flex flex-wrap gap-3">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
            {meetingTypes.map((t) => <option key={t} value={t}>{t === "All Types" ? t : t.replace("_", " ")}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search meetings..." className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm" />
          </div>
        </div>
      </section>

      {/* Meeting List */}
      <section className="py-8">
        <div className="container space-y-4">
          {filtered.length === 0 && (
            <div className="rounded-lg border bg-card p-12 text-center">
              <p className="text-muted-foreground">No meetings found matching your filters.</p>
            </div>
          )}
          {filtered.map((meeting) => {
            const items = mockMeetingItems.filter((i) => i.meeting_id === meeting.id);
            const isExpanded = expandedId === meeting.id;
            return (
              <div key={meeting.id} className="rounded-lg border bg-card transition-shadow duration-150 hover:shadow-md">
                <button onClick={() => setExpandedId(isExpanded ? null : meeting.id)} className="flex w-full items-center gap-4 p-5 text-left">
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs font-medium uppercase text-muted-foreground">{new Date(meeting.meeting_date).toLocaleDateString("en-US", { month: "short" })}</p>
                    <p className="text-2xl font-bold text-foreground">{new Date(meeting.meeting_date).getDate()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(meeting.meeting_date).getFullYear()}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">{meeting.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground capitalize">{meeting.meeting_type?.replace("_", " ")}</span>
                      <span className="text-xs text-muted-foreground">• {meeting.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {meeting.agenda_url && <span className="rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">📄 Agenda</span>}
                    {meeting.minutes_url && <span className="rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">📋 Minutes</span>}
                    {meeting.packet_url && <span className="rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">📦 Packet</span>}
                    <StatusBadge status={meeting.status} />
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>

                {isExpanded && items.length > 0 && (
                  <div className="border-t px-5 py-4">
                    <h4 className="mb-3 text-sm font-semibold text-foreground">Agenda Items</h4>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <AgendaItem key={item.id} item={item} />
                      ))}
                    </div>
                    {meeting.agenda_url && (
                      <a href={meeting.agenda_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                        View Full Agenda <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                )}
                {isExpanded && items.length === 0 && (
                  <div className="border-t px-5 py-4 text-sm text-muted-foreground">
                    No agenda items available for this meeting.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}

function AgendaItem({ item }: { item: typeof mockMeetingItems[0] }) {
  const [open, setOpen] = useState(false);
  const analysis = [
    { label: "What is the issue?", content: item.what_is_issue },
    { label: "Legally current or requesting a change?", content: item.legally_current },
    { label: "Financial impact on the public?", content: item.financial_impact },
    { label: "Who benefits?", content: item.who_benefits },
    { label: "Who could be harmed?", content: item.who_harmed },
  ];

  return (
    <div className="rounded-lg border bg-section p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={item.priority} />
          <h5 className="font-medium text-foreground">{item.item_title}</h5>
        </div>
        <button onClick={() => setOpen(!open)} className="text-sm font-medium text-primary hover:underline">
          {open ? "Hide Analysis" : "5-Point Analysis"}
        </button>
      </div>
      {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
      {open && (
        <div className="mt-3 space-y-3">
          {analysis.map((a) => a.content && (
            <div key={a.label} className="rounded border bg-card p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">{a.label}</p>
              <p className="mt-1 text-sm text-foreground">{a.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
