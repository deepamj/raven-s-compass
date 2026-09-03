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
  images?: string[];
};

/** IDs of the four original Kerala places seeded from the Kochi → Munnar route.
 *  Used to scope the homepage month-count to Kerala only. */
export const KERALA_PLACE_IDS = new Set([
  "kochi-boat-jetty",
  "aluva-railway-station",
  "vagamon-meadows",
  "munnar-bus-stand",
]);

export type Place = {
  id: string;
  name: string;
  area: string;
  image: string;
  kind?: string;
  lastReported?: string;
  note?: string;
};



export const journey = {
  from: "Kochi",
  to: "Munnar",
  distance: "128 km",
  typical: "4 h 20 m by road",
  hero: munnarHills,
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


