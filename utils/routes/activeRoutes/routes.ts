// Route metadata for the activeRoutes tab
import RouteView from '../../../components/route/RouteView';
import ActiveRoutes from '../../../screens/activeRoutes/ActiveRoutes';
import { Name } from './names';
import { routes as tabGlobalRoutes } from '../tabGlobal/routes';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'ActiveRoutes',
    component: ActiveRoutes,
  },
  {
    name: 'RouteView',
    component: RouteView,
  },
  ...tabGlobalRoutes,
];
