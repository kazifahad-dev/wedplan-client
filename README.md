# WedPlan Client

**WedPlan** is a role-based wedding planning platform. Customers discover wedding services and send booking requests, vendors publish services and manage requests (with an optional Premium subscription), and admins moderate users, services and transactions.

This repository is the **client** (Next.js). The Express API lives in a separate repository.

## Live Links

| | Link |
|---|---|
| Live Website | [https://wedplan-client-puce.vercel.app](https://wedplan-client-puce.vercel.app) |
| Live API | [https://wedplan-server-tau.vercel.app](https://wedplan-server-tau.vercel.app) |
| Client Repository | https://github.com/kazifahad-dev/wedplan-client |
| Server Repository | https://github.com/kazifahad-dev/wedplan-server |

## Important Features

**Public**
- Home page with an animated hero banner, featured services (live from the database), service categories with live counts, "Why Choose WedPlan", "How WedPlan Works" and a vendor call to action.
- Browse Services page with search by name, category filter, location filter, price sorting (ascending and descending), pagination, and loading, empty and error states.
- Responsive navbar with an auth-aware profile dropdown (name, image, Dashboard, Profile Settings, Logout) that updates immediately after sign in or sign out, and a footer with description, links, contact details and social links.
- Custom 404 page.

**Authentication (Better Auth)**
- Email and password sign up with full name, optional profile image (uploaded to ImgBB), and role selection (Vendor or Customer).
- Password rule: at least 6 characters with one uppercase and one lowercase letter.
- Google sign in.
- Role-based redirect after sign in. Admin accounts cannot be created from the sign up page.
- Private routes redirect to Sign In and return the user to the page they wanted. Users stay signed in after a page refresh.
- Blocked users are redirected to a blocked-account page.

**Customer dashboard**
- Overview statistics (total, pending, accepted and rejected bookings).
- My Bookings with status filter, booking details and cancellation of pending requests.
- Profile Settings (name and image).

**Vendor dashboard**
- Overview: total services, active services, pending requests, accepted bookings and current plan.
- Add Service with image upload, My Services (edit, delete, availability toggle, approval status), Booking Requests (accept or reject).
- Subscription page with Free and Premium plans, and Stripe Checkout upgrade.
- Profile Settings (name, image and business name).

**Admin dashboard**
- Overview statistics, Manage Users (search, role filter, details, block and unblock), Manage Services (search, filter, approve, reject, change status, delete) and Transactions.

**Service details and booking**
- Service gallery with multiple images, vendor information and a booking dialog (event date, event location, message).
- Unauthenticated visitors are redirected to Sign In. Vendors cannot book their own services and admins cannot book at all.
- Invalid or unavailable services show a clear message.

**Quality**
- Responsive on desktop, tablet and mobile.
- Toast notifications for success and error feedback, with skeleton loaders while data loads.
- Role checks on the server side (guards in layouts) plus role verification on every protected API in the server repository.

## Technology Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS and ShadCN UI components
- Motion (Framer Motion) for animations
- Better Auth with MongoDB adapter, Google OAuth and the JWT plugin
- ImgBB for image hosting (uploaded through a server-side route so the key is never exposed)
- Stripe Checkout (created by the Express server)
- Sonner for toast notifications

## Installation Instructions

Requirements: Node.js 20 or newer, a MongoDB database, a Google OAuth client and an ImgBB API key. The WedPlan server must be running for data, bookings and payments.

```bash
git clone https://github.com/kazifahad-dev/wedplan-client.git
cd wedplan-client
npm install
```

Create a `.env.local` file in the project root (see **Environment Variables** below). Never commit this file.

## How to Run the Project Locally

1. Start the server from the server repository (it uses port 5000 by default).
2. Start the client:

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # run the production build
npm run lint     # lint the code
```

To get an admin account, sign up normally and then run `npm run make-admin -- your@email.com` in the server repository.

## Environment Variables

Create a `.env.local` file:

```env
# Server API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better Auth
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000

# MongoDB (use the same database as the server)
MONGODB_URI=your_mongodb_connection_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImgBB
IMGBB_API_KEY=your_imgbb_api_key
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Express server |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth to sign sessions. Generate a long random string |
| `BETTER_AUTH_URL` | Base URL of this client app |
| `MONGODB_URI` | MongoDB connection string. Must point to the same database the server uses |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `IMGBB_API_KEY` | ImgBB key, used only inside the server-side upload route |

Only `NEXT_PUBLIC_API_URL` is exposed to the browser. Stripe keys live only in the server repository. `.env.local` is ignored by Git and must never be pushed.

## Required Application URLs

| Item | URL |
|---|---|
| Local client | `http://localhost:3000` |
| Local server | `http://localhost:5000` |
| Google OAuth authorized redirect URI (local) | `http://localhost:3000/api/auth/callback/google` |
| Google OAuth authorized redirect URI (production) | `https://wedplan-client-puce.vercel.app/api/auth/callback/google` |
| Stripe success page | `/payment/success` |
| Stripe cancel page | `/payment/cancel` |

## Main Routes

| Route | Access |
|---|---|
| `/`, `/services`, `/sign-in`, `/sign-up` | Public |
| `/services/[id]` | Signed in |
| `/payment/success`, `/payment/cancel` | Signed in |
| `/dashboard/customer/*` | Customer only |
| `/dashboard/vendor/*` | Vendor only (overview, services, add service, booking requests, subscription, profile) |
| `/dashboard/admin/*` | Admin only (overview, users, services, transactions, profile) |

## Deployment Notes (Vercel)

- Add all environment variables above in the Vercel project settings, using the production URLs.
- Add the production Google redirect URI shown above in the Google Cloud console.
- Make sure the server's `CLIENT_URL` matches the deployed client URL exactly, to avoid CORS errors.
- Premium access is activated only by the verified Stripe webhook on the server. The success page only checks the result and never activates Premium itself.
