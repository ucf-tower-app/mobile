import { IToastProps, useToast } from 'native-base';
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
export const useEarlyLoad = (timeoutMs: number = 80) => {
  const [isEarly, setIsEarly] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsEarly(false), timeoutMs);
    return () => clearTimeout(timeout);
  }, [timeoutMs]);

  return isEarly;
};

const genericToastParams: IToastProps = {
  title: 'Oops, we encountered an unexpected error. Please try again.',
  placement: 'top',
};
export const useGenericErrorToast = () => {
  const toast = useToast();
  return () => toast.show(genericToastParams);
};
