# Around

> **There's more to the people around you.**

A contextual social‑discovery layer for physical spaces. A visitor scans a venue
QR code, opts into being discoverable, and sees the **contextual, human**
information about other people who have also chosen to be visible there — what
they're into, what they're doing right now, and why the two of you might have
something to talk about.

It is deliberately **not** a dating app, a feed, or a network. No swiping, no
matching scores, no messaging, no photos-first. The app's job is to reduce social
uncertainty and then **get out of the way** so the conversation can happen in
person.

This repository is the MVP built for the first real-world experiment (one coffee
shop: **Blue Tokai**).

---

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:3000** — you'll be routed to the Blue Tokai venue:

- Participant entry (the QR target): `/join/blue-tokai-gurgaon`
- People around you: `/space/blue-tokai-gurgaon`
- Research dashboard: `/admin/blue-tokai-gurgaon`

It runs with **zero configuration** — an in-memory store seeded with the venue
and 14 realistic regulars. (State resets when the server restarts. For a real
multi-device experiment, wire up Supabase — see below.)

Best viewed at an iPhone-sized viewport; the whole thing is mobile-first.

---

## The experience (the behavioural funnel)

```
Scan QR → land in venue → join (opt in) → 60-second profile
   → People Around You → open a profile
   → "Why you might want to talk" (shared context, never a score)
   → conversation catalysts (natural openers, not scripts)
   → talk in person → optionally record the interaction → Connections
```

Every step emits an anonymous analytics event so the founder can answer the core
question: *does richer contextual information change who people notice, who they
become curious about, and whether they start a real-world conversation?*

## Screens

| Route | What it is |
|---|---|
| `/join/[venue]` | Landing after scanning the QR — "You're at Blue Tokai", join or stay private |
| `/join/[venue]/create` | ~60-second profile creation |
| `/space/[venue]` | **People Around You** — the primary contextual discovery grid |
| `/space/[venue]/p/[id]` | Person detail + "Why you might want to talk" + conversation catalysts |
| `/space/[venue]/connections` | Lightweight shared-history log of people you've met |
| `/space/[venue]/profile` | Your profile + privacy controls (social mode, hide, leave) |
| `/admin/[venue]` | Research dashboard: live participant + funnel metrics |

## QR codes for the experiment

Point the physical QR card at the venue's join URL, e.g.
`https://YOUR-DEPLOY-URL/join/blue-tokai-gurgaon`. The venue slug in the path is
the only "location" the app uses — there is **no** GPS or automatic location
tracking.

---

## Tech

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with the *Urban Humanist* design system (Playfair Display +
  Hanken Grotesk; forest‑green / oatmeal / terracotta editorial palette)
- Swappable data layer: **in-memory (default)** or **Supabase / Postgres**
- Anonymous session via an `httpOnly` cookie (no accounts, no personal auth)

### Project layout

```
src/
  app/                     routes (participant screens, admin, API handlers)
  components/              UI (cards, forms, approach sheet, nav, …)
  lib/
    types.ts               domain model + option lists
    seed.ts                the Blue Tokai space + 14 seed profiles
    matching.ts            shared-context + conversation-catalyst logic
    store/                 DataStore interface, memory + supabase adapters
    analytics.ts           anonymous event tracking
supabase/schema.sql        Postgres schema for the Supabase adapter
design-reference/          original design mocks (not part of the build)
```

---

## Using Supabase (persistent, multi-device)

The in-memory store is perfect for local dev and demos, but state lives only in
the server process. For the real experiment — multiple phones seeing each other,
data that survives restarts and works across serverless instances — point the
app at Supabase:

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor.
3. Set the environment variables (see [`.env.example`](.env.example)):
   ```
   SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. Restart / redeploy. The app self-seeds the venue + sample regulars on first
   request if the tables are empty.

The store adapter is selected automatically: Supabase when `SUPABASE_URL` is set,
otherwise in-memory.

## Deploy

Deploys as a standard Next.js app (e.g. Vercel):

```bash
npm run build && npm start
```

Set the Supabase env vars in your host for a persistent experiment. Optionally
set `ADMIN_TOKEN` to gate the experiment-reset endpoint.

---

## Privacy by design

- Physical presence **never** makes you visible — you must explicitly opt in.
- Only information a participant intentionally provides is ever shown.
- The app never infers or displays attraction, emotion, relationship status, or
  "willingness to interact"; social mode only states how open someone is.
- A participant can hide, edit, change social mode, or leave the space at any
  time.
- Analytics are anonymous and aggregate: an anonymous id, venue, timestamp, and
  (optionally) a target profile id and category — nothing more.

## Analytics events

`space_joined`, `profile_created`, `people_screen_viewed`, `profile_viewed`,
`shared_interest_viewed`, `conversation_catalyst_viewed`, `curiosity_selected`,
`interaction_recorded`, `contact_exchanged`, `connection_created`.
