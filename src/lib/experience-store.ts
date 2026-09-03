import { useSyncExternalStore } from "react";
import { EXPERIENCE_TAGS, journey, type Experience } from "./raven-data";
import { supabase } from "./supabase";

let experiences: Experience[] = [];
const sessionIds = new Set<string>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

// Fetch all existing experiences on store initialization.
supabase
  .from("experiences")
  .select("*")
  .order("created_at", { ascending: false })
  .then(({ data, error }) => {
    if (error) {
      console.error("Failed to load experiences from Supabase:", error);
      return;
    }
    if (data) {
      experiences = data.map((row: any) => ({
        id: row.id,
        placeId: row.place_id,
        date: row.date,
        iso: row.iso,
        tags: row.tags,
        text: row.text || undefined,
        traveller: row.traveller,
        images: row.images?.length ? row.images : undefined,
      }));
      emit();
    }
  });

export async function addExperience(input: Omit<Experience, "id">) {
  const { placeId, ...rest } = input;
  
  const { data, error } = await supabase
    .from("experiences")
    .insert({ ...rest, place_id: placeId })
    .select()
    .single();

  if (error) {
    console.error("Failed to add experience to Supabase:", error);
    throw error;
  }

  if (data) {
    const newExp: Experience = {
      id: data.id,
      placeId: data.place_id,
      date: data.date,
      iso: data.iso,
      tags: data.tags,
      text: data.text || undefined,
      traveller: data.traveller,
      images: data.images?.length ? data.images : undefined,
    };
    
    // Add to the beginning of the list and update session set
    experiences = [newExp, ...experiences];
    sessionIds.add(data.id);
    emit();
  }
}

/** Returns the Set of IDs submitted in this browser session. Always fresh because
 *  every addExperience call triggers emit(), which re-renders all useExperiences subscribers. */
export function getSessionIds(): ReadonlySet<string> {
  return sessionIds;
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

/** Derives sorted tag-mention counts for a place directly from the live experience list,
 *  replacing the hardcoded baseMentions overlay. */
export function getTagCounts(placeId: string, list: Experience[]) {
  return mostMentioned(list.filter((e) => e.placeId === placeId));
}

/** Derives count and a human-readable "last reported" string from the live experience list,
 *  replacing the hardcoded stopStats table. Returns "just now" if any session experience
 *  exists for the place. */
export function getStopStats(
  placeId: string,
  list: Experience[],
  currentSessionIds: ReadonlySet<string>,
): { count: number; lastReported: string } {
  const forPlace = list.filter((e) => e.placeId === placeId);
  const count = forPlace.length;
  if (count === 0) return { count: 0, lastReported: "not reported yet" };
  if (forPlace.some((e) => currentSessionIds.has(e.id))) {
    return { count, lastReported: "just now" };
  }
  const sorted = [...forPlace].sort((a, b) => b.iso.localeCompare(a.iso));
  return { count, lastReported: relativeDate(sorted[0]!.iso) };
}

function relativeDate(iso: string): string {
  const days = Math.floor(
    (Date.now() - new Date(`${iso}T12:00:00`).getTime()) / 86_400_000,
  );
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

/** Replaces the hardcoded journey.summary object with counts derived from the live store.
 *  stopIds: the ordered stop_ids array from the current JourneyRoute. */
export function getJourneySummary(list: Experience[], stopIds: string[]) {
  const cautionTags = new Set(
    EXPERIENCE_TAGS.filter((t) => t.tone === "caution").map((t) => t.label),
  );
  const stopIdSet = new Set(stopIds);
  const routeExperiences = list.filter((e) => stopIdSet.has(e.placeId));
  const stopsWithReports = stopIds.filter((id) => routeExperiences.some((e) => e.placeId === id));
  return {
    stops: stopsWithReports.length,
    experiences: routeExperiences.length,
    cautions: routeExperiences.filter((e) => e.tags.some((t) => cautionTags.has(t))).length,
  };
}

export function synthesizeExperiences(list: Experience[]) {
  if (!list.length) return "No experiences have been shared here yet.";

  const ranked = mostMentioned(list);
  const positive = ranked.find((item) => !["Crowded", "Isolated after dark"].includes(item.tag));
  const caution = ranked.find((item) => ["Crowded", "Isolated after dark"].includes(item.tag));
  const recent = [...list].sort((a, b) => b.iso.localeCompare(a.iso))[0]!;

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
