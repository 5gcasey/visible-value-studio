import { useState } from "react";
import { useAdminIssues, useTableMutation } from "@/hooks/use-admin-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Pencil, Trash2, CheckCircle } from "lucide-react";
import { format } from "date-fns";

function IssueForm({ initial, onSubmit, onCancel }: { initial?: any; onSubmit: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    summary: initial?.summary ?? "",
    what_is_issue: initial?.what_is_issue ?? "",
    legally_current: initial?.legally_current ?? "",
    financial_impact: initial?.financial_impact ?? "",
    who_benefits: initial?.who_benefits ?? "",
    who_harmed: initial?.who_harmed ?? "",
    priority: initial?.priority ?? "medium",
    category: initial?.category ?? "",
    status: initial?.status ?? "open",
    source_url: initial?.source_url ?? "",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="max-h-[70vh] space-y-4 overflow-y-auto">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2"><Label>Title</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
        <div className="space-y-2 sm:col-span-2"><Label>Summary</Label><Textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} /></div>
      </div>
      {["what_is_issue", "legally_current", "financial_impact", "who_benefits", "who_harmed"].map((f) => (
        <div key={f} className="space-y-2">
          <Label>{f.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}?</Label>
          <Textarea rows={2} value={(form as any)[f]} onChange={(e) => set(f, e.target.value)} />
        </div>
      ))}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["critical", "high", "medium", "low"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => set("category", e.target.value)} /></div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["open", "monitoring", "resolved"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2"><Label>Source URL</Label><Input value={form.source_url} onChange={(e) => set("source_url", e.target.value)} /></div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit(form)}>Save</Button>
      </div>
    </div>
  );
}

export default function AdminIssuesPage() {
  const { data: issues, isLoading } = useAdminIssues();
  const mutation = useTableMutation("issues", [["admin_issues"], ["issues"]]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Issues</h2>
        <Button onClick={() => setShowAdd(true)}><Plus className="mr-1.5 h-4 w-4" /> Add Issue</Button>
      </div>

      {showAdd && (
        <Card><CardContent className="pt-6">
          <IssueForm onSubmit={(d) => { mutation.insert.mutate(d); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />
        </CardContent></Card>
      )}

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Issue</DialogTitle></DialogHeader>
            <IssueForm initial={editing} onSubmit={(d) => { mutation.update.mutate({ id: editing.id, ...d }); setEditing(null); }} onCancel={() => setEditing(null)} />
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priority</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center">Loading…</TableCell></TableRow>
              ) : issues?.map((issue) => (
                <TableRow key={issue.id} className="even:bg-muted/30">
                  <TableCell><PriorityBadge priority={issue.priority ?? "medium"} /></TableCell>
                  <TableCell className="max-w-xs font-medium">{issue.title}</TableCell>
                  <TableCell className="text-sm">{issue.category}</TableCell>
                  <TableCell><StatusBadge status={issue.status ?? "open"} /></TableCell>
                  <TableCell className="text-xs">{issue.created_at ? format(new Date(issue.created_at), "MMM d") : "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(issue)}><Pencil className="h-3.5 w-3.5" /></Button>
                      {issue.status !== "resolved" && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-success" onClick={() => mutation.update.mutate({ id: issue.id, status: "resolved" } as any)}>
                          <CheckCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete issue?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => mutation.remove.mutate(issue.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
