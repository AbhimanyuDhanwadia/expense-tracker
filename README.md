# Expense Tracker

A production-ready React expense tracker that runs locally today and is structured for deployment later.

## What It Does

- Tracks expenses, refunds, and income/paydays.
- Supports Google sign-in through Firebase Auth.
- Syncs signed-in user data to Firestore under `users/{uid}/tracker/state`.
- Keeps guest data local to the browser.
- Exports tracker data as CSV.
- Includes responsive dashboard navigation for mobile and desktop.

## Tech Stack

- React 19
- Vite 6
- TypeScript
- Tailwind CSS 4
- Firebase Auth and Firestore
- date-fns

## Setup and Running Locally

Please see the [RUNNING.md](RUNNING.md) file for detailed instructions on how to set up the project locally in either Guest Mode or Cloud Sync Mode.

## Firebase Setup (For Production/Sync)

Enable these Firebase products before using sign-in and sync:

- Authentication: Google provider
- Firestore database

Deploy `firestore.rules` to restrict tracker data to the authenticated owner.

## Scripts

- `npm run dev` - start the local Vite server on port 3000.
- `npm run build` - create a production build.
- `npm run preview` - preview the production build locally.
- `npm run lint` - run TypeScript checks.
- `npm run clean` - remove generated build output.

## Deployment Notes

The app is client-only and can be deployed to Firebase Hosting, Vercel, Netlify, Cloudflare Pages, or any static host. Set the `VITE_FIREBASE_*` environment variables in the target platform before building.
