# ShiftRate

> Know before you clock in.

Anonymous workplace reviews for restaurant and retail hourly workers — think Rate My Professor for shift-based jobs.

---

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS v3
- **Database + Auth**: Supabase
- **Deployment**: Vercel

---

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd shiftrate
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your **Project URL** and **anon public key** from `Settings → API`

### 3. Run the database schema

1. In Supabase, go to **SQL Editor**
2. Open and run the entire file: `supabase/schema.sql`

This will:
- Create all 4 tables (`businesses`, `reviews`, `owner_responses`, `owners`)
- Set up Row Level Security policies
- Seed 10 Seattle-area businesses with realistic reviews (including Poke Square in Ballard)

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run locally

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Deploy to Netlify

### Option A — Netlify CLI

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

### Option B — Netlify UI

1. Push to GitHub
2. Import repo in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Netlify → Site Settings → Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

`netlify.toml` handles SPA routing (all paths → `/index.html`).

---

## Database Schema

### `businesses`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| name | text | Business name |
| type | text | restaurant, retail, cafe, fast_food, grocery |
| address | text | Optional |
| city | text | |
| state | text | 2-letter code |
| claimed | boolean | Default false |
| owner_id | uuid | Nullable |
| created_at | timestamptz | |

### `reviews`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| business_id | uuid | FK → businesses |
| role | text | Server, Cook, Cashier, etc. |
| year_worked | text | 2025, 2024, ... Earlier |
| tip_pay_fairness | int | 1–5 |
| mgmt_respect | int | 1–5 |
| schedule_reliability | int | 1–5 |
| break_policy | int | 1–5 |
| overall | int | 1–5 |
| would_work_again | boolean | |
| review_text | text | 50–500 chars |
| status | text | pending, approved, rejected |
| published_at | timestamptz | Set to created_at + 24h for new reviews |

### `owner_responses`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| review_id | uuid | FK → reviews |
| business_id | uuid | FK → businesses |
| response_text | text | |
| created_at | timestamptz | |

### `owners`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| business_id | uuid | FK → businesses |
| email | text | Work email for verification |
| verified | boolean | Default false |
| created_at | timestamptz | |

---

## Business Logic

**Work Culture Score**
- Average all 5 rating categories per review
- Average across all approved reviews for the business
- Scale from 1–5 to 1–10 (multiply by 2)
- Color: green 8–10, yellow 6–7.9, red below 6

**Review Visibility**
- Only shows reviews where `status = 'approved'` AND `published_at <= now()`
- Business profile only shows reviews if there are **3 or more** (anonymity protection)
- Review count is always shown even below the threshold

---

## Pages

| Route | Page |
|-------|------|
| `/` | Home with search + filter feed |
| `/search` | Search results with filter pills |
| `/business/:id` | Business profile + reviews |
| `/review` | 3-step review flow |
| `/add-business` | Add new business form |
| `/claim` | Owner claim request form |

---

## Project Structure

```
src/
├── components/
│   ├── BusinessCard.jsx   # Business listing card
│   ├── Header.jsx         # Sticky nav
│   ├── Layout.jsx         # Page wrapper
│   ├── RatingBar.jsx      # Labeled progress bar
│   ├── ReviewCard.jsx     # Individual review
│   ├── ScoreBadge.jsx     # Numeric score badge
│   └── StarRating.jsx     # Interactive + display stars
├── lib/
│   └── supabase.js        # Client + shared utils
├── pages/
│   ├── AddBusiness.jsx
│   ├── BusinessProfile.jsx
│   ├── ClaimBusiness.jsx
│   ├── Home.jsx
│   ├── LeaveReview.jsx
│   └── Search.jsx
├── App.jsx                # Router
├── main.jsx
└── index.css              # Tailwind + global styles
supabase/
└── schema.sql             # Full schema + seed data
netlify.toml               # Netlify build + SPA redirect config
```
