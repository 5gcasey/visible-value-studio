import { useState } from "react";
import { useAdminSubscribers, useTableMutation } from "@/hooks/use-admin-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Download } from "lucide-react";
import { format } from "date-fns";

export default function AdminSubscribersPage() {
  const { data: subscribers, isLoading } = useAdminSubscribers();
  const mutation = useTableMutation("subscribers", [["admin_subscribers"]]);
  const [editing, setEditing] = useState<any>(null);

  const stats = {
    total: subscribers?.length ?? 0,
    emailOnly: subscribers?.filter((s) => s.subscribed_email && !s.subscribed_sms).length ?? 0,
    sms: subscribers?.filter((s) => s.subscribed_sms).length ?? 0,
    free: subscribers?.filter((s) => s.tier === "free").length ?? 0,
    premium: subscribers?.filter((s) => s.tier === "premium").length ?? 0,
  };

  const exportCsv = () => {
    if (!subscribers?.length) return;
    const headers = ["Name", "Email", "Phone", "Email Sub", "SMS Sub", "Tier", "Joined"];
    const rows = subscribers.map((s) => [s.first_name, s.email, s.phone, s.subscribed_email, s.subscribed_sms, s.tier, s.created_at]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subscribers.csv"; a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Subscribers</h2>
        <Button variant="outline" onClick={exportCsv}><Download className="mr-1.5 h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-5">
        {[
          { label: "Total", value: stats.total },
          { label: "Email Only", value: stats.emailOnly },
          { label: "SMS Enabled", value: stats.sms },
          { label: "Free Tier", value: stats.free },
          { label: "Premium Tier", value: stats.premium },
        ].map((s) => (
          <Card key={s.label}><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></CardContent></Card>
        ))}
      </div>

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Subscriber</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tier</Label>
                <Select value={editing.tier ?? "free"} onValueChange={(v) => setEditing((p: any) => ({ ...p, tier: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={() => { mutation.update.mutate({ id: editing.id, tier: editing.tier } as any); setEditing(null); }}>Save</Button>
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SMS</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="text-center">Loading…</TableCell></TableRow>
              ) : subscribers?.map((s) => (
                <TableRow key={s.id} className="even:bg-muted/30">
                  <TableCell>{s.first_name ?? "—"}</TableCell>
                  <TableCell className="text-sm">{s.email}</TableCell>
                  <TableCell className="text-sm">{s.phone ?? "—"}</TableCell>
                  <TableCell>{s.subscribed_email ? <Badge className="bg-success text-success-foreground text-xs">Yes</Badge> : <Badge variant="secondary" className="text-xs">No</Badge>}</TableCell>
                  <TableCell>{s.subscribed_sms ? <Badge className="bg-success text-success-foreground text-xs">Yes</Badge> : <Badge variant="secondary" className="text-xs">No</Badge>}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{s.tier}</Badge></TableCell>
                  <TableCell className="text-xs">{s.created_at ? format(new Date(s.created_at), "MMM d, yyyy") : "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing({ ...s })}><Pencil className="h-3.5 w-3.5" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Remove subscriber?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => mutation.remove.mutate(s.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
