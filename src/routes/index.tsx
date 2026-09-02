import { useState } from "react";
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
  const [birdAction, setBirdAction] = useState<"explore" | "contribute" | "click" | null>(null);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <RavenFlock action={birdAction} />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 py-12 sm:px-12">
        {/* Header */}
        <div className="flex items-center gap-3">
          <RavenMark className="h-4 w-9 text-foreground" />
          <span className="rule-label">Know before you go</span>
        </div>

        {/* Center Canvas */}
        <div className="my-16 flex flex-col gap-12 lg:my-24 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
          
          {/* Big Title & Intro */}
          <div className="lg:col-span-7">
            <h1 className="font-display text-7xl leading-[0.9] tracking-tight sm:text-8xl lg:text-[11rem]">
              Raven
            </h1>
            <p className="mt-8 max-w-md text-xl leading-relaxed text-muted-foreground sm:text-2xl">
              Travel advice from women who've already been there.
            </p>
            
            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/journey"
                onMouseEnter={() => setBirdAction("explore")}
                onMouseLeave={() => setBirdAction(null)}
                onClick={() => setBirdAction("click")}
                className="border border-border-strong bg-primary px-6 py-3.5 text-center text-sm tracking-wide text-primary-foreground transition-colors hover:opacity-90"
              >
                Explore / Plan a trip
              </Link>
              <Link
                to="/contribute"
                search={{}}
                onMouseEnter={() => setBirdAction("contribute")}
                onMouseLeave={() => setBirdAction(null)}
                onClick={() => setBirdAction("click")}
                className="border border-border-strong px-6 py-3.5 text-center text-sm tracking-wide text-foreground transition-colors hover:bg-accent"
              >
                Contribute an experience
              </Link>
            </div>
          </div>

          {/* Editorial Image & Secondary Text */}
          <div className="flex flex-col gap-12 lg:col-span-4 lg:col-start-9 lg:-mt-4 lg:pt-8">
            <p className="border-l border-border pl-5 text-[0.95rem] leading-relaxed text-muted-foreground">
              Not ratings. Not scores. Just what women experienced at the places and stops along a
              route — and how recently they were there.
            </p>

            <figure className="relative">
              <img
                src={journey.hero}
                alt="Mist over the tea hills on the road into Munnar, Kerala"
                width={1600}
                height={1008}
                className="aspect-[3/4] w-48 rounded-sm border border-border object-cover shadow-quiet sm:w-56 opacity-90 grayscale transition-all duration-700 hover:grayscale-0 hover:opacity-100"
              />
              <figcaption className="mt-4 max-w-[14rem] text-[0.85rem] leading-relaxed text-muted-foreground">
                <span className="text-foreground">Kochi → Munnar.</span> {seedExperiences.length}{" "}
                recent experiences from {journey.stops.length} stops along the route.
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Footer */}
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

