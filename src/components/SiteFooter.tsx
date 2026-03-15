import { Link } from "react-router-dom";
import { useCityConfig } from "@/hooks/use-data";

export function SiteFooter() {
  const { data: config } = useCityConfig();

  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">{config?.display_name}</h3>
            <p className="mt-1 text-sm text-primary-foreground/70">{config?.tagline}</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/meetings" className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">Meetings</Link>
            <Link to="/officials" className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">Officials</Link>
            <Link to="/issues" className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">Issues</Link>
            <Link to="/developers" className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">Developers</Link>
            <Link to="/reports" className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">Reports</Link>
            <Link to="/community" className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">Community</Link>
            <Link to="/about" className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">About</Link>
            <Link to="/subscribe" className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">Subscribe</Link>
          </nav>
          <div className="text-sm text-primary-foreground/70">
            <p>
              Part of{" "}
              <a href={`https://${config?.state_domain}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-foreground">
                {config?.state_display_name}
              </a>
            </p>
            <p className="mt-1">
              Powered by{" "}
              <a href="https://opencities.us" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-foreground">
                Open Cities
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-foreground/10 pt-6 text-xs text-primary-foreground/50">
          {config?.display_name} is an independent civic monitoring platform, not affiliated with {config?.city_name} City Government.
          Part of {config?.state_display_name} ({config?.state_domain}) | Powered by Open Cities (opencities.us)
        </div>
      </div>
    </footer>
  );
}
