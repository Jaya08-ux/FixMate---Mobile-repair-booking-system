# FixMate mobile repair booking

A beginner-friendly Next.js App Router project with client booking, admin repair management, sign-in, MongoDB Atlas storage, and Vercel deployment settings.

## Requirements

- Node.js 20 or newer
- A MongoDB Atlas database (the Free cluster is enough for a class project)

## Run locally

1. Install packages: `npm install`
2. Copy `.env.example` to `.env.local`.
3. Add your MongoDB Atlas connection string to `MONGODB_URI`. Keep `MONGODB_DB=fixmate` or choose another database name.
4. Set a private `ADMIN_EMAIL` and strong `ADMIN_PASSWORD` in `.env.local`.
5. Start the site: `npm run dev`
6. Open `http://localhost:3000`.

## Try the project

- Home: `/`
- Sign in or create a client account: `/login`
- Client dashboard: `/client/dashboard`
- New booking: `/client/book`
- Admin dashboard: `/admin/dashboard`

Public sign-up creates client accounts. The admin account is created the first time you sign in with the credentials configured in `.env.local`. Clients can only read their own bookings; only admins can see the full queue and update booking status.

## MongoDB storage

Accounts, hashed passwords, sessions, and repair bookings are saved in MongoDB collections. The admin account is created on the first successful admin sign-in using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Keep `.env.local` private and never commit it.

## Deploy to Vercel for free

1. Create a free MongoDB Atlas cluster, database user, and connection string.
2. In Atlas Network Access, allow the Vercel app to connect. Vercel Functions do not have one fixed outbound IP on the Hobby plan; if you allow `0.0.0.0/0`, use a strong database password and a database user limited to read/write access on the FixMate database. Atlas warns that this network rule allows connections from any IP, so keep the URI secret.
3. Push this project to GitHub, then import the repository into Vercel. Vercel detects Next.js and deploys on each push.
4. In Vercel **Project → Settings → Environment Variables**, add `MONGODB_URI`, `MONGODB_DB`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` for Production (and Preview if you use preview deployments).
5. Redeploy and open the deployment URL. Create a client account, then sign in as admin using the configured admin email and password.

Vercel Hobby is free for personal, non-commercial projects. The MongoDB Atlas Free cluster is also free and has a 512 MB storage limit. Atlas Free clusters do not include standard backups, so keep copies of important data.

## Project structure

- `app/` contains pages, protected layouts, and API Route Handlers.
- `components/` contains shared navigation and booking UI.
- `lib/auth.js` manages password hashes, session cookies, and role checks.
- `lib/mongodb.js` connects to MongoDB Atlas.
- `lib/db.js` and `lib/bookings.js` handle database access and booking operations.
- `app/globals.css` contains responsive styling.
