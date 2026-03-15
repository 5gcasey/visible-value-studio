import { SiteLayout } from "@/components/SiteLayout";
import { cityConfig } from "@/lib/mock-data";

export default function AboutPage() {
  return (
    <SiteLayout>
      <section className="bg-primary py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-primary-foreground">About {cityConfig.display_name}</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-3xl space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
            <p className="mt-3 leading-relaxed text-foreground">
              {cityConfig.display_name} is an independent, non-partisan civic monitoring platform that provides {cityConfig.city_name} residents with factual, sourced information about their local government. We believe that informed residents make stronger communities.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">What We Are Not</h2>
            <ul className="mt-3 space-y-2 text-foreground">
              <li className="flex items-start gap-2"><span className="mt-1 text-destructive">✗</span> We are not affiliated with {cityConfig.city_name} City Government.</li>
              <li className="flex items-start gap-2"><span className="mt-1 text-destructive">✗</span> We are not a news organization or editorial outlet.</li>
              <li className="flex items-start gap-2"><span className="mt-1 text-destructive">✗</span> We do not endorse candidates, parties, or positions.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Our Methodology</h2>
            <p className="mt-3 leading-relaxed text-foreground">
              We monitor publicly available government records, meeting agendas, minutes, social media posts, and community forums using a combination of automated monitoring and manual review. Every claim is linked to its primary source. If information is unavailable, we say so — we never fill gaps with assumptions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Core Principles</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { title: "Impartial", desc: "Report without favor to any person, party, or interest." },
                { title: "Truth Only", desc: "Report only what is factually documented and sourced." },
                { title: "No Opinions", desc: "Do not editorialize or characterize motives without evidence." },
                { title: "No Fabrication", desc: "If information is unavailable, say so. Never fill gaps." },
              ].map((p) => (
                <div key={p.title} className="rounded-lg border bg-section p-4">
                  <h3 className="font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">GRAMA & Public Records</h2>
            <p className="mt-3 leading-relaxed text-foreground">
              Utah's Government Records Access and Management Act (GRAMA) gives every resident the right to access public records. If you'd like to file your own records request, visit the{" "}
              <a href={cityConfig.city_website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline hover:text-primary/80">
                {cityConfig.city_name} City website
              </a>{" "}
              or contact the City Recorder's office. We also file GRAMA requests on behalf of the public interest and publish the results here.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Contact</h2>
            <p className="mt-3 text-foreground">
              Reach us at{" "}
              <a href={`mailto:${cityConfig.email_from}`} className="font-medium text-primary underline hover:text-primary/80">
                {cityConfig.email_from}
              </a>
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
