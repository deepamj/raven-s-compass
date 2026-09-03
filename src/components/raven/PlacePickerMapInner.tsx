import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

function LocationPicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });

  const isDark = document.documentElement.classList.contains("dark");
  const primaryColor = isDark ? "oklch(0.83 0.105 168)" : "oklch(0.74 0.088 168)";
  const borderColor = isDark ? "oklch(0.945 0.006 150)" : "oklch(0.24 0.013 180)";

  return position === null ? null : (
    <CircleMarker
      center={[position.lat, position.lng]}
      radius={7}
      pathOptions={{
        color: borderColor,
        fillColor: primaryColor,
        fillOpacity: 1,
        weight: 1.5,
      }}
    />
  );
}

export default function PlacePickerMapInner({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  const isDark = document.documentElement.classList.contains("dark");
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div className="h-64 overflow-hidden rounded-sm border border-border shadow-quiet">
      <MapContainer
        center={[9.9, 76.68]}
        zoom={9}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
          className={isDark ? "raven-tile-dark" : undefined}
        />
        <LocationPicker onPick={onPick} />
      </MapContainer>
    </div>
  );
}
