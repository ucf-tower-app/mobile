import { IToastProps, useColorMode, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { Route as RouteObj } from '../xplat/types';
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

const genericErrorToastId = 'genericError';
const genericErrorToastParams: IToastProps = {
  title: 'Oops, we encountered an unexpected error. Please try again.',
  placement: 'top',
  id: genericErrorToastId,
};
export const useGenericErrorToast = () => {
  const toast = useToast();
  return () => {
    if (!toast.isActive(genericErrorToastId))
      toast.show(genericErrorToastParams);
  };
};

const offensiveLanguageToastId = 'offensiveLanguage';
const offensiveLanguageToastParams: IToastProps = {
  title: "Please don't use offensive language.",
  placement: 'top',
  id: offensiveLanguageToastId,
};
export const useOffensiveLanguageWarningToast = () => {
  const toast = useToast();
  return () => {
    if (!toast.isActive(offensiveLanguageToastId))
      toast.show(offensiveLanguageToastParams);
  };
};

export const useRouteQuery = (routeId: string | undefined) => {
  return useQuery(
    routeId !== undefined ? routeId : 'nullRouteQuery',
    routeId === undefined
      ? () => undefined
      : RouteObj.buildFetcherFromDocRefId(routeId),
    {
      enabled: routeId !== undefined,
    }
  );
};

export const useIconColor = () => {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? 'black' : 'gray';
};
