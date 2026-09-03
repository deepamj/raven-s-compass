import { useEffect, useState, Suspense, lazy } from "react";
import type { JourneyRoute } from "@/lib/routes-store";

// Lazy-import the actual map to keep Leaflet's window-dependent code
// entirely out of the SSR bundle evaluation path.
const MapInner = lazy(() => import("./LeafletJourneyMapInner"));

function MapSkeleton() {
  return (
    <div className="h-64 animate-pulse overflow-hidden rounded-sm border border-border bg-surface sm:h-80" />
  );
}

/**
 * SSR-safe wrapper: renders a skeleton on the server and during the first
 * client paint, then swaps in the real Leaflet map once the component mounts.
 */
export function LeafletJourneyMap({ route }: { route: JourneyRoute }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return <MapSkeleton />;

  return (
    <Suspense fallback={<MapSkeleton />}>
      <MapInner route={route} />
    </Suspense>
  );
}
