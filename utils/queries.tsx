import { useQuery } from 'react-query';
import {
  buildUserCacheMap,
  buildUserSubstringMatcher,
  getActiveRoutesCursor,
  getArchivedRoutesSubstringMatcher,
  getUserCache,
} from '../xplat/api';
import { Comment, FetchedRoute, Post, User } from '../xplat/types';

/**
 * When fetching active routes, use the provided cache key
 * so that active routes are fetched less often. We also eagerly
 * load all active routes here, as future cache results will simply
 * return the fully loaded routes at no extra cost
 */
export type FetchedActiveRoutes = {
  activeRoutes: FetchedRoute[];
};
export const ACTIVE_ROUTES_CACHE_KEY = 'active-routes';
const TWO_HOURS = 1000 * 60 * 60 * 2; // ms * s * m * h
export const ACTIVE_ROUTES_CACHE_OPTIONS = {
  cacheTime: TWO_HOURS,
  staleTime: TWO_HOURS,
};

const fetchActiveRoutes = async () => {
  const activeRoutesCursor = getActiveRoutesCursor();
  const activeRoutesLazy =
    await activeRoutesCursor.________getAll_CLOWNTOWN_LOTS_OF_READS();
  const fetchedRoutes = await Promise.all(
    activeRoutesLazy.map((route) => route.fetch())
  );
  return {
    activeRoutes: fetchedRoutes,
  } as FetchedActiveRoutes;
};
export const useActiveRoutes = () => {
  return useQuery(
    ACTIVE_ROUTES_CACHE_KEY,
    fetchActiveRoutes,
    ACTIVE_ROUTES_CACHE_OPTIONS
  );
};

export const useUserCacheMap = () => {
  return useQuery('user-cache', getUserCache, {
    select: buildUserCacheMap,
    staleTime: TWO_HOURS,
    cacheTime: TWO_HOURS,
  });
};

export const useUserSubstringMatcher = () => {
  return useQuery('user-cache', getUserCache, {
    select: buildUserSubstringMatcher,
    staleTime: TWO_HOURS,
    cacheTime: TWO_HOURS,
  });
};

export const useArchivedSubstringMatcher = () => {
  return useQuery('archived-routes', getArchivedRoutesSubstringMatcher, {
    staleTime: TWO_HOURS,
    cacheTime: TWO_HOURS,
  });
};

export type FetchedComment = {
  author: User;
  timestamp: Date;
  textContent: string;
  post: Post;

  likes: User[];

  commentObject: Comment;
};
export const fetchComment = async (comment: Comment) => {
  return {
    author: await comment.getAuthor(),
    timestamp: await comment.getTimestamp(),
    textContent: await comment.getTextContent(),
    post: await comment.getPost(),
    likes: await comment.getLikes(),
    commentObject: comment,
  } as FetchedComment;
};

export const buildCommentFetcher = (comment: Comment) => {
  return async () => comment.getData().then(() => fetchComment(comment));
};
