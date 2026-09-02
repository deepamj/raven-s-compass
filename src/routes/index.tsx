import { createFileRoute, Link } from "@tanstack/react-router";
import { RavenFlock } from "@/components/raven/RavenFlock";
import { RavenMark } from "@/components/raven/RavenMark";
import { journey, seedExperiences } from "@/lib/raven-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Raven — Travel advice from women who've already been there" },
      {
        name: "description",
        content:
          "Raven collects recent first-hand experiences from women travellers — what happened, where, when, and how recently. Plan the Kochi to Munnar route or add your own.",
      },
      { property: "og:title", content: "Raven — Travel advice from women who've already been there" },
      {
        property: "og:description",
        content:
          "A journey-aware travel guide built from recent first-hand experiences of women travellers.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <RavenFlock />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center gap-3">
          <RavenMark className="h-4 w-9 text-foreground" />
          <span className="rule-label">Know before you go</span>
        </div>

        <div className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="max-w-xl">
            <h1 className="font-display text-6xl leading-[0.95] sm:text-7xl">Raven</h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              Travel advice from women who've already been there.
            </p>
            <p className="mt-8 max-w-md border-l border-border pl-5 text-[0.95rem] leading-relaxed text-muted-foreground">
              Not ratings. Not scores. Just what women experienced at the places and stops along a
              route — and how recently they were there.
            </p>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/journey"
                className="border border-border-strong bg-primary px-6 py-3.5 text-center text-sm tracking-wide text-primary-foreground transition-colors hover:opacity-90"
              >
                Explore / Plan a trip
              </Link>
              <Link
                to="/contribute"
                search={{}}
                className="border border-border-strong px-6 py-3.5 text-center text-sm tracking-wide text-foreground transition-colors hover:bg-accent"
              >
                Contribute an experience
              </Link>
            </div>
          </div>

          <div className="lg:pl-8">
            <figure className="relative">
              <img
                src={journey.hero}
                alt="Mist over the tea hills on the road into Munnar, Kerala"
                width={1600}
                height={1008}
                className="aspect-4/5 w-full rounded-sm border border-border object-cover shadow-quiet"
              />
              <figcaption className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                <span className="text-foreground">Kochi → Munnar.</span> {journey.summary.experiences}{" "}
                recent experiences from {journey.summary.stops} stops along the route.
              </figcaption>
            </figure>
          </div>
        </div>

        <footer className="hairline flex flex-wrap items-baseline justify-between gap-4 py-6">
          <p className="text-sm text-muted-foreground">
            {seedExperiences.length} experiences shared this month · Kerala
          </p>
          <p className="rule-label">Raven</p>
        </footer>
      </div>
    </main>
  );
}
