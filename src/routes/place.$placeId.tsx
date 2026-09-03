import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { SiteHeader } from "@/components/raven/SiteHeader";
import { TagMark } from "@/components/raven/TagMark";
import { journey } from "@/lib/raven-data";
import { fetchPlaces, placeById } from "@/lib/places-store";
import { synthesizeExperiences, useExperiences, getTagCounts, getStopStats, getSessionIds } from "@/lib/experience-store";

export const Route = createFileRoute("/place/$placeId")({
  validateSearch: (search: Record<string, unknown>): { from?: string; to?: string } => {
    const res: { from?: string; to?: string } = {};
    if (typeof search["from"] === "string") res.from = search["from"];
    if (typeof search["to"] === "string") res.to = search["to"];
    return res;
  },
  loader: async ({ params }) => {
    await fetchPlaces();
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
  const search = Route.useSearch();
  const all = useExperiences();
  const sessionIds = getSessionIds();
  const experiences = all.filter((e) => e.placeId === place.id);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  // Bug 3 fix: sort by travel date (iso) descending, not submission order
  const filteredExperiences = [...(activeTag
    ? experiences.filter((e) => e.tags.includes(activeTag))
    : experiences
  )].sort((a, b) => b.iso.localeCompare(a.iso));
  const ranked = getTagCounts(place.id, all);
  const stat = getStopStats(place.id, all, sessionIds);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {/* Bug 4 fix: breadcrumb reflects the route the user navigated from, or falls back gracefully */}
        <Link
          to="/journey"
          search={search.from && search.to ? { from: search.from, to: search.to } : {}}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {search.from && search.to
            ? `← ${search.from} → ${search.to}`
            : "← Journey"}
        </Link>

        <div className="mt-6 min-w-0">
          <p className="rule-label">
            {place.area} · {place.kind}
          </p>
          <h1 className="font-display mt-3 text-5xl leading-tight sm:text-6xl">{place.name}</h1>
          <p className="mt-5 text-[0.95rem] text-muted-foreground">
            <span className="text-foreground">{stat.count} recent experiences</span> ·
            last reported {stat.lastReported}
          </p>
        </div>

        <section className="mt-16 grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="rule-label">Raven synthesis</p>
            <h2 className="font-display mt-2 text-3xl leading-snug">What women are saying lately</h2>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
              {synthesizeExperiences(experiences)}
            </p>

            <div className="mt-8 border-y border-border py-5">
              <p className="rule-label">Filter reports</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className={`border px-3 py-1.5 text-xs transition-colors ${
                    activeTag === null ? "border-foreground bg-foreground text-background" : "border-border-strong hover:bg-accent"
                  }`}
                >
                  All · {experiences.length}
                </button>
                {ranked.map(({ tag, count }) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={`border px-3 py-1.5 text-xs transition-colors ${
                      activeTag === tag ? "border-foreground bg-foreground text-background" : "border-border-strong hover:bg-accent"
                    }`}
                  >
                    {tag} · {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-display text-2xl">Most mentioned</h3>
              <ul className="mt-5 space-y-4">
                {ranked.slice(0, 5).map(({ tag, count }) => (
                  <li key={tag}>
                    <TagMark tag={tag} count={count} strong />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl">Recent voices</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {activeTag ? `Showing reports tagged “${activeTag}”` : "Newest first"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{filteredExperiences.length} shown</p>
            </div>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {filteredExperiences.map((e) => (
                <li key={e.id} className="py-6">
                  {e.images && e.images.length > 0 && (
                    <ExperienceImages images={e.images} />
                  )}
                  {e.text && (
                    <p className="font-display text-xl leading-snug text-foreground">“{e.text}”</p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {e.date.replace(", 2026", "")} · {e.traveller}
                  </p>
                  <p className="mt-2 text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">
                    First-hand report · {e.evidence === "date + photo" ? "travel date + photo" : e.evidence === "photo" ? "photo shared" : "travel date shared"}
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

            {filteredExperiences.length === 0 && (
              <p className="mt-6 border-y border-border py-6 text-sm text-muted-foreground">
                No reports match this filter yet.
              </p>
            )}

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

// ---------------------------------------------------------------------------
// ExperienceImages — thin embla slider for 1+ images attached to an experience
// ---------------------------------------------------------------------------
function ExperienceImages({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  if (images.length === 1) {
    return (
      <div className="mb-4 overflow-hidden rounded-sm border border-border">
        <img
          src={images[0]}
          alt="Travel photo"
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="overflow-hidden rounded-sm border border-border" ref={emblaRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div key={i} className="relative min-w-0 flex-[0_0_100%]">
              <img
                src={src}
                alt={`Travel photo ${i + 1}`}
                className="aspect-video w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Minimal navigation: prev/next arrows + dot indicators */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => { emblaApi?.scrollTo(i); setSelectedIndex(i); }}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === selectedIndex ? "bg-foreground" : "bg-border-strong"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous photo"
            className="border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next photo"
            className="border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
