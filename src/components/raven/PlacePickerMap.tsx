import { useEffect, useState, Suspense, lazy } from "react";

const MapInner = lazy(() => import("./PlacePickerMapInner"));

function MapSkeleton() {
  return (
    <div className="h-64 animate-pulse overflow-hidden rounded-sm border border-border bg-surface" />
  );
}

export function PlacePickerMap({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return <MapSkeleton />;

  return (
    <Suspense fallback={<MapSkeleton />}>
      <MapInner onPick={onPick} />
    </Suspense>
  );
}
