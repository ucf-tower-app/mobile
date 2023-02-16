// Route metadata for the likes tab
import Leaderboards from '../../../screens/leaderboards/Leaderboards';
import { routes as tabGlobalRoutes } from '../tabGlobal/routes';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'Leaderboards',
    component: Leaderboards,
  },
  ...tabGlobalRoutes,
];
