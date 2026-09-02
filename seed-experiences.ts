import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

// Read from process.env as this script is run via tsx directly, not Vite.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key in environment variables.");
}

// Create a local client for the seed script
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const seedExperiences = [
  {
    place_id: "munnar-bus-stand",
    date: "Aug 30, 2026",
    iso: "2026-08-30",
    tags: ["Friendly staff", "Easy transport"],
    text: "Staff helped me find a shared taxi.",
    traveller: "Solo traveller",
  },
  {
    place_id: "munnar-bus-stand",
    date: "Aug 27, 2026",
    iso: "2026-08-27",
    tags: ["Crowded", "Easy transport"],
    text: "Very crowded around 7 PM.",
    traveller: "Traveller",
  },
  {
    place_id: "munnar-bus-stand",
    date: "Aug 22, 2026",
    iso: "2026-08-22",
    tags: ["Isolated after dark"],
    text: "Wouldn't wait here alone after 9 PM.",
    traveller: "Traveller",
  },
  {
    place_id: "munnar-bus-stand",
    date: "Aug 21, 2026",
    iso: "2026-08-21",
    tags: ["Easy transport", "Solo-friendly", "Friendly staff"],
    text: "Conductor pointed me to the women's seating row without being asked.",
    traveller: "Solo traveller",
  },
  {
    place_id: "munnar-bus-stand",
    date: "Aug 19, 2026",
    iso: "2026-08-19",
    tags: ["Clean restroom", "Friendly staff"],
    text: "Restroom near the ticket counter was clean and attended.",
    traveller: "Travelling with a friend",
  },
  {
    place_id: "aluva-railway-station",
    date: "Aug 28, 2026",
    iso: "2026-08-28",
    tags: ["Easy transport", "Felt safe"],
    text: "Metro to bus transfer took ten minutes, plenty of people around.",
    traveller: "Solo traveller",
  },
  {
    place_id: "aluva-railway-station",
    date: "Aug 24, 2026",
    iso: "2026-08-24",
    tags: ["Crowded", "Clean restroom"],
    text: "Platform 2 restroom is the better one. Early evening rush is heavy.",
    traveller: "Traveller",
  },
  {
    place_id: "vagamon-meadows",
    date: "Aug 18, 2026",
    iso: "2026-08-18",
    tags: ["Solo-friendly", "Isolated after dark"],
    text: "Beautiful until light drops, then there is no transport back.",
    traveller: "Solo traveller",
  },
  {
    place_id: "kochi-boat-jetty",
    date: "Aug 29, 2026",
    iso: "2026-08-29",
    tags: ["Friendly staff", "Felt safe", "Easy transport"],
    text: "Ticket staff walked me to the right ferry gate.",
    traveller: "Solo traveller",
  },
];

async function seed() {
  console.log(`Attempting to seed ${seedExperiences.length} experiences...`);
  
  const { data, error } = await supabase
    .from('experiences')
    .insert(seedExperiences)
    .select();
  
  if (error) {
    console.error("Error inserting seed data:", error);
  } else {
    console.log(`Successfully inserted ${data?.length || 0} rows into the experiences table.`);
  }
}

seed();
