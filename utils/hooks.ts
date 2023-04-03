import { IToastProps, useToast } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Comment, Post, Route as RouteObj } from '../xplat/types';
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

/**
 * Returns callback that takes in a list of posts and spits out
 * a list of true/false on whether or not the media at this index should be removed
 *
 * This seems obtuse, but it is the only way to get around Typescript's archaic handling
 * of union type filtering.
 */
export const useFindShouldBeFilteredIndices = () => {
  const { data: user } = useSignedInUserQuery();

  return useCallback(
    async (media: Post[] | Comment[]) => {
      if (user === undefined) return [];

      // Get the data, so that `exists` is properly mapped for cache-invalidated data
      await Promise.all(media.map((item) => item.getData()));

      // Filter out hidden data
      const shouldBeOmittedResults = await Promise.all(
        media.map((item) => !item.exists || item.checkShouldBeHidden())
      );

      // Filter out blocked content
      const isBlockedContentResults = await Promise.all(
        media.map((item) =>
          item.author === undefined
            ? false
            : user.userObject.isBlocked(item.author) ||
              item.author?.isBlocked(user.userObject)
        )
      );

      return shouldBeOmittedResults.map(
        (value, index) =>
          value === true || isBlockedContentResults[index] === true
      );
    },
    [user]
  );
};
