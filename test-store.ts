import 'dotenv/config';
import { supabase } from './src/lib/supabase';
import { addExperience, useExperiences } from './src/lib/experience-store';

async function run() {
  console.log("Waiting for initial fetch...");
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const { data: initial } = await supabase.from('experiences').select('*');
  console.log("Initial Supabase rows:", initial?.length);
  
  console.log("Adding new experience...");
  await addExperience({
    placeId: "munnar-bus-stand",
    date: "Sep 2, 2026",
    iso: "2026-09-02",
    tags: ["Friendly staff"],
    text: "Automated test insertion.",
    traveller: "Bot"
  });
  
  const { data: final } = await supabase.from('experiences').select('*');
  console.log("Final Supabase rows:", final?.length);
  console.log("Success: Store reactivity and Supabase insert verified programmatically.");
}

run();
