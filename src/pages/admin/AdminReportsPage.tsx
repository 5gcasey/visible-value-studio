import { useState } from "react";
import { useAdminWeeklyReports, useTableMutation } from "@/hooks/use-admin-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Pencil, Play } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminReportsPage() {
  const { data: reports, isLoading } = useAdminWeeklyReports();
  const mutation = useTableMutation("weekly_reports", [["admin_weekly_reports"], ["weekly_reports"]]);
  const [viewing, setViewing] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();
  const [running, setRunning] = useState<string | null>(null);

  const runFunction = async (name: string) => {
    setRunning(name);
    try {
      const { error } = await supabase.functions.invoke(name);
      if (error) throw error;
      toast({ title: `${name} completed successfully` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setRunning(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Weekly Reports</h2>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Manual Controls</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            { label: "Run Weekly Digest", fn: "run_weekly_digest" },
            { label: "Run Deep Dive", fn: "run_deep_dive" },
            { label: "Run Meetings Monitor", fn: "run_meetings_monitor" },
          ].map((item) => (
            <Button key={item.fn} variant="outline" disabled={running === item.fn} onClick={() => runFunction(item.fn)}>
              <Play className="mr-1.5 h-3.5 w-3.5" />
              {running === item.fn ? "Running…" : item.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      {viewing && (
        <Dialog open onOpenChange={() => setViewing(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{viewing.headline}</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">Week ending {viewing.week_ending}</p>
            <div className="mt-4 whitespace-pre-wrap text-sm">{viewing.full_content ?? "No content available."}</div>
          </DialogContent>
        </Dialog>
      )}

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Edit Report</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Headline</Label><Input value={editing.headline} onChange={(e) => setEditing((p: any) => ({ ...p, headline: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Full Content</Label><Textarea rows={12} value={editing.full_content ?? ""} onChange={(e) => setEditing((p: any) => ({ ...p, full_content: e.target.value }))} /></div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={() => { mutation.update.mutate({ id: editing.id, headline: editing.headline, full_content: editing.full_content } as any); setEditing(null); }}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week Ending</TableHead>
                <TableHead>Headline</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center">Loading…</TableCell></TableRow>
              ) : reports?.map((r) => (
                <TableRow key={r.id} className="even:bg-muted/30">
                  <TableCell className="text-sm">{r.week_ending}</TableCell>
                  <TableCell className="font-medium">{r.headline}</TableCell>
                  <TableCell className="text-xs">{r.published_at ? format(new Date(r.published_at), "MMM d, h:mm a") : "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setViewing(r)}><Eye className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing({ ...r })}><Pencil className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
