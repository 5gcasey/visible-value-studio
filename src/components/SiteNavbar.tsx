import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, AlertTriangle } from "lucide-react";
import { useCityConfig, useHighPriorityFlags } from "@/hooks/use-data";

const navLinks = [
  { label: "Meetings", href: "/meetings" },
  { label: "Officials", href: "/officials" },
  { label: "Issues", href: "/issues" },
  { label: "Developers", href: "/developers" },
  { label: "Reports", href: "/reports" },
  { label: "Community", href: "/community" },
];

export function SiteNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { data: config } = useCityConfig();
  const { data: flags } = useHighPriorityFlags();
  const alertCount = flags?.length ?? 0;

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-lg font-extrabold uppercase tracking-wide text-primary-foreground">
            {config?.display_name ?? "Open Cities"}
          </span>
          <span className="hidden text-[10px] text-primary-foreground/70 sm:block">
            {config?.tagline}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                location.pathname === link.href
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {alertCount > 0 && (
            <Link
              to="/issues"
              className="flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground transition-colors duration-150 hover:bg-destructive/90"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {alertCount} Alerts
            </Link>
          )}
          <Link
            to="/about"
            className="hidden text-sm font-medium text-primary-foreground/80 transition-colors duration-150 hover:text-primary-foreground lg:block"
          >
            About
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-primary-foreground lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-primary-foreground/10 bg-primary lg:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                  location.pathname === link.href
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10"
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
