# SkillSphere — Backend API (MERN)

Node.js/Express + MongoDB (Mongoose) backend implementing every module from
the SkillSphere project brief: multi-role auth (JWT + Google OAuth + 2FA),
AI-assisted gig matching, milestone/escrow payments (Razorpay), real-time
chat (Socket.IO), weighted reputation with fraud-flagging, admin moderation,
and dispute resolution.

## Stack

| Concern           | Library |
|-------------------|---------|
| Server            | Express 4 |
| Database          | MongoDB Atlas via Mongoose 8 |
| Auth              | JWT (access + refresh), bcryptjs, Google OAuth (`google-auth-library`), email 2FA |
| Real-time         | Socket.IO 4 (chat, typing, read receipts, live notifications) |
| Payments          | Razorpay (escrow orders, signature verification, milestone release) |
| File storage      | Cloudinary + Multer (`multer-storage-cloudinary`) |
| Email             | Nodemailer |
| Security          | helmet, express-rate-limit, express-mongo-sanitize, cors |

## Project structure

```
src/
  config/         # db, cloudinary, razorpay, mailer connections
  models/         # Mongoose schemas (11 collections)
  middleware/      # auth, error handling, upload, rate limiting
  controllers/     # business logic per resource
  routes/          # REST endpoint definitions
  sockets/         # Socket.IO connection + event handlers
  utils/           # token signing, AI matching engine, reputation engine, seed script
  app.js           # Express app (middleware + routes)
  server.js        # HTTP + Socket.IO bootstrap
```

## Database collections (matches the brief 1:1)

`Users`, `Freelancers`, `Clients`, `Gigs`, `Proposals`, `Reviews`, `Messages`
(+ `Conversations`), `Payments`, `Notifications`, `Disputes`, `AdminLogs`.

`User` is the shared auth record (email, password, role, location, 2FA,
verification tokens). `Freelancer` and `Client` are 1:1 profile extensions
keyed by `user`, so role-specific fields don't bloat the auth table and
role-switching logic stays simple.

## Setup

```bash
cd skillsphere-backend
npm install
cp .env.example .env      # fill in Mongo URI, JWT secrets, Razorpay/Cloudinary/SMTP keys
npm run seed               # optional: populate demo data (3 freelancers, 1 client, 1 admin, 2 gigs)
npm run dev                 # nodemon on http://localhost:5000
```

Demo accounts after seeding (password for all: `Password123!`):
- `admin@skillsphere.io`
- `client@skillsphere.io`
- `ananya@skillsphere.io`, `rohan@skillsphere.io`, `simran@skillsphere.io`

## Auth flow

1. `POST /api/auth/register` — creates `User` + matching `Freelancer`/`Client` profile, sends a verification email.
2. `POST /api/auth/login` — verifies credentials; if 2FA is enabled, returns `{ twoFactorRequired: true, userId }` instead of a token.
3. `POST /api/auth/login/verify-2fa` — completes login with the emailed 6-digit code, returns `accessToken` (body) + `refreshToken` (httpOnly cookie).
4. `POST /api/auth/refresh` — reads the refresh cookie, issues a new short-lived access token.
5. `POST /api/auth/google` — verifies a Google ID token client-side, creates/logs in the user.

Protect routes with the `Authorization: Bearer <accessToken>` header.

## AI matching engine

`src/utils/matchingEngine.js` scores each freelancer against a gig on a
0–100 scale, blending:

- **Skill similarity (50%)** — Jaccard overlap between gig-required and
  freelancer skills by default; if `HUGGINGFACE_API_KEY` is set, blends in a
  real sentence-embedding cosine similarity from
  `sentence-transformers/all-MiniLM-L6-v2` via the HF Inference API.
- **Reputation (25%)** — normalized rating average.
- **Proximity (15%)** — haversine distance between gig and freelancer geo
  points, linear falloff to 0 at 50 km.
- **Responsiveness (10%)** — based on historical average reply time.

Used by `GET /api/gigs/:id/recommended-freelancers` (client side) and
`GET /api/gigs/recommended/for-me` (freelancer side).

## Reputation engine

`src/utils/reputationEngine.js` computes a weighted reputation score instead
of a naive star average: verified-hire reviews count 2x, recent reviews
matter more than old ones (recency decay), a review-volume bonus rewards
consistency, and reviews flagged/hidden by the fraud heuristic are excluded.

## Escrow payment flow

1. `POST /api/payments/escrow/create-order` — client funds a milestone; creates a Razorpay order + a `Payment` record (`status: created`).
2. Client completes payment client-side with Razorpay Checkout.
3. `POST /api/payments/escrow/verify` — verifies the HMAC signature, flips the payment to `held` and the milestone to `in_progress`.
4. `POST /api/payments/escrow/release` — client approves the deliverable; funds move to `completed`, milestone to `paid`, freelancer notified in real time.
5. `POST /api/payments/escrow/refund` — admin-only, used after a dispute resolves in the client's favor.

## Real-time (Socket.IO)

Connect with `io(URL, { auth: { token: accessToken } })`. Events:

- `conversation:join` / `conversation:leave`
- `message:send` → broadcasts `message:new` to the conversation room
- `typing:start` / `typing:stop`
- `message:read` → broadcasts `message:read` with reader + message ids
- Server-pushed: `notification:new` (fired internally by controllers via `emitToUser()` whenever a proposal, payment, review, or dispute event happens — no client action required)

## Fraud detection (reviews)

A lightweight heuristic (`reviewController.detectSuspiciousReview`) flags —
but does not block — reviews that look low-effort or abnormally frequent
from the same author, surfacing them at `GET /api/reviews/flagged` for an
admin to hide via `PATCH /api/reviews/:id/hide`.

## Full route map

```
/api/auth            register, login, 2FA, google, verify-email, forgot/reset-password, refresh, logout, me
/api/freelancers      search, :userId profile, me/profile, me/portfolio, me/resume, me/verification, verifications/pending
/api/clients          me/profile, :userId, me/payment-methods
/api/gigs             CRUD, me/posted, recommended/for-me, :id/recommended-freelancers, :id/invite, :id/approve, :id/cancel
/api/proposals        create, me, gig/:gigId, :id/accept, :id/reject, :id/negotiate, :id/withdraw
/api/reviews          create, user/:userId, flagged (admin), :id/hide (admin)
/api/messages         conversations, conversations/:id, conversations/:id/messages
/api/payments         escrow/create-order, escrow/verify, escrow/release, escrow/refund, me, withdraw
/api/notifications    list, :id/read, read-all
/api/disputes         create, me, list (admin), :id/resolve (admin)
/api/admin            stats, users, users/:id/suspend, users/:id/reactivate, logs
```

## Notes / production TODOs

- Razorpay payouts to freelancers are recorded as ledger entries in this
  demo; wire up Razorpay Route/X for actual bank transfers.
- Redis is listed as optional caching in `.env.example` but not wired in —
  add it in front of `getGigs`/`searchFreelancers` if query volume grows.
- MongoDB Atlas Search or ElasticSearch can replace the basic `$text`
  indexes in `Gig`/`Freelancer` for fuzzier, ranked full-text search.
