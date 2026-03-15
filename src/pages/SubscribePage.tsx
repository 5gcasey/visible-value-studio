import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { cityConfig } from "@/lib/mock-data";
import { Check } from "lucide-react";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [tier, setTier] = useState("free");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SiteLayout>
        <section className="py-20">
          <div className="container text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-foreground">You're Subscribed!</h1>
            <p className="mt-3 text-muted-foreground">
              You'll receive civic alerts for {cityConfig.city_name} at <strong>{email}</strong>.
            </p>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-primary py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-primary-foreground">Subscribe to {cityConfig.display_name}</h1>
          <p className="mt-2 text-primary-foreground/70">Stay informed about what's happening in {cityConfig.city_name}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-lg">
          {/* Tier Selection */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setTier("free")}
              className={`rounded-lg border-2 p-5 text-left transition-colors duration-150 ${tier === "free" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
            >
              <h3 className="font-bold text-foreground">Free</h3>
              <p className="mt-1 text-sm text-muted-foreground">Weekly Sunday digest delivered to your inbox.</p>
              <p className="mt-2 text-lg font-bold text-foreground">$0/month</p>
            </button>
            <button
              onClick={() => setTier("premium")}
              className={`rounded-lg border-2 p-5 text-left transition-colors duration-150 ${tier === "premium" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
            >
              <h3 className="font-bold text-foreground">Premium</h3>
              <p className="mt-1 text-sm text-muted-foreground">Daily alerts + SMS + early access to reports.</p>
              <p className="mt-2 text-lg font-bold text-foreground">$5/month</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-foreground">First Name</label>
              <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm" placeholder="Your first name" />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">Email *</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm" placeholder="your@email.com" />
            </div>
            {tier === "premium" && (
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground">Phone (for SMS alerts)</label>
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm" placeholder="(801) 555-1234" />
              </div>
            )}
            <button type="submit" className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/90">
              {tier === "free" ? "Subscribe Free" : "Start Premium — $5/month"}
            </button>
            <p className="text-center text-xs text-muted-foreground">Weekly digest + breaking alerts. No spam. Unsubscribe anytime.</p>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
