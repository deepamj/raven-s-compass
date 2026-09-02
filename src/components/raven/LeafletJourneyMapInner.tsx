/**
 * LeafletJourneyMapInner — only ever evaluated on the client.
 * Imported exclusively via React.lazy() from LeafletJourneyMap.tsx,
 * which gates it behind a useEffect so Leaflet's window-dependent
 * initialisation never runs during SSR.
 */
import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  Polyline,
  useMap,
} from "react-leaflet";
import { useNavigate } from "@tanstack/react-router";
import "leaflet/dist/leaflet.css";
import { journey, placeCoords, placeById } from "@/lib/raven-data";
import { useExperiences, getStopStats, getSessionIds } from "@/lib/experience-store";

// ---------------------------------------------------------------------------
// Static data: computed once at module-load time (client only, safe here).
// Filter out any stop missing a coord entry — future-proofs adding stops.
// ---------------------------------------------------------------------------
const stops = journey.stops.flatMap((s) => {
  const coord = placeCoords[s.placeId];
  const place = placeById(s.placeId);
  if (!coord || !place) return [];
  return [{ ...s, place, coord }];
});

const routePositions: [number, number][] = stops.map((s) => [s.coord.lat, s.coord.lng]);

// ---------------------------------------------------------------------------
// FitBounds — child component that snaps the map viewport to the full route.
// Must live inside MapContainer to access the Leaflet map context.
// ---------------------------------------------------------------------------
function FitBounds() {
  const map = useMap();
  useEffect(() => {
    if (routePositions.length >= 2) {
      map.fitBounds(routePositions, { padding: [44, 44] });
    }
  }, [map]);
  return null;
}

// ---------------------------------------------------------------------------
// Main map render — exported as default so React.lazy can import it.
// ---------------------------------------------------------------------------
export default function LeafletJourneyMapInner() {
  const navigate = useNavigate();
  const experiences = useExperiences();
  const sessionIds = getSessionIds();

  // The html element always carries the "dark" class in this app
  // (set in __root.tsx). Read it at render time so the tile URL is correct.
  const isDark = document.documentElement.classList.contains("dark");

  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  // Match the app's primary color (aquamarine) for line + marker fill.
  const primaryColor = isDark ? "oklch(0.83 0.105 168)" : "oklch(0.74 0.088 168)";
  const borderColor = isDark ? "oklch(0.945 0.006 150)" : "oklch(0.24 0.013 180)";

  return (
    // Outer div controls height + border — identical radius/border to the
    // rest of the editorial card style (rounded-sm, border-border).
    <div className="h-64 overflow-hidden rounded-sm border border-border shadow-quiet sm:h-80">
      <MapContainer
        // Initial center/zoom are overridden by FitBounds on mount.
        center={[9.9, 76.68]}
        zoom={9}
        // Fill the outer div completely.
        style={{ height: "100%", width: "100%" }}
        // Disable scroll-to-zoom so the map doesn't hijack page scrolling.
        scrollWheelZoom={false}
        // Keep Leaflet's zoom control; it uses our CSS overrides below.
        zoomControl
      >
        <FitBounds />

        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>'
          detectRetina
        />

        {/* Route polyline */}
        <Polyline
          positions={routePositions}
          pathOptions={{
            color: primaryColor,
            weight: 2,
            opacity: 0.85,
          }}
        />

        {/* One CircleMarker per stop — pure SVG, no icon image dependencies */}
        {stops.map((stop) => {
          const stat = getStopStats(stop.placeId, experiences, sessionIds);

          return (
            <CircleMarker
              key={stop.placeId}
              center={[stop.coord.lat, stop.coord.lng]}
              radius={7}
              pathOptions={{
                color: borderColor,
                fillColor: primaryColor,
                fillOpacity: 1,
                weight: 1.5,
              }}
              eventHandlers={{
                click: () =>
                  navigate({
                    to: "/place/$placeId",
                    params: { placeId: stop.placeId },
                  }),
              }}
            >
              {/* Permanent label: always visible, matches editorial type style */}
              <Tooltip
                permanent
                direction="top"
                offset={[0, -11]}
                className="raven-map-tooltip"
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "0.9rem",
                    lineHeight: 1.2,
                    color: "var(--color-foreground)",
                  }}
                >
                  {stop.label}
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "0.6rem",
                    letterSpacing: "0.06em",
                    color: "var(--color-muted-foreground)",
                  }}
                >
                  {stat.count} reports
                </p>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
