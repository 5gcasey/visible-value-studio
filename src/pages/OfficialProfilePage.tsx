import { useParams, Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { mockOfficials, mockStatements } from "@/lib/mock-data";
import { ArrowLeft, Mail, ExternalLink } from "lucide-react";
import { useState } from "react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

const platformBadge: Record<string, string> = {
  facebook: "bg-blue-500/10 text-blue-700",
  instagram: "bg-pink-500/10 text-pink-700",
  website: "bg-primary/10 text-primary",
  meeting: "bg-accent/10 text-accent-foreground",
  other: "bg-secondary text-secondary-foreground",
};

export default function OfficialProfilePage() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("bio");
  const official = mockOfficials.find((o) => o.slug === slug);

  if (!official) {
    return (
      <SiteLayout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Official not found</h1>
          <Link to="/officials" className="mt-4 inline-flex items-center gap-1 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Officials
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const statements = mockStatements.filter((s) => s.official_id === official.id);
  const tabs = ["bio", "statements", "social", "timeline"];

  return (
    <SiteLayout>
      {/* Header Banner */}
      <section className="bg-primary py-10">
        <div className="container">
          <Link to="/officials" className="mb-4 inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> All Officials
          </Link>
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground/20 text-2xl font-bold text-primary-foreground">
              {getInitials(official.name)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">{official.name}</h1>
              <p className="text-primary-foreground/80">{official.title} — {official.department}</p>
              {official.contact_email && (
                <a href={`mailto:${official.contact_email}`} className="mt-1 inline-flex items-center gap-1 text-sm text-primary-foreground/60 hover:text-primary-foreground">
                  <Mail className="h-3.5 w-3.5" /> {official.contact_email}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-background py-4">
        <div className="container flex gap-8">
          <div>
            <p className="text-2xl font-bold text-foreground">{statements.length}</p>
            <p className="text-xs text-muted-foreground">Statements Recorded</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{formatDate(official.first_observed)}</p>
            <p className="text-xs text-muted-foreground">First Observed</p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b bg-background">
        <div className="container flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-3 text-sm font-medium capitalize transition-colors duration-150 ${
                activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "bio" ? "Biography" : tab === "statements" ? "Statements & Quotes" : tab === "social" ? "Social Media" : "Timeline"}
            </button>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="container max-w-3xl">
          {activeTab === "bio" && (
            <div>
              <p className="text-foreground leading-relaxed">{official.bio}</p>
              <div className="mt-6 rounded-lg border p-4">
                <h3 className="mb-3 font-semibold text-foreground">Key Details</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-muted-foreground">Role</dt>
                  <dd className="capitalize text-foreground">{official.role}</dd>
                  <dt className="text-muted-foreground">Department</dt>
                  <dd className="text-foreground">{official.department}</dd>
                  <dt className="text-muted-foreground">Contact</dt>
                  <dd className="text-foreground">{official.contact_email || "N/A"}</dd>
                  <dt className="text-muted-foreground">First Observed</dt>
                  <dd className="text-foreground">{formatDate(official.first_observed)}</dd>
                </dl>
              </div>
            </div>
          )}

          {activeTab === "statements" && (
            <div className="space-y-4">
              {statements.length === 0 && <p className="text-muted-foreground">No recorded statements yet.</p>}
              {statements.map((s) => (
                <div key={s.id} className="rounded-lg border bg-card p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{formatDate(s.statement_date)}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${platformBadge[s.platform] || platformBadge.other}`}>
                      {s.platform}
                    </span>
                  </div>
                  <p className="text-sm text-card-foreground">{s.content}</p>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      <ExternalLink className="h-3 w-3" /> Source
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "social" && (
            <div>
              {Object.entries(official.social_links || {}).length === 0 ? (
                <p className="text-muted-foreground">No social media profiles recorded.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(official.social_links || {}).map(([platform, url]) => (
                    <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border p-3 text-sm text-primary hover:bg-secondary">
                      <ExternalLink className="h-4 w-4" />
                      <span className="capitalize">{platform}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4">
              {statements.length === 0 && <p className="text-muted-foreground">No timeline activity yet.</p>}
              {statements.map((s) => (
                <div key={s.id} className="flex gap-4 border-l-2 border-primary/20 pl-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{formatDate(s.statement_date)}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${platformBadge[s.platform] || platformBadge.other}`}>
                      {s.platform}
                    </span>
                    <p className="mt-1 text-sm text-foreground">{s.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
