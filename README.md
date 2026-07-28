# RWH Assess TN 💧

Rainwater Harvesting Potential Assessment for Tamil Nadu — Phase 1 MVP.

Estimate annual harvestable rainwater from location + building details, get structure
recommendations, cost estimates, and a downloadable PDF report.

## Tech Stack

- **React 18** + **Vite** (JavaScript)
- **React Router** for navigation
- **Firebase** (Firestore + Auth) — optional; app falls back to local mode
- **jsPDF** + **jspdf-autotable** for PDF reports
- Plain CSS design system (responsive, mobile-first)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173. Works out of the box in **local mode** (no Firebase needed) —
assessments save to your browser, admin login uses passcode `admin123`.

## Enable Firebase (optional)

1. Create a project at https://console.firebase.google.com
2. Enable **Firestore** and **Authentication** (Email/Password).
3. Create an admin user under Authentication.
4. Copy `.env.example` → `.env` and fill the `VITE_FIREBASE_*` keys.
5. Deploy security rules from `firestore.rules`.
6. Restart `npm run dev`.

Admin login now uses the Firebase email/password you created.

## Features

| Feature | Where |
|---|---|
| Location select (district/taluk/village) + GPS | Assess → Step 1 |
| Building & site inputs | Assess → Steps 2–3 |
| Harvest calc (area × rainfall × runoff) | `src/lib/calc.js` |
| Recommendation engine (tank, pits, filter, pipe) | `src/lib/calc.js` |
| Itemised cost estimate | `src/lib/calc.js` |
| PDF report | `src/lib/pdf.js` |
| Save & history | `src/lib/store.js`, History page |
| Admin (rainfall/cost overrides, history) | Admin page |

## Calculation

```
Harvestable litres = Roof Area (m²) × Annual Rainfall (mm) × Runoff Coefficient
```

Runoff: RCC 0.85 · Tiled 0.75 · Metal 0.90 · Other 0.70.
Recharge feasibility scales with soil infiltration (sandy/red good, black/clay poor).

## Project Structure

```
src/
  data/tamilnadu.js     38 districts: rainfall, soil, taluks, centroids
  lib/calc.js           harvest / recommend / cost engine
  lib/pdf.js            PDF report generator
  lib/firebase.js       Firebase init (graceful fallback)
  lib/store.js          data layer (Firestore or localStorage)
  context/AuthContext   admin auth
  pages/                Home, Assess, Results, History, Admin, Login
  components/           Results, shared UI
```

## Build

```bash
npm run build      # -> dist/
npm run preview
```

## Roadmap (post-MVP)

Tamil language, AI roof detection, contractor marketplace, IoT tank monitoring,
district analytics dashboard. See project brief.

---
Estimates are indicative. Consult a certified RWH professional before implementation.
