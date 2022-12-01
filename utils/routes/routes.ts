// Combine useful route datas, and map tabs to their routes
import { routes as homeRoutes } from './home/routes';
import { routes as likesRoutes } from './likes/routes';
import { routes as profileRoutes } from './profile/routes';
import { routes as searchRoutes } from './search/routes';
import { routes as sandboxRoutes } from './sandbox/routes';
import { Name as HomeName } from './home/names';
import { Name as LikesName } from './likes/names';
import { Name as SearchName } from './search/names';
import { Name as ProfileName } from './profile/names';
import { Name as SandboxName } from './sandbox/names';
import { Name as TabName } from './tabs/names';

export type RouteName =
  | HomeName
  | LikesName
  | SearchName
  | ProfileName
  | SandboxName;
export type Route = {
  name: RouteName;
  component: any;
};

type RouteData = {
  initialRouteName: RouteName;
  routes: Array<Route>;
};
export const tabNameToRouteData: { [tabName in TabName]: RouteData } = {
  HomeTab: {
    initialRouteName: 'Home',
    routes: homeRoutes,
  },
  LikesTab: {
    initialRouteName: 'Likes',
    routes: likesRoutes,
  },
  SearchTab: {
    initialRouteName: 'Search',
    routes: searchRoutes,
  },
  ProfileTab: {
    initialRouteName: 'Profile',
    routes: profileRoutes,
  },
  SandboxTab: {
    initialRouteName: 'Sandbox',
    routes: sandboxRoutes,
  },
};
