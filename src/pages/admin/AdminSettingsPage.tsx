import { useState } from "react";
import { useCityConfig } from "@/hooks/use-data";
import { useTableMutation } from "@/hooks/use-admin-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminSettingsPage() {
  const { data: config, isLoading } = useCityConfig();
  const mutation = useTableMutation("city_config", [["city_config"]]);
  const { toast } = useToast();
  const [form, setForm] = useState<any>(null);

  if (isLoading) return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  
  const currentForm = form ?? config ?? {};
  const set = (k: string, v: any) => setForm((p: any) => ({ ...(p ?? config), [k]: v }));

  const save = () => {
    if (!config?.id) return;
    mutation.update.mutate({ id: config.id, ...currentForm });
    setForm(null);
  };

  const testConnection = async () => {
    try {
      const { error } = await supabase.from("city_config").select("id").limit(1);
      if (error) throw error;
      toast({ title: "Connection successful ✓" });
    } catch {
      toast({ title: "Connection failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">City Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { key: "city_name", label: "City Name" },
              { key: "city_state", label: "State" },
              { key: "city_state_abbr", label: "State Abbr" },
              { key: "display_name", label: "Display Name" },
              { key: "tagline", label: "Tagline" },
              { key: "city_website", label: "City Website" },
              { key: "county", label: "County" },
              { key: "timezone", label: "Timezone" },
              { key: "subdomain", label: "Subdomain" },
              { key: "custom_domain", label: "Custom Domain" },
              { key: "email_from", label: "Email From" },
            ].map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                <Input value={currentForm[field.key] ?? ""} onChange={(e) => set(field.key, e.target.value)} />
              </div>
            ))}
            <div className="space-y-2">
              <Label>Population</Label>
              <Input type="number" value={currentForm.population ?? ""} onChange={(e) => set("population", parseInt(e.target.value) || null)} />
            </div>
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <Input type="color" value={currentForm.primary_color ?? "#1a2744"} onChange={(e) => set("primary_color", e.target.value)} className="h-10 w-14 p-1" />
                <Input value={currentForm.primary_color ?? ""} onChange={(e) => set("primary_color", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="flex gap-2">
                <Input type="color" value={currentForm.accent_color ?? "#f59e0b"} onChange={(e) => set("accent_color", e.target.value)} className="h-10 w-14 p-1" />
                <Input value={currentForm.accent_color ?? ""} onChange={(e) => set("accent_color", e.target.value)} />
              </div>
            </div>
          </div>
          <Button onClick={save}>Save City Config</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Alert Thresholds</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Spending Threshold ($)</Label>
              <Input type="number" value={currentForm.alert_spending_threshold ?? 500000} onChange={(e) => set("alert_spending_threshold", parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Repeat Developer Threshold</Label>
              <Input type="number" value={currentForm.repeat_applicant_threshold ?? 3} onChange={(e) => set("repeat_applicant_threshold", parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <Button onClick={save}>Save Thresholds</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Integrations</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Slack Channel ID</Label>
              <Input value={currentForm.slack_channel_id ?? ""} onChange={(e) => set("slack_channel_id", e.target.value)} />
            </div>
          </div>
          <Button variant="outline" onClick={testConnection}>Test Database Connection</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Platform Info</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Platform: Open Cities v1.0</p>
            <p>Deployment: {currentForm.city_name}, {currentForm.city_state}</p>
            <p>Part of Open Cities (opencities.us)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
