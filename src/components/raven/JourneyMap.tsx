import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { journey, placeById } from "@/lib/raven-data";
import { useExperiences, getStopStats, getSessionIds } from "@/lib/experience-store";

const coords: Record<string, { x: number; y: number }> = {
  "kochi-boat-jetty": { x: 8, y: 34 },
  "aluva-railway-station": { x: 34, y: 25.8 },
  "vagamon-meadows": { x: 62, y: 30.4 },
  "munnar-bus-stand": { x: 90, y: 13.8 },
};

export function JourneyMap() {
  const [selected, setSelected] = useState(journey.stops[0].placeId);
  const experiences = useExperiences();
  const sessionIds = getSessionIds();
  const selectedStop = journey.stops.find((s) => s.placeId === selected) ?? journey.stops[0];
  const selectedPlace = placeById(selectedStop.placeId)!;
  const selectedStat = getStopStats(selectedStop.placeId, experiences, sessionIds);

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-surface shadow-quiet">
      <div className="relative">
        <svg
          viewBox="0 0 100 46"
          preserveAspectRatio="none"
          className="h-64 w-full sm:h-80"
          aria-label="Kochi to Munnar route with four reported stops"
          role="img"
        >
          <g stroke="var(--color-border)" strokeWidth="0.18" fill="none">
            {[...Array(9)].map((_, i) => (
              <path
                key={i}
                d={`M-5 ${8 + i * 4.6} C 20 ${2 + i * 4.4}, 46 ${18 + i * 4.2}, 72 ${6 + i * 4.6} S 96 ${14 + i * 4.3}, 105 ${9 + i * 4.5}`}
              />
            ))}
          </g>
          <g stroke="var(--color-border)" strokeWidth="0.14" fill="none" opacity="0.7">
            <path d="M18 46 C 22 34, 14 24, 24 12" />
            <path d="M52 46 C 56 32, 48 22, 58 8" />
            <path d="M80 46 C 84 34, 76 22, 86 10" />
          </g>
          <path
            d="M8 34 C 20 26, 26 27, 34 25.8 S 54 32, 62 30.4 S 80 16, 90 13.8"
            stroke="var(--color-primary)"
            strokeWidth="0.7"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0">
          {journey.stops.map((stop, index) => {
            const point = coords[stop.placeId];
            const stat = getStopStats(stop.placeId, experiences, sessionIds);
            const active = selected === stop.placeId;
            return (
              <button
                key={stop.placeId}
                type="button"
                onClick={() => setSelected(stop.placeId)}
                aria-pressed={active}
                className="group absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: `${point.x}%`, top: `${(point.y / 46) * 100}%` }}
              >
                <span
                  className={`mx-auto block rounded-full border transition-all ${
                    active
                      ? "h-4 w-4 border-foreground bg-primary ring-4 ring-primary/20"
                      : "h-3 w-3 border-foreground bg-background group-hover:bg-primary"
                  }`}
                />
                <span className="pointer-events-none absolute left-1/2 top-5 w-32 -translate-x-1/2 sm:w-36">
                  <span className="font-display block text-base leading-tight text-foreground sm:text-lg">
                    {stop.label}
                  </span>
                  <span className="mt-0.5 block text-[0.65rem] leading-tight text-muted-foreground sm:text-[0.7rem]">
                    {index + 1} · {stat.count} reports
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 border-t border-border px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7">
        <div>
          <p className="rule-label">Selected stop</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-2xl">{selectedPlace.name}</h3>
            <span className="text-sm text-muted-foreground">{selectedPlace.kind}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
          {selectedStat.count} recent experiences · last reported {selectedStat.lastReported}
          </p>
        </div>
        <Link
          to="/place/$placeId"
          params={{ placeId: selectedPlace.id }}
          className="inline-flex w-fit border border-border-strong px-4 py-2.5 text-sm transition-colors hover:bg-accent"
        >
          Read experiences
        </Link>
      </div>
    </div>
  );
}
