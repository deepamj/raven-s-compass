import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";

export type JourneyRoute = {
  id: string;
  from_text: string;
  to_text: string;
  distance: string;
  typical: string;
  stop_ids: string[];
  caution_notes: { place: string; text: string; date: string }[];
};

let routes: JourneyRoute[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

let loadPromise: Promise<void> | null = null;

export async function fetchRoutes(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const { data, error } = await supabase.from("routes").select("*");
    if (error) {
      console.error("Failed to load routes from Supabase:", error);
      return;
    }
    if (data) {
      routes = data.map((row: any) => ({
        id: row.id,
        from_text: row.from_text,
        to_text: row.to_text,
        distance: row.distance,
        typical: row.typical,
        stop_ids: row.stop_ids,
        caution_notes: row.caution_notes || [],
      }));
      emit();
    }
  })();
  return loadPromise;
}

fetchRoutes();

export function useRoutes() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => routes,
    () => routes,
  );
}

const norm = (v: string) => v.trim().toLowerCase();

export function findRoute(from: string, to: string) {
  return routes.find((r) => norm(r.from_text) === norm(from) && norm(r.to_text) === norm(to));
}

export async function addRoute(input: {
  from_text: string;
  to_text: string;
  distance: string;
  stop_ids: string[];
}): Promise<JourneyRoute> {
  const { data, error } = await supabase
    .from("routes")
    .insert({
      from_text: input.from_text,
      to_text: input.to_text,
      distance: input.distance,
      typical: "Varies",
      stop_ids: input.stop_ids,
      caution_notes: [],
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to add route:", error);
    throw error;
  }

  const newRoute: JourneyRoute = {
    id: data.id,
    from_text: data.from_text,
    to_text: data.to_text,
    distance: data.distance,
    typical: data.typical,
    stop_ids: data.stop_ids,
    caution_notes: data.caution_notes || [],
  };

  routes = [...routes, newRoute];
  emit();
  return newRoute;
}
