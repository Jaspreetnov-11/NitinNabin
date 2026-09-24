# Nitin Nabin — profile site (Next.js + Supabase + Vercel)

Bilingual (EN / हिं) public-profile site, built from `nitinnabin-final.html`.
Content (updates, journey, gallery, social posts) comes from Supabase;
the contact form saves messages to Supabase. Deploys to Vercel in one click.

```
app/
  layout.tsx            fonts + metadata
  page.tsx              server component, fetches content (ISR every 60s)
  globals.css           all styles
  api/contact/route.ts  POST → contact_messages table
components/
  Site.tsx              the whole page (client: EN/HI toggle, journey year picker, updates marquee, social carousel, mobile tap-to-expand, bottom nav)
  ContactForm.tsx       contact form
  ScrollReset.tsx       fresh loads start at the top
lib/
  i18n.ts               static UI strings + bio/positions/facts (EN + HI)
  supabase.ts           Supabase clients
  data.ts               fetch content, falls back to seed if DB empty / not configured
  seed.ts               fallback content (same rows as supabase/seed.sql)
  format.ts             date formatting (EN / HI month names)
supabase/
  migrations/20260910000000_init.sql   tables + RLS
  seed.sql                             starter rows
  reset.sql                            drops all tables (dev / upgrade only)
.env.example
```

---

## 0. Sabse aasaan: `deploy.bat` (Windows, one click)

1. Supabase par ek naya project banao (https://supabase.com → New project). Bas itna hi, tables khud ban jaayengi.
2. `deploy.bat` double-click karo. Ye khud:
   - Node.js check karega (nahi hai to winget se install karega; phir bat dobara chalana hoga)
   - pehli baar 4 cheezein poochega aur `.env.local` bana dega:
     - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API
     - `SUPABASE_SERVICE_ROLE_KEY` — same page (optional)
     - `SUPABASE_DB_URL` — Project Settings → Database → Connection string → URI (Session pooler, port 5432), `[YOUR-PASSWORD]` ki jagah apna DB password
   - `npm install`
   - Supabase mein tables + policies banayega aur seed data daalega (`scripts/setup-db.mjs`)
   - `npm run build`
   - Vercel login (browser khulega), project link, env vars push, **production deploy**
3. Last line mein live URL milega.

Dobara chalane par sab kuch skip/reuse hota hai (tables `if not exists`, seed sirf khali DB par, Vercel project reuse). Code badla → `deploy.bat` phir chalao.

`SUPABASE_DB_URL` sirf local machine par rehta hai; Vercel par nahi jaata.

---

## 1. Supabase setup — manual (agar bat use nahi karna)

1. https://supabase.com → **New project** (region: Mumbai / Singapore).
2. Left sidebar → **SQL Editor** → **New query**.
3. Paste the whole of `supabase/migrations/20260910000000_init.sql` → **Run**.
4. New query → paste `supabase/seed.sql` → **Run**. (Starter content ab DB mein hai.)
5. **Project Settings → API** se copy karo:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (optional, server-only, kabhi browser/GitHub mein mat daalo)

> Pehle wala (v1) schema already run kar chuke ho? Pehle `supabase/reset.sql` chalao, phir step 3–4.

## 2. Vercel deploy (3 min)

1. Is folder ko GitHub repo mein push karo (ya `vercel` CLI se seedha deploy).
2. https://vercel.com/new → **Import** repo. Framework auto-detect: **Next.js**. Build command / output default rehne do.
3. **Environment Variables** mein teeno keys daalo (upar wale naam se). Production + Preview dono select karo.
4. **Deploy**. Bas.

Baad mein content badalne par redeploy ki zaroorat nahi — page har 60 seconds mein Supabase se fresh data uthata hai (`revalidate = 60` in `app/page.tsx`).

## 3. Local run

```bash
npm install
cp .env.example .env.local   # keys bharo
npm run dev                  # http://localhost:3000
```

Bina env keys ke bhi site chalti hai — tab `lib/seed.ts` ka fallback content dikhta hai.

## 4. Content update kaise karein

Supabase → **Table Editor**:

| Table | Section on site | Notes |
|---|---|---|
| `updates` | Latest updates (scrolling marquee) + top ticker | Newest `event_date` first. Max 8 shown. `summary_*` card ke andar ka chhota paragraph hai. |
| `milestones` | Journey (year picker + card) | `sort_order` se order; last wala default selected. `record_*` card ke neeche "Record —" line. |
| `gallery` | Photo record | Pehla item bada dikhta hai. 6 shown. `sub_*` chhota sub-caption. |
| `social_posts` | Official social media feed (carousel) | `platform` = `fb` / `x` / `ig` / `yt`. `label_*` = post ka tag (YouTube ke liye duration), `when_*` = date ya "3 days ago", `stats` = likes/views text. `post_url` do to "View on …" link us post pe jaata hai. |
| `contact_messages` | (inbox) | Contact form ke messages yahan aate hain. Public read nahi hai. |

Har content row mein `published` false karo to site se hat jaata hai. Har text ka `_en` aur `_hi` column hai.

**Static text** (bio, facts, positions, four areas, "From Bankipur to the national organisation", footer) `lib/i18n.ts` mein hai — wahan edit karke redeploy karo.

**Images:** abhi `image_url` nitinnabin.com se link hai. Apni images ke liye Supabase → **Storage** → public bucket (e.g. `media`) banao, upload karo, public URL copy karke `image_url` mein daalo.

## 5. Mobile app (`/app`)

`/app` par ek alag, app-jaisa mobile experience hai — same Supabase content, installable PWA (home screen par add karo, offline bhi chalta hai).

- Splash screen, stories (latest updates, tap / hold / swipe-down), "days as National President" live counter, count-up stats, flip cards
- Journey: scroll karte hi sticky year counter + progress bar badalta hai
- Feed: platform chips, double-tap like, share button (Web Share API)
- Photos: masonry grid + swipe lightbox
- Connect: social links, install button, contact form (`/api/contact`)
- EN / हिं toggle yaad rehta hai; desktop par phone frame mein dikhta hai

Files: `app/app/` (page + `app.css`), `components/app/`, `public/app.webmanifest`, `public/app-sw.js`, `public/app-icon*`.

## 6. Security notes

- Content tables: RLS on, sirf `published = true` rows public read. Insert/update sirf dashboard ya service-role key se.
- `contact_messages`: anon insert allowed, read sirf dashboard / service role. API route mein length limits + honeypot hai.
- `SUPABASE_SERVICE_ROLE_KEY` sirf Vercel env mein rakho, `NEXT_PUBLIC_` prefix kabhi mat lagao.

## 7. Optional next steps

- Admin panel (Supabase Auth + a `/admin` route) taaki team bina dashboard ke content edit kare.
- Email notification on new contact message (Supabase Database Webhook → Resend).
- Live social feeds: ek cron/Edge Function jo platform APIs se `social_posts` bhar de.
