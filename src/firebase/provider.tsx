'use client';
import {useContext, createContext} from 'react';
import type {Auth} from 'firebase/auth';
import type {FirebaseApp} from 'firebase/app';
import type {Firestore} from 'firebase/firestore';

export interface FirebaseProviderProps {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  children?: React.ReactNode;
}

const FirebaseContext = createContext<FirebaseProviderProps | null>(null);

export function FirebaseProvider(props: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={props}>
      {props.children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);

  if (context === null) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  return useFirebase().app;
}

export function useAuth() {
  return useFirebase().auth;
}

export function useFirestore() {
  return useFirebase().firestore;
}
