# SkillSphere — Frontend (React + Vite + Tailwind)

Frontend-only implementation of the SkillSphere hyperlocal freelance marketplace,
built from the Nayoda project brief. No backend — all data is mocked in
`src/data/mockData.js` so every screen is fully browsable.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build -> dist/
```

## Design system

- Colors: black `#000000`, slate `#34434E`, steel `#808080`, mist `#D3D3D3`, paper `#FFFFFF`
  (see `tailwind.config.js` — matches the supplied palette image)
- Type: Space Grotesk (display), Inter (body), JetBrains Mono (data/labels)
- Sharp corners, hairline borders, no drop shadows — minimalist editorial style

## Pages included

- Marketing: Home, How It Works, Pricing, Login (role select + 2FA), Register (role select)
- Marketplace: gig/freelancer search with filters, Gig detail + proposal flow, Public freelancer profile
- Client: Overview, My Gigs, Post a Gig (multi-milestone), Payments/Escrow, Messages
- Freelancer: Overview, My Proposals, My Profile (editable), Availability scheduler, Earnings & analytics, Messages
- Admin: Overview, Users, Verifications queue, Gig monitoring, Dispute resolution, Analytics

Routing uses `react-router-dom` (HashRouter, so it also works from a static file server).
Charts via `recharts`. Icons via `lucide-react`.
