import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/raven/SiteHeader";
import { LeafletJourneyMap } from "@/components/raven/LeafletJourneyMap";
import { fetchPlaces, placeById } from "@/lib/places-store";
import { fetchRoutes, findRoute, type JourneyRoute } from "@/lib/routes-store";
import { useExperiences, getStopStats, getSessionIds, getJourneySummary } from "@/lib/experience-store";

export const Route = createFileRoute("/journey")({
  validateSearch: (search: Record<string, unknown>): { from?: string; to?: string } => {
    const res: { from?: string; to?: string } = {};
    if (typeof search["from"] === "string") res.from = search["from"];
    if (typeof search["to"] === "string") res.to = search["to"];
    return res;
  },
  loader: async () => {
    await fetchPlaces();
    await fetchRoutes();
  },
  head: () => ({
    meta: [
      { title: "Plan a route — What women who travelled it want you to know | Raven" },
      {
        name: "description",
        content:
          "Enter where you're going and see a journey-aware view: community-recommended stops, recent experiences from women travellers, and caution notes.",
      },
      { property: "og:title", content: "Plan a route — Raven" },
      {
        property: "og:description",
        content:
          "Community-recommended stops, recent experiences and caution notes along the route you're planning.",
      },
    ],
  }),
  component: JourneyPage,
});

import { BuildRoute } from "@/components/raven/BuildRoute";

const norm = (v: string) => v.trim().toLowerCase();

function JourneyPage() {
  const search = Route.useSearch();
  const [from, setFrom] = useState(search.from ?? "");
  const [to, setTo] = useState(search.to ?? "");
  const [query, setQuery] = useState<{ from: string; to: string } | null>(
    search.from && search.to ? { from: search.from, to: search.to } : null
  );
  const [isBuildingRoute, setIsBuildingRoute] = useState(false);

  const route = query ? findRoute(query.from, query.to) : undefined;
  const supported = route !== undefined;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <p className="rule-label">Journey</p>

        <form
          className="mt-4 flex flex-wrap items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!from.trim() || !to.trim()) return;
            setQuery({ from, to });
          }}
        >
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From"
            aria-label="From"
            className="w-40 rounded-sm border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring sm:w-56"
          />
          <span className="text-muted-foreground" aria-hidden>
            →
          </span>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To"
            aria-label="To"
            className="w-40 rounded-sm border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring sm:w-56"
          />
          <button
            type="submit"
            className="rounded-sm border border-border-strong bg-primary px-6 py-3 text-sm text-primary-foreground transition-colors hover:opacity-90"
          >
            Explore
          </button>
        </form>

        {query === null && (
          <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
            Enter a route to see what women who travelled it want you to know. Try Kochi → Munnar.
          </p>
        )}

        {query !== null && !supported && (
          <section className="mt-14 max-w-lg border-t border-border pt-10">
            <h1 className="font-display text-4xl leading-tight">
              No experiences along this route yet.
            </h1>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Be the first woman to share what you experienced.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/contribute"
                search={{}}
                className="inline-block rounded-sm border border-border-strong px-6 py-3 text-sm text-foreground transition-colors hover:bg-accent"
              >
                Contribute an experience
              </Link>
              {!isBuildingRoute && (
                <button
                  type="button"
                  onClick={() => setIsBuildingRoute(true)}
                  className="text-sm text-foreground underline underline-offset-4"
                >
                  This route isn't on Raven yet — build it?
                </button>
              )}
            </div>
            
            {isBuildingRoute && (
              <BuildRoute initialFrom={query.from} initialTo={query.to} />
            )}
          </section>
        )}

        {supported && route && <JourneyContent route={route} />}
      </main>
    </>
  );
}

function JourneyContent({ route }: { route: JourneyRoute }) {
  const all = useExperiences();
  const sessionIds = getSessionIds();
  const summary = getJourneySummary(all, route.stop_ids);
  
  const stops = route.stop_ids.map(id => ({ placeId: id, note: "" }));

  return (
    <>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="min-w-0">
          <h1 className="font-display text-5xl leading-tight sm:text-6xl">
            {route.from_text} <span className="text-muted-foreground">→</span> {route.to_text}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
          {route.distance} · {route.typical} · {summary.stops} stops with recent reports
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-6 text-sm sm:gap-10">
          <div>
            <dt className="rule-label">Stops</dt>
            <dd className="font-display mt-1 text-3xl">{summary.stops}</dd>
          </div>
          <div>
            <dt className="rule-label">Experiences</dt>
            <dd className="font-display mt-1 text-3xl">{summary.experiences}</dd>
          </div>
          <div>
            <dt className="rule-label">Caution notes</dt>
            <dd className="font-display mt-1 text-3xl text-caution">{summary.cautions}</dd>
          </div>
        </dl>
      </div>

      <section className="mt-10">
        {/* LeafletJourneyMap replaces the SVG JourneyMap — JourneyMap.tsx is kept but unused */}
        <LeafletJourneyMap route={route} />
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
            {route.caution_notes.map((n) => (
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
            {stops.map((s) => {
              const place = placeById(s.placeId)!;
              const stat = getStopStats(s.placeId, all, sessionIds);
              return (
                <li key={s.placeId}>
                  <Link
                    to="/place/$placeId"
                    params={{ placeId: s.placeId }}
                    search={{ from: route.from_text, to: route.to_text }}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5 transition-colors hover:bg-secondary/60"
                  >
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
    </>
  );
}
