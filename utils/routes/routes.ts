// Combine useful route datas, and map tabs to their routes
import { Name as ActiveRoutesName } from './activeRoutes/names';
import { routes as activeRoutesRoutes } from './activeRoutes/routes';
import { Name as HomeName } from './home/names';
import { routes as homeRoutes } from './home/routes';
import { Name as LeaderboardsName } from './leaderboards/names';
import { routes as leaderboardsRoutes } from './leaderboards/routes';
import { Name as ProfileName } from './profile/names';
import { routes as profileRoutes } from './profile/routes';
import { Name as SearchName } from './search/names';
import { routes as searchRoutes } from './search/routes';
import { Name as TabName } from './tabs/names';

export type RouteName =
  | HomeName
  | LeaderboardsName
  | SearchName
  | ProfileName
  | ActiveRoutesName;
export type Route = {
  name: RouteName;
  component: any;
};

type RouteData = {
  initialRouteName: RouteName;
  routes: Route[];
};
export const tabNameToRouteData: { [tabName in TabName]: RouteData } = {
  HomeTab: {
    initialRouteName: 'Home',
    routes: homeRoutes,
  },
  LeaderboardsTab: {
    initialRouteName: 'Leaderboards',
    routes: leaderboardsRoutes,
  },
  ActiveRoutesTab: {
    initialRouteName: 'ActiveRoutes',
    routes: activeRoutesRoutes,
  },
  SearchTab: {
    initialRouteName: 'Search',
    routes: searchRoutes,
  },
  ProfileTab: {
    initialRouteName: 'Profile',
    routes: profileRoutes,
  },
};
