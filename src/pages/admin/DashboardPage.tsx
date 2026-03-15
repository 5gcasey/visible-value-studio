import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminAlerts, useAdminSystemLog, useAdminSubscribers } from "@/hooks/use-admin-data";
import { useIssues, useDevelopers, useHighPriorityFlags } from "@/hooks/use-data";
import { useTableMutation } from "@/hooks/use-admin-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";

const systemTasks = [
  { name: "Daily Meetings Monitor", schedule: "Daily 3:00 AM" },
  { name: "Weekly Deep Dive", schedule: "Sunday 1:00 AM" },
  { name: "Weekly Digest", schedule: "Sunday 9:00 AM" },
  { name: "GRAMA Assistant", schedule: "Manual" },
];

export default function AdminDashboard() {
  const { data: alerts } = useHighPriorityFlags();
  const { data: issues } = useIssues();
  const { data: developers } = useDevelopers();
  const { data: subscribers } = useAdminSubscribers();
  const { data: systemLog, refetch: refetchLog } = useAdminSystemLog();
  const alertMutation = useTableMutation("high_priority_flags", [["admin_alerts"], ["high_priority_flags"]]);

  const unresolvedAlerts = alerts?.filter((a) => !a.resolved) ?? [];
  const flaggedDevs = developers?.filter((d) => (d.appearance_count ?? 0) >= 3) ?? [];

  const getTaskStatus = (taskName: string) => {
    const entry = systemLog?.find((l) => l.task_name === taskName);
    return entry;
  };

  return (
    <div className="space-y-6">
      {/* System Health */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">System Health</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {systemTasks.map((task) => {
            const entry = getTaskStatus(task.name);
            const status = entry?.status ?? "unknown";
            return (
              <Card key={task.name}>
                <CardContent className="p-4">
                  <p className="text-sm font-medium">{task.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{task.schedule}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    {status === "success" && <CheckCircle className="h-4 w-4 text-success" />}
                    {status === "warning" && <AlertTriangle className="h-4 w-4 text-warning" />}
                    {status === "error" && <XCircle className="h-4 w-4 text-destructive" />}
                    {status === "unknown" && <span className="h-4 w-4 rounded-full bg-muted" />}
                    <span className="text-xs capitalize">{status}</span>
                  </div>
                  {entry?.run_at && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Last: {format(new Date(entry.run_at), "MMM d, h:mm a")}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Row */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">This Week at a Glance</h2>
        <div className="grid gap-4 sm:grid-cols-5">
          {[
            { label: "Issues Logged", value: issues?.length ?? 0 },
            { label: "Developers Flagged", value: flaggedDevs.length },
            { label: "Unresolved Alerts", value: unresolvedAlerts.length },
            { label: "New Subscribers", value: subscribers?.length ?? 0 },
            { label: "Total Subscribers", value: subscribers?.length ?? 0 },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Unresolved Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Unresolved Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {unresolvedAlerts.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">✓ No unresolved alerts</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Flagged</TableHead>
                  <TableHead className="w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unresolvedAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell><Badge variant="outline">{alert.category}</Badge></TableCell>
                    <TableCell className="max-w-xs truncate">{alert.summary}</TableCell>
                    <TableCell className="text-xs">{alert.flagged_at ? format(new Date(alert.flagged_at), "MMM d") : "—"}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alertMutation.update.mutate({ id: alert.id, resolved: true, resolved_at: new Date().toISOString() } as any)}
                      >
                        Resolve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent Database Activity</CardTitle>
          <Button size="sm" variant="ghost" onClick={() => refetchLog()}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {!systemLog?.length ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systemLog.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs">{log.run_at ? format(new Date(log.run_at), "MMM d, h:mm a") : "—"}</TableCell>
                    <TableCell className="text-sm">{log.task_name}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === "success" ? "default" : "destructive"} className="text-xs">
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-xs text-muted-foreground">{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
