# Serendipity (working name: Around) — Product Brief, Current Build (v1)

_Status snapshot of what is built and live. Source of truth for the code is
`github.com/aniket0599/mvp-roha` (`main`). Live app: https://mvp-roha.vercel.app._

---

## 1. What it is

A mobile web app that shows people who is in the same physical place as them,
based on what those people have chosen to share. A visitor scans a venue QR code,
opts in, and sees contextual profiles of other opted-in people: interests, what
they're doing right now, what they'd like to talk about, and what they have in
common with the viewer.

Tagline: **"There's more to the people around you."**

It is an **experiment**, not a finished product.

## 2. Hypothesis being tested

> People around us are far more interesting than the limited information we
> normally have about them. Contextual information about nearby people reduces
> social uncertainty and makes mutually welcomed real-world interaction more likely.

Behavioural funnel the product is instrumented to measure:

```
People visible → Profile viewed → Curiosity → Intent to approach
   → Conversation → Connection / repeat interaction
```

Explicitly NOT optimised: downloads, followers, likes, time spent in app.

## 3. Principles (non-negotiable)

1. **Reveal, don't prescribe** — never tell people who to meet.
2. **Reduce uncertainty, don't manufacture consent** — never "this person wants to talk to you". Show "open to meeting people" or "you share an interest".
3. **Context over demographics.**
4. **Conversation over matching** — no compatibility score.
5. **The app should disappear when humans connect** — no in-app chat, no engagement loops.
6. **Opt-in only** — physical presence never makes anyone visible.
7. Never infer or display: attraction, emotion, relationship status, willingness to interact, exact location.

## 4. User flow (participant)

1. Scan venue QR → `/join/<venue>` ("You're at Blue Tokai"; Join / Stay private; privacy note).
2. Profile creation (~60s): name, age, profession, 3–5 interests, current activity, "something interesting", "ask me about", looking-for (multi), social mode.
3. "You're in." interstitial → See who's around.
4. **People Around You** grid: context-first cards, no swiping, emoji avatars (photos not prioritised).
5. **Person detail**: Right now, Recently, Interested in, Ask me about, social mode.
6. **Why you might want to talk**: shared-context bullets (keyword/interest based), plus a "possible opening".
7. **Conversation catalysts**: 2–3 natural open questions per shared topic. Nothing is sent automatically.
8. Optional **record interaction** (had a conversation / exchanged contact / made plans / found common interest / want to see again / other) + note → **Connections** log.
9. **Profile & privacy**: change social mode, hide (become invisible), edit profile, leave the space.

Social modes: 🟢 Open to meeting people · 🟡 Open if approached · ⚪ Just here for myself.

## 5. Multi-facility model

The same profile signals are collected everywhere. Each venue has a **facility
type** that changes only *prioritisation and copy*. Each venue has its own QR slug,
people, dashboard and data.

| Facility type | Leads with | Discovery title |
|---|---|---|
| cafe | books, coffee, travel, startups, philosophy; "Ask me about" | People around you |
| library | books, writing, philosophy, film | Readers around you |
| gym | fitness, running; "Looking for"; Recently emphasised | People training near you |
| run_club | running, fitness, travel; "Looking for"; Recently emphasised | Runners around you |
| bar | music, food, travel, film | People around you |
| social (event) | startups, technology, art, writing; Recently emphasised | People at this event |
| club | music, art, film; interests lead | People around you |

What a facility changes: screen titles, tagline, landing banner, which now-lines lead
on a card, which tag group leads, discovery-grid ordering, weighting of "why you might
want to talk" and conversation catalysts, onboarding prompts, whether "Recently"
leads the detail page.

Seeded venues (each with 5–14 fictional sample people):

| Venue | Slug | Type |
|---|---|---|
| Blue Tokai | `blue-tokai-gurgaon` | cafe |
| Champaca | `champaca-library` | library |
| Iron House | `iron-house-gym` | gym |
| Gurugram Run Club | `gurugram-run-club` | run_club |
| Social House | `social-house-bar` | bar |
| Founders Mixer | `founders-mixer` | social |

