import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { useCityConfig, useDevelopers } from "@/hooks/use-data";
import { Search, AlertTriangle, X } from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function DevelopersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDev, setSelectedDev] = useState<any | null>(null);
  const { data: config } = useCityConfig();
  const { data: developers, isLoading } = useDevelopers();

  const types = ["All", "rezone", "subdivision", "annexation", "cup", "variance", "pud", "other"];
  const statuses = ["All", "active", "approved", "denied", "withdrawn", "on_hold"];

  const allDevs = developers ?? [];
  const filtered = allDevs.filter((d) => {
    if (typeFilter !== "All" && d.application_type !== typeFilter) return false;
    if (statusFilter !== "All" && d.status !== statusFilter) return false;
    if (searchQuery && !d.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) && !d.project_name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const repeatCount = allDevs.filter((d) => (d.appearance_count ?? 0) >= 3).length;

  return (
    <SiteLayout>
      <section className="bg-primary py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-primary-foreground">Development & Applicant Tracker</h1>
          <p className="mt-2 text-primary-foreground/70">Every development application filed in {config?.city_name}, with repeat applicant flagging.</p>
        </div>
      </section>

      <section className="border-b bg-background py-4">
        <div className="container flex flex-wrap gap-6 text-sm">
          <span className="font-medium text-foreground">Total Applications: {allDevs.length}</span>
          <span className="font-medium text-accent-foreground">⚠️ Repeat Applicants: {repeatCount}</span>
          <span className="font-medium text-foreground">Active: {allDevs.filter((d) => d.status === "active").length}</span>
        </div>
      </section>

      <section className="sticky top-16 z-40 border-b bg-background py-4">
        <div className="container flex flex-wrap gap-3">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
            {types.map((t) => <option key={t} value={t}>{t === "All" ? "All Types" : t.toUpperCase()}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
            {statuses.map((s) => <option key={s} value={s}>{s === "All" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}</option>)}
          </select>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search applicants or projects..." className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm" />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          {isLoading && <div className="text-center text-muted-foreground py-12">Loading developers...</div>}
          {!isLoading && (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-section">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Applicant</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Project</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Location</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Appearances</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Filed</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((dev) => (
                    <tr key={dev.id} onClick={() => setSelectedDev(dev)} className="cursor-pointer border-t transition-colors duration-150 hover:bg-section">
                      <td className="px-4 py-3 font-medium text-foreground">{dev.applicant_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{dev.project_name}</td>
                      <td className="px-4 py-3 uppercase text-muted-foreground">{dev.application_type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{dev.location}</td>
                      <td className="px-4 py-3"><StatusBadge status={dev.status ?? "active"} /></td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1">
                          {(dev.appearance_count ?? 0) >= 3 && <AlertTriangle className="h-3.5 w-3.5 text-accent" />}
                          <span className={(dev.appearance_count ?? 0) >= 3 ? "font-semibold text-accent-foreground" : "text-muted-foreground"}>{dev.appearance_count}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{dev.created_at ? formatDate(dev.created_at) : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="mt-4 rounded-lg border bg-card p-12 text-center text-muted-foreground">No applications found matching your filters.</div>
          )}
        </div>
      </section>

      {selectedDev && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l bg-background shadow-xl">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b bg-primary p-5">
              <h3 className="text-lg font-bold text-primary-foreground">{selectedDev.applicant_name}</h3>
              <button onClick={() => setSelectedDev(null)} className="rounded p-1 text-primary-foreground hover:bg-primary-foreground/10"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <dl className="space-y-3 text-sm">
                <div><dt className="text-muted-foreground">Project</dt><dd className="font-medium text-foreground">{selectedDev.project_name}</dd></div>
                <div><dt className="text-muted-foreground">Location</dt><dd className="text-foreground">{selectedDev.location}</dd></div>
                <div><dt className="text-muted-foreground">Application Type</dt><dd className="uppercase text-foreground">{selectedDev.application_type}</dd></div>
                <div><dt className="text-muted-foreground">Status</dt><dd><StatusBadge status={selectedDev.status ?? "active"} /></dd></div>
                <div><dt className="text-muted-foreground">Appearances</dt><dd className="flex items-center gap-1 text-foreground">{(selectedDev.appearance_count ?? 0) >= 3 && <AlertTriangle className="h-3.5 w-3.5 text-accent" />} {selectedDev.appearance_count}</dd></div>
                <div><dt className="text-muted-foreground">Filed</dt><dd className="text-foreground">{selectedDev.created_at ? formatDate(selectedDev.created_at) : ""}</dd></div>
                {selectedDev.notes && <div><dt className="text-muted-foreground">Notes</dt><dd className="text-foreground">{selectedDev.notes}</dd></div>}
              </dl>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
