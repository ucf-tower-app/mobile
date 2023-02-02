import { getActiveRoutesCursor, getRouteById, getUserById } from '../xplat/api';
import {
  Cursor,
  Forum,
  Post,
  Route,
  RouteClassifier,
  RouteStatus,
  RouteType,
  User,
  UserStatus,
} from '../xplat/types/types';

export interface FetchedUser {
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
  postsCursor: Cursor<Post>;
  followersCursor: Cursor<User>;
  followingCursor: Cursor<User>;
  userObject: User;
}
export const buildUserFetcher = (user: User) => {
  return async () => {
    await user.getData(true);
    return {
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
  };
};
export const buildUserFetcherFromDocRefId = (docRefId: string) => {
  return buildUserFetcher(getUserById(docRefId));
};

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

  routeObject: Route;
};
const routeToFetchedRoute = async (route: Route) => {
  await route.getData();

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
    routeObject: route,
  } as FetchedRoute;
};
const DEFAULT_THUMBNAIL_TMP = 'https://wallpaperaccess.com/full/317501.jpg';
export const buildRouteFetcher = (route: Route) => {
  return async () => routeToFetchedRoute(route);
};
export const buildRouteFetcherFromDocRefId = (docRefId: string) => {
  return buildRouteFetcher(getRouteById(docRefId));
};

type FetchedPost = {
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
export const buildPostFetcher = (post: Post) => {
  return async () => {
    await post.getData();
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
  };
};

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
export const fetchActiveRoutes = async () => {
  const activeRoutesCursor = getActiveRoutesCursor();
  const activeRoutesLazy =
    await activeRoutesCursor.________getAll_CLOWNTOWN_LOTS_OF_READS();
  const fetchedRoutes = await Promise.all(
    activeRoutesLazy.map((route) => routeToFetchedRoute(route))
  );
  return {
    activeRoutes: fetchedRoutes,
  } as FetchedActiveRoutes;
};
