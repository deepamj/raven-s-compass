import { useState, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { RavenFlock } from "@/components/raven/RavenFlock";
import { RavenMark } from "@/components/raven/RavenMark";
import { useExperiences } from "@/lib/experience-store";

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
  const allExperiences = useExperiences();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const thisMonthCount = allExperiences.filter((e) => {
    const d = new Date(e.iso);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  // Derive up to 3 most-recent experience photos for the carousel
  const carouselSlides = allExperiences
    .filter((e) => e.images && e.images.length > 0)
    .sort((a, b) => b.iso.localeCompare(a.iso))
    .slice(0, 3)
    .map((e) => ({ placeId: e.placeId, src: e.images![0] as string }));

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

          {/* Dynamic image carousel or fallback when no photos yet */}
          <div className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9 lg:-mt-4 lg:pt-8">
            <p className="border-l border-border pl-5 text-[0.95rem] leading-relaxed text-muted-foreground">
              Not ratings. Not scores. Just what women experienced at the places and stops along a
              route — and how recently they were there.
            </p>

            {carouselSlides.length > 0 && (
              <HomeCarousel slides={carouselSlides} />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="hairline flex flex-wrap items-baseline justify-between gap-4 py-6">
          <p className="text-sm text-muted-foreground">
            {thisMonthCount} experiences shared this month
          </p>
          <p className="rule-label">Raven</p>
        </footer>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// HomeCarousel — thin embla carousel for the homepage right column
// ---------------------------------------------------------------------------
type HomeSlide = { placeId: string; src: string };

function HomeCarousel({ slides }: { slides: HomeSlide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
      setSelectedIndex(index);
    },
    [emblaApi],
  );

  return (
    <div>
      <div className="overflow-hidden rounded-sm border border-border" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%]">
              <Link to="/place/$placeId" params={{ placeId: slide.placeId }}>
                <img
                  src={slide.src}
                  alt="Community travel photo"
                  className="aspect-[3/4] w-full object-cover opacity-90 grayscale transition-all duration-700 hover:grayscale-0 hover:opacity-100"
                  loading="lazy"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* Dot navigation */}
      {slides.length > 1 && (
        <div className="mt-3 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === selectedIndex ? "bg-foreground" : "bg-border-strong"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
