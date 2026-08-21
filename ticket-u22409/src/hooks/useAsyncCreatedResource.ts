import { useEffect, useRef } from 'react';

/**
 * Create and cleanup asynchronously-created resources that should be retained.
 */
export function useAsyncCreatedResource<T>(
  factory: () => Promise<T>,
  cleanup: (arg: T) => void
): Promise<T> {
  const prom = useRef(Promise.withResolvers<T>());

  useEffect(() => {
    const created = factory();

    prom.current.resolve(created);

    return () => {
      prom.current = Promise.withResolvers();

      created.then(cleanup);
    };
  }, [factory, cleanup]);

  useEffect(
    () => () => {
      prom.current.promise.catch(() => {});
      prom.current.reject('useAsyncCreatedResource hook unmounted');
    },
    []
  );

  return prom.current.promise;
}
