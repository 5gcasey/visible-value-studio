import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { useWeeklyReports, useWeeklyReport } from "@/hooks/use-data";
import { ArrowRight, ArrowLeft, Search, Printer, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: reports, isLoading } = useWeeklyReports();

  const filtered = (reports ?? []).filter((r) => {
    if (searchQuery && !r.headline.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <SiteLayout>
      <section className="bg-primary py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-primary-foreground">Weekly Accountability Reports</h1>
          <p className="mt-2 text-primary-foreground/70">Published every Sunday at 9:00 AM</p>
        </div>
      </section>

      <section className="border-b bg-background py-4">
        <div className="container">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search reports..." className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm" />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container max-w-3xl space-y-4">
          {isLoading && <div className="text-center text-muted-foreground py-12">Loading reports...</div>}
          {filtered.map((report) => {
            const sections = report.sections as Record<string, unknown> | null;
            const topHeadlines = sections?.top_headlines as string[] | undefined;
            return (
              <div key={report.id} className="rounded-lg border bg-card p-6 transition-shadow duration-150 hover:shadow-md">
                <p className="text-sm font-medium text-muted-foreground">Week Ending {formatDate(report.week_ending)}</p>
                <h2 className="mt-1 text-xl font-bold text-card-foreground">{report.headline}</h2>
                {topHeadlines && (
                  <ul className="mt-3 space-y-1">
                    {topHeadlines.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                <Link to={`/reports/${report.id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  Read Full Report <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}

export function ReportDetailPage() {
  const { id } = useParams();
  const { data: report, isLoading } = useWeeklyReport(id);
  const [email, setEmail] = useState("");

  if (isLoading) {
    return <SiteLayout><div className="container py-20 text-center text-muted-foreground">Loading report...</div></SiteLayout>;
  }

  if (!report) {
    return (
      <SiteLayout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Report not found</h1>
          <Link to="/reports" className="mt-4 inline-flex items-center gap-1 text-primary hover:underline"><ArrowLeft className="h-4 w-4" /> All Reports</Link>
        </div>
      </SiteLayout>
    );
  }

  const sectionDefs = [
    { key: "top_headlines", label: "Top Headlines" },
    { key: "meetings", label: "Public Meetings & Notices" },
    { key: "council_activity", label: "Council & Mayor Activity" },
    { key: "development", label: "Development & Planning" },
    { key: "financial", label: "Financial & Utility Watch" },
    { key: "legal", label: "Legal Department Watch" },
    { key: "community", label: "Community Pulse" },
    { key: "pending", label: "Pending Actions" },
  ];

  const sections = report.sections as Record<string, unknown> | null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("subscribers").insert({ email });
    setEmail("");
  };

  return (
    <SiteLayout>
      <section className="bg-primary py-10">
        <div className="container">
          <Link to="/reports" className="mb-4 inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground"><ArrowLeft className="h-3.5 w-3.5" /> All Reports</Link>
          <p className="text-sm text-primary-foreground/60">Week Ending {formatDate(report.week_ending)}</p>
          <h1 className="mt-1 text-3xl font-bold text-primary-foreground">{report.headline}</h1>
          <p className="mt-2 text-sm text-primary-foreground/50">Published {report.published_at ? formatDate(report.published_at) : ""}</p>
        </div>
      </section>

      <section className="border-b bg-background py-3">
        <div className="container flex gap-3">
          <button onClick={() => window.print()} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"><Printer className="h-3.5 w-3.5" /> Print</button>
          <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"><Share2 className="h-3.5 w-3.5" /> Share</button>
        </div>
      </section>

      <section className="py-8">
        <div className="container max-w-3xl space-y-8">
          {sectionDefs.map((section) => {
            const content = sections?.[section.key];
            if (!content) return null;
            return (
              <div key={section.key}>
                <h2 className="mb-3 text-xl font-bold text-foreground">{section.label}</h2>
                <div className="border-t pt-3">
                  {Array.isArray(content) ? (
                    <ul className="space-y-2">
                      {(content as string[]).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />{item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm leading-relaxed text-foreground">{content as string}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-accent py-8">
        <div className="container text-center">
          <h3 className="text-lg font-bold text-accent-foreground">Get reports delivered to your inbox</h3>
          <form className="mx-auto mt-4 flex max-w-md gap-3" onSubmit={handleSubscribe}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm" />
            <button type="submit" className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Subscribe</button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
