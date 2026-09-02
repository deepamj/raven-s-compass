import munnarHills from "@/assets/munnar-hills.jpg";
import busStand from "@/assets/bus-stand.jpg";
import kochiWater from "@/assets/kochi-water.jpg";
import vagamon from "@/assets/vagamon.jpg";
import aluvaStation from "@/assets/aluva-station.jpg";

export type Tone = "positive" | "caution" | "neutral";

export const EXPERIENCE_TAGS: { label: string; tone: Tone }[] = [
  { label: "Clean restroom", tone: "positive" },
  { label: "Friendly staff", tone: "positive" },
  { label: "Felt safe", tone: "positive" },
  { label: "Easy transport", tone: "positive" },
  { label: "Solo-friendly", tone: "positive" },
  { label: "Crowded", tone: "caution" },
  { label: "Isolated after dark", tone: "caution" },
];

export function toneFor(tag: string): Tone {
  return EXPERIENCE_TAGS.find((t) => t.label === tag)?.tone ?? "neutral";
}

export type Experience = {
  id: string;
  placeId: string;
  date: string; // display date
  iso: string;
  tags: string[];
  text?: string;
  traveller: string;
  evidence?: "date" | "photo" | "date + photo";
};

export type Place = {
  id: string;
  name: string;
  area: string;
  kind: string;
  image: string;
  lastReported: string;
  note?: string;
};

export const places: Place[] = [
  {
    id: "munnar-bus-stand",
    name: "Munnar Bus Stand",
    area: "Munnar",
    kind: "Transport stop",
    image: busStand,
    lastReported: "2 days ago",
  },
  {
    id: "aluva-railway-station",
    name: "Aluva Railway Station",
    area: "Aluva",
    kind: "Railway station",
    image: aluvaStation,
    lastReported: "5 days ago",
  },
  {
    id: "vagamon-meadows",
    name: "Vagamon Meadows",
    area: "Vagamon",
    kind: "Viewpoint",
    image: vagamon,
    lastReported: "9 days ago",
  },
  {
    id: "kochi-boat-jetty",
    name: "Kochi Boat Jetty",
    area: "Kochi",
    kind: "Ferry terminal",
    image: kochiWater,
    lastReported: "3 days ago",
  },
];

export const journey = {
  from: "Kochi",
  to: "Munnar",
  distance: "128 km",
  typical: "4 h 20 m by road",
  hero: munnarHills,
  summary: {
    stops: 8,
    experiences: 15,
    cautions: 2,
  },
  stops: [
    { placeId: "kochi-boat-jetty", label: "Kochi", note: "Start" },
    { placeId: "aluva-railway-station", label: "Aluva", note: "Rail transfer" },
    { placeId: "vagamon-meadows", label: "Vagamon", note: "Detour stop" },
    { placeId: "munnar-bus-stand", label: "Munnar", note: "Arrival" },
  ],
  cautionNotes: [
    {
      place: "Munnar Bus Stand",
      text: "Isolated after dark — 4 women reported waiting alone felt unsafe after 9 PM.",
      date: "Aug 22",
    },
    {
      place: "Vagamon Meadows",
      text: "Last shared jeep down the hill leaves earlier than posted; 3 women were stranded.",
      date: "Aug 18",
    },
  ],
};

export const seedExperiences: Experience[] = [
  {
    id: "e1",
    placeId: "munnar-bus-stand",
    date: "Aug 30, 2026",
    iso: "2026-08-30",
    tags: ["Friendly staff", "Easy transport"],
    text: "Staff helped me find a shared taxi.",
    traveller: "Solo traveller",
  },
  {
    id: "e2",
    placeId: "munnar-bus-stand",
    date: "Aug 27, 2026",
    iso: "2026-08-27",
    tags: ["Crowded", "Easy transport"],
    text: "Very crowded around 7 PM.",
    traveller: "Traveller",
  },
  {
    id: "e3",
    placeId: "munnar-bus-stand",
    date: "Aug 22, 2026",
    iso: "2026-08-22",
    tags: ["Isolated after dark"],
    text: "Wouldn't wait here alone after 9 PM.",
    traveller: "Traveller",
  },
  {
    id: "e4",
    placeId: "munnar-bus-stand",
    date: "Aug 21, 2026",
    iso: "2026-08-21",
    tags: ["Easy transport", "Solo-friendly", "Friendly staff"],
    text: "Conductor pointed me to the women's seating row without being asked.",
    traveller: "Solo traveller",
  },
  {
    id: "e5",
    placeId: "munnar-bus-stand",
    date: "Aug 19, 2026",
    iso: "2026-08-19",
    tags: ["Clean restroom", "Friendly staff"],
    text: "Restroom near the ticket counter was clean and attended.",
    traveller: "Travelling with a friend",
  },
  {
    id: "e6",
    placeId: "aluva-railway-station",
    date: "Aug 28, 2026",
    iso: "2026-08-28",
    tags: ["Easy transport", "Felt safe"],
    text: "Metro to bus transfer took ten minutes, plenty of people around.",
    traveller: "Solo traveller",
  },
  {
    id: "e7",
    placeId: "aluva-railway-station",
    date: "Aug 24, 2026",
    iso: "2026-08-24",
    tags: ["Crowded", "Clean restroom"],
    text: "Platform 2 restroom is the better one. Early evening rush is heavy.",
    traveller: "Traveller",
  },
  {
    id: "e8",
    placeId: "vagamon-meadows",
    date: "Aug 18, 2026",
    iso: "2026-08-18",
    tags: ["Solo-friendly", "Isolated after dark"],
    text: "Beautiful until light drops, then there is no transport back.",
    traveller: "Solo traveller",
  },
  {
    id: "e9",
    placeId: "kochi-boat-jetty",
    date: "Aug 29, 2026",
    iso: "2026-08-29",
    tags: ["Friendly staff", "Felt safe", "Easy transport"],
    text: "Ticket staff walked me to the right ferry gate.",
    traveller: "Solo traveller",
  },
];

export const stopStats: Record<string, { count: number; lastReported: string }> = {
  "munnar-bus-stand": { count: 21, lastReported: "2 days ago" },
  "aluva-railway-station": { count: 19, lastReported: "5 days ago" },
  "vagamon-meadows": { count: 11, lastReported: "9 days ago" },
  "kochi-boat-jetty": { count: 14, lastReported: "3 days ago" },
};

export function placeById(id: string) {
  return places.find((p) => p.id === id);
}

export const baseMentions: Record<string, Record<string, number>> = {
  "munnar-bus-stand": {
    "Easy transport": 12,
    "Friendly staff": 10,
    Crowded: 7,
    "Isolated after dark": 4,
    "Clean restroom": 5,
    "Solo-friendly": 6,
  },
  "aluva-railway-station": {
    "Easy transport": 11,
    "Felt safe": 8,
    Crowded: 9,
    "Clean restroom": 4,
  },
  "vagamon-meadows": {
    "Solo-friendly": 7,
    "Isolated after dark": 5,
    "Felt safe": 3,
  },
  "kochi-boat-jetty": {
    "Friendly staff": 9,
    "Easy transport": 8,
    "Felt safe": 7,
    Crowded: 3,
  },
};

export function statFor(id: string) {
  return stopStats[id] ?? { count: 0, lastReported: "not reported yet" };
}
