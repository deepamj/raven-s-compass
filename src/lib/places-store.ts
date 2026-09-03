import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";

import busStand from "@/assets/bus-stand.jpg";
import kochiWater from "@/assets/kochi-water.jpg";
import vagamon from "@/assets/vagamon.jpg";
import aluvaStation from "@/assets/aluva-station.jpg";

const localImages: Record<string, string> = {
  "munnar-bus-stand": busStand,
  "aluva-railway-station": aluvaStation,
  "vagamon-meadows": vagamon,
  "kochi-boat-jetty": kochiWater,
};

export type Place = {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  image?: string;
  kind?: string;
};

let places: Place[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

let loadPromise: Promise<void> | null = null;

export async function fetchPlaces(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const { data, error } = await supabase.from("places").select("*");
    if (error) {
      console.error("Failed to load places from Supabase:", error);
      return;
    }
    if (data) {
      places = data.map((row: any) => ({
        id: row.id,
        name: row.name,
        area: row.area,
        lat: row.lat,
        lng: row.lng,
        image: localImages[row.id] || "",
      }));
      emit();
    }
  })();
  return loadPromise;
}

fetchPlaces();

export function usePlaces() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => places,
    () => places,
  );
}

export function usePlaceById(id: string) {
  const all = usePlaces();
  return all.find((p) => p.id === id);
}

export function placeById(id: string) {
  return places.find((p) => p.id === id);
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function addPlace(input: { name: string; area: string; lat: number; lng: number }): Promise<Place> {
  let baseId = slugify(input.name);
  if (!baseId) baseId = "place";
  
  let id = baseId;
  let counter = 2;
  while (places.some((p) => p.id === id)) {
    id = `${baseId}-${counter}`;
    counter++;
  }

  const { data, error } = await supabase.from("places").insert({
    id,
    name: input.name,
    area: input.area,
    lat: input.lat,
    lng: input.lng
  }).select().single();

  if (error) {
    console.error("Failed to add place:", error);
    throw error;
  }

  const newPlace: Place = {
    id: data.id,
    name: data.name,
    area: data.area,
    lat: data.lat,
    lng: data.lng,
  };

  places = [...places, newPlace];
  emit();
  return newPlace;
}
