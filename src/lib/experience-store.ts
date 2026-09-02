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


export function synthesizeExperiences(list: Experience[]) {
  if (!list.length) return "No experiences have been shared here yet.";

  const ranked = mostMentioned(list);
  const positive = ranked.find((item) => !["Crowded", "Isolated after dark"].includes(item.tag));
  const caution = ranked.find((item) => ["Crowded", "Isolated after dark"].includes(item.tag));
  const recent = [...list].sort((a, b) => b.iso.localeCompare(a.iso))[0];

  if (positive && caution) {
    return `Recent reports most often mention ${positive.tag.toLowerCase()}, while ${caution.tag.toLowerCase()} is the main caution to keep in mind. The latest report was ${recent.date.replace(", 2026", "")}.`;
  }
  if (positive) {
    return `Recent reports most often mention ${positive.tag.toLowerCase()}. The latest report was ${recent.date.replace(", 2026", "")}.`;
  }
  if (caution) {
    return `Recent reports mainly flag ${caution.tag.toLowerCase()}. The latest report was ${recent.date.replace(", 2026", "")}.`;
  }
  return `There are ${list.length} recent first-hand reports here. The latest was ${recent.date.replace(", 2026", "")}.`;
}
