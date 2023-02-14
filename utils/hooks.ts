import { useEffect, useState } from 'react';

/**
 * Should be used to allow an early exit hatch for freshly rendered screens.
 *
 * Usage:
 *
 * const isEarly = useEarlyLoad();
 *
 * ...
 *
 * if (isEarly) return <Skeleton />;
 */
export const useEarlyLoad = () => {
  const [isEarly, setIsEarly] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsEarly(false), 80);
    return () => clearTimeout(timeout);
  }, []);

  return isEarly;
};
