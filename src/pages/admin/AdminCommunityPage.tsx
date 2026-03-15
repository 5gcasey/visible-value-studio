import { useState } from "react";
import { useAdminCommunityPosts, useTableMutation } from "@/hooks/use-admin-data";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminCommunityPage() {
  const { data: posts, isLoading } = useAdminCommunityPosts();
  const mutation = useTableMutation("community_posts", [["admin_community_posts"], ["community_posts"]]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ group_name: "", theme: "", summary: "", source_url: "", city_response: "no" });

  const resetForm = () => setForm({ group_name: "", theme: "", summary: "", source_url: "", city_response: "no" });

  const FormFields = ({ data, setData }: { data: any; setData: (d: any) => void }) => (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Group Name</Label><Input value={data.group_name} onChange={(e) => setData({ ...data, group_name: e.target.value })} /></div>
        <div className="space-y-2"><Label>Theme</Label><Input value={data.theme} onChange={(e) => setData({ ...data, theme: e.target.value })} /></div>
        <div className="space-y-2"><Label>Source URL</Label><Input value={data.source_url} onChange={(e) => setData({ ...data, source_url: e.target.value })} /></div>
        <div className="space-y-2">
          <Label>City Response</Label>
          <Select value={data.city_response} onValueChange={(v) => setData({ ...data, city_response: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2"><Label>Summary</Label><Textarea value={data.summary} onChange={(e) => setData({ ...data, summary: e.target.value })} /></div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Community Posts</h2>
        <Button onClick={() => setShowAdd(true)}><Plus className="mr-1.5 h-4 w-4" /> Add Manually</Button>
      </div>

      {showAdd && (
        <Card><CardContent className="space-y-4 pt-6">
          <FormFields data={form} setData={setForm} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowAdd(false); resetForm(); }}>Cancel</Button>
            <Button onClick={() => { mutation.insert.mutate(form as any); setShowAdd(false); resetForm(); }}>Save</Button>
          </div>
        </CardContent></Card>
      )}

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent><DialogHeader><DialogTitle>Edit Post</DialogTitle></DialogHeader>
            <FormFields data={editing} setData={setEditing} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={() => { mutation.update.mutate({ id: editing.id, ...editing }); setEditing(null); }}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>City Response</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center">Loading…</TableCell></TableRow>
              ) : posts?.map((p) => (
                <TableRow key={p.id} className="even:bg-muted/30">
                  <TableCell className="font-medium">{p.group_name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{p.theme}</Badge></TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{p.summary}</TableCell>
                  <TableCell>
                    <Badge variant={p.city_response === "yes" ? "default" : p.city_response === "partial" ? "secondary" : "outline"} className="text-xs">
                      {p.city_response}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{p.created_at ? format(new Date(p.created_at), "MMM d") : "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing({ ...p })}><Pencil className="h-3.5 w-3.5" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete post?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => mutation.remove.mutate(p.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
