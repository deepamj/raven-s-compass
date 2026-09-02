import { useSyncExternalStore } from "react";
import { seedExperiences, type Experience } from "./raven-data";

let experiences: Experience[] = [...seedExperiences];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function addExperience(input: Omit<Experience, "id">) {
  experiences = [{ ...input, id: `local-${Date.now()}` }, ...experiences];
  emit();
}

export function useExperiences(placeId?: string) {
  const all = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => experiences,
    () => experiences,
  );
  return placeId ? all.filter((e) => e.placeId === placeId) : all;
}

export function mostMentioned(list: Experience[]) {
  const counts = new Map<string, number>();
  list.forEach((e) => e.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
