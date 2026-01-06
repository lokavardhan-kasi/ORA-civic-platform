'use client';
import {useState, useEffect, useMemo} from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type Firestore,
  type Query,
  type QueryConstraint,
} from 'firebase/firestore';
import {useFirestore} from '@/firebase';

// A utility hook to memoize queries, preventing re-renders
export const useMemoQuery = (
  path: string,
  ...queryConstraints: QueryConstraint[]
): Query | null => {
  const firestore = useFirestore();
  // We stringify the constraints to create a stable dependency for useMemo.
  const constraintsJSON = useMemo(() => JSON.stringify(queryConstraints), [queryConstraints]);

  return useMemo(() => {
    if (!firestore) return null;
    
    return query(collection(firestore, path), ...queryConstraints);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, path, constraintsJSON]);
};


export function useCollection<T>(
  query: Query | null,
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setData([]); // Set to empty array if query is null
      return;
    };

    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => ({id: doc.id, ...doc.data()} as T)
        );
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return {data, loading, error};
}
