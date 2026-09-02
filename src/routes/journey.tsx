import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/raven/SiteHeader";
import { JourneyMap } from "@/components/raven/JourneyMap";
import { journey, placeById, statFor } from "@/lib/raven-data";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Kochi → Munnar — What women who travelled this route want you to know | Raven" },
      {
        name: "description",
        content:
          "A journey-aware view of the Kochi to Munnar route: community-recommended stops, recent experiences from women travellers, and caution notes.",
      },
      { property: "og:title", content: "Kochi → Munnar — Raven journey" },
      {
        property: "og:description",
        content:
          "Community-recommended stops, recent experiences and caution notes along the Kochi to Munnar route.",
      },
    ],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <p className="rule-label">Journey</p>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <h1 className="font-display text-5xl leading-tight sm:text-6xl">
              Kochi <span className="text-muted-foreground">→</span> Munnar
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {journey.distance} · {journey.typical} · 4 stops with recent reports
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-6 text-sm sm:gap-10">
            <div>
              <dt className="rule-label">Stops</dt>
              <dd className="font-display mt-1 text-3xl">{journey.summary.stops}</dd>
            </div>
            <div>
              <dt className="rule-label">Experiences</dt>
              <dd className="font-display mt-1 text-3xl">{journey.summary.experiences}</dd>
            </div>
            <div>
              <dt className="rule-label">Caution notes</dt>
              <dd className="font-display mt-1 text-3xl text-caution">{journey.summary.cautions}</dd>
            </div>
          </dl>
        </div>

        <section className="mt-10">
          <JourneyMap />
        </section>

        <section className="mt-16 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl leading-snug">
              What women who travelled this route want you to know
            </h2>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
              Everything below comes from women who travelled Kochi → Munnar in the last few weeks.
              Recency is shown on every stop, because a report from two days ago tells you more than
              one from last winter.
            </p>
            <ul className="mt-8 space-y-4">
              {journey.cautionNotes.map((n) => (
                <li key={n.place} className="border-l-2 border-caution pl-4">
                  <p className="text-[0.95rem] leading-relaxed text-foreground">{n.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {n.place} · reported {n.date}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="rule-label">Stops along your route</p>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {journey.stops.map((s) => {
                const place = placeById(s.placeId)!;
                const stat = statFor(s.placeId);
                return (
                  <li key={s.placeId}>
                    <Link
                      to="/place/$placeId"
                      params={{ placeId: s.placeId }}
                      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-5 transition-colors hover:bg-secondary/60"
                    >
                      <img
                        src={place.image}
                        alt={place.name}
                        loading="lazy"
                        width={1408}
                        height={1008}
                        className="h-16 w-20 shrink-0 rounded-sm border border-border object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-base text-foreground">{place.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {stat.count} recent experiences · last reported {stat.lastReported}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm text-muted-foreground">{s.note}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Been on this route?{" "}
              <Link to="/contribute" search={{}} className="text-foreground underline underline-offset-4">
                Tell other women what you experienced.
              </Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
