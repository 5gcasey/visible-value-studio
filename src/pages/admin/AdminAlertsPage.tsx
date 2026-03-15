import { useState } from "react";
import { useAdminAlerts, useTableMutation } from "@/hooks/use-admin-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function AdminAlertsPage() {
  const { data: alerts, isLoading } = useAdminAlerts();
  const mutation = useTableMutation("high_priority_flags", [["admin_alerts"], ["high_priority_flags"]]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("all");
  const [form, setForm] = useState({ category: "", summary: "", why_it_matters: "", source_url: "" });

  const filtered = alerts?.filter((a) => {
    if (filter === "unresolved") return !a.resolved;
    if (filter === "resolved") return a.resolved;
    return true;
  });

  const resetForm = () => setForm({ category: "", summary: "", why_it_matters: "", source_url: "" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">High Priority Alerts</h2>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Show All</SelectItem>
              <SelectItem value="unresolved">Unresolved Only</SelectItem>
              <SelectItem value="resolved">Resolved Only</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAdd(true)}><Plus className="mr-1.5 h-4 w-4" /> Add Alert</Button>
        </div>
      </div>

      {showAdd && (
        <Card><CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Source URL</Label><Input value={form.source_url} onChange={(e) => setForm((p) => ({ ...p, source_url: e.target.value }))} /></div>
          </div>
          <div className="space-y-2"><Label>Summary</Label><Textarea value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Why It Matters</Label><Textarea value={form.why_it_matters} onChange={(e) => setForm((p) => ({ ...p, why_it_matters: e.target.value }))} /></div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowAdd(false); resetForm(); }}>Cancel</Button>
            <Button onClick={() => { mutation.insert.mutate(form as any); setShowAdd(false); resetForm(); }}>Save</Button>
          </div>
        </CardContent></Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Why It Matters</TableHead>
                <TableHead>Flagged</TableHead>
                <TableHead>Resolved</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center">Loading…</TableCell></TableRow>
              ) : filtered?.map((a) => (
                <TableRow key={a.id} className="even:bg-muted/30">
                  <TableCell><Badge variant="outline">{a.category}</Badge></TableCell>
                  <TableCell className="max-w-xs">{a.summary}</TableCell>
                  <TableCell className="max-w-xs text-sm text-muted-foreground">{a.why_it_matters}</TableCell>
                  <TableCell className="text-xs">{a.flagged_at ? format(new Date(a.flagged_at), "MMM d") : "—"}</TableCell>
                  <TableCell>{a.resolved ? <Badge className="bg-success text-success-foreground text-xs">Resolved</Badge> : <Badge variant="destructive" className="text-xs">Open</Badge>}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {!a.resolved && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-success" onClick={() => mutation.update.mutate({ id: a.id, resolved: true, resolved_at: new Date().toISOString() } as any)}>
                          <CheckCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete alert?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => mutation.remove.mutate(a.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
