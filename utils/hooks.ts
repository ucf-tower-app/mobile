import { IToastProps, useToast } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Post, Route as RouteObj } from '../xplat/types';
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
 * Returns callback that takes in a list of posts and spits out the posts
 * that should be viewed by this client.
 */
export const useFilterPosts = () => {
  const { data: user } = useSignedInUserQuery();

  return useCallback(
    async (posts: Post[]) => {
      if (user === undefined) return [];

      // Get the data, so that `exists` is properly mapped for cache-invalidated data
      await Promise.all(posts.map((post) => post.getData()));

      // Filter out hidden data
      const shouldBeOmittedResults = await Promise.all(
        posts.map((post) => !post.exists || post.checkShouldBeHidden())
      );

      // Filter out blocked content
      const isBlockedContentResults = await Promise.all(
        posts.map((post) =>
          post.author === undefined
            ? false
            : user.userObject.isBlocked(post.author) ||
              post.author?.isBlocked(user.userObject)
        )
      );

      posts = posts.filter(
        (_, index) =>
          !(shouldBeOmittedResults[index] || isBlockedContentResults[index])
      );

      return posts;
    },
    [user]
  );
};
