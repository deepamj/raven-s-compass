import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const seedPlaces = [
  { id: "munnar-bus-stand", name: "Munnar Bus Stand", area: "Munnar", lat: 10.0889, lng: 77.0595 },
  { id: "aluva-railway-station", name: "Aluva Railway Station", area: "Aluva", lat: 10.1065, lng: 76.3521 },
  { id: "vagamon-meadows", name: "Vagamon Meadows", area: "Vagamon", lat: 9.6854, lng: 76.9059 },
  { id: "kochi-boat-jetty", name: "Kochi Boat Jetty", area: "Kochi", lat: 9.9312, lng: 76.2673 },
];

async function seed() {
  console.log(`Attempting to seed ${seedPlaces.length} places...`);
  
  const { data, error } = await supabase
    .from('places')
    .insert(seedPlaces)
    .select();
  
  if (error) {
    console.error("Error inserting seed data:", error);
  } else {
    console.log(`Successfully inserted ${data?.length || 0} rows into the places table.`);
  }
}

seed();
