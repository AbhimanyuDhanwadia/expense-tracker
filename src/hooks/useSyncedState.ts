import { useCallback, useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';

type SyncedStateMeta = {
  error: string | null;
  isRemote: boolean;
  loading: boolean;
};

type Setter<T> = T | ((currentValue: T) => T);

const LOCAL_PREFIX = 'expense-tracker';

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch (error) {
    console.warn(`Unable to read ${key} from local storage`, error);
    return fallback;
  }
}

function writeStoredValue<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to write ${key} to local storage`, error);
  }
}

export function useSyncedState<T>(key: string, initialValue: T) {
  const { user, isGuest } = useAuth();
  const userId = user?.uid;
  const [defaultValue] = useState(initialValue);

  const localStorageKey = useMemo(() => {
    if (isGuest) return `${LOCAL_PREFIX}:guest:${key}`;
    if (userId) return `${LOCAL_PREFIX}:user:${userId}:${key}`;
    return `${LOCAL_PREFIX}:anonymous:${key}`;
  }, [isGuest, key, userId]);

  const [storedValue, setStoredValue] = useState<T>(() =>
    readStoredValue(localStorageKey, readStoredValue(key, defaultValue)),
  );
  const [meta, setMeta] = useState<SyncedStateMeta>({
    error: null,
    isRemote: false,
    loading: Boolean(userId && !isGuest),
  });

  useEffect(() => {
    const localValue = readStoredValue(localStorageKey, readStoredValue(key, defaultValue));

    if (!userId || isGuest) {
      setStoredValue(localValue);
      setMeta({ error: null, isRemote: false, loading: false });
      return undefined;
    }

    setMeta({ error: null, isRemote: true, loading: true });

    const trackerDoc = doc(db, 'users', userId, 'tracker', 'state');

    return onSnapshot(
      trackerDoc,
      async (snapshot) => {
        const data = snapshot.data();

        if (snapshot.exists() && data && key in data) {
          const remoteValue = data[key] as T;
          setStoredValue(remoteValue);
          writeStoredValue(localStorageKey, remoteValue);
          setMeta({ error: null, isRemote: true, loading: false });
          return;
        }

        const seedValue = localValue;
        setStoredValue(seedValue);
        writeStoredValue(localStorageKey, seedValue);
        setMeta({ error: null, isRemote: true, loading: false });

        try {
          await setDoc(
            trackerDoc,
            {
              [key]: seedValue,
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          );
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to seed remote data';
          setMeta({ error: message, isRemote: true, loading: false });
        }
      },
      (error) => {
        setStoredValue(localValue);
        setMeta({ error: error.message, isRemote: false, loading: false });
      },
    );
  }, [defaultValue, isGuest, key, localStorageKey, userId]);

  const setValue = useCallback(
    (value: Setter<T>) => {
      setStoredValue((currentValue) => {
        const nextValue =
          value instanceof Function ? (value as (currentValue: T) => T)(currentValue) : value;

        writeStoredValue(localStorageKey, nextValue);

        if (userId && !isGuest) {
          const trackerDoc = doc(db, 'users', userId, 'tracker', 'state');
          void setDoc(
            trackerDoc,
            {
              [key]: nextValue,
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          ).catch((error) => {
            const message = error instanceof Error ? error.message : 'Unable to sync remote data';
            setMeta({ error: message, isRemote: false, loading: false });
          });
        }

        return nextValue;
      });
    },
    [isGuest, key, localStorageKey, userId],
  );

  return [storedValue, setValue, meta] as const;
}
