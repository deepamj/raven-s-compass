import 'dotenv/config';
import { fetchRoutes, findRoute } from './src/lib/routes-store.ts';
import { supabase } from './src/lib/supabase.ts';

async function test() {
  await fetchRoutes();
  const route = findRoute(' Kochi  ', 'MUNNAR');
  console.log('Route matched:', route ? 'YES' : 'NO');
  if (route) {
    console.log('Stops count:', route.stop_ids.length);
    console.log('Cautions count:', route.caution_notes.length);
  }
  const noRoute = findRoute('Delhi', 'Mumbai');
  console.log('Delhi->Mumbai matched:', noRoute ? 'YES' : 'NO');
  process.exit(0);
}
test();
