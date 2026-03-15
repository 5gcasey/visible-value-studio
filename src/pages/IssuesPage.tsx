import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useCityConfig, useIssues } from "@/hooks/use-data";
import { Search, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const priorities = ["All", "critical", "high", "medium", "low"];
const categories = ["All", "zoning", "finance", "legal", "utility", "development", "policy", "other"];
const statuses = ["All", "open", "monitoring", "resolved"];

export default function IssuesPage() {
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: config } = useCityConfig();
  const { data: issues, isLoading } = useIssues();

  const allIssues = issues ?? [];
  const filtered = allIssues.filter((i) => {
    if (priorityFilter !== "All" && i.priority !== priorityFilter) return false;
    if (categoryFilter !== "All" && i.category !== categoryFilter) return false;
    if (statusFilter !== "All" && i.status !== statusFilter) return false;
    if (searchQuery && !i.title.toLowerCase().includes(searchQuery.toLowerCase()) && !i.summary?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const countByPriority = (p: string) => allIssues.filter((i) => i.priority === p).length;

  return (
    <SiteLayout>
      <section className="bg-primary py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-primary-foreground">Issues Tracker</h1>
          <p className="mt-2 text-primary-foreground/70">Documented issues facing {config?.city_name} residents</p>
        </div>
      </section>

      <section className="border-b bg-background py-4">
        <div className="container flex flex-wrap gap-6 text-sm">
          <span className="font-medium text-foreground">Total: {allIssues.length}</span>
          <span className="font-medium text-destructive">Critical: {countByPriority("critical")}</span>
          <span className="font-medium text-warning">High: {countByPriority("high")}</span>
          <span className="font-medium text-accent-foreground">Medium: {countByPriority("medium")}</span>
          <span className="font-medium text-foreground">Open: {allIssues.filter((i) => i.status === "open").length}</span>
        </div>
      </section>

      <section className="sticky top-16 z-40 border-b bg-background py-4">
        <div className="container flex flex-wrap gap-3">
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
            {priorities.map((p) => <option key={p} value={p}>{p === "All" ? "All Priorities" : p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
            {categories.map((c) => <option key={c} value={c}>{c === "All" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
            {statuses.map((s) => <option key={s} value={s}>{s === "All" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search issues..." className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm" />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container space-y-4">
          {isLoading && <div className="text-center text-muted-foreground py-12">Loading issues...</div>}
          {!isLoading && filtered.length === 0 && (
            <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">No issues found matching your filters.</div>
          )}
          {filtered.map((issue) => {
            const isExpanded = expandedId === issue.id;
            const analysis = [
              { label: "What is the issue?", content: issue.what_is_issue },
              { label: "Legally current or requesting a change?", content: issue.legally_current },
              { label: "Financial impact on the public?", content: issue.financial_impact },
              { label: "Who benefits?", content: issue.who_benefits },
              { label: "Who could be harmed?", content: issue.who_harmed },
            ];
            const priorityBorderColor: Record<string, string> = {
              critical: "border-l-priority-critical",
              high: "border-l-priority-high",
              medium: "border-l-priority-medium",
              low: "border-l-priority-low",
            };
            return (
              <div key={issue.id} className={`rounded-lg border border-l-4 ${priorityBorderColor[issue.priority ?? "medium"] || ""} bg-card`}>
                <button onClick={() => setExpandedId(isExpanded ? null : issue.id)} className="w-full p-5 text-left">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <PriorityBadge priority={issue.priority ?? "medium"} />
                    {issue.category && <CategoryBadge category={issue.category} />}
                    <StatusBadge status={issue.status ?? "open"} />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">{issue.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{issue.summary}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{issue.created_at ? formatDate(issue.created_at) : ""}</span>
                    <span className="flex items-center gap-1 text-xs font-medium text-primary">
                      {isExpanded ? "Hide" : "5-Point Analysis"}
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </span>
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t px-5 py-4 space-y-3">
                    {analysis.map((a) => a.content && (
                      <div key={a.label} className="rounded border bg-section p-3">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">{a.label}</p>
                        <p className="mt-1 text-sm text-foreground">{a.content}</p>
                      </div>
                    ))}
                    {issue.source_url && (
                      <a href={issue.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                        <ExternalLink className="h-3.5 w-3.5" /> Source
                      </a>
                    )}
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
