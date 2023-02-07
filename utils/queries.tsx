import { useQuery } from 'react-query';
import {
  getActiveRoutesCursor,
  getArchivedRoutesSubstringMatcher,
  getUserSubstringMatcher,
  UserSearchResult,
  getPostById,
  getRouteById,
  getUserById,
} from '../xplat/api';
import {
  Forum,
  Post,
  Route,
  RouteClassifier,
  RouteStatus,
  RouteType,
  SubstringMatcher,
  User,
  UserStatus,
  Comment,
} from '../xplat/types';

export interface FetchedUser {
  docRefId: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  status: UserStatus;
  avatarUrl: string;
  followingList: User[];
  bestBoulder: RouteClassifier | undefined;
  bestToprope: RouteClassifier | undefined;
  totalSends: number;
  userObject: User;
}

async function fetchUser(user: User) {
  return {
    docRefId: user.docRef!.id,
    username: await user.getUsername(),
    email: await user.getEmail(),
    displayName: await user.getDisplayName(),
    bio: await user.getBio(),
    status: await user.getStatus(),
    avatarUrl: await user.getAvatarUrl(),
    followingList: user.following ?? [],
    bestBoulder: await user.getBestSendClassifier(RouteType.Boulder),
    bestToprope: await user.getBestSendClassifier(RouteType.Toprope),
    totalSends: await user.getTotalSends(),
    postsCursor: user.getPostsCursor(),
    followersCursor: user.getFollowersCursor(),
    followingCursor: await user.getFollowingCursor(),
    userObject: user,
  } as FetchedUser;
}
export function buildUserFetcher(user: User) {
  return async () => user.getData().then(() => fetchUser(user));
}
export function buildUserFetcherFromDocRefId(docRefId: string) {
  return buildUserFetcher(getUserById(docRefId));
}

export type FetchedRoute = {
  name: string;
  grade: string;
  likes: User[];
  stringifiedTags: string;
  status: RouteStatus;
  description: string;
  thumbnailUrl: string;

  setter: User | undefined;
  rope: number | undefined;

  forumDocRefID: string;
  routeObject: Route;
};
async function fetchRoute(route: Route) {
  const tags = await route.getTags();
  let tagStringBuilder = '';
  for (const tag of tags) {
    const tagName = await tag.getName();
    tagStringBuilder = tagStringBuilder + tagName + ', ';
  }
  // Remove trailing comma
  if (tagStringBuilder.length > 2 && tagStringBuilder.endsWith(', '))
    tagStringBuilder = tagStringBuilder.slice(0, -2);

  return {
    name: await route.getName(),
    grade: await route.getGradeDisplayString(),
    likes: await route.getLikes(),
    stringifiedTags: tagStringBuilder,
    status: await route.getStatus(),
    description: await route.getDescription(),
    thumbnailUrl: (await route.hasThumbnail())
      ? await route.getThumbnailUrl()
      : DEFAULT_THUMBNAIL_TMP,
    setter: (await route.hasSetter()) ? await route.getSetter() : undefined,
    rope: (await route.hasRope()) ? await route.getRope() : undefined,
    forumDocRefID: (await route.getForum()).docRef!.id,
    routeObject: route,
  } as FetchedRoute;
}
const DEFAULT_THUMBNAIL_TMP = 'https://wallpaperaccess.com/full/317501.jpg';
export function buildRouteFetcher(route: Route) {
  return async () => route.getData().then(() => fetchRoute(route));
}
export function buildRouteFetcherFromDocRefId(docRefId: string) {
  return buildRouteFetcher(getRouteById(docRefId));
}

export type FetchedPost = {
  author: User;
  timestamp: Date;
  textContent: string;
  likes: User[];
  imageContentUrls: string[];

  forum: Forum | undefined;
  videoContent:
    | {
        videoUrl: string;
        thumbnailUrl: string;
      }
    | undefined;

  postObject: Post;
};

export async function fetchPost(post: Post) {
  return {
    author: await post.getAuthor(),
    timestamp: await post.getTimestamp(),
    textContent: await post.getTextContent(),
    likes: await post.getLikes(),
    imageContentUrls: await post.getImageContentUrls(),
    forum: (await post.hasForum()) ? await post.getForum() : undefined,
    videoContent: (await post.hasVideoContent())
      ? {
          videoUrl: await post.getVideoUrl(),
          thumbnailUrl: await post.getVideoThumbnailUrl(),
        }
      : undefined,
    postObject: post,
  } as FetchedPost;
}

export function buildPostFetcher(post: Post) {
  return async () => post.getData().then(() => fetchPost(post));
}

export function buildPostFetcherFromDocRefId(docRefId: string) {
  return buildPostFetcher(getPostById(docRefId));
}

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
    activeRoutesLazy.map((route) => fetchRoute(route))
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

export type FetchedSearchSubstringMatchers = {
  userSubstringMatcher: SubstringMatcher<UserSearchResult[]>;
  archivedRoutesSubstringMatcher: SubstringMatcher<String>;
};
const SEARCH_SUBSTRING_MATCHER_CACHE_KEY = 'search-substring-matcher';
const fetchSearchSubstringMatchers = async () => {
  const userSubstringMatcher = await getUserSubstringMatcher();
  const archivedRoutesSubstringMatcher =
    await getArchivedRoutesSubstringMatcher();
  return {
    userSubstringMatcher: userSubstringMatcher,
    archivedRoutesSubstringMatcher: archivedRoutesSubstringMatcher,
  } as FetchedSearchSubstringMatchers;
};
export const useSearchSubstringMatchers = () => {
  return useQuery(
    SEARCH_SUBSTRING_MATCHER_CACHE_KEY,
    fetchSearchSubstringMatchers
  );
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
