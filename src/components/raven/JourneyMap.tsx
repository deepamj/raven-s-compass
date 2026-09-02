import { Link } from "@tanstack/react-router";
import { journey, statFor } from "@/lib/raven-data";

const coords: Record<string, { x: number; y: number }> = {
  "kochi-boat-jetty": { x: 8, y: 74 },
  "aluva-railway-station": { x: 34, y: 56 },
  "vagamon-meadows": { x: 62, y: 66 },
  "munnar-bus-stand": { x: 90, y: 30 },
};

/**
 * Stylised route map used as the visual anchor of the journey screen:
 * contour lines plus a route path with clickable stop nodes.
 */
export function JourneyMap() {
  return (
    <div className="relative overflow-hidden rounded-sm border border-border bg-surface shadow-quiet">
      <svg
        viewBox="0 0 100 46"
        preserveAspectRatio="none"
        className="h-64 w-full sm:h-80"
        aria-hidden
      >
        <g stroke="var(--color-border)" strokeWidth="0.18" fill="none">
          {[...Array(9)].map((_, i) => (
            <path
              key={i}
              d={`M-5 ${8 + i * 4.6} C 20 ${2 + i * 4.4}, 46 ${18 + i * 4.2}, 72 ${6 + i * 4.6} S 96 ${
                14 + i * 4.3
              }, 105 ${9 + i * 4.5}`}
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
          strokeWidth="0.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0">
        {journey.stops.map((s) => {
          const point = coords[s.placeId] ?? { x: 50, y: 50 };
          const stat = statFor(s.placeId);
          return (
            <Link
              key={s.placeId}
              to="/place/$placeId"
              params={{ placeId: s.placeId }}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              <span className="mx-auto block h-2.5 w-2.5 rounded-full border border-foreground bg-background transition-colors group-hover:bg-primary" />
              <span className="pointer-events-none absolute left-1/2 top-5 w-36 -translate-x-1/2 text-center">
                <span className="font-display block text-lg leading-tight text-foreground">
                  {s.label}
                </span>
                <span className="mt-0.5 block text-[0.7rem] leading-tight text-muted-foreground">
                  {stat.count} experiences · {stat.lastReported}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
