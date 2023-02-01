import { getRouteById } from '../xplat/api';
import { Route, RouteStatus, User, UserStatus } from '../xplat/types/types';

type FetchedUser = {
  username: string;
  email: string;
  displayName: string;
  bio: string;
  status: UserStatus;
  avatarUrl: string;
};
export const buildUserFetcher = (user: User) => {
  return async () => {
    await user.getData();
    return {
      username: await user.getUsername(),
      email: await user.getEmail(),
      displayName: await user.getDisplayName(),
      bio: await user.getBio(),
      status: await user.getStatus(),
      avatarUrl: await user.getAvatarUrl(),
    } as FetchedUser;
  };
};

type FetchedRoute = {
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
const DEFAULT_THUMBNAIL_TMP = 'https://wallpaperaccess.com/full/317501.jpg';
export const buildRouteFetcher = (route: Route) => {
  return async () => {
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
};
export const buildRouteFetcherFromDocRefId = (docRefId: string) => {
  return buildRouteFetcher(getRouteById(docRefId));
};
