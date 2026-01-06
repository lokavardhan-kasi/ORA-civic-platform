'use client';
import {useEffect, useState} from 'react';
import type {Auth} from 'firebase/auth';
import type {FirebaseApp} from 'firebase/app';
import type {Firestore} from 'firebase/firestore';

import {FirebaseProvider, type FirebaseProviderProps} from '@/firebase/provider';
import {initializeFirebase} from '@/firebase';

export function FirebaseClientProvider({children}: {children: React.ReactNode}) {
  const [firebase, setFirebase] = useState<FirebaseProviderProps | null>(null);

  useEffect(() => {
    const apps = initializeFirebase();
    setFirebase(apps);
  }, []);

  if (!firebase) {
    // TODO: Add a loading spinner
    return null;
  }

  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}
