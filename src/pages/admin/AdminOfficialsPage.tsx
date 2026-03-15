import { useState } from "react";
import { useAdminOfficials, useAdminOfficialStatements, useTableMutation } from "@/hooks/use-admin-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Pencil, Trash2, ChevronDown, ExternalLink, MessageSquare } from "lucide-react";
import { format } from "date-fns";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function OfficialForm({ initial, onSubmit, onCancel }: { initial?: any; onSubmit: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    role: initial?.role ?? "",
    department: initial?.department ?? "",
    bio: initial?.bio ?? "",
    photo_url: initial?.photo_url ?? "",
    contact_email: initial?.contact_email ?? "",
    status: initial?.status ?? "active",
  });
  const set = (k: string, v: string) => {
    setForm((p) => ({
      ...p,
      [k]: v,
      ...(k === "name" && !initial ? { slug: slugify(v) } : {}),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} /></div>
        <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
        <div className="space-y-2"><Label>Role</Label><Input value={form.role} onChange={(e) => set("role", e.target.value)} /></div>
        <div className="space-y-2"><Label>Department</Label><Input value={form.department} onChange={(e) => set("department", e.target.value)} /></div>
        <div className="space-y-2"><Label>Email</Label><Input value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} /></div>
        <div className="space-y-2"><Label>Photo URL</Label><Input value={form.photo_url} onChange={(e) => set("photo_url", e.target.value)} /></div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2"><Label>Bio</Label><Textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} /></div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit(form)}>Save</Button>
      </div>
    </div>
  );
}

function StatementsList({ officialId }: { officialId: string }) {
  const { data: statements } = useAdminOfficialStatements(officialId);
  const mutation = useTableMutation("official_statements", [["admin_official_statements", officialId]]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ content: "", platform: "public_meeting", statement_date: "", url: "" });

  return (
    <div className="space-y-2 border-t bg-muted/20 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Statements</h4>
        <Button size="sm" variant="outline" onClick={() => setShowForm(true)}><Plus className="mr-1 h-3 w-3" /> Add Statement</Button>
      </div>
      {showForm && (
        <div className="space-y-3 rounded border bg-background p-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1"><Label className="text-xs">Date</Label><Input type="date" value={form.statement_date} onChange={(e) => setForm((p) => ({ ...p, statement_date: e.target.value }))} /></div>
            <div className="space-y-1">
              <Label className="text-xs">Platform</Label>
              <Select value={form.platform} onValueChange={(v) => setForm((p) => ({ ...p, platform: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["public_meeting", "social_media", "news", "email", "other"].map((p) => <SelectItem key={p} value={p}>{p.replace(/_/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs">URL</Label><Input value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} /></div>
          </div>
          <div className="space-y-1"><Label className="text-xs">Content</Label><Textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} /></div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { mutation.insert.mutate({ ...form, official_id: officialId } as any); setShowForm(false); setForm({ content: "", platform: "public_meeting", statement_date: "", url: "" }); }}>Save</Button>
          </div>
        </div>
      )}
      {statements?.map((s) => (
        <div key={s.id} className="flex items-start justify-between rounded border bg-background p-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{s.platform}</Badge>
              <span className="text-xs text-muted-foreground">{s.statement_date ? format(new Date(s.statement_date), "MMM d, yyyy") : ""}</span>
            </div>
            <p className="mt-1 text-sm">{s.content}</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Delete statement?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => mutation.remove.mutate(s.id)}>Delete</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
      {(!statements || statements.length === 0) && !showForm && <p className="text-xs text-muted-foreground">No statements</p>}
    </div>
  );
}

export default function AdminOfficialsPage() {
  const { data: officials, isLoading } = useAdminOfficials();
  const mutation = useTableMutation("officials", [["admin_officials"], ["officials"]]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Officials</h2>
        <Button onClick={() => setShowAdd(true)}><Plus className="mr-1.5 h-4 w-4" /> Add Official</Button>
      </div>

      {showAdd && (
        <Card><CardContent className="pt-6">
          <OfficialForm onSubmit={(d) => { mutation.insert.mutate(d); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />
        </CardContent></Card>
      )}

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Official</DialogTitle></DialogHeader>
            <OfficialForm initial={editing} onSubmit={(d) => { mutation.update.mutate({ id: editing.id, ...d }); setEditing(null); }} onCancel={() => setEditing(null)} />
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center">Loading…</TableCell></TableRow>
              ) : officials?.map((o) => (
                <Collapsible key={o.id} open={expanded === o.id} onOpenChange={() => setExpanded(expanded === o.id ? null : o.id)} asChild>
                  <>
                    <TableRow className="even:bg-muted/30">
                      <TableCell className="font-medium">
                        <CollapsibleTrigger className="flex items-center gap-1">
                          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded === o.id ? "rotate-180" : ""}`} />
                          {o.name}
                        </CollapsibleTrigger>
                      </TableCell>
                      <TableCell>{o.title}</TableCell>
                      <TableCell>{o.department}</TableCell>
                      <TableCell>{o.role}</TableCell>
                      <TableCell><Badge variant={o.status === "active" ? "default" : "secondary"} className="text-xs">{o.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(o)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <a href={`/officials/${o.slug}`} target="_blank" rel="noopener noreferrer"><Button size="icon" variant="ghost" className="h-7 w-7"><ExternalLink className="h-3.5 w-3.5" /></Button></a>
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Delete official?</AlertDialogTitle><AlertDialogDescription>This will not delete their statements.</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => mutation.remove.mutate(o.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <tr><td colSpan={6} className="p-0"><StatementsList officialId={o.id} /></td></tr>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
