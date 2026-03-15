import { cn } from "@/lib/utils";

const priorityConfig = {
  critical: { label: "Critical", className: "bg-priority-critical text-destructive-foreground" },
  high: { label: "High", className: "bg-priority-high text-warning-foreground" },
  medium: { label: "Medium", className: "bg-priority-medium text-accent-foreground" },
  low: { label: "Low", className: "bg-priority-low text-success-foreground" },
};

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", config.className, className)}>
      {config.label}
    </span>
  );
}
