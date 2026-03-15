import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useCityConfig, useCommunityPosts } from "@/hooks/use-data";
import { Search } from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const responseFilters = ["All", "yes", "no", "partial"];

export default function CommunityPage() {
  const [groupFilter, setGroupFilter] = useState("All Groups");
  const [responseFilter, setResponseFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: config } = useCityConfig();
  const { data: posts } = useCommunityPosts();

  const allPosts = posts ?? [];
  const groups = ["All Groups", ...Array.from(new Set(allPosts.map((p) => p.group_name)))];

  const filtered = allPosts.filter((p) => {
    if (groupFilter !== "All Groups" && p.group_name !== groupFilter) return false;
    if (responseFilter !== "All" && p.city_response !== responseFilter) return false;
    if (searchQuery && !p.summary.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unanswered = allPosts.filter((p) => p.city_response === "no");

  return (
    <SiteLayout>
      <section className="bg-primary py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-primary-foreground">Community Pulse</h1>
          <p className="mt-2 text-primary-foreground/70">What {config?.city_name} residents are saying in public forums</p>
        </div>
      </section>

      <section className="sticky top-16 z-40 border-b bg-background py-4">
        <div className="container flex flex-wrap gap-3">
          <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
            {groups.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={responseFilter} onChange={(e) => setResponseFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
            {responseFilters.map((r) => <option key={r} value={r}>{r === "All" ? "All Responses" : `City: ${r.charAt(0).toUpperCase() + r.slice(1)}`}</option>)}
          </select>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search community posts..." className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm" />
          </div>
        </div>
      </section>

      {unanswered.length > 0 && (
        <section className="py-8">
          <div className="container">
            <div className="rounded-lg border-2 border-accent bg-accent/5 p-6">
              <h2 className="mb-1 text-lg font-bold text-foreground">Unanswered Questions</h2>
              <p className="mb-4 text-sm text-muted-foreground">These questions have not received a public response from the city.</p>
              <div className="space-y-3">
                {unanswered.map((post) => (
                  <div key={post.id} className="rounded-lg border bg-card p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{post.group_name}</span>
                      {post.theme && <CategoryBadge category={post.theme} />}
                    </div>
                    <p className="text-sm text-card-foreground">{post.summary}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{post.created_at ? formatDate(post.created_at) : ""}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-8">
        <div className="container">
          <h2 className="mb-4 text-xl font-bold text-foreground">All Community Posts</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((post) => (
              <div key={post.id} className="rounded-lg border bg-card p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{post.group_name}</span>
                  {post.theme && <CategoryBadge category={post.theme} />}
                </div>
                <p className="mb-3 text-sm text-card-foreground">{post.summary}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${post.city_response === "yes" ? "text-success" : post.city_response === "partial" ? "text-accent-foreground" : "text-destructive"}`}>
                    City responded: {post.city_response === "yes" ? "✓" : post.city_response === "partial" ? "Partial" : "✗"}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.created_at ? formatDate(post.created_at) : ""}</span>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">No posts found matching your filters.</div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
