import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const seedRoutes = [
  {
    from_text: "Kochi",
    to_text: "Munnar",
    distance: "128 km",
    typical: "4 h 20 m by road",
    stop_ids: [
      "kochi-boat-jetty",
      "aluva-railway-station",
      "vagamon-meadows",
      "munnar-bus-stand"
    ],
    caution_notes: [
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
    ]
  }
];

async function seed() {
  console.log(`Attempting to seed ${seedRoutes.length} routes...`);
  
  const { data, error } = await supabase
    .from('routes')
    .insert(seedRoutes)
    .select();
  
  if (error) {
    console.error("Error inserting seed data:", error);
  } else {
    console.log(`Successfully inserted ${data?.length || 0} rows into the routes table.`);
  }
}

seed();
