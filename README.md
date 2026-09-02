# Raven's Compass

Build the first working prototype of RAVEN as a responsive web app.

IMPORTANT:

This is a prototype for a hackathon. Prioritize a polished, convincing core experience over technical completeness.

DO NOT add authentication, login, signup, email collection, payment, chatbot, AI assistant, emergency-response functionality, unnecessary settings, dashboards, or other features not specified below.

Use local/mock data only for now. No backend is required.

PRODUCT

Raven is a journey-aware travel platform where women share recent, first-hand experiences about the places, services, and stops they encounter — so the next woman can know what to expect before she goes.

Core question:

"What did women experience, where, when, and how recently?"

The core user flow is:

HOME

→ Explore / Plan a trip

→ Journey

→ Place / Experience

→ Contribute an experience

Also allow the user to enter the contribution flow directly from Home.

DESIGN LANGUAGE

Mood:

- Editorial travel guide

- Trustworthy

- Warm

- Modern

- Human-curated

Raven should NOT look like:

- a SaaS dashboard

- an AI startup landing page

- generic AI-generated UI

- glassmorphism

- neon gradients

- huge rounded cards

- fake analytics

- excessive pills/badges

- excessive floating UI

- generic AI illustrations

Absolutely NO emojis or emoticons in the interface.

Typography:

- Elegant display typography for major headings and Raven branding

- Clean, highly readable body typography

- Use "Salva Rolla Demo" for Raven/logo/display heading typography if available.

- If the font is unavailable, use the closest elegant editorial serif/display alternative rather than a generic futuristic font.

Layout:

- Generous whitespace

- Asymmetric/editorial composition

- Strong visual hierarchy

- Map as a visual anchor on journey screens

- Small corner radii

- Thin borders

- Subtle shadows

- Minimal badges

- Avoid excessive card grids

COLOR SYSTEM

Light mode:

- Base: Cool Steel-inspired warm neutral/light palette

- Primary accent: Aquamarine, restrained and subtle

- Secondary accent: Dusty Mauve

Dark mode:

- Base: Gunmetal-inspired dark neutral

- Primary accent: Aquamarine

- Secondary accent: Dusty Mauve

Use green/red only when communicating meaningful positive/caution status.

Do not use green/red decoratively.

The overall interface should feel calm and trustworthy rather than brightly colorful.

IMAGERY

Use natural travel photography where appropriate.

Do NOT use generic AI-generated illustrations.

The contribution flow should include an optional photo upload area / placeholder for a future user-submitted travel photo. For this MVP, it does not need to actually persist the image; make the UI functional enough to demonstrate the intended interaction.

HOME

Create a minimal but distinctive Raven home screen.

Brand:

Raven

"Travel advice from women who've already been there."

Primary actions:

- Explore / Plan a trip

- Contribute

The home screen should not look like a generic SaaS landing page.

Add subtle atmospheric motion inspired by a flock of ravens/birds moving through the background if this can be implemented cleanly without hurting performance or readability.

The bird animation must be:

- subtle

- slow

- elegant

- non-distracting

- secondary to the content

Do NOT use a giant 3D globe or flashy WebGL background.

Do NOT let animation become the main visual feature.

JOURNEY SCREEN

Use this example journey throughout the prototype:

Kochi → Munnar

Show the route visually with stops such as:

Kochi → Aluva → Vagamon → Munnar

The route/map should be a strong visual anchor.

Show that Raven is journey-aware.

Include a clear section communicating:

"What women who travelled this route want you to know"

Example data:

- 8 community-recommended stops

- 15 recent experiences

- 2 caution notes

Show relevant stops along the journey.

Example:

Munnar Bus Stand

21 recent experiences

Last reported 2 days ago

Other stops can include:

Aluva Railway Station

Vagamon

etc.

Clicking a stop should open its Place / Experience view.

PLACE / EXPERIENCE SCREEN

Example:

Munnar Bus Stand

Heading:

"What we experienced"

Show:

Munnar

15 recent experiences

Make recency highly visible.

Example "Most mentioned" data:

Easy transport — 12 women

Friendly staff — 10 women

Crowded — 7 women

Isolated after dark — 4 women

Then show recent first-hand voices:

"Staff helped me find a shared taxi."

Aug 30 · Solo traveller

"Very crowded around 7 PM."

Aug 27 · Traveller

"Wouldn't wait here alone after 9 PM."

Aug 22 · Traveller

The design should communicate that Raven is surfacing first-hand community experiences, NOT generating an arbitrary safety score.

Do not create a "Safety Score".

The user should understand:

WHAT happened

WHERE it happened

WHEN it happened

HOW RECENT it is

CONTRIBUTE SCREEN

Heading:

"Tell other women what you experienced."

Fields:

Where did you go?

Example: Munnar Bus Stand

When?

Example: Aug 30, 2026

What would you tell other women?

Selectable experience tags:

- Clean restroom

- Friendly staff

- Felt safe

- Easy transport

- Solo-friendly

- Crowded

- Isolated after dark

Allow multiple selections.

Include an optional short text field:

"Anything else you'd like another traveller to know?"

Include an optional photo upload area:

"Add a photo"

This can be a prototype-only interaction and does not need persistent storage.

Primary CTA:

"Submit experience"

After submission, show a simple confirmation and make the newly submitted experience appear in the relevant local mock state if feasible.

MOCK DATA

Use coherent mock data rather than random filler.

The central example should remain:

Kochi → Munnar → Munnar Bus Stand.

Experiences should have:

- place

- date

- experience tags

- short first-hand text

- traveller context where appropriate

Do not invent fake analytics dashboards.

INTERACTION REQUIREMENTS

The prototype must have a coherent clickable flow:

Home

→ Explore / Plan a trip

→ Kochi → Munnar

→ Munnar Bus Stand

→ Place / Experience

→ Contribute

→ Submit

→ confirmation

The Explore flow should also allow navigating between journey stops.

Keep navigation simple and obvious.

RESPONSIVE DESIGN

This is a web app prototype.

Prioritize desktop presentation for the hackathon demo, while keeping layouts responsive enough to work on smaller screens.

Do not turn this into a native mobile-app UI.

FINAL DESIGN PRINCIPLE

The product should feel like:

"an editorial travel guide built from recent first-hand experiences of women"

not:

"an AI safety dashboard."

Use the attached wireframe as the primary structural reference.

Do not redesign the information architecture into a generic modern SaaS layout.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/539b6fae-2578-4df5-a47b-9f7cde4ca760).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
