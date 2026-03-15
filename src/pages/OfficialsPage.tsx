import { useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { useCityConfig, useOfficials } from "@/hooks/use-data";
import { Mail } from "lucide-react";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

const roleBadgeStyles: Record<string, string> = {
  elected: "bg-primary/10 text-primary border border-primary/20",
  appointed: "bg-accent/10 text-accent-foreground border border-accent/20",
  staff: "bg-secondary text-secondary-foreground border border-border",
};

const roleFilters = ["All", "elected", "appointed", "staff"];

export default function OfficialsPage() {
  const [roleFilter, setRoleFilter] = useState("All");
  const { data: config } = useCityConfig();
  const { data: officials, isLoading } = useOfficials();

  const filtered = (officials ?? []).filter((o) => {
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
        <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && <div className="col-span-full text-center text-muted-foreground py-12">Loading officials...</div>}
          {filtered.map((official) => (
            <Link key={official.id} to={`/officials/${official.slug}`} className="group rounded-lg border bg-card p-6 transition-shadow duration-150 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {getInitials(official.name)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary">{official.name}</h3>
                  <p className="text-sm text-muted-foreground">{official.title}</p>
                  <p className="text-xs text-muted-foreground">{official.department}</p>
                  <div className="mt-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${roleBadgeStyles[official.role || "staff"]}`}>
                      {official.role?.charAt(0).toUpperCase()}{official.role?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                {official.contact_email && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> {official.contact_email}</span>
                )}
                <span className="text-xs font-medium text-primary group-hover:underline">View Profile →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