This venue → facility-config seam is where a future geolocation product would
switch automatically (map location → facility type → prioritisation).

## 6. Founder / researcher tools

- `/admin/<venue>` research dashboard (password gate via `ADMIN_PASSWORD`): participants, space joins, profiles viewed, unique profile views, curiosity actions, interactions, connections, funnel bars, participant list, reset-experiment button. Auto-refreshes every 10s.
- `/venues` overview of all facilities and their join/dashboard links.
- Anonymous analytics events: `space_joined`, `profile_created`, `people_screen_viewed`, `profile_viewed`, `shared_interest_viewed`, `conversation_catalyst_viewed`, `curiosity_selected`, `interaction_recorded`, `contact_exchanged`, `connection_created`. Each carries anonymous user id, venue id, timestamp, optional target profile id and category.

## 7. Tech and architecture

- Next.js 14 (App Router), TypeScript, Tailwind. Design: "Urban Humanist" (Playfair Display + Hanken Grotesk; forest green `#173124` on oatmeal `#fcf9f8`, terracotta accent). Mobile-first.
- Identity: anonymous `httpOnly` cookie id set by middleware. No accounts.
- Data layer behind a `DataStore` interface: in-memory seeded store (zero-config, local) or Supabase/Postgres (auto-selected when `SUPABASE_URL` is set). Tables: `spaces`, `profiles`, `analytics_events`, `connections`.
- Hosting: Vercel (always on) + Supabase project `around` (ap-south-1, Mumbai).
- Env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`.
- Key code: `src/lib/facilities.ts` (facility configs), `src/lib/prioritize.ts` (ordering), `src/lib/matching.ts` (shared context + catalysts), `src/lib/seed.ts` (venues + sample people), `src/lib/store/*` (adapters), `supabase/schema.sql`.
- Docs: `docs/DEPLOYMENT.md` (Vercel + Supabase + multi-facility).

## 8. Deliberately not built

Swiping/dating, matching, compatibility score, messaging, followers, likes, popularity,
AI chatbot, computer vision, facial recognition, auto-approachability, GPS tracking,
push notifications, feed, stories, content creation, payments, subscriptions, ads.

## 9. Known gaps and risks

- Seed people are fictional and appear alongside real participants; needs a decision (hide/remove per venue for real tests).
- Shared context is keyword/interest matching only; can miss nuance or false-match.
- No presence expiry: a profile stays "here" until the person hides/leaves. Stale visibility is a trust risk.
- Participants are on the honour system for being physically present (QR is the only gate; the link can be shared).
- No moderation, reporting or blocking.
- Emoji avatars only; no photos.
- Admin gate is a single shared password; analytics are aggregate, not per-session replay.
- Seed people can't be reset/edited from the UI (code change required).
- Service-role key is server-side only; rotate if ever exposed.
- Free-tier cold starts on first visit after idle.
- Safety/consent review needed before scaling beyond friendly pilots.

## 10. Open questions for the next phase

- Which of the six facility types should be tested first, and with whom?
- What counts as success per venue (e.g. % of profile viewers who record an interaction)?
- Should real venues launch empty, with seed profiles, or with founder-recruited participants?
- Presence model: auto-expire after N hours? Check-out prompt?
- What per-facility signals are missing (e.g. pace for run clubs, reading list for libraries)?
- How should the geolocation switch work later (map → venue → facility config)?
- Naming: Serendipity vs Around.

## 11. Suggested next work

1. Presence expiry / check-out.
2. Option to launch a venue without seed profiles; admin tools to manage venues and test profiles.
3. Per-facility dashboards comparing funnels across venue types.
4. Venue creation without a code change (admin UI + `spaces` rows).
5. Report/block and basic moderation.
6. Printable QR cards per facility.
