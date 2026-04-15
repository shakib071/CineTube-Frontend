# 🎬 CineTube — Frontend

The official frontend for **CineTube**, a full-featured movie and series streaming platform. Built with Next.js 16 (App Router), it supports browsing, reviewing, purchasing, and streaming content — with separate dashboards for users and admins.

---

## 🌐 Live URLs

| Service | URL |
|---|---|
| 🖥️ Frontend | `<!-- ADD FRONTEND LIVE URL HERE -->` |
| ⚙️ Backend API | `<!-- ADD BACKEND LIVE URL HERE -->` |

---

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Forms | TanStack Form |
| Data Fetching | TanStack Query (React Query v5) |
| HTTP Client | Axios (server-side, cookie-forwarding) |
| Auth | better-auth + custom JWT (access/refresh cookies) |
| Charts | Recharts |
| Notifications | Sonner (toast) |
| Theming | next-themes (dark/light/system) |
| Validation | Zod |
| Icons | Lucide React |

---

## ✨ Features

- **Home Page** — Hero section with featured media, Top Rated, Newly Added, Editor's Picks, Pricing, Newsletter, and Footer sections
- **Browse & Discover** — Browse all media, filter by genre, view movies or series separately, and see top-rated content
- **Media Details** — Full detail page with trailer, cast, synopsis, stream button, watchlist toggle, reviews, and comments
- **Authentication** — Register, login, logout, email verification, forgot password, and password reset flows
- **Google OAuth** — Sign in with Google via better-auth
- **Stream Button** — Smart streaming access based on pricing type (Free / Premium / Pay-per-view)
- **Subscriptions** — Monthly and Yearly subscription plans with Stripe Checkout
- **Pay-per-view** — Buy or Rent individual titles
- **Payment Pages** — Dedicated success and cancel pages after checkout
- **Watchlist** — Add/remove titles and view your personal watchlist
- **User Dashboard** — Overview, profile, purchase history, subscription status, and watchlist management
- **Admin Dashboard** — Platform stats, revenue chart (Recharts), media management (add/edit/delete), user management, reviews moderation, and newsletter management
- **Profile Page** — View and edit profile, change password modal
- **Dark / Light / System Theme** — Persistent theme toggle in navbar
- **Route Protection Middleware** — JWT-based middleware (`proxy.ts`) with role-based redirects, proactive token refresh, and email-verification guard
- **Responsive Navbar** — Desktop navigation menu + mobile sheet drawer with genre browsing
- **Custom 404 Page** — Branded not-found page

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (providers, fonts, toaster)
│   ├── globals.css                   # Global styles
│   ├── not-found.tsx                 # Custom 404 page
│   └── (commonLayout)/
│       ├── layout.tsx                # Shared layout (navbar)
│       ├── page.tsx                  # Home page
│       ├── (authRoutes)/
│       │   ├── login/                # Login page + server action
│       │   ├── register/             # Register page + server action
│       │   ├── logout/               # Logout page + server action
│       │   ├── forgot-password/      # Forgot password page
│       │   ├── reset-password/       # Reset password page
│       │   └── verify-email/         # Email verification page
│       ├── (dashboardRoutes)/
│       │   ├── admin/
│       │   │   ├── layout.tsx        # Admin layout (sidebar)
│       │   │   └── dashboard/
│       │   │       ├── page.tsx      # Admin overview + revenue chart
│       │   │       ├── media/        # Media management table
│       │   │       ├── add-media/    # Add new media form
│       │   │       ├── users/        # User management table
│       │   │       ├── reviews/      # Reviews moderation
│       │   │       └── newsletter/   # Newsletter subscribers
│       │   └── user/
│       │       ├── layout.tsx        # User layout (sidebar)
│       │       └── dashboard/
│       │           ├── page.tsx      # User overview
│       │           ├── profile/      # Profile page
│       │           ├── watchlist/    # Watchlist page
│       │           ├── subscription/ # Subscription status
│       │           └── purchase-history/ # Transaction history
│       ├── all-media/                # Browse all media
│       ├── movies/                   # Movies listing
│       ├── series/                   # Series listing
│       ├── top-rated/                # Top-rated media
│       ├── browse-genre/
│       │   └── [genre]/              # Genre-filtered media
│       ├── media-details/
│       │   └── [id]/                 # Media detail page + server actions
│       ├── watchlist/                # User watchlist
│       ├── subscription/             # Subscription plans + Stripe
│       ├── profile/                  # Public profile page
│       └── payment/
│           ├── success/              # Payment success page
│           └── cancel/               # Payment cancel page
├── components/
│   ├── layout/
│   │   ├── navbar.tsx                # Responsive navbar with genre menu
│   │   ├── adminSidebar.tsx          # Admin dashboard sidebar
│   │   ├── userSidebar.tsx           # User dashboard sidebar
│   │   └── modeToggle.tsx            # Dark/light theme toggle
│   ├── modules/
│   │   ├── admin/
│   │   │   ├── MediaForm.tsx         # Add/edit media form
│   │   │   └── RevenueChart.tsx      # Recharts bar chart
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   ├── ResetPasswordForm.tsx
│   │   │   ├── VerifyEmailForm.tsx
│   │   │   └── ChangePasswordModal.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx       # Featured media hero
│   │   │   ├── TopRatedSection.tsx
│   │   │   ├── NewlyAddedSection.tsx
│   │   │   ├── EditorPicksSection.tsx
│   │   │   ├── PricingSection.tsx    # Free / Monthly / Yearly plans
│   │   │   ├── NewsletterSection.tsx
│   │   │   ├── NewsletterForm.tsx
│   │   │   └── Footer.tsx
│   │   ├── media/
│   │   │   ├── MediaCard.tsx         # Reusable media card
│   │   │   ├── MediaGrid.tsx         # Grid with filters + pagination
│   │   │   ├── ReviewSection.tsx     # Reviews + comments
│   │   │   ├── StreamButton.tsx      # Smart play/buy/subscribe CTA
│   │   │   └── WatchlistButton.tsx   # Add/remove watchlist toggle
│   │   ├── profile/
│   │   │   ├── EditProfileModal.tsx
│   │   │   ├── EditProfileButton.tsx
│   │   │   └── ProfileActions.tsx
│   │   ├── subscription/
│   │   │   └── SubscriptionPlansClient.tsx
│   │   └── watchlist/
│   │       └── WatchlistRemoveButton.tsx
│   └── ui/                           # shadcn/ui component library
├── lib/
│   ├── axios/
│   │   └── httpClients.ts            # Cookie-forwarding Axios instance
│   ├── authUtils.ts                  # Role helpers, route ownership
│   ├── jwtUtils.ts                   # JWT verify helpers
│   ├── tokenUtils.ts                 # Token expiry check
│   ├── cookieUtils.ts                # Cookie read/write helpers
│   └── utils.ts                      # clsx/tw-merge utility
├── providers/
│   ├── QueryProvider.tsx             # TanStack Query client provider
│   └── theme-provider.tsx            # next-themes provider
├── services/
│   └── auth.service.ts               # Token refresh service call
├── types/
│   ├── api.types.ts                  # Generic API response shape
│   ├── media.types.ts                # Media, Genre, Platform types
│   ├── payment.types.ts              # Purchase, subscription types
│   ├── review.types.ts               # Review & comment types
│   ├── stat.types.ts                 # Admin stats types
│   ├── user.types.ts                 # User & auth token types
│   └── wathlist.types.ts             # Watchlist types
├── zod/
│   └── auth.validation.ts            # Auth form schemas
└── proxy.ts                          # Next.js middleware (auth guard)
```

---

## 📄 Pages & Routes

| Route | Description | Access |
|---|---|---|
| `/` | Home (hero, top-rated, pricing, newsletter) | Public |
| `/all-media` | Browse all movies & series | Public |
| `/movies` | Movies listing | Public |
| `/series` | Series listing | Public |
| `/top-rated` | Top-rated media | Public |
| `/browse-genre` | Genre index | Public |
| `/browse-genre/[genre]` | Media filtered by genre | Public |
| `/media-details/[id]` | Full media detail page | Public |
| `/subscription` | Subscription plans + Stripe | Public |
| `/payment/success` | Post-payment success | Public |
| `/payment/cancel` | Post-payment cancel | Public |
| `/login` | Login form | Guest only |
| `/register` | Register form | Guest only |
| `/forgot-password` | Forgot password | Guest only |
| `/reset-password` | Reset password (OTP) | Guest only |
| `/verify-email` | Email OTP verification | Guest only |
| `/logout` | Logout + redirect | Auth |
| `/profile` | Public user profile | Auth |
| `/watchlist` | User's watchlist | Auth |
| `/user/dashboard` | User overview | USER |
| `/user/dashboard/profile` | Profile settings | USER |
| `/user/dashboard/subscription` | Subscription status | USER |
| `/user/dashboard/purchase-history` | Transaction history | USER |
| `/user/dashboard/watchlist` | Watchlist management | USER |
| `/admin/dashboard` | Admin overview + revenue | ADMIN |
| `/admin/dashboard/media` | Media management | ADMIN |
| `/admin/dashboard/add-media` | Add new media | ADMIN |
| `/admin/dashboard/users` | User management | ADMIN |
| `/admin/dashboard/reviews` | Reviews moderation | ADMIN |
| `/admin/dashboard/newsletter` | Newsletter subscribers | ADMIN |

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# JWT secrets (must match backend)
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

# better-auth
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 20
- CineTube Backend running (see backend repo)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/shakib071/CineTube-Frontend.git
cd CineTube-Frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in the values in .env.local

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📦 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## 🔐 Auth & Middleware

Route protection is handled in `src/proxy.ts` (Next.js middleware). The rules are:

1. **Logged-in users** are redirected away from auth pages (`/login`, `/register`, etc.) to their dashboard
2. **Unverified users** are redirected to `/verify-email` before they can access protected routes
3. **Unauthenticated users** hitting a protected route are redirected to `/login?redirect=<path>`
4. **Role mismatch** — a `USER` visiting an `ADMIN` route (or vice versa) is redirected to their own dashboard
5. **Proactive token refresh** — if the access token is expiring soon, the middleware silently refreshes it using the refresh token cookie before the request continues

---

## 🎨 Theming

The app supports **light**, **dark**, and **system** themes via `next-themes`. The theme toggle is accessible in the navbar. All UI components use Tailwind CSS v4 with CSS variables for consistent theming across modes.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

