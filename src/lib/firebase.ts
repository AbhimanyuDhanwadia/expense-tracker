import { FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import fallbackFirebaseConfig from '../../firebase-applet-config.json';

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackFirebaseConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || fallbackFirebaseConfig.measurementId,
};

const firestoreDatabaseId =
  import.meta.env.VITE_FIRESTORE_DATABASE_ID || fallbackFirebaseConfig.firestoreDatabaseId;

const missingFirebaseKeys = ['apiKey', 'authDomain', 'projectId', 'appId'].filter(
  (key) => !firebaseConfig[key as keyof FirebaseOptions],
);

const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true';

const isDummyConfig = firebaseConfig.apiKey === 'AIzaSyA20awLTBTCJ9fuSKl3zhTEa5uzcpVh0Fo' || firebaseConfig.apiKey === 'your-api-key';
export const isFirebaseReady = (missingFirebaseKeys.length === 0 && !isDummyConfig) || useEmulators;

if (!isFirebaseReady) {
  console.warn(`Firebase is not properly configured (missing or dummy keys). App will run in local-only Guest mode.`);
}

const isNewApp = getApps().length === 0;
const app = isFirebaseReady ? (isNewApp ? initializeApp(firebaseConfig) : getApp()) : null;

export const db = app ? (firestoreDatabaseId ? getFirestore(app, firestoreDatabaseId) : getFirestore(app)) : null;
export const auth = app ? getAuth(app) : null;
export const googleProvider = app ? new GoogleAuthProvider() : null;

if (useEmulators && isNewApp && db && auth) {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  console.log('Connected to Firebase Local Emulator Suite');
}
