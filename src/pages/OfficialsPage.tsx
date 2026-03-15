import { useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { useCityConfig, useOfficials } from "@/hooks/use-data";
import { Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

const roleBadgeStyles: Record<string, string> = {
  elected: "bg-primary/10 text-primary border border-primary/20",
  appointed: "bg-accent/10 text-accent-foreground border border-accent/20",
  staff: "bg-secondary text-secondary-foreground border border-border",
};

const roleFilters = ["All", "elected", "appointed", "staff"];

function OfficialCard({ official }: { official: any }) {
  return (
    <Link to={`/officials/${official.slug}`} className="group flex flex-col justify-between rounded-lg border bg-card p-5 transition-shadow duration-150 hover:shadow-md h-full">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {getInitials(official.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground group-hover:text-primary leading-tight truncate">{official.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{official.title}</p>
          <p className="text-xs text-muted-foreground truncate">{official.department}</p>
          <div className="mt-1.5">
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${roleBadgeStyles[official.role || "staff"]}`}>
              {official.role?.charAt(0).toUpperCase()}{official.role?.slice(1)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end text-sm">
        <span className="text-xs font-medium text-primary group-hover:underline">View Profile →</span>
      </div>
    </Link>
  );
}

export default function OfficialsPage() {
  const [roleFilter, setRoleFilter] = useState("All");
  const { data: config } = useCityConfig();
  const { data: officials, isLoading } = useOfficials();

  const all = officials ?? [];

  // Groups by sort_order
  const elected = all.filter((o) => (o.sort_order ?? 999) >= 1 && (o.sort_order ?? 999) <= 21);
  const staff = all.filter((o) => (o.sort_order ?? 999) >= 100 && (o.sort_order ?? 999) <= 128);
  const planning = all.filter((o) => (o.sort_order ?? 999) >= 200);

  // Pyramid breakdown
  const mayor = elected.filter((o) => (o.sort_order ?? 999) === 1);
  const row2 = elected.filter((o) => (o.sort_order ?? 999) >= 10 && (o.sort_order ?? 999) <= 12);
  const row3 = elected.filter((o) => (o.sort_order ?? 999) >= 20 && (o.sort_order ?? 999) <= 21);

  // Filtered for non-All tabs
  const filtered = all.filter((o) => {
    if (roleFilter !== "All" && o.role !== roleFilter) return false;
    return true;
  });

  return (
    <SiteLayout>
      <section className="bg-primary py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-primary-foreground">{config?.city_name} City Officials</h1>
        </div>
      </section>

      <section className="border-b bg-background">
        <div className="container flex gap-1 overflow-x-auto py-3">
          {roleFilters.map((role) => (
            <button key={role} onClick={() => setRoleFilter(role)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${roleFilter === role ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              {role === "All" ? "All Officials" : role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          {isLoading && <div className="text-center text-muted-foreground py-12">Loading officials...</div>}

          {!isLoading && roleFilter === "All" && (
            <>
              {/* Elected Officials — Pyramid */}
              {elected.length > 0 && (
                <div className="mb-8 max-w-3xl mx-auto">
                  {/* Row 1: Mayor centered */}
                  {mayor.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="col-start-2">
                        <OfficialCard official={mayor[0]} />
                      </div>
                    </div>
                  )}

                  {/* Row 2: 3 council members */}
                  {row2.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {row2.map((o) => <OfficialCard key={o.id} official={o} />)}
                    </div>
                  )}

                  {/* Row 3: 2 council members centered */}
                  {row3.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="col-start-1 col-span-1"><OfficialCard official={row3[0]} /></div>
                      {row3[1] && <div className="col-start-3 col-span-1"><OfficialCard official={row3[1]} /></div>}
                    </div>
                  )}
                </div>
              )}

              {/* City Staff */}
              {staff.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <h2 className="text-xl font-semibold text-foreground mb-4">City Staff</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {staff.map((o) => <OfficialCard key={o.id} official={o} />)}
                  </div>
                </>
              )}

              {/* Planning Commission */}
              {planning.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <h2 className="text-xl font-semibold text-foreground mb-4">Planning Commission</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {planning.map((o) => <OfficialCard key={o.id} official={o} />)}
                  </div>
                </>
              )}
            </>
          )}

          {/* Non-All tabs: standard grid */}
          {!isLoading && roleFilter !== "All" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((official) => (
                <OfficialCard key={official.id} official={official} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
