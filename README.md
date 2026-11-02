# Raven

Travel advice from women who've already been there.

Raven is a journey-aware travel guide built from recent, first-hand experiences. It shows what happened, where, when, and how recently — without ratings or safety scores.

## Run locally

```sh
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

## Pages to try

- `/` — home and place search
- `/journey` — plan a route, with map, stat cards, stops, and caution notes
- `/place/fort-kochi-beach` — place page with recent reports, filters, and sorting
- `/contribute` — share an experience, with place suggestions and date shortcuts

Suggested flow: **Home → Explore / Plan a trip → Kochi → Munnar → a stop → Contribute**.

## Data

The app prefers Supabase when it is reachable. If it is not, it falls back to local seed data so the prototype still works. Locally added places, routes, and experiences last for the current session.

## Scripts

```sh
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the build
npm run lint     # lint
npm run format   # format with Prettier
```

## Built with

TanStack Start, React, Tailwind CSS, Leaflet, and Supabase. Connected to [Lovable](https://lovable.dev/projects/539b6fae-2578-4df5-a47b-9f7cde4ca760).
