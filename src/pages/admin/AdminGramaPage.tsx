import { useState } from "react";
import { useAdminGrama, useTableMutation } from "@/hooks/use-admin-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, GripVertical } from "lucide-react";
import { differenceInDays, addBusinessDays, format } from "date-fns";

const GRAMA_TEMPLATE = `Pursuant to the Government Records Access and Management Act (GRAMA), Utah Code Ann. § 63G-2-101 et seq., I hereby request copies of the following records: [TOPIC]. I request that these records be provided in electronic format where available. If any portion of this request is denied, please provide a written explanation of the grounds for denial, the legal authority for the denial, and information about the appeals process. Please respond within 10 business days as required by GRAMA.`;

const STATUS_COLUMNS = ["drafted", "filed", "pending_response", "response_received", "appealed", "closed"] as const;
const STATUS_LABELS: Record<string, string> = {
  drafted: "Drafted",
  filed: "Filed",
  pending_response: "Pending Response",
  response_received: "Response Received",
  appealed: "Appealed",
  closed: "Closed",
};

function getDueBadge(dueDate: string | null) {
  if (!dueDate) return null;
  const days = differenceInDays(new Date(dueDate), new Date());
  if (days < 0) return <Badge variant="destructive" className="text-xs">Overdue</Badge>;
  if (days <= 3) return <Badge className="bg-warning text-warning-foreground text-xs">Due Soon</Badge>;
  return <Badge variant="outline" className="text-xs">Due {format(new Date(dueDate), "MMM d")}</Badge>;
}

export default function AdminGramaPage() {
  const { data: requests, isLoading } = useAdminGrama();
  const mutation = useTableMutation("grama_requests", [["admin_grama"]]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ topic: "", recipient: "", request_text: GRAMA_TEMPLATE, notes: "" });

  const resetForm = () => setForm({ topic: "", recipient: "", request_text: GRAMA_TEMPLATE, notes: "" });

  const markFiled = (req: any) => {
    const filedDate = new Date().toISOString().slice(0, 10);
    const dueDate = addBusinessDays(new Date(), 10).toISOString().slice(0, 10);
    mutation.update.mutate({ id: req.id, status: "filed", filed_date: filedDate, due_date: dueDate } as any);
  };

  const grouped = STATUS_COLUMNS.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    items: requests?.filter((r) => r.status === status) ?? [],
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">GRAMA Requests</h2>
        <Button onClick={() => setShowAdd(true)}><Plus className="mr-1.5 h-4 w-4" /> Draft New Request</Button>
      </div>

      {showAdd && (
        <Card><CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Topic</Label><Input value={form.topic} onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Recipient</Label><Input value={form.recipient} onChange={(e) => setForm((p) => ({ ...p, recipient: e.target.value }))} /></div>
          </div>
          <div className="space-y-2"><Label>Request Text</Label><Textarea rows={6} value={form.request_text} onChange={(e) => setForm((p) => ({ ...p, request_text: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} /></div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowAdd(false); resetForm(); }}>Cancel</Button>
            <Button onClick={() => { mutation.insert.mutate({ ...form, status: "drafted" } as any); setShowAdd(false); resetForm(); }}>Save Draft</Button>
          </div>
        </CardContent></Card>
      )}

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit GRAMA Request</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Topic</Label><Input value={editing.topic} onChange={(e) => setEditing((p: any) => ({ ...p, topic: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Recipient</Label><Input value={editing.recipient ?? ""} onChange={(e) => setEditing((p: any) => ({ ...p, recipient: e.target.value }))} /></div>
              </div>
              <div className="space-y-2"><Label>Request Text</Label><Textarea rows={6} value={editing.request_text ?? ""} onChange={(e) => setEditing((p: any) => ({ ...p, request_text: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Response</Label><Textarea value={editing.response_text ?? ""} onChange={(e) => setEditing((p: any) => ({ ...p, response_text: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Notes</Label><Textarea value={editing.notes ?? ""} onChange={(e) => setEditing((p: any) => ({ ...p, notes: e.target.value }))} /></div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={() => { const { id, ...rest } = editing; mutation.update.mutate({ id, ...rest }); setEditing(null); }}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Kanban Board */}
      <div className="grid gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {grouped.map((col) => (
          <div key={col.status} className="rounded-lg border bg-muted/30 p-3">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{col.label} ({col.items.length})</h3>
            <div className="space-y-2">
              {col.items.map((req) => (
                <Card key={req.id} className="cursor-pointer" onClick={() => setEditing({ ...req })}>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">{req.topic}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{req.recipient ?? "No recipient"}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      {req.filed_date && <span className="text-xs text-muted-foreground">Filed: {req.filed_date}</span>}
                      {getDueBadge(req.due_date)}
                    </div>
                    {req.status === "drafted" && (
                      <Button size="sm" variant="outline" className="mt-2 w-full text-xs" onClick={(e) => { e.stopPropagation(); markFiled(req); }}>
                        Mark as Filed
                      </Button>
                    )}
                    {req.status === "filed" && (
                      <Button size="sm" variant="outline" className="mt-2 w-full text-xs" onClick={(e) => { e.stopPropagation(); mutation.update.mutate({ id: req.id, status: "pending_response" } as any); }}>
                        Pending Response
                      </Button>
                    )}
                    {req.status === "pending_response" && (
                      <Button size="sm" variant="outline" className="mt-2 w-full text-xs" onClick={(e) => { e.stopPropagation(); mutation.update.mutate({ id: req.id, status: "response_received" } as any); }}>
                        Log Response
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
              {col.items.length === 0 && <p className="py-4 text-center text-xs text-muted-foreground">Empty</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
