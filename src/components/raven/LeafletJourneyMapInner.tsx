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
import "leaflet/dist/leaflet.css";
import { useNavigate } from "@tanstack/react-router";
import { usePlaces } from "@/lib/places-store";
import { type JourneyRoute } from "@/lib/routes-store";
import { useExperiences, getStopStats, getSessionIds } from "@/lib/experience-store";
import { useMemo } from "react";

// ---------------------------------------------------------------------------
// FitBounds — child component that snaps the map viewport to the full route.
// Must live inside MapContainer to access the Leaflet map context.
// ---------------------------------------------------------------------------
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(positions, { padding: [44, 44] });
    }
  }, [map, positions]);
  return null;
}

// ---------------------------------------------------------------------------
// Main map render — exported as default so React.lazy can import it.
// ---------------------------------------------------------------------------
export default function LeafletJourneyMapInner({ route }: { route: JourneyRoute }) {
  const navigate = useNavigate();
  const experiences = useExperiences();
  const sessionIds = getSessionIds();
  const allPlaces = usePlaces();

  const stops = useMemo(() => {
    return route.stop_ids.flatMap((placeId) => {
      const place = allPlaces.find((p) => p.id === placeId);
      if (!place) return [];
      return [{ placeId, place, coord: { lat: place.lat, lng: place.lng }, label: place.area, note: "" }];
    });
  }, [allPlaces, route]);

  const routePositions: [number, number][] = useMemo(() => {
    return stops.map((s) => [s.coord.lat, s.coord.lng]);
  }, [stops]);

  // The html element always carries the "dark" class in this app
  // (set in __root.tsx). Read it at render time so the tile URL is correct.
  const isDark = document.documentElement.classList.contains("dark");

  // Single OSM tile URL — no API key required.
  // Dark-mode inversion is applied via a CSS filter on the tile container (see below).
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

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
        <FitBounds positions={routePositions} />

        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
          // In dark mode, apply a CSS filter to the tile layer container only.
          // Markers and tooltips live in sibling Leaflet panes and are unaffected.
          className={isDark ? "raven-tile-dark" : undefined}
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
