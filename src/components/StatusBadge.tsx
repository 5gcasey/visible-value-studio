import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-destructive/10 text-destructive border border-destructive/20" },
  monitoring: { label: "Monitoring", className: "bg-accent/10 text-accent-foreground border border-accent/20" },
  resolved: { label: "Resolved", className: "bg-success/10 text-success border border-success/20" },
  scheduled: { label: "Scheduled", className: "bg-primary/10 text-primary border border-primary/20" },
  completed: { label: "Completed", className: "bg-success/10 text-success border border-success/20" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground border border-border" },
  active: { label: "Active", className: "bg-primary/10 text-primary border border-primary/20" },
  approved: { label: "Approved", className: "bg-success/10 text-success border border-success/20" },
  denied: { label: "Denied", className: "bg-destructive/10 text-destructive border border-destructive/20" },
  on_hold: { label: "On Hold", className: "bg-accent/10 text-accent-foreground border border-accent/20" },
  withdrawn: { label: "Withdrawn", className: "bg-muted text-muted-foreground border border-border" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground border border-border" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", config.className, className)}>
      {config.label}
    </span>
  );
}
