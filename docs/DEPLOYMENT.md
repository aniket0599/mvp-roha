# Deploying Around — always-on URL (Vercel + Supabase)

This is the durable setup: a permanent `https://…vercel.app` URL that stays up
without your laptop, backed by a shared Supabase (Postgres) database so people
on different phones see each other's profiles in real time.

Estimated time: **~15 minutes.** You'll need free accounts on
[Supabase](https://supabase.com) and [Vercel](https://vercel.com).

---

## Overview

```
Phone ──scan QR──▶ https://mvp-roha.vercel.app/join/blue-tokai-gurgaon
                          │
                   Next.js on Vercel  ──▶  Supabase (Postgres)
                                            profiles · events · connections
```

The app already contains both a Supabase adapter and the SQL schema. It switches
from the in-memory store to Supabase **automatically** the moment the
`SUPABASE_URL` environment variable is present — no code changes needed.

---

## Step 1 — Get the code onto `main`

Vercel deploys from a branch. Merge the `around-mvp` branch into `main` (via a
Pull Request on GitHub, or ask me to merge it). After merging, `main` holds the
full app.

## Step 2 — Create the Supabase project

1. Go to <https://supabase.com/dashboard> → **New project**.
2. Name it (e.g. `around`), pick a region close to the venue (e.g. Mumbai /
   Singapore), set a database password, and create it.
3. Wait ~2 min for it to provision.

## Step 3 — Create the database tables

1. In the Supabase dashboard: **SQL Editor** → **New query**.
2. Open [`supabase/schema.sql`](../supabase/schema.sql) from this repo, copy its
   entire contents, paste into the editor, and click **Run**.
3. You should see the `spaces`, `profiles`, `analytics_events`, and
   `connections` tables under **Table Editor**. (They start empty — the app
   seeds the Blue Tokai venue + 14 profiles on first visit.)

## Step 4 — Grab the two keys

In the Supabase dashboard → **Project Settings** → **API**:

| Copy this | Into env var |
|---|---|
| **Project URL** (e.g. `https://abcd.supabase.co`) | `SUPABASE_URL` |
| **service_role** secret key (under *Project API keys*) | `SUPABASE_SERVICE_ROLE_KEY` |

> The service-role key is a **secret** — it's only ever used server-side by the
> app. Never commit it or expose it in the browser.

## Step 5 — Deploy on Vercel

1. Go to <https://vercel.com/new> and **Import** the `aniket0599/mvp-roha` repo
   (authorise Vercel to access your GitHub if asked).
2. Framework preset auto-detects **Next.js** — leave the build settings default.
3. Before deploying, expand **Environment Variables** and add:
   - `SUPABASE_URL` = your Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your service_role key
   - *(recommended)* `ADMIN_PASSWORD` = a strong password — password-protects the
     research dashboard (`/admin/<venue>`) and the reset action. Without it the
     dashboard is open to anyone with the link.
4. Click **Deploy**. In ~1 minute you get a URL like
   `https://mvp-roha.vercel.app`.

## Step 6 — Wire up the QR + verify

- **Participant / QR target:** `https://mvp-roha.vercel.app/join/blue-tokai-gurgaon`
- **Research dashboard:** `https://mvp-roha.vercel.app/admin/blue-tokai-gurgaon`

Open the participant URL on your phone, create a profile, then open it on a
second device — you should see the first profile appear. That confirms Supabase
is live and shared.

---

## After it's live

- **New QR code:** regenerate the QR against the Vercel URL (ask me, or use any
  QR generator). Unlike the tunnel URL, this one never changes.
- **Custom domain:** Vercel → Project → **Domains** to add e.g. `around.app`.
- **Reset between experiments:** the dashboard's "Reset experiment data" button
  clears participant profiles/events/connections but keeps the seed regulars.
- **Adding more venues:** add another row to `SEED_SPACES` in
  [`src/lib/seed.ts`](../src/lib/seed.ts) (a new `venueId` slug + name), redeploy,
  and its QR is `…/join/<new-slug>`.

## Costs

Both free tiers comfortably cover a single-café experiment:
- **Vercel** Hobby: free for personal projects.
- **Supabase** Free: 500 MB database, plenty for thousands of profiles/events.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Dashboard shows data resetting / phones don't see each other | `SUPABASE_URL` isn't set on Vercel — the app fell back to in-memory. Add the env vars and redeploy. |
| Build fails on Vercel | Ensure you deployed the merged `main` (not the empty initial commit). |
| "unknown venue" page | The venue slug in the URL must match a `venueId` in `src/lib/seed.ts` (default `blue-tokai-gurgaon`). |
| Tables empty after deploy | They seed on the first request to a venue page — just open `/join/blue-tokai-gurgaon` once. |
