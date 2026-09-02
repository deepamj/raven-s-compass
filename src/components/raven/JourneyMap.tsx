import { Link } from "@tanstack/react-router";
import { journey, placeById, stopStats } from "@/lib/raven-data";

const nodes = [
  { x: 8, y: 74 },
  { x: 34, y: 58 },
  { x: 62, y: 66 },
  { x: 90, y: 32 },
];

/**
 * Stylised route map used as the visual anchor of the journey screen.
 * Contour lines + a route path with clickable stop nodes.
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
          d={`M${nodes[0].x} ${nodes[0].y * 0.46} C 20 22, 26 30, ${nodes[1].x} ${
            nodes[1].y * 0.46
          } S 54 34, ${nodes[2].x} ${nodes[2].y * 0.46} S 80 18, ${nodes[3].x} ${nodes[3].y * 0.46}`}
          stroke="var(--color-primary)"
          strokeWidth="0.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0">
        {journey.stops.map((s, i) => {
          const place = placeById(s.placeId)!;
          const stat = stopStats[s.placeId];
          return (
            <Link
              key={s.placeId}
              to="/place/$placeId"
              params={{ placeId: s.placeId }}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${nodes[i].x}%`, top: `${nodes[i].y}%` }}
            >
              <span className="block h-2.5 w-2.5 rounded-full border border-foreground bg-background transition-colors group-hover:bg-primary" />
              <span className="pointer-events-none absolute left-1/2 top-5 w-36 -translate-x-1/2 text-center">
                <span className="font-display block text-lg leading-tight text-foreground">
                  {s.label}
                </span>
                <span className="mt-0.5 block text-[0.7rem] leading-tight text-muted-foreground">
                  {stat.count} experiences · {stat.lastReported}
                </span>
                <span className="sr-only">{place.name}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
