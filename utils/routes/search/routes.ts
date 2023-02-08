// Route metadata for the profile tab
import { Name } from './names';
import { routes as tabGlobalRoutes } from '../tabGlobal/routes';
import Search from '../../../screens/search/Search';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'Search',
    component: Search,
  },
  ...tabGlobalRoutes,
];
