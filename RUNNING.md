# Running Expensify Locally

This guide will walk you through setting up and running the Expensify app on your local machine.

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://127.0.0.1:3000`.

## Modes of Operation

### 1. Guest Mode (Local Storage)
By default, if you don't configure Firebase, the app runs in **Guest Mode**. 
- All data (expenses, refunds, etc.) is saved to your browser's local storage.
- You do not need any external database to test out the application.
- Simply click "Guest Access" on the landing page to begin.

### 2. Cloud Sync Mode (Firebase)
To enable Google Sign-In and cross-device syncing, you need to set up a Firebase project:

1. Create a project at the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** and **Authentication** (Google Provider).
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your `.env` file with the configuration keys from your Firebase project settings:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-web-app-id"
   VITE_FIREBASE_MEASUREMENT_ID=""
   VITE_FIRESTORE_DATABASE_ID="(default)"
   ```
5. Restart the development server. The "Log in" options will automatically appear on the Landing Page.

### 3. Local Emulator Suite (Temporary Database)
If you want to test the full sign-in and cloud database capabilities completely locally without configuring a real Firebase project yet, you can use the Local Emulator Suite.

1. Install Java (required by Firebase emulators).
2. Set the emulator flag in your `.env` file:
   ```env
   VITE_USE_EMULATORS=true
   ```
3. Run the development server and emulators together:
   ```bash
   npm run dev:emulators
   ```
   - The app will run at `http://127.0.0.1:3000`.
   - The Emulator UI will be available at `http://localhost:4000`.
   - You can click "Log in" and create fake user accounts that live purely in your local emulator!

## Building for Production
To build the application for deployment:
```bash
npm run build
```
This will create a `dist/` directory with static assets that can be hosted anywhere (Vercel, Netlify, Firebase Hosting, etc.).
