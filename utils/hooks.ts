import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userAtom } from './atoms';

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
export const useEarlyLoad = (timeoutMs: number = 80) => {
  const [isEarly, setIsEarly] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsEarly(false), timeoutMs);
    return () => clearTimeout(timeout);
  }, [timeoutMs]);

  return isEarly;
};

export const useSignedInUserQuery = () => {
  const signedInUser = useRecoilValue(userAtom);
  return useQuery(
    signedInUser !== undefined ? signedInUser.getId() : 'nullQuery',
    signedInUser === undefined ? () => undefined : signedInUser.buildFetcher(),
    { enabled: signedInUser !== undefined }
  );
};
