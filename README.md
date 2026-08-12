# Call Quality Dashboard — Artium Academy

No login, no database. Your Runo call data lives in a Google Sheet you
already paste into daily; this app reads it live and shows the dashboard.

## 1. How the sheet is read

Wired to your **"Runo Report"** sheet
(`1G4sYYU8gWXP557PWc6KdQAz29B40RBecSUsEtjyIu_Q`), tab **`Runo Report`**.

That tab holds one wide row per **agent per day**, exactly as Runo exports
it, appended below the previous day's rows. Each day's date sits once in
column A (a merged cell spanning that day's 4 rows) — the app carries that
date down across the following blank-column-A rows until the next date
appears, so you don't need to repeat it on every row. Just keep pasting
each new day's block below the last one, same as you already do.

Agent names are matched loosely (ignoring spaces/case, matching by name
prefix), so `Pooja Lakshmi`, `Devika Dev`, `Anuradha Sunil` etc. all match
the 4 people this app tracks: **Mahalakshmi** & **Poojalakshmi** (Alwarpet),
**Anuradha** & **Devika** (Thoraipakkam). A `Total` row at the end of a
day's block (if Runo adds one) is automatically skipped.

## 2. Share the sheet

File → Share → **Anyone with the link → Viewer**. The app only reads it,
never writes to it.

## 3. Push this code to GitHub

```bash
cd call-dashboard
git init
git add .
git commit -m "Call quality dashboard"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## 4. Deploy on Vercel

1. vercel.com → **Add New → Project** → import the repo you just pushed.
2. Before deploying, open **Environment Variables** and add:
   - `GOOGLE_SHEET_ID` = `1G4sYYU8gWXP557PWc6KdQAz29B40RBecSUsEtjyIu_Q`
   - `GOOGLE_SHEET_TAB_NAME` = `Runo Report`
3. Deploy. Whenever you update the Sheet, the live site reflects it within
   about a minute — no redeploy needed for data changes (only if you edit
   the code itself).

## Local development

```bash
npm install
cp .env.example .env.local   # already has your sheet ID filled in
npm run dev
```

## What's on each page

- **Overview** (`/`) — the 5 headline numbers (calls attempted/received,
  connected, connected %, avg talktime/call, total talktime) for whatever
  you've filtered to. Filters: Today / Yesterday / This week / Last week /
  This month / Last month / All time, or a custom date range; centre
  (Alwarpet / Thoraipakkam); person (all 4, or one); and call type
  (Inbound / Outbound / Both).
- **Person pages** (Mahalakshmi, Poojalakshmi, Anuradha, Devika in the top
  nav, or `/agents/mahalakshmi` etc.) — the same 5 numbers scoped to just
  that person, with the same date-range and call-type filters (no centre/
  person filter needed since the page is already scoped).

"Today" defaults to India time regardless of where the server actually
runs, so the Today/Yesterday/week/month buttons line up with your calendar.

No login exists anywhere — anyone with the app URL can view everything;
nobody can edit anything (editing only happens in the Sheet). If you later
want to restrict who can see it, Vercel's built-in password protection
(Project → Settings → Deployment Protection) is the simplest option.
