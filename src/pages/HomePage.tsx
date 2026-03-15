import { Link } from "react-router-dom";
import { ArrowRight, Calendar, AlertTriangle, MessageSquare, Users, FileText } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { PriorityBadge } from "@/components/PriorityBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { cityConfig, mockWeeklyReports, mockIssues, mockMeetings, mockHighPriorityFlags, mockCommunityPosts } from "@/lib/mock-data";
import { useState } from "react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function HomePage() {
  const [email, setEmail] = useState("");
  const latestReport = mockWeeklyReports[0];
  const upcomingMeetings = mockMeetings.filter((m) => m.status === "scheduled").slice(0, 5);
  const recentIssues = mockIssues.slice(0, 6);
  const activeAlerts = mockHighPriorityFlags.filter((f) => !f.resolved);
  const recentPosts = mockCommunityPosts.slice(0, 3);

  const stats = [
    { label: "Meetings This Week", value: upcomingMeetings.length, icon: Calendar },
    { label: "Open Issues", value: mockIssues.filter((i) => i.status === "open").length, icon: FileText },
    { label: "⚠️ Repeat Developers", value: 2, icon: Users },
    { label: "Last Updated", value: "Today", icon: AlertTriangle },
  ];

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-medium text-primary-foreground/60">
                Week Ending {formatDate(latestReport.week_ending)}
              </p>
              <h1 className="text-2xl font-bold leading-tight text-primary-foreground md:text-3xl lg:text-4xl">
                {latestReport.headline}
              </h1>
              <p className="mt-3 text-sm text-primary-foreground/70">
                All reporting is independent, factual, and sourced.
              </p>
            </div>
            <Link
              to={`/reports/${latestReport.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors duration-150 hover:bg-accent/90"
            >
              Read Full Report <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b bg-background py-6">
        <div className="container grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 rounded-lg border p-4">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Issues */}
      <section className="py-12">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Recent Issues</h2>
            <Link to="/issues" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View All Issues <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="group rounded-lg border bg-card p-5 transition-shadow duration-150 hover:shadow-md">
                <div className="mb-3 flex items-center gap-2">
                  <PriorityBadge priority={issue.priority} />
                  <CategoryBadge category={issue.category} />
                </div>
                <h3 className="mb-2 font-semibold text-card-foreground">{issue.title}</h3>
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{issue.summary}</p>
                <p className="text-xs text-muted-foreground">{formatDate(issue.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meetings + Alerts */}
      <section className="bg-section py-12">
        <div className="container grid gap-8 lg:grid-cols-5">
          {/* Upcoming Meetings */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Upcoming Meetings</h2>
              <Link to="/meetings" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center gap-4 rounded-lg border bg-card p-4">
                  <div className="text-center">
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      {new Date(meeting.meeting_date).toLocaleDateString("en-US", { month: "short" })}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {new Date(meeting.meeting_date).getDate()}
                    </p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-card-foreground">{meeting.title}</h3>
                    <p className="text-sm text-muted-foreground">{meeting.meeting_type?.replace("_", " ")}</p>
                  </div>
                  <div className="flex gap-2">
                    {meeting.agenda_url && <span className="rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">📄 Agenda</span>}
                    {meeting.minutes_url && <span className="rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">📋 Minutes</span>}
                    {meeting.packet_url && <span className="rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">📦 Packet</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Alerts */}
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Active Alerts</h2>
            {activeAlerts.length > 0 ? (
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-lg border-l-4 border-l-destructive bg-destructive/5 p-4">
                    <span className="mb-1 inline-block rounded bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                      {alert.category}
                    </span>
                    <p className="mt-1 text-sm font-medium text-foreground">{alert.summary}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(alert.flagged_at)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-6 text-center">
                <p className="text-success font-medium">✓ No active alerts</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Community Pulse */}
      <section className="py-12">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Community Pulse</h2>
            <Link to="/community" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="rounded-lg border bg-card p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{post.group_name}</span>
                  <CategoryBadge category={post.theme} />
                </div>
                <p className="mb-3 text-sm text-card-foreground">{post.summary}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${post.city_response === "yes" ? "text-success" : post.city_response === "partial" ? "text-accent" : "text-destructive"}`}>
                    City responded: {post.city_response === "yes" ? "✓" : post.city_response === "partial" ? "Partial" : "✗"}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(post.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="bg-accent py-12">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-accent-foreground">
            Get civic alerts for {cityConfig.city_name}
          </h2>
          <p className="mt-2 text-sm text-accent-foreground/70">
            Weekly digest + breaking alerts. No spam.
          </p>
          <form
            className="mx-auto mt-6 flex max-w-md gap-3"
            onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 rounded-lg border border-accent-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
            >
              Subscribe Free
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
