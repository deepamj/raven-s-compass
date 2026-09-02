import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/raven/SiteHeader";
import { TagMark } from "@/components/raven/TagMark";
import { journey, placeById, statFor } from "@/lib/raven-data";
import { mostMentioned, useExperiences } from "@/lib/experience-store";

export const Route = createFileRoute("/place/$placeId")({
  loader: ({ params }) => {
    const place = placeById(params.placeId);
    if (!place) throw notFound();
    return { place };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Place unavailable | Raven" }, { name: "robots", content: "noindex" }] };
    }
    const { place } = loaderData;
    const title = `${place.name} — What we experienced | Raven`;
    const description = `Recent first-hand experiences from women at ${place.name}, ${place.area}: what happened, when, and how recently.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: PlacePage,
});

function PlacePage() {
  const { place } = Route.useLoaderData();
  const experiences = useExperiences(place.id);
  const ranked = mostMentioned(experiences);
  const stat = statFor(place.id);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <Link to="/journey" className="text-sm text-muted-foreground hover:text-foreground">
          ← Kochi → Munnar
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="min-w-0">
            <p className="rule-label">
              {place.area} · {place.kind}
            </p>
            <h1 className="font-display mt-3 text-5xl leading-tight sm:text-6xl">{place.name}</h1>
            <p className="mt-5 text-[0.95rem] text-muted-foreground">
              <span className="text-foreground">{stat.count} recent experiences</span> · last
              reported {stat.lastReported}
            </p>
          </div>
          <img
            src={place.image}
            alt={`${place.name}, ${place.area}`}
            loading="lazy"
            width={1408}
            height={1008}
            className="aspect-16/10 w-full rounded-sm border border-border object-cover shadow-quiet"
          />
        </div>

        <section className="mt-16 grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="font-display text-3xl">What we experienced</h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Most mentioned by women who reported from here. Counts, not scores.
            </p>
            <ul className="mt-8 space-y-4 border-t border-border pt-6">
              {ranked.map(({ tag, count }) => (
                <li key={tag}>
                  <TagMark tag={tag} count={count} strong />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-3xl">Recent voices</h2>
              <p className="text-xs text-muted-foreground">Newest first</p>
            </div>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {experiences.map((e) => (
                <li key={e.id} className="py-6">
                  {e.text && (
                    <p className="font-display text-xl leading-snug text-foreground">“{e.text}”</p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {e.date.replace(", 2026", "")} · {e.traveller}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                    {e.tags.map((t) => (
                      <li key={t}>
                        <TagMark tag={t} />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/contribute"
                search={{ place: place.name }}
                className="border border-border-strong bg-primary px-5 py-3 text-sm text-primary-foreground transition-colors hover:opacity-90"
              >
                Add your experience of {place.name}
              </Link>
              <Link to="/journey" className="text-sm text-muted-foreground hover:text-foreground">
                Other stops on this route
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-20 border-t border-border pt-8">
          <p className="rule-label">Continue along the route</p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {journey.stops
              .filter((s) => s.placeId !== place.id)
              .map((s) => (
                <li key={s.placeId}>
                  <Link
                    to="/place/$placeId"
                    params={{ placeId: s.placeId }}
                    className="font-display text-2xl text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </main>
    </>
  );
}
