// Route metadata for the home tab
import HomeFeed from '../../../screens/home/HomeFeed';
import { routes as tabGlobalRoutes } from '../tabGlobal/routes';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'Home',
    component: HomeFeed,
  },
  ...tabGlobalRoutes,
];
