import { useState } from "react";
import { useAdminDevelopers, useTableMutation } from "@/hooks/use-admin-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

function DevForm({ initial, onSubmit, onCancel }: { initial?: any; onSubmit: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    applicant_name: initial?.applicant_name ?? "",
    project_name: initial?.project_name ?? "",
    location: initial?.location ?? "",
    application_type: initial?.application_type ?? "",
    status: initial?.status ?? "active",
    source_url: initial?.source_url ?? "",
    notes: initial?.notes ?? "",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Applicant Name</Label><Input value={form.applicant_name} onChange={(e) => set("applicant_name", e.target.value)} /></div>
        <div className="space-y-2"><Label>Project Name</Label><Input value={form.project_name} onChange={(e) => set("project_name", e.target.value)} /></div>
        <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
        <div className="space-y-2"><Label>Application Type</Label><Input value={form.application_type} onChange={(e) => set("application_type", e.target.value)} /></div>
        <div className="space-y-2"><Label>Status</Label><Input value={form.status} onChange={(e) => set("status", e.target.value)} /></div>
        <div className="space-y-2"><Label>Source URL</Label><Input value={form.source_url} onChange={(e) => set("source_url", e.target.value)} /></div>
      </div>
      <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} /></div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit(form)}>Save</Button>
      </div>
    </div>
  );
}

export default function AdminDevelopersPage() {
  const { data: developers, isLoading } = useAdminDevelopers();
  const mutation = useTableMutation("developers", [["admin_developers"], ["developers"]]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Developer Tracker</h2>
        <Button onClick={() => setShowAdd(true)}><Plus className="mr-1.5 h-4 w-4" /> Add Developer Entry</Button>
      </div>

      {showAdd && (
        <Card><CardContent className="pt-6">
          <DevForm onSubmit={(d) => { mutation.insert.mutate(d); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />
        </CardContent></Card>
      )}

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Developer</DialogTitle></DialogHeader>
            <DevForm initial={editing} onSubmit={(d) => { mutation.update.mutate({ id: editing.id, ...d }); setEditing(null); }} onCancel={() => setEditing(null)} />
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Appearances</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center">Loading…</TableCell></TableRow>
              ) : developers?.map((d) => (
                <TableRow key={d.id} className="even:bg-muted/30">
                  <TableCell className="font-medium">{d.applicant_name}</TableCell>
                  <TableCell>{d.project_name}</TableCell>
                  <TableCell className="text-sm">{d.application_type}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{d.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {d.appearance_count}
                      {(d.appearance_count ?? 0) >= 3 && <AlertTriangle className="h-3.5 w-3.5 text-accent" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{d.updated_at ? format(new Date(d.updated_at), "MMM d, yyyy") : "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(d)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete developer entry?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => mutation.remove.mutate(d.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
