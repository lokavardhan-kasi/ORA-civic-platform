
'use client';
import {useState, useEffect, useMemo} from 'react';
import {doc, onSnapshot, type DocumentReference, type DocumentData} from 'firebase/firestore';
import {useFirestore} from '@/firebase';

// A utility hook to memoize document references, preventing re-renders
export const useMemoDoc = (path: string | null): DocumentReference | null => {
    const firestore = useFirestore();

    return useMemo(() => {
        if (!firestore || !path) return null;
        // This regex checks for an even number of segments, which is required for a doc path.
        // It prevents errors from paths like `/users` or `/posts/postId/votes`
        const segments = path.split('/').filter(Boolean);
        if (segments.length === 0 || segments.length % 2 !== 0) {
          return null;
        }
        return doc(firestore, path);
    }, [firestore, path]);
};


export function useDoc<T extends {id: string}>(
  ref: DocumentReference | null,
  initialData?: T
) {
  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
        // If the ref is null (e.g., user logged out), we shouldn't necessarily clear the data
        // if we have initial data. We just stop listening.
        setLoading(false);
        return;
    };

    setLoading(true);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({id: snapshot.id, ...snapshot.data()} as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Error listening to doc ${ref.path}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return {data, loading, error};
}
