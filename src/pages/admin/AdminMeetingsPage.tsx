import { useState } from "react";
import { useAdminMeetings, useAdminMeetingItems, useTableMutation } from "@/hooks/use-admin-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Pencil, Trash2, ChevronDown, ExternalLink } from "lucide-react";
import { format } from "date-fns";

function MeetingForm({ initial, onSubmit, onCancel }: { initial?: any; onSubmit: (data: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    meeting_date: initial?.meeting_date ? new Date(initial.meeting_date).toISOString().slice(0, 16) : "",
    location: initial?.location ?? "",
    meeting_type: initial?.meeting_type ?? "regular",
    status: initial?.status ?? "scheduled",
    body: initial?.body ?? "",
    agenda_url: initial?.agenda_url ?? "",
    minutes_url: initial?.minutes_url ?? "",
    packet_url: initial?.packet_url ?? "",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
        <div className="space-y-2"><Label>Date/Time</Label><Input type="datetime-local" value={form.meeting_date} onChange={(e) => set("meeting_date", e.target.value)} /></div>
        <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={form.meeting_type} onValueChange={(v) => set("meeting_type", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["regular", "special", "work_session", "public_hearing"].map((t) => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["scheduled", "completed", "cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2"><Label>Notes</Label><Textarea value={form.body} onChange={(e) => set("body", e.target.value)} /></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2"><Label>Agenda URL</Label><Input value={form.agenda_url} onChange={(e) => set("agenda_url", e.target.value)} /></div>
        <div className="space-y-2"><Label>Minutes URL</Label><Input value={form.minutes_url} onChange={(e) => set("minutes_url", e.target.value)} /></div>
        <div className="space-y-2"><Label>Packet URL</Label><Input value={form.packet_url} onChange={(e) => set("packet_url", e.target.value)} /></div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit({ ...form, meeting_date: form.meeting_date ? new Date(form.meeting_date).toISOString() : null })}>Save</Button>
      </div>
    </div>
  );
}

function AgendaItemForm({ meetingId, initial, onSubmit, onCancel }: { meetingId: string; initial?: any; onSubmit: (data: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    item_title: initial?.item_title ?? "",
    description: initial?.description ?? "",
    what_is_issue: initial?.what_is_issue ?? "",
    legally_current: initial?.legally_current ?? "",
    financial_impact: initial?.financial_impact ?? "",
    who_benefits: initial?.who_benefits ?? "",
    who_harmed: initial?.who_harmed ?? "",
    priority: initial?.priority ?? "medium",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="space-y-2"><Label>Item Title</Label><Input value={form.item_title} onChange={(e) => set("item_title", e.target.value)} /></div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
      {["what_is_issue", "legally_current", "financial_impact", "who_benefits", "who_harmed"].map((field) => (
        <div key={field} className="space-y-2">
          <Label>{field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}?</Label>
          <Textarea rows={2} value={(form as any)[field]} onChange={(e) => set(field, e.target.value)} />
        </div>
      ))}
      <div className="space-y-2">
        <Label>Priority</Label>
        <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {["critical", "high", "medium", "low"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit({ ...form, meeting_id: meetingId })}>Save Item</Button>
      </div>
    </div>
  );
}

function MeetingAgendaItems({ meetingId }: { meetingId: string }) {
  const { data: items } = useAdminMeetingItems(meetingId);
  const itemMutation = useTableMutation("meeting_items", [["admin_meeting_items", meetingId]]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  return (
    <div className="space-y-2 border-t bg-muted/20 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Agenda Items</h4>
        <Button size="sm" variant="outline" onClick={() => setShowForm(true)}><Plus className="mr-1 h-3 w-3" /> Add Item</Button>
      </div>
      {showForm && (
        <AgendaItemForm meetingId={meetingId} onSubmit={(d) => { itemMutation.insert.mutate(d); setShowForm(false); }} onCancel={() => setShowForm(false)} />
      )}
      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Agenda Item</DialogTitle></DialogHeader>
            <AgendaItemForm meetingId={meetingId} initial={editing} onSubmit={(d) => { itemMutation.update.mutate({ id: editing.id, ...d }); setEditing(null); }} onCancel={() => setEditing(null)} />
          </DialogContent>
        </Dialog>
      )}
      {items?.map((item) => (
        <div key={item.id} className="flex items-start justify-between rounded border bg-background p-3">
          <div>
            <p className="text-sm font-medium">{item.item_title}</p>
            {item.description && <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>}
            <Badge variant="outline" className="mt-1 text-xs">{item.priority}</Badge>
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(item)}><Pencil className="h-3.5 w-3.5" /></Button>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Delete item?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => itemMutation.remove.mutate(item.id)}>Delete</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
      {(!items || items.length === 0) && !showForm && <p className="text-xs text-muted-foreground">No agenda items</p>}
    </div>
  );
}

export default function AdminMeetingsPage() {
  const { data: meetings, isLoading } = useAdminMeetings();
  const mutation = useTableMutation("meetings", [["admin_meetings"], ["meetings"]]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Meetings</h2>
        <Button onClick={() => setShowAdd(true)}><Plus className="mr-1.5 h-4 w-4" /> Add Meeting</Button>
      </div>

      {showAdd && (
        <Card><CardContent className="pt-6">
          <MeetingForm onSubmit={(d) => { mutation.insert.mutate(d); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />
        </CardContent></Card>
      )}

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Meeting</DialogTitle></DialogHeader>
            <MeetingForm initial={editing} onSubmit={(d) => { mutation.update.mutate({ id: editing.id, ...d }); setEditing(null); }} onCancel={() => setEditing(null)} />
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Links</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center">Loading…</TableCell></TableRow>
              ) : meetings?.map((m) => (
                <Collapsible key={m.id} open={expanded === m.id} onOpenChange={() => setExpanded(expanded === m.id ? null : m.id)} asChild>
                  <>
                    <TableRow className="even:bg-muted/30">
                      <TableCell className="text-xs">{m.meeting_date ? format(new Date(m.meeting_date), "MMM d, yyyy") : "—"}</TableCell>
                      <TableCell className="font-medium">
                        <CollapsibleTrigger className="flex items-center gap-1 text-left">
                          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded === m.id ? "rotate-180" : ""}`} />
                          {m.title}
                        </CollapsibleTrigger>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{m.meeting_type}</Badge></TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{m.status}</Badge></TableCell>
                      <TableCell className="flex gap-1">
                        {m.agenda_url && <a href={m.agenda_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /></a>}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(m)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Delete meeting?</AlertDialogTitle><AlertDialogDescription>This will also delete all agenda items.</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => mutation.remove.mutate(m.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <tr><td colSpan={6} className="p-0"><MeetingAgendaItems meetingId={m.id} /></td></tr>
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
